"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function AIAssistantPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Selamat datang ke Pembantu AI Jadual! Saya boleh membantu anda dengan soalan berkaitan penjadualan, cadangan untuk jadual yang lebih baik, atau penyelesaian konflik jadual. Apa yang boleh saya bantu hari ini?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const systemPrompt = `
        Anda adalah pembantu AI untuk sistem penjadualan sekolah. Anda membantu guru dan pentadbir dengan:
        1. Menjawab soalan tentang amalan terbaik penjadualan
        2. Memberikan cadangan untuk menyelesaikan konflik jadual
        3. Menawarkan strategi untuk mengoptimumkan jadual
        4. Membantu dengan masalah penjadualan khusus
        
        Sekolah ini mempunyai:
        - 5 hari (Ahad, Isnin, Selasa, Rabu, Khamis)
        - 12 slot masa setiap hari
        - 9 kelas (1 Al-Junaidi, 2 Al-Junaidi, 2 Al-Busiri, 3 Al-Junaidi, 3 Al-Busiri, 4 Al-Junaidi, 4 Al-Busiri, 5 Ma'wa, 6 Na'im)
        - 19 subjek (BM, BI, BA, SN, MT, SJ, RBT, PSV, PJK, HFZ, AQ, TH, FQ, TF, JW, KH, HD, SR, AK)
        - Acara khas: Perhimpunan pada Ahad (slot 1-2) dan Bacaan Yasin pada Khamis (slot 1)
        
        Berikan jawapan yang berguna, praktikal dan spesifik dalam Bahasa Melayu.
      `

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: userMessage,
        system: systemPrompt,
        temperature: 0.7,
      })

      setMessages((prev) => [...prev, { role: "assistant", content: text }])
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Gagal mendapatkan respons dari AI. Sila cuba lagi.",
        variant: "destructive",
      })
      console.error("Error getting AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Pembantu AI Jadual</h1>
      </div>

      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>Pembantu AI</CardTitle>
          <CardDescription>Tanya soalan tentang penjadualan atau minta bantuan dengan jadual anda</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-22rem)] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <Avatar className="h-8 w-8">
                      {message.role === "assistant" ? (
                        <>
                          <AvatarImage src="/logo.png" alt="AI" />
                          <AvatarFallback>AI</AvatarFallback>
                        </>
                      ) : (
                        <AvatarFallback>Anda</AvatarFallback>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <Textarea
              placeholder="Taip mesej anda di sini..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-10 flex-1"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

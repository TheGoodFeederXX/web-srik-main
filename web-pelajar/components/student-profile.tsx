"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Pencil } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"

interface StudentProfileProps {
  student: {
    id: string
    student_id: string
    name: string
    birth_cert_number?: string | null
    ic_number?: string | null
    birth_date?: string | null
    birth_place?: string | null
    address?: string | null
    mother_name?: string | null
    father_name?: string | null
    mother_ic_number?: string | null
    father_ic_number?: string | null
    mother_phone_number?: string | null
    father_phone_number?: string | null
    avatar_url?: string | null
  }
}

export function StudentProfile({ student }: StudentProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: student.name || "",
    birth_cert_number: student.birth_cert_number || "",
    ic_number: student.ic_number || "",
    birth_date: student.birth_date ? new Date(student.birth_date).toISOString().split("T")[0] : "",
    birth_place: student.birth_place || "",
    address: student.address || "",
    mother_name: student.mother_name || "",
    father_name: student.father_name || "",
    mother_ic_number: student.mother_ic_number || "",
    father_ic_number: student.father_ic_number || "",
    mother_phone_number: student.mother_phone_number || "",
    father_phone_number: student.father_phone_number || "",
  })
  const { toast } = useToast()
  const { supabase } = useSupabase()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const { error } = await supabase
        .from("students")
        .update({
          name: formData.name,
          birth_cert_number: formData.birth_cert_number,
          ic_number: formData.ic_number,
          birth_date: formData.birth_date,
          birth_place: formData.birth_place,
          address: formData.address,
          mother_name: formData.mother_name,
          father_name: formData.father_name,
          mother_ic_number: formData.mother_ic_number,
          father_ic_number: formData.father_ic_number,
          mother_phone_number: formData.mother_phone_number,
          father_phone_number: formData.father_phone_number,
          updated_at: new Date().toISOString(),
        })
        .eq("id", student.id)

      if (error) {
        throw error
      }

      toast({
        title: "Profil Dikemaskini",
        description: "Maklumat pelajar telah berjaya dikemaskini.",
      })
      setIsEditing(false)
    } catch (error) {
      toast({
        title: "Ralat",
        description: "Gagal mengemaskini maklumat pelajar.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profil Pelajar</CardTitle>
            <CardDescription>Maklumat peribadi pelajar {student.student_id}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            <Pencil className="h-4 w-4 mr-2" />
            {isEditing ? "Batal" : "Kemaskini"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center space-y-4 mb-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={student.avatar_url || ""} alt={student.name} />
                <AvatarFallback className="text-lg">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button variant="outline" size="sm" type="button">
                  Muat Naik Gambar
                </Button>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Penuh</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student_id">No. Pelajar</Label>
                <Input id="student_id" value={student.student_id} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_cert_number">No. Sijil Beranak</Label>
                <Input
                  id="birth_cert_number"
                  name="birth_cert_number"
                  value={formData.birth_cert_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ic_number">No. Kad Pengenalan</Label>
                <Input
                  id="ic_number"
                  name="ic_number"
                  value={formData.ic_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_date">Tarikh Lahir</Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birth_place">Tempat Lahir</Label>
                <Input
                  id="birth_place"
                  name="birth_place"
                  value={formData.birth_place}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Alamat Rumah</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_name">Nama Ibu</Label>
                <Input
                  id="mother_name"
                  name="mother_name"
                  value={formData.mother_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_name">Nama Bapa</Label>
                <Input
                  id="father_name"
                  name="father_name"
                  value={formData.father_name}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_ic_number">No. Kad Pengenalan Ibu</Label>
                <Input
                  id="mother_ic_number"
                  name="mother_ic_number"
                  value={formData.mother_ic_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_ic_number">No. Kad Pengenalan Bapa</Label>
                <Input
                  id="father_ic_number"
                  name="father_ic_number"
                  value={formData.father_ic_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mother_phone_number">No. Telefon Ibu</Label>
                <Input
                  id="mother_phone_number"
                  name="mother_phone_number"
                  value={formData.mother_phone_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="father_phone_number">No. Telefon Bapa</Label>
                <Input
                  id="father_phone_number"
                  name="father_phone_number"
                  value={formData.father_phone_number}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <CardFooter className="flex justify-end pt-6 px-0">
              <Button type="submit">Simpan Perubahan</Button>
            </CardFooter>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

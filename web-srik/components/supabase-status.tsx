"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function SupabaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("profiles").select("count").limit(1)
        
        if (error) {
          setStatus("error")
          setErrorMessage(error.message)
          return
        }
        
        setStatus("connected")
      } catch (e) {
        setStatus("error")
        setErrorMessage(e instanceof Error ? e.message : String(e))
      }
    }
    
    checkConnection()
  }, [])

  return (
    <div className="p-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Status</h2>
      {status === "loading" && <p className="text-gray-500">Checking connection...</p>}
      {status === "connected" && (
        <p className="text-green-600">
          ✓ Successfully connected to Supabase
        </p>
      )}
      {status === "error" && (
        <div>
          <p className="text-red-600">✗ Failed to connect to Supabase</p>
          {errorMessage && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
        </div>
      )}
    </div>
  )
}

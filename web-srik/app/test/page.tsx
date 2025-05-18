import SupabaseStatus from "@/components/supabase-status"

export default function TestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>
      <div className="max-w-md mx-auto">
        <SupabaseStatus />
      </div>
    </div>
  )
}

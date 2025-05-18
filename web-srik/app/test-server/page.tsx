import { checkSupabaseConnection } from "@/lib/supabase/actions"

export default async function TestServerPage() {
  const connection = await checkSupabaseConnection()
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Server Connection Test</h1>
      <div className="max-w-md mx-auto p-4 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Server-side Connection Status</h2>
        {connection.success ? (
          <p className="text-green-600">
            ✓ Successfully connected to Supabase from server component
          </p>
        ) : (
          <div>
            <p className="text-red-600">✗ Failed to connect to Supabase from server component</p>
            {connection.error && <p className="text-sm text-red-500 mt-1">{connection.error}</p>}
          </div>
        )}
        <pre className="mt-4 p-3 bg-gray-100 rounded text-xs overflow-auto">
          {JSON.stringify(connection, null, 2)}
        </pre>
      </div>
    </div>
  )
}

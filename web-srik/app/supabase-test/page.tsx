import { checkSupabaseConnection } from "@/lib/supabase/actions"
import SupabaseStatus from "@/components/supabase-status"
import { Suspense } from "react"

// Server side connection check
async function ServerConnectionCheck() {
  const connection = await checkSupabaseConnection()
  
  return (
    <div className="p-4 rounded-lg border mb-4">
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
    </div>
  )
}

export default function CombinedTestPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Supabase Connection Tests</h1>
      
      <div className="max-w-md mx-auto">
        {/* Server Component Test */}
        <Suspense fallback={<div className="p-4 border mb-4">Loading server connection status...</div>}>
          <ServerConnectionCheck />
        </Suspense>
        
        {/* Client Component Test */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">Client-side Connection</h2>
          <SupabaseStatus />
        </div>
      </div>
      
      <div className="max-w-md mx-auto mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-md font-semibold mb-2">How it works</h2>
        <p className="text-sm text-gray-700">
          This page demonstrates both client-side and server-side Supabase connections.
          The top component uses Server Actions to check the connection, while the bottom 
          component uses client-side React hooks to verify connectivity.
        </p>
      </div>
    </div>
  )
}

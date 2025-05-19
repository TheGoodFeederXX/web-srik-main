# web-srik
Laman web rasmi Sekolah Rendah Islam Al-Khairiah

## Architecture

This is a monorepo containing several Next.js applications:

- `web-srik` - Main school website
- `web-jadual` - Timetable management application
- `web-pelajar` - Student management application
- `web-guru` - Teacher management application

## Supabase Integration

All web applications use Supabase for authentication and data storage. We've standardized the implementation using the newer `@supabase/ssr` pattern and removed the deprecated `@supabase/auth-helpers-nextjs` package from all projects. The implementation is as follows:

### Client-side Implementation
Each app has a standardized client implementation in `lib/supabase/client.ts`:

```typescript
"use client"

import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server-side Implementation
Each app has a standardized server implementation in `lib/supabase/server.ts`:

```typescript
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const createClient = () => {
  const cookieStore = cookies()
    return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name, options) => {
          cookieStore.delete({ name, ...options })
        }
      }
    }
  )
}
```

### Admin/Service Role Implementation
Each app also has a server-side admin implementation for operations requiring elevated privileges in `lib/supabase/admin.ts`:

```typescript
"use server"

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createAdminClient() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name, options) => {
          cookieStore.delete({ name, ...options })
        }
      }
    }
  )
}
```

# Script to standardize Supabase implementation across all web applications
Write-Host "Starting Supabase implementation standardization..." -ForegroundColor Green

# Define base path
$basePath = "c:\Users\admin\Documents\code\web-srik-main\web-srik-main"

# Define project paths
$webApps = @("web-srik", "web-jadual", "web-pelajar", "web-guru")

# Create client.ts content
$clientContent = @'
"use client"

import { createBrowserClient } from "@supabase/ssr"

export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
'@

# Create server.ts content
$serverContent = @'
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
'@

# Loop through each web application
foreach ($app in $webApps) {
    $appPath = Join-Path $basePath $app
    Write-Host "Processing $app at $appPath" -ForegroundColor Cyan
    
    # Create supabase directory if it doesn't exist
    $supabasePath = Join-Path $appPath "lib\supabase"
    if (-not (Test-Path $supabasePath)) {
        New-Item -Path $supabasePath -ItemType Directory -Force
        Write-Host "Created Supabase directory at $supabasePath" -ForegroundColor Yellow
    }
    
    # Create/update client.ts
    $clientPath = Join-Path $supabasePath "client.ts"
    Set-Content -Path $clientPath -Value $clientContent -Force
    Write-Host "Updated $clientPath" -ForegroundColor Green
    
    # Create/update server.ts
    $serverPath = Join-Path $supabasePath "server.ts"
    Set-Content -Path $serverPath -Value $serverContent -Force
    Write-Host "Updated $serverPath" -ForegroundColor Green

    # Step 2: Update references in application code    # Handle server-side references
    $serverFiles = Get-ChildItem -Path $appPath -Recurse -Include "*.tsx","*.ts" -Exclude "**/node_modules/**" -ErrorAction SilentlyContinue | 
                   Select-String -Pattern "createServerComponentClient|createServerClient" -ErrorAction SilentlyContinue | 
                   Select-Object Path -Unique
    
    foreach ($file in $serverFiles) {
        $content = Get-Content -Path $file.Path -Raw
        
        # Replace the imports
        $newContent = $content -replace 'import \{ createServerComponentClient \} from "@supabase/auth-helpers-nextjs"', 'import { createClient } from "@/lib/supabase/server"'
        $newContent = $newContent -replace 'import \{ createServerClient \} from "@supabase/ssr"', 'import { createClient } from "@/lib/supabase/server"'
        
        # Replace the usage
        $newContent = $newContent -replace 'const supabase = createServerComponentClient\(\{ cookies \}\)', 'const supabase = createClient()'
        $newContent = $newContent -replace 'const supabase = createServerComponentClient<.*>\(\{ cookies \}\)', 'const supabase = createClient()'
        
        # Handle more complex createServerClient usage with passing parameters
        if ($newContent -match "createServerClient\(process\.env\.NEXT_PUBLIC_SUPABASE_URL!,\s*process\.env\.NEXT_PUBLIC_SUPABASE_ANON_KEY!,") {
            Write-Host "Found complex createServerClient pattern in $($file.Path) - keeping as is" -ForegroundColor Yellow
        }
        else {
            $newContent = $newContent -replace 'const supabase = createServerClient\(.*\)', 'const supabase = createClient()'
        }
        
        # Write back to the file
        if ($content -ne $newContent) {
            Set-Content -Path $file.Path -Value $newContent
            Write-Host "Updated server references in: $($file.Path)" -ForegroundColor Green
        }
    }
      # Handle client-side references
    $clientFiles = Get-ChildItem -Path $appPath -Recurse -Include "*.tsx","*.ts" -Exclude "**/node_modules/**" -ErrorAction SilentlyContinue | 
                   Select-String -Pattern "createClientComponentClient|createBrowserClient" -ErrorAction SilentlyContinue | 
                   Select-Object Path -Unique
    
    foreach ($file in $clientFiles) {
        $content = Get-Content -Path $file.Path -Raw
        
        # Check if file already has 'use client' directive
        $hasUseClient = $content -match '"use client"'
        
        # Replace the imports
        $newContent = $content -replace 'import \{ createClientComponentClient \} from "@supabase/auth-helpers-nextjs"', 'import { createClient } from "@/lib/supabase/client"'
        $newContent = $newContent -replace 'import \{ createBrowserClient \} from "@supabase/ssr"', 'import { createClient } from "@/lib/supabase/client"'
        
        # Replace the usage
        $newContent = $newContent -replace 'const supabase = createClientComponentClient\(\)', 'const supabase = createClient()'
        $newContent = $newContent -replace 'const supabase = createClientComponentClient<.*>\(\)', 'const supabase = createClient()'
        $newContent = $newContent -replace 'const supabase = createBrowserClient\(.*\)', 'const supabase = createClient()'
        
        # Add 'use client' directive if needed
        if (-not $hasUseClient -and ($newContent -ne $content)) {
            $newContent = '"use client"' + "`n`n" + $newContent
        }
        
        # Write back to the file
        if ($content -ne $newContent) {
            Set-Content -Path $file.Path -Value $newContent
            Write-Host "Updated client references in: $($file.Path)" -ForegroundColor Green
        }
    }    # Handle direct supabase-js imports
    $directImports = Get-ChildItem -Path $appPath -Recurse -Include "*.tsx","*.ts" -Exclude "**/node_modules/**" -ErrorAction SilentlyContinue | 
                     Select-String -Pattern "import.*from.*@supabase/supabase-js" -ErrorAction SilentlyContinue | 
                     Select-Object Path -Unique
    
    foreach ($file in $directImports) {
        $content = Get-Content -Path $file.Path -Raw
        
        # Check if this is a server or client file
        $isServerFile = $file.Path -match "server\.ts$" -or $file.Path -match "actions\.ts$" -or $content -match "use server"
        $isClientFile = (-not $isServerFile) -and ($content -match "use client")
        
        if ($isClientFile) {
            $import = 'import { createClient } from "@/lib/supabase/client"'
        }
        elseif ($isServerFile) {
            $import = 'import { createClient } from "@/lib/supabase/server"'
        }
        else {
            # Skip files that aren't clearly server or client
            Write-Host "Skipping file where context is unclear: $($file.Path)" -ForegroundColor Yellow
            continue
        }
        
        # Replace the direct supabase client creation
        $newContent = $content -replace 'import \{ createClient \} from "@supabase/supabase-js"', $import
        $newContent = $newContent -replace 'const supabase = createClient\(.*\)', 'const supabase = createClient()'
        
        # Write back to the file
        if ($content -ne $newContent) {
            Set-Content -Path $file.Path -Value $newContent
            Write-Host "Updated direct supabase-js references in: $($file.Path)" -ForegroundColor Green
        }
    }
}

# Update the special case of supabase.ts in web-pelajar
$pelajarSupabaseFile = Join-Path $basePath "web-pelajar\lib\supabase.ts"
if (Test-Path $pelajarSupabaseFile) {
    $content = Get-Content -Path $pelajarSupabaseFile -Raw
    
    $newContent = @'
// This file exists for backward compatibility
// Please use lib/supabase/client.ts or lib/supabase/server.ts instead
import { createClient as createClientFn } from "./supabase/client"

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Legacy export - use the new pattern instead
export const supabase = createClientFn()
'@
    
    Set-Content -Path $pelajarSupabaseFile -Value $newContent -Force
    Write-Host "Updated legacy supabase.ts in web-pelajar" -ForegroundColor Green
}

# Final check for any remaining legacy Supabase references
Write-Host "Checking for any remaining legacy Supabase references..." -ForegroundColor Yellow
$patterns = @(
    "createServerComponentClient",
    "createClientComponentClient", 
    "createBrowserClient",
    "@supabase/auth-helpers-nextjs"
)

foreach ($app in $webApps) {
    $appPath = Join-Path $basePath $app
    foreach ($pattern in $patterns) {
        $remainingFiles = Get-ChildItem -Path $appPath -Recurse -Include "*.tsx","*.ts" -Exclude "**/node_modules/**","**/dist/**","**/.next/**" -ErrorAction SilentlyContinue | 
                          Select-String -Pattern $pattern -ErrorAction SilentlyContinue | 
                          Select-Object Path -Unique
        
        if ($remainingFiles) {
            Write-Host "$pattern still found in these files in $app" -ForegroundColor Yellow
            foreach ($file in $remainingFiles) {
                Write-Host "  - $($file.Path)" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host "Supabase implementation standardization complete!" -ForegroundColor Green

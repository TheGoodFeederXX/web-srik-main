#!/usr/bin/env pwsh
# Script to validate Supabase implementation after migration
Write-Host "Validating Supabase implementation across all web applications..." -ForegroundColor Cyan

# Define patterns to search for
$deprecatedPatterns = @(
    "createClientComponentClient",
    "createServerComponentClient",
    "@supabase/auth-helpers-nextjs",
    "import { supabase } from",
    "const supabase = new SupabaseClient"
)

$webApps = @("web-srik", "web-jadual", "web-pelajar", "web-guru")

$issuesFound = $false

foreach ($app in $webApps) {
    Write-Host "`nChecking $app..." -ForegroundColor Green

    # Check for presence of required files
    $clientPath = Join-Path $app "lib\supabase\client.ts"
    $serverPath = Join-Path $app "lib\supabase\server.ts"

    if (-not (Test-Path $clientPath)) {
        Write-Host "  [ERROR] Missing client.ts file: $clientPath" -ForegroundColor Red
        $issuesFound = $true
    } else {
        # Verify client.ts content
        $clientContent = Get-Content -Path $clientPath -Raw
        if ($clientContent -notmatch "import\s+{\s+createBrowserClient\s+}\s+from\s+['\"]@supabase\/ssr['\"]") {
            Write-Host "  [ERROR] client.ts is not using createBrowserClient from @supabase/ssr" -ForegroundColor Red
            $issuesFound = $true
        } else {
            Write-Host "  [OK] client.ts is properly implemented" -ForegroundColor Green
        }
    }

    if (-not (Test-Path $serverPath)) {
        Write-Host "  [ERROR] Missing server.ts file: $serverPath" -ForegroundColor Red
        $issuesFound = $true
    } else {
        # Verify server.ts content
        $serverContent = Get-Content -Path $serverPath -Raw
        if ($serverContent -notmatch "import\s+{\s+createServerClient\s+}\s+from\s+['\"]@supabase\/ssr['\"]") {
            Write-Host "  [ERROR] server.ts is not using createServerClient from @supabase/ssr" -ForegroundColor Red
            $issuesFound = $true
        } else {
            Write-Host "  [OK] server.ts is properly implemented" -ForegroundColor Green
        }
    }

    # Check for deprecated patterns
    Write-Host "`n  Checking for deprecated Supabase patterns..." -ForegroundColor Yellow
    foreach ($pattern in $deprecatedPatterns) {
        $matches = Select-String -Path "$app\**\*.{ts,tsx}" -Pattern $pattern -Exclude "**/node_modules/**" -ErrorAction SilentlyContinue
        if ($matches.Count -gt 0) {
            Write-Host "  [WARNING] Found $($matches.Count) occurrence(s) of '$pattern':" -ForegroundColor Yellow
            foreach ($match in $matches) {
                Write-Host "    - $($match.Path):$($match.LineNumber)" -ForegroundColor Yellow
            }
            $issuesFound = $true
        }
    }
}

if (-not $issuesFound) {
    Write-Host "`n✅ All applications have been properly migrated to the @supabase/ssr pattern!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ There are still some issues to fix. Please review the output above." -ForegroundColor Yellow
}

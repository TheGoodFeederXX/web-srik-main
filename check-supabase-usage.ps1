#!/usr/bin/env pwsh
# Script to check Supabase implementation across all web applications
Write-Host "Checking Supabase usage across all web applications..." -ForegroundColor Cyan

# Define patterns to search for
$patterns = @(
    "createServerClient(process.env.NEXT_PUBLIC",
    "createClient()",
    "import { createBrowserClient } from",
    "import { createServerClient } from",
    "import { createClient } from '@/lib/supabase"
)

$webApps = @("web-srik", "web-jadual", "web-pelajar", "web-guru")

foreach ($app in $webApps) {
    Write-Host "`nChecking $app..." -ForegroundColor Green

    foreach ($pattern in $patterns) {
        $matches = Select-String -Path (Join-Path $app "**\*.{ts,tsx}") -Pattern $pattern -Exclude "**/node_modules/**" -ErrorAction SilentlyContinue
        Write-Host "  Pattern '$pattern': $($matches.Count) occurrences" -ForegroundColor Yellow
        
        foreach ($match in $matches) {
            Write-Host "    $($match.Path):$($match.LineNumber): $($match.Line.Trim())" -ForegroundColor Gray
        }
    }
}

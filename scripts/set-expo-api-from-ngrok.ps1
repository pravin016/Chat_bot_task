# Reads the HTTPS URL from a running ngrok agent (http://127.0.0.1:4040)
# and sets EXPO_PUBLIC_API_BASE_URL in the repo root .env.
# Usage: start backend + run `ngrok http 8000`, then:
#   powershell -ExecutionPolicy Bypass -File scripts/set-expo-api-from-ngrok.ps1

$ErrorActionPreference = "Stop"
# Repo root (parent of /scripts)
$root = Split-Path $PSScriptRoot -Parent
if (-not (Test-Path (Join-Path $root "package.json"))) {
  Write-Error "Run this script from the Chat_bot_task repo (package.json not found at $root)."
  exit 1
}

try {
  $tunnels = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 3
} catch {
  Write-Error "ngrok does not appear to be running (could not reach http://127.0.0.1:4040). Start it with: ngrok http 8000"
  exit 1
}

$httpsTunnel = $tunnels.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1
$https = $httpsTunnel.public_url
if (-not $https) {
  Write-Error "No HTTPS tunnel found. Check ngrok is forwarding port 8000."
  exit 1
}

$envPath = Join-Path $root ".env"
if (-not (Test-Path $envPath)) {
  Copy-Item (Join-Path $root ".env.example") $envPath
}

$content = Get-Content $envPath -Raw
if ($content -match "(?m)^EXPO_PUBLIC_API_BASE_URL=.*") {
  $content = $content -replace "(?m)^EXPO_PUBLIC_API_BASE_URL=.*", "EXPO_PUBLIC_API_BASE_URL=$https"
} else {
  $content = "EXPO_PUBLIC_API_BASE_URL=$https`r`n" + $content
}
[System.IO.File]::WriteAllText($envPath, $content.TrimEnd() + "`r`n")
Write-Host "Updated .env: EXPO_PUBLIC_API_BASE_URL=$https"

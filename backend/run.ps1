if (-not (Test-Path .venv)) {
  python -m venv .venv
}
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt

# Check if running in production mode (no reload)
$prodMode = $args[0] -eq "prod"

if ($prodMode) {
  # Production: multiple workers for better concurrency
  Write-Host "Starting in PRODUCTION mode (4 workers, no reload)..."
  python -m uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
} else {
  # Development: single worker with reload
  Write-Host "Starting in DEVELOPMENT mode (reload enabled)..."
  python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
}


# Start Backend and Frontend Together
Write-Host "🚀 Starting Chat Bot Development Environment..." -ForegroundColor Green
Write-Host ""

# Start Backend in Background
Write-Host "📦 Starting Backend Server..." -ForegroundColor Cyan
$backendProcess = Start-Process -WindowStyle Normal -PassThru `
  -FilePath "powershell" `
  -ArgumentList "-NoExit", "-Command", "cd backend; .\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload"

$backendPID = $backendProcess.Id
Write-Host "✅ Backend started (PID: $backendPID)" -ForegroundColor Green

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "📱 Starting Frontend (Expo)..." -ForegroundColor Cyan
npm start

# Cleanup on exit
Write-Host ""
Write-Host "🛑 Stopping backend..." -ForegroundColor Yellow
Stop-Process -Id $backendPID -ErrorAction SilentlyContinue
Write-Host "✅ Development environment stopped" -ForegroundColor Green

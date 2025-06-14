# Start Healthcare System

Write-Host "Starting Healthcare System..." -ForegroundColor Green

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Set-Location -Path "healthcare"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm install; npm run dev"
Set-Location -Path ".."

# Function to start a Go service
function Start-GoService {
    param (
        [string]$ServiceName,
        [string]$Port
    )
    Write-Host "Starting $ServiceName..." -ForegroundColor Yellow
    Set-Location -Path $ServiceName
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "go mod download; go run main.go"
    Set-Location -Path ".."
}

# Start all backend services
Start-GoService -ServiceName "auth-service" -Port "8081"
Start-GoService -ServiceName "user-service" -Port "8082"
Start-GoService -ServiceName "appointment-service" -Port "8083"
Start-GoService -ServiceName "medical-record-service" -Port "8084"
Start-GoService -ServiceName "billing-service" -Port "8085"
Start-GoService -ServiceName "notification-service" -Port "8086"
Start-GoService -ServiceName "doctor-service" -Port "8087"

Write-Host "`nAll services started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Auth Service: http://localhost:8081" -ForegroundColor Cyan
Write-Host "User Service: http://localhost:8082" -ForegroundColor Cyan
Write-Host "Appointment Service: http://localhost:8083" -ForegroundColor Cyan
Write-Host "Medical Record Service: http://localhost:8084" -ForegroundColor Cyan
Write-Host "Billing Service: http://localhost:8085" -ForegroundColor Cyan
Write-Host "Notification Service: http://localhost:8086" -ForegroundColor Cyan
Write-Host "Doctor Service: http://localhost:8087" -ForegroundColor Cyan

Write-Host "`nPress any key to stop all services..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 
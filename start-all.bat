@echo off
echo Starting Healthcare System...

REM Start Frontend
echo Starting Frontend...
cd healthcare
start cmd /k "npm install && npm run dev"
cd ..

REM Start Backend Services
echo Starting Backend Services...

REM Auth Service
cd auth-service
start cmd /k "go mod download && go run main.go"
cd ..

REM User Service
cd user-service
start cmd /k "go mod download && go run main.go"
cd ..

REM Appointment Service
cd appointment-service
start cmd /k "go mod download && go run main.go"
cd ..

REM Medical Record Service
cd medical-record-service
start cmd /k "go mod download && go run main.go"
cd ..

REM Billing Service
cd billing-service
start cmd /k "go mod download && go run main.go"
cd ..

REM Notification Service
cd notification-service
start cmd /k "go mod download && go run main.go"
cd ..

REM Doctor Service
cd doctor-service
start cmd /k "go mod download && go run main.go"
cd ..

echo All services started!
echo Frontend: http://localhost:3000
echo Auth Service: http://localhost:8081
echo User Service: http://localhost:8082
echo Appointment Service: http://localhost:8083
echo Medical Record Service: http://localhost:8084
echo Billing Service: http://localhost:8085
echo Notification Service: http://localhost:8086
echo Doctor Service: http://localhost:8087

REM Wait for user input before closing
pause 
#!/bin/bash

# Start the frontend
echo "Starting frontend..."
cd healthcare
npm install
npm run dev &
cd ..

# Function to start a service
start_service() {
    local service=$1
    local port=$2
    echo "Starting $service on port $port..."
    cd $service
    go mod download
    go run main.go &
    cd ..
}

# Start all backend services
start_service "auth-service" 8081
start_service "user-service" 8082
start_service "appointment-service" 8083
start_service "medical-record-service" 8084
start_service "billing-service" 8085
start_service "notification-service" 8086
start_service "doctor-service" 8087

echo "All services started!"
echo "Frontend: http://localhost:3000"
echo "Auth Service: http://localhost:8081"
echo "User Service: http://localhost:8082"
echo "Appointment Service: http://localhost:8083"
echo "Medical Record Service: http://localhost:8084"
echo "Billing Service: http://localhost:8085"
echo "Notification Service: http://localhost:8086"
echo "Doctor Service: http://localhost:8087"

# Wait for all background processes
wait 
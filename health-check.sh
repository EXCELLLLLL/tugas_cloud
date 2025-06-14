#!/bin/bash

# Function to check service health
check_service() {
    local service=$1
    local port=$2
    local url="http://localhost:$port/health"
    
    echo -n "Checking $service (port $port)... "
    if curl -s -f "$url" > /dev/null; then
        echo -e "\e[32mOK\e[0m"
        return 0
    else
        echo -e "\e[31mFAILED\e[0m"
        return 1
    fi
}

# Function to check frontend
check_frontend() {
    local url="http://localhost:3000"
    
    echo -n "Checking frontend... "
    if curl -s -f "$url" > /dev/null; then
        echo -e "\e[32mOK\e[0m"
        return 0
    else
        echo -e "\e[31mFAILED\e[0m"
        return 1
    fi
}

echo "Starting health check..."
echo "======================"

# Check frontend
check_frontend

# Check all backend services
check_service "auth-service" 8081
check_service "user-service" 8082
check_service "appointment-service" 8083
check_service "medical-record-service" 8084
check_service "billing-service" 8085
check_service "notification-service" 8086
check_service "doctor-service" 8087

echo "======================"
echo "Health check completed!" 
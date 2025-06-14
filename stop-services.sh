#!/bin/bash

# Function to stop service by port
stop_service() {
    local port=$1
    local pid=$(lsof -ti:$port)
    
    if [ ! -z "$pid" ]; then
        echo "Stopping service on port $port (PID: $pid)..."
        kill $pid
        sleep 2
        if [ -z "$(lsof -ti:$port)" ]; then
            echo -e "\e[32mStopped\e[0m"
        else
            echo -e "\e[31mFailed to stop, forcing...\e[0m"
            kill -9 $pid
        fi
    else
        echo "No service running on port $port"
    fi
}

echo "Stopping all services..."
echo "======================"

# Stop frontend (Next.js)
stop_service 3000

# Stop all backend services
stop_service 8081  # auth-service
stop_service 8082  # user-service
stop_service 8083  # appointment-service
stop_service 8084  # medical-record-service
stop_service 8085  # billing-service
stop_service 8086  # notification-service
stop_service 8087  # doctor-service

echo "======================"
echo "All services stopped!" 
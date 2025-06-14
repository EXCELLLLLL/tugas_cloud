#!/bin/bash

# List of services
services=(
    "auth-service"
    "user-service"
    "appointment-service"
    "medical-record-service"
    "billing-service"
    "notification-service"
    "doctor-service"
)

# Copy health.go to each service
for service in "${services[@]}"; do
    echo "Copying health.go to $service..."
    cp health.go "$service/health.go"
done

echo "Health check files copied successfully!" 
#!/bin/bash

# List of services to build
services=(
  "user-service"
  "auth-service"
  "appointment-service"
  "billing-service"
  "doctor-service"
  "medical-record-service"
  "notification-service"
)

# Loop through each service and build the Docker image
for service in "${services[@]}"; do
  echo "Building $service..."
  cd "$service" || exit
  docker build -t "$service:latest" .
  cd ..
  echo "$service built successfully."
done

echo "All services built successfully." 
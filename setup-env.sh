#!/bin/bash

# Common environment variables
DB_URL="host=localhost user=postgres password=postgres dbname=healthcare port=5432 sslmode=disable"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Function to create .env file for a service
create_env_file() {
    local service=$1
    local port=$2
    local env_file="$service/.env"
    
    echo "Creating .env file for $service..."
    cat > "$env_file" << EOF
PORT=$port
DATABASE_URL=$DB_URL
JWT_SECRET=$JWT_SECRET
EOF
    echo "Created $env_file"
}

# Create .env files for all services
create_env_file "auth-service" 8081
create_env_file "user-service" 8082
create_env_file "appointment-service" 8083
create_env_file "medical-record-service" 8084
create_env_file "billing-service" 8085
create_env_file "notification-service" 8086
create_env_file "doctor-service" 8087

# Create frontend .env file
echo "Creating frontend .env file..."
cat > "healthcare/.env" << EOF
NEXT_PUBLIC_API_URL=http://localhost:8081
NEXT_PUBLIC_AUTH_URL=http://localhost:8081
NEXT_PUBLIC_USER_URL=http://localhost:8082
NEXT_PUBLIC_APPOINTMENT_URL=http://localhost:8083
NEXT_PUBLIC_MEDICAL_RECORD_URL=http://localhost:8084
NEXT_PUBLIC_BILLING_URL=http://localhost:8085
NEXT_PUBLIC_NOTIFICATION_URL=http://localhost:8086
NEXT_PUBLIC_DOCTOR_URL=http://localhost:8087
EOF

echo "Environment files created successfully!" 
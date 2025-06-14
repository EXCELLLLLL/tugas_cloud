#!/bin/bash

# Database configuration
DB_NAME="healthcare"
DB_USER="postgres"
DB_PASSWORD="2201"
DB_HOST="localhost"
DB_PORT="5432"

echo "Initializing database..."

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
    echo "PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Create database if it doesn't exist
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME"

# Run initialization script
echo "Running database initialization script..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f db/init.sql

# Update environment variables for all services
echo "Updating environment variables..."

# Function to update service .env file
update_service_env() {
    local service=$1
    local port=$2
    local env_file="$service/.env"
    
    echo "Updating $env_file..."
    cat > "$env_file" << EOF
PORT=$port
DATABASE_URL=host=$DB_HOST user=$DB_USER password=$DB_PASSWORD dbname=$DB_NAME port=$DB_PORT sslmode=disable
JWT_SECRET=your-super-secret-jwt-key-change-in-production
EOF
}

# Update all service .env files
update_service_env "auth-service" 8081
update_service_env "user-service" 8082
update_service_env "appointment-service" 8083
update_service_env "medical-record-service" 8084
update_service_env "billing-service" 8085
update_service_env "notification-service" 8086
update_service_env "doctor-service" 8087

# Update frontend .env
echo "Updating frontend environment..."
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

echo "Database initialization completed!"
echo "You can now start the services using ./start-services.sh" 
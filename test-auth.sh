#!/bin/bash

# Test health endpoint
echo "Testing health endpoint..."
curl -v http://localhost:8080/health

echo -e "\n\nTesting login endpoint..."
curl -v -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

echo -e "\n\nTesting register endpoint..."
curl -v -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }' 
# User Service

This is the user management microservice for the healthcare system. It handles user registration, authentication, and profile management.

## Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Profile management
- Admin functionality

## Prerequisites

- Go 1.21 or higher
- PostgreSQL database
- Environment variables (see Configuration section)

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=8081
DATABASE_URL=host=localhost user=postgres password=postgres dbname=healthcare port=5432 sslmode=disable
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## API Endpoints

### Public Routes

#### Register User

- **POST** `/api/users/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "role": "patient",
    "phone": "1234567890",
    "address": "123 Main St"
  }
  ```
- **Response**: JWT token and success message

#### Login

- **POST** `/api/users/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**: JWT token and success message

### Protected Routes (Requires Authentication)

#### Get Profile

- **GET** `/api/users/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User profile data

#### Update Profile

- **PUT** `/api/users/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "phone": "1234567890",
    "address": "123 Main St"
  }
  ```
- **Response**: Success message

#### Change Password

- **PUT** `/api/users/change-password`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "current_password": "oldpassword",
    "new_password": "newpassword"
  }
  ```
- **Response**: Success message

### Admin Routes (Requires Admin Role)

#### Get All Users

- **GET** `/api/admin/users`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: List of all users

#### Update User Role

- **PUT** `/api/admin/users/:id/role`
- **Headers**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "role": "doctor"
  }
  ```
- **Response**: Success message

## Security Notes

1. Always use HTTPS in production
2. Change the JWT_SECRET in production
3. Implement rate limiting
4. Add request validation
5. Use secure password policies
6. Implement account lockout after failed attempts

## Development

1. Install dependencies:

```bash
   go mod download
```

2. Run the service:

```bash
   go run main.go
```

3. Run tests:

```bash
   go test ./...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

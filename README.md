# Healthcare System

A comprehensive healthcare management system with a Next.js frontend and Go microservices backend.

## System Architecture

The system consists of the following components:

1. Frontend (Next.js)

   - Located in the `healthcare` directory
   - Modern UI with Tailwind CSS
   - Handles user interactions and displays data

2. Backend Microservices (Go)
   - User Service (Port 8081)
   - Appointment Service (Port 8082)
   - Medical Record Service (Port 8083)
   - Billing Service (Port 8084)
   - Notification Service (Port 8085)
   - Doctor Service (Port 8086)

## Prerequisites

- Go 1.21 or higher
- Node.js 18 or higher
- PostgreSQL
- Make sure you have the following environment variables set in each service's `.env` file:

```env
PORT=<service_port>
DATABASE_URL=host=localhost user=postgres password=postgres dbname=healthcare port=5432 sslmode=disable
JWT_SECRET=your-secret-key-here
```

## Setup Instructions

1. Database Setup:

```sql
CREATE DATABASE healthcare;
```

2. Frontend Setup:

```bash
cd healthcare
npm install
npm run dev
```

3. Backend Services Setup:
   For each service (user-service, appointment-service, etc.):

```bash
cd <service-directory>
go mod download
go run main.go
```

## API Endpoints

### User Service (8081)

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile/:id` - Get user profile

### Appointment Service (8082)

- `POST /api/appointments` - Create appointment
- `GET /api/appointments/patient/:patientId` - Get patient's appointments
- `GET /api/appointments/doctor/:doctorId` - Get doctor's appointments
- `PUT /api/appointments/:id` - Update appointment
- `PUT /api/appointments/:id/cancel` - Cancel appointment

### Medical Record Service (8083)

- `POST /api/records` - Create medical record
- `GET /api/records/patient/:patientId` - Get patient's records
- `GET /api/records/doctor/:doctorId` - Get doctor's records
- `GET /api/records/:id` - Get specific record
- `PUT /api/records/:id` - Update record
- `POST /api/records/:id/attachments` - Add attachment

### Billing Service (8084)

- `POST /api/bills` - Create bill
- `GET /api/bills/patient/:patientId` - Get patient's bills
- `GET /api/bills/doctor/:doctorId` - Get doctor's bills
- `GET /api/bills/:id` - Get specific bill
- `PUT /api/bills/:id/status` - Update bill status
- `POST /api/bills/:id/items` - Add bill item

### Notification Service (8085)

- `POST /api/notifications` - Create notification
- `GET /api/notifications/user/:userId` - Get user's notifications
- `GET /api/notifications/user/:userId/unread/count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/user/:userId/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Doctor Service (8086)

- `POST /api/doctors` - Create doctor profile
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `PUT /api/doctors/:id` - Update doctor profile
- `POST /api/doctors/:id/education` - Add education
- `POST /api/doctors/:id/availability` - Update availability
- `GET /api/doctors/specialization/:specialization` - Get by specialization

## Security Notes

- Implement proper password hashing in production
- Add JWT authentication middleware
- Use HTTPS in production
- Implement rate limiting
- Add input validation
- Set up proper CORS configuration
- Use environment variables for sensitive data

## Development

1. Start the frontend:

```bash
cd healthcare
npm run dev
```

2. Start all backend services (in separate terminals):

```bash
cd user-service && go run main.go
cd appointment-service && go run main.go
cd medical-record-service && go run main.go
cd billing-service && go run main.go
cd notification-service && go run main.go
cd doctor-service && go run main.go
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

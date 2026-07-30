# CourtFlow — API Reference

Base URL: `/api`

## Authentication

All authenticated endpoints require:
```
Authorization: Bearer <access_token>
```

### Auth Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login user |
| POST | `/api/auth/forgot-password` | No | Send password reset email |
| POST | `/api/auth/reset-password/:token` | No | Reset password with token |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | Yes | Logout user |

### User Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/users/me` | Yes | Any | Get current user profile |
| PATCH | `/api/users/me` | Yes | Any | Update current user profile |
| GET | `/api/users/me/bookings` | Yes | Any | Get current user's bookings |
| GET | `/api/users/me/saved-clubs` | Yes | Player | Get saved clubs |
| POST | `/api/users/me/saved-clubs/:clubId` | Yes | Player | Save a club |
| DELETE | `/api/users/me/saved-clubs/:clubId` | Yes | Player | Remove saved club |

### Club Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/clubs` | No | - | List all clubs |
| GET | `/api/clubs/:id` | No | - | Get club details |
| POST | `/api/clubs` | Yes | Owner, Admin | Create club |
| PATCH | `/api/clubs/:id` | Yes | Owner, Admin | Update club |
| DELETE | `/api/clubs/:id` | Yes | Owner, Admin | Soft-delete club |
| GET | `/api/clubs/:id/courts` | No | - | List club's courts |
| GET | `/api/clubs/:id/stats` | Yes | Owner, Staff | Club stats |

### Court Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/courts/:id` | No | - | Get court details |
| POST | `/api/clubs/:clubId/courts` | Yes | Owner, Admin | Create court |
| PATCH | `/api/courts/:id` | Yes | Owner, Admin | Update court |
| DELETE | `/api/courts/:id` | Yes | Owner, Admin | Soft-delete court |
| GET | `/api/courts/:id/availability` | No | - | Get court availability |

### Booking Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/bookings` | Yes | Player | Create booking |
| GET | `/api/bookings/:id` | Yes | Any | Get booking details |
| PATCH | `/api/bookings/:id/cancel` | Yes | Player, Staff | Cancel booking |
| PATCH | `/api/bookings/:id/reschedule` | Yes | Player | Reschedule booking |
| GET | `/api/bookings` | Yes | Owner, Staff | List bookings (filtered) |
| GET | `/api/bookings/check-conflict` | No | - | Check time conflict |

### Payment Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/payments/:id` | Yes | Any | Get payment details |
| POST | `/api/payments/:bookingId/pay` | Yes | Player | Process payment |
| POST | `/api/payments/:id/refund` | Yes | Admin | Refund payment |

### Notification Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/notifications` | Yes | Any | List user's notifications |
| PATCH | `/api/notifications/:id/read` | Yes | Any | Mark notification as read |
| PATCH | `/api/notifications/read-all` | Yes | Any | Mark all as read |

### Admin Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/admin/users` | Yes | Super Admin | List all users |
| PATCH | `/api/admin/users/:id/suspend` | Yes | Super Admin | Suspend user |
| GET | `/api/admin/clubs` | Yes | Super Admin | List all clubs |
| GET | `/api/admin/analytics` | Yes | Super Admin | Platform analytics |

### Dashboard Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/dashboard/owner` | Yes | Owner | Owner dashboard data |
| GET | `/api/dashboard/player` | Yes | Player | Player dashboard data |

## Error Responses

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable error message",
    "details": []
  }
}
```

## Pagination

List endpoints support:
```
?page=1&limit=20&sort=-createdAt
```

Response:
```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```


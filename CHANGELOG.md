

### Added
- **Dashboard Module** — Owner and player dashboards:
  - Owner: today's bookings, weekly revenue, active players, court utilization rate
  - Player: upcoming bookings, booking history, total bookings, saved clubs
  - Aggregated data via MongoDB aggregation pipeline
  - Role-protected dashboard endpoints
- **Notification Module** — In-app notification system:
  - Notification model with booking event types (confirmed, cancelled, reminder, rescheduled)
  - Notification CRUD with pagination
  - Unread count endpoint
  - Mark single/all as read
  - Delete notification
  - Statics for creating booking notifications
- **Payment Module** — Payment status tracking:
  - Payment model (method enum: gcash, maya, stripe, cash, bank_transfer)
  - Status lifecycle: unpaid → paid → refunded
  - Process payment endpoint (creates Payment + updates Booking)
  - Get payment details + refund endpoint (admin only)
  - Statics for markAsPaid / markAsRefunded
- **Admin Module** — Platform administration:
  - List users with search, role, status filters (paginated)
  - Suspend/activate user accounts
  - List all clubs with search (paginated)
  - Platform analytics: total users, clubs, courts, bookings, revenue, users by role, clubs by status

### Architecture
- **9 modules** fully implemented: auth, users, clubs, courts, bookings, payments, notifications, dashboard, admin
- **40+ API endpoints** live across all modules
- **8 Mongoose models** with proper indexes
- Complete middleware pipeline: helmet → rate limiter → auth → role → validation → controller → service → error handler
- All routes registered and live on port 5001

### Security
- Admin routes restricted to super_admin role
- Dashboard routes role-based (owner for owner, player for player)
- Payment refund restricted to admin

## [0.4.0] — 2025-05-20

### Added
- **Notifications Module** — In-app notification system:
  - Notification model with 9 event types
  - CRUD operations with pagination
  - Unread count, mark as read, read all
  - Static helpers for booking notification creation
- **Dashboard Module** — Owner and player dashboards:
  - Owner dashboard with today's bookings, weekly revenue, active players, court utilization
  - Player dashboard with upcoming bookings, history, saved clubs
- **Payments Module** — Payment tracking:
  - Payment model with method enum, status lifecycle
  - Process payment, get payment, refund
- **Admin Module** — Platform administration:
  - List users with search/filters, suspend/activate
  - List all clubs, platform analytics

## [0.3.0] — 2025-05-20

### Added
- **Clubs Module** — Full club management:
  - Club model with operating hours, settings, soft delete
  - CRUD with owner authorization
  - Club stats endpoint
- **Courts Module** — Complete court management:
  - Court model with surfaces, features, hourly rate, maintenance
  - Time slot generation, availability endpoint
- **Booking Engine** — Core domain logic:
  - Booking model with status lifecycle
  - Conflict detection via overlapping time ranges
  - Create, cancel, reschedule with authorization
  - Paginated listing, upcoming/history endpoints
  - Public conflict check

## [0.2.0] — 2025-05-20

### Added
- **Auth Module** — Complete authentication system with:
  - Email-based registration with password confirmation
  - Email + password login
  - JWT access tokens (15min) + refresh tokens (7 days)
  - Forgot password flow with reset tokens
  - Password reset with expiry
  - Email verification scaffolded
  - Logout (single device + all devices)
  - Token refresh endpoint
  - Rate limiting on auth endpoints (10 req/15min)
- **Users Module** — Profile management:
  - Get/update profile
  - Saved clubs (add/remove/list)
- **Middleware Layer**:
  - Zod input validation middleware
  - Centralized error handler
  - Role-based authorization
  - Rate limiter
  - Helmet security headers
- **Shared Layer**:
  - Constants (no magic strings)
  - Custom error classes
  - Response helpers

### Security
- Passwords never returned in API responses
- Refresh token rotation
- Rate limiting on all endpoints

## [0.1.0] — 2025-05-20

### Added
- Project initialized: CourtFlow
- Architecture document, roadmap, API reference, database design
- Folder scaffolded for feature-based architecture

### Legacy
- Existing codebase preserved at root level
- Migration staged to avoid breaking changes


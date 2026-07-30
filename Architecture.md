# CourtFlow — Architecture

## Overview

CourtFlow is a niche SaaS platform for pickleball club management. It enables club owners to manage courts, bookings, and payments while providing players with an intuitive booking experience.

## Philosophy

- **Feature-first architecture**: Each business domain is a self-contained module.
- **Thin controllers, fat services**: Business logic lives in services.
- **No magic strings**: Constants and enums everywhere.
- **Security by default**: Helmet, rate limiting, input validation, JWT with refresh.

## Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | React 19, Vite, Tailwind  |
| Backend     | Node.js, Express 5        |
| Database    | MongoDB, Mongoose 8       |
| Auth        | JWT (access + refresh)    |
| Real-time   | Socket.io                 |
| Media       | Cloudinary                |
| UI Library  | Material-UI 7, Lucide Icons |

## Folder Structure

```
Booking/
├── backend/
│   ├── src/
│   │   ├── config/            # DB, Cloudinary, env config
│   │   ├── middleware/         # auth, errorHandler, rateLimiter, validate
│   │   ├── shared/            # constants, utils, types
│   │   ├── modules/
│   │   │   ├── auth/          # controllers, routes, services, models, validators
│   │   │   ├── users/
│   │   │   ├── clubs/
│   │   │   ├── courts/
│   │   │   ├── bookings/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   ├── reports/
│   │   │   └── admin/
│   │   └── server.js
│   ├── tests/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable primitives (Button, Card, Modal)
│   │   │   ├── layout/        # Sidebar, Navbar, Footer
│   │   │   └── forms/         # Form inputs, validators
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── booking/
│   │   │   ├── club/
│   │   │   ├── court/
│   │   │   ├── calendar/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   ├── services/          # Axios instances
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── types/
│   │   └── assets/
│   └── package.json
└── docs/
```

## Architecture Principles

1. **Modules are independent** — can be developed, tested, and deployed separately.
2. **Shared code lives in `shared/`** — constants, utilities, and base classes.
3. **Validation at the boundary** — Zod schemas validate all API inputs.
4. **Error handling is centralized** — a global error middleware catches all exceptions.
5. **No circular dependencies** — modules never import from each other directly.


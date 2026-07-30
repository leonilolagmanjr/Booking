# 🏓 CourtFlow — Pickleball Club Management SaaS

[![React](https://img.shields.io/badge/React-19.x-brightgreen)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Express-5.x-blue)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-green)](https://mongodb.com)
[![Status](https://img.shields.io/badge/Status-Migration%20in%20Progress-yellow)]()

> **From general-purpose social platform to niche pickleball club management.**

CourtFlow replaces Messenger chats, spreadsheets, and manual scheduling with an intuitive booking management platform for pickleball clubs.

## 🎯 Product Vision

A booking management platform for pickleball clubs that's intuitive enough for a non-technical club owner to use.

**Primary Users:**
- 🏢 Club Owners — manage courts, staff, and revenue
- 👥 Staff — handle bookings and check-ins
- 🏓 Players — book courts effortlessly

## ✨ MVP Features

- **🔐 Authentication**: Login, Register, Forgot Password, JWT with refresh tokens
- **📊 Dashboard**: Owner (bookings, revenue, utilization) & Player (upcoming, history)
- **🏟️ Club Management**: Create/manage clubs with operating hours
- **🎾 Court Management**: Add/edit/disable courts, indoor/outdoor, maintenance scheduling
- **📅 Booking Engine**: Calendar view, time slots, conflict detection, confirm/cancel/reschedule
- **💳 Payments**: Status tracking (GCash, Maya, Stripe — future)
- **🔔 Notifications**: Email + in-app for booking confirmation, reminders, cancellations

## 🛠 Tech Stack

| Frontend | Backend | Database | Infrastructure |
|----------|---------|----------|----------------|
| React 19 + Vite | Node.js + Express 5 | MongoDB + Mongoose 8 | Cloudinary |
| Tailwind CSS + MUI 7 | Socket.io | | JWT + bcrypt |
| React Router 6 | Zod validation | | Helmet + Rate Limiting |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas (or local MongoDB)
- Cloudinary account

### Legacy Backend (existing app)
```bash
cd backend
npm install
npm start   # runs on port 5000
```

### CourtFlow Backend (new architecture)
```bash
cd backend
npm install
node src/server.js   # runs on port 5001
```

### Frontend
```bash
cd frontend-vite
npm install
npm run dev   # runs on port 5173
```

## 📁 Project Structure

```
Booking/
├── backend/
│   ├── src/                        # NEW: CourtFlow architecture
│   │   ├── config/                 # DB, env config
│   │   ├── middleware/             # auth, errorHandler, validate
│   │   ├── shared/                 # constants, errors, response helpers
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── clubs/
│   │   │   ├── courts/
│   │   │   ├── bookings/
│   │   │   ├── payments/
│   │   │   ├── notifications/
│   │   │   ├── admin/
│   │   │   └── dashboard/
│   │   └── server.js               # CourtFlow entry (port 5001)
│   ├── models/                     # LEGACY: existing models
│   ├── controllers/                # LEGACY: existing controllers
│   ├── routes/                     # LEGACY: existing routes
│   ├── services/                   # LEGACY: existing services
│   └── server.js                   # LEGACY entry (port 5000)
├── frontend-vite/                  # LEGACY: existing frontend
├── frontend/                       # NEW: future CourtFlow frontend
├── Architecture.md                 # System architecture
├── API.md                          # API reference
├── Database.md                     # Database design
├── Roadmap.md                      # Product roadmap
└── CHANGELOG.md                    # Change log
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [Architecture.md](./Architecture.md) | System architecture & design philosophy |
| [API.md](./API.md) | Full API reference |
| [Database.md](./Database.md) | Database schema & indexes |
| [Roadmap.md](./Roadmap.md) | Product roadmap & milestones |
| [CHANGELOG.md](./CHANGELOG.md) | Change log |

## 🏗️ Migration Status

Current phase: **Stage 0 — Preparation** ✅

- [x] Codebase audit completed
- [x] Architecture designed
- [x] Documentation scaffolded
- [x] Feature-based folder structure created
- [x] Foundation layer (constants, errors, helpers)
- [ ] Phase 1: Auth refactor (in progress)

## 📄 License

MIT

# MediRoute Backend

MediRoute is a hospital operations management system backend built with **Node.js**, **Express.js**, **Prisma ORM**, **PostgreSQL**, **Redis**, and **Socket.IO**.

---

## 🚀 Features

- Authentication (JWT-based)
- Role-based Access Control (Admin, Doctor, Nurse)
- User management (CRUD + self-service profile updates)
- Department management with capacity thresholds
- Shift scheduling (manual + auto-assign with BullMQ worker)
- Patient flow tracking (status transitions)
- Alerts & Notifications (with WebSocket broadcasts)
- Real-time updates via **Socket.IO**
- Analytics & Reports (CSV/PDF exports)
- Event Logs & Auditing
- Unit & Integration testing with Jest + Supertest

---

## 📦 Tech Stack

- **Backend Framework**: Express.js + TypeScript
- **Database**: PostgreSQL (via Prisma ORM)
- **Cache/Queue**: Redis (BullMQ)
- **Real-time**: Socket.IO
- **Auth**: JWT (access + refresh)
- **Testing**: Jest + Supertest
- **Logging**: Pino
- **Deployment**: Docker + GitHub Actions (planned)

---

## 🛠️ Setup Instructions

### 1. Clone repository

```bash
git clone https://github.com/kingieX/MediRoute.git
cd server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mediroute?schema=public
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_URL=redis://localhost:6379
```

### 4. Run migrations

```bash
npx prisma migrate dev
```

### 5. Seed admin user

```bash
npx ts-node prisma/seed.ts
```

### 6. Start development server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🧪 Testing

Run unit + integration tests:

```bash
npm test
```

---

## 📊 API Documentation

See: [API_GUIDE.md](./docs/API_GUIDE.md)

---

## 🔌 Real-Time Events

Socket.IO events supported:

- `patient_update`
- `shift_update`
- `staff_location_update`

---

## 📦 Deployment (Planned)

- Dockerized services (API + DB + Redis)
- GitHub Actions for CI/CD
- Cloud hosting (Render / Aiven / Fly.io)

---

## 👨‍💻 Contributing

1. Fork the repo
2. Create feature branch (`git checkout -b feature/xyz`)
3. Commit changes (`git commit -m "feat: xyz"`)
4. Push branch (`git push origin feature/xyz`)
5. Create Pull Request

---

## 📄 License

MIT © 2025 MediRoute Team

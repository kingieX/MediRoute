# MediRoute API Guide

Base URL (local):

```
http://localhost:5000
```

Authentication:

- Most routes require **Bearer Token** in headers:
  ```
  Authorization: Bearer <access_token>
  ```

---

## 1. 🔑 Auth Routes

### `POST /auth/login`

**Body**

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response**

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { "id": "...", "email": "...", "role": "ADMIN" }
}
```

---

### `POST /auth/refresh`

**Body**

```json
{ "refreshToken": "..." }
```

---

### `GET /auth/me`

**Headers**

```
Authorization: Bearer <accessToken>
```

---

## 2. 👤 User Routes

### `GET /users` (Admin only)

Supports **pagination, filters, sorting**  
Example:

```
/users?page=1&limit=10&role=DOCTOR&sortBy=createdAt&order=desc
```

### `POST /users` (Admin only)

```json
{
  "email": "doctor@example.com",
  "password": "securePass123",
  "role": "DOCTOR"
}
```

### `GET /users/:id` (Admin or self)

### `PUT /users/:id` (Admin or self)

### `DELETE /users/:id` (Admin only)

### `POST /users/:id/location`

```json
{ "location": "ER" }
```

Emits `staff_location_update` event via WebSocket.

---

## 3. 🏥 Department Routes

### `GET /departments`

List all departments

### `POST /departments` (Admin only)

```json
{ "name": "ICU", "capacity": 20 }
```

### `GET /departments/:id`

### `PUT /departments/:id`

### `DELETE /departments/:id`

---

## 4. 📅 Shift Routes

### `GET /shifts`

### `POST /shifts` (Admin only)

```json
{
  "userId": "...",
  "departmentId": "...",
  "startTime": "2025-09-01T08:00:00Z",
  "endTime": "2025-09-01T16:00:00Z"
}
```

### `POST /shifts/auto-assign`

(Admin only, uses BullMQ worker)

```json
{
  "departmentId": "...",
  "date": "2025-09-01T08:00:00Z"
}
```

### `GET /shifts/:id`

### `PUT /shifts/:id`

### `DELETE /shifts/:id`

---

## 5. 🧑‍🤝‍🧑 Patient Routes

### `GET /patients`

### `POST /patients`

```json
{
  "name": "John Doe",
  "departmentId": "...",
  "status": "WAITING"
}
```

### `GET /patients/:id`

### `PUT /patients/:id`

(Status transitions: `WAITING → IN_TREATMENT → DISCHARGED`)

```json
{ "status": "IN_TREATMENT" }
```

### `DELETE /patients/:id`

---

## 6. 🚨 Alert Routes

### `POST /alerts`

```json
{
  "type": "capacity_warning",
  "message": "ER is overloaded"
}
```

### `GET /alerts`

### `PUT /alerts/:id/resolve`

---

## 7. 📊 Analytics Routes

### `GET /analytics/staff-utilization?start=2025-09-01&end=2025-09-07`

### `GET /analytics/patient-load?start=2025-09-01&end=2025-09-07`

### `GET /analytics/trends?days=30`

👉 All analytics endpoints support export:

```
?export=csv   or   ?export=pdf
```

---

## 8. 📝 Event Logs

### `GET /logs`

(Admin only, supports filters by `userId`, `action`, date range)

---

## 9. 🔌 Real-Time (Socket.IO)

### Connect client

```js
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// Listen to events
socket.on('patient_update', (data) => console.log('Patient Update:', data));
socket.on('shift_update', (data) => console.log('Shift Update:', data));
socket.on('staff_location_update', (data) => console.log('Location:', data));
```

### Events emitted

- `patient_update` → on patient create/update
- `shift_update` → on shift creation/assignment
- `staff_location_update` → on staff location changes

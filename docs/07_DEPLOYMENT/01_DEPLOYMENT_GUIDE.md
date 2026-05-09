# Deployment Guide

## 1. Overview

The Whisk & Wonder backend is deployed using Railway and connected to a Supabase PostgreSQL database.

The project uses:

- NestJS
- Prisma ORM
- PostgreSQL
- Railway
- Supabase
- Swagger API Documentation

---

## 2. Technology Stack

| Technology | Purpose            |
| ---------- | ------------------ |
| NestJS     | Backend framework  |
| Prisma     | ORM                |
| PostgreSQL | Database           |
| Supabase   | Database hosting   |
| Railway    | Backend deployment |
| Swagger    | API documentation  |

---

## 3. Local Development Setup

### Install Dependencies

```bash
npm install
```

---

### Generate Prisma Client

```bash
npx prisma generate
```

---

### Run Database Migration

```bash
npx prisma migrate dev
```

---

### Start Development Server

```bash
npm run start:dev
```

---

## 4. Production Deployment

### Railway Deployment

Backend deployment platform:

```txt
Railway
```

### Deployment Steps

```txt
1. Connect GitHub repository
2. Configure environment variables
3. Install dependencies
4. Generate Prisma client
5. Build NestJS application
6. Deploy application
```

---

## 5. Production Build Command

```bash
npm run build
```

---

## 6. Production Start Command

```bash
npm run start:prod
```

---

## 7. Database Hosting

Database hosting platform:

```txt
Supabase PostgreSQL
```

The backend connects to Supabase using Prisma ORM.

---

## 8. Swagger Documentation

Swagger API documentation is available through:

```txt
/api
```

Example local URL:

```txt
http://localhost:3000/api
```

Example production URL:

```txt
https://your-production-domain/api
```

Swagger is used to:

- Test API endpoints
- Inspect request body structure
- Validate responses
- Verify authorization requirements

---

## 9. Deployment Goals

The deployment setup is designed to:

- Support public backend access
- Support frontend integration
- Support production-like backend deployment
- Provide scalable API access
- Maintain database connectivity

---

## 10. Expected Result

After successful deployment:

```txt
✔ Backend API is publicly accessible
✔ Database connection is active
✔ Swagger documentation is accessible
✔ JWT authentication works correctly
✔ CRUD endpoints function properly
✔ Frontend can connect to backend API
```

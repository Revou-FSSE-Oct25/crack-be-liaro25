# Whisk & Wonder Backend API

A RESTful backend API for an elegant afternoon tea reservation and ordering platform built with NestJS, Prisma, PostgreSQL, and JWT authentication.

---

## Features

- JWT Authentication
- Role-Based Authorization
- Reservation System
- Table Management
- Menu & Package Management
- Order System
- Payment System
- User Profile Management
- DTO Validation
- Swagger API Documentation

---

## Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL / Supabase
- JWT Authentication
- Swagger / OpenAPI

---

## Project Structure

```txt
src/
├── auth/
├── users/
├── reservations/
├── tables/
├── menus/
├── orders/
├── payments/
├── prisma/
└── common/

docs/
├── 00_PROJECT_OVERVIEW
├── 01_FOUNDATION
├── 02_AUTH_SYSTEM
├── 03_RESERVATION_SYSTEM
├── 04_ADMIN_SYSTEM
├── 05_COMMUNICATION_SYSTEM
├── 06_ADVANCED_FEATURES
├── 07_TESTING_SECURITY
└── 08_DEPLOYMENT
```

---

## Installation

```bash
npm install
```

---

## Environment Variables

Create `.env` file:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
PORT=
```

---

## Run Application

Development:

```bash
npm run start:dev
```

Production:

```bash
npm run build
npm run start:prod
```

---

## Prisma Commands

Generate Prisma Client:

```bash
npx prisma generate
```

Run Migration:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

## Swagger API Documentation

Swagger documentation is available at:

```txt
/api
```

Example:

```txt
http://localhost:3000/api
```

---

## Authentication

This API uses JWT authentication.

Example protected route header:

```http
Authorization: Bearer <access_token>
```

---

## Main Modules

| Module       | Description                    |
| ------------ | ------------------------------ |
| Auth         | Authentication & authorization |
| Users        | User profile management        |
| Reservations | Reservation system             |
| Tables       | Table management               |
| Menus        | Menu & package management      |
| Orders       | Customer ordering system       |
| Payments     | Payment management             |

---

## Project Goal

This project demonstrates:

- RESTful API development
- Modular backend architecture
- JWT authentication
- Role-based authorization
- DTO validation
- Relational database management
- Swagger API documentation
- Production-oriented backend structure

---

## Documentation

Detailed documentation is available inside:

```txt
/docs
```

---

## Current Status

Backend core system completed.

Current focus:

- API documentation finalization
- Testing & security hardening
- Deployment optimization
- Portfolio-ready documentation

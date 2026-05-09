# Whisk & Wonder Backend API

## 1. Project Overview

Whisk & Wonder Backend API is a RESTful backend system developed for an afternoon tea cafe reservation and ordering platform.

Whisk & Wonder is an elegant cafe concept that offers curated afternoon tea experiences, desserts, beverages, and reservation-based dining sessions in a cozy and aesthetic environment.

The backend system is designed to support customer reservations, table management, menu and package management, order processing, payment handling, user authentication, and admin operations.

This project aims to demonstrate scalable backend architecture, secure authentication, relational database management, and professional API documentation practices using NestJS and PostgreSQL.

---

## 2. Cafe Concept

Whisk & Wonder focuses on a reservation-based afternoon tea experience.

Customers can:

- Reserve tables for a fixed dining session
- Select afternoon tea packages
- Order desserts and beverages
- Manage reservations through their account
- Experience a structured 2-hour dining session system

The reservation system helps maintain table availability, dining flow, and customer experience quality.

---

## 3. Reservation Concept

Each reservation session is limited to 2 hours.

Example reservation flow:

```txt
12:00 PM → 2:00 PM
2:30 PM → 4:30 PM
5:00 PM → 7:00 PM
```

The system manages:

- Reservation time slots
- Table availability
- Guest capacity
- Reservation conflicts
- Reservation status updates

This helps prevent overlapping reservations and supports efficient cafe operations.

## 4. Tech Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL / Supabase
- JWT Authentication
- Swagger / OpenAPI
- DTO Validation

## 5. Main Features

### Authentication & Authorization

- User registration
- User login
- JWT authentication
- Protected routes
- Role-based authorization

### Reservation System

- Create reservation
- View reservation details
- Update reservation
- Cancel reservation
- Manage reservation status
- Validate reservation slots

### Table Management

- Manage cafe tables
- Configure seating capacity
- Track table availability

### Menu & Package Management

- Manage afternoon tea packages
- Manage desserts and beverages
- Configure pricing and categories

### Order & Payment System

- Create customer orders
- Manage payment records
- Track payment status

### User Management

- User profile management
- Reservation history access

## 6. Backend Architecture Summary

This project follows a modular backend architecture using NestJS.

Example structure:

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
```

Architecture flow:

Controller → Service → Prisma → PostgreSQL

## 7. Authentication Method

This API uses JWT authentication.

Protected routes require:

```http
Authorization: Bearer <access_token>
```

Admin routes require admin role authorization.

---

## 8. API Documentation

Swagger API documentation is available through:

```txt
/api
```

Example:

```txt
http://localhost:3000/api
```

Swagger is used to:

- Test endpoints
- Inspect request body structure
- Validate responses
- Verify authorization requirements

---

## 9. Project Goal

This backend project demonstrates the ability to:

- Build RESTful APIs
- Design modular backend architecture
- Implement secure authentication
- Manage relational databases
- Handle reservation business logic
- Create scalable backend systems
- Produce professional API documentation

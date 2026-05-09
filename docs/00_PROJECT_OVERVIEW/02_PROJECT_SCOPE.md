# Project Scope

## 1. Project Summary

Whisk & Wonder Backend API is a backend service developed for an afternoon tea cafe reservation and ordering platform.

The system is designed to manage customer reservations, dining sessions, table availability, menu packages, customer orders, payments, and administrative operations through a modular RESTful API architecture.

The backend focuses on secure authentication, structured reservation management, scalable module organization, and frontend integration readiness.

---

## 2. Project Objectives

The main objectives of this project are:

- Build a scalable RESTful backend API
- Implement secure JWT authentication
- Apply role-based authorization
- Manage relational database systems
- Handle reservation business logic
- Support frontend integration
- Create production-oriented backend architecture
- Provide complete API documentation

---

## 3. Business Scope

Whisk & Wonder operates as a reservation-based afternoon tea cafe.

The backend system supports:

- Fixed dining session reservations
- Table capacity management
- Afternoon tea package management
- Customer ordering system
- Reservation status management
- Payment tracking
- Admin operational management

The system is designed to help maintain organized reservation flow and improve operational efficiency.

---

## 4. Reservation Scope

The reservation system includes:

- Reservation creation
- Reservation updates
- Reservation cancellation
- Reservation status tracking
- Guest count validation
- Reservation slot validation
- Table availability validation
- Reservation conflict prevention

### Dining Session Rules

Each reservation session is limited to 2 hours.

Example dining sessions:

```txt
12:00 PM → 2:00 PM
2:30 PM → 4:30 PM
5:00 PM → 7:00 PM
```

The backend validates reservation availability based on:

- Reservation time
- Existing reservations
- Table capacity
- Reservation status

---

## 5. Authentication & Authorization Scope

The authentication system includes:

- User registration
- User login
- JWT token generation
- Protected route access
- User role validation

### Supported Roles

| Role     | Description                  |
| -------- | ---------------------------- |
| CUSTOMER | Regular customer access      |
| ADMIN    | Administrative system access |

Admin users are authorized to manage operational resources such as reservations, menus, tables, and payments.

---

## 6. User Management Scope

The user management system includes:

- User profile retrieval
- User profile updates
- Reservation ownership validation
- Access to personal reservation history

The backend ensures that users can only access their own protected resources.

---

## 7. Table Management Scope

The table management system includes:

- Create table records
- Update table information
- Delete table records
- Configure seating capacity
- Track table availability

This module supports reservation allocation and operational planning.

---

## 8. Menu & Package Scope

The menu system includes:

- Afternoon tea package management
- Dessert management
- Beverage management
- Category organization
- Price configuration

The backend supports dynamic menu updates through admin operations.

---

## 9. Order & Payment Scope

### Order System

The order system includes:

- Create customer orders
- Manage ordered items
- Track order status
- Retrieve order details

### Payment System

The payment system includes:

- Create payment records
- Update payment status
- Link payments with customer orders
- Payment tracking management

---

## 10. Technical Scope

### Backend Stack

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL / Supabase
- JWT Authentication
- Swagger / OpenAPI

### Backend Architecture

The project uses modular architecture:

```txt
Controller → Service → Prisma → Database
```

### API Style

- RESTful API architecture
- JSON request/response format
- DTO validation
- Role-protected endpoints

---

## 11. Documentation Scope

The project documentation includes:

- API overview
- Authentication flow
- Request/response examples
- Validation documentation
- Authorization documentation
- Module documentation
- Deployment documentation
- Testing & security notes

---

## 12. Out of Scope

The following features are currently outside the project scope:

- Real-time chat system
- Online payment gateway integration
- Multi-branch management
- Mobile application
- Third-party reservation platform integration
- Loyalty membership system
- AI recommendation system

These features may be considered for future development.

---

## 13. Current Project Status

Completed systems:

- Authentication system
- Role-based authorization
- Reservation system
- Table management
- Menu & package management
- Order system
- Payment system
- User profile management
- DTO validation
- Swagger documentation

Current focus:

- Documentation finalization
- Testing improvements
- Security hardening
- Deployment optimization
- Portfolio-ready project preparation

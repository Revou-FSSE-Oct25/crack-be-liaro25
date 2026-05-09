# Security Checklist

## 1. Security Overview

Whisk & Wonder Backend API implements several security practices to protect user data, secure API access, and maintain backend system integrity.

The backend applies authentication, authorization, validation, and protected route mechanisms using NestJS and JWT authentication.

---

## 2. Authentication Security

### JWT Authentication

The backend uses JWT (JSON Web Token) authentication for protected API access.

Protected endpoints require:

```http
Authorization: Bearer <access_token>
```

JWT tokens are generated after successful login.

---

## 3. Password Security

### Password Hashing

User passwords are never stored as plain text.

Passwords are hashed using:

```txt
bcrypt
```

This helps protect user credentials from database exposure risks.

---

## 4. Route Protection

### Protected Endpoints

Sensitive endpoints require authentication guards.

Example protected resources:

- User profile endpoints
- Reservation management
- Order management
- Payment management
- Admin operations

The backend validates JWT tokens before allowing access.

---

## 5. Role-Based Authorization

The backend uses role-based authorization to restrict admin-only operations.

### Supported Roles

| Role     | Access Level               |
| -------- | -------------------------- |
| CUSTOMER | Customer-level access      |
| ADMIN    | Full administrative access |

Admin-only endpoints are protected using authorization guards.

Example admin operations:

- Manage tables
- Manage menus
- Manage reservations
- Manage payments
- Access operational management endpoints

---

## 6. DTO Validation

The backend uses DTO validation with `class-validator`.

Validation helps prevent:

- Invalid request body submission
- Missing required fields
- Incorrect data types
- Malformed API requests

Example validations:

```ts
@IsEmail()
email: string;

@IsNotEmpty()
name: string;
```

---

## 7. Input Validation

The system validates incoming request data before processing business logic.

Validation includes:

- Required fields
- Email format validation
- Numeric validation
- String validation
- Enum validation
- Date validation

This helps reduce invalid database operations and API misuse.

---

## 8. Database Security

### Prisma ORM

The backend uses Prisma ORM for database access.

Benefits include:

- Structured database queries
- Reduced raw SQL usage
- Safer database operations
- Relational integrity support

---

## 9. Environment Variable Protection

Sensitive credentials are stored inside environment variables.

Example:

```env
DATABASE_URL=
DIRECT_URL=
JWT_SECRET=
```

Sensitive credentials are excluded from version control using `.gitignore`.

---

## 10. Error Handling Security

The backend avoids exposing sensitive internal system information through API responses.

Example protected behavior:

- Database internals are not exposed
- Stack traces are not returned to users
- Unauthorized requests return controlled responses

---

## 11. Reservation Security

The reservation system includes validation to prevent:

- Invalid reservation slots
- Reservation conflicts
- Invalid guest capacity
- Unauthorized reservation access

Users can only access their own reservation data unless they have admin privileges.

---

## 12. API Documentation Security

Swagger documentation is used for development and testing purposes.

Sensitive operations still require:

- JWT authentication
- Valid authorization
- Role validation

Swagger does not bypass backend security guards.

---

## 13. Current Security Implementation Status

### Completed

- JWT authentication
- Password hashing
- DTO validation
- Route protection
- Role-based authorization
- Protected admin routes
- Environment variable protection
- Ownership validation

### Planned Improvements

- Rate limiting
- Refresh token implementation
- API throttling
- Logging & monitoring
- Security audit improvements
- HTTPS production hardening

---

## 14. Security Goal

The security implementation aims to:

- Protect user credentials
- Secure protected API routes
- Prevent unauthorized access
- Maintain data integrity
- Support scalable backend architecture
- Prepare the backend for production-oriented practices

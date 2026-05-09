# JWT Flow

## 1. Overview

Whisk & Wonder Backend API uses JWT (JSON Web Token) authentication to secure protected API routes.

JWT authentication allows the backend to verify user identity without storing session data on the server.

---

## 2. JWT Authentication Purpose

JWT is used to:

- Authenticate users
- Protect private API routes
- Support role-based authorization
- Maintain stateless authentication
- Secure user access to backend resources

---

## 3. Authentication Flow Summary

```txt
Register
→ Login
→ Generate JWT Token
→ Send Token to Client
→ Client Stores Token
→ Client Sends Token in Request Header
→ Backend Verifies Token
→ Protected Route Access Granted
```

---

## 4. Register Flow

A new user creates an account.

### Example Request

```http
POST /auth/register
```

```json
{
  "name": "Lia",
  "email": "lia@example.com",
  "password": "password123"
}
```

### Backend Process

```txt
Validate request body
→ Check existing email
→ Hash password using bcrypt
→ Save user to database
→ Return user data
```

---

## 5. Login Flow

An existing user logs into the system.

### Example Request

```http
POST /auth/login
```

```json
{
  "email": "lia@example.com",
  "password": "password123"
}
```

---

## 6. Login Verification Process

The backend performs the following steps:

```txt
Validate request body
→ Find user by email
→ Compare password using bcrypt
→ Generate JWT token
→ Return token to client
```

---

## 7. JWT Token Generation

After successful login, the backend generates a JWT access token.

Example response:

```json
{
  "message": "Login successful",
  "access_token": "jwt_token_here",
  "user": {
    "id": "user-id",
    "name": "Lia",
    "email": "lia@example.com",
    "role": "CUSTOMER"
  }
}
```

---

## 8. JWT Payload

The JWT token contains encoded user information.

Example payload:

```json
{
  "sub": "user-id",
  "email": "lia@example.com",
  "role": "CUSTOMER"
}
```

### Payload Description

| Field | Description |
| ----- | ----------- |
| sub   | User ID     |
| email | User email  |
| role  | User role   |

---

## 9. Client Token Storage

After login, the client application stores the JWT token.

Common storage methods:

- Local storage
- Session storage
- HTTP-only cookies

---

## 10. Sending JWT Token

Protected endpoints require the token in the Authorization header.

Example:

```http
Authorization: Bearer <access_token>
```

Example request:

```http
GET /users/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 11. JWT Verification Flow

When accessing a protected route:

```txt
Client sends JWT token
→ JWT Guard intercepts request
→ Token is extracted from Authorization header
→ JWT Strategy verifies token
→ User data is attached to request
→ Request proceeds to controller
```

---

## 12. JWT Guard

The backend uses JWT Guard to protect routes.

Example:

```ts
@UseGuards(JwtAuthGuard)
```

Protected endpoints require a valid token before access is granted.

---

## 13. JWT Strategy

JWT Strategy is responsible for:

- Extracting JWT token
- Verifying token signature
- Validating token payload
- Attaching user information to request

Example flow:

```txt
Authorization Header
→ Extract JWT
→ Verify JWT_SECRET
→ Decode payload
→ Attach user to request
```

---

## 14. Protected Route Example

Example protected endpoint:

```ts
@Get('profile')
@UseGuards(JwtAuthGuard)
getProfile() {
  return this.usersService.getProfile();
}
```

Only authenticated users can access this route.

---

## 15. Admin Authorization Flow

Admin endpoints require:

```txt
Valid JWT token + ADMIN role
```

Flow:

```txt
Verify JWT token
→ Verify user role
→ Allow admin access
```

Example:

```ts
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
```

---

## 16. Common JWT Errors

### Missing Token

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Invalid Token

```json
{
  "statusCode": 401,
  "message": "Invalid token"
}
```

### Forbidden Access

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## 17. JWT Security Practices

The backend applies the following JWT security practices:

- JWT_SECRET stored in environment variables
- Passwords hashed using bcrypt
- Protected routes require token validation
- Admin routes require role validation
- Sensitive data is not stored inside JWT payload
- Invalid tokens are rejected automatically

---

## 18. JWT Flow Goal

The JWT authentication flow is designed to provide:

- Secure API authentication
- Stateless backend authentication
- Protected route access
- Role-based authorization
- Scalable backend security architecture

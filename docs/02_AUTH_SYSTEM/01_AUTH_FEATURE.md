# Auth Feature

## 1. Overview

The authentication feature manages user registration, user login, JWT token generation, and protected route access.

Whisk & Wonder Backend API uses JWT authentication to secure customer and admin endpoints.

---

## 2. Auth Feature Goals

The authentication system is designed to:

- Register new users securely
- Login existing users
- Hash user passwords
- Generate JWT access tokens
- Protect private API routes
- Support role-based access control
- Separate customer and admin access

---

## 3. Auth Endpoints

| Method | Endpoint         | Access | Description                      |
| ------ | ---------------- | ------ | -------------------------------- |
| POST   | `/auth/register` | Public | Register new user                |
| POST   | `/auth/login`    | Public | Login user and receive JWT token |

---

## 4. Register Flow

The register endpoint allows a new customer to create an account.

### Request Flow

```txt
Client sends register data
→ Backend validates request body
→ Backend checks if email already exists
→ Password is hashed
→ New user is created
→ User data is returned
```

### Example Request

```http
POST /auth/register
```

```json
{
  "name": "Lia",
  "email": "lia@example.com",
  "password": "password123",
  "phone": "08012345678",
  "address": "Tokyo, Japan"
}
```

### Example Success Response

```json
{
  "message": "User registered successfully",
  "data": {
    "id": "user-id",
    "name": "Lia",
    "email": "lia@example.com",
    "role": "CUSTOMER"
  }
}
```

---

## 5. Login Flow

The login endpoint authenticates an existing user.

### Request Flow

```txt
Client sends email and password
→ Backend validates request body
→ Backend checks registered email
→ Backend compares password with hashed password
→ JWT token is generated
→ Token and user data are returned
```

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

### Example Success Response

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

## 6. Password Security

User passwords are hashed before being stored in the database.

The backend uses:

```txt
bcrypt
```

Password hashing helps protect user credentials if database data is exposed.

---

## 7. JWT Token Usage

After login, the user receives a JWT access token.

Protected routes require the token in the request header:

```http
Authorization: Bearer <access_token>
```

Example:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 8. Protected Routes

Protected routes require a valid JWT token.

Examples:

| Endpoint               | Description                   |
| ---------------------- | ----------------------------- |
| `GET /users/profile`   | Get logged-in user profile    |
| `PATCH /users/profile` | Update logged-in user profile |
| `GET /reservations/my` | Get user reservation history  |
| `GET /orders/my`       | Get user order history        |

---

## 9. Admin Access

Admin routes require:

```txt
Valid JWT token + ADMIN role
```

Examples:

| Endpoint        | Description      |
| --------------- | ---------------- |
| `GET /users`    | Get all users    |
| `POST /tables`  | Create table     |
| `POST /menus`   | Create menu item |
| `GET /payments` | Get all payments |

---

## 10. Validation Rules

### Register Validation

| Field    | Rule                 |
| -------- | -------------------- |
| name     | Required string      |
| email    | Required valid email |
| password | Required string      |
| phone    | Optional string      |
| address  | Optional string      |

### Login Validation

| Field    | Rule                 |
| -------- | -------------------- |
| email    | Required valid email |
| password | Required string      |

---

## 11. Common Error Responses

### Email Already Registered

```json
{
  "statusCode": 400,
  "message": "Email is already registered",
  "error": "Bad Request"
}
```

### Invalid Login Credentials

```json
{
  "statusCode": 401,
  "message": "Invalid email or password"
}
```

### Unauthorized Access

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
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

## 12. Auth Security Notes

The authentication system applies the following security practices:

- Passwords are hashed before storage
- Plain text passwords are never returned
- JWT token is required for protected routes
- Admin-only routes require role validation
- Invalid credentials return controlled error messages
- User access is separated from admin access

---

## 13. Auth Feature Goal

The auth feature ensures that only registered and authorized users can access protected resources in the Whisk & Wonder backend system.

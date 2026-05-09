# Auth Testing

## 1. Overview

Auth testing is used to verify that the authentication and authorization system works correctly.

The testing process covers:

- User registration
- User login
- JWT token generation
- Protected route access
- Admin-only route access
- Invalid credential handling
- Role-based authorization

---

## 2. Testing Tools

Auth endpoints can be tested using:

- Swagger
- Postman
- Thunder Client
- Insomnia

Swagger documentation is available at:

```txt
http://localhost:3000/api
```

---

## 3. Register Testing

### Endpoint

```http
POST /auth/register
```

### Example Request Body

```json
{
  "name": "Lia",
  "email": "lia@example.com",
  "password": "password123",
  "phone": "08012345678",
  "address": "Tokyo, Japan"
}
```

### Expected Result

```txt
User account is created successfully.
Password is hashed before being stored.
Response returns user data without plain password.
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

## 4. Duplicate Email Testing

### Test Case

Register using an email that already exists.

### Example Request Body

```json
{
  "name": "Lia",
  "email": "lia@example.com",
  "password": "password123"
}
```

### Expected Result

```txt
The system rejects duplicate email registration.
```

### Example Error Response

```json
{
  "statusCode": 400,
  "message": "Email is already registered",
  "error": "Bad Request"
}
```

---

## 5. Login Testing

### Endpoint

```http
POST /auth/login
```

### Example Request Body

```json
{
  "email": "lia@example.com",
  "password": "password123"
}
```

### Expected Result

```txt
Login succeeds.
JWT access token is returned.
User data is returned.
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

## 6. Invalid Login Testing

### Test Case

Login with incorrect password.

### Example Request Body

```json
{
  "email": "lia@example.com",
  "password": "wrongpassword"
}
```

### Expected Result

```txt
Login fails.
JWT token is not returned.
```

### Example Error Response

```json
{
  "statusCode": 401,
  "message": "Invalid email or password"
}
```

---

## 7. Protected Route Testing

### Endpoint Example

```http
GET /users/profile
```

### Test Without Token

Send request without Authorization header.

### Expected Result

```txt
Access is rejected.
```

### Example Error Response

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Test With Token

Send request with Authorization header:

```http
Authorization: Bearer <access_token>
```

### Expected Result

```txt
Access is granted.
Logged-in user profile is returned.
```

---

## 8. Admin Route Testing

### Endpoint Example

```http
GET /users
```

### Test With Customer Token

Use a token from a CUSTOMER account.

### Expected Result

```txt
Access is rejected because the user does not have admin permission.
```

### Example Error Response

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### Test With Admin Token

Use a token from an ADMIN account.

### Expected Result

```txt
Access is granted.
Admin can view user list.
```

---

## 9. JWT Token Format Testing

### Valid Format

```http
Authorization: Bearer <access_token>
```

### Invalid Formats

```http
Authorization: <access_token>
Authorization: Bearer
Authorization: Bearer invalid-token
```

### Expected Result

```txt
Invalid token format is rejected.
```

---

## 10. Validation Testing

### Register Validation Cases

| Field    | Invalid Case         | Expected Result  |
| -------- | -------------------- | ---------------- |
| name     | Empty value          | Request rejected |
| email    | Invalid email format | Request rejected |
| password | Empty value          | Request rejected |

### Login Validation Cases

| Field    | Invalid Case         | Expected Result  |
| -------- | -------------------- | ---------------- |
| email    | Invalid email format | Request rejected |
| password | Empty value          | Request rejected |

---

## 11. Auth Testing Checklist

| Test Case                               | Expected Result |
| --------------------------------------- | --------------- |
| Register with valid data                | Success         |
| Register with duplicate email           | Failed          |
| Login with valid credentials            | Success         |
| Login with wrong password               | Failed          |
| Access protected route without token    | Failed          |
| Access protected route with valid token | Success         |
| Access admin route with customer token  | Failed          |
| Access admin route with admin token     | Success         |
| Send invalid token format               | Failed          |
| Submit invalid request body             | Failed          |

---

## 12. Auth Testing Goal

Auth testing ensures that:

- User registration works correctly
- Passwords are securely hashed
- Login returns a valid JWT token
- Protected routes reject unauthenticated users
- Admin routes reject non-admin users
- DTO validation rejects invalid input
- Authentication flow is ready for frontend integration

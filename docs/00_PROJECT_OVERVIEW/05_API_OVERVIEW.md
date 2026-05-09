# API Overview

## 1. API Summary

Whisk & Wonder Backend API is a RESTful API built for an afternoon tea cafe reservation and ordering platform.

The API allows users to register, login, manage reservations, place orders, and track payments.  
Admin users can manage reservations, tables, menus, orders, payments, and user data.

---

## 2. Base URL

### Local Development

```txt
http://localhost:3000
```

### API Documentation

```txt
http://localhost:3000/api
```

---

## 3. API Format

All API requests and responses use JSON format.

### Request Header

```http
Content-Type: application/json
```

For protected routes:

```http
Authorization: Bearer <access_token>
```

---

## 4. Authentication Flow

The API uses JWT authentication.

Basic flow:

```txt
Register → Login → Receive JWT Token → Access Protected Routes
```

### Example

```txt
POST /auth/register
POST /auth/login
GET /users/profile
```

After login, copy the returned token and send it in the Authorization header.

---

## 5. User Roles

The API supports role-based access control.

| Role     | Description                                                         |
| -------- | ------------------------------------------------------------------- |
| CUSTOMER | Can manage personal profile, reservations, orders, and payments     |
| ADMIN    | Can manage users, reservations, tables, menus, orders, and payments |

---

## 6. Main API Modules

| Module       | Description                                           |
| ------------ | ----------------------------------------------------- |
| Auth         | Register, login, and JWT authentication               |
| Users        | User profile and user management                      |
| Reservations | Customer reservation and admin reservation management |
| Tables       | Cafe table management                                 |
| Menus        | Menu and afternoon tea package management             |
| Orders       | Customer order management                             |
| Payments     | Payment record and payment status management          |

---

## 7. Endpoint Summary

### Auth Endpoints

| Method | Endpoint         | Access | Description                 |
| ------ | ---------------- | ------ | --------------------------- |
| POST   | `/auth/register` | Public | Register new user           |
| POST   | `/auth/login`    | Public | Login and receive JWT token |

---

### User Endpoints

| Method | Endpoint         | Access | Description                   |
| ------ | ---------------- | ------ | ----------------------------- |
| GET    | `/users/profile` | User   | Get logged-in user profile    |
| PATCH  | `/users/profile` | User   | Update logged-in user profile |
| GET    | `/users`         | Admin  | Get all users                 |

---

### Reservation Endpoints

| Method | Endpoint            | Access      | Description                     |
| ------ | ------------------- | ----------- | ------------------------------- |
| POST   | `/reservations`     | Public/User | Create reservation              |
| GET    | `/reservations`     | Admin       | Get all reservations            |
| GET    | `/reservations/my`  | User        | Get logged-in user reservations |
| GET    | `/reservations/:id` | User/Admin  | Get reservation detail          |
| PATCH  | `/reservations/:id` | User/Admin  | Update reservation              |
| DELETE | `/reservations/:id` | User/Admin  | Cancel or delete reservation    |

---

### Table Endpoints

| Method | Endpoint      | Access       | Description      |
| ------ | ------------- | ------------ | ---------------- |
| POST   | `/tables`     | Admin        | Create table     |
| GET    | `/tables`     | Public/Admin | Get all tables   |
| GET    | `/tables/:id` | Public/Admin | Get table detail |
| PATCH  | `/tables/:id` | Admin        | Update table     |
| DELETE | `/tables/:id` | Admin        | Delete table     |

---

### Menu Endpoints

| Method | Endpoint     | Access | Description        |
| ------ | ------------ | ------ | ------------------ |
| POST   | `/menus`     | Admin  | Create menu item   |
| GET    | `/menus`     | Public | Get all menu items |
| GET    | `/menus/:id` | Public | Get menu detail    |
| PATCH  | `/menus/:id` | Admin  | Update menu item   |
| DELETE | `/menus/:id` | Admin  | Delete menu item   |

---

### Order Endpoints

| Method | Endpoint             | Access     | Description               |
| ------ | -------------------- | ---------- | ------------------------- |
| POST   | `/orders`            | User       | Create order              |
| GET    | `/orders`            | Admin      | Get all orders            |
| GET    | `/orders/my`         | User       | Get logged-in user orders |
| GET    | `/orders/:id`        | User/Admin | Get order detail          |
| PATCH  | `/orders/:id/status` | Admin      | Update order status       |
| DELETE | `/orders/:id`        | Admin      | Delete order              |

---

### Payment Endpoints

| Method | Endpoint               | Access     | Description           |
| ------ | ---------------------- | ---------- | --------------------- |
| POST   | `/payments`            | User       | Create payment record |
| GET    | `/payments`            | Admin      | Get all payments      |
| GET    | `/payments/:id`        | User/Admin | Get payment detail    |
| PATCH  | `/payments/:id/status` | Admin      | Update payment status |

---

## 8. Standard Success Response

Example success response:

```json
{
  "message": "Request successful",
  "data": {}
}
```

Example created response:

```json
{
  "message": "Reservation created successfully",
  "data": {
    "id": "reservation-id",
    "guestName": "Lia",
    "guestCount": 4,
    "status": "PENDING"
  }
}
```

---

## 9. Standard Error Response

Example validation error:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password should not be empty"],
  "error": "Bad Request"
}
```

Example unauthorized error:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

Example forbidden error:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

Example not found error:

```json
{
  "statusCode": 404,
  "message": "Reservation not found"
}
```

---

## 10. Common Status Codes

| Status Code | Meaning                                      |
| ----------- | -------------------------------------------- |
| 200         | Request successful                           |
| 201         | Resource created successfully                |
| 400         | Bad request / validation error               |
| 401         | Unauthorized / missing or invalid token      |
| 403         | Forbidden / insufficient permission          |
| 404         | Resource not found                           |
| 409         | Conflict / duplicate or unavailable resource |
| 500         | Internal server error                        |

---

## 11. Authorization Summary

| Access Type | Requirement                           |
| ----------- | ------------------------------------- |
| Public      | No token required                     |
| User        | Valid JWT token required              |
| Admin       | Valid JWT token + ADMIN role required |

---

## 12. Swagger Usage

Swagger is available at:

```txt
/api
```

Swagger can be used to:

- View all available endpoints
- Test API requests
- Check request body format
- Check response examples
- Add JWT token for protected routes
- Validate admin-only access

---

## 13. API Flow Examples

### Customer Flow

```txt
Register
→ Login
→ Create Reservation
→ Create Order
→ Create Payment
→ View Reservation / Order History
```

### Admin Flow

```txt
Login as Admin
→ Manage Tables
→ Manage Menus
→ View Reservations
→ Update Reservation Status
→ View Orders
→ Update Payment Status
```

---

## 14. API Goal

The API is designed to provide:

- Clear RESTful endpoint structure
- Secure authentication and authorization
- Organized module-based backend architecture
- Reliable reservation and ordering flow
- Frontend integration readiness
- Portfolio-ready API documentation

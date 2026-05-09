# Role Access Control

## 1. Overview

Whisk & Wonder Backend API uses Role-Based Access Control (RBAC) to restrict access to protected resources and administrative operations.

The authorization system ensures that users can only access features based on their assigned role.

---

## 2. Supported Roles

The backend currently supports two main roles.

| Role     | Description             |
| -------- | ----------------------- |
| CUSTOMER | Regular customer access |
| ADMIN    | Administrative access   |

---

## 3. Access Control Goals

The role access control system is designed to:

- Protect administrative resources
- Separate customer and admin permissions
- Restrict sensitive operations
- Secure protected endpoints
- Maintain controlled backend access

---

## 4. CUSTOMER Permissions

Customers are allowed to:

- Register account
- Login account
- View personal profile
- Update personal profile
- Create reservations
- View personal reservations
- Create orders
- View personal orders
- Create payments
- View personal payment information

### Customer Access Examples

| Endpoint               | Access   |
| ---------------------- | -------- |
| `GET /users/profile`   | CUSTOMER |
| `PATCH /users/profile` | CUSTOMER |
| `POST /reservations`   | CUSTOMER |
| `GET /reservations/my` | CUSTOMER |
| `POST /orders`         | CUSTOMER |

---

## 5. ADMIN Permissions

Admins are allowed to manage operational resources.

Admin permissions include:

- View all users
- Manage reservations
- Manage tables
- Manage menus
- Manage orders
- Manage payments
- Update operational statuses

### Admin Access Examples

| Endpoint                     | Access |
| ---------------------------- | ------ |
| `GET /users`                 | ADMIN  |
| `POST /tables`               | ADMIN  |
| `PATCH /tables/:id`          | ADMIN  |
| `POST /menus`                | ADMIN  |
| `PATCH /orders/:id/status`   | ADMIN  |
| `PATCH /payments/:id/status` | ADMIN  |

---

## 6. Role Validation Flow

The backend validates user roles during protected requests.

Flow:

```txt
Client Request
→ JWT Authentication
→ Extract User Payload
→ Check User Role
→ Validate Required Role
→ Allow or Reject Access
```

---

## 7. Authorization Components

The role authorization system uses:

- JWT Authentication
- Roles Decorator
- Roles Guard
- Protected Route Guards

---

## 8. Roles Decorator

The backend uses a custom `Roles` decorator to define required roles.

Example:

```ts
@Roles('ADMIN')
```

This decorator specifies which role can access the endpoint.

---

## 9. Roles Guard

The `RolesGuard` validates whether the authenticated user has the required role.

Example:

```ts
@UseGuards(JwtAuthGuard, RolesGuard)
```

Flow:

```txt
Validate JWT token
→ Extract user role
→ Compare required role
→ Allow or deny access
```

---

## 10. Admin Route Example

Example admin-only endpoint:

```ts
@Get()
@Roles('ADMIN')
@UseGuards(JwtAuthGuard, RolesGuard)
findAllUsers() {
  return this.usersService.findAll();
}
```

Only authenticated admin users can access this endpoint.

---

## 11. Customer Ownership Validation

Customers can only access their own resources.

Examples:

- Own profile
- Own reservations
- Own orders
- Own payments

The backend prevents customers from accessing other users’ data.

---

## 12. Unauthorized Access Example

If a request is missing a valid JWT token:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

## 13. Forbidden Access Example

If a customer attempts to access an admin endpoint:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## 14. Authorization Security Notes

The role access control system applies the following security practices:

- JWT authentication required before role validation
- Admin routes protected with guards
- User ownership validation applied
- Unauthorized access rejected automatically
- Protected resources separated by role

---

## 15. Future Authorization Improvements

Potential future improvements:

- Multi-role support
- Permission-based access control
- Staff role support
- Branch management permissions
- Fine-grained endpoint permissions

---

## 16. Role Access Control Goal

The role authorization system is designed to provide:

- Secure backend access
- Controlled administrative operations
- Safe customer resource access
- Scalable authorization structure
- Production-oriented backend security

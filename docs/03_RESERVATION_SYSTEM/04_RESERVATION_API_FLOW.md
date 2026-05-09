# Reservation API Flow

## 1. Overview

The Reservation API handles the complete reservation process for Whisk & Wonder.

This API allows customers to create reservations, view reservation details, update reservations, and cancel reservations. Admin users can view and manage all reservation records.

---

## 2. Reservation API Goals

The Reservation API is designed to:

- Create customer reservations
- Validate reservation availability
- Prevent overlapping reservations
- Manage reservation status
- Support user reservation history
- Support admin reservation management

---

## 3. Reservation Endpoints

| Method | Endpoint            | Access        | Description                     |
| ------ | ------------------- | ------------- | ------------------------------- |
| POST   | `/reservations`     | Public / User | Create reservation              |
| GET    | `/reservations`     | Admin         | Get all reservations            |
| GET    | `/reservations/my`  | User          | Get logged-in user reservations |
| GET    | `/reservations/:id` | User / Admin  | Get reservation detail          |
| PATCH  | `/reservations/:id` | User / Admin  | Update reservation              |
| DELETE | `/reservations/:id` | User / Admin  | Cancel or delete reservation    |

---

## 4. Create Reservation Flow

```txt
Client sends reservation request
→ Backend validates request body
→ Backend validates operating hours
→ Backend validates 2-hour duration
→ Backend checks table capacity
→ Backend checks reservation overlap
→ Backend creates reservation
→ Backend returns reservation response
```

---

## 5. Create Reservation Request

```http
POST /reservations
```

```json
{
  "guestName": "Lia",
  "guestEmail": "lia@example.com",
  "guestPhone": "08012345678",
  "reservationDate": "2026-05-20",
  "startTime": "11:00",
  "endTime": "13:00",
  "guestCount": 4
}
```

---

## 6. Create Reservation Success Response

```json
{
  "message": "Reservation created successfully",
  "data": {
    "id": "reservation-id",
    "guestName": "Lia",
    "guestEmail": "lia@example.com",
    "guestPhone": "08012345678",
    "reservationDate": "2026-05-20",
    "startTime": "11:00",
    "endTime": "13:00",
    "guestCount": 4,
    "status": "PENDING"
  }
}
```

---

## 7. Get My Reservations Flow

Authenticated customers can retrieve their own reservation history.

```http
GET /reservations/my
```

Required header:

```http
Authorization: Bearer <access_token>
```

Expected result:

```txt
The backend returns reservations owned by the logged-in user.
```

---

## 8. Get All Reservations Flow

Admin users can retrieve all reservation records.

```http
GET /reservations
```

Required access:

```txt
Valid JWT token + ADMIN role
```

Expected result:

```txt
The backend returns all reservations in the system.
```

---

## 9. Get Reservation Detail Flow

```http
GET /reservations/:id
```

Access rules:

- Customers can view their own reservation detail
- Admin users can view any reservation detail

Expected result:

```txt
The backend returns reservation detail if the user is authorized.
```

---

## 10. Update Reservation Flow

```http
PATCH /reservations/:id
```

Example request:

```json
{
  "guestCount": 3,
  "startTime": "12:00",
  "endTime": "14:00"
}
```

Validation rules:

- Reservation must exist
- User must be reservation owner or admin
- Updated time must follow operating hours
- Updated duration must be 2 hours
- Updated reservation must not overlap with existing active reservations
- Updated guest count must match available table capacity

---

## 11. Cancel Reservation Flow

```http
DELETE /reservations/:id
```

Access rules:

- Customer can cancel their own reservation
- Admin can cancel any reservation

Expected result:

```txt
Reservation is cancelled or removed based on backend implementation.
```

Recommended soft-cancel response:

```json
{
  "message": "Reservation cancelled successfully",
  "data": {
    "id": "reservation-id",
    "status": "CANCELLED"
  }
}
```

---

## 12. Reservation Validation Summary

| Validation      | Description                                          |
| --------------- | ---------------------------------------------------- |
| Required fields | Request body must include required reservation data  |
| Operating hours | Reservation must be within 11:00 AM – 6:00 PM        |
| Duration        | Reservation duration must be 2 hours                 |
| Table capacity  | Guest count must match available table capacity      |
| Overlap check   | Reservation must not overlap with active reservation |
| Ownership       | Customer can only manage their own reservation       |
| Admin role      | Admin can manage all reservations                    |

---

## 13. Error Response Examples

### Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

### Reservation Not Found

```json
{
  "statusCode": 404,
  "message": "Reservation not found"
}
```

### Slot Not Available

```json
{
  "statusCode": 409,
  "message": "Reservation slot is not available",
  "error": "Conflict"
}
```

### Outside Operating Hours

```json
{
  "statusCode": 400,
  "message": "Reservation time is outside operating hours",
  "error": "Bad Request"
}
```

---

## 14. Reservation API Testing Flow

### Customer Testing Flow

```txt
1. Register customer
2. Login customer
3. Create reservation
4. Get my reservations
5. Get reservation detail
6. Update own reservation
7. Cancel own reservation
```

### Admin Testing Flow

```txt
1. Login as admin
2. Get all reservations
3. Get reservation detail
4. Update reservation status
5. Cancel reservation
```

---

## 15. Reservation API Goal

The Reservation API is designed to provide a reliable reservation workflow that supports customer booking needs and admin operational management for Whisk & Wonder.

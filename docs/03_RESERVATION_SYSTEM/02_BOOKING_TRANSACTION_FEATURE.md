# Booking Transaction Feature

## 1. Overview

The booking transaction feature manages the complete reservation creation process for Whisk & Wonder.

This feature ensures that reservation requests are validated properly before a booking is successfully created.

The booking process includes:

- Reservation validation
- Availability checking
- Table assignment
- Guest capacity validation
- Reservation creation
- Reservation status management

---

## 2. Feature Goals

The booking transaction feature is designed to:

- Create reservations securely
- Prevent overlapping bookings
- Validate operating hours
- Validate table availability
- Support structured reservation flow
- Maintain reservation data integrity

---

## 3. Reservation Creation Flow

The reservation transaction follows this process:

```txt
Client submits reservation request
→ Backend validates request body
→ Backend validates operating hours
→ Backend validates reservation duration
→ Backend checks table capacity
→ Backend checks reservation overlap
→ Backend assigns available table
→ Reservation is created
→ Reservation response is returned
```

---

## 4. Reservation Endpoint

### Create Reservation

```http
POST /reservations
```

Access:

```txt
Public or authenticated user
```

---

## 5. Reservation Request Example

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

## 6. Reservation Validation Rules

The backend validates:

| Validation              | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| Required fields         | Mandatory reservation fields must exist              |
| Guest count             | Guest count must match available table capacity      |
| Reservation duration    | Reservation must be 2 hours                          |
| Operating hours         | Reservation must stay within 11:00 AM – 6:00 PM      |
| Overlapping reservation | Reservation must not conflict with existing bookings |
| Reservation status      | Only active reservations block availability          |

---

## 7. Reservation Duration Validation

Whisk & Wonder uses fixed 2-hour dining sessions.

Valid example:

```txt
11:00 AM → 1:00 PM
```

Invalid example:

```txt
11:00 AM → 12:00 PM
```

The backend rejects reservations that do not follow the 2-hour rule.

---

## 8. Operating Hours Validation

Cafe operating hours:

```txt
11:00 AM → 6:00 PM
```

Validation rules:

- Reservation start time must be at or after 11:00 AM
- Reservation end time must be at or before 6:00 PM
- Latest valid reservation start time is 4:00 PM

Invalid example:

```txt
5:00 PM → 7:00 PM
```

---

## 9. Table Assignment Logic

The backend automatically checks for available tables based on:

- Guest count
- Reservation date
- Reservation time
- Existing reservations

Example:

| Guest Count | Suggested Table Capacity |
| ----------- | ------------------------ |
| 2 guests    | Table capacity 2         |
| 4 guests    | Table capacity 4         |
| 6 guests    | Table capacity 6         |

If no table is available, the reservation request is rejected.

---

## 10. Reservation Conflict Validation

The backend prevents overlapping reservations for the same table.

Overlap validation logic:

```txt
Existing start time < New end time
AND
Existing end time > New start time
```

If overlap exists:

```txt
Reservation creation is rejected.
```

---

## 11. Reservation Status Flow

### Initial Status

New reservations are typically created with:

```txt
PENDING
```

### Reservation Status Options

```txt
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

---

## 12. Successful Reservation Example

### Example Response

```json
{
  "message": "Reservation created successfully",
  "data": {
    "id": "reservation-id",
    "guestName": "Lia",
    "guestEmail": "lia@example.com",
    "reservationDate": "2026-05-20",
    "startTime": "11:00",
    "endTime": "13:00",
    "guestCount": 4,
    "status": "PENDING"
  }
}
```

---

## 13. Conflict Error Example

If the requested slot is unavailable:

```json
{
  "statusCode": 409,
  "message": "Reservation slot is not available",
  "error": "Conflict"
}
```

---

## 14. Invalid Operating Hours Example

If reservation exceeds operating hours:

```json
{
  "statusCode": 400,
  "message": "Reservation time is outside operating hours",
  "error": "Bad Request"
}
```

---

## 15. Invalid Guest Count Example

If no suitable table exists:

```json
{
  "statusCode": 400,
  "message": "No available table for the selected guest count",
  "error": "Bad Request"
}
```

---

## 16. Reservation Ownership

Authenticated users can:

- View their own reservations
- Update their own reservations
- Cancel their own reservations

Admin users can manage all reservations.

---

## 17. Reservation Testing Checklist

| Test Case                                  | Expected Result |
| ------------------------------------------ | --------------- |
| Create reservation with valid data         | Success         |
| Create reservation outside operating hours | Rejected        |
| Create reservation with invalid duration   | Rejected        |
| Create overlapping reservation             | Rejected        |
| Create reservation exceeding capacity      | Rejected        |
| Cancel reservation                         | Success         |
| Retrieve personal reservation history      | Success         |

---

## 18. Future Improvements

Potential future improvements:

- Reservation waitlist system
- Automatic table optimization
- Reservation reminder notification
- Reservation confirmation email
- 30-minute table reset buffer
- Dynamic slot availability display

---

## 19. Feature Goal

The booking transaction feature is designed to provide a reliable and organized reservation experience for both customers and cafe operations.

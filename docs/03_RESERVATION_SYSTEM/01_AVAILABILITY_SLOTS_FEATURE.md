# Availability Slots Feature

## 1. Overview

The availability slots feature manages reservation time availability for Whisk & Wonder afternoon tea dining sessions.

Since Whisk & Wonder uses a reservation-based dining concept, each customer reservation is limited to a fixed 2-hour session.

This feature helps prevent overlapping reservations and ensures that table capacity is managed properly.

---

## 2. Feature Goals

The availability slots feature is designed to:

- Display available reservation time slots
- Validate selected reservation time
- Prevent overlapping reservations
- Check table availability
- Support 2-hour dining sessions
- Maintain organized cafe operation flow

---

## 3. Dining Session Concept

Whisk & Wonder operates with reservation-based afternoon tea sessions.

The cafe operating hours are:

```txt
11:00 AM → 6:00 PM
```

Each reservation session is limited to 2 hours.

Because the cafe closes at 6:00 PM, the latest valid reservation start time is 4:00 PM.

Current valid reservation examples:

```txt
11:00 AM → 1:00 PM
12:00 PM → 2:00 PM
1:00 PM → 3:00 PM
2:00 PM → 4:00 PM
3:00 PM → 5:00 PM
4:00 PM → 6:00 PM
```

Reservations cannot be created outside cafe operating hours.

Invalid examples:

```txt
10:00 AM → 12:00 PM
5:00 PM → 7:00 PM
```

---

## 4. Current Availability Rules

The current backend validation focuses on:

- 2-hour reservation duration
- Reservation within operating hours
- Table capacity validation
- No overlapping reservation for the same table

The current implementation does not enforce a 30-minute gap between reservation sessions.

---

## 5. Availability Logic

The backend checks availability based on:

- Reservation date
- Start time
- End time
- Guest count
- Existing reservations
- Table capacity
- Reservation status

The system only allows reservations when a suitable table and valid time slot are available.

---

## 6. Reservation Conflict Prevention

A reservation conflict happens when another active reservation already uses the same table during the requested time.

Example conflict:

```txt
Existing reservation:
12:00 PM → 2:00 PM

New request:
1:00 PM → 3:00 PM
```

Result:

```txt
Rejected because the reservation time overlaps.
```

---

## 7. Overlap Validation Rule

The backend checks overlapping reservations using this logic:

```txt
Existing start time < New end time
AND
Existing end time > New start time
```

If both conditions are true, the reservation overlaps.

---

## 8. Reservation Status Consideration

Only active reservations should block availability.

Statuses that block availability:

```txt
PENDING
CONFIRMED
```

Statuses that do not block availability:

```txt
CANCELLED
COMPLETED
```

---

## 9. Table Capacity Validation

The backend checks whether the selected table can support the requested guest count.

Example:

| Guest Count | Required Table Capacity  |
| ----------- | ------------------------ |
| 2 guests    | Table capacity 2 or more |
| 4 guests    | Table capacity 4 or more |
| 6 guests    | Table capacity 6 or more |

If no table can support the guest count, the reservation should be rejected.

---

## 10. Availability Request Example

Example endpoint:

```http
GET /reservations/availability?date=2026-05-20&guestCount=4
```

Example response:

```json
{
  "message": "Available slots retrieved successfully",
  "data": [
    {
      "startTime": "11:00",
      "endTime": "13:00",
      "available": true
    },
    {
      "startTime": "13:00",
      "endTime": "15:00",
      "available": true
    },
    {
      "startTime": "16:00",
      "endTime": "18:00",
      "available": false
    }
  ]
}
```

---

## 11. Create Reservation Validation Example

Example request:

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

Expected result:

```txt
The backend checks table availability before creating the reservation.
```

---

## 12. Unavailable Slot Error Example

If the requested slot is already booked:

```json
{
  "statusCode": 409,
  "message": "Reservation slot is not available",
  "error": "Conflict"
}
```

---

## 13. Invalid Guest Count Example

If guest count exceeds available table capacity:

```json
{
  "statusCode": 400,
  "message": "No available table for the selected guest count",
  "error": "Bad Request"
}
```

---

## 14. Operating Hours Validation

The backend validates that every reservation follows cafe operating hours.

Validation rules:

- Reservation start time must be at or after 11:00 AM
- Reservation end time must be at or before 6:00 PM
- Reservation duration must be 2 hours
- Latest valid reservation start time is 4:00 PM

If the reservation is outside operating hours, the request should be rejected.

---

## 15. Future Improvement

A 30-minute buffer gap between reservation sessions can be added later to support:

- Table cleaning
- Preparation time
- Table reset workflow

Example future slot structure:

```txt
11:00 AM → 1:00 PM
1:30 PM → 3:30 PM
4:00 PM → 6:00 PM
```

---

## 16. Availability Testing Checklist

| Test Case                                                | Expected Result          |
| -------------------------------------------------------- | ------------------------ |
| Check available slots for a valid date                   | Available slots returned |
| Create reservation in available slot                     | Reservation created      |
| Create reservation in overlapping slot                   | Request rejected         |
| Create reservation with guest count exceeding capacity   | Request rejected         |
| Cancel reservation then check slot again                 | Slot becomes available   |
| Completed reservation does not block future availability | Slot can be reused       |

---

## 17. Feature Goal

The availability slots feature ensures that Whisk & Wonder can manage afternoon tea reservations in an organized, conflict-free, and customer-friendly way.

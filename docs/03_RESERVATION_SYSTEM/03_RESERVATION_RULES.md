# Reservation Rules

## 1. Overview

Whisk & Wonder uses a reservation-based afternoon tea dining system.

The reservation rules are designed to maintain organized table usage, prevent scheduling conflicts, and provide a smooth customer dining experience.

---

## 2. Operating Hours

Cafe operating hours:

```txt
11:00 AM → 6:00 PM
```

Reservations are only allowed within operating hours.

---

## 3. Reservation Duration Rule

Each reservation session is limited to:

```txt
2 hours
```

Valid example:

```txt
11:00 AM → 1:00 PM
```

Invalid example:

```txt
11:00 AM → 12:00 PM
```

Reservations that do not follow the 2-hour duration rule should be rejected.

---

## 4. Latest Reservation Start Time

Because the cafe closes at 6:00 PM, the latest valid reservation start time is:

```txt
4:00 PM
```

Example:

```txt
4:00 PM → 6:00 PM
```

Invalid example:

```txt
5:00 PM → 7:00 PM
```

---

## 5. Operating Hours Validation

Reservations must follow these rules:

- Reservation start time must be at or after 11:00 AM
- Reservation end time must be at or before 6:00 PM
- Reservation duration must be exactly 2 hours

Reservations outside operating hours are rejected.

---

## 6. Table Capacity Rules

Reservations must match available table capacity.

Example:

| Guest Count | Required Table Capacity  |
| ----------- | ------------------------ |
| 2 guests    | Table capacity 2 or more |
| 4 guests    | Table capacity 4 or more |
| 6 guests    | Table capacity 6 or more |

If no suitable table is available, the reservation cannot be created.

---

## 7. Reservation Conflict Rules

A table cannot have overlapping active reservations.

Overlap validation logic:

```txt
Existing start time < New end time
AND
Existing end time > New start time
```

If overlap exists, the reservation is rejected.

---

## 8. Reservation Status Rules

### Reservation Status Options

```txt
PENDING
CONFIRMED
CANCELLED
COMPLETED
```

### Active Reservation Status

The following statuses block reservation availability:

```txt
PENDING
CONFIRMED
```

### Non-Blocking Status

The following statuses do not block availability:

```txt
CANCELLED
COMPLETED
```

---

## 9. Reservation Ownership Rules

Customers can only:

- View their own reservations
- Update their own reservations
- Cancel their own reservations

Admin users can access and manage all reservations.

---

## 10. Reservation Cancellation Rules

Reservations can be cancelled by:

- Reservation owner
- Admin user

Cancelled reservations release table availability for future bookings.

---

## 11. Guest Information Rules

Reservation requests must include:

- Guest name
- Guest email
- Guest phone number
- Guest count
- Reservation date
- Reservation start time
- Reservation end time

Missing required information results in validation failure.

---

## 12. Reservation Validation Rules

The backend validates:

| Validation            | Description                                      |
| --------------------- | ------------------------------------------------ |
| Required fields       | Mandatory fields must exist                      |
| Guest count           | Must match available table capacity              |
| Reservation duration  | Must be 2 hours                                  |
| Operating hours       | Must stay within 11:00 AM – 6:00 PM              |
| Reservation overlap   | Must not conflict with existing bookings         |
| Reservation ownership | Customers can only manage their own reservations |

---

## 13. Invalid Reservation Examples

### Outside Operating Hours

```txt
10:00 AM → 12:00 PM
```

### Invalid Duration

```txt
11:00 AM → 12:00 PM
```

### Overlapping Reservation

```txt
Existing:
11:00 AM → 1:00 PM

New:
12:00 PM → 2:00 PM
```

### Guest Count Exceeds Capacity

```txt
Guest count: 8
Available table capacity: 4
```

All examples above should be rejected by the backend.

---

## 14. Future Reservation Improvements

Potential future improvements include:

- Reservation waitlist
- Automatic reminder notifications
- Email confirmation
- Dynamic slot recommendations
- Table combination logic
- 30-minute table reset buffer
- Reservation modification limit

---

## 15. Reservation Rules Goal

The reservation rules are designed to:

- Maintain organized reservation flow
- Prevent table conflicts
- Improve customer experience
- Support operational efficiency
- Ensure backend data integrity
- Provide scalable reservation management

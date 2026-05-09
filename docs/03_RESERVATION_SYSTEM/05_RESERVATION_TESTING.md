# Reservation Testing

## 1. Overview

This document contains the planned testing scenarios for the Whisk & Wonder reservation system.

The testing focuses on validating:

- Reservation creation
- Reservation validation rules
- Reservation ownership
- Reservation availability
- Reservation conflict prevention
- Admin reservation management

Some testing scenarios are still in progress and will be updated as development continues.

---

## 2. Testing Goals

The reservation testing process aims to verify that:

- Reservations can be created successfully
- Invalid reservations are rejected
- Reservation conflicts are prevented
- Reservation ownership is protected
- Admin reservation management works correctly
- Reservation business rules are enforced properly

---

## 3. Testing Tools

Reservation API testing can be performed using:

- Swagger
- Postman
- Thunder Client
- Insomnia

Swagger documentation:

```txt
http://localhost:3000/api
```

---

## 4. Planned Reservation Test Cases

| Test Case                                   | Expected Result                    | Status  |
| ------------------------------------------- | ---------------------------------- | ------- |
| Create reservation with valid data          | Reservation created successfully   | Planned |
| Create reservation outside operating hours  | Request rejected                   | Planned |
| Create reservation with invalid duration    | Request rejected                   | Planned |
| Create overlapping reservation              | Request rejected                   | Planned |
| Create reservation exceeding table capacity | Request rejected                   | Planned |
| Retrieve personal reservation history       | Reservation list returned          | Planned |
| Update own reservation                      | Reservation updated successfully   | Planned |
| Cancel own reservation                      | Reservation cancelled successfully | Planned |
| Access another user's reservation           | Access rejected                    | Planned |
| Admin retrieves all reservations            | Reservation list returned          | Planned |

---

## 5. Create Reservation Testing

### Endpoint

```http
POST /reservations
```

### Example Request

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

### Expected Result

```txt
The reservation should be created successfully if:
- Operating hours are valid
- Duration is 2 hours
- Table capacity is available
- Reservation slot is available
```

---

## 6. Operating Hours Validation Testing

### Invalid Example

```txt
5:00 PM → 7:00 PM
```

### Expected Result

```json
{
  "statusCode": 400,
  "message": "Reservation time is outside operating hours",
  "error": "Bad Request"
}
```

---

## 7. Overlapping Reservation Testing

### Existing Reservation

```txt
11:00 AM → 1:00 PM
```

### New Reservation Attempt

```txt
12:00 PM → 2:00 PM
```

### Expected Result

```txt
Reservation request should be rejected because the time overlaps.
```

---

## 8. Table Capacity Testing

### Example

| Guest Count | Available Table Capacity | Expected Result |
| ----------- | ------------------------ | --------------- |
| 2           | 2                        | Allowed         |
| 4           | 4                        | Allowed         |
| 6           | 4                        | Rejected        |

---

## 9. Reservation Ownership Testing

### Customer Access

Customers should only be able to:

- View their own reservations
- Update their own reservations
- Cancel their own reservations

### Expected Result

```txt
Access to another user's reservation should be rejected.
```

---

## 10. Admin Reservation Testing

Admin users should be able to:

- View all reservations
- Update reservation status
- Cancel reservations
- Manage reservation operations

Required access:

```txt
Valid JWT token + ADMIN role
```

---

## 11. Future Testing Improvements

Future improvements may include:

- Automated integration testing
- E2E testing
- Jest testing implementation
- Reservation load testing
- Reservation concurrency testing
- Performance testing

---

## 12. Current Testing Status

Current testing progress:

| Area                     | Status              |
| ------------------------ | ------------------- |
| Manual API testing       | Partial             |
| Swagger endpoint testing | Partial             |
| Validation testing       | Partial             |
| Automated testing        | Not implemented yet |
| E2E testing              | Planned             |

This document will continue to be updated as testing implementation progresses.

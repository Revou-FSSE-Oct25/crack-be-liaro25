# Table Testing

## 1. Overview

This document contains the planned testing scenarios for the Whisk & Wonder table management and table assignment system.

Some testing scenarios are still in progress and will be updated after full manual or automated testing is completed.

---

## 2. Testing Goals

Table testing aims to verify that:

- Admin can manage table data
- Non-admin users cannot manage tables
- Table validation works correctly
- Soft delete works correctly
- Reservation table assignment works correctly
- Double booking is prevented
- Best table combination logic works as expected

---

## 3. Testing Tools

Testing can be performed using:

- Swagger
- Postman
- Thunder Client
- Insomnia

Swagger documentation:

```txt
http://localhost:3000/api
```

---

## 4. Planned Table Management Test Cases

| Test Case                                 | Expected Result               | Status  |
| ----------------------------------------- | ----------------------------- | ------- |
| Admin creates table with valid data       | Table created successfully    | Planned |
| Admin gets all tables                     | Table list returned           | Planned |
| Admin gets table by ID                    | Table detail returned         | Planned |
| Admin updates table                       | Table updated successfully    | Planned |
| Admin soft deletes table                  | Table marked inactive/deleted | Planned |
| Customer creates table                    | Request rejected              | Planned |
| Create table with invalid capacity        | Request rejected              | Planned |
| Create table with missing required fields | Request rejected              | Planned |

---

## 5. Planned Table Assignment Test Cases

| Test Case                                     | Expected Result                              | Status  |
| --------------------------------------------- | -------------------------------------------- | ------- |
| Create reservation with available table       | Reservation created with assigned table      | Planned |
| Create reservation requiring multiple tables  | Reservation created with table combination   | Planned |
| Create overlapping reservation for same table | Request rejected or different table assigned | Planned |
| Create reservation when no table is available | Request rejected                             | Planned |
| Create reservation exceeding total capacity   | Request rejected                             | Planned |
| Soft deleted table is not assigned            | Deleted table excluded from selection        | Planned |
| Maintenance table is not assigned             | Maintenance table excluded from selection    | Planned |

---

## 6. Create Table Testing

### Endpoint

```http
POST /tables
```

### Required Access

```txt
Valid JWT token + ADMIN role
```

### Example Request

```json
{
  "tableNumber": "T01",
  "capacity": 4,
  "status": "available"
}
```

### Expected Result

```txt
Table is created successfully.
```

---

## 7. Update Table Testing

### Endpoint

```http
PATCH /tables/:id
```

### Example Request

```json
{
  "capacity": 6,
  "status": "available"
}
```

### Expected Result

```txt
Table data is updated successfully.
```

---

## 8. Soft Delete Testing

### Endpoint

```http
DELETE /tables/:id
```

### Expected Result

```txt
Table is soft deleted or marked inactive.
Soft deleted table should not be assigned to new reservations.
```

---

## 9. Admin Authorization Testing

### Test Case

Customer attempts to access admin-only table endpoint.

### Expected Result

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## 10. Table Combination Testing

### Example Scenario

```txt
Guest count: 6

Available tables:
- T01 capacity 2
- T02 capacity 4
- T03 capacity 8
```

Expected result:

```txt
The system should select T01 + T02 because it matches guest count exactly.
```

---

## 11. Double Booking Testing

### Existing Reservation

```txt
T01
11:00 AM → 1:00 PM
```

### New Reservation Attempt

```txt
T01
12:00 PM → 2:00 PM
```

Expected result:

```txt
The system should not assign T01 because the reservation overlaps.
```

---

## 12. Current Testing Status

| Area                        | Status              |
| --------------------------- | ------------------- |
| Manual table CRUD testing   | Planned             |
| Admin authorization testing | Planned             |
| Table assignment testing    | Planned             |
| Double booking testing      | Planned             |
| Automated testing           | Not implemented yet |
| E2E testing                 | Planned             |

---

## 13. Future Testing Improvements

Future improvements may include:

- Automated Jest tests
- E2E reservation assignment tests
- Concurrency testing
- Table assignment edge case testing
- Performance testing for high reservation volume

---

## 14. Testing Goal

Table testing ensures that restaurant table management and automatic table assignment work correctly and safely before frontend integration.

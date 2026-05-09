# Menu Testing

## 1. Overview

This document contains the planned testing scenarios for the Whisk & Wonder menu management system.

Menu testing is currently prepared as a testing plan and will be updated after manual API testing or automated testing is completed.

---

## 2. Testing Goals

Menu testing aims to verify that:

- Public users can browse menu items
- Public users can browse menu packages
- Admin users can create menu items
- Admin users can update menu items
- Admin users can soft delete menu items
- Admin users can manage menu packages
- Non-admin users cannot access admin-only menu routes
- Menu categories are handled correctly

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

## 4. Planned Menu Item Test Cases

| Test Case                                    | Expected Result                   | Status  |
| -------------------------------------------- | --------------------------------- | ------- |
| Public user gets all menu items              | Menu item list returned           | Planned |
| Public user gets menu item by ID             | Menu item detail returned         | Planned |
| Admin creates menu item                      | Menu item created successfully    | Planned |
| Admin updates menu item                      | Menu item updated successfully    | Planned |
| Admin soft deletes menu item                 | Menu item marked inactive/deleted | Planned |
| Customer creates menu item                   | Request rejected                  | Planned |
| Create menu item with invalid category       | Request rejected                  | Planned |
| Create menu item with missing required field | Request rejected                  | Planned |

---

## 5. Planned Menu Package Test Cases

| Test Case                          | Expected Result                      | Status  |
| ---------------------------------- | ------------------------------------ | ------- |
| Public user gets all menu packages | Menu package list returned           | Planned |
| Public user gets package by ID     | Menu package detail returned         | Planned |
| Admin creates menu package         | Menu package created successfully    | Planned |
| Admin updates menu package         | Menu package updated successfully    | Planned |
| Admin soft deletes menu package    | Menu package marked inactive/deleted | Planned |
| Customer creates menu package      | Request rejected                     | Planned |

---

## 6. Admin Authorization Testing

Admin-only endpoints require:

```txt
Valid JWT token + ADMIN role
```

Expected error for non-admin access:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## 7. Category Testing

Valid categories:

```txt
sweet
savoury
drink
```

Invalid categories should be rejected.

---

## 8. Current Testing Status

| Area                        | Status              |
| --------------------------- | ------------------- |
| Manual menu item testing    | Planned             |
| Manual menu package testing | Planned             |
| Admin authorization testing | Planned             |
| Category validation testing | Planned             |
| Automated testing           | Not implemented yet |
| E2E testing                 | Planned             |

---

## 9. Future Testing Improvements

Future improvements may include:

- Automated Jest tests
- Menu filtering tests
- Category sorting tests
- Package integration tests
- Public browsing load tests

---

## 10. Testing Goal

Menu testing ensures that public menu browsing and admin menu management work correctly before frontend integration.

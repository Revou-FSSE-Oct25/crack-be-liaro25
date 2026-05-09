# Menu Feature

## 1. Overview

The menu feature manages menu items and menu packages for the Whisk & Wonder reservation and ordering system.

The backend supports both public menu browsing and admin-only menu management operations.

The menu system is also prepared for future integration with the order system.

---

## 2. Feature Goals

The menu feature is designed to:

- Manage menu items
- Manage afternoon tea packages
- Support public menu browsing
- Support admin-only menu management
- Organize menu categories
- Prepare menu data for future order integration

---

## 3. Menu Management Scope

The menu management system includes:

- Create menu item
- Retrieve menu items
- Update menu item
- Soft delete menu item
- Create menu package
- Retrieve menu packages
- Update menu package
- Soft delete menu package

---

## 4. Public Menu Browsing

The backend supports public menu browsing without authentication.

Public endpoints include:

```txt
GET /menus/items
GET /menus/packages
```

This allows customers to browse available menu items and afternoon tea packages before creating reservations or orders.

---

## 5. Admin-only Menu Management

Menu management operations are restricted to admin users.

Protected operations include:

```txt
POST
PATCH
DELETE
```

Protection used:

```txt
✔ JwtAuthGuard
✔ RolesGuard
✔ ADMIN role validation
```

---

## 6. Menu Categories

The backend organizes menu items using categories.

Categories currently used:

```txt
sweet
savoury
drink
```

---

## 7. Package Preparation

The menu package system is prepared for future integration with:

- Order system
- Payment system
- Reservation pre-order flow

---

## 8. Related Documentation

More detailed documentation is separated into:

```txt
02_CATEGORY_FEATURE.md
03_MENU_API_FLOW.md
04_MENU_TESTING.md
```

---

## 9. Feature Goal

The menu feature is designed to provide organized menu management and future-ready integration for the Whisk & Wonder ordering system.

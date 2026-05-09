# Category Feature

## 1. Overview

The category feature organizes menu items into structured groups for easier menu management and public browsing.

Categories help customers browse menu items more clearly and help the backend organize menu data consistently.

---

## 2. Feature Goals

The category feature is designed to:

- Organize menu items
- Improve menu browsing
- Simplify menu filtering
- Support future frontend category display
- Maintain consistent menu structure

---

## 3. Categories Used

The backend currently supports the following categories:

```txt
sweet
savoury
drink
```

---

## 4. Category Description

| Category | Description                            |
| -------- | -------------------------------------- |
| sweet    | Desserts and sweet afternoon tea items |
| savoury  | Savoury snacks and light meals         |
| drink    | Tea, coffee, and beverages             |

---

## 5. Example Menu Structure

```txt
sweet
→ Matcha Cheesecake
→ Strawberry Tart
→ Chocolate Macaron

savoury
→ Mini Sandwich
→ Quiche
→ Smoked Salmon Puff

drink
→ Earl Grey Tea
→ Matcha Latte
→ Coffee
```

---

## 6. Category Usage

Categories are used for:

- Public menu browsing
- Menu organization
- Menu filtering
- Future frontend display grouping
- Future order system integration

---

## 7. Category Validation

Menu items should only use supported category values.

Valid category examples:

```txt
sweet ✔
savoury ✔
drink ✔
```

Invalid category examples:

```txt
food ✘
tea ✘
dessert ✘
```

---

## 8. Future Improvements

Potential future improvements:

- Dynamic category management
- Admin-created categories
- Category image support
- Category sorting
- Category filtering API

---

## 9. Feature Goal

The category feature is designed to provide organized and scalable menu grouping for the Whisk & Wonder platform.

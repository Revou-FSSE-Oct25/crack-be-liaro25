# Order & Payment Testing

## 1. Overview

This document contains the planned testing scenarios for the Whisk & Wonder order and payment system.

Testing is currently prepared as a testing plan and will be updated after manual API testing or automated testing is completed.

---

## 2. Testing Goals

Order and payment testing aims to verify that:

- Customers can create orders linked to reservations
- Duplicate orders for the same reservation are prevented
- Order totals are calculated correctly
- Customers can only access their own orders
- Admin users can manage all orders
- Payments are connected to orders
- Overpayments are prevented
- Payment status updates work correctly

---

## 3. Planned Order Test Cases

| Test Case                                          | Expected Result            | Status  |
| -------------------------------------------------- | -------------------------- | ------- |
| Customer creates order with valid reservation      | Order created successfully | Planned |
| Customer creates duplicate order for reservation   | Request rejected           | Planned |
| Customer creates order with invalid reservation ID | Request rejected           | Planned |
| Customer creates order with invalid menu item      | Request rejected           | Planned |
| Customer gets own orders                           | Own order list returned    | Planned |
| Customer accesses another user's order             | Request rejected           | Planned |
| Admin gets all orders                              | Order list returned        | Planned |
| Admin updates order status                         | Order status updated       | Planned |
| Customer cancels own order                         | Order cancelled            | Planned |

---

## 4. Planned Payment Test Cases

| Test Case                                | Expected Result                    | Status  |
| ---------------------------------------- | ---------------------------------- | ------- |
| Customer creates full payment            | Payment created successfully       | Planned |
| Customer creates deposit payment         | Payment created successfully       | Planned |
| Customer overpays order                  | Request rejected                   | Planned |
| Customer pays invalid order              | Request rejected                   | Planned |
| Customer gets own payments               | Own payment list returned          | Planned |
| Customer accesses another user's payment | Request rejected                   | Planned |
| Admin gets all payments                  | Payment list returned              | Planned |
| Admin refunds payment                    | Payment status updated to refunded | Planned |
| Admin marks payment as failed            | Payment status updated to failed   | Planned |

---

## 5. Current Testing Status

| Area                         | Status              |
| ---------------------------- | ------------------- |
| Manual order testing         | Planned             |
| Manual payment testing       | Planned             |
| Admin authorization testing  | Planned             |
| Ownership validation testing | Planned             |
| Automated testing            | Not implemented yet |
| E2E testing                  | Planned             |

---

## 6. Future Testing Improvements

Future improvements may include:

- Automated Jest tests
- E2E order and payment flow testing
- Payment edge case testing
- Duplicate order testing
- Overpayment testing
- Ownership security testing

---

## 7. Testing Goal

Order and payment testing ensures that customer ordering, admin order management, and payment tracking work correctly before frontend integration.

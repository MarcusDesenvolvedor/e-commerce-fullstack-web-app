# 🧠 Business Logic
**E-commerce Fullstack Web App**

This document defines the **business rules, behaviors, constraints, and responsibilities** of the system.

It is the **single source of truth** for how the product must behave. Any implementation that contradicts this document is considered incorrect.

---

## 🎯 1. System Purpose

The system enables **online shoppers** to:

- Browse and search products
- Add items to cart
- Complete purchases
- View order history
- Manage profile and addresses

The product is a **professional e-commerce solution** for portfolio demonstration with room for future scaling.

---

## 👤 2. System Actors

### 2.1 User (Customer)
A person who uses the application to browse and buy products.

Logical types:
- Guest (anonymous visitor)
- Authenticated customer

### 2.2 Product
A catalog item that can be purchased.

### 2.3 Order
A purchase made by an authenticated user.

---

## 📂 3. Category Rules

- Every product may belong to **zero or one category**.
- Categories may be hierarchical (parent-child).
- Only active categories should be used for filtering.
- Category slug must be unique and URL-friendly.

---

## 🛍️ 4. Product Rules

- Every product:
  - Must have a name, slug, price.
  - May have a category, description, image, stock.
- A product can be:
  - Active (visible in catalog)
  - Inactive (hidden from catalog)
- Only active products may:
  - Appear in product listing and search.
  - Be added to cart.
- Price and stock must be non-negative.
- Stock must be validated when adding to cart and during checkout.
- Product slug must be unique.

---

## 🛒 5. Cart Rules

- A cart may belong to:
  - An authenticated user (persisted)
  - A guest (session-based)
- A user or session should have **one active cart** at a time.
- Cart items must:
  - Reference an active product.
  - Have positive quantity.
  - Not exceed available stock.
- One product per cart: updating quantity replaces, does not duplicate.
- Cart can be emptied or merged (e.g., guest cart → user cart on login).

---

## 📦 6. Order Rules

### 6.1 Order Creation

- Every order:
  - Must belong to an **authenticated user**.
  - Must have shipping address.
  - Must have at least one order item.
- Order total:
  - Must equal sum of (quantity × unitPrice) for all items.
  - Must be non-negative.
- On order creation:
  - Stock is reserved/decremented.
  - Order items store product snapshot (name, price).
  - Order status starts as PENDING or CONFIRMED.

---

### 6.2 Order Status

- Possible statuses:
  - PENDING
  - CONFIRMED
  - SHIPPED
  - DELIVERED
  - CANCELLED
- Orders are **immutable** once confirmed:
  - Items cannot be added or removed.
  - Prices cannot be changed.
- Cancellation may restore stock (if implemented).

---

### 6.3 Order History

- Users may only view their own orders.
- Order history must be preserved for auditing.
- No hard delete of orders.

---

## 📊 7. Reporting Rules (Future)

The system may generate:

- Order count and totals by period
- Best-selling products
- Inventory reports

Rules:
- Reports must reflect only base data.
- No manual override of calculated values.

---

## 🔐 8. User and Access Rules

- A user must be authenticated to:
  - Place orders
  - View order history
  - Manage profile
- Guest users may:
  - Browse products
  - Add to cart (session-based)
  - Search and filter catalog
- Users may only:
  - View and modify their own orders, profile, and cart.

---

## 🧾 9. Consistency and Validation Rules

The system must ensure:

- No product with negative price or stock.
- No cart item with quantity > product stock.
- No order without user and shipping address.
- No order item with quantity ≤ 0 or negative unit price.
- Dates must not be in the future for order creation.
- Monetary values must be non-negative.

---

## 🔄 10. System Evolution Rules

The system must support future evolution, including:

- Payment integration (Stripe, etc.)
- Admin panel for products and orders
- Wishlist / favorites
- Product reviews
- Email notifications
- Inventory management

Such evolutions must **not violate or break existing business rules**.

---

## 🚫 11. Forbidden Behaviors

The system must never:

- Allow unauthenticated users to place orders.
- Expose order data of other users.
- Allow modification of confirmed orders.
- Allow adding out-of-stock products to cart.
- Permanently delete order history.
- Allow negative stock or prices.

---

## ✅ 12. Final Principle

> Every business rule must be implemented such that:  
> **If the code contradicts this document, the code is wrong.**

---

**Status:** Active  
**Type:** Business Source of Truth  
**Version:** 1.0

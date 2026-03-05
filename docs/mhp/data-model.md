# 🗂️ Data Model
**E-commerce Fullstack Web App**

This document defines the **domain data model** of the system based on:
- Requirements v1.0
- Business Logic v1.0
- Database Schema (`db-schema.sql`)

It describes **entities, attributes, relationships, and aggregates**. This model is technology-agnostic and represents the conceptual structure of the domain.

---

## 🎯 1. Purpose

The data model aims to:

- Represent all core business concepts
- Define ownership and boundaries between entities
- Guide ORM/entities creation in backend
- Support feature design and API contracts

---

## 🧩 2. Core Aggregates

The system is organized around the following aggregates:

- **User Aggregate** → identity and authentication
- **Category Aggregate** → product categorization
- **Product Aggregate** → catalog items
- **Cart Aggregate** → shopping cart with items
- **Order Aggregate** → purchase orders with line items
- **RefreshToken** → session persistence

Each aggregate has a single **root entity** responsible for consistency.

---

## 👤 3. User Aggregate

### Root: User

Represents a person authenticated in the system (customer).

**Attributes:**
- id (UUID)
- email
- passwordHash
- fullName
- isActive
- createdAt
- updatedAt
- deletedAt?

**Relationships:**
- User *has many* Carts
- User *has many* Orders
- User *has many* RefreshTokens

**Rules:**
- Email must be unique
- A user may be unauthenticated (guest) for cart operations

---

## 📂 4. Category Aggregate

### Root: Category

Represents a product category.

**Attributes:**
- id (UUID)
- name
- slug
- parentId?
- createdAt
- updatedAt
- deletedAt?

**Relationships:**
- Category *belongs to* Category (parent) (optional)
- Category *has many* Products

**Rules:**
- Slug must be unique
- Categories may be hierarchical via parentId

---

## 🛍️ 5. Product Aggregate

### Root: Product

Represents a catalog item for sale.

**Attributes:**
- id (UUID)
- categoryId?
- name
- slug
- description?
- price
- stock
- imageUrl?
- isActive
- createdAt
- updatedAt
- deletedAt?

**Relationships:**
- Product *belongs to* Category (optional)
- Product *has many* CartItems
- Product *has many* OrderItems

**Rules:**
- Must belong to at most one Category
- Price and stock must be non-negative
- Only active products are visible in catalog
- Slug must be unique

---

## 🛒 6. Cart Aggregate

### Root: Cart

Represents a shopping cart.

**Attributes:**
- id (UUID)
- userId? (authenticated user)
- sessionId? (guest user)
- createdAt
- updatedAt

**Relationships:**
- Cart *belongs to* User (optional)
- Cart *has many* CartItems

**Rules:**
- Cart must have either userId or sessionId
- A user/session may have one active cart at a time

---

## 📦 7. CartItem

Represents an item in a cart.

**Attributes:**
- id (UUID)
- cartId
- productId
- quantity
- createdAt

**Relationships:**
- Belongs to Cart
- Belongs to Product

**Rules:**
- Quantity must be positive
- Product must be in stock
- One product per cart (update quantity instead of duplicate rows)

---

## 📋 8. Order Aggregate

### Root: Order

Represents a purchase order.

**Attributes:**
- id (UUID)
- userId
- status (PENDING | CONFIRMED | SHIPPED | DELIVERED | CANCELLED)
- total
- shippingAddress
- createdAt
- updatedAt

**Relationships:**
- Order *belongs to* User
- Order *has many* OrderItems

**Rules:**
- Must belong to exactly one User (authenticated)
- Total must be non-negative
- Orders are immutable once confirmed (no modification of items)

---

## 🧾 9. OrderItem

Represents a line item in an order.

**Attributes:**
- id (UUID)
- orderId
- productId
- quantity
- unitPrice
- createdAt

**Relationships:**
- Belongs to Order
- Belongs to Product

**Rules:**
- Quantity must be positive
- unitPrice captures price at moment of order
- Order items are immutable

---

## 🔐 10. RefreshToken

Represents session persistence for authentication.

**Attributes:**
- id (UUID)
- userId
- token
- expiresAt
- revoked
- createdAt

**Relationships:**
- Belongs to User

**Rules:**
- Token must be unique
- Can be revoked

---

## 🧭 11. Key Relationships Overview

- User → Carts → many (one active per user/session)
- User → Orders → many
- Category → Products → many
- Product → CartItems → many
- Product → OrderItems → many
- Cart → CartItems → many
- Order → OrderItems → many
- User → RefreshTokens → many

All transactional entities (**Cart, Order**) are scoped by **User** (or session for guests).

---

## 🧾 12. Invariants

The following invariants must always hold:

- No Product with negative price or stock
- No Cart without userId or sessionId
- No Order without a User
- No OrderItem without Order and Product
- No CartItem without Cart and Product
- Stock reservation enforced at order creation

---

## ✅ 13. Final Note

> This data model defines **what exists** in the domain and **how entities relate**.
> It must remain consistent with the Business Logic and database schema.

---

**Status:** Active  
**Type:** Domain Data Model  
**Version:** 1.0

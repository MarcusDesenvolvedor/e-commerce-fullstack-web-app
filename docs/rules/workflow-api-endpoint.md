# 🔄 Workflow — API Development
**E-commerce Fullstack Web App**

This document defines the **step-by-step workflow and rules** for developing API endpoints in the backend.

It must be followed whenever creating or modifying any API-related code.

---

## 🎯 1. Purpose

Ensure that every API endpoint:

- Follows the defined Architecture
- Respects the Business Logic
- Uses the Data Model correctly
- Complies with Coding Rules
- Is consistent, predictable, and maintainable

---

## 🧱 2. Technology Context

This workflow assumes:

- Next.js API Routes (or Node + Express)
- TypeScript
- RESTful APIs
- JWT-based or Clerk authentication

---

## 📌 3. Before Creating an Endpoint

Before writing any code, ensure you have:

- The **Feature document** that describes the use case
- Access to:
  - Business Logic
  - Data Model
  - Architecture
  - Coding Rules

❗ Never create endpoints based only on intuition.

---

## 🛠️ 4. API Creation Steps

For each endpoint, follow these steps:

### Step 1 — Define the Use Case

- Clearly state:
  - What the endpoint does
  - Who can access it
  - Which company context it belongs to

---

### Step 2 — Define Route & Method

- Use REST conventions:
  - `GET` → retrieve
  - `POST` → create
  - `PUT/PATCH` → update
  - `DELETE` → remove
- Routes must be:
  - Plural
  - Resource-oriented

Example:
```
GET /api/products
POST /api/cart/items
POST /api/orders
```

---

### Step 3 — Define DTOs

- Create request and response DTOs
- Apply validation with `class-validator`
- DTOs must:
  - Validate all inputs
  - Never expose internal entities

---

### Step 4 — Implement Route Handler / Controller

Route handlers (API route functions or controllers) must:

- Only handle:
  - HTTP concerns
  - Auth guards
  - Input validation
- Must not contain business logic
- Delegate to application services

---

### Step 5 — Implement Application Service / Use Case

Services must:

- Implement the use case logic
- Orchestrate domain entities and repositories
- Enforce:
  - Authorization
  - Business rules

---

### Step 6 — Use Domain Entities

- Instantiate and manipulate entities
- Let entities enforce invariants
- Do not bypass domain rules

---

### Step 7 — Use Repositories

- Interact with persistence only through repositories
- Never access ORM directly in services

---

### Step 8 — Map Response

- Convert domain objects to response DTOs
- Never expose internal fields

---

### Step 9 — Handle Errors

- Use explicit exceptions:
  - NotFound
  - Forbidden
  - Validation
  - Conflict
- Map domain errors to HTTP errors

---

### Step 10 — Secure the Endpoint

- Apply:
  - Auth guards
  - Role checks
- Always validate company ownership

---

## 🔐 5. Authentication & Authorization

Every endpoint must:

- Require authentication (unless public by design)
- Extract user from JWT
- Validate that the user:
  - Belongs to the company
  - Has permission for the action

---

## 🧾 6. Authorization Rules

- User context must be extracted from auth (JWT/Clerk)
- All order and cart queries must be scoped by userId or sessionId
- Never trust client-provided IDs without ownership checks

---

## 📄 7. API Response Standards

Responses must:

- Use consistent JSON structure
- Include:
  - `data`
  - Optional `meta`
- Never leak stack traces

Example:
```json
{
  "data": { /* resource */ }
}
```

---

## ❌ 8. Forbidden Practices

- Business logic in controllers
- Skipping DTO validation
- Direct ORM access in controllers/services
- Returning entities directly
- Hard deleting business data
- Mixing company scopes

---

## 🧪 9. Testing Workflow

For each endpoint:

- Write tests for:
  - Success path
  - Authorization failures
  - Validation errors
- Mock external dependencies

---

## ✅ 10. Final Checklist

Before considering an endpoint done:

- [ ] DTOs defined and validated
- [ ] Controller thin and clean
- [ ] Use case implemented
- [ ] Business rules enforced
- [ ] Auth and role checks applied
- [ ] Errors handled
- [ ] Tests written
- [ ] Lint passes

---

## 🏁 11. Final Principle

> Every API endpoint is a contract.  
> Once published, it must remain stable and predictable.

---

**Status:** Active  
**Type:** API Development Workflow  
**Version:** 1.0


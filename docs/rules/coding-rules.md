# 🧩 Coding Rules
**E-commerce Fullstack Web App**

This document defines the **mandatory coding standards, principles, and conventions** for the project.

All code — backend and frontend — must strictly follow these rules. Any code that violates them must be refactored.

---

## 🎯 1. Purpose

The goals of these rules are:

- Ensure high code quality and maintainability
- Enforce consistency across the codebase
- Reduce bugs and technical debt
- Enable scalable team collaboration
- Keep the code aligned with the Architecture and Business Logic

---

## 🧠 2. Core Principles

All code must follow:

- **Clean Code** – readability over cleverness
- **SOLID** principles
- **KISS** – keep it simple
- **DRY** – no duplication
- **YAGNI** – build only what is needed
- **Explicit over implicit**

> Code is written for humans first, machines second.

---

## 🧱 3. General Rules

- Use **TypeScript** everywhere, no plain JavaScript
- Never use `any`
- Always prefer immutability
- Functions must be small and do one thing
- Avoid side effects
- Prefer pure functions when possible
- No commented-out code
- No TODOs without a task reference

---

## 📝 4. Naming Conventions

- Variables and functions: `camelCase`
- Classes and types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case.ts`
- React components: `PascalCase.tsx`

Names must be:
- Descriptive
- In English
- Domain-driven (based on Business Logic)

❌ Bad: `data`, `item`, `temp`
✅ Good: `orderTotal`, `cartItem`, `product`

---

## 🗂️ 5. Folder & File Organization

Follow the structure defined in **architecture.md**.

Rules:
- One main responsibility per folder
- No circular dependencies
- Shared code goes in shared/core layers
- Feature-specific code stays inside its feature

---

## ⚙️ 6. Backend Rules (Next.js API / Node)

### 6.1 Route Handlers / Controllers

- Handle only HTTP concerns
- No business logic
- Must:
  - Validate input via DTOs
  - Call application services
  - Map responses

---

### 6.2 Services / Use Cases

- Contain application logic
- One service per use case
- Must:
  - Be thin
  - Orchestrate domain logic

---

### 6.3 Domain / Entities

- Encapsulate business rules
- No framework dependencies
- Enforce invariants

---

### 6.4 DTOs & Validation

- Use Zod or `class-validator`
- All inputs must be validated
- DTOs must:
  - Represent API contracts only
  - Never leak domain entities

---

### 6.5 Repositories

- Abstract data access
- No business logic
- Interfaces in domain, implementations in infra

---

### 6.6 Dependency Injection

- Always depend on interfaces
- Never instantiate dependencies manually

---

## 🎨 7. Frontend Rules (Next.js + React)

### 7.1 Components

- Must be:
  - Small
  - Focused
  - Reusable
- No business logic inside UI components

---

### 7.2 Hooks

- Encapsulate logic and state
- One responsibility per hook
- Names must start with `use`

---

### 7.3 State Management

- Prefer:
  - React Query for server state
  - Local state for UI-only state
- No duplicated sources of truth

---

### 7.4 Forms & Validation

- Validate before submit
- Show clear user errors

---

## 🔐 8. Security Rules

- Never store secrets in code
- Never log sensitive data
- Always:
  - Hash passwords
  - Use HTTPS
  - Validate auth tokens

---

## 🧾 9. Error Handling

- Never swallow errors
- Use:
  - Domain errors
  - Application errors
  - HTTP errors
- Errors must:
  - Be explicit
  - Have clear messages

---

## 📊 10. Logging

- Log:
  - Important actions
  - Errors
- Never log:
  - Passwords
  - Tokens
  - Financial sensitive info

---

## 🧪 11. Testing Rules

- Critical business rules must be tested
- Prefer:
  - Unit tests for domain
  - Integration tests for use cases
- Tests must be:
  - Deterministic
  - Readable

---

## 🧹 12. Formatting & Linting

- Use Prettier
- Use ESLint
- No code is merged if lint fails

---

## 🚫 13. Forbidden Practices

- Using `any`
- God classes/components
- Business logic in controllers or UI
- Direct DB access outside repositories
- Copy-paste code
- Ignoring architecture boundaries

---

## ✅ 14. Final Principle

> If code violates these rules, it must be refactored — no exceptions.

---

**Status:** Active  
**Type:** Coding Standards & Rules  
**Version:** 1.0

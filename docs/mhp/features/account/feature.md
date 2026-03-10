# Feature: Account (Profile & Addresses)

**E-commerce Fullstack Web App**

## Purpose

Allow authenticated users to view their profile (including document and phone), manage saved shipping addresses, and use them at checkout.

## Main Use Cases

- User views profile (name, email, document, phone)
- User updates document (CPF/CNPJ) and phone
- User lists saved addresses (structured fields)
- User adds a new address
- User edits an existing address
- User deletes an address
- User selects saved address at checkout or adds new address at checkout

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/user | Get user profile (document, phone) |
| PATCH | /api/user | Update document, phone |
| GET | /api/addresses | List user's addresses (auth required) |
| POST | /api/addresses | Create address (auth required) |
| PATCH | /api/addresses/[id] | Update address (auth required, ownership) |
| DELETE | /api/addresses/[id] | Delete address (auth required, ownership) |

## Entities Used

- **User** — linked via Clerk (clerkId), document (CPF/CNPJ), phone
- **Address** — userId, street, neighborhood, number?, city, state (UF), country, complement?

## Address Model

| Campo | Tipo | Constraints |
|-------|------|-------------|
| street | String | max 100 |
| neighborhood | String | max 100 |
| number | Int (optional) | max 6 digits |
| city | String | max 100 |
| state | String | 2 chars (UF) |
| country | String | 2 chars (ISO) |
| complement | String (optional) | max 100 |

## UI Flows

1. User navigates to /account (protected)
2. Profile: name, email (Clerk), document (required), phone (optional)
3. Addresses: list with add/edit/delete; structured form
4. Checkout: no addresses → full form; with addresses → radio list + "Add new" option

## Business Rules (from business-logic.md)

- User must be authenticated to manage profile and addresses
- Users may only view and modify their own addresses
- Document (CPF/CNPJ) is required at checkout
- Phone is optional
- number and complement are optional in address
- state and country use fixed codes (UF, ISO)

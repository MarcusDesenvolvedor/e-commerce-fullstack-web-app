# Feature: Cart Management

**E-commerce Fullstack Web App**

## Purpose

Enable users (guest or authenticated) to add products to cart, update quantities, remove items, and view cart summary.

## Main Use Cases

- Add product to cart
- Update item quantity (within stock)
- Remove item from cart
- View cart with items and total

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/cart | Get cart with items |
| POST | /api/cart/items | Add or update item (body: productId, quantity) |
| PATCH | /api/cart/items | Update quantity (body: productId, quantity) |
| DELETE | /api/cart/items | Remove item (body: productId) |

## Entities Used

- **Cart** (userId or sessionId)
- **CartItem** (cartId, productId, quantity)
- **Product** (for price, stock validation)

## UI Flows

1. **Product page**: Add to cart button
2. **Cart page** (/cart): List items, quantity controls, remove, subtotal

## Business Rules (from business-logic.md)

- Cart: userId (auth) or sessionId (guest)
- One product per cart — update quantity, don't duplicate
- Quantity must not exceed product stock
- Quantity must be positive
- Only active products can be added

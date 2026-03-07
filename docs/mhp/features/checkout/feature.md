# Feature: Checkout

**E-commerce Fullstack Web App**

## Purpose

Allow authenticated users to complete a purchase by entering shipping address and confirming the order.

## Main Use Cases

- Authenticated user views checkout page
- User enters shipping address
- User confirms order
- Order is created, stock decremented, cart cleared
- User sees confirmation / redirect to order history

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/orders | Create order from cart (auth required) |

## Entities Used

- **Order** — userId, status, total, shippingAddress
- **OrderItem** — orderId, productId, quantity, unitPrice
- **Cart** — session cart with items
- **Product** — stock decrement
- **User** — linked via Clerk (clerkId)

## UI Flows

1. User clicks "Proceed to checkout" on cart page
2. Redirect to /checkout (protected)
3. Form: shipping address (required)
4. Order summary (items, total)
5. Place order button
6. On success: redirect to /orders/[id] or /orders with confirmation

## Business Rules (from business-logic.md)

- Order requires authenticated user
- Order requires shipping address
- Order must have at least one item
- Stock is decremented on order creation
- Order items store product snapshot (unit price at order time)
- Cart items are removed after order (or cart cleared)

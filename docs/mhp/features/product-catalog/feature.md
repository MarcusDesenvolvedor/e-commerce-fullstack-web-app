# Feature: Product Catalog

**E-commerce Fullstack Web App**

## Purpose

Enable users to browse the product catalog, filter by category, and view product details. No authentication required.

## Main Use Cases

- List all active products
- Filter products by category
- View product detail by slug
- List categories for filtering

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/products | List products (optional: ?categoryId=uuid) |
| GET | /api/products/[slug] | Get product by slug |
| GET | /api/categories | List categories |

## Entities Used

- **Product** (Data Model) — name, slug, price, description, imageUrl, stock, categoryId
- **Category** (Data Model) — name, slug

## UI Flows

1. **Catalog page** (/products): Grid of product cards, category filter sidebar/select
2. **Product detail** (/products/[slug]): Product image, name, price, description, add to cart (future)

## Business Rules (from business-logic.md)

- Only active products (isActive=true) in catalog
- Only products with deletedAt=null
- Price and stock must be non-negative
- Product slug must be unique

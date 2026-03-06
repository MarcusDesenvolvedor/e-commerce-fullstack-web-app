# E-commerce Fullstack Web App

Fullstack e-commerce web application built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Features product catalog, cart, checkout, and order history. Built as a portfolio project with clear architecture and documentation.

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL, Prisma ORM
- **Auth**: Clerk (planned)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   - Copy `.env.example` to `.env`
   - Set `DATABASE_URL` for your PostgreSQL database

3. **Apply database schema**
   ```bash
   npm run db:migrate
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `app/` — Next.js App Router pages
- `components/` — Shared UI components
- `features/` — Feature modules (product-catalog, cart, checkout, etc.)
- `lib/` — Utilities, Prisma client, Shadcn utils
- `docs/mhp/` — Requirements, schema, business logic
- `docs/rules/` — Architecture, workflows, coding rules

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:migrate` | Run migrations |

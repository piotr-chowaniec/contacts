# Contacts App Showcase

Welcome to the **Contacts App Showcase**! This monorepo demonstrates the same application built using different modern web development tools and frameworks.

## Deployment

All apps are deployed to **Vercel**. You can explore live demos for each implementation below:

- **Next.js**: [View Demo](https://contacts-nextjs-peach.vercel.app/)
- **Remix**: [View Demo](https://contacts-remix.vercel.app/)
- **TanStack Router**: [View Demo](https://contacts-tanstack-router.vercel.app/)
- **TanStack Start**: [View Demo](https://contacts-tanstack-start.vercel.app/)

## Project Structure

The monorepo contains the following implementations:

| Directory              | Description                                                          |
| ---------------------- | -------------------------------------------------------------------- |
| `apps/nextjs`          | The app built with [Next.js (App Router + RSC)](https://nextjs.org/) |
| `apps/remix`           | The app built with [Remix](https://remix.run/)                       |
| `apps/server`          | Express backend for `apps/tanstack-router` app                       |
| `apps/tanstack-router` | The app built with [TanStack Router](https://tanstack.com/router)    |
| `apps/tanstack-start`  | The app built with [TanStack Start](https://tanstack.com/start)      |

Each directory contains a fully functional implementation of the same app, complete with routing, data fetching, and user interactions.

| Directory       | Description                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------- |
| `shared/server` | Common server-side logic, built with [DrizzleORM](https://orm.drizzle.team/) and PostgreSQL. |
| `shared/ui`     | Reusable UI components and design system shared across all apps.                             |

Each app uses the common code in `shared/server` and `shared/ui` to ensure consistency and reduce duplication.

## Features

- **Contact CRUD**: Full create, read, update, and delete functionality for managing contacts.
- **Authentication with Clerk**: Secure and seamless user authentication implemented using [Clerk](https://clerk.dev/).
- **Nested Layouts**: Leverages nested layouts for better structure and reusability.
- **SearchParams for State Management**: Sort and filter contacts directly in `searchParams` to enable easier copy-pasting, sharing URLs, and managing app state.
- **TanStack Query**: Implements [TanStack Query](https://tanstack.com/query) for efficient cache management and improved data-fetching strategies. Skipped in Remix.

## Installation and Setup

This monorepo uses **pnpm** as the package manager and **Turborepo** for task orchestration. Node.js 24+ and pnpm are required.

**1. Install dependencies**

```bash
pnpm install
```

**2. Configure environment variables**

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

You will need:
- A PostgreSQL connection string (e.g. [Neon](https://neon.tech/))
- A [Clerk](https://clerk.com/) application — copy the Secret Key and Publishable Key from the Clerk dashboard

**3. Run database migrations**

```bash
pnpm --filter @contacts/server db:migrate
```

**4. Start the development servers**

```bash
pnpm dev          # all apps in parallel
pnpm dev:nextjs   # Next.js only (port 3000)
pnpm dev:remix    # Remix only (port 3001)
pnpm dev:tanstack-router  # TanStack Router only (port 3002)
pnpm dev:tanstack-start   # TanStack Start only (port 3003)
```

## E2E Testing

End-to-end tests are written with [Playwright](https://playwright.dev/) and live in the `e2e/` package. Tests run against all four apps simultaneously using the same `.env` as development.

**One-time browser installation** (only needed once per machine):

```bash
pnpm --filter e2e install:browsers
```

**Run all tests** (starts all dev servers automatically):

```bash
pnpm test:e2e
```

**Interactive UI mode** (Playwright test runner UI):

```bash
pnpm test:e2e:ui
```

Each test gets an isolated Clerk user created via the backend API and deleted on teardown. The Express server is started with `FORCED_NETWORK_LATENCY=0` for the duration of the test run.

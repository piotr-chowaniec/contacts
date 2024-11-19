# Contacts App Showcase

Welcome to the **Contacts App Showcase**! This monorepo demonstrates the same application built using different modern web development tools and frameworks.

## Deployment

All apps are deployed to **Vercel**. You can explore live demos for each implementation below:

- **Next.js**: [View Demo](https://contacts-nextjs.vercel.app/)
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

This monorepo uses **pnpm** as the package manager and **TurboRepo** for managing the monorepo structure. Make sure you have [pnpm](https://pnpm.io/) installed.

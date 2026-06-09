# Plan: Full Monorepo Dependency Update

> Source PRD: Dependency update — React 19, Vite 8, TS 6, Tailwind 4, React Router 7, and more

## Architectural decisions

Durable decisions that apply across all phases:

- **React version**: React 19 is the target for all apps and `shared/ui`. `tanstack-start` already runs React 19; all other packages align to it.
- **Node runtime**: `engines.node >= 24` (Node 24 LTS). No downgrade path.
- **Package manager**: pnpm workspace; `packageManager` field in root `package.json` must reflect the installed pnpm version.
- **Build verification gate**: After each phase, `pnpm build` (Turbo) must succeed across all packages and `tsc --noEmit` must pass in every affected package.
- **TypeScript**: TypeScript 6 is the target. All packages align to the same major.
- **Tailwind**: v4 CSS-first config. No `tailwind.config.js`/`tailwind.config.ts` files after Phase 5. Vite apps use `@tailwindcss/vite`; Next.js uses `@tailwindcss/postcss`.
- **Routing (Remix)**: `apps/remix` migrates to React Router v7. All `@remix-run/*` imports replaced by `react-router` / `@react-router/*`.
- **Database client**: `@neondatabase/serverless` replaces the deprecated `@vercel/postgres` in `shared/server`. Drizzle adapter updated accordingly.
- **Dev executor (server)**: `tsx` replaces `ts-node` in `apps/server`. No `ts-node` remains after Phase 8.
- **Next.js**: Stays on v15.x through Phase 11. v16 migration is Phase 13.
- **Version pinning**: When executing a phase, use a caret range pinned to the latest version available at that time (e.g. `^8.3.1`, not `^8.x` or bare `8.3.1`). The `^x` notation in this plan is shorthand for the target major only — always resolve the actual latest patch/minor and prefix with `^` in `package.json`.

---

## Phase 1: Drift fixes & housekeeping

**User stories**: 1, 3, 31, 32

### What to build

Align the low-hanging version mismatches that have no code impact and fix two config anomalies:

- Upgrade `dotenv` to `^17.x` in `shared/server` and `apps/server` (matching `tanstack-start`)
- Add a caret to `srvx` in `tanstack-start` and update to latest
- Change `engines.node` in the root `package.json` from `>=22` to `>=24`
- Update the `packageManager` field to the current installed pnpm version

No source code changes. Package manifests only.

### Acceptance criteria

- [ ] `dotenv` version is `^17.x` in all packages that declare it
- [ ] `srvx` has a caret range in `tanstack-start`
- [ ] Root `package.json` `engines.node` reads `>=24`
- [ ] `packageManager` field reflects the current pnpm version
- [ ] `pnpm install` completes without peer-dep warnings introduced by these changes
- [ ] `pnpm build` passes across all packages

---

## Phase 2: React 18 → 19

**User stories**: 4, 5

### What to build

Upgrade `react`, `react-dom`, `@types/react`, and `@types/react-dom` to React 19 in the four packages still on React 18: `apps/nextjs`, `apps/remix`, `apps/tanstack-router`, and `shared/ui`. After this phase React 19 is the single version across the entire monorepo.

### Acceptance criteria

- [ ] `react` and `react-dom` are `^19.x` in `apps/nextjs`, `apps/remix`, `apps/tanstack-router`, and `shared/ui`
- [ ] `@types/react` and `@types/react-dom` are `^19.x` in all packages that declare them
- [ ] No package in the workspace declares a React 18 dependency
- [ ] `pnpm build` passes across all packages
- [ ] Dev servers for `nextjs`, `remix`, and `tanstack-router` start without React version warnings

---

## Phase 3: Vite 7 → 8

**User stories**: 6, 7, 8

### What to build

Upgrade the Vite toolchain in all three Vite-based apps (`apps/remix`, `apps/tanstack-router`, `apps/tanstack-start`):

- `vite` → `^8.x`
- `@vitejs/plugin-react` → `^6.x`
- `vite-tsconfig-paths` → `^6.x`

Address any Vite 8 breaking changes in vite config files.

### Acceptance criteria

- [ ] `vite` is `^8.x` in all Vite apps
- [ ] `@vitejs/plugin-react` is `^6.x` where declared
- [ ] `vite-tsconfig-paths` is `^6.x` where declared
- [ ] `vite build` completes successfully in `apps/remix`, `apps/tanstack-router`, and `apps/tanstack-start`
- [ ] `vite dev` starts without errors in each app

---

## Phase 4: TypeScript 5 → 6

**User stories**: 2, 9

### What to build

Upgrade `typescript` to `^6.x` in all packages that declare it (`shared/server`, `shared/ui`, `apps/nextjs`, `apps/remix`, `apps/server`, `apps/tanstack-start`, and the root). Resolve any type errors surfaced by TypeScript 6's stricter checks.

### Acceptance criteria

- [ ] `typescript` is `^6.x` in every package that declares it
- [ ] `tsc --noEmit` passes in every package with a `tsconfig.json`
- [ ] No package references a TypeScript 5.x version
- [ ] `pnpm build` passes across all packages

---

## Phase 5: Tailwind v3 → v4

**User stories**: 10, 11, 12

### What to build

Migrate all frontend apps and `shared/ui` from Tailwind CSS v3 to v4. Run `npx @tailwindcss/upgrade` per app to automate the bulk of the config conversion, then manually verify and clean up:

- `tailwind.config.js`/`.ts` files replaced by CSS-first `@import "tailwindcss"` declarations
- `autoprefixer` removed from PostCSS configurations
- `apps/nextjs` PostCSS config updated to use `@tailwindcss/postcss`
- Vite apps updated to use `@tailwindcss/vite` plugin (replaces the PostCSS integration)
- `shared/ui` global stylesheet updated for v4 syntax

### Acceptance criteria

- [ ] `tailwindcss` is `^4.x` in all packages that declare it
- [ ] No `tailwind.config.js` or `tailwind.config.ts` files remain
- [ ] `autoprefixer` is removed from all PostCSS configs
- [ ] `apps/nextjs` uses `@tailwindcss/postcss` in its PostCSS config
- [ ] Vite apps use `@tailwindcss/vite` plugin in their Vite config
- [ ] `pnpm build` passes and CSS output renders correctly
- [ ] Dev servers render styled UI without visual regressions

---

## Phase 6: Clerk updates

**User stories**: 13, 14

### What to build

Update all Clerk SDK packages to their latest versions:

- `@clerk/nextjs` in `apps/nextjs`
- `@clerk/clerk-react` in `apps/tanstack-router`
- `@clerk/express` in `apps/server`
- `@clerk/tanstack-react-start` in `apps/tanstack-start` (0.26 → 1.x, a major bump)

`@clerk/remix` is intentionally **not** updated here — it will be replaced in Phase 7.

Address any breaking changes introduced by the Clerk major bump (`@clerk/tanstack-react-start` 0→1).

### Acceptance criteria

- [ ] All four Clerk packages are on their latest versions
- [ ] `@clerk/tanstack-react-start` is `^1.x`
- [ ] Authentication flow works in `apps/nextjs`, `apps/tanstack-router`, `apps/tanstack-start`, and `apps/server`
- [ ] `pnpm build` passes across all packages

---

## Phase 7: Remix → React Router v7

**User stories**: 15, 16, 17, 18

### What to build

Migrate `apps/remix` from the `@remix-run/*` package family to React Router v7:

- Replace `@remix-run/react`, `@remix-run/node`, `@remix-run/serve` with `react-router` and `@react-router/serve`
- Replace `@remix-run/dev` with `@react-router/dev`
- Replace `@clerk/remix` with `@clerk/react-router` and update Clerk integration accordingly
- Update the Vite config to use the React Router v7 Vite plugin
- Update all route file imports from `@remix-run/react` to `react-router`
- Update `rootAuthLoader` and Clerk SSR patterns to match `@clerk/react-router` API
- Add `@react-router/fs-routes` and create `app/routes.ts` with `export default flatRoutes() satisfies RouteConfig` — React Router v7 requires explicit routing strategy declaration via this file, unlike Remix v2 which had fs-based flat routing implicit and built-in

### Acceptance criteria

- [ ] No `@remix-run/*` packages remain in `apps/remix`
- [ ] `@clerk/remix` is removed; `@clerk/react-router` is installed
- [ ] All route files import from `react-router`, not `@remix-run/react`
- [ ] Vite config uses the React Router v7 plugin
- [ ] `@react-router/fs-routes` is installed and `app/routes.ts` exports `flatRoutes()`
- [ ] `vite build` succeeds for `apps/remix`
- [ ] Dev server starts; auth (sign-in/sign-out) works end-to-end
- [ ] All routes render correctly

---

## Phase 8: Express 4 → 5 + ts-node → tsx

**User stories**: 19, 20, 21

### What to build

Two changes in `apps/server` that naturally pair together:

1. Upgrade `express` from `^4.x` to `^5.x` (resolving the existing `@types/express@5` mismatch). Address any Express 5 breaking changes (async error handling changes, removed deprecated APIs).
2. Replace `ts-node` with `tsx`. Remove `ts-node` from devDependencies, add `tsx`, and update the `nodemon` dev script to invoke `tsx` as the executor.

### Acceptance criteria

- [ ] `express` is `^5.x` in `apps/server`
- [ ] `ts-node` is removed from `apps/server` devDependencies
- [ ] `tsx` is installed in `apps/server` devDependencies
- [ ] `nodemon` dev script uses `tsx` as the executor
- [ ] `pnpm dev` starts `apps/server` without errors
- [ ] `pnpm build` (tsc) succeeds for `apps/server`
- [ ] Express routes respond correctly (manual smoke test)

---

## Phase 9: Drizzle + @vercel/postgres → @neondatabase/serverless

**User stories**: 22, 23, 24

### What to build

Update the database layer in `shared/server`:

- Remove `@vercel/postgres`; add `@neondatabase/serverless`
- Upgrade `drizzle-orm` and `drizzle-kit` to their latest versions
- Update the Drizzle DB client instantiation to use the Neon serverless adapter instead of the Vercel Postgres adapter
- **After bumping drizzle-orm**: remove the `"ignoreDeprecations": "6.0"` + `"moduleResolution": "node10"` workaround from `shared/server/tsconfig.cjs.json` and replace with a non-deprecated resolution mode. drizzle-orm@0.36.4's CJS types have an internal dual-package type inconsistency that TypeScript 6 catches; newer drizzle-orm resolves this. See Phase 4 commit notes for full context.

### Acceptance criteria

- [ ] `@vercel/postgres` is removed from `shared/server`
- [ ] `@neondatabase/serverless` is installed in `shared/server`
- [ ] `drizzle-orm` and `drizzle-kit` are on their latest versions and kept in sync
- [ ] `shared/server/tsconfig.cjs.json` no longer uses `ignoreDeprecations: "6.0"` or `moduleResolution: "node10"`
- [ ] `pnpm build` passes for `shared/server`
- [ ] `drizzle-kit generate` and `drizzle-kit push` execute without errors
- [ ] Database queries succeed at runtime (apps that consume `shared/server` connect and read/write correctly)

---

## Phase 10: Zod v3 → v4

**User stories**: 25

### What to build

Upgrade Zod to `^4.x` in all packages that declare it: `shared/server`, `apps/nextjs`, `apps/tanstack-router`, and `apps/tanstack-start`. Resolve any breaking changes in schema definitions or error handling introduced by Zod v4.

### Acceptance criteria

- [ ] `zod` is `^4.x` in all packages that declare it
- [ ] No package references Zod v3
- [ ] `tsc --noEmit` passes in all affected packages
- [ ] Schema validation works correctly at runtime in all apps
- [ ] `pnpm build` passes across all packages

---

## Phase 11: Remaining major bumps

**User stories**: 26, 27, 28, 29

### What to build

Four isolated major-version bumps with contained blast radius:

- `tailwind-merge` 2 → 3 in `apps/tanstack-start`
- `immer` 10 → 11 in `apps/tanstack-router`
- `cross-env` 7 → 10 in `apps/server`
- `commander` 14 → 15 in root workspace (clean scripts)

Address any breaking changes in each package's changelog.

### Acceptance criteria

- [ ] `tailwind-merge` is `^3.x` in `apps/tanstack-start`
- [ ] `immer` is `^11.x` in `apps/tanstack-router`
- [ ] `cross-env` is `^10.x` in `apps/server`
- [ ] `commander` is `^15.x` in root
- [ ] `pnpm build` passes across all packages
- [ ] `apps/server` dev script still works with the new `cross-env`
- [ ] Root clean scripts execute without errors

---

## Phase 12: Patch/minor sweep

**User stories**: 30, 31, 32

### What to build

Run `pnpm outdated --recursive` to get the authoritative list of what remains, then bump every package that is behind within its current major. The list below is a starting point — treat the `outdated` output as the source of truth and upgrade anything it surfaces, not just what is listed here:

- `@biomejs/biome`
- `turbo`
- `@tanstack/react-query`, `@tanstack/react-router`, `@tanstack/react-start`, `@tanstack/react-devtools`, `@tanstack/react-query-devtools`, `@tanstack/router-devtools`
- `postcss`, `isbot`, `cors`, `nodemon`
- `@types/lodash`, `@types/react`, `@types/react-dom`, `@types/node`, `@types/cors`, `@types/morgan`, `@types/express`
- Any other packages showing patch/minor drift

Run `pnpm format-and-lint` after the Biome bump to catch any formatting changes introduced by the updated linter. Intentionally deferred packages (Next.js, held for Phase 13) are the only acceptable entries still shown by `pnpm outdated` at the end of this phase.

### Acceptance criteria

- [ ] `pnpm outdated --recursive` is run first and its output drives which packages are updated
- [ ] All patch/minor-lagging packages (within their current major) are brought to latest
- [ ] `pnpm outdated --recursive` returns an empty table, or lists only intentionally-deferred packages (Next.js)
- [ ] `pnpm build` passes across all packages
- [ ] `pnpm format-and-lint` passes with zero errors
- [ ] `tsc --noEmit` passes in all packages

---

## Phase 13: Next.js v15 → v16

**User stories**: TBD

### What to build

Upgrade `apps/nextjs` from Next.js v15 to v16. Follow the official Next.js upgrade guide and codemods:

- Run `npx @next/codemod@latest upgrade latest` to apply any automated migrations
- Update `next` and `eslint-config-next` to `^16.x`
- Update `@tailwindcss/postcss` and any other Next.js-adjacent dependencies that require a matching bump
- Address breaking changes in the App Router, Turbopack, or any other areas flagged by the codemod or type checker
- Verify `@clerk/nextjs` compatibility with Next.js 16 and update if a new version is required
- Remove any Next.js 15 workarounds or feature flags that are no longer needed

### Acceptance criteria

- [ ] `next` is `^16.x` in `apps/nextjs`
- [ ] `eslint-config-next` is updated to match the Next.js 16 major
- [ ] No Next.js 15-specific workarounds remain in the codebase
- [ ] `pnpm build` passes for `apps/nextjs`
- [ ] Dev server starts without warnings
- [ ] Auth (Clerk), routing, and data fetching work end-to-end in the Next.js app

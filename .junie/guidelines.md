Smart Kitchen Assistant — Development Guidelines

Audience: Advanced contributors to this repository (Vue 3 + Vite frontend, Express + Prisma backend, full TypeScript).

1. Build and Configuration

Frontend (Vite + Vue 3)

- Dev server: npm run dev (port 5173 by default). Uses Vite with @vitejs/plugin-vue.
- Build: npm run build (runs vue-tsc type-check then vite build). Preview with npm run preview.
- Type-check only: npm run type-check.
- Lint/format: npm run lint and npm run format.
- Module resolution: src is aliased as @ via vite.config.ts (resolve.alias). Unplugin auto-import/components generate auto-imports.d.ts and components.d.ts at repo root.
- Vuetify: vuetify.js sets defaultTheme: 'dark'. Be mindful of dark tokens and CSS variables.
- i18n: src/i18n contains locales (en.json, de.json) and an index.ts exposing useI18n. Keep keys consistent across locales.

Backend (Express + Prisma)

- Dev server: cd backend && npm run dev (ts-node-dev --respawn --transpile-only index.ts). Default port: 3000. CORS origin is http://localhost:5173.
- Environment: Requires DATABASE_URL in backend/.env (PostgreSQL). Example:
  DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/ska?schema=public"
- Prisma: Schema at backend/prisma/schema.prisma. Usual workflow:
  - npx prisma generate
  - npx prisma migrate dev --name init
  - Optional seed (no seed script currently in repo).
- API routers: backend/routes includes recipe, ingredient, user, shoppingList, stock, auth. Cookie-based auth with userId cookie; no hashing in current implementation.

Cross-cutting

- Frontend expects backend at http://localhost:3000 with credentials and CORS enabled.
- TypeScript configurations: tsconfig.json and tsconfig.app.json tuned for Vite/Vue; backend has its own TS toolchain via ts-node-dev.

2. Testing

Current state

- No formal test runner is configured in either workspace (no Vitest/Jest). Linting + type-checking are the primary safety nets.

Option A — Quick smoke check (Bash, no external deps)

- Purpose: Validate repo wiring (scripts, Prisma presence) quickly.
- Example: tests/smoke.sh
  - Content (executable Bash script):
    #!/usr/bin/env bash
    set -euo pipefail
    grep -q '"dev":.*vite' package.json
    grep -q '"build":.*vite' package.json
    [ -f backend/index.ts ]
    grep -q 'ts-node-dev' backend/package.json
    grep -q 'datasource db' backend/prisma/schema.prisma
    grep -q 'env("DATABASE_URL")' backend/prisma/schema.prisma
    echo "✔ smoke test passed"
  - Run: bash tests/smoke.sh

Notes:

- This is intentionally dependency-free and can be used as a minimal sanity check. In CI, run it before building.
- After validating locally, remove the tests directory to keep the repo clean (e.g., rm -rf tests).

Option B — Recommended: Vitest for unit tests (frontend)

- Install (workspace root):
  npm i -D vitest @vitest/coverage-v8 jsdom
- Add to package.json scripts:
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:cov": "vitest run --coverage"
- Minimal config (vite.config.ts already works for Vitest in most Vue setups). If needed, add test section:
  import { defineConfig } from 'vite';
  export default defineConfig({
  test: { environment: 'jsdom', globals: true },
  });
- Example test (src/composables/useValidation.test.ts):
  import { describe, it, expect } from 'vitest';
  import { useValidation } from '@/composables/useValidation';
  describe('useValidation', () => {
  it('validates required strings', () => {
  const { validateRequired } = useValidation();
  expect(validateRequired('', 'Name').isValid).toBe(false);
  expect(validateRequired('ok', 'Name').isValid).toBe(true);
  });
  });
- Run tests: npm test. For coverage: npm run test:cov.

Option C — Supertest + ts-node-dev (backend HTTP tests)

- Install in backend:
  cd backend && npm i -D vitest supertest @types/supertest
- Example (backend/tests/auth.test.ts):
  import { describe, it, expect } from 'vitest';
  import request from 'supertest';
  import app from '../index'; // adjust to export app from index.ts
  describe('auth', () => {
  it('rejects invalid login', async () => {
  const res = await request('http://localhost:3000').post('/api/auth/login').send({ username: 'x', password: 'y' });
  expect([400, 401]).toContain(res.status);
  });
  });
- You will need to refactor backend/index.ts to export app and start the listener conditionally when run directly.

3. Adding and Running New Tests

- Frontend unit tests (Vitest): place \*.test.ts next to the code under src; import via @ alias. Prefer testing composables and stores where side effects are limited.
- Backend integration tests: prefer spinning a test DB (PostgreSQL) and using Prisma migrate dev to a separate schema. Use transaction rollbacks or per-test schema to isolate.
- E2E: If adding Playwright/Cypress later, run backend on port 3000 and frontend on 5173; configure baseURL and storageState for auth flows.

4. Development Notes and Conventions

- Code style: ESLint (flat) with eslint-plugin-vue, TypeScript rules, and Prettier skip-formatting. Use npm run lint before commits.
- Auto-imports: Vite plugins generate types (auto-imports.d.ts, components.d.ts). Commit generated d.ts files to keep IDE happy; ensure paths remain stable. If aliases change, delete and regenerate those d.ts files (restart dev server or re-run build).
- Module alias: Use @ for imports from src to avoid brittle relative paths.
- Theming: Vuetify defaultTheme is dark; prefer tokens/variables defined in src/assets/styles and Vuetify theme rather than hard-coded colors.
- i18n: Keep en.json and de.json key sets aligned. Avoid in-component hard-coded strings; use t('key.path'). For dynamic values, prefer ICU syntax in the JSON.
- Backend auth: Current implementation stores plaintext passwords and sets a userId cookie (httpOnly, lax). If you work on auth, plan to add hashing (bcrypt) and proper session/token handling.
- Prisma schema caveat: schema.prisma references Ingredient in relations, but only FullIngredient model is defined. Investigate whether Ingredient was renamed to FullIngredient or is missing. This mismatch may break migrations/queries and should be fixed before heavy backend work.
- CORS: backend/index.ts allows origin http://localhost:5173 with credentials. If you change ports or dev hosts, update the origin accordingly.

5. Local Dev Workflow

- Start backend: ensure backend/.env with DATABASE_URL; run: cd backend && npx prisma generate && npm run dev.
- Start frontend: npm run dev and browse http://localhost:5173.
- Lint/type-check: npm run lint && npm run type-check.
- Build artifacts: dist/ is generated by Vite build; do not edit by hand.

6. CI Ideas (not implemented)

- Jobs: (1) install, lint, type-check, (2) Vitest unit tests (frontend), (3) backend tests with a matrix for Node LTS and a PostgreSQL service, (4) build. Cache node_modules and Prisma client.

Appendix A — Smoke Test Commands

- Bash: bash tests/smoke.sh
- Remember to remove the tests directory once validated (this repo does not track tests by default).

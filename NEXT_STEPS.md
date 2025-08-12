# Smart Kitchen Assistant — Next Steps and Refactor Opportunities

This document proposes concrete, incremental steps to improve code quality, resiliency, and developer experience. It prioritizes low‑risk items first.

## Quick wins (short term)

1) Normalize error messages in views using useStatus
- Current: Some places concatenate error objects directly (risking "[object Object]").
- Done as example: src/views/IngredientPage.vue now formats errors with `err instanceof Error ? err.message : String(err)`.
- Next: Apply the same pattern to other views and components that call services.

2) Ingredient types filename normalization plan
- Current: Types file is named with a typo: `src/types/ingriedientTypes.ts` and imported with that typo across the app.
- Plan:
  - Create a new `src/types/ingredientTypes.ts` mirroring interfaces (Ingredient, FullIngredient).
  - Stepwise update imports to the correct file name. Keep the old file temporarily re-exporting from the new file to avoid large churn; remove the old file after all imports are migrated.
- Benefit: Better discoverability and reduces confusion.

3) apiCallService hardening (non-breaking)
- Current: No check for non-2xx responses; always returns `response.json()` (may throw not-JSON, and swallows HTTP errors).
- Plan:
  - Check `response.ok`. If false, try to parse JSON error; else read text; throw an `Error` including status and message.
  - Keep request shape stable; callers already using try/catch will receive meaningful messages.
- Benefit: Consistent error handling surfaces real API errors to the UI.

4) i18n hygiene
- Action: Ensure keys used in code exist in both locales, especially errors like `errors.failedToLoadIngredients` and units like `units.piece`.
- Add any missing keys and keep sets aligned.

## Backend schema alignment (medium priority)

Prisma schema mismatch identified:
- `model FullIngredient` exists, but relations in `RecipeIngredient`, `ShoppingList`, and `Stock` refer to `Ingredient` (which is not defined). Example:
  - `ingredient   Ingredient @relation(fields: [ingredientId], references: [id])`
- This will break Prisma migrations/queries.

Proposed options (choose one and migrate):
1) Rename `FullIngredient` to `Ingredient`
   - Pros: Shorter, common naming.
   - Cons: Touches frontend types; consider keeping frontend name `FullIngredient` if that conveys “with macros” and map at API boundary.
2) Keep `FullIngredient`, update relations to that name
   - Change all relation fields to reference `FullIngredient`.

Suggested migration plan:
- Create a Prisma migration renaming/aligning the model and relations.
- Update backend CRUD (e.g., backend/prisma/crud/*) to the final name.
- Regenerate Prisma client and verify CRUD endpoints.

## Testing improvements

Option A — Smoke test (fast, dependency-free)
- Add `tests/smoke.sh` (Bash) to validate basic wiring (scripts, Prisma presence). Run locally in CI/WSL and delete afterwards if not desired in VCS.

Option B — Frontend unit tests with Vitest
- Dev deps: `npm i -D vitest @vitest/coverage-v8 jsdom` (workspace root).
- Scripts:
  - `"test": "vitest"`
  - `"test:ui": "vitest --ui"`
  - `"test:cov": "vitest run --coverage"`
- Start by testing small composables (e.g., useValidation).

Option C — Backend HTTP tests with Supertest
- Dev deps (backend): `cd backend && npm i -D vitest supertest @types/supertest`.
- Refactor `backend/index.ts` to export the Express app and start the server conditionally when run directly.

## Backend security and DX

- Authentication: Add password hashing (bcrypt) and avoid storing plaintext.
- CORS: Keep `http://localhost:5173` with credentials; if ports change, update origin.
- Express app export: `export default app;` and `if (require.main === module) app.listen(...)` to enable Supertest.

## Frontend consistency and UX

- Centralize loading and error state with `useStatus` across pages.
- Ingredient pages:
  - After create/update, consider reloading from server to ensure data freshness (avoid drift if server adds fields or normalization).
- Use @ alias everywhere; keep generated d.ts committed.
- Vuetify: continue using dark theme tokens/variables rather than hard-coded colors.

## Roadmap (suggested order)

1) Frontend: apiCallService error handling + i18n key audit.
2) Frontend: types filename normalization (create `ingredientTypes.ts`, update imports gradually).
3) Backend: Prisma model alignment (FullIngredient vs Ingredient) with migration; regenerate client; CRUD fixes.
4) Testing: Add Vitest for frontend; opt-in smoke test in CI.
5) Backend: Export app for tests; add Supertest scaffolding.
6) Security: Password hashing for users.

## Notes

- Keep changes incremental; avoid wide refactors in a single PR.
- Update README or this NEXT_STEPS.md as items are completed.

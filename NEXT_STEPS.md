## Quick wins (short term)

1) Normalize error messages in views using useStatus
- Current: Some places concatenate error objects directly (risking "[object Object]").
- Done as example: src/views/IngredientPage.vue now formats errors with `err instanceof Error ? err.message : String(err)`.
- Next: Apply the same pattern to other views and components that call services.

4) i18n hygiene
- Action: Ensure keys used in code exist in both locales, especially errors like `errors.failedToLoadIngredients` and units like `units.piece`.
- Add any missing keys and keep sets aligned.

## Frontend consistency and UX

- Centralize loading and error state with `useStatus` across pages.
- Ingredient pages:
  - After create/update, consider reloading from server to ensure data freshness (avoid drift if server adds fields or normalization).
- Use @ alias everywhere; keep generated d.ts committed.
- Vuetify: continue using dark theme tokens/variables rather than hard-coded colors.


# AGENTS.md

<!-- meemong-common v1 start -->
## Meemong shared working agreements

- Keep changes scoped to the requested problem and preserve unrelated user-authored work.
- Apply technically valid, low-risk review feedback in the current change when it improves the touched area.
- After refactoring, verify that names still match the domain intent and actual reuse scope.
- Follow the repository's existing architecture and reuse established shared building blocks and utilities before adding new abstractions.
- Never commit credentials, tokens, production data, or user personal information.
- Run the relevant checks for the changed area and report any check that could not be run.
<!-- meemong-common v1 end -->

## Project overview

This is a Next.js 15 webview embedded in the Meemong Flutter app. It provides hair-consultation posts, designer responses, and related chat flows. Authenticated routes receive a `userId` query parameter from the host app.

## Package manager and commands

Use npm and keep `package-lock.json` authoritative.

```bash
npm ci
npm run dev
npm run build
npm run lint
npm run format
npm run test -- --run
npm run test:coverage
```

Run focused tests with `npx vitest run <test-file>`.

## Architecture

The project follows Feature-Sliced Design:

```text
app > widgets > features > entities > shared
```

- A layer may import only from layers below it.
- Do not directly couple slices in the same layer.
- Keep route composition in `src/app/`, page-level composition in `src/widgets/`, interactions in `src/features/`, domain models in `src/entities/`, and domain-independent code in `src/shared/`.
- Use the `@/` alias for source imports and preserve each slice's public API when one exists.

## Documentation

Use `docs/README.md` as the index; detailed architecture, feature, and database documentation lives in `docs/architecture.md`, `docs/features/`, and `docs/database/`.

## Webview and authentication

- The Flutter host exposes native channels, while `src/app/layout.tsx` installs camelCase `window.*` compatibility functions that forward to them. When a host channel is unavailable, a compatibility function logs and performs no user-visible action.
- Detect bridge availability from the corresponding native host-channel object declared by the bridge boundary, never from a camelCase compatibility function. The layout installs compatibility functions unconditionally, so their presence does not prove that the native host is available.
- Keep new or changed native-channel access inside dedicated bridge adapters under `src/shared/lib/`. Adapters whose callers require a browser fallback must either perform it or report whether the native operation succeeded. An intentional browser no-op may remain void when that contract is explicit and tested.
- Define and test the intended browser path and failure contract for bridge-dependent user actions.
- Existing direct `window.*` calls from screen code are legacy migration candidates. Migrate them when the affected screen is next modified.
- Do not enumerate individual channel names in this document.
- `AuthProvider` logs in with the URL `userId`, stores the webview session in localStorage key `user_data`, and refreshes expired sessions. Brand web sessions use `web_user_data:${slug}` and must remain isolated from the webview session.
- User role values are `MODEL = 1` and `DESIGNER = 2`; preserve these numeric contracts when normalizing API data.
- A 403 response from the shared authenticated clients clears the applicable stored session and dispatches `AUTH_TOKEN_EXPIRED_EVENT`. Preserve that centralized flow instead of handling expiry in individual screens.
- Authenticated API traffic must go through the shared clients in `src/shared/api/client.ts`.

## Design system

- Add new Meemong design-system primitives alongside legacy components and migrate screens incrementally.
- Use `MeemongTypography` for new or migrated typography.
- Use semantic color tokens in screen code instead of primitive palette values.
- Reuse shared design-system components before creating screen-local variants.
- Import SVG assets as React components through the configured `@svgr/webpack` loader instead of rendering repository SVGs with `<img>`.

## Data and chat

- Use TanStack Query for server state, Zustand for client/UI state, and the existing form approach used by the touched feature.
- Preserve the Firestore database selection in `src/shared/lib/firebase.ts`: production uses `meemong-chat`, and all other environments use `meemong-dev`.
- Keep Firestore collection names and per-user channel metadata paths consistent with the existing chat stores and helpers.

## Verification

- Add or update tests for changed domain logic, helpers, stores, and API behavior.
- Run focused Vitest tests while iterating, then `npm run test -- --run`.
- Run `npm run lint`; also run `npm run build` for routing, configuration, bridge, or production-facing changes.

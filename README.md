# TV Show Dashboard

A dashboard for browsing IMDb's Top 250 TV shows, grouped by genre and sorted by rating, with a detail view and genre/rating/title filtering, built on the [IMDb236 RapidAPI](https://rapidapi.com/).

## Tech stack and why

| Choice | Reason |
|---|---|
| **Vue 3 + Composition API** (`<script setup>`) | Explicitly requested. Composition API keeps state, derived data, and lifecycle for a single concern colocated in one function, which is what makes the composable-layering approach below possible — an Options API component can't be composed the same way. |
| **TypeScript** | The API response is large and only partially used; a typed `RawTvShow` → `TvShow` mapping catches field-name mistakes (e.g. `primaryTitle` vs `title`) at compile time instead of at render time. |
| **Vite** | Already scaffolded, and pairs with Vitest for zero-config unit testing on the same transform pipeline. |
| **Pinia** | The official Vue 3 state store, explicitly requested. Used only for the `shows` domain (list, detail cache, search results) — nothing UI-only (filter/search input state) lives in the store. |
| **Vue Router** | Explicitly requested. Routes are lazy-loaded (`component: () => import(...)`) and named, so each page ships its own JS chunk. |
| **Axios** | Explicitly requested as the HTTP client; wrapped in one configured instance (`src/shared/api/httpClient.ts`) rather than called ad hoc, so the RapidAPI headers and base URL are set once. |
| **Tailwind CSS v4** | Already configured in the project. Utility classes only, no custom CSS beyond the single `@import "tailwindcss"` — kept deliberately minimal per the brief. |
| **Vitest + @vue/test-utils + happy-dom** | Same toolchain as Vite (no separate test runner/config to maintain), with a DOM environment light enough for component mount tests and snapshot tests without a real browser. |

## Architecture

### Feature-based folders

```
src/
  app/            # router wiring
  shared/          # cross-feature code: axios instance, env-derived config, generic composables, shared UI (navbar)
  features/
    shows/          # the shows domain: types, API, store, composables, components, views
      types/
      queries/       # only place that calls httpClient
      store/         # Pinia store — raw state only
      composables/    # data composable + pure derivations (grouping, genre options)
      pages/          # one composable per page/view
      components/
      views/
      mappers/        # raw API shape -> domain shape
      test/           # shared test fixtures
    about/
```

Each domain (`shows`, `about`) owns everything it needs; `shared/` only holds things more than one feature would otherwise duplicate (the HTTP client, env config, the debounce composable, the navbar).

### Why the extra composable layers, not "component calls Pinia store directly"

Every screen is wired through a fixed chain:

```
View  →  Page composable  →  Data composable  →  Pinia store  →  Query composable  →  httpClient (axios)
```

- **Query composable** (`queries/useShowsQuery.ts`) is the only place that touches `httpClient`. It knows the endpoints and request/response shapes, and returns already-mapped domain types.
- **Pinia store** (`store/shows.store.ts`) holds raw state only (`shows`, `status`, `error`, `showDetails`, `searchResults`, …) and calls the query composable inside its actions. No component ever calls the query composable directly.
- **Data composable** (`composables/useShowsData.ts`) is a thin `storeToRefs` wrapper — it's the *only* place that calls `useShowsStore()`. If the store were ever swapped for something else, this is the one file that would need to change.
- **Page composable** (`pages/useHomePage.ts`, `pages/useShowDetailPage.ts`) is one per screen. It composes the data composable with any pure derivations (`useGenreGroups`, `useGenreOptions`), owns page-level state (filter/search/sort refs) and lifecycle (`onMounted` fetch, `watch`-driven search), and returns exactly what that view's template needs.
- **View** (`HomeView.vue`, `ShowDetailView.vue`) calls only its page composable — no store, query, or axios import ever appears in a `.vue` file.

The payoff: each layer is independently testable (the query composable is tested with a mocked `httpClient`, `useGenreGroups` is tested with a plain ref, no store or component needed), and a view's template stays declarative — all the "how do we get this data" logic lives one layer down, not inline in `onMounted`.

### Data mapping

The RapidAPI response includes many fields the UI never uses (`thumbnails`, `productionCompanies`, `budget`, …). `types/showApi.types.ts` types only the raw fields actually read; `mappers/show.mapper.ts` renames/trims them into the domain `TvShow` type (`types/show.types.ts`) used everywhere else in the app. Nothing outside the query composable ever sees the raw API shape.

### Filtering, sorting, search

The default Home view is the Phase 1 behavior: shows grouped into horizontal genre rows (from the Top 250 list), each sorted by rating. Picking a genre, typing a title search, or changing the sort order switches to a flat, live-searched grid backed by the `/search` endpoint (`useHomePage.ts`'s `isFiltering` flag). Clearing all three returns to the grouped view. Title search is debounced via a generic `shared/composables/useDebounce.ts` (used nowhere else today, but written to be reusable).

## Environment variables

The API base URL, RapidAPI key, and RapidAPI host are read from env vars (`src/shared/config/api.config.ts`) rather than hardcoded, so the key isn't committed to git history — Vite inlines `VITE_*` vars at build time regardless, so this doesn't hide the key from the shipped bundle, it only keeps it out of source control.

```bash
cp .env.example .env
# then fill in VITE_RAPIDAPI_KEY (and VITE_API_BASE_URL / VITE_RAPIDAPI_HOST if different)
```

## Running the project

**Requirements:** Node.js 20.19+ / 22.12+ (Vite 8's minimum) — developed and tested on **Node v24.19.0** with **npm 11.17.0**.

```bash
npm install
cp .env.example .env      # fill in your RapidAPI key
npm run dev                # start the dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build      # type-check (vue-tsc) + production build to dist/
npm run preview    # serve the production build locally
npm run test        # run the unit/component/snapshot test suite (Vitest)
```

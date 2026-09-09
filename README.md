# TV Show Dashboard

A dashboard for browsing IMDb's Top 250 TV shows, grouped by genre and sorted by rating, with a detail view, genre/rating/title filtering, and bookmarking, built on the [IMDb236 RapidAPI](https://rapidapi.com/).

## Tech stack and why

| Choice | Reason |
|---|---|
| **Vue 3 + Composition API** (`<script setup>`) | Explicitly requested. Composition API keeps state, derived data, and lifecycle for a single concern colocated in one function, which is what makes the composable-layering approach below possible — an Options API component can't be composed the same way. |
| **TypeScript** | The API response is large and only partially used; a typed `RawTvShow` → `TvShow` mapping catches field-name mistakes (e.g. `primaryTitle` vs `title`) at compile time instead of at render time. |
| **Vite** | Already scaffolded, and pairs with Vitest for zero-config unit testing on the same transform pipeline. |
| **Pinia** | The official Vue 3 state store, explicitly requested. One store per domain (`shows`, `bookmarks`) holding only raw state — nothing UI-only (filter/search input state) lives in a store. |
| **Vue Router** | Explicitly requested. Routes are lazy-loaded (`component: () => import(...)`) and named, so each page ships its own JS chunk. |
| **Axios** | Explicitly requested as the HTTP client; wrapped in one configured instance (`src/shared/api/httpClient.ts`) rather than called ad hoc, so the RapidAPI headers and base URL are set once. |
| **Tailwind CSS v4** | Already configured in the project. Utility classes only, no custom CSS beyond the single `@import "tailwindcss"` — kept deliberately minimal per the brief. |
| **Vitest + @vue/test-utils + happy-dom** | Same toolchain as Vite (no separate test runner/config to maintain), with a DOM environment light enough for component mount tests and snapshot tests without a real browser. |

## Architecture

### Feature-based folders

```
src/
  app/            # router wiring
  shared/          # cross-feature code: axios instance, env-derived config, generic composables, shared UI (navbar), test helpers
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
      test/           # shared test fixtures (buildShow())
    bookmarks/       # the bookmarks domain — same layering, no query layer (see below)
      store/
      composables/
      pages/
      views/
    about/
```

Each domain (`shows`, `bookmarks`, `about`) owns everything it needs; `shared/` only holds things more than one feature would otherwise duplicate (the HTTP client, env config, the debounce composable, the navbar, the `withSetup` test helper).

### Why feature folders, not one `components/`, one `composables/`, one `store/` for the whole app

The alternative — a type-first layout with a single root `components/`, `composables/`, `store/`, `views/` holding every file regardless of domain — groups files by what they technically *are* instead of what they're *for*. It looks simpler at first (fewer top-level folders) but degrades as features are added:

- **Change locality.** Touching bookmarks in this layout means editing one folder, `features/bookmarks/`. In a type-first layout the same change touches `components/BookmarksView.vue`, `composables/useBookmarksData.ts`, `store/bookmarks.store.ts`, `views/BookmarksView.vue` — four folders, each also holding unrelated shows/about files you have to mentally filter out. That filtering cost grows with total app size, not with the feature being changed.
- **Feature deletability.** Removing bookmarks today means deleting one folder. In type-first, you'd have to hunt every type-folder for bookmarks-shaped files and hope none were missed — this is how type-first codebases accumulate dead code over time.
- **Visible coupling.** `useShowDetailPage.ts` reaching into `../../bookmarks/composables/useBookmarksData` is an explicit, greppable cross-feature import. In a flat `composables/` folder, borrowing another feature's composable looks identical to using your own — nothing signals that a cross-domain dependency was just created.
- **Parallel work.** Two people building two different features aren't both editing the same root `composables/`/`store/` folder, so there are fewer incidental merge conflicts.

The evidence from this codebase: adding bookmarks meant creating one new `features/bookmarks/` folder plus a couple of explicit cross-feature import lines into `shows/` — nothing pre-existing had to be reorganized to fit it in. That's the property that actually matters for scalability: the cost of adding feature *N+1* stays roughly constant, rather than growing with however many files already exist across the whole app.

The honest tradeoff: for a one- or two-component app, type-first is less nesting and genuinely simpler. It stops paying off once there's more than a couple of features — which was already this app's trajectory (shows → about → bookmarks, likely more later). Feature-first is the bet that an app keeps growing; it's not the right default for something that will stay small.

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

### API endpoints used

All three under `https://imdb236.p.rapidapi.com/api/imdb`, called only from `queries/useShowsQuery.ts`:

| Endpoint | Used by | Powers |
|---|---|---|
| `GET /top250-tv` | `fetchTopShows` | Home page's default genre-grouped view |
| `GET /{id}` | `fetchShowById` | Show detail page (and re-fetches for bookmarked shows not in the current list) |
| `GET /search?type=tvSeries&genre=&sortField=averageRating&sortOrder=&primaryTitleAutocomplete=&rows=25` | `searchShows` | Genre filter, rating sort, title search |

### Responsive / mobile-first

Tailwind's utilities are mobile-first by default — unprefixed classes apply at every width, `sm:`/`md:`/`lg:` only add overrides for wider viewports — so most of the UI needed no explicit breakpoint work at all. The two places breakpoints are actually used: `ShowGrid.vue`'s column count (`grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5`) and `ShowCard.vue`'s width inside a `GenreRow` (`w-32 sm:w-40`). Genre rows scroll horizontally (`overflow-x-auto`) rather than wrap, which works identically at any width without a breakpoint. No custom CSS or media queries anywhere — `style.css` is just `@import "tailwindcss";` — per the brief's "no fancy UI, minimal CSS" instruction.

### Data mapping

The RapidAPI response includes many fields the UI never uses (`thumbnails`, `productionCompanies`, `budget`, …). `types/showApi.types.ts` types only the raw fields actually read; `mappers/show.mapper.ts` renames/trims them into the domain `TvShow` type (`types/show.types.ts`) used everywhere else in the app. Nothing outside the query composable ever sees the raw API shape.

### Filtering, sorting, search

The default Home view is the Phase 1 behavior: shows grouped into horizontal genre rows (from the Top 250 list), each sorted by rating. Picking a genre, typing a title search, or changing the sort order switches to a flat, live-searched grid backed by the `/search` endpoint (`useHomePage.ts`'s `isFiltering` flag). Clearing all three returns to the grouped view. Title search is debounced via a generic `shared/composables/useDebounce.ts` (a debounced copy of a ref, using `watch`'s `onCleanup` to cancel a pending update — no manual timer bookkeeping).

### Bookmarks

A separate `features/bookmarks/` domain, following the same layering as `shows` minus the query layer — there's no API for it, it's pure client state. `bookmarks.store.ts` holds the bookmarked shows (full `TvShow` objects, not just ids, so a bookmark still renders even if the show later drops out of the Top 250 list or a search result) and persists them to `localStorage` under `tvshow.bookmarks` via a `watch`. No authentication: bookmarks are local to the browser. Toggling happens from the show detail page (`ShowDetail.vue`'s ★/☆ button); the `/bookmarks` route and nav link list everything bookmarked, reusing the same `ShowGrid` component the search results use.

## Trade-offs and known limitations

Decisions made deliberately, with a real cost attached — worth knowing before extending any of them:

- **The genre filter only offers genres it's actually seen.** There's no "list all genres" endpoint, so the `<select>` options come from `useGenreOptions`, derived from whatever's in the already-loaded Top 250 list. The `/search` endpoint itself covers a much larger catalog (tens of thousands of results for a genre like Drama alone) that may include genres the Top 250 never surfaces — those aren't selectable, even though the API would honor them.
- **Search results are a flat, uncapped-looking list that's actually capped at 25.** `rows=25` is a fixed request param; the response's `numFound` is routinely in the thousands. There's no pagination or infinite scroll — a real product would need one.
- **The show list and the show detail cache don't share data.** `shows.store.ts` keeps `shows` (the Top 250/search results) and `showDetails` (fetched-by-id) as two independent slices. Clicking a card always fetches that show again from `/api/imdb/{id}`, even though the same data just arrived via the list fetch. This was a deliberate choice — it means the detail page works for *any* id (including a bookmarked show that's no longer in the current list or search results) without needing to reconcile two data shapes — but it does mean a redundant network call on the common path.
- **Bookmarks don't sync anywhere.** They're `localStorage`-only, tied to the "no authentication for now" scope in the brief. Clearing site data, switching browsers, or using a private window loses them. Adding real persistence later would mean introducing an actual backend and auth, not a bigger localStorage schema.
- **An abstraction that got removed once it proved to have no reuse**: the genre/sort/search controls briefly lived in their own `ShowFilterBar.vue`, wired with `defineModel` for two-way binding. Once it was clear `HomeView.vue` was its only consumer and would stay that way, the component was deleted and the controls inlined directly into the view — the extra file and prop/emit indirection weren't earning their keep. Worth remembering next time a "reusable" component is extracted for something used exactly once.

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

## Testing

Every component, composable, and store has a test — 22 test files / 60 tests. A few conventions worth knowing before adding more:

- **Config is split**: `vite.config.ts` (app build: Vue + Tailwind plugins) and `vitest.config.ts` (tests: Vue plugin only, `environment: 'happy-dom'`). Combining them broke `.vue` file transforms under Vitest — the Tailwind v4 Vite plugin doesn't play well with Vitest's transform pipeline on this Vite/Vitest version pair. `vitest.config.ts` also sets `pool: 'forks'` and `fileParallelism: false`; without both, test runs on this Windows/Vite 8/Vitest 5 combination intermittently crashed with `Vitest failed to find the runner` on a cold cache. If you ever see that error, it's this — not your test.
- **Mocking rule**: each layer's test mocks only the layer directly beneath it (a store test mocks its query composable via `vi.mock('../queries/useShowsQuery', ...)`; a query test mocks `httpClient`; a page-composable or view test that goes through the real store also mocks the query composable — never mock two layers down).
- **`shared/test/withSetup.ts`**: composables that call `onMounted` (`useHomePage`, `useShowDetailPage`) only run that hook inside a real component instance, so their tests use this helper to mount them in a throwaway host component instead of calling them as plain functions. Composables with no lifecycle hooks (`useBookmarksPage`, `useShowsData`, …) are just called directly — no `withSetup` needed.
- **`features/shows/test/showFixture.ts`**: `buildShow(overrides?)` — one realistic `TvShow` fixture reused across test files instead of every file inlining its own sample object.
- **Style**: each `it()` sets up its own `mount(...)`/mocks inline rather than sharing a helper function or `beforeEach`-configured mock across tests in the same file — a test should be readable on its own. `beforeEach`/`afterEach` are reserved for plain resets (`setActivePinia(createPinia())`, `localStorage.clear()`, fake timers), never for data a test depends on.

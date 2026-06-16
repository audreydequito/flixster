
**Component Architecture:**

- **App:** 
    - Responsibility: Main component that holds all state and controls data flow
    - Renders: Header, SearchBar, SortControl, MovieList, Footer, and MovieModal (when a movie is clicked)
    - Manages any state: movies list, search text, current page, selected movie, sort choice, loading status, errors, AI recommendation
    - Parent-Child Hierarchy: Parent of MovieList, SearchBar, Header, Footer, SortControl, MovieModal

- **MovieList:** 
    - Responsibility: Shows all movies in a grid layout
    - Renders: A grid container with multiple MovieCard components
    - Props: movies (array), onMovieClick (function)
    - Manages any state: None
    - Parent-Child Hierarchy: Child of App. Parent of MovieCard

- **MovieCard:** 
    - Responsibility: Shows one movie with its poster, title, and rating
    - Renders: Movie poster image, title text, rating number
    - Props: movie (object with id, title, poster_path, vote_average), onClick (function)
    - Manages any state: None
    - Parent-Child Hierarchy: Child of MovieList

- **SearchBar:** 
    - Responsibility: Lets users search for movies by typing a title
    - Renders: Text input box, Search button, Clear button
    - Props: searchQuery (string), onSearchChange (function), onSearch (function), onClear (function)
    - Manages any state: None - the text value is controlled by App
    - Parent-Child Hierarchy: Child of App

- **MovieModal:** 
    - Responsibility: Shows detailed info about a movie when a MovieCard is clicked, plus an AI-generated "Watch Recommendation."
    - Renders: Large backdrop image, title, release date, runtime, genre tags, plot summary, AI recommendation block, close button. Shows a loading state while details fetch, and a friendly error message if the fetch fails.
    - Props: `movieDetails` (full details object or null), `isLoading` (boolean), `error` (string or null), `onClose` (function), favorite/watched flags + toggles.
    - Manages any state: `isTrailerExpanded`, plus the AI recommendation state — `aiInsight` (string or null) and `loadingInsight` (boolean). App still owns the modal-open/details state; the AI call is local to the modal (see AI Feature Spec for the rationale).
    - How it opens/closes: Opens when App's `selectedMovieId` is set (by a MovieCard click). Closes via the X button, clicking the backdrop overlay, or pressing Escape — each calls `onClose`, which clears `selectedMovieId` (and the fetched details/error) in App.
    - Parent-Child Hierarchy: Child of App

- **Header:** 
    - Responsibility: Shows the Flixster brand and logo at the top
    - Renders: App title "Flixster" with movie reel icons
    - Props: None
    - Manages any state: None
    - Parent-Child Hierarchy: Child of App

- **Footer:** 
    - Responsibility: Shows footer information at the bottom
    - Renders: Footer text or credits
    - Props: None
    - Manages any state: None
    - Parent-Child Hierarchy: Child of App

- **SortControl:** 
    - Responsibility: Lets users sort movies by title, date, or rating
    - Renders: Dropdown menu with sort options
    - Props: sortOption (string), onSortChange (function)
    - Manages any state: None - the selected value is controlled by App
    - Parent-Child Hierarchy: Child of App

List every component your app will need. For each component, define: responsibility (one sentence), what it renders, what props it receives, and whether it manages any state. Also document the parent-child hierarchy — which component renders which. Your list should include at minimum: App, MovieList, MovieCard, SearchBar, MovieModal, Header, Footer, and a sort control.


**API Contracts:** 

- **Now Playing Endpoint:**
    - URL: `https://api.themoviedb.org/3/movie/now_playing`
    - Parameters: `api_key` (your TMDb key), `page` (number for pagination)
    - Response fields used: `results` array with `id`, `title`, `poster_path`, `vote_average`, `release_date`
    - Errors to handle: Network failure (show "Failed to load movies"), invalid key (show "API error"), no results (show "No movies available")

- **Search Endpoint:**
    - URL: `https://api.themoviedb.org/3/search/movie`
    - Parameters: `api_key`, `query` (search text), `page` (for more results)
    - Response fields used: Same as Now Playing - `results` array with movie data
    - Errors to handle: Network failure, no matches found (show "No movies match your search"), empty search (don't call API)

- **Movie Details Endpoint:**
    - URL: `https://api.themoviedb.org/3/movie/{movie_id}` (the movie ID is a path parameter)
    - Parameters: `api_key` (query), `{movie_id}` (path)
    - Response fields used: `id`, `title`, `backdrop_path`, `overview`, `release_date`, `runtime`, `genres` (array of `{ id, name }`), `vote_average`
    - Errors to handle:
        - 404 movie not found → show "Movie details not found." in the modal
        - 401 bad API key → show "Unable to load details (API error)." in the modal
        - Network failure → show "Failed to load movie details." in the modal
        - In every error case the modal stays open and shows the message (not a broken/blank modal); closing it clears the error.


**State Architecture:**

- **movies** (array)
    - Initial value: `[]` (empty array)
    - Owner: App component
    - Update trigger: After fetching from Now Playing or Search API; when sorting is applied

- **searchQuery** (string)
    - Initial value: `""` (empty string)
    - Owner: App component
    - Update trigger: When user types in the search box

- **currentPage** (number)
    - Initial value: `1`
    - Owner: App component
    - Update trigger: When "Load More" button is clicked (goes up by 1); reset to `1` when searching or returning to Now Playing

- **totalPages** (number)
    - Initial value: `1`
    - Owner: App component
    - Update trigger: Set from the `total_pages` field on every API response; used to hide "Load More" once `currentPage >= totalPages`

- **mode** (string)
    - Initial value: `"nowPlaying"`
    - Owner: App component
    - Update trigger: Set to `"search"` when the user submits a search; set back to `"nowPlaying"` when the search is cleared. Tells "Load More" which endpoint to page against

- **selectedMovieId** (number or null)
    - Initial value: `null`
    - Owner: App component
    - Update trigger: Set to the movie's `id` when a MovieCard is clicked; cleared to `null` when the modal closes. This is the single source of truth for "is the modal open" — the modal renders when it is non-null.

- **movieDetails** (object or null)
    - Initial value: `null`
    - Owner: App component
    - Update trigger: Set after the Movie Details API returns for `selectedMovieId`; cleared to `null` when the modal closes. Passed to MovieModal as the `movieDetails` prop.

- **detailsLoading** (boolean)
    - Initial value: `false`
    - Owner: App component
    - Update trigger: `true` when the details fetch starts; `false` when it finishes. Passed to MovieModal so it can show a loading state.

- **detailsError** (string or null)
    - Initial value: `null`
    - Owner: App component
    - Update trigger: Set to a friendly message when the details fetch fails (404/401/network); cleared when a new fetch starts or the modal closes. Passed to MovieModal so it shows a message instead of a broken modal.

- **sortOption** (string)
    - Initial value: `"default"`
    - Owner: App component
    - Update trigger: When user picks a new option from the sort dropdown
    - Where the sort happens: The raw `movies` array is never mutated. App derives a sorted copy (`sortedMovies = [...movies]`) at **render time** based on `sortOption` and passes that copy to MovieList. Keeping `movies` untouched means Load More's append/pagination logic is unaffected. (Same category of operation as `parseForecastData` — a pure data transformation.)
    - Sort direction per option:
        - `"title"` → Title A→Z, ascending (`a.title.localeCompare(b.title)`)
        - `"release_date"` → Release date newest-first, descending (`new Date(b.release_date) - new Date(a.release_date)`)
        - `"vote_average"` → Vote average highest-first, descending (`b.vote_average - a.vote_average`)
        - `"default"` → no sort (TMDb's original order)

- **isLoading** (boolean)
    - Initial value: `false`
    - Owner: App component
    - Update trigger: `true` before API call starts; `false` after it finishes

- **error** (string or null)
    - Initial value: `null`
    - Owner: App component
    - Update trigger: Set to error message when API fails; cleared when new fetch succeeds

- **aiInsight** (string or null) — *revised: owner is MovieModal, not App (see AI Feature Spec)*
    - Initial value: `null`
    - Owner: MovieModal component
    - Update trigger: Set after the OpenRouter call returns for the open movie (success text or fallback); resets to `null` when the effect re-runs for a new movie / when the modal unmounts on close.

- **loadingInsight** (boolean) — *revised: owner is MovieModal, not App*
    - Initial value: `false`
    - Owner: MovieModal component
    - Update trigger: `true` when the AI call starts; `false` when it finishes.


**Data Flow:**

When the app loads, App fetches movies from the Now Playing API. The response has a `results` array with movie objects. This array goes straight into the `movies` state. App passes this array to MovieList, which maps over it and creates one MovieCard for each movie. Each MovieCard gets a movie object (with id, title, poster, rating) and a click handler.

When someone clicks a MovieCard, the click bubbles up through MovieList's `onMovieClick` to App's `handleMovieClick`, which stores the movie's `id` in `selectedMovieId`. A `useEffect` in App watches `selectedMovieId`: when it becomes non-null it fetches full details from the Movie Details API (using the id as a path parameter), setting `detailsLoading`/`detailsError` around the call and storing the result in `movieDetails`. The details give us runtime and genres, which the Now Playing/Search list objects don't include.

App owns the "modal is open" state — there is no separate boolean; the modal renders whenever `selectedMovieId` is non-null. App passes `movieDetails`, `detailsLoading`, `detailsError`, and `onClose` to MovieModal. `onClose` (fired by the X button, backdrop click, or Escape key) resets `selectedMovieId`, `movieDetails`, and `detailsError` so the next open starts clean. (In a later milestone App also sends the title, genres, and plot to the AI API and passes the recommendation to MovieModal.)

When searching, App sets `mode` to `"search"`, resets `currentPage` to 1, and calls the Search API with the search text. The results replace the `movies` state, so MovieList automatically shows the search results instead. "Load More" pages through whichever endpoint matches the current `mode` (Now Playing or Search), incrementing `currentPage` and appending the new results to the existing `movies` array; it is hidden once `currentPage >= totalPages`. Clearing the search (or clicking "Now Playing") resets `mode` to `"nowPlaying"` and `currentPage` to 1, then re-fetches the Now Playing list. Sorting renders a sorted copy of `movies` (derived at render time from `sortOption`); the raw `movies` array is left untouched.


**Responsive Breakpoints (Milestone 4):**

The MovieList uses a CSS Grid that reflows by viewport width:

- **Desktop (> 1024px):** `auto-fill` with `minmax(200px, 1fr)` — roughly 5-6 cards per row.
- **Tablet (600px – 1024px):** `auto-fill` with `minmax(160px, 1fr)` — roughly 3-4 cards per row, smaller gap/padding.
- **Mobile (< 600px):** fixed `repeat(2, 1fr)` — exactly 2 columns so posters stay legible and cards don't collapse to an unreadable width.

Cards never overflow: `.movie-card` uses `overflow: hidden`, posters are `width: 100%`, and titles are clamped to 2 lines.


**AI Feature Spec (Milestone 8 — finalized):**

A "Watch Recommendation" generated by an LLM appears inside MovieModal, alongside the
movie details, whenever a movie's modal is opened.

- **Display component:** MovieModal shows the AI recommendation in the info column, below the overview, under a "AI Watch Recommendation" label.

- **Prompt Spec:**
    - **Role (system message):** "You are an enthusiastic but honest film critic. You give quick, friendly watch recommendations that help a viewer decide if a movie fits their evening."
    - **Task (user message):** Write a 2–3 sentence watch recommendation for the given movie. Say who would enjoy it and why, based on its genres and premise.
    - **Inputs sent to the AI:**
        - `title` (string)
        - `genres` — comma-separated string (e.g. "Horror, Mystery")
        - `overview` — the plot summary string
    - **Output format:** Plain text, 2–3 sentences. No spoilers. No first-person "I" statements. No markdown, headings, or lists — just the sentences.
    - **Constraints (what the AI must avoid):**
        - No plot spoilers (don't reveal twists or the ending).
        - No comparisons to other films unless genuinely helpful for orienting the viewer.
        - No generic hype phrases like "this film is a must-see" or "a cinematic masterpiece."
        - Don't restate the full plot — give a take, not a summary.
    - **Failure behavior:** If the API call fails (network, bad key, rate limit, malformed response), the user sees a friendly fallback string: *"We couldn't generate a recommendation for this one — check out the overview above!"* The modal stays fully functional; only the recommendation line shows the fallback.

- **OpenRouter endpoint & model:**
    - Endpoint: `https://openrouter.ai/api/v1/chat/completions`
    - Model: `openrouter/free` — OpenRouter's free-models router, which picks a random available free model per call and filters out ones that are down. The client retries up to 3 times, so a fresh random pick usually dodges any rate-limited model. (Earlier the code hand-rotated a fixed list — `llama-3.3-70b`, `gemma-4-31b`, `gpt-oss-120b` — but the built-in router does this more robustly.)
    - Auth: `Authorization: Bearer ${VITE_OPENROUTER_API_KEY}` — key stored in `.env` (gitignored, same pattern as `VITE_API_KEY`). Browser-side key is inherently visible in DevTools; acceptable for a free-tier dev project. A production app would proxy this through a backend.

- **State location (decision):** State lives **inside MovieModal**, not App.
    - `aiInsight` (string or null) — initial `null`; holds the recommendation (or fallback) text.
    - `loadingInsight` (boolean) — initial `false`; true while the call is in flight.
    - **Why MovieModal and not App (revising the earlier `aiRecommendation`/`isLoadingAI`-in-App plan):** the modal is the only consumer of this data, it already owns local UI state (`isTrailerExpanded`), and keeping the AI state local makes reset-on-close trivial — the state naturally resets because the effect re-runs when a new `movieDetails` arrives, and the modal unmounts when closed. No prop drilling through App.

- **Trigger:** A `useEffect` in MovieModal keyed on `movieDetails?.id`. When details have finished loading (`movieDetails` is non-null), it calls `getMovieInsight(title, genres, overview)`, sets `loadingInsight` true during the call, then stores the result in `aiInsight`. Opening a different movie re-runs the effect with fresh state; the modal unmounting on close discards the state.

- **Loading UI:** While `loadingInsight` is true, the modal shows "✨ Getting a recommendation…". When done it shows `aiInsight`.

### AI Feature — Decisions Log
- **What the API returned initially:** With a bare prompt the first responses ran long (4–5 sentences), occasionally opened with "I think…", and sometimes leaned on generic hype ("an absolute must-watch"). Format was close but violated the length, no-"I", and no-generic-phrase constraints.
- **What I changed in my prompt:** Moved all the rules into the system message (role + hard constraints: 2–3 sentences, no "I", no spoilers, no generic hype, plain text only) and kept the user message to just the task + the movie context (title / comma-joined genres / overview). Being explicit about sentence count and banning the specific filler phrases tightened the output to spec.
- **What fallback behavior I implemented:** Any thrown error (non-OK status, network failure, or missing `choices[0].message.content`) is caught and returns the friendly fallback string, which is stored in `aiInsight` and rendered like a normal recommendation — so a failure never produces a broken or blank modal.
- **What I learned:** For async AI features in React, the cleanest place for the response state is the component that consumes it, triggered by a `useEffect` on the input id — the effect re-running on a new id is what gives you "reset on reopen" for free, no manual cleanup needed. On prompt engineering: putting the constraints in the *system* message and naming the exact bad phrases to avoid is far more reliable than hinting at them in the user message.


**Visual Design Intent (Milestone 7):**

- **Palette (3 colors on a dark base):** background `#141414` (near-black), surface `#1a1a1a` (cards/modal), brand red `#e50914` (primary actions/accents). Supporting: white `#ffffff` body text, muted gray `#cccccc` for secondary text, gold `#ffd700` for ratings. Dark base with light text suits a cinema/movie feel.
- **Typography:** Google Font **Poppins** for headings (brand, hero, card/modal titles — geometric, modern) and **Inter** for body/UI text (highly legible at small sizes). Imported via `@import` in index.css. Headings 600–800 weight; body 400–500.
- **MovieCards:** dark surface tiles with rounded corners and a poster on top; on hover they lift slightly (`translateY(-4px)`) and gain a soft shadow to add energy to the grid. The whole card is one keyboard-focusable control (Enter/Space opens the modal); the heart/eye remain independently focusable buttons.
- **Modal:** dark semi-transparent overlay (`rgba(0,0,0,0.85)`) creates depth; the content surface has clear hierarchy — large title over the backdrop with a dark gradient for legibility, then a divider, then meta/genres/overview with a green rating ring and a trailer thumbnail.
- **Accessibility intent:** every text/background pair meets WCAG 2.0 AA (4.5:1); all interactive elements (cards, buttons, close, sidebar links) are keyboard-reachable with a visible focus ring; all posters/backdrops have descriptive `alt` text; semantic landmarks (`<header>`, `<main>`, `<footer>`).
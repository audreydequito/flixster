
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
    - Responsibility: Shows detailed info about a movie when a MovieCard is clicked. (AI recommendation is added in a later milestone.)
    - Renders: Large backdrop image, title, release date, runtime, genre tags, plot summary, close button. Shows a loading state while details fetch, and a friendly error message if the fetch fails.
    - Props: `movieDetails` (full details object or null), `isLoading` (boolean), `error` (string or null), `onClose` (function). [Later: `aiRecommendation`, `isLoadingAI`.]
    - Manages any state: None — App owns the modal state and the details fetch; MovieModal is purely presentational.
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

- **aiRecommendation** (string or null)
    - Initial value: `null`
    - Owner: App component
    - Update trigger: Set after AI generates recommendation for selected movie; cleared when modal closes

- **isLoadingAI** (boolean)
    - Initial value: `false`
    - Owner: App component
    - Update trigger: `true` when AI call starts; `false` when it finishes


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


**AI Feature Spec:**

- **Display component:** MovieModal will show the AI recommendation below the movie plot
- **Input data sent to AI:**
    - Movie title (string)
    - Genres (combined into a comma-separated string like "Horror, Mystery")
    - Overview/plot summary (string)
- **AI output:** A 2-3 sentence personalized recommendation that tells the user if they should watch this movie and why, based on the genre and story
- **State location:** 
    - `aiRecommendation` (string or null) - stored in App, passed to MovieModal
    - `isLoadingAI` (boolean) - tracks if AI is still thinking, passed to MovieModal
- **How it works:** When a movie is selected, App calls the OpenRouter API with the movie info. While waiting, MovieModal shows "Generating recommendation...". When done, it shows the AI text. If the AI call fails, show "Recommendation unavailable right now."
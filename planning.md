
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
    - Responsibility: Shows detailed info about a movie when clicked, including an AI recommendation
    - Renders: Large backdrop image, title, release date, runtime, genre tags, plot summary, AI watch recommendation, close button
    - Props: movie (full details object), onClose (function), aiRecommendation (string), isLoadingAI (boolean)
    - Manages any state: None
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
    - URL: `https://api.themoviedb.org/3/movie/{movie_id}`
    - Parameters: `api_key`, movie ID in the URL
    - Response fields used: `id`, `title`, `backdrop_path`, `overview`, `release_date`, `runtime`, `genres` (array with name), `vote_average`
    - Errors to handle: Movie not found (close modal, show error), network failure (show error in modal)


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

- **selectedMovie** (object or null)
    - Initial value: `null`
    - Owner: App component
    - Update trigger: When user clicks a MovieCard (becomes movie object); when modal closes (becomes null)

- **sortOption** (string)
    - Initial value: `"default"`
    - Owner: App component
    - Update trigger: When user picks a new option from the sort dropdown

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

When someone clicks a MovieCard, the handler in App saves that movie to `selectedMovie` state and uses the movie's id to fetch full details from the Movie Details API. This gives us runtime and genres, which the basic movie object doesn't have. App also sends the movie's title, genres, and plot to the AI API to get a recommendation. Both the detailed movie info and AI response get passed to MovieModal as props.

When searching, App sets `mode` to `"search"`, resets `currentPage` to 1, and calls the Search API with the search text. The results replace the `movies` state, so MovieList automatically shows the search results instead. "Load More" pages through whichever endpoint matches the current `mode` (Now Playing or Search), incrementing `currentPage` and appending the new results to the existing `movies` array; it is hidden once `currentPage >= totalPages`. Clearing the search (or clicking "Now Playing") resets `mode` to `"nowPlaying"` and `currentPage` to 1, then re-fetches the Now Playing list. Sorting just reorders the `movies` array before MovieList renders it.


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
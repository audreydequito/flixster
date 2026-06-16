# Lumière — Demo Speaker Script (~4:30)

A timed walkthrough for a 4–5 minute live demo. Read the prose aloud; lines marked
`▶ DEMO:` are actions to perform on screen, not things to say.

## Timing at a glance

| # | Section | Time | Running total |
|---|---------|------|---------------|
| 1 | Title / Intro | 0:20 | 0:20 |
| 2 | Short Description | 0:30 | 0:50 |
| 3 | Favorite Feature (live walkthrough) | 1:20 | 2:10 |
| 4 | Technical Highlight | 0:50 | 3:00 |
| 5 | Most Challenging | 0:40 | 3:40 |
| 6 | Favorites, Watched & Responsive | 0:40 | 4:20 |
| 7 | Next Steps | 0:30 | 4:50 |
| 8 | Closing | 0:10 | ~5:00 |

> Target ~4:30 of spoken content; the table leaves buffer for clicks and transitions.

## Demo prep checklist (do this before you present)

- [ ] App running locally: `npm run dev` (or have the live Render URL open as backup).
- [ ] Home screen loaded, hero carousel visible and rotating.
- [ ] Pick one movie ahead of time that has a **good trailer** and a clean poster — you'll open its modal.
- [ ] Confirm the **AI recommendation** works (open a modal once beforehand so the OpenRouter key is warmed up and you've seen a real response).
- [ ] Browser window sized for the room; zoom level set so text is readable from the back.
- [ ] Close extra tabs/notifications. Optionally have DevTools → Network tab ready if you want to show the AI request.

---

## 1. Title / Intro  *(~0:20)*

▶ DEMO: Have the app open on the home screen, hero carousel rotating.

"Hi everyone — I'm [your name], and this is **Lumière**, a movie discovery app I built.
The name means 'light' — the idea is a clean, cinematic way to find your next watch."

---

## 2. Short Description  *(~0:30)*

"Lumière lets you **browse what's playing now**, **search** for any movie, and **sort**
by title, release date, or rating. You can **favorite** movies and mark them as **watched**,
and open any movie for full details — including its **trailer** and an **AI-generated
watch recommendation**.

Under the hood it's a **React 18 + Vite** single-page app, powered by the **TMDb API**
for movie data and the **OpenRouter AI API** for the recommendations."

---

## 3. Favorite Feature — Live Walkthrough  *(~1:20)*

> This is the heart of the demo. Slow down and let the animations breathe.

▶ DEMO: Gesture at the **hero carousel** at the top.

"Right at the top is a featured carousel. It auto-rotates through current movies with a
slow Ken Burns zoom, and you can jump between them with these dots."

▶ DEMO: Click a dot to switch slides, then **scroll down** into the grid.

"As I scroll, notice the cards **fade up in sequence** — each one reveals itself as it
enters the screen, with a slight stagger so it cascades."

▶ DEMO: **Hover** a card (poster lifts/tilts), then **click** your pre-chosen movie to open the modal.

"Hovering lifts the poster, and clicking opens the detail view."

▶ DEMO: In the modal, point at the **rating ring**.

"A couple of things I'm proud of here. The rating ring **counts up from zero** when the
modal opens — it's a small touch but it makes the screen feel alive."

▶ DEMO: Click the **trailer thumbnail** to expand it, let it start, then go back.

"You can play the trailer right inline..."

▶ DEMO: Scroll to the **AI Watch Recommendation** section.

"...but my **favorite feature** is this: an **AI watch recommendation**. When you open a
movie, the app sends its title, genres, and overview to a language model and gets back a
short, **spoiler-free** take on whether it's worth your evening. It's the thing that makes
Lumière feel less like a database and more like a friend recommending a movie."

---

## 4. Technical Highlight  *(~0:50)*

> Stay on the live site. Optionally open DevTools → Network to show the AI call.

"On the technical side, the AI integration is the piece I'd highlight. It calls
**OpenRouter's free-models router**, which picks an available free model per request.
Because free models can be rate-limited or go down, I wrapped it in a **3-attempt retry**,
and if every attempt fails it falls back to a friendly message instead of breaking the
modal. It's also **lazy-loaded** — the request only fires when you open a movie — with a
guard so a slow response can't land on the wrong movie if you've already moved on.

State is centralized in a single `App` component — no Redux needed — and I track favorites
and watched using **`Set`s** so membership checks are O(1) as the list grows."

---

## 5. Most Challenging  *(~0:40)*

"The most challenging part was actually making that AI feature **reliable**. The free
models are great for a student project — they're free — but they're unpredictable: the
router picks a different model each call, some are rate-limited, some return empty
responses. My first version would just fail silently and leave a blank box.

The fix was treating it like any flaky network dependency: **retry a few times**, validate
that the response actually has content, and always have a **graceful fallback** so the user
never sees a broken state. It taught me a lot about designing around services you don't
control."

---

## 6. Favorites, Watched & Responsive  *(~0:40)*

▶ DEMO: Close the modal. Click the **heart** and the **eye** on a card (watch the pop animation).

"Back on the grid — favoriting and marking as watched have a little pop animation for
feedback."

▶ DEMO: Open the **sidebar** (menu button), switch between the **Favorites** and **Watched** tabs.

"Everything you save shows up in this sidebar, split into Favorites and Watched tabs."

▶ DEMO: (Optional) Narrow the browser window to show the responsive layout collapse.

"The whole thing is **responsive** down to mobile, and I put real effort into
**accessibility** — full keyboard navigation, ARIA roles on the dialogs and cards, and it
respects the user's reduced-motion setting by turning the animations off."

---

## 7. Next Steps  *(~0:30)*

"A few things I'd add next:

- **Persist** favorites and watched to localStorage — right now they reset on reload.
- **Filters** by genre and year, and a true **infinite scroll** instead of a load-more button.
- **Debounced live search** that updates as you type.
- And eventually **user accounts** so your list follows you across devices."

---

## 8. Closing  *(~0:10)*

"So that's **Lumière** — movie discovery with a cinematic feel and an AI assist. It's
deployed live on Render at flixster-rnw1.onrender.com. Thanks for watching — happy to take
any questions!"

/* ════════════════════════════════════════════════════════════════
   GAMES CONFIG
   ════════════════════════════════════════════════════════════════

   Edit this file to add, remove, or update games.
   Each game is an object inside the GAMES array with these fields:

     title       — display name (keep it short)
     year        — release year shown in the detail panel, e.g. 2024
     description — shown in the detail panel; supports markdown:
                     Use backtick template literals for multi-line text.
                     - Lines starting with "- " become bullet points
                     - **bold** and *italic* are supported
                     - Blank lines create paragraph breaks
     thumbnail   — path to cover image, e.g. "assets/thumbnails/foo.jpg"
                   (recommended 600×450 px / 4:3 ratio, JPG or PNG)
                   The card displays it at 4:3; the detail panel crops it to
                   1:1 (square) from the center. Keep the main subject centered
                   so it looks good in both views.
     screenshots — (optional) array of image paths shown below the description
                   e.g. ["assets/screenshots/game1-a.jpg", "assets/screenshots/game1-b.jpg"]
                   Displayed as a 160×90 px scrollable strip. Leave as [] or omit if none.
     link        — full URL opened when player presses Enter / clicks Play

   ── HOW TO ADD A GAME ──
     1. Drop a thumbnail image into assets/thumbnails/
     2. Copy one of the blocks below
     3. Paste it inside the array (commas between objects)
     4. Update the four fields and save — refresh the browser

   ── HOW TO REMOVE A GAME ──
     Delete its block (and any leftover comma).

   ── HOW TO REORDER GAMES ──
     Move blocks up or down. The first one is focused on page load.
   ════════════════════════════════════════════════════════════════ */

const GAMES = [
  {
    title:       "Game One",
    year:        2024,
    description: `A short pitch for your first game. What is it, what's the hook?

- Built with **Unity** and C#
- Supports local co-op up to 4 players
- *Jam entry* — made in 48 hours`,
    thumbnail:   "assets/thumbnails/game1.jpg",
    screenshots: [
      "https://placehold.co/320x180/1a1a2e/a0aec0?text=Screenshot+1",
      "https://placehold.co/320x180/1a1a2e/a0aec0?text=Screenshot+2",
      "https://placehold.co/320x180/1a1a2e/a0aec0?text=Screenshot+3"
    ],
    link:        "https://itch.io"
  },
  {
    title:       "Game Two",
    year:        2023,
    description: "Describe this one in one to three sentences — genre, theme, platform, anything that stands out.",
    thumbnail:   "assets/thumbnails/game2.jpg",
    screenshots: [],
    link:        "https://itch.io"
  },
  {
    title:       "Game Three",
    year:        2022,
    description: "Another project you're proud of. Tell visitors what to expect before they hit Play.",
    thumbnail:   "assets/thumbnails/game3.jpg",
    screenshots: [],
    link:        "https://itch.io"
  }
];

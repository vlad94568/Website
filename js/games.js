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
                   Both the card and detail panel display it at 4:3 without
                   cropping or stretching.
     screenshots — (optional) array of image paths shown below the description
                   e.g. ["assets/screenshots/game1-a.jpg", "assets/screenshots/game1-b.jpg"]
                   Displayed as a 160×90 px scrollable strip. Leave as [] or omit if none.
     link        — full URL opened when player presses Enter / clicks Play
     finished    — (optional) true or false. Default true.
                     true  → button reads "PLAY GAME"
                     false → button reads "VIEW PAGE" (for unfinished games;
                             point link at the GitHub repo or project page)
                   Either way the button still opens link.

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
    title:       "BRICKS",
    year:        2018,
    description: `An arcade style brich shooter. Bricks rain from the sky and you have to shoot them before they hit the ground.

- Built with **Python** and **Pygame**
- Multiple levels with varying difficulty
- First game I made as a self taught developer

Play the original [itch.io](https://vlad94568.itch.io/bricks)!`,
    thumbnail:   "assets/thumbnails/bricks_thumb.png",
    screenshots: [
      "assets/screenshots/bricks/sc1.png",
      "assets/screenshots/bricks/sc2.png",
      "assets/screenshots/bricks/sc3.png",
      "assets/screenshots/bricks/sc4.png",
      "assets/screenshots/bricks/sc5.png",
      "assets/screenshots/bricks/sc6.png",
      "assets/screenshots/bricks/sc7.png"
    ],
    link:        "https://vlad94568.itch.io/bricks-web",
    finished:    true
  },
  {
    title:       "Zombie Game",
    year:        2020,
    description: `A 2D zombie shooter where you battle hordes of basic, fast, and strong zombies across 3 action-packed levels.

- Built with **Unity** in 1 month
- 3 levels with 3 types of zombies: basic, fast, and strong
- First game I made in Unity`,
    thumbnail:   "assets/thumbnails/zombthumb.png",
    screenshots: [
      "assets/screenshots/zombie_game/zomb1.png",
      "assets/screenshots/zombie_game/zomb2.png",
      "assets/screenshots/zombie_game/zomb3.png",
      "assets/screenshots/zombie_game/zomb4.png"
    ],
    link:        "https://vlad94568.itch.io/zombie-game",
    finished:    true
  },
  {
    title:       "SlidR",
    year:        2021,
    description: `A 2D sliding puzzle game with plenty of customization options to keep things fresh.

- Built with **Unity**
- Customizable puzzles with multiple options
- Implemented puzzle generation algorithms`,
    thumbnail:   "assets/thumbnails/slidrthumb.png",
    screenshots: [
      "assets/screenshots/slidr/slidr1.gif",
      "assets/screenshots/slidr/slidr2.png",
      "assets/screenshots/slidr/slidr3.png"
    ],
    link:        "https://vlad94568.itch.io/slidr",
    finished:    true
  },
  {
    title:       "VR Jenga",
    year:        2023,
    description: `A VR tech demo bringing the Jenga game to virtual reality with controller based hand gestures.

- Built with **Unity** and **Oculus SDK**
- Controller-based hand gestures
- First VR development project`,
    thumbnail:   "assets/thumbnails/jengathumb.png",
    screenshots: [
      "assets/screenshots/jenga/jenga1.gif"
    ],
    link:        "https://github.com/vlad94568/VR_Jenga",
    finished:    false
  },
  {
    title:       "Realistic Boxfights & Zonewars",
    year:        2023,
    description: `A competitive Fortnite map blending Boxfight and Zonewars gameplay with Battle Royale weapons and randomized loadouts.

- Built with **UEFN(Unreal Editor for Fortnite)**
- Competitive environments built with **UEFN's terrain editor**
- First **UEFN** project`,
    thumbnail:   "assets/thumbnails/boxzonethumb.png",
    screenshots: [
      
    ],
    link:        "https://www.fortnite.com/@vladdev/1843-3269-2782",
    finished:    true
  },
  {
    title:       "Instant 1v1 Boxfights",
    year:        2023,
    description: `A competitive Fortnite 1v1 boxfights gamemode with stat tracking and nearly 10,000 plays.

- Built with **UEFN(Unreal Editor for Fortnite)**
- Nearly **10,000 plays**
- Player statistics tracking system`,
    thumbnail:   "assets/thumbnails/boxfightthumb.png",
    screenshots: [
      "assets/screenshots/boxfight/boxfight1.png"
    ],
    link:        "https://www.fortnite.com/@vladdev/5054-0270-5869",
    finished:    true
  },
  {
    title:       "Parkour Rally",
    year:        2024,
    description: `A vehicle platformer with obstacle courses across multiple themed worlds, each with custom built assets.

- Built with **UEFN(Unreal Editor for Fortnite)**
- Multiple worlds with unique themes and challenges
- Custom **3D** assets built with **UEFN's modeling tools**`,
    thumbnail:   "assets/thumbnails/rallythumb.png",
    screenshots: [

    ],
    link:        "https://www.fortnite.com/@vladdev/2877-1961-2474",
    finished:    true
  },
  {
    title:       "Would You Rather",
    year:        2025,
    description: `A multiplayer party game where players split into teams based on "Would You Rather" questions, then battle it out in minigames.

- Built with **UEFN(Unreal Editor for Fortnite)**
- Peaked at **280 concurrent players** and **121K minutes played**
- Team based minigames driven by Would You Rather questions`,
    thumbnail:   "assets/thumbnails/wouldratherthumb.png",
    screenshots: [
      
    ],
    link:        "https://www.fortnite.com/@vladdev/8421-8116-8269",
    finished:    true
  }
];

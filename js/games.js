/* ════════════════════════════════════════════════════════════════
   GAMES CONFIG
   ════════════════════════════════════════════════════════════════

   Edit this file to add, remove, or update games.
   Each game is an object inside the GAMES array with these fields:

     title       — display name (keep it short)
     year        — release year shown on the card, e.g. 2024
     dateRange   — (optional) full month range shown in the modal,
                   e.g. "Nov 2024 – Feb 2025"
     status      — "Released" | "Prototype" | "In Development"
                     Released   → CTA reads "play"
                     Prototype  → CTA reads "view repo"
                     In Development → CTA reads "view project"
     engine      — "uefn" | "unity" | "godot" | "pygame"
                   (drives the grid filter + engine tag)
     genre       — short all-caps genre label, e.g. "SHOOTER"
     featured    — true → card spans 2 columns in the mosaic grid
     tags        — array of tech badges shown in the modal,
                   e.g. ["UEFN", "Verse"]
     metrics     — (optional) array of stat blocks shown in the modal,
                   e.g. [{ value: "280", label: "Peak Concurrent" }]
     blurb       — 1-2 sentence description revealed on card hover
     description — full text shown in the modal; supports markdown:
                     - Lines starting with "- " become bullet points
                     - **bold** and *italic* are supported
                     - [text](url) becomes a link
                     - Blank lines create paragraph breaks
     thumbnail   — path to cover image, e.g. "assets/thumbnails/foo.jpg"
     screenshots — (optional) array of image paths shown in the modal
     link        — full URL opened by the CTA
   ════════════════════════════════════════════════════════════════ */

const GAMES = [
  {
    title:       "BRICKS",
    year:        2018,
    dateRange:   "Feb 2018 – Mar 2019",
    status:      "Released",
    engine:      "pygame",
    genre:       "ARCADE",
    featured:    false,
    tags:        ["Python", "Pygame"],
    blurb:       "An arcade-style brick shooter. Bricks rain from the sky — shoot them down before they hit the ground.",
    description: `An arcade style brick shooter. Bricks rain from the sky and you have to shoot them before they hit the ground.

- Built with **Python** and **Pygame**
- Multiple levels with varying difficulty
- First game I made as a self taught developer

Play the original on [itch.io](https://vlad94568.itch.io/bricks)!`,
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
    link:        "https://vlad94568.itch.io/bricks-web"
  },
  {
    title:       "Zombie Game",
    year:        2020,
    dateRange:   "Aug 2020 – Dec 2020",
    status:      "Released",
    engine:      "unity",
    genre:       "SHOOTER",
    featured:    false,
    tags:        ["Unity", "C#"],
    blurb:       "A 2D zombie shooter — battle hordes of basic, fast, and strong zombies across 3 action-packed levels.",
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
    link:        "https://vlad94568.itch.io/zombie-game"
  },
  {
    title:       "SlidR",
    year:        2021,
    dateRange:   "May 2021 – Jul 2021",
    status:      "Released",
    engine:      "unity",
    genre:       "PUZZLE",
    featured:    false,
    tags:        ["Unity", "C#"],
    blurb:       "A 2D sliding puzzle game with procedural puzzle generation and plenty of customization options.",
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
    link:        "https://vlad94568.itch.io/slidr"
  },
  {
    title:       "VR Jenga",
    year:        2023,
    dateRange:   "Feb 2023",
    status:      "Prototype",
    engine:      "unity",
    genre:       "VR",
    featured:    false,
    tags:        ["Unity", "C#", "Oculus SDK", "VR"],
    blurb:       "A VR tech demo bringing Jenga to virtual reality with controller-based hand gestures and full physics.",
    description: `A VR tech demo bringing the Jenga game to virtual reality with controller based hand gestures.

- Built with **Unity** and **Oculus SDK**
- Controller-based hand gestures
- First VR development project`,
    thumbnail:   "assets/thumbnails/jengathumb.png",
    screenshots: [
      "assets/screenshots/jenga/jenga1.gif"
    ],
    link:        "https://github.com/vlad94568/VR_Jenga"
  },
  {
    title:       "Realistic Boxfights & Zonewars",
    year:        2023,
    dateRange:   "Aug 2023 – Nov 2023",
    status:      "Released",
    engine:      "uefn",
    genre:       "COMPETITIVE",
    featured:    false,
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "39.4K", label: "Minutes Played"  },
      { value: "42",    label: "Peak Concurrent" }
    ],
    blurb:       "A competitive Fortnite map blending Boxfight and Zonewars with Battle Royale weapons and 100,000+ randomized loadouts.",
    description: `A competitive Fortnite map blending Boxfight and Zonewars gameplay with Battle Royale weapons and randomized loadouts.

- Built with **UEFN (Unreal Editor for Fortnite)**
- Randomized, balanced loadout system with **100,000+ unique loadouts**
- Competitive environments built with **UEFN's terrain editor**
- First **UEFN** project`,
    thumbnail:   "assets/thumbnails/boxzonethumb.png",
    screenshots: [],
    link:        "https://www.fortnite.com/@vladdev/1843-3269-2782"
  },
  {
    title:       "Instant 1v1 Boxfights",
    year:        2023,
    dateRange:   "Sep 2023 – Dec 2023",
    status:      "Released",
    engine:      "uefn",
    genre:       "COMPETITIVE",
    featured:    true,
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "121.9K", label: "Minutes Played"  },
      { value: "42",     label: "Peak Concurrent" }
    ],
    blurb:       "A competitive Fortnite 1v1 boxfights gamemode with player stat tracking — 121.9K minutes played.",
    description: `A competitive Fortnite 1v1 boxfights gamemode with player stat tracking.

- Built with **UEFN (Unreal Editor for Fortnite)**
- Optimized for high frame rates and low server lag
- Player statistics tracking system`,
    thumbnail:   "assets/thumbnails/boxfightthumb.png",
    screenshots: [
      "assets/screenshots/boxfight/boxfight1.png"
    ],
    link:        "https://www.fortnite.com/@vladdev/5054-0270-5869"
  },
  {
    title:       "Parkour Rally",
    year:        2024,
    dateRange:   "May 2024 – Oct 2024",
    status:      "Released",
    engine:      "uefn",
    genre:       "PLATFORMER",
    featured:    false,
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "9.1K", label: "Minutes Played"  },
      { value: "32",   label: "Peak Concurrent" }
    ],
    blurb:       "A vehicle platformer with obstacle courses across multiple themed worlds, each with custom-built 3D assets.",
    description: `A vehicle platformer with obstacle courses across multiple themed worlds, each with custom built assets.

- Built with **UEFN (Unreal Editor for Fortnite)**
- Multiple worlds with unique themes and challenges
- Custom **3D** assets built with **UEFN's modeling tools**`,
    thumbnail:   "assets/thumbnails/rallythumb.png",
    screenshots: [],
    link:        "https://www.fortnite.com/@vladdev/2877-1961-2474"
  },
  {
    title:       "Would You Rather",
    year:        2025,
    dateRange:   "Nov 2024 – Feb 2025",
    status:      "Released",
    engine:      "uefn",
    genre:       "PARTY",
    featured:    true,
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "280",  label: "Peak Concurrent" },
      { value: "121K", label: "Minutes Played"  }
    ],
    blurb:       "A multiplayer party game — players split into teams over \"Would You Rather\" questions, then battle it out in minigames. 280 peak concurrent players.",
    description: `A multiplayer party game where players split into teams based on "Would You Rather" questions, then battle it out in minigames.

- Built with **UEFN (Unreal Editor for Fortnite)**
- Designed a tool to easily build new minigames
- Team based minigames driven by Would You Rather questions`,
    thumbnail:   "assets/thumbnails/wouldratherthumb.png",
    screenshots: [],
    link:        "https://www.fortnite.com/@vladdev/8421-8116-8269"
  },
  {
    title:       "Squid Loop",
    year:        2025,
    dateRange:   "Jul 2025 – Sep 2025",
    status:      "Released",
    engine:      "uefn",
    genre:       "MINIGAMES",
    featured:    true,
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "108",   label: "Peak Concurrent" },
      { value: "20.3K", label: "Minutes Played"  }
    ],
    blurb:       "A Squid Game inspired minigame collection — head-to-head elimination rounds across unique challenges. 108 peak concurrent players.",
    description: `A Squid Game inspired multiplayer minigame collection where players compete head to head across multiple rounds of unique challenges, reaching 108 concurrent players and 20K+ minutes played.

- Peaked at **108 concurrent players** and **20,300+ minutes played**
- Multiple distinct minigames with unique rules and elimination mechanics`,
    thumbnail:   "assets/thumbnails/squidloopthumb.png",
    screenshots: [
      "assets/screenshots/squidloop/squidloop1.png"
    ],
    link:        "https://www.fortnite.com/@vladdev/6087-9071-4436"
  }
];

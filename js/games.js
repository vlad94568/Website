/* ════════════════════════════════════════════════════════════════
   GAMES CONFIG
   ════════════════════════════════════════════════════════════════

   Edit this file to add, remove, or update games.
   Each game is an object inside the GAMES array with these fields:

     title       — display name (keep it short)
     year        — release year shown on the card, e.g. 2024
     dateRange   — (optional) full month range shown in detail panel,
                   e.g. "Nov 2024 – Feb 2025"
     status      — "Released" | "Prototype" | "In Development"
                     Released   → button reads "PLAY GAME"
                     Prototype  → button reads "VIEW REPO"
                     In Development → button reads "VIEW PROJECT"
     tags        — array of tech badges shown on the card and detail,
                   e.g. ["UEFN", "Verse"]
     metrics     — (optional) array of big stat blocks shown in detail,
                   e.g. [{ value: "280", label: "Peak Concurrent" }]
     description — shown in the detail panel; supports markdown:
                     Use backtick template literals for multi-line text.
                     - Lines starting with "- " become bullet points
                     - **bold** and *italic* are supported
                     - Blank lines create paragraph breaks
     thumbnail   — path to cover image, e.g. "assets/thumbnails/foo.jpg"
                   (recommended 600×450 px / 4:3 ratio, JPG or PNG)
     screenshots — (optional) array of image paths shown below description
     link        — full URL opened when player presses Enter / clicks Play
   ════════════════════════════════════════════════════════════════ */

const GAMES = [
  {
    title:       "BRICKS",
    year:        2018,
    dateRange:   "Feb 2018 – Mar 2019",
    status:      "Released",
    tags:        ["Python", "Pygame"],
    description: `An arcade style brick shooter. Bricks rain from the sky and you have to shoot them before they hit the ground.

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
    link:        "https://vlad94568.itch.io/bricks-web"
  },
  {
    title:       "Zombie Game",
    year:        2020,
    dateRange:   "Aug 2020 – Dec 2020",
    status:      "Released",
    tags:        ["Unity", "C#"],
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
    tags:        ["Unity", "C#"],
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
    tags:        ["Unity", "C#", "Oculus SDK", "VR"],
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
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "39.4K", label: "Minutes Played"  },
      { value: "42",    label: "Peak Concurrent" }
    ],
    description: `A competitive Fortnite map blending Boxfight and Zonewars gameplay with Battle Royale weapons and randomized loadouts.

- Built with **UEFN(Unreal Editor for Fortnite)**
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
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "121.9K", label: "Minutes Played"  },
      { value: "42",     label: "Peak Concurrent" }
    ],
    description: `A competitive Fortnite 1v1 boxfights gamemode with player stat tracking.

- Built with **UEFN(Unreal Editor for Fortnite)**
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
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "9.1K", label: "Minutes Played"  },
      { value: "32",   label: "Peak Concurrent" }
    ],
    description: `A vehicle platformer with obstacle courses across multiple themed worlds, each with custom built assets.

- Built with **UEFN(Unreal Editor for Fortnite)**
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
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "280",  label: "Peak Concurrent" },
      { value: "121K", label: "Minutes Played"  }
    ],
    description: `A multiplayer party game where players split into teams based on "Would You Rather" questions, then battle it out in minigames.

- Built with **UEFN(Unreal Editor for Fortnite)**
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
    tags:        ["UEFN", "Verse"],
    metrics:     [
      { value: "108",  label: "Peak Concurrent" },
      { value: "20.3K", label: "Minutes Played"  }
    ],
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

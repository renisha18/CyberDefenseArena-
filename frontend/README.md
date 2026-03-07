# CyberDefense Arena

Modular React + Vite cybersecurity training game.

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx            # Top bar with health + XP (ChallengePage)
│   ├── PixelButton.jsx       # Reusable pixel button (type prop)
│   ├── PixelIcons.jsx        # All SVG pixel icons (Shield, Bug, Email, Logo)
│   ├── StatusPanel.jsx       # Agent stats — top-right of Dashboard
│   ├── StreakIndicator.jsx   # 🔥 Daily streak — top-left of Dashboard
│   ├── LeaderboardPreview.jsx# Top-3 leaderboard widget — left of Dashboard
│   ├── OfficeMap.jsx         # SVG pixel office map with room health bars
│   ├── MatrixRain.jsx        # Animated matrix background effect
│   └── Scanlines.jsx         # CRT scanline overlay
│
├── pages/
│   ├── LandingPage.jsx       # / — intro screen, typewriter, JOIN MISSION
│   ├── Dashboard.jsx         # /main — office map + all widgets + nav
│   ├── ChallengePage.jsx     # /challenge — phishing detection game
│   ├── LeaderboardPage.jsx   # /leaderboard — full player rankings
│   └── TrainingPage.jsx      # /training — module progress tree
│
├── styles/
│   ├── global.css            # CSS variables + all keyframe animations
│   ├── landing.css           # Landing page classes
│   ├── dashboard.css         # Dashboard layout classes
│   └── components.css        # All component + challenge page classes
│
├── App.jsx                   # BrowserRouter + Routes + global player state
└── main.jsx                  # React DOM entry point
```

## Routes

| Path           | Page              |
|----------------|-------------------|
| `/`            | LandingPage       |
| `/main`        | Dashboard         |
| `/challenge`   | ChallengePage     |
| `/leaderboard` | LeaderboardPage   |
| `/training`    | TrainingPage      |

## State Flow

`playerXP` and `playerHealth` live in `App.jsx` and flow down:
- `Dashboard` reads them for the StatusPanel
- `ChallengePage` reports completion via `onComplete(xp, health)` callback

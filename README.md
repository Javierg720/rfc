# RFC — Ruthless Fighting Championship

[![Version](https://img.shields.io/badge/version-5.6.1-blue)](./package.json)
[![License](https://img.shields.io/badge/license-UNLICENSED-red)]()

> High-volatility, fighting-themed 243-ways HTML5 slot game with cinematic bonus features, fighter pick mechanics, and championship multiplier reveals.

## Overview

**RFC Frontend** is a production-grade, self-contained HTML5 casino slot game built for the Stake Engine platform. It features a 5-reel, 243-ways main game with two bonus modes, cinematic animations, and full RGS (Remote Game Server) integration.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Vanilla HTML5 / CSS3 / ES2020+ |
| Build Tool | Vite 6 + Terser |
| Audio | Web Audio API (synthesized SFX) |
| Animation | CSS3 Keyframes + Web Animations API |
| RGS Bridge | Custom `stake-engine-bridge.js` |
| RNG | Cryptographically Secure PRNG (`crypto.getRandomValues`) |

## Game Features

- **5-Reel 243-Ways Main Game** — Left-to-right consecutive reel wins
- **Cage Scatter Free Fights** — 3+ scatters trigger free spins with fighter pick
- **Fighter Pick Multiplier Bonus** — Choose your fighter for spins × multiplier combos
- **Cage Heat Rival Callout** — Belt + fighter showdown with player choice
- **Final Bell Duel (Bonus 2)** — 5-round back-to-back championship gauntlet
- **Championship Multiplier** — Random 1×–10× boost on title belt wins
- **Continuous Auto Play** — Toggle runs until stopped or feature entry
- **Cinematic Ceremony Layer** — Premium UI with 3D button treatments

## Quick Start

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Image optimization audit
npm run optimize:images
```

## Project Structure

```
├── index.html              # Main game entry point
├── stake-engine-bridge.js  # RGS integration layer
├── package.json            # Dependencies & scripts
├── vite.config.js          # Build configuration
├── scripts/
│   └── optimize-images.js  # Asset size audit
├── assets/
│   ├── animation-pack/     # Host character sprite sheets
│   ├── fighter-animations/ # VS battle GIFs
│   ├── fighter-select/     # Fighter picker portraits
│   ├── ui/                 # HUD elements & menus
│   ├── background_loop.mp3 # Bonus music
│   └── King_Crowned.mp3    # Championship stinger
├── assets/symbols/
│   ├── sym_*.png           # Reel symbols
│   └── moves/              # Bonus 2 move symbols
├── art/
│   └── rfc_bg.png          # Main background
└── submission-manifest.json # Build metadata
```

## Security

- **Content Security Policy** — Strict CSP headers prevent XSS
- **CSPRN** — All game outcomes use `crypto.getRandomValues()`
- **Input Sanitization** — All RGS responses validated before use
- **XSS Prevention** — DOM APIs used instead of `innerHTML` for dynamic content
- **localStorage Validation** — Session data sanitized before storage/retrieval

## Performance

- **Image Optimization** — GIF assets optimized (41.6% size reduction)
- **Lazy Loading** — Non-critical images use `loading="lazy"`
- **Memory Management** — Audio contexts, intervals, and RAF properly disposed
- **Bundle Optimization** — Vite + Terser with dead code elimination
- **Polling Reduction** — Balance refresh reduced from 5s to 30s intervals

## RGS Integration

The game communicates with Stake Engine via `stake-engine-bridge.js`:

| Endpoint | Purpose |
|----------|---------|
| `/wallet/authenticate` | Session validation |
| `/wallet/play` | Spin request |
| `/wallet/end-round` | Round finalization |
| `/wallet/balance` | Balance refresh |
| `/bet/replay/{...}` | Replay mode |

Query parameters: `rgs_url`, `sessionID`, `lang`, `device`, `replay`

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- **Not supported:** Internet Explorer 11

## License

UNLICENSED — Proprietary software. All rights reserved.

---

**Build:** `rfc-frontend-5.7.0-3star-stake-original`

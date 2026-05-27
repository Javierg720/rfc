# RFC Changelog

## 5.7.0 — 3-Star Stake Engine Original (2026-05-20)

**Complete head-to-toe makeover** to premium production quality.

### Critical Logic & Correctness
- Fixed VS Battle / Belt Showdown to correctly support top, middle, and bottom rows (previously hardcoded to center row only).
- Fully implemented Cage Heat pips system (2 scatters in base now correctly advance the meter with VFX and feedback). Works in both demo and live RGS paths.
- Rebalanced Fighter Pick values to clean, premium tiers (5spins@6×, 8@4×, 10@3.5×, 12@3×) with accurate documentation and intentional risk/reward.
- Verified `rgsBoardToGrid` + scatter handling against official math books (110/110 samples passing).

### Feature Elevation — Final Bell Duel
- Rebranded and dramatically elevated the 100× buyable feature as **"Final Bell Duel — Title Fight"**.
- Per-round cinematic flavor using the official move names from math-model.json (`H-Bomb Overhand`, `Lightning Armbar`, etc.).
- Stronger tension, better round pacing, "TITLE DECIDED" end screen, and proper 50/50 pick-em drama.

### 3-Star Production Polish
- **Win-tier escalation & ceremony**: "TITLE FIGHT KO" label for massive championship wins, longer victory holds on fighter-max, lingering champion aura after biggest KOs.
- **Richer dynamic audio**: New intensity system (0–3). Background music gets louder and slightly faster on high Cage Heat, during Free Fights, and throughout the entire Final Bell Duel. Proper spotlight stings on 5 pips.
- **Fighter-Max character acting**: Improved hold times on win reactions + post-win glow on the signature bottom-right fighter.
- **Mobile / orientation polish**: Larger tap targets on portrait phones, safe-area-inset support, more aggressive hiding of the max sprite on small iPhone-class devices, better breathing room for HUD elements.
- **Code organization**: Added full Table of Contents + major section headers throughout the monolithic script for professional maintainability.

### Submission Hygiene
- Complete asset cleanup — all `.bak`, `.kra`, design HTML mocks, duplicate variants, empty directories, `dist/`, and `node_modules/` safely archived under `/design/`.
- `symbols/moves/` directory created with placeholder per manifest requirements.
- All version strings, build fingerprints, and documentation updated.
- Fidelity verification script restored and confirmed passing against real math books.

### RTP / Math Alignment
- Local paytable and simulation remain illustrative only (live wins come from RGS).
- Frontend rendering and parsing verified compatible with the supplied deterministic books and lookup tables.

---

**Target**: 97% RTP, High Variance, 5,000× cap, 243-ways fighting slot with premium Free Fights + Final Bell Duel.

This build represents the complete transition from ambitious prototype to a true 3-star Stake Engine original.
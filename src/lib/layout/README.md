# RFC Layout System (Proper)

This is the clean, maintainable replacement for the scattered hacks that lived in the giant `index.html`.

## Structure

- `profiles.ts` — The three device profiles (desktop, ipad, iphone) as the single source of truth. These match the exports from the in-game RLE tool.
- `LayoutManager.ts` — The runtime system. Handles device detection, applying profiles to CSS variables, and notifying listeners.
- `game-layout.css` — Now includes the `--dev-*` variables as an opt-in layer (add `dev-layout` class to enable advanced positioning overrides).

## Usage

### In the app / dev tools
```ts
import { LayoutManager } from '$lib/layout/LayoutManager';

// Switch profiles manually (great for a dev panel)
LayoutManager.apply('iphone');
LayoutManager.apply('ipad');
LayoutManager.apply('desktop');

// Auto-detect based on current viewport
LayoutManager.applyCurrent();

// Subscribe to changes (Svelte-friendly)
const unsubscribe = LayoutManager.subscribe((profile) => {
  console.log('Active layout profile:', profile);
});
```

### In CSS
The manager sets the variables on `:root`. You can use them directly:

```css
.reels-container {
  top: var(--dev-reels-container-y);
  /* etc */
}
```

For stronger control during development, add the `dev-layout` class to `body` or `.stage`.

## Adding a new profile
1. Add it to `LAYOUT_PROFILES` in `profiles.ts`
2. (Optional) Add a media query in `dev-layout-tweaks.css` for the standalone build
3. Update any Storybook device controls

## Newly Wired Components
- `ReelFrame.svelte` — The decorative reel border. Fully respects --dev-reel-frame-* when .dev-layout-active is present.
- `HostCharacter.svelte` — The fighter girl. Uses dev vars for position/size.
- `RFCSlotDemo.svelte` — Main demo now includes the wired ReelFrame and respects container vars.
- `MobileRFCSlotDemo.svelte` — Mobile version also supports useDevLayout for reels positioning.

## Easy Global Enable
Drop `<DevLayoutEnabler />` in your root layout (or in Storybook preview) to auto-apply the current profile on load and enable the `.dev-layout-active` class.

Use the `ProfileSwitcher` component anywhere in Storybook or a dev panel to instantly preview your RLE-tuned layouts (desktop / iPad / iPhone).

All your carefully tuned values from the RLE arrows/drag now work consistently across the Svelte source.

## Benefits
- One place to edit per-device tuning
- Works the same in Storybook, dev server, and production builds
- The old RLE tool in the giant index.html can (and should) be updated to use this same object
- No more random `top: -50px` overrides fighting your settings

This is the foundation for a real, professional layout workflow.

---

## RLEBridge — Connecting the Prototype to Real Code

While the layout is still being tuned visually, **most of the real work happens in the giant `index.html`** using the powerful in-browser RLE panel (press **D**).

The `RLEBridge.ts` exists to make the hand-off to the real Svelte code painless.

### Current recommended flow (Option 3 style)

1. Do all visual tweaking in the big `index.html` + RLE (fastest feedback).
2. When a device looks good, press **P** in the RLE panel (or click the brown "Export Profile" button).
3. Use the helpers in `RLEBridge.ts` (or just paste manually) to update `profiles.ts`.
4. In Storybook or the Svelte app: `LayoutManager.apply('desktop')` now shows your latest visual work.

### Useful functions in RLEBridge.ts

```ts
import {
  parseRLECSS,
  quickDesktopUpdate,
  generateFullProfilesTS
} from './RLEBridge';

// After pressing P in the big HTML and copying the CSS:
const rleOutput = `:root { --dev-reel-frame-tx: 3.4%; ... }`;

const desktopBlock = quickDesktopUpdate(rleOutput);
console.log(desktopBlock);           // Ready-to-paste "desktop: { ... }"

// Or generate a full updated profiles.ts file:
const fullTS = generateFullProfilesTS({
  desktop: parseRLECSS(rleOutput)
});
```

### Long-term direction

Once the layout stabilizes, we can evolve this into:
- A shared `layout-snapshot.json` that both the RLE tool and `LayoutManager` read in development.
- A small dev-only page or Vite plugin that lets the RLE write directly to `profiles.ts`.
- The RLE itself becoming a first-class design tool instead of living inside the giant index.html.

`RLEBridge.ts` is the current pragmatic bridge while we are still in heavy visual iteration mode.

---

## Next Steps / Status

- [x] RLE "Export Profile" button (P key) added to giant index.html
- [x] `RLEBridge.ts` created with parsers + generators
- [ ] (Future) Shared JSON snapshot format
- [ ] (Future) One-click "Sync to profiles.ts" from the RLE when running under Vite

Document last updated after choosing Option 3 (RLEBridge approach).

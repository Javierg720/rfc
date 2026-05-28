/**
 * RLEBridge.ts
 *
 * The translator between the fast visual prototype (giant index.html + RLE panel)
 * and the real production layout system (profiles.ts + LayoutManager).
 *
 * Purpose:
 * - During active design / client reviews, you will do most layout work in the big index.html
 *   because the RLE tool is extremely fast for pixel-perfect tweaks.
 * - This bridge makes it easy to take those tuned values and feed them into the real Svelte code.
 *
 * Recommended workflow while layout is still moving:
 *   1. Do visual work in the giant index.html (press D to open RLE)
 *   2. When happy with desktop (or a device), press P (or click "Export Profile")
 *   3. Paste the output into profiles.ts (or use the helpers below in a script)
 *   4. LayoutManager.apply('desktop') will now reflect your latest visual work
 *
 * Later (when layout is mostly locked):
 *   - You can evolve this into a shared JSON source that both the RLE and the real app read.
 *   - Or turn the RLE into a proper standalone design tool that can write directly to disk.
 */

import type { DeviceProfile, LayoutProfile } from './profiles';
import { LAYOUT_PROFILES } from './profiles';

/**
 * Takes the CSS string produced by the RLE "Export CSS" button (or buildCSS())
 * and turns it into a partial LayoutProfile object.
 *
 * Example input:
 *   :root {
 *     --dev-reel-frame-tx: 3.4%;
 *     --dev-reel-frame-ty: 9.4%;
 *     ...
 *   }
 */
export function parseRLECSS(css: string): Partial<LayoutProfile> {
  const result: Partial<LayoutProfile> = {};
  const regex = /--dev-([a-z0-9-]+):\s*([^;]+);/gi;
  let match;

  while ((match = regex.exec(css)) !== null) {
    const key = `--dev-${match[1]}` as keyof LayoutProfile;
    const value = match[2].trim();
    (result as any)[key] = value;
  }

  return result;
}

/**
 * Converts a single device profile into a nicely formatted TypeScript object literal
 * ready to paste into profiles.ts.
 */
export function profileToTypeScript(
  profile: Partial<LayoutProfile>,
  device: DeviceProfile
): string {
  const lines: string[] = [];

  // Use the same key order as the main profiles.ts for consistency
  const orderedKeys: (keyof LayoutProfile)[] = [
    '--dev-reels-container-y',
    '--dev-reels-container-w',
    '--dev-reels-container-h',
    '--dev-reels-offset-x',
    '--dev-reels-y',
    '--dev-reels-w',
    '--dev-reels-h',
    '--dev-reel-frame-x',
    '--dev-reel-frame-y',
    '--dev-reel-frame-tx',
    '--dev-reel-frame-ty',
    '--dev-reel-frame-scale',
    '--dev-max-right',
    '--dev-max-bottom',
    '--dev-max-w',
    '--dev-max-h',
  ];

  for (const key of orderedKeys) {
    const value = profile[key] ?? LAYOUT_PROFILES[device]?.[key] ?? '0';
    lines.push(`    '${key}': '${value}',`);
  }

  return `  ${device}: {\n${lines.join('\n')}\n  },`;
}

/**
 * Generates a complete, ready-to-paste block for profiles.ts.
 * Pass in the profiles you have tuned (you can pass just desktop if that's all you changed).
 *
 * Example:
 *   const ts = generateFullProfilesTS({
 *     desktop: parseRLECSS(rleOutput)
 *   });
 */
export function generateFullProfilesTS(updates: Partial<Record<DeviceProfile, Partial<LayoutProfile>>>): string {
  const devices: DeviceProfile[] = ['desktop', 'ipad', 'iphone'];

  const blocks = devices.map(device => {
    const base = { ...LAYOUT_PROFILES[device] };
    const update = updates[device] || {};
    const merged = { ...base, ...update };

    return profileToTypeScript(merged, device);
  });

  return `export const LAYOUT_PROFILES: Record<DeviceProfile, LayoutProfile> = {\n${blocks.join('\n\n')}\n};`;
}

/**
 * Convenience helper for the most common case:
 * You just tuned desktop in the RLE and exported the CSS string.
 *
 * Usage (in browser console or a temp script):
 *   import { quickDesktopUpdate } from './RLEBridge';
 *   const newDesktopBlock = quickDesktopUpdate(rleExportedCSS);
 *   console.log(newDesktopBlock);
 */
export function quickDesktopUpdate(rleCSS: string): string {
  const parsed = parseRLECSS(rleCSS);
  return profileToTypeScript(parsed, 'desktop');
}

/**
 * Future-facing: Suggested shape if we ever move to a shared JSON source of truth.
 * Both the giant index.html RLE and the real app could load this JSON in dev mode.
 */
export interface RLELayoutSnapshot {
  desktop: Partial<LayoutProfile>;
  ipad?: Partial<LayoutProfile>;
  iphone?: Partial<LayoutProfile>;
  lastUpdated: string;
  source: 'rle-index.html' | 'manual' | 'storybook';
}

/**
 * Example of how we could evolve this later:
 * Save a snapshot from the RLE tool directly to a JSON file that the Svelte app reads.
 */
export function createSnapshot(
  desktop: Partial<LayoutProfile>,
  other?: Partial<Record<'ipad' | 'iphone', Partial<LayoutProfile>>>
): RLELayoutSnapshot {
  return {
    desktop,
    ipad: other?.ipad,
    iphone: other?.iphone,
    lastUpdated: new Date().toISOString(),
    source: 'rle-index.html',
  };
}

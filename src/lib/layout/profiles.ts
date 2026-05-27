/**
 * RFC Slot Game - Layout Profiles
 * 
 * Single source of truth for device-specific layout tuning.
 * These match the exports from the RLE (Layout Editor) tool.
 * 
 * Use via LayoutManager or directly in CSS via the --dev-* custom properties.
 */

export type DeviceProfile = 'desktop' | 'ipad' | 'iphone';

export interface LayoutProfile {
  // Reels Container (outer box)
  '--dev-reels-container-y': string;
  '--dev-reels-container-w': string;
  '--dev-reels-container-h': string;

  // Inner Reels positioning & size
  '--dev-reels-offset-x': string;
  '--dev-reels-y': string;
  '--dev-reels-w': string;
  '--dev-reels-h': string;

  // Reel Frame (decorative overlay)
  '--dev-reel-frame-x': string;
  '--dev-reel-frame-y': string;
  '--dev-reel-frame-tx': string;   // independent translate X
  '--dev-reel-frame-ty': string;   // independent translate Y
  '--dev-reel-frame-scale': string;

  // Host / Fighter character (the girl)
  '--dev-max-right': string;
  '--dev-max-bottom': string;
  '--dev-max-w': string;
  '--dev-max-h': string;
}

export const LAYOUT_PROFILES: Record<DeviceProfile, LayoutProfile> = {
  desktop: {
    '--dev-reels-container-y': '122px',
    '--dev-reels-container-w': '1163.2px',
    '--dev-reels-container-h': '710.8px',
    '--dev-reels-offset-x': '69px',
    '--dev-reels-y': '209px',
    '--dev-reels-w': '862px',
    '--dev-reels-h': '212px',
    '--dev-reel-frame-x': '1.7%',
    '--dev-reel-frame-y': '-25%',
    '--dev-reel-frame-tx': '6.6%',
    '--dev-reel-frame-ty': '12.1%',
    '--dev-reel-frame-scale': '0.93',
    '--dev-max-right': '120px',
    '--dev-max-bottom': '-216px',
    '--dev-max-w': '211px',
    '--dev-max-h': '406px'
  },

  ipad: {
    '--dev-reels-container-y': '142px',
    '--dev-reels-container-w': '898.6px',
    '--dev-reels-container-h': '694px',
    '--dev-reels-offset-x': '89px',
    '--dev-reels-y': '209px',
    '--dev-reels-w': '484px',
    '--dev-reels-h': '188px',
    '--dev-reel-frame-x': '8%',
    '--dev-reel-frame-y': '7.2%',
    '--dev-reel-frame-tx': '-8.25%',
    '--dev-reel-frame-ty': '2.2%',
    '--dev-reel-frame-scale': '0.93',
    '--dev-max-right': '-84px',
    '--dev-max-bottom': '-216px',
    '--dev-max-w': '211px',
    '--dev-max-h': '406px'
  },

  iphone: {
    '--dev-reels-container-y': '86px',
    '--dev-reels-container-w': '810.4px',
    '--dev-reels-container-h': '710.8px',
    '--dev-reels-offset-x': '21px',
    '--dev-reels-y': '209px',
    '--dev-reels-w': '358px',
    '--dev-reels-h': '212px',
    '--dev-reel-frame-x': '-12.65%',
    '--dev-reel-frame-y': '12.8%',
    '--dev-reel-frame-tx': '4.95%',
    '--dev-reel-frame-ty': '7.7%',
    '--dev-reel-frame-scale': '0.93',
    '--dev-max-right': '-276px',
    '--dev-max-bottom': '-308px',
    '--dev-max-w': '247px',
    '--dev-max-h': '406px'
  }
};

export const DEFAULT_PROFILE: DeviceProfile = 'desktop';

/**
 * Simple device detection (can be enhanced with more breakpoints later)
 */
export function detectDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isPortrait = height > width;

  if (width <= 480 || (width <= 820 && isPortrait)) {
    return 'iphone';
  }
  if (width >= 768 && width <= 1024 && isPortrait) {
    return 'ipad';
  }
  return 'desktop';
}

/**
 * RFC Slot Game - Layout Manager
 * 
 * Proper, centralized system for applying device-specific layouts.
 * Replaces the scattered hacks in the old index.html.
 */

import { LAYOUT_PROFILES, type DeviceProfile, detectDeviceProfile } from './profiles';

type Listener = (profile: DeviceProfile) => void;

class LayoutManagerClass {
  private currentProfile: DeviceProfile = 'desktop';
  private listeners: Listener[] = [];
  private initialized = false;

  /**
   * Initialize the system (call once on app start)
   */
  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Apply initial profile
    this.applyCurrent();

    // React to resize / orientation changes
    if (typeof window !== 'undefined') {
      let timeout: number;
      window.addEventListener('resize', () => {
        clearTimeout(timeout);
        timeout = window.setTimeout(() => {
          this.applyCurrent();
        }, 120);
      });

      // Also listen for orientation change on mobile
      window.addEventListener('orientationchange', () => {
        setTimeout(() => this.applyCurrent(), 200);
      });
    }

    console.log('%c[LayoutManager] Proper layout system initialized', 'color:#22dd22');
  }

  getCurrentProfile(): DeviceProfile {
    return this.currentProfile;
  }

  /**
   * Force a specific profile (great for dev tools / Storybook)
   */
  apply(profile: DeviceProfile) {
    if (!LAYOUT_PROFILES[profile]) {
      console.warn(`[LayoutManager] Unknown profile: ${profile}`);
      return;
    }

    this.currentProfile = profile;

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      const values = LAYOUT_PROFILES[profile];

      Object.entries(values).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });

      // Add a class so CSS can have special dev-layout rules
      document.body.classList.add('dev-layout-active');
    }

    // Notify listeners (Svelte stores, components, etc.)
    this.listeners.forEach(fn => fn(profile));

    console.log(`%c[LayoutManager] Applied profile: ${profile}`, 'color:#a78bfa');
  }

  /**
   * Disable the special dev layout CSS rules (removes the body class)
   */
  disableDevLayout() {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('dev-layout-active');
    }
  }

  /**
   * Auto-detect and apply based on current viewport
   */
  applyCurrent() {
    const detected = detectDeviceProfile();
    this.apply(detected);
  }

  /**
   * Subscribe to profile changes (useful for Svelte $: reactivity or stores)
   */
  subscribe(callback: Listener): () => void {
    this.listeners.push(callback);

    // Immediately call with current value
    callback(this.currentProfile);

    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  /**
   * Get all available profiles (for UI switchers)
   */
  getAvailableProfiles(): DeviceProfile[] {
    return Object.keys(LAYOUT_PROFILES) as DeviceProfile[];
  }

  /**
   * Get the raw values for a profile (useful for exports or debugging)
   */
  getProfileValues(profile: DeviceProfile) {
    return { ...LAYOUT_PROFILES[profile] };
  }
}

// Singleton
export const LayoutManager = new LayoutManagerClass();

// Convenience for Svelte components
export const currentProfile = {
  subscribe: LayoutManager.subscribe.bind(LayoutManager)
};

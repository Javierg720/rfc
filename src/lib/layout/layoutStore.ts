/**
 * Svelte-friendly reactive store for the current layout profile.
 * 
 * Usage in components:
 *   import { currentLayoutProfile } from '$lib/layout/layoutStore';
 *   
 *   $: profile = $currentLayoutProfile;
 */

import { writable, derived } from 'svelte/store';
import { LayoutManager, type DeviceProfile } from './LayoutManager';

// Create a writable store that stays in sync with the LayoutManager
const profileStore = writable<DeviceProfile>(LayoutManager.getCurrentProfile());

// Subscribe to manager changes
LayoutManager.subscribe((newProfile) => {
  profileStore.set(newProfile);
});

// Public store (read-only for most consumers)
export const currentLayoutProfile = {
  subscribe: profileStore.subscribe
};

// Derived helper stores (very useful in components)
export const isDesktop = derived(currentLayoutProfile, (p) => p === 'desktop');
export const isIpad = derived(currentLayoutProfile, (p) => p === 'ipad');
export const isIphone = derived(currentLayoutProfile, (p) => p === 'iphone');

// Convenience action to switch profiles from any component
export function switchLayoutProfile(profile: DeviceProfile) {
  LayoutManager.apply(profile);
}

// Re-export the manager for advanced use
export { LayoutManager };
export type { DeviceProfile };

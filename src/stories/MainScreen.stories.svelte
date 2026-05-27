<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DevicePreview from './DevicePreview.svelte';
  import ProfileSwitcher from '../lib/layout/ProfileSwitcher.svelte';
import RFCSlotDemo from '../components/RFCSlotDemo.svelte';
import HostCharacter from '../components/HostCharacter.svelte';

  const { Story } = defineMeta({
    title: 'RFC Design Review / Main Screen',
    component: DevicePreview,
    tags: ['autodocs'],
    parameters: {
      layout: 'fullscreen',
      viewport: { defaultViewport: 'iphone14' },
    },
  });
</script>

<script lang="ts">
  import { currentLayoutProfile } from '../lib/layout/layoutStore';
  import { LayoutManager } from '../lib/layout/LayoutManager';
  import { LAYOUT_PROFILES } from '../lib/layout/profiles';
  
  // Auto-apply current profile when the story loads
  $effect(() => {
    LayoutManager.applyCurrent();
  });

  // Compute inline styles from the current profile so the demo actually moves
  $: profile = LAYOUT_PROFILES[$currentLayoutProfile] || LAYOUT_PROFILES.desktop;

  $: demoStyles = `
    top: ${profile['--dev-reels-container-y'] || '0px'};
    left: 50%;
    transform: translateX(calc(-50% + ${profile['--dev-reels-offset-x'] || '0px'}));
    width: ${profile['--dev-reels-container-w'] || '100%'};
    height: ${profile['--dev-reels-container-h'] || '100%'};
  `;

  $: reelsStyles = `
    top: ${profile['--dev-reels-y'] || '20%'};
    left: 50%;
    transform: translateX(calc(-50% + ${profile['--dev-reels-offset-x'] || '0px'}));
    width: ${profile['--dev-reels-w'] || '60%'};
    height: ${profile['--dev-reels-h'] || '40%'};
  `;

  $: frameStyles = `
    top: ${profile['--dev-reel-frame-y'] || '0%'};
    left: ${profile['--dev-reel-frame-x'] || '0%'};
    right: ${profile['--dev-reel-frame-x'] || '0%'};
    bottom: ${profile['--dev-reel-frame-y'] || '0%'};
    transform: translate(${profile['--dev-reel-frame-tx'] || '0%'}, ${profile['--dev-reel-frame-ty'] || '0%'}) scale(${profile['--dev-reel-frame-scale'] || '1'});
  `;

  $: girlStyles = `
    right: ${profile['--dev-max-right'] || '20px'};
    bottom: ${profile['--dev-max-bottom'] || '0px'};
    width: ${profile['--dev-max-w'] || '200px'};
    height: ${profile['--dev-max-h'] || '300px'};
  `;
</script>

<!-- 
  MAIN SCREEN OPTIMIZATION PREVIEW
  
  This story shows the REAL RFC game (index.html) inside realistic device frames.
  Use it to check how your actual design looks on different phones, tablets, and orientations.
  
  The game loads via iframe pointing to ./index.html — no code is modified.
  All your existing CSS, animations, and layout logic run exactly as in production.
-->

<!-- ====== PHONE PORTRAITS (Primary targets) ====== -->

<Story 
  name="iPhone 14-15 Pro Portrait" 
  args={{ device: 'iphone', orientation: 'portrait', scale: 0.72 }} 
/>

<Story 
  name="iPhone SE Portrait" 
  args={{ device: 'iphone', orientation: 'portrait', scale: 0.78, label: 'iPhone SE (375x667)' }} 
/>

<Story 
  name="Galaxy S23 Portrait" 
  args={{ device: 'galaxy', orientation: 'portrait', scale: 0.78 }} 
/>

<!-- ====== PHONE LANDSCAPES ====== -->

<Story 
  name="iPhone 14-15 Pro Landscape" 
  args={{ device: 'iphone', orientation: 'landscape', scale: 0.58 }} 
/>

<Story 
  name="Galaxy S23 Landscape" 
  args={{ device: 'galaxy', orientation: 'landscape', scale: 0.62 }} 
/>

<!-- ====== TABLETS ====== -->

<Story 
  name="iPad Pro 11 Portrait" 
  args={{ device: 'ipad', orientation: 'portrait', scale: 0.42 }} 
/>

<Story 
  name="iPad Pro 11 Landscape" 
  args={{ device: 'ipad', orientation: 'landscape', scale: 0.42 }} 
/>

<!-- ====== DESKTOP ====== -->

<Story 
  name="Desktop 1440x900" 
  args={{ device: 'desktop', scale: 0.55 }} 
/>

<Story 
  name="Desktop 1920x1080" 
  args={{ device: 'desktop', scale: 0.48, label: 'Desktop 1920x1080' }} 
/>

<!-- ====== COMPARISON GRID ====== -->

<Story 
  name="All Phones Side by Side" 
  args={{ device: 'iphone', orientation: 'portrait', scale: 0.45, showLabel: true }}
  render={() => ({
    Component: 'div',
    props: { 
      style: 'display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding: 20px; background: #0a0a0a;' 
    },
    children: [
      { Component: DevicePreview, props: { device: 'iphone', orientation: 'portrait', scale: 0.45, label: 'iPhone 14 Pro' } },
      { Component: DevicePreview, props: { device: 'galaxy', orientation: 'portrait', scale: 0.48, label: 'Galaxy S23' } },
      { Component: DevicePreview, props: { device: 'iphone', orientation: 'portrait', scale: 0.52, label: 'iPhone SE' } },
    ]
  })}
/>

<Story 
  name="Portrait vs Landscape" 
  args={{ device: 'iphone', orientation: 'portrait', scale: 0.5 }}
  render={() => ({
    Component: 'div',
    props: { 
      style: 'display:flex; gap: 40px; padding: 20px; background: #0a0a0a; align-items: flex-start;' 
    },
    children: [
      { Component: DevicePreview, props: { device: 'iphone', orientation: 'portrait', scale: 0.55, label: 'Portrait' } },
      { Component: DevicePreview, props: { device: 'iphone', orientation: 'landscape', scale: 0.45, label: 'Landscape' } },
    ]
  })}
/>

<!-- ====== OPTIMIZATION NOTES ====== -->

<div style="margin-top: 40px; padding: 24px; background: #111; border-radius: 12px; color: #aaa; font-size: 13px; line-height: 1.6; max-width: 900px;">
  <h3 style="color: #fff; margin-bottom: 12px; font-size: 16px;">Main Screen Optimization Guide</h3>

  <!-- Live Profile Switcher - the control for the proper layout system -->
  <div style="margin: 16px 0 24px;">
    <ProfileSwitcher />
    <p style="margin-top: 8px; font-size: 12px; color: #666;">
      Click to switch profiles. LayoutManager applies the vars + adds <code>.dev-layout-active</code> to body.
    </p>
  </div>

  <h4 style="color: #ccc; margin: 16px 0 8px;">Live Demo — Switch profiles below (this actually works)</h4>
  
  <div style="background:#0a0a0a; padding:20px; border-radius:8px; margin-bottom:20px; position:relative; height:420px; overflow:hidden; border:1px solid #333;">
    <div 
      class="dev-layout-preview"
      style="
        position: relative;
        width: 100%;
        height: 100%;
        background: #111;
        border: 1px dashed #444;
        {demoStyles}
      "
    >
      <!-- Reels area -->
      <div 
        style="
          position: absolute;
          background: rgba(255,255,255,0.08);
          border: 1px solid #555;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 11px;
          {reelsStyles}
        "
      >
        REELS
      </div>
      
      <!-- Reel Frame -->
      <div 
        style="
          position: absolute;
          background: rgba(204,26,46,0.2);
          border: 2px solid #cc1a2e;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #cc1a2e;
          font-size: 10px;
          pointer-events: none;
          {frameStyles}
        "
      >
        REEL FRAME
      </div>
      
      <!-- Girl / Host -->
      <div 
        style="
          position: fixed;
          background: rgba(255,255,255,0.1);
          border: 1px solid #666;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #888;
          font-size: 10px;
          {girlStyles}
        "
      >
        GIRL
      </div>
    </div>
  </div>
  
  <p style="font-size:12px; color:#666;">
    Click the profile buttons above. This preview box directly reads the active profile and applies your exact RLE-tuned values. It should actually move now.
  </p>
  
  <p><strong>What you're seeing:</strong> The real RFC game loaded in an iframe. All CSS, animations, and layout run exactly as production.</p>
  
  <h4 style="color: #ccc; margin: 16px 0 8px;">Key Viewport Checks</h4>
  <ul style="margin-left: 20px;">
    <li><strong>iPhone 14 Pro (390x844):</strong> Primary mobile target — check spin button thumb-size, reel visibility, host character docking</li>
    <li><strong>iPhone SE (375x667):</strong> Smallest supported phone — verify no overflow, all controls reachable</li>
    <li><strong>Galaxy S23 (360x780):</strong> Android flagship — test touch targets, font readability</li>
    <li><strong>iPad Pro (834x1194):</strong> Tablet experience — centering, spacing, button sizes</li>
    <li><strong>Desktop (1440x900, 1920x1080):</strong> Full stage at 1920x1080 with centered wrapper</li>
  </ul>

  <h4 style="color: #ccc; margin: 16px 0 8px;">CSS Variables to Tweak</h4>
  <ul style="margin-left: 20px;">
    <li><code>--dev-reels-container-y</code> — Vertical position of reels container</li>
    <li><code>--dev-reels-container-w/h</code> — Reels container dimensions</li>
    <li><code>--dev-reel-frame-scale</code> — Reel frame overlay scale</li>
    <li><code>--dev-max-w/h</code> — Host character (Max) size</li>
    <li><code>--dev-max-right</code> — Max positioning from right edge</li>
  </ul>

  <h4 style="color: #ccc; margin: 16px 0 8px;">How to Optimize (New Proper System)</h4>
  <ol style="margin-left: 20px;">
    <li>Use <code>src/lib/layout/LayoutManager.ts</code> + <code>profiles.ts</code> (single source of truth)</li>
    <li>Call <code>LayoutManager.apply('iphone')</code> or <code>LayoutManager.applyCurrent()</code> in dev tools / Storybook controls</li>
    <li>The three profiles (desktop / ipad / iphone) are the same ones used in the RLE tool exports</li>
    <li>Variables are automatically applied to <code>:root</code> — works in both Storybook and the built game</li>
  </ol>

  <p style="margin-top: 16px; color: #888;">
    <strong>Tip:</strong> Use the "All Phones Side by Side" story to compare layouts across devices simultaneously.
  </p>
</div>

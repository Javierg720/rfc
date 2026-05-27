<script lang="ts">
  /**
   * DevicePreview
   * 
   * Purely for design review / optimization.
   * Shows the REAL RFC game (your existing index.html) inside realistic device frames.
   * 
   * Use this in Storybook to check how your actual design looks on different phones, tablets, and orientations.
   * No game code is modified.
   */

  type DeviceType = 'iphone' | 'galaxy' | 'ipad' | 'desktop';

  interface Props {
    device?: DeviceType;
    orientation?: 'portrait' | 'landscape';
    /** Scale the entire preview (useful for very large game designs) */
    scale?: number;
    /** Show device label */
    showLabel?: boolean;
    /** Custom label */
    label?: string;
    /** URL to load in the iframe. Defaults to the actual game. */
    src?: string;
  }

  let {
    device = 'iphone',
    orientation = 'portrait',
    scale = 0.65,
    showLabel = true,
    label,
    src = './index.html'
  }: Props = $props();

  const isLandscape = $derived(orientation === 'landscape');

  const deviceConfig = {
    iphone: {
      name: 'iPhone 14 / 15 Pro',
      width: 390,
      height: 844,
      bezel: 12,
      radius: 48,
      notch: true,
    },
    galaxy: {
      name: 'Samsung Galaxy S23',
      width: 360,
      height: 780,
      bezel: 10,
      radius: 32,
      notch: false,
    },
    ipad: {
      name: 'iPad Pro 11"',
      width: 834,
      height: 1194,
      bezel: 16,
      radius: 24,
      notch: false,
    },
    desktop: {
      name: 'Desktop / Browser',
      width: 1440,
      height: 900,
      bezel: 0,
      radius: 8,
      notch: false,
    }
  };

  const config = $derived(deviceConfig[device]);

  const frameWidth = $derived(isLandscape ? config.height : config.width);
  const frameHeight = $derived(isLandscape ? config.width : config.height);

  const displayLabel = $derived(label || (isLandscape ? `${config.name} (Landscape)` : config.name));
</script>

<div class="device-wrapper">
  {#if showLabel}
    <div class="device-label">{displayLabel}</div>
  {/if}

  <div 
    class="device-frame"
    style="
      width: {frameWidth}px; 
      height: {frameHeight}px; 
      border-radius: {config.radius}px;
      padding: {config.bezel}px;
      transform: scale({scale});
      transform-origin: top left;
    "
    class:landscape={isLandscape}
    class:desktop={device === 'desktop'}
  >
    <!-- Device bezel / body -->
    <div class="device-body">
      <!-- Notch / Dynamic Island simulation for iPhone -->
      {#if config.notch && device === 'iphone'}
        <div class="notch"></div>
      {/if}

      <!-- Screen area -->
      <div class="screen">
        <iframe 
          {src} 
          title="RFC Game - {displayLabel}"
          frameborder="0"
          allow="autoplay; fullscreen"
        ></iframe>
      </div>
    </div>
  </div>
</div>

<style>
  .device-wrapper {
    display: inline-block;
    margin: 20px;
  }

  .device-label {
    font-size: 12px;
    color: #888;
    margin-bottom: 8px;
    font-family: system-ui, sans-serif;
    letter-spacing: 0.5px;
  }

  .device-frame {
    background: #111;
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.6),
      0 0 0 1px #222,
      inset 0 0 0 1px #333;
    position: relative;
    overflow: hidden;
    transition: box-shadow 0.2s ease;
  }

  .device-frame:hover {
    box-shadow: 
      0 30px 80px rgba(0, 0, 0, 0.65),
      0 0 0 1px #222;
  }

  .device-body {
    width: 100%;
    height: 100%;
    background: #000;
    position: relative;
    overflow: hidden;
    border-radius: inherit;
  }

  .screen {
    width: 100%;
    height: 100%;
    background: #000;
    overflow: hidden;
    position: relative;
  }

  iframe {
    width: 100%;
    height: 100%;
    border: none;
    background: #000;
    display: block;
  }

  /* iPhone Dynamic Island */
  .notch {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    width: 140px;
    height: 28px;
    background: #000;
    border-radius: 999px;
    z-index: 10;
    box-shadow: 0 0 0 6px #111;
  }

  .device-frame.desktop {
    background: #1a1a1a;
    box-shadow: 0 10px 40px rgba(0,0,0,0.4);
  }

  .device-frame.landscape {
    /* Landscape adjustments if needed */
  }
</style>

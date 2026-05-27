<script lang="ts">
  /**
   * PremiumSpinButton
   * High-fidelity 3D premium spin button matching the RFC game aesthetic.
   * Used for the main spin action, auto-play, and buy-bonus flows.
   */

  import type { Snippet } from 'svelte';

  interface Props {
    /** Visual + interaction state */
    state?: 'idle' | 'active' | 'spinning' | 'stop' | 'disabled';
    /** Visual variant */
    variant?: 'normal' | 'buy-bonus' | 'stop';
    /** Size in pixels (diameter). When `mobile` is true, this is ignored in favor of a thumb-friendly default. */
    size?: number;
    /** Mobile-optimized mode: larger touch target (≈120px), better for phones */
    mobile?: boolean;
    /** Label text shown inside the button (hidden visually but for a11y) */
    label?: string;
    /** Click / spin handler */
    onclick?: (e: MouseEvent) => void;
    /** Optional children (rare) */
    children?: Snippet;
  }

  let {
    state = 'idle',
    variant = 'normal',
    size = 132,
    mobile = false,
    label = 'SPIN',
    onclick,
    children
  }: Props = $props();

  const isDisabled = $derived(state === 'disabled' || state === 'spinning');
  const isSpinning = $derived(state === 'spinning');
  const isStop = $derived(state === 'stop' || variant === 'stop');
  const isBuyBonus = $derived(variant === 'buy-bonus');

  // Mobile gets a strong thumb-friendly default (matches production mobile spin button)
  const effectiveSize = $derived(mobile ? Math.max(size, 118) : size);

  // Dynamic classes
  let containerClass = $derived([
    'premium-spin-container',
    state === 'active' && 'active-glow',
    isSpinning && 'spinning',
    isStop && 'stop-mode',
    isBuyBonus && 'buy-bonus-mode',
    isDisabled && 'disabled'
  ].filter(Boolean).join(' '));

  function handleClick(e: MouseEvent) {
    if (isDisabled) return;
    onclick?.(e);
  }

  // Keyboard support
  function handleKeydown(e: KeyboardEvent) {
    if (isDisabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onclick?.(e as any);
    }
  }
</script>

<div
  class={containerClass}
  style="--btn-diameter: {effectiveSize}px;"
  role="button"
  tabindex={isDisabled ? -1 : 0}
  aria-label={label}
  aria-disabled={isDisabled}
  onclick={handleClick}
  onkeydown={handleKeydown}
>
  <!-- Outer 3D bezel -->
  <div class="outer-bezel" style="width: {effectiveSize}px; height: {effectiveSize}px;">
    <!-- Textured metal ring -->
    <div class="textured-ring" style="width: {effectiveSize - 8}px; height: {effectiveSize - 8}px;">
      <!-- Neon trench / inner glow -->
      <div class="neon-trench" style="width: {effectiveSize - 22}px; height: {effectiveSize - 22}px;">
        <!-- The actual pressable core -->
        <div class="button-core" style="width: {effectiveSize - 38}px; height: {effectiveSize - 38}px;">
          <!-- Main visible face -->
          <div class="core-face">
            {#if isBuyBonus}
              <div class="buy-bonus-label">
                <span class="buy-text">BUY</span>
                <span class="bonus-text">BONUS</span>
              </div>
            {:else if isStop}
              <div class="stop-label">STOP</div>
            {:else}
              <div class="spin-label">
                <span class="spin-text">SPIN</span>
              </div>
            {/if}

            <!-- Glass reflection overlay -->
            <div class="glass-reflection"></div>

            <!-- Shimmer sweep -->
            <div class="shimmer-sweep"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shockwave ring (for click feedback) -->
    <div class="shockwave-ring"></div>
  </div>

  {#if children}{@render children()}{/if}
</div>

<style>
  .premium-spin-container {
    perspective: 1200px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    outline: none;
    user-select: none;
    --orange: #cc1a2e;
    --orange-2: #8b0e1c;
    --red: #ff2222;
  }

  .premium-spin-container:focus-visible .outer-bezel {
    box-shadow: 0 0 0 4px rgba(204, 26, 46, 0.35);
  }

  .outer-bezel {
    background: radial-gradient(circle at 35% 35%, #2a2a2f 0%, #0d0d11 60%, #020205 100%);
    box-shadow:
      0 25px 60px rgba(0, 0, 0, 0.95),
      0 0 40px rgba(255, 0, 60, 0.15),
      inset 0 2px 3px rgba(255, 255, 255, 0.25),
      inset 0 -5px 15px rgba(0, 0, 0, 0.85);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transform-style: preserve-3d;
    cursor: pointer;
    border: 1px solid #111;
  }

  .textured-ring {
    background-image:
      linear-gradient(45deg, #15151a 25%, transparent 25%),
      linear-gradient(-45deg, #15151a 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #15151a 75%),
      linear-gradient(-45deg, transparent 75%, #15151a 75%);
    background-size: 6px 6px;
    background-position: 0 0, 0 3px, 3px -3px, -3px 0px;
    box-shadow:
      inset 0 0 15px rgba(0, 0, 0, 0.95),
      0 1px 1px rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .neon-trench {
    box-shadow:
      inset 0 0 12px rgba(0, 0, 0, 0.95),
      0 0 0px rgba(255, 0, 60, 0);
    transition: box-shadow 0.3s ease;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: transparent;
  }

  .active-glow .neon-trench {
    box-shadow:
      inset 0 0 8px rgba(0, 0, 0, 0.9),
      0 0 30px #ff003c,
      0 0 12px #ff003c;
  }

  .button-core {
    background: radial-gradient(circle at 50% 15%, #ff2a5f 0%, #b30024 45%, #5a000f 85%, #1f0003 100%);
    transform: translateZ(28px);
    transition: transform 0.1s cubic-bezier(0.1, 0.8, 0.2, 1), background 0.2s, box-shadow 0.2s;
    box-shadow:
      0 18px 30px rgba(0, 0, 0, 0.85),
      inset 0 12px 12px rgba(255, 255, 255, 0.38),
      inset 0 -12px 18px rgba(0, 0, 0, 0.9),
      0 0 18px rgba(255, 0, 60, 0.4);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    transform-style: preserve-3d;
    overflow: hidden;
  }

  .outer-bezel:hover .button-core {
    background: radial-gradient(circle at 50% 10%, #ff3d6f 0%, #cd002d 45%, #6e0014 85%, #2c0006 100%);
    box-shadow:
      0 18px 35px rgba(0, 0, 0, 0.85),
      inset 0 14px 14px rgba(255, 255, 255, 0.48),
      inset 0 -10px 18px rgba(0, 0, 0, 0.8),
      0 0 35px rgba(255, 0, 60, 0.75);
  }

  .outer-bezel:active .button-core {
    transform: translateZ(3px);
    background: radial-gradient(circle at 50% 30%, #cc0025 0%, #7e0017 50%, #3a0008 90%, #0d0001 100%);
    box-shadow:
      0 2px 4px rgba(0, 0, 0, 0.95),
      inset 0 3px 5px rgba(255, 255, 255, 0.12),
      inset 0 -4px 10px rgba(0, 0, 0, 0.95),
      0 0 50px rgba(255, 0, 60, 0.95);
  }

  .disabled .button-core {
    filter: grayscale(0.85) brightness(0.55);
    cursor: not-allowed;
    box-shadow: none;
  }

  .core-face {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 2;
    font-family: 'Barlow Condensed', 'Oswald', sans-serif;
    font-weight: 900;
    letter-spacing: 3.5px;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
    user-select: none;
  }

  .spin-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
  }

  .spin-text {
    font-size: 22px;
    font-weight: 950;
    letter-spacing: 5px;
    color: #fff;
    text-shadow: 0 0 12px rgba(255, 255, 255, 0.4), 0 3px 6px rgba(0,0,0,0.7);
  }

  .buy-bonus-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 0.95;
  }

  .buy-text {
    font-size: 15px;
    letter-spacing: 4px;
    color: #ffd700;
    text-shadow: 0 0 8px #ffd700;
  }

  .bonus-text {
    font-size: 17px;
    font-weight: 950;
    letter-spacing: 2px;
    color: #fff;
  }

  .stop-label {
    font-size: 20px;
    font-weight: 950;
    letter-spacing: 4px;
    color: #ffdddd;
    text-shadow: 0 0 14px #ff2222;
  }

  .glass-reflection {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 48%, rgba(0,0,0,0) 52%, rgba(0,0,0,0.35) 100%);
    mix-blend-mode: overlay;
    pointer-events: none;
    z-index: 3;
  }

  .shimmer-sweep {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    overflow: hidden;
    pointer-events: none;
    z-index: 4;
  }

  .shimmer-sweep::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -55%;
    width: 210%;
    height: 210%;
    background: linear-gradient(
      42deg,
      rgba(255,255,255,0) 42%,
      rgba(255,255,255,0.38) 50%,
      rgba(255,255,255,0) 58%
    );
    transform: rotate(32deg);
    transition: transform 780ms cubic-bezier(0.23, 1, 0.32, 1);
    pointer-events: none;
  }

  .outer-bezel:hover .shimmer-sweep::after {
    transform: translate(48%, 52%) rotate(32deg);
  }

  .shockwave-ring {
    position: absolute;
    border: 3.5px solid #ff003c;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
    opacity: 0;
    z-index: 15;
  }

  .premium-spin-container:active .shockwave-ring {
    animation: shockwave-out 480ms cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
  }

  @keyframes shockwave-out {
    0%   { transform: scale(0.88); opacity: 0.92; filter: blur(0px); }
    100% { transform: scale(1.42); opacity: 0; filter: blur(9px); }
  }

  /* Spinning state */
  .spinning .button-core {
    animation: spin-core-pulse 1.1s infinite ease-in-out;
  }

  @keyframes spin-core-pulse {
    0%, 100% { box-shadow: 0 18px 30px rgba(0,0,0,0.85), inset 0 12px 12px rgba(255,255,255,0.38), 0 0 18px rgba(255,0,60,0.4); }
    50% { box-shadow: 0 18px 30px rgba(0,0,0,0.85), inset 0 12px 12px rgba(255,255,255,0.38), 0 0 42px rgba(255,0,60,0.95); }
  }

  .buy-bonus-mode .button-core {
    background: radial-gradient(circle at 50% 15%, #e8a23c 0%, #9c5e00 45%, #3f2200 85%, #1a0f00 100%);
  }

  .buy-bonus-mode .outer-bezel {
    box-shadow:
      0 25px 60px rgba(0, 0, 0, 0.95),
      0 0 40px rgba(232, 162, 60, 0.25),
      inset 0 2px 3px rgba(255, 255, 255, 0.25),
      inset 0 -5px 15px rgba(0, 0, 0, 0.85);
  }
</style>

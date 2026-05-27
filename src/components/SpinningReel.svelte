<script lang="ts">
  /**
   * SpinningReel
   * Individual animated reel used inside the SlotDemo.
   * Renders a tall strip and animates it for realistic spinning.
   */

  import type { SymbolName } from './GameSymbol.svelte';
  import GameSymbol from './GameSymbol.svelte';

  interface Props {
    symbols: SymbolName[];           // The 3 visible symbols (final state)
    spinning?: boolean;
    stopDelay?: number;              // ms offset for staggered stop
    onStop?: () => void;
    cellSize?: number;
  }

  let {
    symbols,
    spinning = false,
    stopDelay = 0,
    onStop,
    cellSize = 152
  }: Props = $props();

  // Build a long strip for animation (repeat symbols + final result at bottom)
  let strip: SymbolName[] = $derived([
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    ...symbols,
    symbols[0], symbols[1], symbols[2]   // final landing
  ]);

  let translateY = $state(0);
  let isAnimating = $state(false);

  // When spinning becomes true, start a fast spin then slow to final
  $effect(() => {
    if (spinning) {
      isAnimating = true;
      // Fast continuous spin
      translateY = -cellSize * 18;

      // After delay, snap to final position with easing
      const timer = setTimeout(() => {
        const finalOffset = strip.length * cellSize - (cellSize * 3);
        translateY = -finalOffset;

        setTimeout(() => {
          isAnimating = false;
          onStop?.();
        }, 420);
      }, 850 + stopDelay);

      return () => clearTimeout(timer);
    } else {
      translateY = 0;
      isAnimating = false;
    }
  });
</script>

<div class="spinning-reel" style="--cell: {cellSize}px;">
  <div
    class="strip"
    style="
      transform: translateY({translateY}px);
      transition: {isAnimating ? 'transform 820ms cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none'};
    "
  >
    {#each strip as sym, i (i)}
      <GameSymbol symbol={sym} size={cellSize} />
    {/each}
  </div>
</div>

<style>
  .spinning-reel {
    width: var(--cell);
    height: calc(var(--cell) * 3);
    overflow: hidden;
    position: relative;
    background: #0a0a0a;
    border-radius: 4px;
    box-shadow: inset 0 0 0 1px rgba(255,255,255,0.04);
  }

  .strip {
    display: flex;
    flex-direction: column;
    will-change: transform;
  }
</style>

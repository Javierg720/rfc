<script lang="ts">
  /**
   * ReelGrid
   * 5-reel × 3-row visible grid for RFC.
   * Used for both static preview and win celebration states in Storybook.
   */

  import GameSymbol, { type SymbolName } from './GameSymbol.svelte';

  interface Props {
    /** 5 reels × 3 rows */
    reels: SymbolName[][];
    /** Which positions are currently winning (row, col) */
    winningPositions?: Array<{ reel: number; row: number }>;
    /** Dim all non-winning symbols */
    dimNonWinners?: boolean;
    /** Trigger heartbeat animation on winning symbols */
    heartbeat?: boolean;
    /** Gap between reels (px) */
    gap?: number;
    /** Cell size (px) */
    cellSize?: number;
  }

  let {
    reels = [
      ['WILD', 'CHIEF', '10'],
      ['RAGE', 'SCATTER', 'K'],
      ['BELT', 'MCWHISKEY', 'A'],
      ['CHAMP', 'Q', 'J'],
      ['RAGE', 'CHIEF', 'WILD']
    ],
    winningPositions = [],
    dimNonWinners = false,
    heartbeat = false,
    gap = 10,
    cellSize = 168
  }: Props = $props();

  const isWinning = (reelIndex: number, rowIndex: number) =>
    winningPositions.some(p => p.reel === reelIndex && p.row === rowIndex);
</script>

<div
  class="reel-grid"
  style="--gap: {gap}px; --cell-size: {cellSize}px;"
>
  {#each reels as reel, reelIndex (reelIndex)}
    <div class="reel">
      {#each reel as symbol, rowIndex (rowIndex)}
        <GameSymbol
          {symbol}
          size={cellSize}
          win={isWinning(reelIndex, rowIndex)}
          dim={dimNonWinners && !isWinning(reelIndex, rowIndex)}
          class={heartbeat && isWinning(reelIndex, rowIndex) ? 'heartbeat' : ''}
        />
      {/each}
    </div>
  {/each}
</div>

<style>
  .reel-grid {
    display: flex;
    gap: var(--gap);
    background: rgba(8, 5, 5, 0.82);
    padding: 8px;
    border-radius: 4px;
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  }

  .reel {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
    background: #0a0a0a;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
  }

  .reel::before,
  .reel::after {
    content: '';
    position: absolute;
    left: 0; right: 0;
    height: 18px;
    z-index: 10;
    pointer-events: none;
  }
  .reel::before { top: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.82), transparent); }
  .reel::after  { bottom: 0; background: linear-gradient(to top, rgba(0,0,0,0.82), transparent); }
</style>

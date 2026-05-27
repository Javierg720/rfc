<script lang="ts">
  /**
   * GameSymbol
   * Renders a single RFC reel symbol using the production PNG assets.
   * Supports win highlight, dim, and various sizes used across the game.
   */

  export type SymbolName =
    | '10' | 'A' | 'J' | 'K' | 'Q'
    | 'BELT' | 'CHAMP' | 'CHIEF' | 'MCWHISKEY' | 'RAGE'
    | 'SCATTER' | 'WILD';

  interface Props {
    symbol: SymbolName;
    /** Size in pixels (square) */
    size?: number;
    /** Whether this symbol is currently part of a winning line */
    win?: boolean;
    /** Dim non-winning symbols (used during win celebration) */
    dim?: boolean;
    /** Extra class for custom animation (e.g. heartbeat) */
    class?: string;
  }

  let {
    symbol,
    size = 168,
    win = false,
    dim = false,
    class: className = ''
  }: Props = $props();

  const symbolSrc = `/assets/symbols/${symbol}.png`;

  const labelMap: Record<SymbolName, string> = {
    '10': 'Ten',
    'A': 'Ace',
    'J': 'Jack',
    'K': 'King',
    'Q': 'Queen',
    'BELT': 'Championship Belt',
    'CHAMP': 'Champion',
    'CHIEF': 'Chief',
    'MCWHISKEY': 'McWhiskey',
    'RAGE': 'Rage',
    'SCATTER': 'Scatter - Cage',
    'WILD': 'Wild'
  };
</script>

<div
  class={[
    'game-symbol',
    win && 'win',
    dim && 'dim',
    className
  ].filter(Boolean).join(' ')}
  style="width: {size}px; height: {size}px;"
  role="img"
  aria-label={labelMap[symbol] || symbol}
>
  <img
    src={symbolSrc}
    alt={symbol}
    class="symbol-img"
    style="width: {size - 14}px; height: {size - 14}px;"
    draggable="false"
  />

  {#if win}
    <div class="win-glow"></div>
  {/if}
</div>

<style>
  .game-symbol {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background:
      radial-gradient(circle at 50% 38%, rgba(255,255,255,0.07), transparent 48%),
      linear-gradient(180deg, #1a0509 0%, #050203 100%);
    border: 1px solid rgba(255, 75, 92, 0.14);
    box-shadow: inset 0 0 18px rgba(0,0,0,0.78), inset 0 0 0 2px rgba(255,255,255,0.03);
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    flex-shrink: 0;
  }

  .symbol-img {
    position: relative;
    z-index: 2;
    object-fit: contain;
    filter: contrast(1.08) saturate(0.95) drop-shadow(0 9px 11px rgba(0,0,0,0.65));
    transition: transform 0.3s cubic-bezier(0.23, 1.0, 0.32, 1), filter 0.3s;
    pointer-events: none;
  }

  .game-symbol.win {
    border-color: #cc1a2e;
    box-shadow: 0 0 26px rgba(204, 26, 46, 0.65), inset 0 0 0 1px rgba(255,255,255,0.2);
    z-index: 3;
  }

  .game-symbol.win .symbol-img {
    filter: contrast(1.12) saturate(1.08) drop-shadow(0 9px 11px rgba(0,0,0,0.65));
    transform: scale(1.04);
  }

  .game-symbol.dim {
    opacity: 0.35;
    filter: grayscale(0.3);
  }

  .win-glow {
    position: absolute;
    inset: -2px;
    border-radius: 12px;
    background: radial-gradient(circle at center, rgba(204,26,46,0.35) 0%, transparent 70%);
    z-index: 1;
    pointer-events: none;
    animation: winPulse 1.1s ease-in-out infinite alternate;
  }

  @keyframes winPulse {
    from { opacity: 0.6; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1.04); }
  }

  /* Heartbeat used on winning symbols during celebration */
  .game-symbol.heartbeat {
    animation: symbolHeartbeat 720ms ease-in-out infinite;
  }

  @keyframes symbolHeartbeat {
    0%, 100% { transform: scale(1); }
    18% { transform: scale(1.07); }
    34% { transform: scale(0.965); }
    52% { transform: scale(1.04); }
  }
</style>

<script lang="ts">
  /**
   * RFCSlotDemo
   * Full interactive RFC slot machine experience inside Storybook.
   * Wires PremiumSpinButton + SpinningReel + ReelGrid + effects together.
   * This is the crown jewel for component development of the RFC game.
   */

  import PremiumSpinButton from './PremiumSpinButton.svelte';
  import SpinningReel from './SpinningReel.svelte';
  import MultiplierBadge from './MultiplierBadge.svelte';
  import GameSymbol, { type SymbolName } from './GameSymbol.svelte';
  import ReelFrame from './ReelFrame.svelte';

  // All available symbols
  const ALL_SYMBOLS: SymbolName[] = ['10','A','J','K','Q','BELT','CHAMP','CHIEF','MCWHISKEY','RAGE','SCATTER','WILD'];

  // Simple weighted random picker (higher value symbols rarer)
  function randomSymbol(): SymbolName {
    const weights: Record<SymbolName, number> = {
      '10': 18, 'A': 16, 'J': 15, 'K': 14, 'Q': 14,
      'BELT': 6, 'CHAMP': 5, 'CHIEF': 7, 'MCWHISKEY': 7, 'RAGE': 6,
      'SCATTER': 4, 'WILD': 5
    };
    const pool: SymbolName[] = [];
    for (const [sym, w] of Object.entries(weights)) {
      for (let i = 0; i < w; i++) pool.push(sym as SymbolName);
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // Generate a full 5x3 grid
  function generateGrid(): SymbolName[][] {
    return Array.from({ length: 5 }, () =>
      Array.from({ length: 3 }, () => randomSymbol())
    );
  }

  // Very simple win detection for demo (any 3+ matching in a row on same row)
  function findWins(grid: SymbolName[][]): Array<{ reel: number; row: number }> {
    const wins: Array<{ reel: number; row: number }> = [];
    for (let row = 0; row < 3; row++) {
      let streak = 1;
      let current = grid[0][row];
      for (let r = 1; r < 5; r++) {
        if (grid[r][row] === current || grid[r][row] === 'WILD' || current === 'WILD') {
          streak++;
        } else {
          if (streak >= 3) {
            for (let i = r - streak; i < r; i++) wins.push({ reel: i, row });
          }
          streak = 1;
          current = grid[r][row];
        }
      }
      if (streak >= 3) {
        for (let i = 5 - streak; i < 5; i++) wins.push({ reel: i, row });
      }
    }
    return wins;
  }

  // Calculate fake win amount
  function calculateWin(grid: SymbolName[][], wins: any[]): number {
    if (wins.length === 0) return 0;
    const base = wins.length * 18 + Math.random() * 40;
    const highSymCount = grid.flat().filter(s => ['CHAMP','RAGE','BELT','WILD'].includes(s)).length;
    return Math.floor(base + highSymCount * 12);
  }

  // State
  let grid = $state(generateGrid());
  let visibleGrid = $state(grid); // what the spinning reels settle on
  let winningPositions = $state<any[]>([]);
  let winAmount = $state(0);
  let multiplier = $state(1);
  let isSpinning = $state(false);
  let buttonState = $state<'idle'|'active'|'spinning'|'stop'|'disabled'>('idle');
  let showNuke = $state(false);
  let showBigWin = $state(false);
  let bigWinAmount = $state(0);
  let mode = $state<'normal'|'bonus'>('normal');

  let reelRefs: any[] = [];
  let reelsStopped = 0;

  function resetReelsStopped() {
    reelsStopped = 0;
  }

  function handleReelStop() {
    reelsStopped++;
    if (reelsStopped === 5) {
      // All reels finished animating — finalize
      setTimeout(() => {
        const finalWins = findWins(visibleGrid);
        winningPositions = finalWins;
        winAmount = calculateWin(visibleGrid, finalWins);

        const isBig = winAmount > 180 || finalWins.length > 6;

        if (isBig) {
          triggerBigWin();
        }

        if (visibleGrid.flat().filter(s => s === 'SCATTER').length >= 3) {
          triggerBonusMode();
        }

        buttonState = 'idle';
        isSpinning = false;
      }, 180);
    }
  }

  function triggerBigWin() {
    showNuke = true;
    bigWinAmount = winAmount * multiplier;
    showBigWin = true;

    setTimeout(() => {
      showNuke = false;
    }, 1350);

    setTimeout(() => {
      showBigWin = false;
      bigWinAmount = 0;
    }, 4200);
  }

  function triggerBonusMode() {
    mode = 'bonus';
    multiplier = 3 + Math.floor(Math.random() * 6);
    setTimeout(() => {
      if (mode === 'bonus') multiplier = 1;
    }, 6500);
  }

  async function spin() {
    if (isSpinning) return;

    isSpinning = true;
    buttonState = 'spinning';
    winningPositions = [];
    winAmount = 0;
    showBigWin = false;

    // Generate outcome
    const newGrid = generateGrid();
    visibleGrid = newGrid;

    // Occasionally force a nice win for demo purposes
    if (Math.random() < 0.28) {
      const sym = ['CHAMP', 'RAGE', 'WILD', 'BELT'][Math.floor(Math.random()*4)] as SymbolName;
      for (let r = 0; r < 5; r++) {
        visibleGrid[r][1] = sym;
        if (r < 4) visibleGrid[r][2] = sym;
      }
    }

    grid = visibleGrid; // keep in sync for non-spinning view

    resetReelsStopped();

    // Slight delay before reels really start (feels premium)
    await new Promise(r => setTimeout(r, 60));

    // Trigger the spinning reels (they handle their own animation)
    // We just need to wait for callbacks
  }

  function buyBonus() {
    if (isSpinning) return;

    mode = 'bonus';
    multiplier = 4 + Math.floor(Math.random() * 5);
    buttonState = 'active';

    // Visual tease — then auto spin with bonus energy
    setTimeout(() => {
      spin();
    }, 380);
  }

  function resetDemo() {
    mode = 'normal';
    multiplier = 1;
    winningPositions = [];
    winAmount = 0;
    showBigWin = false;
    showNuke = false;
    grid = generateGrid();
    visibleGrid = grid;
    buttonState = 'idle';
    isSpinning = false;
  }

  // Keyboard support (space = spin)
  function handleGlobalKey(e: KeyboardEvent) {
    if (e.key === ' ' && !isSpinning) {
      e.preventDefault();
      spin();
    }
    if (e.key.toLowerCase() === 'b' && !isSpinning) {
      e.preventDefault();
      buyBonus();
    }
    if (e.key.toLowerCase() === 'r') {
      resetDemo();
    }
  }
</script>

<svelte:window onkeydown={handleGlobalKey} />

<div class="rfc-slot-demo">
  <!-- Top HUD -->
  <div class="demo-hud">
    <div class="mode-indicator" class:bonus={mode === 'bonus'}>
      {mode === 'bonus' ? 'CAGE FREE FIGHTS — MULTIPLIER ACTIVE' : 'RUTHLESS FIGHTING CHAMPIONSHIP'}
    </div>

    {#if mode === 'bonus' || multiplier > 1}
      <MultiplierBadge value={multiplier} pulsing={true} />
    {/if}

    <button class="reset-btn" onclick={resetDemo}>RESET DEMO</button>
  </div>

  <!-- Main Game Area -->
  <div class="game-stage">
    <!-- Reels -->
    <div class="reels-container">
      {#each visibleGrid as reelSymbols, index (index)}
        <div class="reel-wrapper" class:anticipate={isSpinning && index === 4 && Math.random() > 0.5}>
          <SpinningReel
            symbols={reelSymbols}
            spinning={isSpinning}
            stopDelay={index * 140}
            cellSize={152}
            onStop={handleReelStop}
          />
        </div>
      {/each}
    </div>

    <!-- Reel Frame overlay (fully wired to the proper layout system) -->
    <ReelFrame />

    <!-- Win overlay layer (simple highlights) -->
    {#if winningPositions.length > 0 && !isSpinning}
      <div class="win-overlay">
        {#each winningPositions as pos}
          <div class="win-highlight" style="left: {pos.reel * 162 + 6}px; top: {pos.row * 162 + 6}px;"></div>
        {/each}
      </div>
    {/if}

    <!-- Big Win Banner -->
    {#if showBigWin}
      <div class="bigwin-banner">
        <div class="bigwin-label">BIG WIN</div>
        <div class="bigwin-amount">${bigWinAmount.toLocaleString()}</div>
      </div>
    {/if}
  </div>

  <!-- Controls -->
  <div class="controls">
    <div class="button-group">
      <!-- Main Spin Button -->
      <PremiumSpinButton
        state={buttonState}
        variant={mode === 'bonus' ? 'buy-bonus' : 'normal'}
        size={138}
        onclick={spin}
        label={mode === 'bonus' ? 'FIGHT' : 'SPIN'}
      />

      <!-- Buy Bonus -->
      <button
        class="buy-bonus-btn"
        disabled={isSpinning}
        onclick={buyBonus}
      >
        BUY BONUS
        <span class="price">35×</span>
      </button>
    </div>

    <div class="win-display">
      {#if winAmount > 0 && !isSpinning}
        <div class="win-text">WIN</div>
        <div class="win-value">${(winAmount * multiplier).toLocaleString()}</div>
      {:else}
        <div class="hint">SPACE = Spin • B = Buy Bonus • R = Reset</div>
      {/if}
    </div>
  </div>

  <!-- Nuke Flash (KO punch) -->
  {#if showNuke}
    <div class="nuke-flash fire"></div>
  {/if}
</div>

<style>
  .rfc-slot-demo {
    background: #0a0505;
    padding: 32px;
    border-radius: 16px;
    max-width: 1100px;
    margin: 0 auto;
    box-shadow: 0 0 80px rgba(0,0,0,0.6);
    font-family: 'Barlow Condensed', sans-serif;
    color: #fff;
    position: relative;
    overflow: hidden;
  }

  .demo-hud {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 18px;
    padding: 0 12px;
  }

  .mode-indicator {
    font-size: 13px;
    letter-spacing: 3.5px;
    color: #888;
    font-weight: 700;
  }
  .mode-indicator.bonus {
    color: #e8a23c;
    text-shadow: 0 0 12px rgba(232,162,60,0.5);
  }

  .reset-btn {
    background: #222;
    color: #777;
    border: 1px solid #444;
    padding: 6px 14px;
    font-size: 12px;
    letter-spacing: 1px;
    border-radius: 4px;
    cursor: pointer;
  }

  .game-stage {
    position: relative;
    background: #111;
    padding: 18px;
    border-radius: 8px;
    margin-bottom: 28px;
  }

  .reels-container {
    display: flex;
    gap: 10px;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  /* When LayoutManager + .dev-layout-active is active, these rules kick in */
  .dev-layout-active .game-stage .reels-container {
    position: absolute;
    top: var(--dev-reels-y, 0);
    left: 50%;
    transform: translateX(calc(-50% + var(--dev-reels-offset-x, 0px)));
    width: var(--dev-reels-w, auto);
    height: var(--dev-reels-h, auto);
  }

  .reel-wrapper.anticipate {
    box-shadow: 0 0 0 3px #cc1a2e, 0 0 40px #cc1a2e;
    animation: anticipate 380ms infinite alternate;
  }

  @keyframes anticipate {
    from { box-shadow: 0 0 0 3px #cc1a2e, 0 0 20px rgba(204,26,46,0.4); }
    to   { box-shadow: 0 0 0 3px #cc1a2e, 0 0 55px rgba(204,26,46,0.85); }
  }

  .win-overlay {
    position: absolute;
    inset: 18px;
    pointer-events: none;
    z-index: 10;
  }

  .win-highlight {
    position: absolute;
    width: 152px;
    height: 152px;
    border: 3px solid #cc1a2e;
    border-radius: 6px;
    box-shadow: 0 0 24px #cc1a2e, inset 0 0 20px rgba(204,26,46,0.3);
    animation: winPulse 900ms infinite alternate;
  }

  .bigwin-banner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(10,5,5,0.92);
    border: 4px solid #ffd700;
    padding: 18px 58px;
    text-align: center;
    z-index: 30;
    box-shadow: 0 0 80px rgba(255,215,0,0.4);
    animation: bigWinPop 0.4s cubic-bezier(0.23,1.0,0.32,1);
  }

  .bigwin-label {
    font-size: 22px;
    letter-spacing: 6px;
    color: #ffd700;
    font-weight: 800;
  }

  .bigwin-amount {
    font-size: 72px;
    font-weight: 900;
    color: #fff;
    line-height: 1;
    margin-top: -8px;
    text-shadow: 0 0 30px #ffd700;
  }

  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 60px;
    flex-wrap: wrap;
  }

  .button-group {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .buy-bonus-btn {
    background: linear-gradient(180deg, #f3bd5c, #b24716 56%, #5b1505);
    color: #fff7d8;
    border: none;
    padding: 14px 26px;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 2px;
    border-radius: 6px;
    cursor: pointer;
    box-shadow: 0 4px 0 #5b1505, 0 0 20px rgba(232,162,60,0.3);
    transition: all 0.15s;
  }

  .buy-bonus-btn:hover:not(:disabled) {
    filter: brightness(1.1);
    transform: translateY(-1px);
  }

  .buy-bonus-btn .price {
    display: block;
    font-size: 13px;
    color: #e8a23c;
    margin-top: 1px;
  }

  .win-display {
    min-width: 180px;
    text-align: center;
  }

  .win-text {
    font-size: 13px;
    letter-spacing: 4px;
    color: #cc1a2e;
    font-weight: 700;
  }

  .win-value {
    font-size: 42px;
    font-weight: 900;
    color: #fff;
    text-shadow: 0 0 20px #22dd22;
    line-height: 1;
  }

  .hint {
    font-size: 12px;
    color: #555;
    letter-spacing: 1px;
  }

  .nuke-flash {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, #fff 0%, #ffd0d8 20%, #cc1a2e 50%, transparent 75%);
    z-index: 50;
    pointer-events: none;
    opacity: 0;
    animation: koFlash 1.25s steps(8, end) forwards;
  }

  @keyframes winPulse {
    from { opacity: 0.7; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1.03); }
  }

  @keyframes bigWinPop {
    from { transform: translate(-50%, -50%) scale(0.6); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }

  @keyframes koFlash {
    0% { opacity: 0; transform: scale(0.4); }
    12% { opacity: 1; transform: scale(1.7); }
    28% { opacity: 0.35; transform: scale(1.4); }
    45% { opacity: 0.95; transform: scale(2.1); }
    100% { opacity: 0; transform: scale(3.2); }
  }
</style>

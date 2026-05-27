<script lang="ts">
  /**
   * MobileRFCSlotDemo
   * Phone-optimized RFC slot experience.
   * Supports both portrait and landscape mobile orientations.
   * Follows the production mobile layout rules from the game.
   */

  import PremiumSpinButton from './PremiumSpinButton.svelte';
  import SpinningReel from './SpinningReel.svelte';
  import HostCharacter from './HostCharacter.svelte';
  import BuyBonusButton from './BuyBonusButton.svelte';
  import type { SymbolName } from './GameSymbol.svelte';

  type Orientation = 'portrait' | 'landscape';

  interface Props {
    orientation?: Orientation;
    /** Enable the proper dev layout system (respects --dev-* vars via .dev-layout-active) */
    useDevLayout?: boolean;
  }

  let { orientation = 'portrait', useDevLayout = false }: Props = $props();

  const isLandscape = $derived(orientation === 'landscape');

  const ALL: SymbolName[] = ['10','A','J','K','Q','BELT','CHAMP','CHIEF','MCWHISKEY','RAGE','SCATTER','WILD'];

  function rand(): SymbolName {
    return ALL[Math.floor(Math.random() * ALL.length)];
  }

  function makeGrid(): SymbolName[][] {
    return Array.from({ length: 5 }, () => [rand(), rand(), rand()]);
  }

  // Simple mobile win check (same as desktop demo for consistency)
  function findMobileWins(grid: SymbolName[][]) {
    const wins: any[] = [];
    for (let row = 0; row < 3; row++) {
      let streak = 1;
      let sym = grid[0][row];
      for (let r = 1; r < 5; r++) {
        if (grid[r][row] === sym || grid[r][row] === 'WILD') streak++;
        else {
          if (streak >= 3) for (let i = r - streak; i < r; i++) wins.push({ reel: i, row });
          streak = 1; sym = grid[r][row];
        }
      }
      if (streak >= 3) for (let i = 5 - streak; i < 5; i++) wins.push({ reel: i, row });
    }
    return wins;
  }

  function calcWin(grid: SymbolName[][], wins: any[]) {
    return wins.length ? Math.floor(wins.length * 22 + Math.random() * 55) : 0;
  }

  // State
  let grid = $state(makeGrid());
  let visibleGrid = $state(grid);
  let wins = $state<any[]>([]);
  let winAmount = $state(0);
  let multiplier = $state(1);
  let isSpinning = $state(false);
  let btnState = $state<'idle'|'spinning'|'stop'>('idle');
  let mode = $state<'normal'|'bonus'>('normal');
  let showFlash = $state(false);
  let showBig = $state(false);
  let bigAmount = $state(0);

  let stopped = 0;

  function resetStopped() { stopped = 0; }

  function onReelDone() {
    stopped++;
    if (stopped === 5) {
      setTimeout(() => {
        wins = findMobileWins(visibleGrid);
        winAmount = calcWin(visibleGrid, wins) * multiplier;

        const big = winAmount > 160;
        if (big) {
          showFlash = true;
          bigAmount = winAmount;
          showBig = true;
          setTimeout(() => showFlash = false, 1100);
          setTimeout(() => { showBig = false; }, 3600);
        }

        if (visibleGrid.flat().filter(s => s === 'SCATTER').length >= 3) {
          mode = 'bonus';
          multiplier = 4 + Math.floor(Math.random() * 5);
        }

        btnState = 'idle';
        isSpinning = false;
      }, 140);
    }
  }

  async function spin() {
    if (isSpinning) return;
    isSpinning = true;
    btnState = 'spinning';
    wins = [];
    winAmount = 0;

    const next = makeGrid();
    visibleGrid = next;

    // Force occasional nice wins on mobile for demo
    if (Math.random() < 0.35) {
      const hot = ['CHAMP','RAGE','WILD'][Math.floor(Math.random()*3)] as SymbolName;
      for (let r = 0; r < 5; r++) visibleGrid[r][1] = hot;
    }

    resetStopped();
  }

  function buyBonus() {
    if (isSpinning) return;
    mode = 'bonus';
    multiplier = 5 + Math.floor(Math.random() * 4);
    setTimeout(spin, 320);
  }

  function reset() {
    mode = 'normal';
    multiplier = 1;
    wins = [];
    winAmount = 0;
    visibleGrid = makeGrid();
    grid = visibleGrid;
    btnState = 'idle';
    isSpinning = false;
    showBig = false;
    showFlash = false;
  }
</script>

<!-- Phone frame (simulates real device) -->
<div class="phone-frame" class:landscape={isLandscape}>
  <div class="phone-screen" class:landscape={isLandscape}>
    <!-- Top status bar simulation -->
    <div class="phone-status">
      <div class="time">9:41</div>
      <div class="icons">📶 🔋</div>
    </div>

    <!-- Game content -->
    <div class="mobile-game">
      <!-- Header -->
      <div class="mobile-header">
        <div class="game-title">RFC</div>
        {#if mode === 'bonus'}
          <div class="mobile-mult">×{multiplier} <span class="tag">CAGE</span></div>
        {/if}
      </div>

      <!-- Reels -->
      <div class="mobile-reels" class:dev-layout-active={useDevLayout}>
        {#each visibleGrid as reel, i (i)}
          <SpinningReel
            symbols={reel}
            spinning={isSpinning}
            stopDelay={i * 120}
            cellSize={Math.round((Math.min(96, 100) * 3.8))} 
            onStop={onReelDone}
          />
        {/each}
      </div>

      <!-- Host (docked bottom right like production mobile) -->
      <HostCharacter 
        reaction={showBig ? 'biggest-win' : 'idle'} 
        mobile={true} 
        size={isLandscape ? 110 : 148} 
      />

      <!-- Win indicator -->
      {#if winAmount > 0 && !isSpinning}
        <div class="mobile-winbar">
          WIN <span>${winAmount}</span>
        </div>
      {/if}

      <!-- Big Win overlay -->
      {#if showBig}
        <div class="mobile-bigwin">
          BIG WIN<br>
          <strong>${bigAmount}</strong>
        </div>
      {/if}

      <!-- KO flash -->
      {#if showFlash}
        <div class="mobile-nuke"></div>
      {/if}
    </div>

    <!-- Bottom controls (thumb zone) -->
    <div class="mobile-controls">
      <div class="control-row">
        <PremiumSpinButton
          state={btnState}
          variant={mode === 'bonus' ? 'buy-bonus' : 'normal'}
          mobile={true}
          size={isLandscape ? 102 : 118}
          onclick={spin}
          label={mode === 'bonus' ? 'FIGHT' : 'SPIN'}
        />

        <BuyBonusButton
          price="35×"
          disabled={isSpinning}
          onclick={buyBonus}
        />
      </div>

      <button class="mobile-reset" onclick={reset}>RESET</button>
    </div>
  </div>
</div>

<style>
  .phone-frame {
    width: 100%;
    max-width: 380px;
    margin: 0 auto;
    background: #0f0f0f;
    border: 14px solid #1a1a1a;
    border-radius: 52px;
    box-shadow: 
      0 20px 50px rgba(0,0,0,0.7), 
      0 0 0 1px #222,
      inset 0 0 0 1px #333;
    overflow: hidden;
    position: relative;
  }

  .phone-screen {
    background: #0a0505;
    height: 680px;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .phone-status {
    height: 32px;
    background: #000;
    color: #fff;
    font-size: 11px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 18px;
    font-family: system-ui;
    z-index: 100;
  }

  .mobile-game {
    flex: 1;
    position: relative;
    padding: 8px 10px 0;
    overflow: hidden;
  }

  .mobile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px 10px;
    color: #cc1a2e;
    font-weight: 800;
    letter-spacing: 3px;
    font-size: 18px;
  }

  .mobile-mult {
    font-size: 15px;
    background: #1a1010;
    padding: 2px 10px;
    border-radius: 999px;
    border: 1px solid #cc1a2e;
    color: #e8a23c;
  }
  .mobile-mult .tag {
    font-size: 10px;
    opacity: 0.7;
    margin-left: 4px;
  }

  .mobile-reels {
    display: flex;
    gap: 4px;
    justify-content: center;
    padding: 4px;
    background: #111;
    border-radius: 6px;
  }

  .mobile-winbar {
    position: absolute;
    bottom: 92px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.85);
    color: #22dd22;
    font-size: 15px;
    padding: 4px 18px;
    border-radius: 999px;
    font-weight: 700;
    letter-spacing: 1px;
    z-index: 40;
    box-shadow: 0 0 20px rgba(34, 221, 34, 0.3);
  }
  .mobile-winbar span {
    font-size: 19px;
    margin-left: 6px;
  }

  .mobile-bigwin {
    position: absolute;
    top: 42%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #111;
    border: 4px solid #ffd700;
    color: #ffd700;
    text-align: center;
    padding: 10px 26px;
    font-size: 15px;
    letter-spacing: 2px;
    z-index: 60;
    box-shadow: 0 0 50px rgba(255,215,0,0.4);
  }
  .mobile-bigwin strong {
    font-size: 32px;
    color: #fff;
    display: block;
    line-height: 1;
  }

  .mobile-nuke {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, #fff 0%, #cc1a2e 60%, transparent 78%);
    z-index: 70;
    animation: mobileKO 1.1s steps(6) forwards;
    pointer-events: none;
  }

  .mobile-controls {
    background: #0a0505;
    padding: 12px 14px 18px;
    border-top: 1px solid #222;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 80;
  }

  .control-row {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .mobile-reset {
    font-size: 11px;
    letter-spacing: 1.5px;
    color: #555;
    background: none;
    border: 1px solid #333;
    padding: 2px 12px;
    border-radius: 4px;
  }

  @keyframes mobileKO {
    0% { opacity: 0; }
    12% { opacity: 0.95; }
    35% { opacity: 0.3; }
    100% { opacity: 0; }
  }

  /* ===================== LANDSCAPE MODE ===================== */
  .phone-frame.landscape {
    max-width: 680px;
    border-radius: 36px;
  }

  .phone-screen.landscape {
    height: 320px;
    flex-direction: row;
    padding: 0;
  }

  .phone-screen.landscape .mobile-game {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 4px 12px 0;
  }

  .phone-screen.landscape .mobile-reels {
    flex-direction: row;
    gap: 3px;
    padding: 2px;
    margin-top: 4px;
  }

  .phone-screen.landscape .mobile-header {
    padding: 2px 4px 4px;
    font-size: 15px;
  }

  .phone-screen.landscape .mobile-controls {
    width: 168px;
    flex-shrink: 0;
    border-top: none;
    border-left: 1px solid #222;
    padding: 12px 10px;
    justify-content: center;
    gap: 8px;
  }

  .phone-screen.landscape .control-row {
    flex-direction: column;
    gap: 8px;
  }

  .phone-screen.landscape .mobile-winbar,
  .phone-screen.landscape .mobile-bigwin {
    font-size: 13px;
  }
</style>

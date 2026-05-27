<script lang="ts">
  /**
   * MobileFighterPick
   * Mobile-optimized fighter selection screen for the Cage Free Fights / VS Bonus.
   * Designed for phone portrait and landscape.
   */

  export type Fighter = 'CHIEF' | 'RAGE' | 'MCWHISKEY';

  interface Props {
    selected?: Fighter | null;
    onSelect?: (fighter: Fighter, multiplier: number) => void;
    orientation?: 'portrait' | 'landscape';
  }

  let {
    selected = null,
    onSelect,
    orientation = 'portrait'
  }: Props = $props();

  const fighters: Array<{ id: Fighter; name: string; mult: number; color: string }> = [
    { id: 'CHIEF',      name: 'CHIEF',      mult: 5,  color: '#c46a2f' },
    { id: 'RAGE',       name: 'RAGE',       mult: 8,  color: '#9c1f2e' },
    { id: 'MCWHISKEY',  name: 'McWHISKEY',  mult: 3,  color: '#3a4a5f' }
  ];

  function select(f: typeof fighters[0]) {
    onSelect?.(f.id, f.mult);
  }
</script>

<div class="fighter-pick" class:landscape={orientation === 'landscape'}>
  <div class="header">
    <div class="title">PICK YOUR FIGHTER</div>
    <div class="subtitle">Cage Free Fights</div>
  </div>

  <div class="cards">
    {#each fighters as f}
      <button
        class="fighter-card"
        class:selected={selected === f.id}
        onclick={() => select(f)}
      >
        <div class="portrait" style="background: linear-gradient(180deg, {f.color}22, #111);">
          <img 
            src={`/assets/symbols/${f.id}.png`} 
            alt={f.name}
            class="fighter-img"
          />
          {#if selected === f.id}
            <div class="chosen">YOUR PICK</div>
          {/if}
        </div>

        <div class="info">
          <div class="name">{f.name}</div>
          <div class="mult">×{f.mult}</div>
        </div>
      </button>
    {/each}
  </div>
</div>

<style>
  .fighter-pick {
    background: #0a0505;
    padding: 16px 12px;
    border-radius: 12px;
    max-width: 420px;
    margin: 0 auto;
  }

  .fighter-pick.landscape {
    max-width: none;
    padding: 10px 16px;
  }

  .header {
    text-align: center;
    margin-bottom: 14px;
  }

  .title {
    font-family: 'Black Ops One', sans-serif;
    font-size: 21px;
    letter-spacing: 3px;
    color: #cc1a2e;
  }

  .subtitle {
    font-size: 12px;
    letter-spacing: 2px;
    color: #666;
    margin-top: 2px;
  }

  .cards {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .fighter-pick.landscape .cards {
    flex-direction: row;
    justify-content: center;
    gap: 14px;
  }

  .fighter-card {
    background: #111;
    border: 3px solid #333;
    border-radius: 14px;
    padding: 8px;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    gap: 12px;
    align-items: center;
    width: 100%;
    position: relative;
    overflow: hidden;
  }

  /* Strong touch feedback for mobile */
  .fighter-card::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(204,26,46,0.25);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
    pointer-events: none;
  }

  .fighter-card:active::after {
    width: 300%;
    height: 300%;
  }

  .fighter-pick.landscape .fighter-card {
    flex-direction: column;
    width: auto;
    min-width: 138px;
    align-items: center;
    text-align: center;
  }

  .fighter-card:hover {
    border-color: #cc1a2e;
    transform: translateY(-2px);
  }

  .fighter-card.selected {
    border-color: #3388ff;
    box-shadow: 0 0 0 1px #3388ff;
  }

  .portrait {
    width: 92px;
    height: 92px;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fighter-pick.landscape .portrait {
    width: 108px;
    height: 108px;
  }

  .fighter-img {
    width: 72%;
    height: 72%;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0,0,0,0.6));
  }

  .chosen {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    background: #3388ff;
    color: white;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1px;
    padding: 1px 8px;
    border-radius: 999px;
    white-space: nowrap;
  }

  .info {
    flex: 1;
  }

  .fighter-pick.landscape .info {
    margin-top: 6px;
  }

  .name {
    font-family: 'Black Ops One', sans-serif;
    font-size: 18px;
    color: #fff;
    letter-spacing: 1.5px;
  }

  .mult {
    font-size: 28px;
    font-weight: 900;
    color: #cc1a2e;
    line-height: 1;
    margin-top: -4px;
  }

  .fighter-pick.landscape .mult {
    font-size: 24px;
  }
</style>

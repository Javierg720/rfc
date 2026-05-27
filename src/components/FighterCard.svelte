<script lang="ts">
  /**
   * FighterCard
   * Interactive fighter selection card used in the Cage Free Fights / VS Bonus.
   * Matches the visual language from the RFC production game.
   */

  export type Fighter = 'CHIEF' | 'RAGE' | 'MCWHISKEY';

  interface Props {
    fighter: Fighter;
    multiplier?: number; // e.g. 3, 5, 8, 10
    selected?: boolean;
    disabled?: boolean;
    onSelect?: (fighter: Fighter) => void;
    /** Show the "YOUR PICK" badge */
    showPickBadge?: boolean;
  }

  let {
    fighter,
    multiplier = 3,
    selected = false,
    disabled = false,
    onSelect,
    showPickBadge = false
  }: Props = $props();

  const fighterData: Record<Fighter, { name: string; color: string; accent: string }> = {
    CHIEF:      { name: 'CHIEF',      color: '#c46a2f', accent: '#f4a261' },
    RAGE:       { name: 'RAGE',       color: '#9c1f2e', accent: '#ff4d5e' },
    MCWHISKEY:  { name: 'McWHISKEY',  color: '#3a4a5f', accent: '#8fb3d9' }
  };

  const data = fighterData[fighter];
  const portraitSrc = `/assets/fighter-select/${fighter.toLowerCase()}-portrait.webp`; // fallback path

  // Real game uses GIFs in some places; we use a safe static image + overlay treatment.
  // For Storybook we can also accept a video/gif override later.

  function handleSelect() {
    if (disabled || selected) return;
    onSelect?.(fighter);
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect();
    }
  }
</script>

<button
  class={[
    'fighter-card',
    selected && 'selected',
    disabled && 'disabled'
  ].filter(Boolean).join(' ')}
  onclick={handleSelect}
  onkeydown={handleKey}
  disabled={disabled}
  aria-pressed={selected}
  aria-label={`Select fighter ${data.name}`}
>
  <div class="portrait" style="background-color: {data.color}20;">
    <!-- Use real symbol as a strong visual proxy (fighter head) -->
    <img
      src={`/assets/symbols/${fighter}.png`}
      alt={data.name}
      class="portrait-img"
    />

    {#if showPickBadge || selected}
      <div class="pick-badge">YOUR PICK</div>
    {/if}
  </div>

  <div class="info">
    <div class="name" style="color: {data.accent};">{data.name}</div>
    <div class="mult">
      <span class="x">×</span>
      <span class="value">{multiplier}</span>
    </div>
  </div>
</button>

<style>
  .fighter-card {
    width: 100%;
    max-width: 280px;
    padding: 14px;
    background: rgba(12, 8, 8, 0.92);
    border: 4px solid rgba(255, 255, 255, 0.10);
    border-radius: 18px;
    cursor: pointer;
    transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    overflow: hidden;
    text-align: left;
    font-family: 'Barlow Condensed', sans-serif;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
  }

  .fighter-card:hover:not(:disabled) {
    border-color: #cc1a2e;
    box-shadow: 0 0 0 1px #cc1a2e, 0 20px 50px rgba(204, 26, 46, 0.3);
    transform: translateY(-3px) scale(1.015);
  }

  .fighter-card:active:not(:disabled) {
    transform: scale(0.985);
  }

  .fighter-card.selected {
    border-color: #3388ff;
    box-shadow: 0 0 0 1px #3388ff, 0 0 60px rgba(51, 136, 255, 0.45);
  }

  .fighter-card.disabled {
    opacity: 0.45;
    cursor: not-allowed;
    filter: grayscale(0.6);
  }

  .portrait {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1.05;
    border-radius: 12px;
    overflow: hidden;
    background: linear-gradient(180deg, #1a1a2e, #0f0f1a);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .portrait-img {
    width: 78%;
    height: 78%;
    object-fit: contain;
    filter: drop-shadow(0 12px 18px rgba(0,0,0,0.7)) contrast(1.05) saturate(1.1);
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .fighter-card:hover .portrait-img {
    transform: scale(1.06);
  }

  .pick-badge {
    position: absolute;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    background: #3388ff;
    color: white;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 2.5px;
    padding: 3px 14px 2px;
    border-radius: 9999px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.6);
    z-index: 10;
    white-space: nowrap;
  }

  .info {
    margin-top: 14px;
    padding: 0 6px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }

  .name {
    font-family: 'Black Ops One', sans-serif;
    font-size: 26px;
    letter-spacing: 2.5px;
    font-weight: 400;
    line-height: 1;
    text-shadow: 0 2px 10px rgba(0,0,0,0.7);
  }

  .mult {
    font-size: 42px;
    font-weight: 900;
    line-height: 1;
    color: #cc1a2e;
    text-shadow: 0 0 18px rgba(204, 26, 46, 0.55);
    display: flex;
    align-items: flex-end;
    gap: 1px;
  }

  .mult .x {
    font-size: 21px;
    font-weight: 700;
    margin-right: 1px;
    opacity: 0.9;
  }

  .mult .value {
    font-size: 46px;
    line-height: 0.92;
  }
</style>

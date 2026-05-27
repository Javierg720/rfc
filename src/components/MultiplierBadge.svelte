<script lang="ts">
  /**
   * MultiplierBadge
   * Championship / bonus multiplier display used in the top-right of the game during features.
   */

  interface Props {
    value: number; // 1–10+
    label?: string;
    pulsing?: boolean;
  }

  let { value, label = 'MULTIPLIER', pulsing = false }: Props = $props();
</script>

<div class={['mult-badge', pulsing && 'pulsing'].filter(Boolean).join(' ')}>
  <div class="mult-label">{label}</div>
  <div class="mult-value">
    <span class="x">×</span>{value}
  </div>
</div>

<style>
  .mult-badge {
    min-width: 200px;
    background: linear-gradient(180deg, #1a1010, #0a0505);
    border: 3px solid #cc1a2e;
    padding: 11px 26px 9px;
    border-radius: 8px;
    text-align: center;
    box-shadow: 0 0 22px rgba(204, 26, 46, 0.38);
    font-family: 'Barlow Condensed', sans-serif;
    transition: transform 0.2s cubic-bezier(0.34, 1.6, 0.64, 1);
  }

  .mult-badge.pulsing {
    animation: multBump 620ms cubic-bezier(0.34, 1.6, 0.64, 1);
  }

  .mult-label {
    font-size: 11px;
    letter-spacing: 3.5px;
    color: #cc1a2e;
    font-weight: 800;
    text-transform: uppercase;
  }

  .mult-value {
    font-size: 46px;
    font-weight: 800;
    color: #fff;
    line-height: 0.95;
    margin-top: 1px;
    text-shadow: 0 0 22px #cc1a2e;
    letter-spacing: -1px;
  }

  .mult-value .x {
    font-size: 24px;
    font-weight: 700;
    opacity: 0.75;
    vertical-align: 2px;
    margin-right: 1px;
  }

  @keyframes multBump {
    0% { transform: scale(1); }
    35% { transform: scale(1.38); box-shadow: 0 0 46px #cc1a2e; }
    100% { transform: scale(1); }
  }
</style>

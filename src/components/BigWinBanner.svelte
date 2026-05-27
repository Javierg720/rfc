<script lang="ts">
  interface Props {
    amount: number;
    visible?: boolean;
    onDone?: () => void;
  }

  let { amount, visible = true, onDone }: Props = $props();

  $effect(() => {
    if (visible) {
      const t = setTimeout(() => onDone?.(), 3800);
      return () => clearTimeout(t);
    }
  });
</script>

{#if visible}
  <div class="bigwin-banner">
    <div class="label">BIG WIN</div>
    <div class="amount">${amount.toLocaleString()}</div>
  </div>
{/if}

<style>
  .bigwin-banner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9998;
    background: rgba(12, 5, 5, 0.94);
    border: 5px solid #ffd700;
    padding: 22px 64px;
    text-align: center;
    box-shadow: 0 0 90px rgba(255, 215, 0, 0.45), inset 0 0 40px rgba(255,215,0,0.1);
    animation: pop 0.38s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .label {
    font-family: 'Barlow Condensed', sans-serif;
    font-size: 24px;
    letter-spacing: 8px;
    color: #ffd700;
    font-weight: 800;
  }

  .amount {
    font-size: 78px;
    font-weight: 900;
    line-height: 1;
    color: #fff;
    margin-top: -10px;
    text-shadow: 0 0 32px #ffd700, 0 4px 12px rgba(0,0,0,0.6);
  }

  @keyframes pop {
    from { transform: translate(-50%, -50%) scale(0.55); opacity: 0; }
    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  }
</style>

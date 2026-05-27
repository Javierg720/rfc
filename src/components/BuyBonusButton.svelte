<script lang="ts">
  /**
   * BuyBonusButton
   * Premium gold "BUY BONUS" button matching the RFC production aesthetic.
   * Used for direct bonus purchase (Cage Free Fights entry).
   */

  interface Props {
    price?: string; // e.g. "35×" or "50×"
    disabled?: boolean;
    onclick?: () => void;
    label?: string;
  }

  let {
    price = '35×',
    disabled = false,
    onclick,
    label = 'BUY BONUS'
  }: Props = $props();
</script>

<button
  class="buy-bonus-btn"
  {disabled}
  onclick={() => onclick?.()}
>
  <span class="main-label">{label}</span>
  <span class="price">{price}</span>
</button>

<style>
  .buy-bonus-btn {
    background: linear-gradient(180deg, #f3bd5c, #b24716 56%, #5b1505);
    color: #fff7d8;
    border: none;
    padding: 16px 30px 14px;
    font-size: 15px;
    font-weight: 800;
    letter-spacing: 2.5px;
    border-radius: 6px;
    cursor: pointer;
    box-shadow:
      0 5px 0 #5b1505,
      0 0 24px rgba(232, 162, 60, 0.35),
      inset 0 1px 0 rgba(255,255,255,0.25);
    transition: all 0.12s cubic-bezier(0.23, 1, 0.32, 1);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 138px;
    text-transform: uppercase;
    position: relative;
    overflow: hidden;
  }

  /* Mobile-friendly ripple */
  .buy-bonus-btn::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255,255,255,0.35);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.35s, height 0.35s;
    pointer-events: none;
  }

  .buy-bonus-btn:active::after {
    width: 240%;
    height: 240%;
  }

  .buy-bonus-btn:hover:not(:disabled) {
    filter: brightness(1.12);
    transform: translateY(-2px);
    box-shadow:
      0 7px 0 #5b1505,
      0 0 32px rgba(232, 162, 60, 0.55);
  }

  .buy-bonus-btn:active:not(:disabled) {
    transform: translateY(2px);
    box-shadow: 0 2px 0 #5b1505;
  }

  .buy-bonus-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    filter: grayscale(0.3);
  }

  .main-label {
    font-size: 15px;
    font-weight: 900;
    letter-spacing: 3px;
  }

  .price {
    font-size: 13px;
    color: #e8a23c;
    font-weight: 700;
    margin-top: -1px;
    letter-spacing: 1px;
  }
</style>

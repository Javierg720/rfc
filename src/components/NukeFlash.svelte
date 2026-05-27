<script lang="ts">
  /**
   * NukeFlash
   * Full-screen KO punch / big win flash effect from the RFC game.
   * Trigger with `fire={true}` or by calling the exposed `trigger()` method.
   */

  interface Props {
    fire?: boolean;
    duration?: number;
    onComplete?: () => void;
  }

  let { fire = false, duration = 1250, onComplete }: Props = $props();

  let active = $state(false);

  $effect(() => {
    if (fire) {
      active = true;
      const t = setTimeout(() => {
        active = false;
        onComplete?.();
      }, duration);
      return () => clearTimeout(t);
    }
  });

  export function trigger() {
    active = true;
    setTimeout(() => {
      active = false;
      onComplete?.();
    }, duration);
  }
</script>

<div class={['nuke-flash', active && 'fire'].filter(Boolean).join(' ')}></div>

<style>
  .nuke-flash {
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    background: radial-gradient(circle at center, #fff 0%, #ffd0d8 20%, #cc1a2e 50%, transparent 75%);
    opacity: 0;
  }

  .nuke-flash.fire {
    animation: koFlash 1.25s steps(8, end) forwards;
  }

  @keyframes koFlash {
    0%   { opacity: 0; transform: scale(0.35); filter: brightness(3) saturate(1.6); }
    10%  { opacity: 1; transform: scale(1.65); }
    22%  { opacity: 0.28; transform: scale(1.35); }
    38%  { opacity: 0.92; transform: scale(2.15); }
    55%  { opacity: 0.38; }
    100% { opacity: 0; transform: scale(3.5); }
  }
</style>

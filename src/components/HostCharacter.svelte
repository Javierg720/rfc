<script lang="ts">
  /**
   * HostCharacter
   * The corner announcer / "Max" fighter character from RFC.
   * Supports different reaction states (idle, small win, big win, KO).
   * Uses the production fighter-max sprite frames.
   */

  type Reaction = 'idle' | 'small-win' | 'big-win' | 'biggest-win' | 'ko';

  interface Props {
    reaction?: Reaction;
    size?: number;
    /** Mobile mode: smaller, positioned for bottom-right docking in phone layouts */
    mobile?: boolean;
  }

  let { reaction = 'idle', size = 420, mobile = false }: Props = $props();

  // When in dev layout mode, we let CSS vars control size unless a explicit size is passed
  const effectiveSize = $derived(
    useDevLayout 
      ? size 
      : (mobile ? Math.min(size, 158) : size)
  );

  const reactionMap: Record<Reaction, string> = {
    'idle': '/assets/fighter-max/frame_010.png',
    'small-win': '/assets/fighter-max/frame_018.png',
    'big-win': '/assets/fighter-max/frame_026.png',
    'biggest-win': '/assets/fighter-max/frame_032.png',
    'ko': '/assets/fighter-max/frame_005.png'
  };

  let currentSrc = $derived(reactionMap[reaction]);

  // Simple pulse on big reactions
  let pulse = $derived(reaction === 'big-win' || reaction === 'biggest-win');
</script>

<div 
  class="host-character" 
  class:mobile 
  style={`width:${effectiveSize}px; height:${effectiveSize * 1.28}px;`}
>
  <img
    src={currentSrc}
    alt="RFC Host"
    class:pulse
    style="width: {effectiveSize}px; height: auto;"
  />

  {#if reaction === 'ko'}
    <div class="ko-overlay">K.O.</div>
  {/if}
</div>

<style>
  .host-character {
    position: relative;
    overflow: hidden;
    pointer-events: none;
  }

  .host-character.mobile {
    /* Matches production mobile docking (bottom-right, smaller) */
    position: fixed;
    right: 12px;
    bottom: 0;
    z-index: 25;
    pointer-events: none;
  }

  img {
    image-rendering: crisp-edges;
    filter: contrast(1.08) saturate(1.1) drop-shadow(0 18px 22px rgba(0,0,0,0.7));
    transition: transform 0.3s ease;
  }

  /* When LayoutManager is active (.dev-layout-active on body), these vars control positioning */
  .dev-layout-active .host-character {
    position: fixed;
    right: var(--dev-max-right, 20px);
    bottom: var(--dev-max-bottom, 0px);
    width: var(--dev-max-w, 247px);
    height: var(--dev-max-h, 418px);
    z-index: 50;
    pointer-events: none;
  }

  .dev-layout-active .host-character img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    object-position: bottom center;
  }

  .pulse {
    animation: hostPulse 1.1s ease-in-out infinite alternate;
  }

  .ko-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Black Ops One', sans-serif;
    font-size: 72px;
    color: #ff1e39;
    text-shadow: 0 0 30px #ff1e39, 0 0 60px #ff1e39;
    letter-spacing: 6px;
    z-index: 5;
    mix-blend-mode: screen;
    animation: koPop 0.6s ease forwards;
  }

  @keyframes hostPulse {
    from { transform: scale(1); }
    to { transform: scale(1.035); }
  }

  @keyframes koPop {
    0% { transform: scale(2.4); opacity: 0; }
    40% { transform: scale(0.9); opacity: 1; }
    100% { transform: scale(1); }
  }
</style>

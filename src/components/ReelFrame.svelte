<script lang="ts">
  /**
   * ReelFrame
   * The decorative reel frame overlay (the webp border).
   * 
   * When LayoutManager has applied a profile and .dev-layout-active is on body,
   * this component will automatically position itself using your RLE-tuned
   * --dev-reel-frame-* variables.
   *
   * In normal production builds it can just be a static positioned element.
   */

  interface Props {
    /** Optional override src if you want different frames per state */
    src?: string;
  }

  let { src = './assets/reel-frame.webp' }: Props = $props();
</script>

<div class="reel-frame">
  <img 
    {src} 
    alt="Reel Frame" 
    class="reel-frame-image"
  />
</div>

<style>
  .reel-frame {
    position: absolute;
    pointer-events: none;
    z-index: 25;
    /* In dev layout mode these get overridden by the global rules */
  }



  .reel-frame-image {
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  /* ============================================
     DEV LAYOUT MODE - controlled by LayoutManager + profiles
     These are the values you tune with arrows/drag in the RLE tool.
  ============================================ */
  .dev-layout-active .reel-frame {
    top: var(--dev-reel-frame-y);
    left: var(--dev-reel-frame-x);
    right: var(--dev-reel-frame-x);
    bottom: var(--dev-reel-frame-y);
    transform: translate(var(--dev-reel-frame-tx), var(--dev-reel-frame-ty)) 
               scale(var(--dev-reel-frame-scale));
    transform-origin: center;
  }
</style>

<script lang="ts">
  /**
   * DevLayoutEnabler
   * Drop this in your root layout or a dev-only wrapper to automatically
   * apply the current device profile and enable the .dev-layout-active class.
   *
   * Example:
   *   <DevLayoutEnabler />
   */
  import { LayoutManager } from './LayoutManager';
  import { onMount } from 'svelte';

  onMount(() => {
    LayoutManager.init();
    LayoutManager.applyCurrent();
  });
</script>

<!-- No visible output, just side effects -->
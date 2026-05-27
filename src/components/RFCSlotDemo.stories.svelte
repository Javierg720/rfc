<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RFCSlotDemo from './RFCSlotDemo.svelte';

  const { Story } = defineMeta({
    title: 'RFC UI/RFC Slot Demo (Interactive)',
    component: RFCSlotDemo,
    tags: ['autodocs'],
  });
</script>

<Story name="Full Playable Demo" />

<div style="margin-top: 40px; padding: 20px; background: #111; color: #888; font-size: 13px; border-radius: 8px;">
  <strong>Controls:</strong><br>
  • Click the big Spin button or press <strong>SPACE</strong><br>
  • Press <strong>B</strong> to trigger Buy Bonus flow<br>
  • Press <strong>R</strong> to reset the demo<br>
  <br>
  This demo combines the PremiumSpinButton, animated SpinningReels, win detection, anticipation, Nuke Flash, Big Win banner, and Cage Bonus multiplier in one experience.
</div>

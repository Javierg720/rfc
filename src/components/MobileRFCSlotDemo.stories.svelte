<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MobileRFCSlotDemo from './MobileRFCSlotDemo.svelte';

  const { Story } = defineMeta({
    title: 'RFC UI/Mobile - Phone Experience',
    component: MobileRFCSlotDemo,
    tags: ['autodocs'],
  });
</script>

<Story name="iPhone Portrait (Default)" />

<Story name="iPhone Landscape" args={{ orientation: 'landscape' }} />

<div style="margin-top: 30px; font-size: 12px; color: #666; line-height: 1.5;">
  This demo simulates real mobile portrait play:<br>
  • Fluid reels sized for phone screens<br>
  • Host character docked bottom-right (production behavior)<br>
  • Large 118px thumb-friendly spin button<br>
  • Buy Bonus + Reset controls<br>
  • KO flash + Big Win banner adapted for small screens<br><br>
  <strong>Tip:</strong> In Storybook, use the Viewport addon (top toolbar) to switch between iPhone 12/13/14, Galaxy S22, iPhone SE, etc.<br>
  Landscape mode is also supported via the controls.
</div>

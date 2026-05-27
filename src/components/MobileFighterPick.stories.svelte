<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MobileFighterPick from './MobileFighterPick.svelte';

  const { Story } = defineMeta({
    title: 'RFC UI/Mobile - Fighter Pick',
    component: MobileFighterPick,
    tags: ['autodocs'],
  });
</script>

<Story name="Portrait" args={{ orientation: 'portrait' }} />

<Story name="Landscape" args={{ orientation: 'landscape' }} />

<Story name="With Selection" args={{ selected: 'RAGE', orientation: 'portrait' }} />

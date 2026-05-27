<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BigWinBanner from './BigWinBanner.svelte';

  const { Story } = defineMeta({
    title: 'RFC Effects/Big Win Banner',
    component: BigWinBanner,
    tags: ['autodocs'],
  });
</script>

<Story name="x2840 Win" args={{ amount: 2840, visible: true }} />
<Story name="Massive Jackpot" args={{ amount: 12450, visible: true }} />

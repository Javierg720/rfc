<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import NukeFlash from './NukeFlash.svelte';

  const { Story } = defineMeta({
    title: 'RFC Effects/Nuke Flash (KO Punch)',
    component: NukeFlash,
    tags: ['autodocs'],
  });
</script>

<Story name="Default" args={{ fire: true }} />

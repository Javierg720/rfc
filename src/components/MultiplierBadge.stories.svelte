<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MultiplierBadge from './MultiplierBadge.svelte';

  const { Story } = defineMeta({
    title: 'RFC UI/Multiplier Badge',
    component: MultiplierBadge,
    tags: ['autodocs'],
    argTypes: {
      value: { control: { type: 'range', min: 1, max: 12, step: 1 } },
    },
  });
</script>

<Story name="x3 (Free Spins)" args={{ value: 3 }} />

<Story name="x5 (Strong)" args={{ value: 5, pulsing: true }} />

<Story name="x8 Championship" args={{ value: 8 }} />

<Story name="x10 Maximum" args={{ value: 10, pulsing: true }} />

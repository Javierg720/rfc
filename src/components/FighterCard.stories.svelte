<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FighterCard from './FighterCard.svelte';
  import { fn } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'RFC UI/Fighter Card (Bonus Pick)',
    component: FighterCard,
    tags: ['autodocs'],
    args: {
      onSelect: fn(),
    },
    argTypes: {
      fighter: {
        control: { type: 'select' },
        options: ['CHIEF', 'RAGE', 'MCWHISKEY'],
      },
      multiplier: { control: { type: 'range', min: 2, max: 12, step: 1 } },
    },
  });
</script>

<Story name="Chief X5" args={{ fighter: 'CHIEF', multiplier: 5 }} />
<Story name="Rage X8 Selected" args={{ fighter: 'RAGE', multiplier: 8, selected: true }} />
<Story name="McWhiskey X3" args={{ fighter: 'MCWHISKEY', multiplier: 3 }} />
<Story name="Disabled State" args={{ fighter: 'CHIEF', multiplier: 6, disabled: true }} />

<!-- Simple side-by-side view (no complex render) -->
<Story name="All Three Side by Side" args={{ fighter: 'CHIEF', multiplier: 5 }} render={() => ({
  Component: 'div',
  props: { style: 'display:flex; gap:20px;' },
  children: [
    { Component: FighterCard, props: { fighter: 'CHIEF', multiplier: 5 } },
    { Component: FighterCard, props: { fighter: 'RAGE', multiplier: 8 } },
    { Component: FighterCard, props: { fighter: 'MCWHISKEY', multiplier: 3 } }
  ]
})} />

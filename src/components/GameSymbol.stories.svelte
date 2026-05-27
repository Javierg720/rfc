<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import GameSymbol from './GameSymbol.svelte';

  const { Story } = defineMeta({
    title: 'RFC UI/Game Symbol',
    component: GameSymbol,
    tags: ['autodocs'],
    argTypes: {
      symbol: {
        control: { type: 'select' },
        options: ['10','A','J','K','Q','BELT','CHAMP','CHIEF','MCWHISKEY','RAGE','SCATTER','WILD'],
      },
      size: { control: { type: 'range', min: 80, max: 220, step: 4 } },
    },
  });
</script>

<Story name="Ten" args={{ symbol: '10', size: 168 }} />
<Story name="Ace" args={{ symbol: 'A', size: 168 }} />
<Story name="Jack" args={{ symbol: 'J', size: 168 }} />
<Story name="King" args={{ symbol: 'K', size: 168 }} />
<Story name="Queen" args={{ symbol: 'Q', size: 168 }} />
<Story name="Belt" args={{ symbol: 'BELT', size: 168 }} />
<Story name="Champ" args={{ symbol: 'CHAMP', size: 168 }} />
<Story name="Chief" args={{ symbol: 'CHIEF', size: 168 }} />
<Story name="McWhiskey" args={{ symbol: 'MCWHISKEY', size: 168 }} />
<Story name="Rage" args={{ symbol: 'RAGE', size: 168 }} />
<Story name="Scatter" args={{ symbol: 'SCATTER', size: 168 }} />
<Story name="Wild" args={{ symbol: 'WILD', size: 168 }} />

<Story name="Win State" args={{ symbol: 'CHAMP', size: 168, win: true }} />
<Story name="Dimmed (non-win)" args={{ symbol: 'RAGE', size: 168, dim: true }} />
<Story name="Win + Heartbeat" args={{ symbol: 'WILD', size: 168, win: true, class: 'heartbeat' }} />

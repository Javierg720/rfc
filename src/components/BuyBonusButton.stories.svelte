<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BuyBonusButton from './BuyBonusButton.svelte';
  import { fn } from 'storybook/test';

  const { Story } = defineMeta({
    title: 'RFC UI/Buy Bonus Button',
    component: BuyBonusButton,
    tags: ['autodocs'],
    args: { onclick: fn() }
  });
</script>

<Story name="Default" args={{ price: '35×' }} />
<Story name="Higher Price" args={{ price: '50×', label: 'BUY BONUS' }} />
<Story name="Disabled" args={{ disabled: true }} />

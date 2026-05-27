<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import PremiumSpinButton from './PremiumSpinButton.svelte';
  import { fn } from 'storybook/test';

  const { Story, meta } = defineMeta({
    title: 'RFC UI/Premium Spin Button',
    component: PremiumSpinButton,
    tags: ['autodocs'],
    args: {
      onclick: fn(),
    },
    argTypes: {
      state: {
        control: { type: 'select' },
        options: ['idle', 'active', 'spinning', 'stop', 'disabled'],
      },
      variant: {
        control: { type: 'select' },
        options: ['normal', 'buy-bonus', 'stop'],
      },
      size: { control: { type: 'range', min: 90, max: 180, step: 2 } },
    },
  });
</script>

<!-- Default large premium button as seen in the cage -->
<Story name="Default" args={{ state: 'idle', size: 132 }} />

<Story name="Active Glow (hover ready)" args={{ state: 'active', size: 132 }} />

<Story name="Spinning" args={{ state: 'spinning', size: 132 }} />

<Story name="Stop (during auto-play)" args={{ state: 'stop', variant: 'stop', size: 132 }} />

<Story name="Buy Bonus Variant" args={{ variant: 'buy-bonus', size: 132 }} />

<Story name="Disabled" args={{ state: 'disabled', size: 132 }} />

<!-- Size variations -->
<Story name="Compact (Mobile)" args={{ state: 'idle', size: 96 }} />
<Story name="Mobile Optimized (Thumb)" args={{ state: 'idle', mobile: true }} />
<Story name="Mobile Spinning" args={{ state: 'spinning', mobile: true }} />

<Story name="Hero Size" args={{ state: 'idle', size: 160 }} />

<!-- Interactive playground -->
<Story
  name="Interactive Playground"
  args={{ state: 'idle', size: 132 }}
  render={(args) => {
    let currentState = $state(args.state);

    function handleClick() {
      if (currentState === 'idle' || currentState === 'active') {
        currentState = 'spinning';
        setTimeout(() => {
          currentState = 'idle';
        }, 1600);
      } else if (currentState === 'spinning') {
        currentState = 'stop';
        setTimeout(() => {
          currentState = 'idle';
        }, 900);
      }
    }

    return {
      Component: PremiumSpinButton,
      props: {
        ...args,
        state: currentState,
        onclick: handleClick
      }
    };
  }}
/>

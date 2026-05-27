<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import HostCharacter from './HostCharacter.svelte';

  const { Story } = defineMeta({
    title: 'RFC UI/Host Character (Announcer)',
    component: HostCharacter,
    tags: ['autodocs'],
  });
</script>

<Story name="Idle" args={{ reaction: 'idle', size: 380 }} />
<Story name="Small Win" args={{ reaction: 'small-win', size: 380 }} />
<Story name="Big Win Reaction" args={{ reaction: 'big-win', size: 380 }} />
<Story name="Biggest Win" args={{ reaction: 'biggest-win', size: 380 }} />
<Story name="KO'd" args={{ reaction: 'ko', size: 380 }} />

<Story name="Mobile (Docked)" args={{ reaction: 'idle', mobile: true, size: 158 }} />
<Story name="Mobile Big Win" args={{ reaction: 'biggest-win', mobile: true, size: 158 }} />

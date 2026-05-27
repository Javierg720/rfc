<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ReelGrid from './ReelGrid.svelte';

  const { Story } = defineMeta({
    title: 'RFC UI/Reel Grid',
    component: ReelGrid,
    tags: ['autodocs'],
  });
</script>

<script>
  const defaultReels = [
    ['WILD', 'CHIEF', '10'],
    ['RAGE', 'SCATTER', 'K'],
    ['BELT', 'MCWHISKEY', 'A'],
    ['CHAMP', 'Q', 'J'],
    ['RAGE', 'CHIEF', 'WILD']
  ];

  const bigWinReels = [
    ['CHAMP', 'CHAMP', 'CHAMP'],
    ['RAGE', 'RAGE', 'RAGE'],
    ['BELT', 'BELT', 'BELT'],
    ['WILD', 'WILD', 'WILD'],
    ['MCWHISKEY', 'MCWHISKEY', 'MCWHISKEY']
  ];
</script>

<Story name="Default Grid" args={{ reels: defaultReels, cellSize: 152, gap: 10 }} />

<Story name="Wins Highlighted" args={{
  reels: defaultReels,
  winningPositions: [{ reel: 0, row: 0 }, { reel: 4, row: 2 }],
  cellSize: 152
}} />

<Story name="Dimmed Non Winners Celebration" args={{
  reels: defaultReels,
  winningPositions: [{ reel: 2, row: 0 }, { reel: 2, row: 1 }, { reel: 2, row: 2 }],
  dimNonWinners: true,
  heartbeat: true,
  cellSize: 152
}} />

<Story name="Maximum Win Screen" args={{
  reels: bigWinReels,
  winningPositions: Array.from({ length: 15 }, (_, i) => ({ reel: Math.floor(i / 3), row: i % 3 })),
  heartbeat: true,
  cellSize: 152
}} />

<Story name="Compact Mobile Size" args={{ reels: defaultReels, cellSize: 108, gap: 6 }} />

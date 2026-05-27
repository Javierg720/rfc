import type { Preview } from '@storybook/svelte-vite';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      test: 'todo'
    },

    // Strong viewport set focused on real device testing for the actual RFC game
    viewport: {
      viewports: {
        // Phones
        iphone14: { name: 'iPhone 14 / 15', styles: { width: '390px', height: '844px' }, type: 'mobile' },
        iphone14pro: { name: 'iPhone 14/15 Pro', styles: { width: '393px', height: '852px' }, type: 'mobile' },
        galaxyS23: { name: 'Galaxy S23 / S24', styles: { width: '360px', height: '780px' }, type: 'mobile' },
        iphoneSE: { name: 'iPhone SE (small phone)', styles: { width: '375px', height: '667px' }, type: 'mobile' },
        pixel7: { name: 'Pixel 7 / 8', styles: { width: '412px', height: '915px' }, type: 'mobile' },
        // Tablets
        ipad: { name: 'iPad Pro 11"', styles: { width: '834px', height: '1194px' }, type: 'tablet' },
        ipadLandscape: { name: 'iPad Pro 11" Landscape', styles: { width: '1194px', height: '834px' }, type: 'tablet' },
        // Desktop reference
        desktop: { name: 'Desktop 1440px', styles: { width: '1440px', height: '900px' }, type: 'desktop' },
        desktopWide: { name: 'Desktop Wide (1920)', styles: { width: '1920px', height: '1080px' }, type: 'desktop' },
      },
      defaultViewport: 'iphone14',
    },

    // Allow iframes to load the real game without restrictions in this context
    backgrounds: {
      default: 'Dark',
      values: [
        { name: 'Dark', value: '#0a0505' },
        { name: 'Black', value: '#000000' },
        { name: 'Light', value: '#f5f5f5' },
      ],
    },
  },
};

export default preview;
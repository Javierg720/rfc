<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DevicePreview from './DevicePreview.svelte';

  const { Story } = defineMeta({
    title: 'RFC Design Review / Device Previews',
    component: DevicePreview,
    tags: ['autodocs'],
  });
</script>

<Story 
  name="iPhone 14-15 Pro Portrait" 
  args={{ device: 'iphone', orientation: 'portrait', scale: 0.72 }} 
/>

<Story 
  name="iPhone 14-15 Pro Landscape" 
  args={{ device: 'iphone', orientation: 'landscape', scale: 0.58 }} 
/>

<Story 
  name="Galaxy S23 Portrait" 
  args={{ device: 'galaxy', orientation: 'portrait', scale: 0.78 }} 
/>

<Story 
  name="Galaxy S23 Landscape" 
  args={{ device: 'galaxy', orientation: 'landscape', scale: 0.62 }} 
/>

<Story 
  name="iPad Pro 11 Portrait" 
  args={{ device: 'ipad', orientation: 'portrait', scale: 0.42 }} 
/>

<Story 
  name="iPad Pro 11 Landscape" 
  args={{ device: 'ipad', orientation: 'landscape', scale: 0.42 }} 
/>

<Story 
  name="Desktop 1440x900" 
  args={{ device: 'desktop', scale: 0.55 }} 
/>

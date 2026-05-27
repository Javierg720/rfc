<script lang="ts">
  import { currentLayoutProfile, switchLayoutProfile } from './layoutStore';
  import type { DeviceProfile } from './LayoutManager';

  const profiles: DeviceProfile[] = ['desktop', 'ipad', 'iphone'];

  function select(profile: DeviceProfile) {
    switchLayoutProfile(profile);
  }
</script>

<div class="profile-switcher">
  <span class="label">Layout Profile:</span>
  
  {#each profiles as profile}
    <button
      class:active={$currentLayoutProfile === profile}
      on:click={() => select(profile)}
    >
      {profile.toUpperCase()}
    </button>
  {/each}
</div>

<style>
  .profile-switcher {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    font-family: 'Barlow Condensed', system-ui, sans-serif;
    font-size: 13px;
    color: #ccc;
    width: fit-content;
  }

  .label {
    font-weight: 600;
    margin-right: 4px;
    color: #888;
  }

  button {
    background: #222;
    border: 1px solid #444;
    color: #ddd;
    padding: 6px 14px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 700;
    letter-spacing: 0.5px;
    transition: all 0.1s ease;
  }

  button:hover {
    background: #2a2a2a;
    border-color: #666;
  }

  button.active {
    background: #cc1a2e;
    border-color: #ff3a52;
    color: white;
    box-shadow: 0 0 0 2px rgba(204, 26, 46, 0.3);
  }
</style>

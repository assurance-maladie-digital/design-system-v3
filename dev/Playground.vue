<script lang="ts" setup>
import ThemeSwitcher from './ThemeSwitcher.vue'
import {CopyBtn} from "@/components";
</script>

<template>
  <div>
    <ThemeSwitcher class="theme-switcher-position"/>

    <VSheet
        color="primary"
        class="pa-4"
    >
      start developing here
    </VSheet>
    <div class="pa-9">

      <CopyBtn
        text-to-copy="1970756541"
    />
      <a href="">A link here</a>
    </div>
  </div>
</template>

<style scoped>
/* Position the theme switcher as needed */
.theme-switcher-position {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 100;
}
</style>

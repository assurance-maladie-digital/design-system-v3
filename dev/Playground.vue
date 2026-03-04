<script lang="ts" setup>
import ThemeSwitcher from './ThemeSwitcher.vue'
import DownloadBtn from '@/components/DownloadBtn/DownloadBtn.vue'
import axios from 'axios'

const download = () => {
  return axios.get('https://run.mocky.io/v3/884c25f5-6dc2-4c01-b8d9-26c54042f94f')
}
</script>

<template>
  <div>
    <ThemeSwitcher class="theme-switcher-position"/>

    <VSheet
        class="pa-4"
    >
      <DownloadBtn
          :file-promise="download"
          @error="console.log('error')"
          @success="console.log('success')"
      >
        Télécharger
      </DownloadBtn>
    </VSheet>
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

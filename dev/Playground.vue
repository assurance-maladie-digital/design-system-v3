<script lang="ts" setup>
import ThemeSwitcher from './ThemeSwitcher.vue'
import AmeliproCopyBtn from '../src/components/Amelipro/AmeliproCopyBtn/AmeliproCopyBtn.vue'
import CopyBtn from '../src/components/CopyBtn/CopyBtn.vue'

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
  </div>
  <div class="ma-40 d-flex">

    <CopyBtn
        label="Copier le numéro de patient"
        text-to-copy="1970756541"
    />
    <!--    <AmeliproCopyBtn-->
    <!--        text-to-copy="texte à copier"-->
    <!--        unique-id="my-btn-id"-->
    <!--    >-->
    <!--      Copier-->
    <!--    </AmeliproCopyBtn>-->
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

<script setup lang="ts">
import BackToTopBtn from '@/components/BackToTopBtn/BackToTopBtn.vue'
import { VCard, VSheet } from 'vuetify/components'

const vuetifyOptions = {
  btn: {
    variant: 'flat',
    color: 'primary',
    rounded: false
  },
  icon: {
    color: 'white'
  }
}
</script>

<template>
  <VCard
      id="target"
      width="100%"
      max-height="200px"
      class="overflow-y-auto"
      style="scroll-behavior: smooth"
  >
    <VSheet
        height="600px"
        class="d-flex flex-column align-center"
    >
      <p class="pa-2">
        Haut de la section.
      </p>
    </VSheet>
    <BackToTopBtn target="target" :vuetify-options="vuetifyOptions">
      Retour en haut de la page
    </BackToTopBtn>
  </VCard>
</template>
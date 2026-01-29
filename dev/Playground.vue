<script lang="ts" setup>
import ThemeSwitcher from './ThemeSwitcher.vue'
import {CopyBtn, SyCheckbox, SySelect, SyTextArea, SyTextField} from "@/components";
import {ref} from "vue";

const items = [
  {text: 'Option 1', value: '1'},
  {text: 'Option 2', value: '2'},
  {text: 'Option 3', value: '3'},
]

const checked1 = ref(true)
const checked2 = ref(true)
const checked3 = ref(true)
const checked4 = ref(true)
const checked5 = ref(true)

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
    <div class="pa-9 d-flex ga-9 flex-column">

      <CopyBtn
        text-to-copy="1970756541"
    />

      <SySelect required :items></SySelect>
      <SyTextField required></SyTextField>
      <SyTextArea label="label"></SyTextArea>
      <SyTextArea disabled="" label="label"></SyTextArea>

      <div>
        <SyCheckbox v-model="checked1" label="Couleur primaire (par défaut)"/>
        <SyCheckbox v-model="checked2" label="Couleur Secondaire" color="secondary"/>
        <SyCheckbox v-model="checked3" label="Couleur succès" color="success"/>
        <SyCheckbox v-model="checked4" label="Couleur erreur" color="error"/>
        <SyCheckbox v-model="checked5" label="Couleur avertissement" color="warning"/>
      </div>
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

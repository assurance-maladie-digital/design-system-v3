<script setup lang="ts">
import { ref } from 'vue'
import NirField from '@/components/NirField/NirField.vue'

const value = ref('')
const nirField = ref()

const onSubmit = async () => {
  const isValid = await nirField.value?.validateOnSubmit()

  if (isValid) {
    alert('Formulaire soumis avec succès !')
  }
  else {
    alert('Formulaire non soumis !')
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
  <NirField
      v-model="value"
      label="NirField"
      required
      showSuccessMessages
      :displayKey="false"
      ref="nirField"
  />
  <v-btn
      type="submit"
      color="primary"
      class="mt-4"
  >
    Valider
  </v-btn>
</form>
</template>
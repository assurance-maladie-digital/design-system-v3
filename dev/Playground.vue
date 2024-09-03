<template>
  <div class="d-flex flex-wrap align-center justify-center">
    <Alert v-model="showAlert" type="warning" variant="tonal" :closable="true">
      <template #default>This is a warning alert</template>
    </Alert>

    <VBtn v-if="!showAlert" color="primary" @click="showAlert = true" class="ma-6">Réinitialiser</VBtn>
  </div>
</template>

<script setup lang="ts">
import Alert from '@/components/Alert/Alert.vue'
import { ref } from 'vue'

const showAlert = ref(true);
</script>
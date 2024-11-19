<script setup lang="ts">
import CustomTextField from '@/components/Customs/CustomTextField/CustomTextField.vue'
import { ref } from 'vue'
const model = ref('')
const model2 = ref('')
</script>

<template>
  <main class="py-4">
    <div>
      <h1> Without Slot</h1>
      <h2 class="mx-10">
        Text saisie:	{{ model }}
      </h2>
      <CustomTextField
          v-model="model"
          prepend-icon="success"
          append-icon="close"
          prepend-inner-icon="info"
          show-divider
          append-inner-icon="success"
          color="warning"
          is-clearable
          title="champs de prenom"
          aria-label="champs de nom"
          label="Label"
      />
    </div>
    <div>
      <h3> With Slot</h3>
      <h4 class="mx-10">
        Text saisie:	{{ model2 }}
      </h4>
      <CustomTextField
          v-model="model2"
          variant-style="outlined"
          is-clearable
          show-divider
          title="champs de nom"
          aria-label="champs de nom"
      >
        <template #prepend-inner>
          ☀️
        </template>
      </CustomTextField>
    </div>
  </main>
</template>
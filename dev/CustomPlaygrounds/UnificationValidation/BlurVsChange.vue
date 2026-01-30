<script setup lang="ts">
import { ref } from 'vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

const liveValue = ref('')
const blurValue = ref('')
</script>

<template>
  <div class="playground pa-6">
    <h2>Validation sur blur vs change</h2>
    <p class="hint">Le champ de gauche valide à chaque frappe (isValidateOnBlur=false), celui de droite seulement au blur (défaut).</p>

    <div class="row">
      <div class="col">
        <h3>Validation à chaque saisie</h3>
        <SyTextField
          v-model="liveValue"
          label="Live validation"
          :is-validate-on-blur="false"
          required
          :custom-rules="[
            { type: 'minLength', options: { length: 4, message: 'Min 4 caractères' } }
          ]"
        />
      </div>

      <div class="col">
        <h3>Validation au blur (par défaut)</h3>
        <SyTextField
          v-model="blurValue"
          label="Blur validation"
          required
          :custom-rules="[
            { type: 'minLength', options: { length: 4, message: 'Min 4 caractères' } }
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.playground {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.col {
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.hint {
  color: #666;
  margin-bottom: 8px;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'


const vFormRef = ref<InstanceType<typeof import('vuetify/components').VForm> | null>(null)
const first = ref('')
const second = ref('')
const status = ref('')

const vuetifyRules = [
  (v: string) => !!v || 'Requis (Vuetify)',
  (v: string) => (v?.length ?? 0) >= 4 || 'Min 4 caractères (Vuetify)'
]

const submit = async () => {
  if (!vFormRef.value) return
  const result = await vFormRef.value.validate()
  const valid = typeof result === 'object' && result !== null ? result.valid : Boolean(result)
  status.value = valid ? '✅ VForm valide' : '❌ VForm invalide'
}

const reset = () => {
  vFormRef.value?.reset()
  vFormRef.value?.resetValidation()
  status.value = ''
}
</script>

<template>
  <div class="playground pa-6">
    <h2>VForm (Vuetify natif)</h2>
    <p class="hint">Validation 100% Vuetify (rules + validate()) sans contrôleur DS.</p>

    <VForm ref="vFormRef" @submit.prevent="submit" @reset.prevent="reset">
      <div class="field">
        <SyTextField
          v-model="first"
          label="Champ 1"
          :rules="vuetifyRules"
          use-vuetify-validation
          validate-on="blur lazy"
        />
      </div>

      <div class="field">
        <SyTextField
          v-model="second"
          label="Champ 2"
          :rules="vuetifyRules"
          use-vuetify-validation
          validate-on="submit"
        />
      </div>

      <div class="actions">
        <VBtn type="submit" color="primary" class="mr-2">Soumettre</VBtn>
        <VBtn type="reset" variant="text">Reset</VBtn>
      </div>

      <div v-if="status" class="status mt-3">{{ status }}</div>
    </VForm>
  </div>
</template>

<style scoped>
.playground {
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  margin-bottom: 16px;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.status {
  padding: 8px 12px;
  border-radius: 6px;
  background: #f4f6fb;
  border: 1px solid #dfe4ee;
}

.hint {
  color: #555;
  margin-bottom: 4px;
}
</style>

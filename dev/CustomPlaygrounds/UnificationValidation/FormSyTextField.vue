<script setup lang="ts">
import { ref } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

const formRef = ref<InstanceType<typeof SyForm> | null>(null)

const value = ref('')
const valueWithExternalError = ref('')
const externalError = ref<string[] | null>(null)

const submit = async () => {
  if (!formRef.value) return
  const ok = await formRef.value.validate()
  alert(ok ? '✅ Form valide' : '❌ Form invalide')
}

const setExternalError = () => {
  externalError.value = ['Erreur externe imposée']
}
const clearExternalError = () => {
  externalError.value = [] // vide = efface les internes
}
const backToInternal = () => {
  externalError.value = null
}
</script>

<template>
  <div class="playground pa-6">
    <h2>SyTextField dans SyForm</h2>
    <p class="hint">Test du contrôleur DS dans un SyForm : required, custom rule, messages externes, succès.</p>

    <div class="actions mb-4">
      <button class="btn" @click="setExternalError">Imposer erreur externe</button>
      <button class="btn" @click="clearExternalError">Effacer via messages externes vides</button>
      <button class="btn" @click="backToInternal">Revenir aux messages internes</button>
    </div>

    <SyForm ref="formRef" @submit="submit">
      <div class="field">
        <SyTextField
          v-model="value"
          label="Champ requis + minLength"
          required
          :custom-rules="[
            { type: 'minLength', options: { length: 4, message: 'Min 4 caractères', successMessage: 'OK (DS)' } }
          ]"
          show-success-messages
        />
      </div>

      <div class="field">
        <SyTextField
          v-model="valueWithExternalError"
          label="Messages externes"
          required
          :error-messages="externalError"
          :custom-rules="[
            { type: 'minLength', options: { length: 4, message: 'Min 4 caractères' } }
          ]"
        />
      </div>

      <div class="actions">
        <button class="btn primary" type="submit">Soumettre</button>
      </div>
    </SyForm>
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
  flex-wrap: wrap;
  gap: 8px;
}

.btn {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f6f6f6;
  cursor: pointer;
}

.btn.primary {
  background: #1976d2;
  border-color: #1976d2;
  color: #fff;
}

.hint {
  color: #555;
  margin-bottom: 4px;
}
</style>

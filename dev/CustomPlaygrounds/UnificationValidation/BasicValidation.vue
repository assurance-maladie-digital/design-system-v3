<script setup lang="ts">
import { ref, computed } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

const formRef = ref<InstanceType<typeof SyForm> | null>(null)

// Champs de base
const email = ref('')
const phone = ref('')
const optional = ref('')

// Messages externes simulés
const externalErrors = ref<string[] | null>(null)

// Règle custom : email simple
const emailRules = computed(() => [
  {
    type: 'matchPattern',
    options: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Email invalide',
      successMessage: 'Email valide'
    }
  }
])

// Règle warning : longueur mini
const phoneWarningRules = computed(() => [
  {
    type: 'minLength',
    options: {
      length: 10,
      message: 'Moins de 10 caractères (warning)'
    }
  }
])

// Démo disableErrorHandling
const disableErrors = ref(false)

const submit = async () => {
  if (!formRef.value) return
  const ok = await formRef.value.validate()
  alert(ok ? '✅ Form valide' : '❌ Form invalide')
}
</script>

<template>
  <div class="playground pa-6">
    <h2>Validation unifiée - Cas de base</h2>

    <div class="toggles mb-4">
      <label class="mr-4">
        <input type="checkbox" v-model="disableErrors" />
        disableErrorHandling (sur les champs ci-dessous)
      </label>
      <button class="btn" @click="externalErrors = ['Erreur externe imposée']">Imposer erreur externe</button>
      <button class="btn" @click="externalErrors = []">Effacer via messages externes vides</button>
      <button class="btn" @click="externalErrors = null">Revenir aux messages internes</button>
    </div>

    <SyForm ref="formRef" @submit="submit">
      <div class="field">
        <SyTextField
          v-model="email"
          label="Email (custom rule + succès)"
          :custom-rules="emailRules"
          :disable-error-handling="disableErrors"
          required
        />
      </div>

      <div class="field">
        <SyTextField
          v-model="phone"
          label="Téléphone (warning rule)"
          :custom-warning-rules="phoneWarningRules"
          :disable-error-handling="disableErrors"
          required
        />
      </div>

      <div class="field">
        <SyTextField
          v-model="optional"
          label="Optionnel (nettoyage si vide)"
          :disable-error-handling="disableErrors"
          :error-messages="externalErrors"
          placeholder="Laisser vide pour voir le clear"
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

.btn {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #f6f6f6;
  cursor: pointer;
  margin-right: 8px;
}

.btn.primary {
  background: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

.toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>

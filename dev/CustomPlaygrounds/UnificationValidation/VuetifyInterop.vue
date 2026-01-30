<script setup lang="ts">
import { ref } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'

const formRef = ref<InstanceType<typeof SyForm> | null>(null)

// Valeurs
const dsValue = ref('')
const vuetifyValue = ref('')
const mixedDs = ref('')
const mixedVuetify = ref('')

// Règles Vuetify (fonctions booleans/string)
const vuetifyRules = [
  (v: string) => !!v || 'Champ requis (Vuetify)',
  (v: string) => (v?.length ?? 0) >= 4 || 'Min 4 caractères (Vuetify)'
]

// Règles DS custom
const dsRules = [
  {
    type: 'minLength',
    options: {
      length: 4,
      message: 'Min 4 caractères (DS)',
      successMessage: 'OK (DS)'
    }
  }
]

const submit = async () => {
  if (!formRef.value) return
  const ok = await formRef.value.validate()
  alert(ok ? '✅ Form valide (voir aussi les champs Vuetify)' : '❌ Form invalide')
}
</script>

<template>
  <div class="playground pa-6">
    <h2>Interop DS / Vuetify</h2>
    <p class="hint">Montre la cohabitation : un champ en mode DS (custom rules) et un champ en mode Vuetify natif (rules + validate-on)</p>

    <SyForm ref="formRef" @submit="submit">
      <div class="grid">
        <div class="card">
          <h3>Mode DS (custom rules)</h3>
          <SyTextField
            v-model="dsValue"
            label="DS validation"
            required
            :custom-rules="dsRules"
            show-success-messages
          />
        </div>

        <div class="card">
          <h3>Mode Vuetify natif</h3>
          <SyTextField
            v-model="vuetifyValue"
            label="Vuetify validation"
            use-vuetify-validation
            :rules="vuetifyRules"
            validate-on="blur lazy"
            placeholder="Règles Vuetify (ignore custom rules)"
          />
          <p class="note">Les règles custom seraient ignorées en mode Vuetify (warning console si fournies).</p>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h3>Cohabitation dans un même formulaire</h3>
          <p class="note">Le SyForm validera le champ DS via le contrôleur; le champ Vuetify se valide seul via ses rules.</p>
          <SyTextField
            v-model="mixedDs"
            label="Champ DS (form submit)"
            required
            :custom-rules="dsRules"
          />
          <SyTextField
            v-model="mixedVuetify"
            label="Champ Vuetify (form submit)"
            use-vuetify-validation
            :rules="vuetifyRules"
            validate-on="submit"
            placeholder="Valide via Vuetify au submit"
          />
        </div>
      </div>

      <div class="actions">
        <button class="btn primary" type="submit">Soumettre le formulaire</button>
      </div>
    </SyForm>
  </div>
</template>

<style scoped>
.playground {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.card {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.note {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.hint {
  color: #555;
  margin-bottom: 4px;
}

.actions {
  margin-top: 12px;
}

.btn {
  padding: 10px 14px;
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
</style>

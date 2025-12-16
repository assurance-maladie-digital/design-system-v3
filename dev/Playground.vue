<script setup lang="ts">
import { ref } from 'vue'

import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import PasswordField from '@/components/PasswordField/PasswordField.vue'

type SelectItem = { text: string; value: string }

const selectItems: SelectItem[] = [
  { text: 'Adrien', value: 'Adrien' },
  { text: 'Axel', value: 'Axel' },
  { text: 'Baptiste', value: 'Baptiste' },
  { text: 'Clement', value: 'Clement' },
  { text: 'Corentin', value: 'Corentin' },
  { text: 'Damien', value: 'Damien' },
  { text: 'David', value: 'David' },
  { text: 'Eloi', value: 'Eloi' },
  { text: 'Louis', value: 'Louis' },
  { text: 'Valentin', value: 'Valentin' },
]

const password = ref('tr')

const dsFormRef = ref<InstanceType<typeof SyForm> | null>(null)
const dsFormValid = ref<boolean | null>(null)

const dsEmail = ref('')
const dsSelect = ref<string | null>(null)

const dsEmailRules = [
  { type: 'required', options: { message: "L'email est obligatoire" } },
  { type: 'email', options: { message: "L'email n'est pas valide" } },
]

const validateDsForm = async () => {
  if (!dsFormRef.value) return
  dsFormValid.value = await dsFormRef.value.validate()
}

const vuetifyFormRef = ref<any | null>(null)
const vuetifyFormValid = ref<boolean | null>(null)

const vuetifyEmail = ref('')
const vuetifySelect = ref<string | null>(null)

const vuetifyEmailRules = [
  (v: string) => !!v || "L'email est obligatoire",
  (v: string) => /.+@.+\..+/.test(v) || "L'email n'est pas valide",
]

const vuetifySelectRules = [
  (v: string) => !!v || 'Il faut sélectionner quelque chose',
  (v: string) => v.length >= 5 || 'Minimum 5 caractères',
]

const passwordRules = [
  (v: string) => !!v || 'Le mot de passe est obligatoire',
  (v: string) => v.length >= 8 || 'Minimum 8 caractères',
]

const validateVuetifyForm = async () => {
  if (!vuetifyFormRef.value) return
  const result = await vuetifyFormRef.value.validate()
  vuetifyFormValid.value = typeof result === 'boolean' ? result : result.valid
}

const customPasswordRules = [
  {
    type: 'custom',
    options: {
      fieldIdentifier: 'password',
      validate: (value: string) =>
        value && value.length >= 8
          ? true
          : 'Le mot de passe doit contenir au moins 8 caractères',
    },
  },
]

const customPasswordWarningRules = [
  {
    type: 'custom',
    options: {
      fieldIdentifier: 'password',
      validate: (value: string) =>
        /[!@#$%^&*(),.?":{}|<>]/.test(value)
          ? true
          : 'Ajoutez des caractères spéciaux pour plus de sécurité',
    },
  },
]

const customPasswordSuccessRules = [
  {
    type: 'custom',
    options: {
      fieldIdentifier: 'password',
      validate: (value: string) =>
        value &&
        value.length >= 12 &&
        /[A-Z]/.test(value) &&
        /[0-9]/.test(value) &&
        /[!@#$%^&*(),.?":{}|<>]/.test(value)
          ? 'Mot de passe très sécurisé !'
          : true,
    },
  },
]
</script>



<template>
  <div class="playground-container">
    <h1>Validation Playground</h1>
    <div class="demo-section">
      <h2>1. SyForm + validation Design System</h2>

      <SyForm ref="dsFormRef" class="playground-form">
        <div class="form-row">
          <PasswordField
            v-model="password"
            label="Mot de passe"
            required
            :custom-rules="customPasswordRules"
            :custom-warning-rules="customPasswordWarningRules"
            :custom-success-rules="customPasswordSuccessRules"
            show-success-messages
            display-asterisk
            is-validate-on-blur
          />

          <SyTextField
            v-model="dsEmail"
            label="Email (DS)"
            required
            :custom-rules="dsEmailRules"
            help-text="Validation gérée par SyForm"
          />

          <SySelect
            v-model="dsSelect"
            :items="selectItems"
            label="Option"
            required
            display-asterisk
          />
        </div>

        <div class="form-actions">
          <VBtn color="primary" @click="validateDsForm">
            Valider (DS)
          </VBtn>
        </div>
      </SyForm>

      <div class="value-display">
        <p><strong>Email :</strong> {{ dsEmail || '—' }}</p>
        <p><strong>Résultat :</strong>
          <span v-if="dsFormValid === null">(non évalué)</span>
          <span v-else>{{ dsFormValid ? 'valide' : 'invalide' }}</span>
        </p>
      </div>
    </div>
    <div class="demo-section">
      <h2>2. Vuetify natif + custom-rules DS</h2>
      <VForm ref="vuetifyFormRef" class="playground-form">
        <div class="form-row">
          <SyTextField
            v-model="vuetifyEmail"
            label="Email (Vuetify)"
            use-vuetify-validation
            :custom-rules="dsEmailRules"
            type="email"
            variant="outlined"
          />

          <PasswordField
            v-model="password"
            label="Mot de passe"
            :custom-rules="customPasswordRules"
            :custom-warning-rules="customPasswordWarningRules"
            :custom-success-rules="customPasswordSuccessRules"
            show-success-messages
            display-asterisk
            is-validate-on-blur
          />

          <SySelect
            v-model="vuetifySelect"
            :items="selectItems"
            required
          />
        </div>

        <div class="form-actions">
          <VBtn color="primary" @click="validateVuetifyForm">
            Valider (Vuetify)
          </VBtn>
        </div>
      </VForm>
    </div>
    <div class="demo-section">
      <h2>3. Vuetify natif + rules Vuetify</h2>

      <VForm ref="vuetifyFormRef" class="playground-form">
        <div class="form-row">
          <SyTextField
            v-model="vuetifyEmail"
            label="Email"
            use-vuetify-validation
            :rules="vuetifyEmailRules"
            variant="outlined"
          />

          <PasswordField
            v-model="password"
            use-vuetify-validation
            :rules="passwordRules"
            label="Mot de passe"
          />

          <SySelect
            v-model="vuetifySelect"
            :items="selectItems"
            label="Select"
            use-vuetify-validation
            :rules="vuetifySelectRules"
          />
        </div>

        <div class="form-actions">
          <VBtn color="primary" @click="validateVuetifyForm">
            Valider (Vuetify)
          </VBtn>
        </div>
      </VForm>
    </div>
  </div>
</template>


<style scoped lang="scss">
.playground-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Roboto, sans-serif;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.demo-section {
  margin-bottom: 32px;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 2px 4px rgb(0 0 0 / 10%);
}

.playground-form {
  margin-top: 12px;
}

.form-row {
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  gap: 8px;
}

.value-display {
  margin-top: 16px;
  padding: 12px;
  background-color: #e9ecef;
  border-radius: 4px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
<script lang="ts" setup>
import { ref } from 'vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

// Champs pour le formulaire en mode Design System (DS)
const dsEmail = ref('')
const dsFormRef = ref<InstanceType<typeof SyForm> | null>(null)
const dsFormValid = ref<boolean | null>(null)

const dsEmailRules = [
  { type: 'email', options: { message: "L'email n'est pas valide" } },
  { type: 'required', options: { message: "L'email est obligatoire" } },
]

const validateDsForm = async () => {
  if (!dsFormRef.value) return
  const isValid = await dsFormRef.value.validate()
  dsFormValid.value = isValid
}

// Champs pour le formulaire en mode Vuetify natif
const vuetifyEmail = ref('')
const vuetifyFormRef = ref<any | null>(null)
const vuetifyFormValid = ref<boolean | null>(null)

// Règles Vuetify classiques: (value) => true | string
const vuetifyEmailRules = [
  (v: string) => !!v || "L'email est obligatoire",
  (v: string) => /.+@.+\..+/.test(v) || "L'email n'est pas valide",
]

const validateVuetifyForm = async () => {
  if (!vuetifyFormRef.value) return
  const result = await vuetifyFormRef.value.validate()
  vuetifyFormValid.value =
    typeof result === 'boolean' ? result : result.valid
}
</script>

<template>
  <div class="playground-container">
    <h1>SyTextField Validation Playground</h1>

    <div class="demo-section">
      <h2>1. SyForm + validation Design System</h2>
      <p>
        Ce formulaire utilise le système de validation du Design System (règles custom + SyForm).
      </p>

      <SyForm
        ref="dsFormRef"
        class="playground-form"
      >
        <div class="form-row">
          <SyTextField
            v-model="dsEmail"
            label="Email (mode DS)"
            :custom-rules="dsEmailRules"
            required
            help-text="Validation gérée par useValidation + SyForm"
          />
        </div>

        <div class="form-actions">
          <VBtn
            color="primary"
            @click="validateDsForm"
          >
            Valider (SyForm)
          </VBtn>
        </div>
      </SyForm>

      <div class="value-display">
        <p><strong>Valeur email (DS) :</strong> {{ dsEmail || 'Non définie' }}</p>
        <p><strong>Résultat SyForm.validate() :</strong>
          <span v-if="dsFormValid === null">(non évalué)</span>
          <span v-else>{{ dsFormValid ? 'valide' : 'invalide' }}</span>
        </p>
      </div>
    </div>

    <div class="demo-section">
      <h2>2. Formulaire Vuetify natif + custom-rules</h2>
      <p>
        Ce formulaire utilise la validation de Vuetify mais avec les custom donc pas d'erreurs (pas gere) :
      </p>

      <VForm
        ref="vuetifyFormRef"
        class="playground-form"
      >
        <div class="form-row">
			<SyTextField
			v-model="vuetifyEmail"
			label="Email (mode Vuetify)"
			use-vuetify-validation
			:custom-rules="dsEmailRules"
			type="email"
			variant="outlined"
			hint="Validation gérée uniquement par Vuetify (rules)"
			persistent-hint
			/>
        </div>

        <div class="form-actions">
          <VBtn
            color="primary"
            @click="validateVuetifyForm"
          >
            Valider (Vuetify)
          </VBtn>
        </div>
      </VForm>

      <div class="value-display">
        <p><strong>Valeur email (Vuetify) :</strong> {{ vuetifyEmail || 'Non définie' }}</p>
        <p><strong>Résultat VForm.validate() (Vuetify rules) :</strong>
          <span v-if="vuetifyFormValid === null">(non évalué)</span>
          <span v-else>{{ vuetifyFormValid ? 'valide' : 'invalide' }}</span>
        </p>
      </div>
    </div>
	    <div class="demo-section">
      <h2>2. Formulaire Vuetify natif + vuetifyRules</h2>
      <p>
        Ce formulaire utilise uniquement les composants Vuetify mais avec les vuetifyRules doncgestion habituelle de vuetify :
      </p>

      <VForm
        ref="vuetifyFormRef"
        class="playground-form"
      >
        <div class="form-row">
			<SyTextField
			v-model="vuetifyEmail"
			label="Email (mode Vuetify)"
			use-vuetify-validation
			:rules="vuetifyEmailRules"
			type="email"
			variant="outlined"
			hint="Validation gérée uniquement par Vuetify (rules)"
			persistent-hint
			/>
        </div>

        <div class="form-actions">
          <VBtn
            color="primary"
            @click="validateVuetifyForm"
          >
            Valider (Vuetify)
          </VBtn>
        </div>
      </VForm>

      <div class="value-display">
        <p><strong>Valeur email (Vuetify) :</strong> {{ vuetifyEmail || 'Non définie' }}</p>
        <p><strong>Résultat VForm.validate() (Vuetify rules) :</strong>
          <span v-if="vuetifyFormValid === null">(non évalué)</span>
          <span v-else>{{ vuetifyFormValid ? 'valide' : 'invalide' }}</span>
        </p>
      </div>
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
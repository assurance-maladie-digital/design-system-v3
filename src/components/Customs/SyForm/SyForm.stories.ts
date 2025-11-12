import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, computed } from 'vue'
import SyForm from './SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import { VBtn } from 'vuetify/components'

export default {
	title: 'Composants/Formulaires/SyForm',
	component: SyForm,
	argTypes: {
		validateOnSubmit: {
			control: 'boolean',
			description: 'Active ou désactive la validation automatique lors de la soumission',
			defaultValue: true,
		},
	},
	parameters: {
		docs: {
			description: {
				component: 'SyForm est un composant de formulaire qui prend en charge à la fois les composants personnalisés et les composants natifs Vuetify.',
			},
		},
	},
} satisfies Meta<typeof SyForm>

type Story = StoryObj<typeof SyForm>

export const Basic: Story = {
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')
			const form = ref<{ validate: () => Promise<boolean> } | null>(null)

			// Règles de validation selon le design system
			const emailRules = [
				{ type: 'email', options: { message: 'Format d\'email invalide' } },
				{ type: 'required', options: { message: 'L\'email est obligatoire' } },
			]

			const submitForm = async () => {
				const isValid = await form.value?.validate()
				if (isValid) {
					alert('Formulaire valide !')
				}
				else {
					alert('Formulaire invalide, veuillez corriger les erreurs.')
				}
			}

			return { name, email, emailRules, form, submitForm, args }
		},
		template: `
      <SyForm ref="form" v-bind="args" @submit="submitForm">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
          <v-btn type="submit" color="primary">Soumettre</v-btn>
        </div>
      </SyForm>
    `,
	}),
	args: {
		validateOnSubmit: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
      <SyForm ref="form" v-bind="args" @submit="submitForm">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
          <v-btn type="submit" color="primary">Soumettre</v-btn>
        </div>
      </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">

const name = ref('')
const email = ref('')

// Règles de validation selon le design system
const emailRules = [
	{ type: 'email', options: { message: "Format d'email invalide" } },
	{ type: 'required', options: { message: "L'email est obligatoire" } },
]

const onSubmit = (event: { isValid: boolean }) => {
  if (event.isValid) {
    alert('Formulaire valide !')
  }
  else {
    alert('Formulaire invalide, veuillez corriger les erreurs.')
  }
}
</script>
`,
			},
		],
	},
}

export const CustomValidation: Story = {
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const username = ref('')
			const password = ref('')
			const confirmPassword = ref('')
			const form = ref<{ validate: () => Promise<boolean> } | null>(null)

			// Règles de validation
			const passwordRules = computed(() => [
				{ type: 'minLength', options: { length: 8, message: 'Minimum 8 caractères' } },
				{ type: 'required', options: { message: 'Le mot de passe est obligatoire' } },
			])

			const confirmPasswordRules = computed(() => [
				{ type: 'custom', options: {
					validate: value => value === password.value || 'Les mots de passe ne correspondent pas',
					message: 'Les mots de passe ne correspondent pas',
				} },
				{ type: 'required', options: { message: 'Veuillez confirmer le mot de passe' } },
			])

			const submitForm = async () => {
				const isValid = await form.value?.validate()
				if (isValid) {
					alert('Inscription réussie !')
				}
				else {
					alert('Formulaire invalide, veuillez corriger les erreurs.')
				}
			}

			const validateManually = async () => {
				const isValid = await form.value?.validate()
				if (isValid) {
					alert('Formulaire valide !')
				}
				else {
					alert('Formulaire invalide !')
				}
			}

			return { username, password, confirmPassword, passwordRules, confirmPasswordRules, form, submitForm, validateManually, args }
		},
		template: `
      <div>
        <SyForm ref="form" v-bind="args" @submit="submitForm">
          <div class="d-flex flex-column gap-4">
            <SyTextField v-model="username" label="Nom d'utilisateur" required />
            <SyTextField v-model="password" label="Mot de passe" type="password" :custom-rules="passwordRules" />
            <SyTextField 
              v-model="confirmPassword" 
              label="Confirmer le mot de passe" 
              type="password" 
              required 
              :custom-rules="confirmPasswordRules" 
            />
            <div class="d-flex gap-3">
              <v-btn type="submit" color="primary">S'inscrire</v-btn>
              <v-btn @click="validateManually" color="secondary">Valider sans soumettre</v-btn>
            </div>
          </div>
        </SyForm>
      </div>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <div>
    <SyForm ref="form" @submit="onSubmit">
      <div class="d-flex flex-column gap-4">
        <SyTextField v-model="username" label="Nom d'utilisateur" required />
        <SyTextField v-model="password" label="Mot de passe" type="password" :custom-rules="passwordRules" />
        <SyTextField 
          v-model="confirmPassword" 
          label="Confirmer le mot de passe" 
          type="password" 
          :custom-rules="confirmPasswordRules" 
        />
        <div class="d-flex gap-3">
          <v-btn type="submit" color="primary">S'inscrire</v-btn>
          <v-btn @click="validateManually" color="secondary">Valider sans soumettre</v-btn>
        </div>
      </div>
    </SyForm>
  </div>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref, computed } from 'vue'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const form = ref(null)

const passwordRules = computed(() => [
	{ type: 'minLength', options: { length: 8, message: 'Minimum 8 caractères' } },
	{ type: 'required', options: { message: 'Le mot de passe est obligatoire' } },
])

const confirmPasswordRules = computed(() => [
	{ type: 'custom', options: {
		validate: value => value === password.value || 'Les mots de passe ne correspondent pas',
		message: 'Les mots de passe ne correspondent pas',
	} },
	{ type: 'required', options: { message: 'Veuillez confirmer le mot de passe' } },
])
	
const validatePasswordMatch = () => {
  return password.value === confirmPassword.value || 'Les mots de passe ne correspondent pas'
}

const onSubmit = (event: { isValid: boolean }) => {
  if (event.isValid) {
    alert('Inscription réussie !')
  }
}

const validateManually = () => {
  form.value?.validate().then((isValid) => {
    alert(isValid ? 'Formulaire valide !' : 'Formulaire invalide !')
  })
}
</script>
`,
			},
		],
	},
}

export const MixedFields: Story = {
	render: args => ({
		components: { SyForm, SyTextField, SySelect, SyCheckbox, VBtn },
		setup() {
			const formData = ref({
				name: '',
				email: '',
				country: '',
			})
			const form = ref<{ validate: () => Promise<boolean> } | null>(null)

			// Règles de validation
			const emailCustomRules = [
				{
					type: 'email',
					options: {
						message: 'L\'email n\'est pas valide',
						successMessage: 'L\'email est valide',
					},
				},
				{ type: 'required', options: { message: 'L\'email est obligatoire' } },
			]

			const countries = [
				{ text: 'France', value: 'fr' },
				{ text: 'Allemagne', value: 'de' },
				{ text: 'Espagne', value: 'es' },
				{ text: 'Italie', value: 'it' },
			]

			const submitForm = async () => {
				const isValid = await form.value?.validate()
				if (isValid) {
					alert(`Formulaire valide ! Données: ${JSON.stringify(formData.value)}`)
				}
				else {
					alert('Formulaire invalide, veuillez corriger les erreurs.')
				}
			}

			return { formData, countries, form, submitForm, emailCustomRules, args }
		},
		template: `
      <SyForm ref="form" v-bind="args" @submit="submitForm">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="formData.name" label="Nom complet" required />
          <SyTextField v-model="formData.email" label="Email" :custom-rules="emailCustomRules" />
          <SySelect v-model="formData.country" :items="countries" label="Pays" required />
          <v-btn type="submit" color="primary">Enregistrer</v-btn>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
      <SyForm ref="form" v-bind="args" @submit="submitForm">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="formData.name" label="Nom complet" required />
          <SyTextField v-model="formData.email" label="Email" :customRules="emailCustomRules" />
          <SySelect v-model="formData.country" :items="countries" label="Pays" required />
          <v-btn type="submit" color="primary">Enregistrer</v-btn>
        </div>
      </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
		<script setup lang="ts">

			const formData = ref({
			name: '',
			email: '',
			country: '',
			})

			const countries = [
			{ text: 'France', value: 'fr' },
			{ text: 'Allemagne', value: 'de' },
			{ text: 'Espagne', value: 'es' },
			{ text: 'Italie', value: 'it' },
			]

			const emailCustomRules = [
				{
					type: 'email',
					options: {
						message: "L'email n'est pas valide:",
						successMessage: "L'email est valide:",
					},
				},
				{ type: 'required', options: { message: "L'email est obligatoire" } },
			]

			const onSubmit = (event: { isValid: boolean }) => {
			if (event.isValid) {
				alert('Formulaire valide ! Données: ' + JSON.stringify(formData.value))
			}
			}
		</script>
`,
			},
		],
	},
}

export const Reset: Story = {
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')
			const form = ref<{ validate: () => Promise<boolean> } | null>(null)

			// Règles de validation selon le design system
			const emailRules = [
				{ type: 'email', options: { message: 'Format d\'email invalide' } },
				{ type: 'required', options: { message: 'L\'email est obligatoire' } },
			]

			const submitForm = async () => {
				const isValid = await form.value?.validate()
				if (isValid) {
					alert('Formulaire valide !')
				}
				else {
					alert('Formulaire invalide, veuillez corriger les erreurs.')
				}
			}

			const resetForm = () => {
				form.value?.reset()
			}

			const onFormReset = () => {
				name.value = ''
				email.value = ''
			}

			return { name, email, emailRules, form, submitForm, resetForm, onFormReset, args }
		},
		template: `
      <SyForm ref="form" v-bind="args" @submit="submitForm" @reset="onFormReset">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
          <v-btn color="primary" @click="resetForm">Reset</v-btn>
          <v-btn type="submit" color="primary">Soumettre</v-btn>
        </div>
      </SyForm>
    `,
	}),
	args: {
		validateOnSubmit: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
      <SyForm ref="form" v-bind="args" @submit="submitForm" @reset="onFormReset">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
          <v-btn color="primary" @click="resetForm">Reset</v-btn>
          <v-btn type="submit" color="primary">Soumettre</v-btn>
        </div>
      </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
const name = ref('')
const email = ref('')

// Règles de validation selon le design system
const emailRules = [
	{ type: 'email', options: { message: "Format d'email invalide" } },
	{ type: 'required', options: { message: "L'email est obligatoire" } },
]

const onSubmit = (event: { isValid: boolean }) => {
  if (event.isValid) {
    alert('Formulaire valide !')
  }
  else {
    alert('Formulaire invalide, veuillez corriger les erreurs.')
  }
}

const resetForm = () => {
  form.value?.reset()
}


const onFormReset = () => {
  name.value = ''
  email.value = ''
}
</script>
`,
			},
		],
	},
}

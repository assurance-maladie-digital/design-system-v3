import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
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

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide !')
				}
				else {
					alert('Formulaire invalide, veuillez corriger les erreurs.')
				}
			}

			return { name, email, onSubmit, args }
		},
		template: `
      <SyForm v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" required :rules="[v => /.+@.+/.test(v) || 'E-mail invalide']" />
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
  <SyForm @submit="onSubmit">
    <div class="d-flex flex-column gap-4">
      <SyTextField v-model="name" label="Nom" required />
      <SyTextField v-model="email" label="Email" required :rules="[v => /.+@.+/.test(v) || 'E-mail invalide']" />
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
import SyForm from '@cnamts/synapse'
import SyTextField from '@cnamts/synapse'

const name = ref('')
const email = ref('')

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

			const validatePasswordMatch = () => {
				return password.value === confirmPassword.value || 'Les mots de passe ne correspondent pas'
			}

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Inscription réussie !')
				}
			}

			// Utilisez un type pour form.value avec une propriété validate
			interface FormRef {
				validate: () => Promise<boolean>
			}

			const form = ref<FormRef | null>(null)
			const validateManually = () => {
				if (form.value && form.value.validate) {
					form.value.validate().then((isValid: boolean) => {
						alert(isValid ? 'Formulaire valide !' : 'Formulaire invalide !')
					})
				}
			}

			return { username, password, confirmPassword, validatePasswordMatch, onSubmit, form, validateManually, args }
		},
		template: `
      <div>
        <SyForm ref="form" v-bind="args" @submit="onSubmit">
          <div class="d-flex flex-column gap-4">
            <SyTextField v-model="username" label="Nom d'utilisateur" required />
            <SyTextField v-model="password" label="Mot de passe" type="password" required :rules="[v => v.length >= 8 || 'Minimum 8 caractères']" />
            <SyTextField 
              v-model="confirmPassword" 
              label="Confirmer le mot de passe" 
              type="password" 
              required 
              :rules="[validatePasswordMatch]" 
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
        <SyTextField v-model="password" label="Mot de passe" type="password" required :rules="[v => v.length >= 8 || 'Minimum 8 caractères']" />
        <SyTextField 
          v-model="confirmPassword" 
          label="Confirmer le mot de passe" 
          type="password" 
          required 
          :rules="[validatePasswordMatch]" 
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
import { ref } from 'vue'
import SyForm from '@cnamts/synapse'
import SyTextField from '@cnamts/synapse'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const form = ref(null)

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
				subscribe: false,
			})

			const countries = [
				{ text: 'France', value: 'fr' },
				{ text: 'Allemagne', value: 'de' },
				{ text: 'Espagne', value: 'es' },
				{ text: 'Italie', value: 'it' },
			]

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert(`Formulaire valide ! Données: ${JSON.stringify(formData.value)}`)
				}
			}

			return { formData, countries, onSubmit, args }
		},
		template: `
      <SyForm v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="formData.name" label="Nom complet" required />
          <SyTextField v-model="formData.email" label="Email" required :rules="[v => /.+@.+/.test(v) || 'E-mail invalide']" />
          <SySelect v-model="formData.country" :items="countries" label="Pays" required />
          <SyCheckbox v-model="formData.subscribe" label="S'abonner à la newsletter" />
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
  <SyForm @submit="onSubmit">
    <div class="d-flex flex-column gap-4">
      <SyTextField v-model="formData.name" label="Nom complet" required />
      <SyTextField v-model="formData.email" label="Email" required :rules="[v => /.+@.+/.test(v) || 'E-mail invalide']" />
      <SySelect v-model="formData.country" :items="countries" label="Pays" required />
      <SyCheckbox v-model="formData.subscribe" label="S'abonner à la newsletter" />
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
import { ref } from 'vue'
import SyForm from '@cnamts/synapse'
import SyTextField from '@cnamts/synapse'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'

const formData = ref({
  name: '',
  email: '',
  country: '',
  subscribe: false,
})

const countries = [
  { text: 'France', value: 'fr' },
  { text: 'Allemagne', value: 'de' },
  { text: 'Espagne', value: 'es' },
  { text: 'Italie', value: 'it' },
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

export const WithoutAutoValidation: Story = {
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')

			const onSubmit = () => {
				alert(`Soumission du formulaire sans validation automatique. Vous devez gérer la validation manuellement.`)
			}

			return { name, email, onSubmit, args }
		},
		template: `
      <SyForm v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" required :rules="[v => /.+@.+/.test(v) || 'E-mail invalide']" />
          <v-btn type="submit" color="primary">Soumettre</v-btn>
        </div>
      </SyForm>
    `,
	}),
	args: {
		validateOnSubmit: false,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm :validate-on-submit="false" @submit="onSubmit">
    <div class="d-flex flex-column gap-4">
      <SyTextField v-model="name" label="Nom" required />
      <SyTextField v-model="email" label="Email" required :rules="[v => /.+@.+/.test(v) || 'E-mail invalide']" />
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
import SyForm from '@cnamts/synapse'
import SyTextField from '@cnamts/synapse'

const name = ref('')
const email = ref('')

const onSubmit = () => {
  alert('Soumission du formulaire sans validation automatique. Vous devez gérer la validation manuellement.')
}
</script>
`,
			},
		],
	},
}

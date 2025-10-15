import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { VBtn, VTextField } from 'vuetify/components'

/**
 * La documentation sur le système de validation en cascade de Synapse Design System.
 */
export default {
	title: 'Composables/ValidationSystem',
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
				component: 'Le système de validation en cascade permet de gérer facilement la validation de formulaires complexes et imbriqués.',
			},
		},
	},
} satisfies Meta<typeof SyForm>

type Story = StoryObj<typeof SyForm>

// Exemple de base
export const SimpleForm: Story = {
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide !')
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
}
</script>
`,
			},
		],
	},
}

// Exemple de formulaire avec composants mixtes
export const MixedComponentsForm: Story = {
	render: args => ({
		components: { SyForm, SyTextField, SySelect, SyCheckbox, DatePicker, VBtn, VTextField },
		setup() {
			const user = ref({
				name: '',
				birthDate: null,
				country: '',
				acceptTerms: false,
			})

			const countries = [
				{ text: 'France', value: 'fr' },
				{ text: 'Allemagne', value: 'de' },
				{ text: 'Espagne', value: 'es' },
			]

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide ! Données : ' + JSON.stringify(user.value))
				}
			}

			return { user, countries, onSubmit, args }
		},
		template: `
      <SyForm v-bind="args" @submit="onSubmit" class="form-mixed">
        <div class="d-flex flex-column gap-4">
          <!-- Composant personnalisé avec useValidatable -->
          <SyTextField v-model="user.name" label="Nom" required />
          
          <!-- Composant personnalisé avec useValidatable -->
          <DatePicker v-model="user.birthDate" label="Date de naissance" required />
          
          <!-- Composant personnalisé avec useValidatable -->
          <SySelect v-model="user.country" :items="countries" label="Pays" required />
          
          <!-- Composant natif Vuetify -->
          <v-text-field v-model="user.city" label="Ville" :rules="[v => !!v || 'Ville requise']"></v-text-field>
          
          <!-- Composant personnalisé avec useValidatable -->
          <SyCheckbox v-model="user.acceptTerms" label="J'accepte les conditions" required />
          
          <v-btn type="submit" color="primary">Soumettre</v-btn>
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
  <SyForm @submit="onSubmit" class="form-mixed">
    <div class="d-flex flex-column gap-4">
      <!-- Composant personnalisé avec useValidatable -->
      <SyTextField v-model="user.name" label="Nom" required />
      
      <!-- Composant personnalisé avec useValidatable -->
      <DatePicker v-model="user.birthDate" label="Date de naissance" required />
      
      <!-- Composant personnalisé avec useValidatable -->
      <SySelect v-model="user.country" :items="countries" label="Pays" required />
      
      <!-- Composant natif Vuetify -->
      <v-text-field v-model="user.city" label="Ville" :rules="[v => !!v || 'Ville requise']"></v-text-field>
      
      <!-- Composant personnalisé avec useValidatable -->
      <SyCheckbox v-model="user.acceptTerms" label="J'accepte les conditions" required />
      
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
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { VTextField } from 'vuetify/components'

const user = ref({
  name: '',
  birthDate: null,
  country: '',
  city: '',
  acceptTerms: false,
})

const countries = [
  { text: 'France', value: 'fr' },
  { text: 'Allemagne', value: 'de' },
  { text: 'Espagne', value: 'es' },
]

const onSubmit = (event: { isValid: boolean }) => {
  if (event.isValid) {
    alert('Formulaire valide ! Données : ' + JSON.stringify(user.value))
  }
}
</script>
`,
			},
		],
	},
}

// Exemple de formulaire imbriqué
export const NestedForm: Story = {
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const user = ref({
				name: '',
				address: {
					street: '',
					city: '',
					zipcode: '',
				},
			})

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide ! Données : ' + JSON.stringify(user.value))
				}
			}

			return { user, onSubmit, args }
		},
		template: `
      <SyForm v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column gap-4">
          <h3>Informations personnelles</h3>
          <SyTextField v-model="user.name" label="Nom" required />
          
          <fieldset style="border: 1px solid #ccc; padding: 16px; border-radius: 4px;">
            <legend>Adresse</legend>
            <div class="d-flex flex-column gap-4">
              <SyTextField v-model="user.address.street" label="Rue" required />
              <SyTextField v-model="user.address.city" label="Ville" required />
              <SyTextField v-model="user.address.zipcode" label="Code postal" required />
            </div>
          </fieldset>
          
          <v-btn type="submit" color="primary">Soumettre</v-btn>
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
      <h3>Informations personnelles</h3>
      <SyTextField v-model="user.name" label="Nom" required />
      
      <fieldset style="border: 1px solid #ccc; padding: 16px; border-radius: 4px;">
        <legend>Adresse</legend>
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="user.address.street" label="Rue" required />
          <SyTextField v-model="user.address.city" label="Ville" required />
          <SyTextField v-model="user.address.zipcode" label="Code postal" required />
        </div>
      </fieldset>
      
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

const user = ref({
  name: '',
  address: {
    street: '',
    city: '',
    zipcode: '',
  },
})

const onSubmit = (event: { isValid: boolean }) => {
  if (event.isValid) {
    alert('Formulaire valide ! Données : ' + JSON.stringify(user.value))
  }
}
</script>
`,
			},
		],
	},
}

// Exemple d'implémentation personnalisée
export const CustomImplementation: Story = {
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const email = ref('')
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

			return { email, password, confirmPassword, validatePasswordMatch, onSubmit, args }
		},
		template: `
      <SyForm v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="email" label="Email" type="email" required :rules="[v => /.+@.+/.test(v) || 'E-mail invalide']" />
          <SyTextField v-model="password" label="Mot de passe" type="password" required :rules="[v => v.length >= 8 || 'Minimum 8 caractères']" />
          <SyTextField 
            v-model="confirmPassword" 
            label="Confirmer le mot de passe" 
            type="password" 
            required 
            :rules="[validatePasswordMatch]" 
          />
          <v-btn type="submit" color="primary">S'inscrire</v-btn>
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
      <SyTextField v-model="email" label="Email" type="email" required :rules="[v => /.+@.+/.test(v) || 'E-mail invalide']" />
      <SyTextField v-model="password" label="Mot de passe" type="password" required :rules="[v => v.length >= 8 || 'Minimum 8 caractères']" />
      <SyTextField 
        v-model="confirmPassword" 
        label="Confirmer le mot de passe" 
        type="password" 
        required 
        :rules="[validatePasswordMatch]" 
      />
      <v-btn type="submit" color="primary">S'inscrire</v-btn>
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

const email = ref('')
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
</script>
`,
			},
		],
	},
}

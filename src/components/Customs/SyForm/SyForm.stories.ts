import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, computed } from 'vue'
import SyForm from './SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import { VBtn } from 'vuetify/components'
import { fn } from 'storybook/test'

export default {
	title: 'Composants/Formulaires/SyForm',
	component: SyForm,
	argTypes: {
		'validateOnSubmit': {
			control: 'boolean',
			description: 'Active ou désactive la validation automatique lors de la soumission',
			defaultValue: true,
		},
		'default': {
			description: 'Contenu du formulaire, généralement des champs de formulaire comme SyTextField, SySelect, etc.',
			table: {
				type: {
					summary: `
						{
							'isValid': boolean,
							'validate': () => Promise<boolean>,
							'reset': () => void,
							'clear': () => void
					}`,
				},
			},
		},
		'update:modelValue': {
			description: 'Événement émis lorsque la validation du formulaire est mise à jour. L\'argument est un booléen indiquant si le formulaire est actuellement valide ou non.',
			action: 'update:modelValue',
		},
		'reset': {
			description: 'Événement émis lors de la réinitialisation du formulaire.',
			action: 'reset',
		},
		'submit': {
			description: 'Événement émis lors de la soumission du formulaire. L\'argument contient un objet avec une propriété "isValid" indiquant si le formulaire est valide.',
			action: 'onSubmit',
		},
	},
	parameters: {
		docs: {
			description: {
				component: 'SyForm est un composant de formulaire qui prend en charge à la fois les composants personnalisés et les composants natifs Vuetify.',
			},
		},
		controls: {
			exclude: /^on.*/,
		},
	},
	args: {
		'onUpdate:modelValue': fn(),
		'onSubmit': fn(),
		'onReset': fn(),
	},
// `as` (et non `satisfies`) : les `argTypes` documentent des événements
// (`update:modelValue`, `submit`, `reset`), que le type strict `Meta<typeof SyForm>`
// n'autorise pas comme clés (props/slots uniquement). Escape hatch assumé.
} as Meta<typeof SyForm>

type Story = StoryObj<typeof SyForm>

export const Basic: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')
			const form = ref<{ validate: () => Promise<boolean>, reset: () => void, clearValidation: () => void } | null>(null)

			// Règles de validation selon le design system
			const emailRules = [
				{ type: 'email', options: { message: 'Format d\'email invalide' } },
				{ type: 'required', options: { message: 'L\'email est obligatoire' } },
			]

			const submitForm = async (e: { isValid: boolean }) => {
				if (e.isValid) {
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
          <SyTextField v-model="name" label="Nom" required class="mb-2" />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" class="mb-2" />
          <div class="d-flex gap-3">
            <v-btn type="submit" color="primary">Soumettre</v-btn>
          </div>
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
      <SyForm ref="form" @submit="onSubmit">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required class="mb-2" />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" class="mb-2" />
          <div class="d-flex gap-3">
            <v-btn type="submit" color="primary">Soumettre</v-btn>
          </div>
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
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const username = ref('')
			const password = ref('')
			const confirmPassword = ref('')
			// v-model tri-état : true (valide) | false (invalide) | null (non évalué)
			const isFormValid = ref<boolean | null>(null)
			const form = ref<{ validate: () => Promise<boolean> } | null>(null)

			const passwordRules = computed(() => [
				{ type: 'required', options: { message: 'Le mot de passe est obligatoire' } },
				{ type: 'minLength', options: { length: 8, message: 'Minimum 8 caractères' } },
			])

			// Règle « custom » : compare la confirmation au mot de passe saisi (inter-champs).
			const confirmPasswordRules = computed(() => [
				{ type: 'required', options: { message: 'Veuillez confirmer le mot de passe' } },
				{ type: 'custom', options: {
					validate: (value: string) => value === password.value,
					message: 'Les mots de passe ne correspondent pas',
				} },
			])

			const onSubmit = (event: { isValid: boolean }) => {
				alert(event.isValid ? 'Inscription réussie !' : 'Formulaire invalide, veuillez corriger les erreurs.')
			}

			const validateManually = async () => {
				const isValid = await form.value?.validate()
				alert(isValid ? 'Formulaire valide !' : 'Formulaire invalide !')
			}

			const validityLabel = computed(() =>
				isFormValid.value === null ? 'non évalué' : (isFormValid.value ? 'valide' : 'invalide'),
			)

			return { username, password, confirmPassword, isFormValid, validityLabel, passwordRules, confirmPasswordRules, form, onSubmit, validateManually, args }
		},
		template: `
      <SyForm ref="form" v-model="isFormValid" v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="username" label="Nom d'utilisateur" required />
          <SyTextField v-model="password" label="Mot de passe" type="password" :custom-rules="passwordRules" />
          <SyTextField v-model="confirmPassword" label="Confirmer le mot de passe" type="password" :custom-rules="confirmPasswordRules" />

          <p class="text-body-2 mb-0">Validité du formulaire (v-model) : <strong>{{ validityLabel }}</strong></p>

          <div class="d-flex gap-3">
            <v-btn type="submit" color="primary">S'inscrire</v-btn>
            <v-btn variant="outlined" @click="validateManually">Valider manuellement</v-btn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Règles de validation personnalisées

Chaque champ reçoit ses règles via \`custom-rules\` : règles prêtes à l'emploi
(\`required\`, \`minLength\`) et règle \`custom\` pour une validation sur-mesure — ici la
correspondance des deux mots de passe (validation **inter-champs**).

- **S'inscrire** (\`type="submit"\`) déclenche la validation de tout le formulaire (comportement
  par défaut), puis émet \`submit\` avec \`{ isValid }\`.
- **Valider manuellement** appelle la méthode exposée \`form.validate()\`.
- Le \`v-model\` reflète en direct la validité globale (\`true\` / \`false\` / \`null\` tant qu'un champ
  n'a pas été évalué).
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm ref="form" v-model="isFormValid" @submit="onSubmit">
    <div class="d-flex flex-column gap-4">
      <SyTextField v-model="username" label="Nom d'utilisateur" required />
      <SyTextField v-model="password" label="Mot de passe" type="password" :custom-rules="passwordRules" />
      <SyTextField v-model="confirmPassword" label="Confirmer le mot de passe" type="password" :custom-rules="confirmPasswordRules" />

      <!-- Validité globale exposée par le v-model : 'valide' | 'invalide' | 'non évalué' -->
      <p>Validité du formulaire : {{ isFormValid === null ? 'non évalué' : (isFormValid ? 'valide' : 'invalide') }}</p>

      <div class="d-flex gap-3">
        <v-btn type="submit" color="primary">S'inscrire</v-btn>
        <v-btn variant="outlined" @click="validateManually">Valider manuellement</v-btn>
      </div>
    </div>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref, computed } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
// v-model tri-état : true (valide) | false (invalide) | null (non évalué)
const isFormValid = ref<boolean | null>(null)
const form = ref(null)

const passwordRules = computed(() => [
  { type: 'required', options: { message: 'Le mot de passe est obligatoire' } },
  { type: 'minLength', options: { length: 8, message: 'Minimum 8 caractères' } },
])

// Règle « custom » : compare la confirmation au mot de passe (validation inter-champs)
const confirmPasswordRules = computed(() => [
  { type: 'required', options: { message: 'Veuillez confirmer le mot de passe' } },
  { type: 'custom', options: {
    validate: (value) => value === password.value,
    message: 'Les mots de passe ne correspondent pas',
  } },
])

const onSubmit = (event) => {
  alert(event.isValid ? 'Inscription réussie !' : 'Formulaire invalide, veuillez corriger les erreurs.')
}

const validateManually = async () => {
  const isValid = await form.value?.validate()
  alert(isValid ? 'Formulaire valide !' : 'Formulaire invalide !')
}
</script>
`,
			},
		],
	},
}

export const MixedFields: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
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

			const submitForm = async (e: { isValid: boolean }) => {
				if (e.isValid) {
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
          <SyTextField v-model="formData.name" label="Nom complet" required class="mb-2" />
          <SyTextField v-model="formData.email" label="Email" :custom-rules="emailCustomRules" class="mb-2" />
          <SySelect v-model="formData.country" :items="countries" label="Pays" required class="mb-2" />
          <div class="d-flex gap-3">
            <v-btn type="submit" color="primary">Enregistrer</v-btn>
          </div>
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
      <SyForm ref="form" @submit="submitForm">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="formData.name" label="Nom complet" required class="mb-2" />
          <SyTextField v-model="formData.email" label="Email" :customRules="emailCustomRules" class="mb-2" />
          <SySelect v-model="formData.country" :items="countries" label="Pays" required class="mb-2" />
          <div class="d-flex gap-3">
            <v-btn type="submit" color="primary">Enregistrer</v-btn>
          </div>
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

			const submitForm = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide ! Données: ' + JSON.stringify(formData.value))
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

export const Reset: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')
			const form = ref<{ validate: () => Promise<boolean>, reset: () => void, clearValidation: () => void } | null>(null)

			// Règles de validation selon le design system
			const emailRules = [
				{ type: 'email', options: { message: 'Format d\'email invalide' } },
				{ type: 'required', options: { message: 'L\'email est obligatoire' } },
			]

			const submitForm = async (e: { isValid: boolean }) => {
				if (e.isValid) {
					alert('Formulaire valide !')
				}
				else {
					alert('Formulaire invalide, veuillez corriger les erreurs.')
				}
			}

			function clearAll() {
				form.value?.reset()
				form.value?.clearValidation()
			}

			function onFormReset() {
				alert('Formulaire réinitialisé !')
				args.onReset?.()
			}

			return { name, email, emailRules, form, submitForm, clearAll, onFormReset, args }
		},
		template: `
      <SyForm ref="form" v-bind="args" @submit="submitForm" @reset="onFormReset">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required class="mb-2" />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" class="mb-2" />
          <div class="d-flex gap-3">
              <v-btn color="secondary" class="mr-2" @click="clearAll">Reset</v-btn>
              <v-btn type="submit" color="primary">Soumettre</v-btn>
          </div>
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
      <SyForm ref="form" @submit="submitForm" @reset="onFormReset">
        <div class="d-flex flex-column gap-4">
          <SyTextField v-model="name" label="Nom" required class="mb-2" />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" class="mb-2" />
          <div class="d-flex gap-3">
              <v-btn color="secondary" class="mr-2" @click="clearAll">Reset</v-btn>
              <v-btn type="submit" color="primary">Soumettre</v-btn>
          </div>
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

function clearAll() {
  form.value?.reset()
  form.value?.clearValidation()
}
</script>
`,
			},
		],
	},
}

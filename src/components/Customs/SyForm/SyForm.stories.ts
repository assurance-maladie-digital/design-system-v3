import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, computed } from 'vue'
import SyForm from './SyForm.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyCheckbox from '@/components/Customs/SyCheckbox/SyCheckbox.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
import SyInputSelect from '@/components/Customs/Selects/SyInputSelect/SyInputSelect.vue'
import SelectBtnField from '@/components/Customs/Selects/SelectBtnField/SelectBtnField.vue'
import SyRadioGroup from '@/components/Customs/SyRadioGroup/SyRadioGroup.vue'
import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import MonthPicker from '@/components/MonthPicker/MonthPicker.vue'
import PeriodField from '@/components/PeriodField/PeriodField.vue'
import { VBtn, VSwitch, VTextField } from 'vuetify/components'
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

			return { name, email, emailRules, submitForm, args }
		},
		template: `
      <SyForm v-bind="args" @submit="submitForm">
        <div class="d-flex flex-column ga-4">
          <SyTextField v-model="name" label="Nom" required class="mb-2" />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" class="mb-2" />
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Soumettre</VBtn>
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
      <SyForm @submit="submitForm">
        <div class="d-flex flex-column ga-4">
          <SyTextField v-model="name" label="Nom" required class="mb-2" />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" class="mb-2" />
          <div class="d-flex ga-3">
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

const submitForm = (event: { isValid: boolean }) => {
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
			// v-model tri-état : true (toutes les règles passent) | false (invalide) | null (aucun statut disponible)
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
				isFormValid.value === null ? 'statut indisponible' : (isFormValid.value ? 'valide' : 'invalide'),
			)

			return { username, password, confirmPassword, isFormValid, validityLabel, passwordRules, confirmPasswordRules, form, onSubmit, validateManually, args }
		},
		template: `
      <div>
        <SyForm ref="form" v-bind="args" @submit="onSubmit" :validate-on-submit="args.validateOnSubmit">
          <div class="d-flex flex-column ga-4">
            <SyTextField v-model="username" label="Nom d'utilisateur" required class="mb-2" />
            <SyTextField v-model="password" label="Mot de passe" type="password" :custom-rules="passwordRules" class="mb-2" />
            <SyTextField 
              v-model="confirmPassword" 
              label="Confirmer le mot de passe" 
              type="password" 
              required 
              :custom-rules="confirmPasswordRules"
              class="mb-2"
            />
            <div class="d-flex ga-3">
              <VBtn type="submit" color="primary">S'inscrire</VBtn>
              <VBtn @click="validateManually" color="secondary">Valider sans soumettre</VBtn>
            </div>
          </div>
        </SyForm>
      </div>
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
- Le \`v-model\` reflète en direct la validité globale (\`true\` / \`false\` / \`null\` lorsqu'aucun
	statut de champ n'est disponible).
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm ref="form" v-model="isFormValid" @submit="onSubmit">
    <div class="d-flex flex-column ga-4">
      <SyTextField v-model="username" label="Nom d'utilisateur" required />
      <SyTextField v-model="password" label="Mot de passe" type="password" :custom-rules="passwordRules" />
      <SyTextField v-model="confirmPassword" label="Confirmer le mot de passe" type="password" :custom-rules="confirmPasswordRules" />

	<!-- Validité globale exposée par le v-model -->
	<p>Validité du formulaire : {{ isFormValid === null ? 'statut indisponible' : (isFormValid ? 'valide' : 'invalide') }}</p>

      <div class="d-flex ga-3">
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
// v-model tri-état : true (toutes les règles passent) | false (invalide) | null (aucun statut disponible)
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
        <div class="d-flex flex-column ga-4">
          <SyTextField v-model="formData.name" label="Nom complet" required class="mb-2" />
          <SyTextField v-model="formData.email" label="Email" :custom-rules="emailCustomRules" class="mb-2" />
          <SySelect v-model="formData.country" :items="countries" label="Pays" required class="mb-2" />
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Enregistrer</VBtn>
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
        <div class="d-flex flex-column ga-4">
          <SyTextField v-model="formData.name" label="Nom complet" required class="mb-2" />
          <SyTextField v-model="formData.email" label="Email" :custom-rules="emailCustomRules" class="mb-2" />
          <SySelect v-model="formData.country" :items="countries" label="Pays" required class="mb-2" />
          <div class="d-flex ga-3">
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
import { ref } from 'vue'

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
			message: "L'email n'est pas valide",
			successMessage: "L'email est valide",
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

// Libellé du v-model tri-état du SyForm, affiché par les stories ci-dessous.
const formValidityText = (value: boolean | null) => {
	if (value === null) return 'statut indisponible'
	return value ? 'valide' : 'invalide'
}

export const SelectionFields: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SySelect, SyAutocomplete, SyInputSelect, SelectBtnField, SyRadioGroup, SyCheckBoxGroup, SyCheckbox, VBtn },
		setup() {
			const values = ref({
				careType: null as string | null,
				doctor: null as string | null,
				regime: null as Record<string, unknown> | string | null,
				transfer: null as string | null,
				transmission: null as string | null,
				notifications: [] as string[],
				terms: false,
			})
			const isFormValid = ref<boolean | null>(null)
			const form = ref<{ reset: () => void } | null>(null)

			const careTypeItems = [
				{ text: 'Consultation médecin généraliste', value: 'gp' },
				{ text: 'Consultation médecin spécialiste', value: 'specialist' },
				{ text: 'Soins dentaires', value: 'dental' },
			]
			const doctorItems = [
				{ text: 'Dr Martin — Généraliste', value: 'martin' },
				{ text: 'Dr Bernard — Cardiologue', value: 'bernard' },
				{ text: 'Dr Dubois — Dermatologue', value: 'dubois' },
			]
			const regimeItems = [
				{ text: 'Régime général', value: 'general' },
				{ text: 'Régime agricole', value: 'agricole' },
			]
			const transferItems = [
				{ text: 'Téléversement immédiat', value: 'immediate' },
				{ text: 'Téléversement différé', value: 'deferred' },
			]
			const transmissionOptions = [
				{ label: 'Voie sécurisée', value: 'secure' },
				{ label: 'Voie standard', value: 'standard' },
			]
			const notificationOptions = [
				{ label: 'Suivi du remboursement', value: 'refunds' },
				{ label: 'Rappels de rendez-vous', value: 'reminders' },
			]

			const validityText = computed(() => formValidityText(isFormValid.value))

			return {
				values,
				isFormValid,
				form,
				careTypeItems,
				doctorItems,
				regimeItems,
				transferItems,
				transmissionOptions,
				notificationOptions,
				validityText,
				args,
			}
		},
		template: `
      <SyForm ref="form" v-model="isFormValid" v-bind="args">
        <div class="d-flex flex-column ga-4">
          <SySelect v-model="values.careType" label="Type de soins (SySelect)" :items="careTypeItems" required />
          <SyAutocomplete v-model="values.doctor" label="Médecin traitant (SyAutocomplete)" :items="doctorItems" required />
          <SyInputSelect v-model="values.regime" label="Régime (SyInputSelect)" :items="regimeItems" required />
          <SelectBtnField v-model="values.transfer" label="Mode de téléversement (SelectBtnField)" :items="transferItems" required />
          <SyRadioGroup v-model="values.transmission" label="Voie de transmission (SyRadioGroup)" :options="transmissionOptions" required />
          <SyCheckBoxGroup
            v-model="values.notifications"
            label="Notifications souhaitées (SyCheckBoxGroup)"
            :options="notificationOptions"
            multiple
            required
          />
          <SyCheckbox v-model="values.terms" label="J'accepte les conditions d'utilisation (SyCheckbox)" required />
          <p role="status">Validité du formulaire : {{ validityText }}</p>
          <div class="d-flex ga-3">
            <VBtn variant="outlined" color="primary" @click="form?.reset()">Réinitialiser</VBtn>
            <VBtn type="submit" color="primary">Soumettre</VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Champs de sélection

Tous les composants de sélection du Design System s'enregistrent auprès du \`SyForm\` :
un champ \`required\` laissé vide bloque la soumission, et \`reset()\` vide chaque champ
sans afficher d'erreur.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm ref="form" v-model="isFormValid">
    <SySelect v-model="values.careType" label="Type de soins" :items="careTypeItems" required />
    <SyAutocomplete v-model="values.doctor" label="Médecin traitant" :items="doctorItems" required />
    <SyInputSelect v-model="values.regime" label="Régime" :items="regimeItems" required />
    <SelectBtnField v-model="values.transfer" label="Mode de téléversement" :items="transferItems" required />
    <SyRadioGroup v-model="values.transmission" label="Voie de transmission" :options="transmissionOptions" required />
    <SyCheckBoxGroup v-model="values.notifications" label="Notifications souhaitées" :options="notificationOptions" multiple required />
    <SyCheckbox v-model="values.terms" label="J'accepte les conditions d'utilisation" required />
    <div class="d-flex ga-3">
      <v-btn variant="outlined" color="primary" @click="form?.reset()">Réinitialiser</v-btn>
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
import {
  SelectBtnField,
  SyAutocomplete,
  SyCheckbox,
  SyCheckBoxGroup,
  SyForm,
  SyInputSelect,
  SyRadioGroup,
  SySelect,
} from '@cnamts/synapse'

const values = ref({
  careType: null,
  doctor: null,
  regime: null,
  transfer: null,
  transmission: null,
  notifications: [],
  terms: false,
})
const isFormValid = ref<boolean | null>(null)
const form = ref<InstanceType<typeof SyForm> | null>(null)

const careTypeItems = [
  { text: 'Consultation médecin généraliste', value: 'gp' },
  { text: 'Consultation médecin spécialiste', value: 'specialist' },
  { text: 'Soins dentaires', value: 'dental' },
]
const doctorItems = [
  { text: 'Dr Martin — Généraliste', value: 'martin' },
  { text: 'Dr Bernard — Cardiologue', value: 'bernard' },
  { text: 'Dr Dubois — Dermatologue', value: 'dubois' },
]
const regimeItems = [
  { text: 'Régime général', value: 'general' },
  { text: 'Régime agricole', value: 'agricole' },
]
const transferItems = [
  { text: 'Téléversement immédiat', value: 'immediate' },
  { text: 'Téléversement différé', value: 'deferred' },
]
const transmissionOptions = [
  { label: 'Voie sécurisée', value: 'secure' },
  { label: 'Voie standard', value: 'standard' },
]
const notificationOptions = [
  { label: 'Suivi du remboursement', value: 'refunds' },
  { label: 'Rappels de rendez-vous', value: 'reminders' },
]
</script>
`,
			},
		],
	},
}

export const DateFields: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, DatePicker, MonthPicker, PeriodField, VBtn },
		setup() {
			const values = ref({
				appointment: null as string | null,
				entry: null as string | null,
				month: undefined as string | undefined,
				period: { from: null, to: null } as { from: string | null, to: string | null },
			})
			const isFormValid = ref<boolean | null>(null)

			const futureDateRules = [
				{ type: 'notBeforeToday', options: { message: 'La date ne peut pas être antérieure à aujourd\'hui' } },
			]

			const validityText = computed(() => formValidityText(isFormValid.value))

			return { values, isFormValid, futureDateRules, validityText, args }
		},
		template: `
      <SyForm v-model="isFormValid" v-bind="args">
        <div class="d-flex flex-column ga-6">
          <DatePicker
            v-model="values.appointment"
            label="Date de rendez-vous (DatePicker)"
            placeholder="JJ/MM/AAAA"
            required
            :custom-rules="futureDateRules"
          />
          <DatePicker
            v-model="values.entry"
            label="Date de saisie (DatePicker no-calendar)"
            placeholder="JJ/MM/AAAA"
            no-calendar
            required
          />
          <MonthPicker v-model="values.month" label="Mois de début (MonthPicker)" required />
          <PeriodField
            v-model="values.period"
            placeholder-from="Date d'entrée (PeriodField)"
            placeholder-to="Date de sortie (PeriodField)"
            required
          />
          <p role="status">Validité du formulaire : {{ validityText }}</p>
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Soumettre</VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Champs de date

Les champs de date s'enregistrent auprès du \`SyForm\` comme les autres champs, quel que soit
le mode du \`DatePicker\` (calendrier ou saisie seule avec \`no-calendar\`). Les règles de date
(\`notBeforeToday\`, \`notBeforeDate\`…) se passent dans \`custom-rules\`.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm v-model="isFormValid">
    <DatePicker
      v-model="values.appointment"
      label="Date de rendez-vous"
      placeholder="JJ/MM/AAAA"
      required
      :custom-rules="futureDateRules"
    />
    <DatePicker v-model="values.entry" label="Date de saisie" placeholder="JJ/MM/AAAA" no-calendar required />
    <MonthPicker v-model="values.month" label="Mois de début" required />
    <PeriodField
      v-model="values.period"
      placeholder-from="Date d'entrée"
      placeholder-to="Date de sortie"
      required
    />
    <v-btn type="submit" color="primary">Soumettre</v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker, MonthPicker, PeriodField, SyForm } from '@cnamts/synapse'

const values = ref({
  appointment: null,
  entry: null,
  month: undefined,
  period: { from: null, to: null },
})
const isFormValid = ref<boolean | null>(null)

const futureDateRules = [
  { type: 'notBeforeToday', options: { message: "La date ne peut pas être antérieure à aujourd'hui" } },
]
</script>
`,
			},
		],
	},
}

export const VuetifyValidation: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VTextField, VBtn },
		setup() {
			const values = ref({
				synapse: '',
				vuetify: '',
				native: '',
			})
			const isFormValid = ref<boolean | null>(null)

			const nameRules = [
				{ type: 'required', options: { message: 'Le nom est obligatoire' } },
				{ type: 'minLength', options: { length: 2, message: 'Au moins 2 caractères' } },
			]
			const requiredRules = [
				(value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'Ce champ est obligatoire',
			]

			const validityText = computed(() => formValidityText(isFormValid.value))

			return { values, isFormValid, nameRules, requiredRules, validityText, args }
		},
		template: `
      <SyForm v-model="isFormValid" v-bind="args">
        <div class="d-flex flex-column ga-4">
          <SyTextField v-model="values.synapse" label="Nom (validation Synapse)" :custom-rules="nameRules" />
          <SyTextField
            v-model="values.vuetify"
            label="Référence du dossier (use-vuetify-validation)"
            required
            use-vuetify-validation
            :rules="requiredRules"
          />
          <VTextField
            v-model="values.native"
            label="Commentaire interne (VTextField) *"
            variant="outlined"
            aria-required="true"
            :rules="requiredRules"
          />
          <p role="status">Validité du formulaire : {{ validityText }}</p>
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Soumettre</VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Validation Synapse et validation Vuetify

Un même \`SyForm\` valide des champs Synapse (\`custom-rules\`), des champs Synapse en mode Vuetify
(\`use-vuetify-validation\` avec \`rules\`) et des composants Vuetify natifs (\`rules\`).

En mode Vuetify, comme dans Vuetify, \`required\` n'ajoute que l'indication visuelle et ARIA :
ajoutez une règle dans \`rules\` pour bloquer la soumission.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm v-model="isFormValid">
    <SyTextField v-model="values.synapse" label="Nom (validation Synapse)" :custom-rules="nameRules" />
    <SyTextField
      v-model="values.vuetify"
      label="Référence du dossier (use-vuetify-validation)"
      required
      use-vuetify-validation
      :rules="requiredRules"
    />
    <v-text-field
      v-model="values.native"
      label="Commentaire interne (VTextField) *"
      aria-required="true"
      :rules="requiredRules"
    />
    <v-btn type="submit" color="primary">Soumettre</v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const values = ref({ synapse: '', vuetify: '', native: '' })
const isFormValid = ref<boolean | null>(null)

// Règles Synapse
const nameRules = [
  { type: 'required', options: { message: 'Le nom est obligatoire' } },
  { type: 'minLength', options: { length: 2, message: 'Au moins 2 caractères' } },
]

// Règles Vuetify : seules à bloquer la soumission en mode Vuetify
const requiredRules = [
  (value: unknown) => (typeof value === 'string' && value.trim() !== '') || 'Ce champ est obligatoire',
]
</script>
`,
			},
		],
	},
}

export const AsyncValidation: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const username = ref('')
			const isFormValid = ref<boolean | null>(null)
			const pendingValidations = ref(0)
			const submitResult = ref<boolean | null>(null)
			const takenUsernames = ['admin', 'dupont']

			// Simule un appel serveur de 800 ms vérifiant la disponibilité de l'identifiant.
			const usernameRules = [
				{ type: 'required', options: { message: 'L\'identifiant est obligatoire' } },
				{
					type: 'custom',
					options: {
						validate: async (value: string) => {
							pendingValidations.value++
							try {
								await new Promise(resolve => setTimeout(resolve, 800))
								return !takenUsernames.includes((value ?? '').trim().toLowerCase())
							}
							finally {
								pendingValidations.value--
							}
						},
						message: 'Cet identifiant est déjà utilisé',
					},
				},
			]

			const onSubmit = ({ isValid }: { isValid: boolean }) => {
				submitResult.value = isValid
			}

			const validityText = computed(() => formValidityText(isFormValid.value))

			return { username, isFormValid, pendingValidations, submitResult, usernameRules, validityText, onSubmit, args }
		},
		template: `
      <SyForm v-model="isFormValid" v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column ga-4">
          <SyTextField
            v-model="username"
            label="Identifiant"
            help-text="« admin » et « dupont » sont déjà utilisés."
            :custom-rules="usernameRules"
          />
          <p role="status">
            Validité du formulaire : {{ validityText }}
            <template v-if="pendingValidations > 0"> — vérification en cours…</template>
            <template v-else-if="submitResult !== null"> — dernière soumission : {{ submitResult ? 'valide' : 'invalide' }}</template>
          </p>
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Soumettre</VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Validation asynchrone

Une règle \`custom\` peut renvoyer une promesse, par exemple pour interroger le serveur.
La soumission attend la fin des validations en cours. Si la valeur change avant la réponse,
le résultat obsolète est ignoré : seul le résultat de la dernière saisie est affiché.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm v-model="isFormValid" @submit="onSubmit">
    <SyTextField v-model="username" label="Identifiant" :custom-rules="usernameRules" />
    <v-btn type="submit" color="primary">Soumettre</v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const username = ref('')
const isFormValid = ref<boolean | null>(null)

const usernameRules = [
  { type: 'required', options: { message: "L'identifiant est obligatoire" } },
  {
    type: 'custom',
    options: {
      // Une règle custom peut renvoyer une promesse
      validate: async (value: string) => {
        const { available } = await checkUsername(value)
        return available
      },
      message: 'Cet identifiant est déjà utilisé',
    },
  },
]

const onSubmit = ({ isValid }: { isValid: boolean }) => {
  console.log('Formulaire valide :', isValid)
}
</script>
`,
			},
		],
	},
}

export const WarningAndSuccessRules: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const days = ref('')
			const isFormValid = ref<boolean | null>(null)
			const submitResult = ref<boolean | null>(null)

			const daysRules = [
				{ type: 'required', options: { message: 'La durée est obligatoire' } },
				{
					type: 'custom',
					options: {
						validate: (value: string) => /^\d+$/.test(value ?? '') && Number(value) > 0,
						message: 'Saisissez un nombre de jours supérieur à 0',
						successMessage: 'Durée valide',
					},
				},
			]
			const daysWarningRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => !value || Number(value) <= 30,
						warningMessage: 'Durée supérieure à 30 jours : un justificatif pourra vous être demandé.',
					},
				},
			]

			const onSubmit = ({ isValid }: { isValid: boolean }) => {
				submitResult.value = isValid
			}

			const validityText = computed(() => formValidityText(isFormValid.value))

			return { days, isFormValid, submitResult, daysRules, daysWarningRules, validityText, onSubmit, args }
		},
		template: `
      <SyForm v-model="isFormValid" v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column ga-4">
          <SyTextField
            v-model="days"
            label="Durée de l'arrêt (en jours)"
            help-text="Saisissez 45 pour afficher un avertissement."
            show-success-messages
            :custom-rules="daysRules"
            :custom-warning-rules="daysWarningRules"
          />
          <p role="status">
            Validité du formulaire : {{ validityText }}
            <template v-if="submitResult !== null"> — dernière soumission : {{ submitResult ? 'valide' : 'invalide' }}</template>
          </p>
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Soumettre</VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Avertissements et messages de succès

- Les règles de \`custom-warning-rules\` affichent un avertissement **sans bloquer** la soumission :
  avec 45 jours, le formulaire reste valide.
- Avec \`show-success-messages\`, le \`successMessage\` d'une règle s'affiche quand elle passe.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm v-model="isFormValid" @submit="onSubmit">
    <SyTextField
      v-model="days"
      label="Durée de l'arrêt (en jours)"
      show-success-messages
      :custom-rules="daysRules"
      :custom-warning-rules="daysWarningRules"
    />
    <v-btn type="submit" color="primary">Soumettre</v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const days = ref('')
const isFormValid = ref<boolean | null>(null)

// Règles bloquantes, avec un message de succès
const daysRules = [
  { type: 'required', options: { message: 'La durée est obligatoire' } },
  {
    type: 'custom',
    options: {
      validate: (value: string) => /^\\d+$/.test(value ?? '') && Number(value) > 0,
      message: 'Saisissez un nombre de jours supérieur à 0',
      successMessage: 'Durée valide',
    },
  },
]

// Avertissement : affiché, mais ne bloque pas la soumission
const daysWarningRules = [
  {
    type: 'custom',
    options: {
      validate: (value: string) => !value || Number(value) <= 30,
      warningMessage: 'Durée supérieure à 30 jours : un justificatif pourra vous être demandé.',
    },
  },
]

const onSubmit = ({ isValid }: { isValid: boolean }) => {
  console.log('Formulaire valide :', isValid)
}
</script>
`,
			},
		],
	},
}

export const WithoutAutoValidation: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')
			const submitMessage = ref('')
			const form = ref<{ validate: () => Promise<boolean> } | null>(null)

			const emailRules = [
				{ type: 'required', options: { message: 'L\'email est obligatoire' } },
				{ type: 'email', options: { message: 'Format d\'email invalide' } },
			]

			// Sans validation automatique, submit renvoie toujours isValid: true :
			// la validation est déclenchée explicitement avec validate().
			const onSubmit = async ({ isValid }: { isValid: boolean }) => {
				const validationResult = await form.value?.validate()
				submitMessage.value = `submit : isValid = ${isValid} — validate() : ${validationResult}`
			}

			return { name, email, submitMessage, form, emailRules, onSubmit, args }
		},
		template: `
      <SyForm ref="form" v-bind="args" :validate-on-submit="false" @submit="onSubmit">
        <div class="d-flex flex-column ga-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
          <p role="status">{{ submitMessage }}</p>
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Soumettre</VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Sans validation automatique

Avec \`:validate-on-submit="false"\`, la soumission ne valide pas les champs : l'événement \`submit\`
renvoie toujours \`isValid: true\`. C'est au parent de déclencher la validation, par exemple avec
la méthode exposée \`validate()\`, au moment qui lui convient.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm ref="form" :validate-on-submit="false" @submit="onSubmit">
    <SyTextField v-model="name" label="Nom" required />
    <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
    <v-btn type="submit" color="primary">Soumettre</v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const name = ref('')
const email = ref('')
const form = ref<InstanceType<typeof SyForm> | null>(null)

const emailRules = [
  { type: 'required', options: { message: "L'email est obligatoire" } },
  { type: 'email', options: { message: "Format d'email invalide" } },
]

// isValid vaut toujours true : la validation est à déclencher explicitement
const onSubmit = async () => {
  const isValid = await form.value?.validate()
  if (!isValid) return
  // Envoi des données
}
</script>
`,
			},
		],
	},
}

export const ValidityState: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')
			const isFormValid = ref<boolean | null>(null)

			const emailRules = [
				{ type: 'required', options: { message: 'L\'email est obligatoire' } },
				{ type: 'email', options: { message: 'Format d\'email invalide' } },
			]

			const validityText = computed(() => formValidityText(isFormValid.value))

			return { name, email, isFormValid, emailRules, validityText, args }
		},
		template: `
      <SyForm v-model="isFormValid" v-bind="args">
        <div class="d-flex flex-column ga-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
          <p id="validity-state-status" role="status">Validité du formulaire : {{ validityText }}</p>
          <div class="d-flex ga-3">
            <VBtn
              type="submit"
              color="primary"
              :disabled="isFormValid !== true"
              aria-describedby="validity-state-status"
            >
              Soumettre
            </VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Bouton piloté par le \`v-model\`

Le \`v-model\` du formulaire vaut \`true\`, \`false\` ou \`null\`. Au montage, le champ « Nom »
est requis et vide : il est invalide, mais aucun message n'est encore affiché, donc le statut vaut
\`null\`. Il passe à \`false\` dès qu'une erreur s'affiche (saisissez un email invalide puis quittez
le champ), et à \`true\` quand toutes les règles passent. Le bouton n'est activé que lorsque le
statut vaut exactement \`true\`.

**Accessibilité** : un bouton désactivé n'explique pas à l'utilisateur ce qui l'empêche de
soumettre. Indiquez les champs obligatoires et reliez le bouton à un texte d'état
(\`aria-describedby\`). Si possible, préférez un bouton toujours actif : la soumission affiche
alors les erreurs de chaque champ.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm v-model="isFormValid">
    <SyTextField v-model="name" label="Nom" required />
    <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
    <p id="form-status" role="status">Validité du formulaire : {{ isFormValid }}</p>
    <!-- Actif uniquement lorsque toutes les règles passent -->
    <v-btn
      type="submit"
      color="primary"
      :disabled="isFormValid !== true"
      aria-describedby="form-status"
    >
      Soumettre
    </v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const name = ref('')
const email = ref('')
// true | false | null
const isFormValid = ref<boolean | null>(null)

const emailRules = [
  { type: 'required', options: { message: "L'email est obligatoire" } },
  { type: 'email', options: { message: "Format d'email invalide" } },
]
</script>
`,
			},
		],
	},
}

export const FieldStates: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn, VSwitch },
		setup() {
			const values = ref({
				conditional: '',
				disabled: '',
				readonly: '',
				ignored: '',
			})
			const showConditionalField = ref(true)
			const isFormValid = ref<boolean | null>(null)
			const submitResult = ref<boolean | null>(null)

			const onSubmit = ({ isValid }: { isValid: boolean }) => {
				submitResult.value = isValid
			}

			const validityText = computed(() => formValidityText(isFormValid.value))

			return { values, showConditionalField, isFormValid, submitResult, validityText, onSubmit, args }
		},
		template: `
      <SyForm v-model="isFormValid" v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column ga-4">
          <VSwitch
            v-model="showConditionalField"
            label="Afficher le champ conditionnel"
            color="primary"
            hide-details
          />
          <SyTextField
            v-if="showConditionalField"
            v-model="values.conditional"
            label="Champ conditionnel (v-if)"
            required
          />
          <SyTextField v-model="values.disabled" label="Champ désactivé (disabled)" required disabled />
          <SyTextField v-model="values.readonly" label="Champ en lecture seule (readonly)" required readonly />
          <SyTextField
            v-model="values.ignored"
            label="Champ sans gestion d'erreur (disable-error-handling)"
            required
            disable-error-handling
          />
          <p role="status">
            Validité du formulaire : {{ validityText }}
            <template v-if="submitResult !== null"> — dernière soumission : {{ submitResult ? 'valide' : 'invalide' }}</template>
          </p>
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Soumettre</VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### États des champs

Tous les champs sont obligatoires et vides. Seul le champ conditionnel bloque la soumission :

- un champ \`disabled\` ou \`readonly\` ne peut pas être corrigé par l'utilisateur, il ne bloque pas le formulaire ;
- un champ \`disable-error-handling\` n'affiche pas d'erreur et ne bloque pas ;
- un champ retiré du DOM (\`v-if\`) se désenregistre du formulaire : masquez le champ conditionnel pour rendre le formulaire valide.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm v-model="isFormValid" @submit="onSubmit">
    <v-switch v-model="showConditionalField" label="Afficher le champ conditionnel" />
    <SyTextField v-if="showConditionalField" v-model="values.conditional" label="Champ conditionnel (v-if)" required />
    <SyTextField v-model="values.disabled" label="Champ désactivé (disabled)" required disabled />
    <SyTextField v-model="values.readonly" label="Champ en lecture seule (readonly)" required readonly />
    <SyTextField v-model="values.ignored" label="Champ sans gestion d'erreur" required disable-error-handling />
    <v-btn type="submit" color="primary">Soumettre</v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const values = ref({ conditional: '', disabled: '', readonly: '', ignored: '' })
const showConditionalField = ref(true)
const isFormValid = ref<boolean | null>(null)

const onSubmit = ({ isValid }: { isValid: boolean }) => {
  console.log('Formulaire valide :', isValid)
}
</script>
`,
			},
		],
	},
}

export const ServerErrors: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const email = ref('')
			const serverErrors = ref<string[]>([])
			const isFormValid = ref<boolean | null>(null)
			const takenEmails = ['jean.dupont@exemple.fr']

			// Simule l'appel au serveur : l'erreur renvoyée est transmise au champ via error-messages.
			const onSubmit = ({ isValid }: { isValid: boolean }) => {
				if (isValid && takenEmails.includes(email.value.trim().toLowerCase())) {
					serverErrors.value = ['Cette adresse e-mail est déjà associée à un compte']
				}
			}

			const validityText = computed(() => formValidityText(isFormValid.value))

			return { email, serverErrors, isFormValid, validityText, onSubmit, args }
		},
		template: `
      <SyForm v-model="isFormValid" v-bind="args" @submit="onSubmit">
        <div class="d-flex flex-column ga-4">
          <SyTextField
            v-model="email"
            label="Adresse e-mail"
            required
            help-text="Saisissez jean.dupont@exemple.fr pour simuler une adresse déjà utilisée."
            :error-messages="serverErrors"
            @update:model-value="serverErrors = []"
          />
          <p role="status">Validité du formulaire : {{ validityText }}</p>
          <div class="d-flex ga-3">
            <VBtn type="submit" color="primary">Créer le compte</VBtn>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Erreurs renvoyées par le serveur

Une erreur transmise via \`error-messages\` invalide le champ, même si ses propres règles passent :
le \`v-model\` du formulaire passe à \`false\` et une nouvelle soumission renvoie \`isValid: false\`.

Le parent doit retirer l'erreur quand l'utilisateur modifie la valeur (\`@update:model-value\`),
sinon le formulaire reste bloqué. \`clearValidation()\` n'efface pas une erreur injectée.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm v-model="isFormValid" @submit="onSubmit">
    <SyTextField
      v-model="email"
      label="Adresse e-mail"
      required
      :error-messages="serverErrors"
      @update:model-value="serverErrors = []"
    />
    <p role="status">Validité du formulaire : {{ isFormValid }}</p>
    <v-btn type="submit" color="primary">Créer le compte</v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const email = ref('')
const serverErrors = ref<string[]>([])
const isFormValid = ref<boolean | null>(null)

const onSubmit = async ({ isValid }: { isValid: boolean }) => {
  if (!isValid) return
  const response = await createAccount({ email: email.value })
  // L'erreur serveur est affichée et invalide le formulaire jusqu'à la modification du champ
  serverErrors.value = response.ok ? [] : ['Cette adresse e-mail est déjà associée à un compte']
}
</script>
`,
			},
		],
	},
}

export const ExposedMethods: Story = {
	args: {
		onReset: fn(),
		onSubmit: fn(),
	},
	render: args => ({
		components: { SyForm, SyTextField, VBtn },
		setup() {
			const name = ref('')
			const email = ref('')
			const isFormValid = ref<boolean | null>(null)
			const lastAction = ref('')
			const form = ref<{ validate: () => Promise<boolean>, reset: () => void, clearValidation: () => void } | null>(null)

			const emailRules = [
				{ type: 'required', options: { message: 'L\'email est obligatoire' } },
				{ type: 'email', options: { message: 'Format d\'email invalide' } },
			]

			const validate = async () => {
				const isValid = await form.value?.validate()
				lastAction.value = `validate() a renvoyé ${isValid}`
			}
			const clearValidation = () => {
				form.value?.clearValidation()
				lastAction.value = 'clearValidation() : messages effacés, valeurs conservées'
			}
			const reset = () => {
				form.value?.reset()
				lastAction.value = 'reset() : valeurs et messages effacés'
			}

			const validityText = computed(() => formValidityText(isFormValid.value))
			const valuesText = computed(() => JSON.stringify({ name: name.value, email: email.value }))

			return { name, email, isFormValid, lastAction, form, emailRules, validate, clearValidation, reset, validityText, valuesText, args }
		},
		template: `
      <SyForm ref="form" v-model="isFormValid" v-bind="args">
        <div class="d-flex flex-column ga-4">
          <SyTextField v-model="name" label="Nom" required />
          <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
          <div class="d-flex flex-wrap ga-3">
            <VBtn color="primary" @click="validate">validate()</VBtn>
            <VBtn color="primary" variant="outlined" @click="clearValidation">clearValidation()</VBtn>
            <VBtn color="primary" variant="outlined" @click="reset">reset()</VBtn>
          </div>
          <div role="status">
            <p>Valeurs : <code>{{ valuesText }}</code></p>
            <p>Validité du formulaire : {{ validityText }}</p>
            <p v-if="lastAction">Dernière action : {{ lastAction }}</p>
          </div>
        </div>
      </SyForm>
    `,
	}),
	parameters: {
		docs: {
			description: {
				story: `
### Méthodes exposées

Remplissez un champ de façon invalide, puis comparez les trois méthodes :

- \`validate()\` évalue tous les champs, affiche leurs erreurs et renvoie la validité ;
- \`clearValidation()\` efface les messages mais **conserve les valeurs** saisies ;
- \`reset()\` efface **les valeurs et les messages**, et émet l'événement \`reset\`.
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SyForm ref="form" v-model="isFormValid">
    <SyTextField v-model="name" label="Nom" required />
    <SyTextField v-model="email" label="Email" :custom-rules="emailRules" />
    <v-btn color="primary" @click="validate">validate()</v-btn>
    <v-btn color="primary" variant="outlined" @click="form?.clearValidation()">clearValidation()</v-btn>
    <v-btn color="primary" variant="outlined" @click="form?.reset()">reset()</v-btn>
  </SyForm>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SyForm, SyTextField } from '@cnamts/synapse'

const name = ref('')
const email = ref('')
const isFormValid = ref<boolean | null>(null)
const form = ref<InstanceType<typeof SyForm> | null>(null)

const emailRules = [
  { type: 'required', options: { message: "L'email est obligatoire" } },
  { type: 'email', options: { message: "Format d'email invalide" } },
]

const validate = async () => {
  const isValid = await form.value?.validate()
  console.log('Formulaire valide :', isValid)
}
</script>
`,
			},
		],
	},
}

import type { Meta, StoryObj } from '@storybook/vue3'
import SelectBtnField from '../SelectBtnField.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { onMounted, ref } from 'vue'
import { fn } from '@storybook/test'
import { VBtn, VForm } from 'vuetify/components'

const meta: Meta<typeof SelectBtnField> = {
	title: 'Composants/Formulaires/Selects/SelectBtnField/Validation',
	component: SelectBtnField,
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Exemples de validation pour le composant SelectBtnField.',
			},
		},
	},
	args: {
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof SelectBtnField>

export default meta

type Story = StoryObj<typeof meta>

const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une `customRule` bloque la sélection « SMS » et affiche un message d’erreur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SelectBtnField
		v-model="value"
		:items="items"
		label="Moyen de contact"
		:custom-rules="customRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'

const value = ref('sms')
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (v) => v !== 'sms',
			message: 'Le SMS n’est pas disponible pour ce dossier.',
		},
	},
]
</script>`,
			},
		],
	},
	render: args => ({
		components: { SelectBtnField },
		setup() {
			const value = ref('sms')
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (v: unknown) => v !== 'sms',
						message: 'Le SMS n’est pas disponible pour ce dossier.',
					},
				},
			]
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, items, customRules, fieldRef }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<SelectBtnField
					ref="fieldRef"
					v-model="value"
					:items="items"
					label="Moyen de contact"
					:custom-rules="customRules"
				/>
			</div>
		`,
	}),
}

export const WithWarning: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une `customWarningRule` affiche un avertissement non bloquant.',
			},
		},
		sourceCode: [
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'

const value = ref('courrier')

const customWarningRules = [
	{
		type: 'custom',
		options: {
			validate: (v) => v !== 'courrier',
			warningMessage: 'Le courrier postal allonge les délais de traitement.',
		},
	},
]
</script>`,
			},
		],
	},
	render: args => ({
		components: { SelectBtnField },
		setup() {
			const value = ref('courrier')
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const customWarningRules = [
				{
					type: 'custom',
					options: {
						validate: (v: unknown) => v !== 'courrier',
						warningMessage: 'Le courrier postal allonge les délais de traitement.',
					},
				},
			]
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, items, customWarningRules, fieldRef }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<SelectBtnField
					ref="fieldRef"
					v-model="value"
					:items="items"
					label="Moyen de contact"
					:custom-warning-rules="customWarningRules"
				/>
			</div>
		`,
	}),
}

export const WithSuccess: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une `customSuccessRule` affiche un feedback positif lorsque `showSuccessMessages` est activé.',
			},
		},
		sourceCode: [
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'

const value = ref('email')

const customSuccessRules = [
	{
		type: 'custom',
		options: {
			validate: (v) => v === 'email',
			successMessage: 'L’email est le moyen de contact le plus rapide.',
		},
	},
]
</script>`,
			},
		],
	},
	render: args => ({
		components: { SelectBtnField },
		setup() {
			const value = ref('email')
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const customSuccessRules = [
				{
					type: 'custom',
					options: {
						validate: (v: unknown) => v === 'email',
						successMessage: 'L’email est le moyen de contact le plus rapide.',
					},
				},
			]
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, items, customSuccessRules, fieldRef }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<SelectBtnField
					ref="fieldRef"
					v-model="value"
					:items="items"
					label="Moyen de contact"
					:custom-success-rules="customSuccessRules"
					show-success-messages
				/>
			</div>
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `disableErrorHandling`, aucune erreur n’est affichée même si une règle échoue.',
			},
		},
	},
	render: args => ({
		components: { SelectBtnField },
		setup() {
			const value = ref<string | null>(null)
			return { args, value, items }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<SelectBtnField
					v-model="value"
					:items="items"
					label="Moyen de contact"
					required
					disable-error-handling
				/>
			</div>
		`,
	}),
}

export const ExternalMessages: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Les props `errorMessages` / `warningMessages` / `successMessages` injectent des messages depuis le parent.',
			},
		},
	},
	render: args => ({
		components: { SelectBtnField, VBtn },
		setup() {
			const value = ref<string | null>('email')
			const errorMessages = ref<string[] | null>(null)
			const warningMessages = ref<string[] | null>(null)
			const successMessages = ref<string[] | null>(null)

			function setError() {
				errorMessages.value = ['Ce moyen de contact est indisponible.']
				warningMessages.value = null
				successMessages.value = null
			}
			function setWarning() {
				errorMessages.value = null
				warningMessages.value = ['Vérifiez vos coordonnées.']
				successMessages.value = null
			}
			function setSuccess() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = ['Moyen de contact validé par le serveur.']
			}
			function reset() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = null
			}

			return { args, value, items, errorMessages, warningMessages, successMessages, setError, setWarning, setSuccess, reset }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<SelectBtnField
					v-model="value"
					:items="items"
					label="Moyen de contact"
					:error-messages="errorMessages"
					:warning-messages="warningMessages"
					:success-messages="successMessages"
					show-success-messages
				/>
				<div class="mt-4 d-flex flex-wrap ga-2">
					<VBtn color="error" @click="setError">Erreur</VBtn>
					<VBtn color="warning" @click="setWarning">Avertissement</VBtn>
					<VBtn color="success" @click="setSuccess">Succès</VBtn>
					<VBtn @click="reset">Réinitialiser</VBtn>
				</div>
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Intégration automatique au `SyForm` : le champ s’enregistre et est validé à la soumission.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyForm @submit="handleSubmit">
		<SelectBtnField
			v-model="value"
			:items="items"
			label="Moyen de contact"
			required
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SelectBtnField, SyForm } from '@cnamts/synapse'

const value = ref(null)

function handleSubmit(e) {
	alert(e.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SelectBtnField, SyForm, VBtn },
		setup() {
			const value = ref<string | null>(null)
			function handleSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
			}
			return { args, value, items, handleSubmit }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<SyForm @submit="handleSubmit">
					<SelectBtnField
						v-model="value"
						:items="items"
						label="Moyen de contact"
						required
					/>
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation Synapse (`customRules`) dans un `VForm` Vuetify, déclenchée via `validateOnSubmit` exposé par le composant.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VForm @submit.prevent="handleSubmit">
		<SelectBtnField
			ref="fieldRef"
			v-model="value"
			:items="items"
			label="Moyen de contact"
			:custom-rules="customRules"
			required
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'

const value = ref(null)
const fieldRef = ref(null)

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (v) => v !== 'sms',
			message: 'Le SMS n’est pas disponible pour ce dossier.',
		},
	},
]

async function handleSubmit() {
	const isValid = await fieldRef.value?.validateOnSubmit()
	alert(isValid ? 'Valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SelectBtnField, VBtn, VForm },
		setup() {
			const value = ref<string | null>(null)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (v: unknown) => v !== 'sms',
						message: 'Le SMS n’est pas disponible pour ce dossier.',
					},
				},
			]
			async function handleSubmit() {
				const isValid = await fieldRef.value?.validateOnSubmit()
				alert(isValid ? 'Valide !' : 'Veuillez corriger les erreurs.')
			}
			return { args, value, items, customRules, fieldRef, handleSubmit }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<VForm @submit.prevent="handleSubmit">
					<SelectBtnField
						ref="fieldRef"
						v-model="value"
						:items="items"
						label="Moyen de contact"
						:custom-rules="customRules"
						required
					/>
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</VForm>
			</div>
		`,
	}),
}

export const SyFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify (`useVuetifyValidation` + `rules`) intégrée automatiquement à un `SyForm`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyForm @submit="handleSubmit">
		<SelectBtnField
			v-model="value"
			:items="items"
			label="Moyen de contact"
			:use-vuetify-validation="true"
			:rules="rules"
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SelectBtnField, SyForm } from '@cnamts/synapse'

const value = ref(null)

const rules = [
	(v) => !!v || 'Le moyen de contact est requis.',
]

function handleSubmit(e) {
	alert(e.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SelectBtnField, SyForm, VBtn },
		setup() {
			const value = ref<string | null>(null)
			const rules = [
				(v: unknown) => !!v || 'Le moyen de contact est requis.',
			]
			function handleSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
			}
			return { args, value, items, rules, handleSubmit }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<SyForm @submit="handleSubmit">
					<SelectBtnField
						v-model="value"
						:items="items"
						label="Moyen de contact"
						:use-vuetify-validation="true"
						:rules="rules"
					/>
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `useVuetifyValidation`, les règles sont des fonctions Vuetify natives `(value) => true | message`.',
			},
		},
		sourceCode: [
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SelectBtnField } from '@cnamts/synapse'

const value = ref(null)

const rules = [
	(v) => !!v || 'Le moyen de contact est requis.',
]
</script>`,
			},
		],
	},
	render: args => ({
		components: { SelectBtnField, VBtn, VForm },
		setup() {
			const value = ref<string | null>(null)
			const rules = [
				(v: unknown) => !!v || 'Le moyen de contact est requis.',
			]
			async function handleSubmit(e: Promise<{ valid: boolean }>) {
				const result = await e
				alert(result.valid ? 'Valide !' : 'Veuillez corriger les erreurs.')
			}
			return { args, value, items, rules, handleSubmit }
		},
		template: `
			<div class="pa-4" style="max-width: 400px">
				<VForm @submit.prevent="handleSubmit">
					<SelectBtnField
						v-model="value"
						:items="items"
						label="Moyen de contact"
						:use-vuetify-validation="true"
						:rules="rules"
						required
					/>
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</VForm>
			</div>
		`,
	}),
}

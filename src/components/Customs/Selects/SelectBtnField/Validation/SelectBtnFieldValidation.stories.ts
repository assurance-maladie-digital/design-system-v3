import type { Meta, StoryObj } from '@storybook/vue3'
import SelectBtnField from '../SelectBtnField.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { VBtn } from 'vuetify/components'
import { ref, watch } from 'vue'

const meta = {
	title: 'Composants/Formulaires/Selects/SelectBtnField/Validation',
	component: SelectBtnField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof SelectBtnField>

export default meta

type Story = StoryObj<typeof meta>

const baseItems = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]

export const DisableErrorHandling: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			required
			disable-error-handling
		/>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SelectBtnField } from '@cnamts/synapse'
import { ref } from 'vue'

const value = ref(null)
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: [
			{ text: 'Email', value: 'email' },
			{ text: 'Courrier', value: 'courrier' },
			{ text: 'SMS', value: 'sms' },
		],
		required: true,
		disableErrorHandling: true,
	},
	render: args => ({
		components: { SelectBtnField },
		setup() {
			const value = ref(args.modelValue)
			return { args, value }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<p class="mb-3 text-body-2">Avec <code>disable-error-handling</code> : la validation est désactivée visuellement. L'item sélectionné reste toujours en couleur <em>primary</em>.</p>
				<SelectBtnField
					v-model="value"
					:items="args.items"
					aria-labelledby="contact-method"
					:required="args.required"
					:disable-error-handling="args.disableErrorHandling"
				/>
			</div>
		`,
	}),
}

export const Erreur: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			:has-error="hasError"
			:error-messages="hasError ? ['Veuillez sélectionner un moyen de contact.'] : []"
		/>
		<VBtn color="primary" class="mt-3" @click="resetExample">Réinitialiser</VBtn>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SelectBtnField } from '@cnamts/synapse'
import { ref, watch } from 'vue'
import { VBtn } from 'vuetify/components'

const value = ref(null)
const hasError = ref(true)
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]

watch(value, (newValue) => {
	if (newValue) hasError.value = false
})

function resetExample() {
	value.value = null
	hasError.value = true
}
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: baseItems,
		hasError: true,
		errorMessages: ['Veuillez sélectionner un moyen de contact.'],
	},
	render: args => ({
		components: { SelectBtnField, VBtn },
		setup() {
			const hasError = ref(args.hasError)
			const value = ref(args.modelValue)

			watch(() => value.value, (newValue) => {
				if (newValue) hasError.value = false
			})

			function resetExample() {
				value.value = null
				hasError.value = true
			}

			return { args, resetExample, hasError, value }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<p class="mb-3 text-body-2">Cas d'usage : erreur pilotée par le parent (ex. retour serveur).<br/>Sélectionner un item pour effacer l'erreur.</p>
				<SelectBtnField
					v-model="value"
					:items="args.items"
					aria-labelledby="contact-method"
					:has-error="hasError"
					:error-messages="hasError ? ['Veuillez sélectionner un moyen de contact.'] : []"
				/>
				<VBtn color="primary" class="mt-3" @click="resetExample">Réinitialiser</VBtn>
			</div>
		`,
	}),
}

export const MessageErreur: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SelectBtnField
			v-model="value"
			:items="items"
			aria-labelledby="contact-method"
			:has-error="hasError"
			:error-messages="errorMessages"
		/>
		<VBtn color="primary" class="mt-3" @click="resetExample">Réinitialiser</VBtn>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SelectBtnField } from '@cnamts/synapse'
import { ref, watch } from 'vue'
import { VBtn } from 'vuetify/components'

const value = ref(null)
const hasError = ref(true)
const errorMessages = ref(['Veuillez sélectionner un moyen de contact.'])
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]

watch(value, (newValue) => {
	if (newValue) {
		hasError.value = false
		errorMessages.value = []
	}
})

function resetExample() {
	value.value = null
	hasError.value = true
	errorMessages.value = ['Veuillez sélectionner un moyen de contact.']
}
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: baseItems,
		hasError: true,
		errorMessages: ['Veuillez sélectionner un moyen de contact.'],
	},
	render: args => ({
		components: { SelectBtnField, VBtn },
		setup() {
			const hasError = ref(args.hasError)
			const value = ref(args.modelValue)
			const errorMessages = ref(args.errorMessages ? [...args.errorMessages] : [])

			watch(() => value.value, (newValue) => {
				if (newValue) {
					hasError.value = false
					errorMessages.value = []
				}
			})

			function resetExample() {
				value.value = null
				hasError.value = true
				errorMessages.value = ['Veuillez sélectionner un moyen de contact.']
			}

			return { args, resetExample, hasError, value, errorMessages }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<p class="mb-3 text-body-2">Cas d'usage : messages d'erreur injectés par le parent (ex. validation serveur).<br/>Sélectionner un item pour effacer l'erreur.</p>
				<SelectBtnField
					v-model="value"
					:items="args.items"
					aria-labelledby="contact-method"
					:has-error="hasError"
					:error-messages="errorMessages"
				/>
				<VBtn color="primary" class="mt-3" @click="resetExample">Réinitialiser</VBtn>
			</div>
		`,
	}),
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SyForm @submit="onSubmit">
			<SelectBtnField
				v-model="value"
				:items="items"
				aria-labelledby="contact-method"
				required
			/>
			<VBtn type="submit" color="primary" class="mt-3">Valider</VBtn>
		</SyForm>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SelectBtnField, SyForm } from '@cnamts/synapse'
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'

const value = ref(null)
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]

function onSubmit({ isValid }: { isValid: boolean }) {
	if (isValid) alert('Formulaire valide !')
}
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: baseItems,
		required: true,
	},
	render: args => ({
		components: { SelectBtnField, SyForm, VBtn },
		setup() {
			const value = ref(args.modelValue)

			function onSubmit({ isValid }: { isValid: boolean }) {
				if (isValid) alert('Formulaire valide !')
			}

			return { args, value, onSubmit }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<p class="mb-3 text-body-2">Cliquez sur "Valider" sans sélection pour déclencher l'erreur requise.</p>
				<SyForm @submit="onSubmit">
					<SelectBtnField
						v-model="value"
						:items="args.items"
						aria-labelledby="contact-method"
						:required="args.required"
					/>
					<VBtn type="submit" color="primary" class="mt-3">Valider</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const ValidationCustomRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SyForm @submit="onSubmit">
			<SelectBtnField
				v-model="value"
				:items="items"
				aria-labelledby="contact-method"
				:custom-rules="customRules"
			/>
			<VBtn type="submit" color="primary" class="mt-3">Valider</VBtn>
		</SyForm>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SelectBtnField, SyForm } from '@cnamts/synapse'
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'

const value = ref(null)
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]
const customRules = [
	{
		type: 'custom',
		options: {
			validate: (val) => val !== 'sms',
			message: 'Le SMS n'est pas disponible dans votre région.',
		},
	},
]

function onSubmit({ isValid }: { isValid: boolean }) {
	if (isValid) alert('Formulaire valide !')
}
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: baseItems,
	},
	render: args => ({
		components: { SelectBtnField, SyForm, VBtn },
		setup() {
			const value = ref(args.modelValue)
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (val: string | number | null) => val !== 'sms',
						message: 'Le SMS n\'est pas disponible dans votre région.',
					},
				},
			]
			function onSubmit({ isValid }: { isValid: boolean }) {
				if (isValid) alert('Formulaire valide !')
			}
			return { args, value, customRules, onSubmit }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<p class="mb-3 text-body-2">Règle bloquante : sélectionner "SMS" génère une erreur et bloque la soumission.</p>
				<SyForm @submit="onSubmit">
					<SelectBtnField
						v-model="value"
						:items="args.items"
						aria-labelledby="contact-method"
						:custom-rules="customRules"
					/>
					<VBtn type="submit" color="primary" class="mt-3">Valider</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const ValidationWithWarnings: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SyForm @submit="onSubmit">
			<SelectBtnField
				v-model="value"
				:items="items"
				aria-labelledby="contact-method"
				:custom-warning-rules="warningRules"
			/>
			<VBtn type="submit" color="primary" class="mt-3">Valider</VBtn>
		</SyForm>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SelectBtnField, SyForm } from '@cnamts/synapse'
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'

const value = ref(null)
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]
const warningRules = [
	{
		type: 'custom',
		options: {
			validate: (val) => val === 'email',
			message: 'Pour une prise de contact rapide, privilégiez Email.',
		},
	},
]

function onSubmit({ isValid }: { isValid: boolean }) {
	if (isValid) alert('Formulaire valide !')
}
</script>`,
			},
		],
	},
	render: () => ({
		components: { SelectBtnField, SyForm, VBtn },
		setup() {
			const value = ref(null)
			const items = baseItems
			const warningRules = [
				{
					type: 'custom',
					options: {
						validate: (val: string | number | null) => val === 'email',
						message: 'Pour une prise de contact rapide, privilégiez Email.',
					},
				},
			]
			function onSubmit({ isValid }: { isValid: boolean }) {
				if (isValid) alert('Formulaire valide !')
			}
			return { value, items, warningRules, onSubmit }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method-warning" class="text-h6">Choisissez votre moyen de contact :</h2>
				<p class="mb-3 text-body-2">Un avertissement (non bloquant) apparaît si vous ne choisissez pas "Email".<br/>Le formulaire peut quand même être soumis.</p>
				<SyForm @submit="onSubmit">
					<SelectBtnField
						v-model="value"
						:items="items"
						aria-labelledby="contact-method-warning"
						:custom-warning-rules="warningRules"
					/>
					<VBtn type="submit" color="primary" class="mt-3">Valider</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const ValidationSuccessRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SyForm @submit="onSubmit">
			<SelectBtnField
				v-model="value"
				:items="items"
				aria-labelledby="contact-method"
				:custom-success-rules="successRules"
				show-success-messages
			/>
			<VBtn type="submit" color="primary" class="mt-3">Valider</VBtn>
		</SyForm>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SelectBtnField, SyForm } from '@cnamts/synapse'
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'

const value = ref(null)
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]
const successRules = [
	{
		type: 'custom',
		options: {
			validate: (val) => val === 'email',
			successMessage: 'Excellent choix ! Vous recevrez une réponse sous 24h.',
		},
	},
]

function onSubmit({ isValid }: { isValid: boolean }) {
	if (isValid) alert('Formulaire valide !')
}
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: baseItems,
		showSuccessMessages: true,
	},
	render: args => ({
		components: { SelectBtnField, SyForm, VBtn },
		setup() {
			const value = ref(args.modelValue)
			const successRules = [
				{
					type: 'custom',
					options: {
						validate: (val: string | number | null) => val === 'email',
						successMessage: 'Excellent choix ! Vous recevrez une réponse sous 24h.',
					},
				},
			]
			function onSubmit({ isValid }: { isValid: boolean }) {
				if (isValid) alert('Formulaire valide !')
			}
			return { args, value, successRules, onSubmit }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<p class="mb-3 text-body-2">Un message de succès apparaît si vous sélectionnez "Email". Non bloquant à la soumission.</p>
				<SyForm @submit="onSubmit">
					<SelectBtnField
						v-model="value"
						:items="args.items"
						aria-labelledby="contact-method"
						:custom-success-rules="successRules"
						:show-success-messages="args.showSuccessMessages"
					/>
					<VBtn type="submit" color="primary" class="mt-3">Valider</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const ValidationInForm: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="max-width: 400px">
		<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
		<SyForm @submit="onSubmit" @reset="value = null">
			<SelectBtnField
				v-model="value"
				:items="items"
				aria-labelledby="contact-method"
				required
			/>
			<div class="d-flex gap-3 mt-3">
				<VBtn type="submit" color="primary">Soumettre</VBtn>
				<VBtn type="reset" variant="outlined">Réinitialiser</VBtn>
			</div>
		</SyForm>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { SelectBtnField, SyForm } from '@cnamts/synapse'
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'

const value = ref(null)
const items = [
	{ text: 'Email', value: 'email' },
	{ text: 'Courrier', value: 'courrier' },
	{ text: 'SMS', value: 'sms' },
]

function onSubmit({ isValid }: { isValid: boolean }) {
	if (isValid) alert('Formulaire soumis avec succès !')
}
</script>`,
			},
		],
	},
	args: {
		modelValue: null,
		items: baseItems,
		required: true,
	},
	render: args => ({
		components: { SelectBtnField, SyForm, VBtn },
		setup() {
			const value = ref(args.modelValue)

			function onSubmit({ isValid }: { isValid: boolean }) {
				if (isValid) alert('Formulaire soumis avec succès !')
			}

			function onReset() {
				value.value = null
			}

			return { args, value, onSubmit, onReset }
		},
		template: `
			<div style="max-width: 400px">
				<h2 id="contact-method" class="text-h6">Choisissez votre moyen de contact :</h2>
				<p class="mb-3 text-body-2">
					Démontre l'intégration dans <strong>SyForm</strong> : la validation se déclenche à la soumission (<code>type="submit"</code>)
					et le reset via <code>type="reset"</code> efface la sélection et l'état de validation.
				</p>
				<SyForm @submit="onSubmit" @reset="onReset">
					<SelectBtnField
						v-model="value"
						:items="args.items"
						aria-labelledby="contact-method"
						:required="args.required"
					/>
					<div class="d-flex ga-3 mt-3">
						<VBtn type="submit" color="primary">Soumettre</VBtn>
						<VBtn type="reset" variant="outlined">Réinitialiser</VBtn>
					</div>
				</SyForm>
			</div>
		`,
	}),
}

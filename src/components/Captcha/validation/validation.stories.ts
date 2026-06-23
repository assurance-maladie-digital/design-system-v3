import type { Meta, StoryObj } from '@storybook/vue3'
import { fn, userEvent, within } from '@storybook/test'
import { ref, watch } from 'vue'
import Captcha from '../Captcha.vue'
import { VBtn, VCard, VForm } from 'vuetify/components'
import SyForm from '../../Customs/SyForm/SyForm.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta: Meta = {
	title: 'Composants/Formulaires/Captcha/Validation',
	component: Captcha,
	argTypes: {
		...getValidationDocumentation('string'),
	},
	parameters: {
		layout: 'centered',
		docs: {
			description: {
				component: 'Exemples de validation pour le composant Captcha.',
			},
		},
		controls: { exclude: ['onUpdate:modelValue', 'onUpdate:type', 'onImageError', 'onAudioError', 'onCreationError'] },
	},
	args: {
		'onUpdate:modelValue': fn(),
		'onUpdate:type': fn(),
		'onImageError': fn(),
		'onAudioError': fn(),
		'onCreationError': fn(),
		'readonly': false,
		'disabled': false,
		'required': false,
		'isValidateOnBlur': true,
		'showSuccessMessages': true,
		'disableErrorHandling': false,
		'customRules': [],
		'customWarningRules': [],
		'customSuccessRules': [],
		'errorMessages': null,
		'warningMessages': null,
		'successMessages': null,
		'hasError': false,
		'hasWarning': false,
		'hasSuccess': false,
		'useVuetifyValidation': false,
		'maxErrors': 1,
		'urlCreate': 'https://free.mockerapi.com/mock/0adac32b-e832-4553-aa7f-0011b7f35f0c',
		'urlGetImage': '/captcha/captcha.png',
		'urlGetAudio': '/captcha/captcha.mp3',
		'type': 'image',
		'modelValue': 'abc',
	},
}

export default meta
type StoryArgs = {
	modelValue?: string
} & Record<string, unknown>

type Story = StoryObj<StoryArgs>

export const WithError: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Validation bloquante via `customRules` (message d\'erreur personnalisé).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<Captcha
	v-model="modelValue"
	required
	:custom-rules="[
		{
			type: 'custom',
			options: {
				validate: (v) => (v as string).length >= 6,
				message: 'Le captcha doit contenir au moins 6 caractères.',
				successMessage: 'Le captcha contient au moins 6 caractères.'
			}
		}
	]"
/>
				`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { Captcha } from '@cnamts/synapse'

const modelValue = ref('ytq')
				`,
			},
		],
	},
	render: (args) => {
		return {
			components: { Captcha, VCard },
			setup() {
				const captchaValue = ref(args.modelValue)
				watch(() => args.modelValue, () => {
					captchaValue.value = args.modelValue
				})

				return { args, captchaValue }
			},
			template: `
				<VCard class="pa-8" max-width="400" min-width="400">
					<Captcha 
						v-bind="args"
						v-model="captchaValue"
					/>
				</VCard>
			`,
		}
	},
	args: {
		modelValue: 'ytq',
		// Validation à la saisie pour que l'état (erreur/succès) se mette à jour
		// immédiatement quand on modifie le champ, sans attendre le blur.
		isValidateOnBlur: false,
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (v: unknown) => {
						return (String(v || '')).length >= 6
					},
					message: 'Le captcha doit contenir au moins 6 caractères.',
					successMessage: 'Le captcha contient au moins 6 caractères.',
				},
			},
		],
	},
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox')
		await userEvent.clear(input)
		await userEvent.type(input, 'ytq')
		input.blur()
	},
}

export const WithWarning: Story = {
	...WithError,
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Validation non bloquante via `customWarningRules` (message d\'avertissement personnalisé).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<Captcha
	v-model="modelValue"
	required
	:custom-warning-rules="[
		{
			type: 'custom',
			options: {
				validate: (v) => (String(v || '')).length >= 6,
				warningMessage: 'Le captcha devrait idéalement contenir au moins 6 caractères.'
			}
		}
]"
/>
				`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { Captcha } from '@cnamts/synapse'

const modelValue = ref('ytq')
				`,
			},
		],
	},
	args: {
		...WithError.args,
		customRules: [],
		customWarningRules: [
			{
				type: 'custom',
				options: {
					validate: (v: unknown) => {
						return (String(v || '')).length >= 6
					},
					warningMessage: 'Le captcha devrait idéalement contenir au moins 6 caractères.',
				},
			},
		],
	},
}

export const WithSuccess: Story = {
	...WithError,
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Validation de succès via `customSuccessRules` (message de succès personnalisé).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<Captcha
	v-model="modelValue"
	required
	:custom-rules="[
		{
			type: 'custom',
			options: {
				validate: (v) => (String(v || '')).length >= 6,
				message: 'Le captcha doit contenir au moins 6 caractères.'
			}
		}
	]"
	:custom-success-rules="[
		{
			type: 'custom',
			options: {
				validate: (v) => (String(v || '')).length >= 6,
				successMessage: 'Le captcha est correctement renseigné.'
			}
		}
]"
/>
				`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { Captcha } from '@cnamts/synapse'

const modelValue = ref('ytqZNq')
				`,
			},
		],
	},
	args: {
		...WithError.args,
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (v: unknown) => (String(v || '')).length >= 6,
					message: 'Le captcha doit contenir au moins 6 caractères.',
				},
			},
		],
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					validate: (v: unknown) => (String(v || '')).length >= 6,
					successMessage: 'Le captcha est correctement renseigné.',
				},
			},
		],
	},
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox')
		await userEvent.clear(input)
		await userEvent.type(input, 'ytqZNq')
		input.blur()
	},
}

export const ValidateOnInput: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Validation déclenchée à chaque frappe via `isValidateOnBlur=false`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<Captcha
	v-model="value"
	required
	:is-validate-on-blur="false"
	:custom-rules="[
		{
			type: 'custom',
			options: {
				validate: (value) => String(value || '').length >= 6,
				message: 'Le captcha doit contenir au moins 6 caractères.'
			}
		},
		{
			type: 'custom',
			options: {
				validate: async (value) => {
					try {
						const r = await verifyCaptcha()
						return r.response.data.message === 'Success'
					}
					catch {
						return false
					}
				},
				message: 'Le captcha est incorrect',
				successMessage: 'Le captcha est correct'
			}
		}
]"
/>
`,
			},
			{
				name: 'Script',
				code: `
import { ref } from 'vue'
import { Captcha } from '@cnamts/synapse'

const value = ref('abc')

const verifyCaptcha = () => {
	// call the API to verify the captcha and return the response
}
`,
			},
		],
	},
	render: (args) => {
		return {
			components: { Captcha, VCard },
			setup() {
				const captchaValue = ref(args.modelValue)
				watch(() => args.modelValue, () => {
					captchaValue.value = args.modelValue
				})
				const verifyCaptcha = () => {
					if (captchaValue.value === 'ytqZNq' || captchaValue.value === '941335') {
						return Promise.resolve({ response: { data: { message: 'Success' } } })
					}
					return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
				}

				return { args, captchaValue, verifyCaptcha }
			},
			template: `
				<VCard class="pa-8" max-width="400" min-width="400">
					<p class="mb-4">La validation se déclenche à chaque modification de la valeur.</p>
					<Captcha
						v-bind="args"
						v-model="captchaValue"
						:is-validate-on-blur="false"
						:custom-rules="[
							{
								type: 'custom',
								options: {
									validate: (value) => String(value || '').length >= 6,
									message: 'Le captcha doit contenir au moins 6 caractères.',
								},
							},
							{
								type: 'custom',
								options: {
									validate: async (value) => {
										try {
											const r = await verifyCaptcha()
											return r.response.data.message === 'Success'
										}
										catch {
											return false
										}
									},
									message: 'Le captcha est incorrect',
									successMessage: 'Le captcha est correct',
								}
							},
						]"
					/>
				</VCard>
			`,
		}
	},
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox')
		await userEvent.clear(input)
		// Saisie de la bonne réponse : la validation se met à jour à chaque frappe
		// (erreur tant que < 6 caractères, puis succès une fois le bon captcha saisi).
		await userEvent.type(input, 'ytqZNq')
	},
}

export const ExternalMessages: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Messages injectés par le parent via `errorMessages`, `warningMessages` et `successMessages`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<VCard class="pa-8" max-width="400">
<Captcha
	v-model="value"
	:error-messages="errorMessages"
	:warning-messages="warningMessages"
	:success-messages="successMessages"
/>
<div class="mt-4 d-flex flex-wrap ga-2">
	<VBtn @click="setError">Simuler une erreur</VBtn>
	<VBtn @click="setWarning">Simuler un avertissement</VBtn>
	<VBtn @click="setSuccess">Simuler un succès</VBtn>
	<VBtn @click="reset">Réinitialiser</VBtn>
</div>
</VCard>
`,
			},
		],
	},
	render: args => ({
		components: { Captcha, VBtn, VCard },
		setup() {
			const captchaValue = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				captchaValue.value = newValue
			})
			const errorMessages = ref<string[] | null>(null)
			const warningMessages = ref<string[] | null>(null)
			const successMessages = ref<string[] | null>(null)

			const verifyCaptcha = () => {
				if (captchaValue.value === 'ytqZNq' || captchaValue.value === '941335') {
					return Promise.resolve({ response: { data: { message: 'Success' } } })
				}
				return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
			}

			function setError() {
				errorMessages.value = ['Ce captcha est déjà utilisé']
				warningMessages.value = null
				successMessages.value = null
			}

			function setWarning() {
				errorMessages.value = null
				warningMessages.value = ['Ce captcha pourrait être plus lisible']
				successMessages.value = null
			}

			function setSuccess() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = ['Captcha accepté']
			}

			function reset() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = null
			}

			return { args, captchaValue, errorMessages, warningMessages, successMessages, verifyCaptcha, setError, setWarning, setSuccess, reset }
		},
		template: `
			<VCard class="pa-8" max-width="400" min-width="400">
				<p class="mb-4">Les messages sont fournis directement par le parent sans déclencher de règle de validation.</p>
				<Captcha
					v-bind="args"
					v-model="captchaValue"
					:error-messages="errorMessages"
					:warning-messages="warningMessages"
					:success-messages="successMessages"
				/>
			</VCard>
			<div class="mt-4 d-flex flex-wrap ga-2">
				<VBtn color="error" @click="setError">Simuler une erreur</VBtn>
				<VBtn color="warning" @click="setWarning">Simuler un avertissement</VBtn>
				<VBtn color="success" @click="setSuccess">Simuler un succès</VBtn>
				<VBtn color="black" @click="reset">Réinitialiser</VBtn>
			</div>
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Désactivation de la gestion des erreurs via `disableErrorHandling`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<Captcha
		v-model="value1"
		required
		:custom-rules="customRules"
	/>

	<Captcha
		v-model="value2"
		required
		disable-error-handling
		:custom-rules="customRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { Captcha } from '@cnamts/synapse'
const value1 = ref('')
const value2 = ref('')

const verifyCaptcha = (captchaValue: string | null) => {
	// Simulate API call to verify captcha
}

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => {
				if (!value || value.trim().length === 0) {
					return false
				}
				return true
			},
			message: 'Ce champ est requis.',
		}
	},
	{
		type: 'custom',
		options: {
			validate: async (value: string) => {
				try {
					const r = await verifyCaptcha(value)
					return r.response.data.message === 'Success'
				}
				catch {
					return false
				}
			},
			message: 'Le captcha est incorrect.',
		}
	},
]
</script>`,
			},
		],
	},
	render: args => ({
		components: { Captcha, VCard },
		setup() {
			const value1 = ref('')
			const value2 = ref('')

			const verifyCaptcha = (captchaValue: string | null) => {
				if (captchaValue === 'ytqZNq' || captchaValue === '941335') {
					return Promise.resolve({ response: { data: { message: 'Success' } } })
				}
				return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
			}

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.trim().length === 0) {
								return false
							}
							return true
						},
						message: 'Ce champ est requis.',
						fieldIdentifier: 'captcha',
					},
				},
				{
					type: 'custom',
					options: {
						validate: async (value: string) => {
							try {
								const r = await verifyCaptcha(value)
								return r.response.data.message === 'Success'
							}
							catch {
								return false
							}
						},
						message: 'Le captcha est incorrect.',
					},
				},
			]

			return { args, value1, value2, customRules }
		},
		template: `
			<div>
				<p class="mb-4">Cette démonstration compare un Captcha standard et un avec <code>disableErrorHandling=true</code>.</p>

				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px; margin-bottom: 16px;">
					<div>
						<p class="text-subtitle-2 mb-2">Validation normale</p>
						<VCard class="pa-8" max-width="400" min-width="400">
							<Captcha
								v-bind="args"
								v-model="value1"
								required
								:custom-rules="customRules"
							/>
						</VCard>
					</div>

					<div>
						<p class="text-subtitle-2 mb-2">Sans gestion d'erreurs</p>
						<VCard class="pa-8" max-width="400" min-width="400">
							<Captcha
								v-bind="args"
								v-model="value2"
								required
								disable-error-handling
								:custom-rules="customRules"
							/>
						</VCard>
					</div>
				</div>

				<div class="mt-4 text-body-2">
					<p>Instructions :</p>
					<ol>
						<li class="ml-4">Cliquez dans un champ puis en dehors pour déclencher la validation</li>
						<li class="ml-4">Le champ de gauche affichera une erreur requise, mais pas celui de droite</li>
					</ol>
				</div>
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Intégration avec `SyForm` pour soumettre un Captcha validé par règles personnalisées.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyForm @submit="handleSubmit">
		<VCard class="pa-8" max-width="400">
			<Captcha
				v-model="value"
				:custom-rules="customRules"
				required
			/>
			<div class="mt-4">
				<VBtn type="submit" color="primary">Valider</VBtn>
			</div>
		</VCard>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { Captcha, SyForm } from '@cnamts/synapse'

const value = ref('')

const verifyCaptcha = () => {
	// Simulate API call to verify captcha
}

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => String(value || '').length >= 6,
			message: 'Le captcha doit contenir au moins 6 caractères.',
			fieldIdentifier: 'captcha',
		},
	},
	{
		type: 'custom',
		options: {
			validate: async (value: string) => {
				try {
					const r = await verifyCaptcha()
					return r.response.data.message === 'Success'
				}
				catch {
					return false
				}
			},
			message: 'Le captcha est incorrect',
			fieldIdentifier: 'captcha',
			successMessage: 'Le captcha est correct',
		},
	},
]

function handleSubmit(e: { isValid: boolean }) {
	alert(e.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { Captcha, VBtn, SyForm },
		setup() {
			const captchaValue = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				captchaValue.value = newValue
			})

			const verifyCaptcha = () => {
				if (captchaValue.value === 'ytqZNq' || captchaValue.value === '941335') {
					return Promise.resolve({ response: { data: { message: 'Success' } } })
				}
				return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
			}

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => String(value || '').length >= 6,
						message: 'Le captcha doit contenir au moins 6 caractères.',
						fieldIdentifier: 'captcha',
					},
				},
				{
					type: 'custom',
					options: {
						validate: async () => {
							try {
								const r = await verifyCaptcha()
								return r.response.data.message === 'Success'
							}
							catch {
								return false
							}
						},
						message: 'Le captcha est incorrect',
						fieldIdentifier: 'captcha',
						successMessage: 'Le captcha est correct',
					},
				},
			]

			function handleSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, captchaValue, customRules, handleSubmit }
		},
		template: `
			<div>
				<p class="mb-4">Il faut privilégier l'utilisation de <code>SyForm</code> pour bénéficier de l'intégration de validation.</p>
				<SyForm @submit="handleSubmit">
					<VCard class="pa-8" max-width="400" min-width="400">
						<Captcha
							v-bind="args"
							v-model="captchaValue"
							:custom-rules="customRules"
							width="400px"
							required
						/>
						<div class="mt-4">
							<VBtn type="submit" color="primary">Valider</VBtn>
						</div>
					</VCard>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Validation déclenchée à la soumission du formulaire via l\'API exposée `validate()` du Captcha.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VForm @submit.prevent="handleSubmit">
		<VCard class="pa-8" max-width="400">
			<Captcha
				ref="captchaRef"
				v-model="value"
				required
				:custom-rules="customRules"
			/>
			<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
		</VCard>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { Captcha } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const captchaRef = ref()

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => String(value || '').length >= 6,
			message: 'Le captcha doit contenir au moins 6 caractères.',
			fieldIdentifier: 'captcha',
		},
	},
	{
		type: 'custom',
		options: {
			validate: async (value: string) => {
				try {
					const r = await verifyCaptcha()
					return r.response.data.message === 'Success'
				}
				catch {
					return false
				}
			},
			message: 'Le captcha est incorrect',
			successMessage: 'Le captcha est correct',
		},
	},
]

async function handleSubmit() {
	if (captchaRef.value) {
		const result = await captchaRef.value.validateOnSubmit()
		alert(result ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
	}
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { Captcha, VBtn, VForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			const captchaRef = ref()

			const verifyCaptcha = () => {
				if (value.value === 'ytqZNq' || value.value === '941335') {
					return Promise.resolve({ response: { data: { message: 'Success' } } })
				}
				return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
			}

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (captchaValue: string) => String(captchaValue || '').length >= 6,
						message: 'Le captcha doit contenir au moins 6 caractères.',
						fieldIdentifier: 'captcha',
					},
				},
				{
					type: 'custom',
					options: {
						validate: async () => {
							try {
								const r = await verifyCaptcha()
								return r.response.data.message === 'Success'
							}
							catch {
								return false
							}
						},
						message: 'Le captcha est incorrect',
						successMessage: 'Le captcha est correct',
						fieldIdentifier: 'captcha',
					},
				},
			]

			async function handleSubmit() {
				if (captchaRef.value) {
					const result = await captchaRef.value.validateOnSubmit()
					alert(result ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
				}
			}

			return { args, value, captchaRef, customRules, handleSubmit }
		},
		template: `
			<div>
				<p class="mb-4">Il faut privilégier l'utilisation du composant SyForm pour déclencher la validation à la soumission.</p>
				<VForm @submit.prevent="handleSubmit">
					<VCard class="pa-8" max-width="400" min-width="400">
						<Captcha
							ref="captchaRef"
							v-bind="args"
							v-model="value"
							:custom-rules="customRules"
							required
							width="400px"
						/>
						<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
					</VCard>
				</VForm>
			</div>
		`,
	}),
}

export const SyFormVuetifyValidation: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Validation native Vuetify (`useVuetifyValidation=true` + `rules`) intégrée automatiquement à un `SyForm`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyForm @submit="handleSubmit">
		<VCard class="pa-8" max-width="400">
			<Captcha
				v-model="value"
				:use-vuetify-validation="true"
				:rules="rules"
				required
			/>
			<div class="mt-4">
				<VBtn type="submit" color="primary">Valider</VBtn>
			</div>
		</VCard>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { Captcha, SyForm } from '@cnamts/synapse'

const value = ref('')

const rules = [
	(value: string) => !!value || 'Ce champ est requis',
	(value: string) => String(value || '').length >= 6 || 'Le captcha doit contenir au moins 6 caractères',
	async () => {
		try {
			const r = await verifyCaptcha()
			return r.response.data.message === 'Success' || 'Le captcha est incorrect'
		}
		catch {
			return 'Le captcha est incorrect'
		}
	},
]

function handleSubmit(e: { isValid: boolean }) {
	alert(e.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { Captcha, VBtn, SyForm },
		setup() {
			const captchaValue = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				captchaValue.value = newValue
			})

			const verifyCaptcha = () => {
				if (captchaValue.value === 'ytqZNq' || captchaValue.value === '941335') {
					return Promise.resolve({ response: { data: { message: 'Success' } } })
				}
				return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
			}

			const rules = [
				(value: string) => !!value || 'Ce champ est requis',
				(value: string) => String(value || '').length >= 6 || 'Le captcha doit contenir au moins 6 caractères',
				async () => {
					try {
						const r = await verifyCaptcha()
						return r.response.data.message === 'Success' || 'Le captcha est incorrect'
					}
					catch {
						return 'Le captcha est incorrect'
					}
				},
			]

			function handleSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, captchaValue, rules, handleSubmit }
		},
		template: `
			<div>
				<p class="mb-4">Validation Vuetify native intégrée au <code>SyForm</code> via <code>useVuetifyValidation</code>.</p>
				<SyForm @submit="handleSubmit">
					<VCard class="pa-8" max-width="400" min-width="400">
						<Captcha
							v-bind="args"
							v-model="captchaValue"
							:use-vuetify-validation="true"
							:rules="rules"
							width="400px"
							required
						/>
						<div class="mt-4">
							<VBtn type="submit" color="primary">Valider</VBtn>
						</div>
					</VCard>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormVuetifyValidation: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: 'Validation de style Vuetify avec `useVuetifyValidation=true` et des règles natives.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VForm @submit.prevent="handleSubmit">
		<VCard class="pa-8" max-width="400">
			<Captcha
				v-model="value"
				:use-vuetify-validation="true"
				:rules="rules"
				required
			/>
			<div class="mt-4">
				<VBtn type="submit" color="primary">Valider</VBtn>
			</div>
		</VCard>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { Captcha } from '@cnamts/synapse'

const value = ref('')

const rules = [
	(value: string) => !!value || 'Ce champ est requis',
	(value: string) => String(value || '').length >= 6 || 'Le captcha doit contenir au moins 6 caractères',
	async () => {
		try {
			const r = await verifyCaptcha()
			return r.response.data.message === 'Success' || 'Le captcha est incorrect'
		}
		catch {
			return 'Le captcha est incorrect'
		}
	},
]

async function handleSubmit(e) {
	alert((await e).valid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { Captcha, VBtn, VForm },
		setup() {
			const captchaValue = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				captchaValue.value = newValue
			})

			const rules = [
				(value: string) => !!value || 'Ce champ est requis',
				(value: string) => String(value || '').length >= 6 || 'Le captcha doit contenir au moins 6 caractères',
				async () => {
					try {
						const r = await verifyCaptcha()
						return r.response.data.message === 'Success' || 'Le captcha est incorrect'
					}
					catch {
						return 'Le captcha est incorrect'
					}
				},
			]

			const verifyCaptcha = () => {
				if (captchaValue.value === 'ytqZNq' || captchaValue.value === '941335') {
					return Promise.resolve({ response: { data: { message: 'Success' } } })
				}
				return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
			}

			async function handleSubmit(e: Promise<{ valid: boolean }>) {
				const result = await e
				alert(result.valid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, captchaValue, rules, handleSubmit }
		},
		template: `
			<div>
				<p class="mb-4">Les règles suivent le contrat Vuetify natif: <code>(value) =&gt; true | 'message'</code>.</p>
				<VForm @submit.prevent="handleSubmit">
					<VCard class="pa-8" max-width="400" min-width="400">
						<Captcha
							v-bind="args"
							v-model="captchaValue"
							:use-vuetify-validation="true"
							:rules="rules"
							width="400px"
						/>
						<div class="mt-4">
							<VBtn type="submit" color="primary">Valider</VBtn>
						</div>
					</VCard>
				</VForm>
			</div>
		`,
	}),
}

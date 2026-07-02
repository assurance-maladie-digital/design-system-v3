import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch, onMounted } from 'vue'
import { VBtn, VForm } from 'vuetify/components'
import { fn } from 'storybook/test'
import LunarCalendar from '../LunarCalendar.vue'
import SyForm from '../../Customs/SyForm/SyForm.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta = {
	title: 'Composants/Formulaires/LunarCalendar/Validation',
	component: LunarCalendar,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `Exemples de validation pour le composant LunarCalendar`,
			},
		},
	},
	argTypes: {
		...getValidationDocumentation('date'),
		modelValue: {
			control: 'text',
			description: 'La valeur du calendrier lunaire au format DD/MM/YYYY',
		},
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
	},
	args: {
		'modelValue': '',
		'label': 'Date de naissance',
		'required': false,
		'errorMessages': null,
		'warningMessages': null,
		'successMessages': null,
		'readonly': false,
		'disabled': false,
		'customRules': [],
		'customWarningRules': [],
		'customSuccessRules': [],
		'isValidateOnBlur': true,
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof LunarCalendar>

export default meta

type Story = StoryObj<typeof meta>

export const WithError: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:min-year="1400"
						:max-year="1500"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('16/08/1550')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '16/08/1550',
		minYear: 1400,
		maxYear: 1500,
	},
	render: args => ({
		components: { LunarCalendar },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<LunarCalendar ref="fieldRef" v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

export const WithWarning: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:custom-warning-rules="customWarningRules"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('01/01/1900')

				const customWarningRules = [
					{
						type: 'custom',
						options: {
							validate: (value: string) => {
								const year = Number(value.split('/')[2])
								return isNaN(year) || year >= 1912
							},
							warningMessage: 'Cette date est antérieure à 1912.',
						},
					},
				]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '01/01/1900',
		customWarningRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const year = Number(value.split('/')[2])
						return isNaN(year) || year >= 1912
					},
					warningMessage: 'Cette date est antérieure à 1912.',
				},
			},
		],
	},
	render: args => ({
		components: { LunarCalendar },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<LunarCalendar ref="fieldRef" v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

export const WithSuccess: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						show-success-messages
						:custom-success-rules="customSuccessRules"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('15/08/1450')

				const customSuccessRules = [
					{
						type: 'custom',
						options: {
							validate: (value: string) => /^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value),
							successMessage: 'Date lunaire valide.',
						},
					},
				]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '15/08/1450',
		showSuccessMessages: true,
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(value),
					successMessage: 'Date lunaire valide.',
				},
			},
		],
	},
	render: args => ({
		components: { LunarCalendar },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<LunarCalendar ref="fieldRef" v-bind="args" v-model="value" show-success-messages />
			</div>
		`,
	}),
}

export const ExternalMessages: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						show-success-messages
						:error-messages="errorMessages"
						:warning-messages="warningMessages"
						:success-messages="successMessages"
					/>
					<div class="mt-4 d-flex flex-wrap ga-2">
						<VBtn color="error" @click="setError">Simuler une erreur</VBtn>
						<VBtn color="warning" @click="setWarning">Simuler un avertissement</VBtn>
						<VBtn color="success" @click="setSuccess">Simuler un succès</VBtn>
						<VBtn color="black" @click="reset">Réinitialiser</VBtn>
					</div>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('15/08/1450')
				const errorMessages = ref<string[] | null>(null)
				const warningMessages = ref<string[] | null>(null)
				const successMessages = ref<string[] | null>(null)

				function setError() {
					errorMessages.value = ['Date non reconnue dans le calendrier lunaire.']
					warningMessages.value = null
					successMessages.value = null
				}
				function setWarning() {
					errorMessages.value = null
					warningMessages.value = ['Cette date correspond à une période incertaine.']
					successMessages.value = null
				}
				function setSuccess() {
					errorMessages.value = null
					warningMessages.value = null
					successMessages.value = ['Date lunaire validée par le serveur.']
				}
				function reset() {
					errorMessages.value = null
					warningMessages.value = null
					successMessages.value = null
				}
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '15/08/1450',
		showSuccessMessages: true,
	},
	render: args => ({
		components: { LunarCalendar, VBtn },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			const errorMessages = ref<string[] | null>(null)
			const warningMessages = ref<string[] | null>(null)
			const successMessages = ref<string[] | null>(null)

			function setError() {
				errorMessages.value = ['Date non reconnue dans le calendrier lunaire.']
				warningMessages.value = null
				successMessages.value = null
			}
			function setWarning() {
				errorMessages.value = null
				warningMessages.value = ['Cette date correspond à une période incertaine.']
				successMessages.value = null
			}
			function setSuccess() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = ['Date lunaire validée par le serveur.']
			}
			function reset() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = null
			}

			return { args, value, errorMessages, warningMessages, successMessages, setError, setWarning, setSuccess, reset }
		},
		template: `
			<div class="pa-4">
				<LunarCalendar
					v-bind="args"
					v-model="value"
					show-success-messages
					:error-messages="errorMessages"
					:warning-messages="warningMessages"
					:success-messages="successMessages"
				/>
				<div class="mt-4 d-flex flex-wrap ga-2">
					<VBtn color="error" @click="setError">Simuler une erreur</VBtn>
					<VBtn color="warning" @click="setWarning">Simuler un avertissement</VBtn>
					<VBtn color="success" @click="setSuccess">Simuler un succès</VBtn>
					<VBtn color="black" @click="reset">Réinitialiser</VBtn>
				</div>
			</div>
		`,
	}),
}

export const WithYearConstraints: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:min-year="1400"
						:max-year="1500"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('16/08/1550')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '16/08/1550',
		minYear: 1400,
		maxYear: 1500,
	},
	render: args => ({
		components: { LunarCalendar },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<LunarCalendar ref="fieldRef" v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

export const WithMinYearOnly: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:min-year="1420"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/12/1445')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '12/12/1445',
		minYear: 1420,
	},
	render: args => ({
		components: { LunarCalendar },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<LunarCalendar ref="fieldRef" v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

export const WithMaxYearOnly: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LunarCalendar
						label="Date de naissance"
						v-model="dateValue"
						:max-year="1450"
					/>
				</template>

				<script setup lang="ts">
				import { ref } from 'vue'

				const dateValue = ref('12/12/1445')
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: '12/12/1445',
		maxYear: 1450,
	},
	render: args => ({
		components: { LunarCalendar },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<LunarCalendar ref="fieldRef" v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <SyForm @submit="handleSubmit">
        <LunarCalendar
            v-model="value"
            label="Date de naissance"
            :custom-rules="customRules"
			required
        />
        <div class="mt-4">
            <VBtn type="submit" color="primary">Valider</VBtn>
        </div>
    </SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { LunarCalendar, SyForm } from '@cnamts/synapse'

const value = ref('')

const customRules = [
    {
        type: 'custom',
        options: {
            validate: (value: string) => {
                if (!value || !/^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value)) {
                    return false
                }
                return true
            },
            message: 'La date doit être au format JJ/MM/AAAA.',
            fieldIdentifier: 'date',
        },
    },
]

function handleSubmit(e) {
    const isValid = e.isValid
    alert(isValid ? 'Date valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
	},
	render: args => ({
		components: { LunarCalendar, VBtn, SyForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
								return false
							}
							return true
						},
						message: 'La date doit être au format JJ/MM/AAAA.',
						fieldIdentifier: 'date',
					},
				},
			]

			function handleSubmit(e: { isValid: boolean }) {
				const isValid = e.isValid
				alert(isValid ? 'Date valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, value, customRules, handleSubmit }
		},
		template: `
			<div>
				<SyForm @submit="handleSubmit">
					<LunarCalendar
						v-bind="args"
						v-model="value"
						label="Date de naissance"
						:custom-rules="customRules"
						required
					/>
					<div class="mt-4">
						<VBtn type="submit" color="primary">Valider</VBtn>
					</div>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VForm @submit.prevent="handleSubmit">
		<LunarCalendar
			ref="lunarRef"
			v-model="value"
			label="Date de naissance"
			:custom-rules="[
				{
					type: 'custom',
					options: {
						validate: (value) => !!value && /^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value),
						message: 'La date doit être au format JJ/MM/AAAA.',
						fieldIdentifier: 'date',
					},
				},
			]"
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
import { LunarCalendar } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const lunarRef = ref()

async function handleSubmit() {
	if (lunarRef.value) {
		const result = await lunarRef.value.validateOnSubmit()
		alert(result ? 'Date valide !' : 'Veuillez corriger les erreurs.')
	}
}
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
	},
	render: args => ({
		components: { LunarCalendar, VBtn, VForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			const lunarRef = ref()

			async function handleSubmit() {
				if (lunarRef.value) {
					const result = await lunarRef.value.validateOnSubmit()
					alert(result ? 'Date valide !' : 'Veuillez corriger les erreurs.')
				}
			}

			return { args, value, lunarRef, handleSubmit }
		},
		template: `
			<div>
				<p>Il faut privilégier l'utilisation de <code>SyForm</code> pour bénéficier de l'intégration native.</p>
				<VForm @submit.prevent="handleSubmit">
					<LunarCalendar
						v-bind="args"
						ref="lunarRef"
						v-model="value"
						label="Date de naissance"
						:custom-rules="[
							{
								type: 'custom',
								options: {
									validate: (value) => !!value && /^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value),
									message: 'La date doit être au format JJ/MM/AAAA.',
									fieldIdentifier: 'date',
								},
							},
						]"
						required
					/>
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</VForm>
			</div>
		`,
	}),
}

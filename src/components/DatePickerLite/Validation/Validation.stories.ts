import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { ref } from 'vue'
import { VBtn, VForm } from 'vuetify/components'
import DatePickerLite from '../DatePickerLite.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import { parseDate } from '@/composables/date/useDateFormatDayjs'
import type { DatePickerLiteProps } from '../types'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

type DatePickerLiteStoryProps = DatePickerLiteProps & {
	'onUpdate:modelValue'?: (value: Date | undefined) => void
	'onUpdate:open'?: (value: boolean) => void
}

const requiredCompleteDateRule = (value: unknown) => {
	if (!value) return 'La date est requise.'
	return typeof value === 'string' && parseDate(value, 'DD/MM/YYYY')
		? true
		: 'La date doit être au format JJ/MM/AAAA.'
}

const meta: Meta<DatePickerLiteStoryProps> = {
	title: 'Composants/Formulaires/DatePickerLite/Validation',
	component: DatePickerLite,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Exemples de validation pour le composant DatePickerLite.',
			},
		},
	},
	argTypes: {
		...getValidationDocumentation('base'),
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lorsqu’une date est sélectionnée, saisie ou effacée.',
			table: {
				type: { summary: 'Date | undefined' },
			},
		},
		'onUpdate:open': {
			action: 'update:open',
			description: 'Événement émis lors de l’ouverture ou de la fermeture du sélecteur.',
			table: {
				type: { summary: 'boolean' },
			},
		},
	},
	args: {
		'label': 'Date de début',
		'modelValue': new Date(2025, 10, 11),
		'useVuetifyValidation': true,
		'rules': [requiredCompleteDateRule],
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
	},
}

export default meta
type Story = StoryObj<typeof meta>

export const WithError: Story = {
	args: {
		errorMessages: ['La date de début ne peut pas être postérieure à la date de fin.'],
	},
	parameters: {
		sourceCode: [{
			name: 'Template',
			code: `<DatePickerLite v-model="selectedDate" label="Date de début" :error-messages="['La date de début ne peut pas être postérieure à la date de fin.']" />`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()`,
		}],
	},
}

export const WithWarning: Story = {
	args: {
		warningMessages: ['Cette date est inhabituelle, veuillez la vérifier.'],
	},
	parameters: {
		sourceCode: [{
			name: 'Template',
			code: `<DatePickerLite v-model="selectedDate" label="Date de début" :warning-messages="['Cette date est inhabituelle, veuillez la vérifier.']" />`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()`,
		}],
	},
}

export const WithSuccess: Story = {
	args: {
		showSuccessMessages: true,
		successMessages: ['La date est valide.'],
	},
	parameters: {
		sourceCode: [{
			name: 'Template',
			code: `<DatePickerLite v-model="selectedDate" label="Date de début" show-success-messages :success-messages="['La date est valide.']" />`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()`,
		}],
	},
}

export const DisableErrorHandling: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Compare un champ requis standard avec un champ dont la gestion interne des erreurs est désactivée.',
			},
		},
		sourceCode: [{
			name: 'Template',
			code: `<DatePickerLite v-model="selectedDate" label="Avec validation interne" required />\n<DatePickerLite v-model="selectedDate" label="Validation interne désactivée" required disable-error-handling />`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()`,
		}],
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const value = ref<Date | undefined>()
			const updateValue = (nextValue: Date | undefined) => {
				value.value = nextValue
				args['onUpdate:modelValue']?.(nextValue)
			}
			return { args, value, updateValue }
		},
		template: `
			<div class="d-flex flex-column" style="gap: 16px;">
				<DatePickerLite v-bind="args" :model-value="value" label="Avec validation interne" required @update:model-value="updateValue" />
				<DatePickerLite v-bind="args" :model-value="value" label="Validation interne désactivée" required disable-error-handling @update:model-value="updateValue" />
			</div>
		`,
	}),
}

export const CustomRules: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une règle Synapse interdit les dates antérieures au 1er janvier 2025.',
			},
		},
		sourceCode: [{
			name: 'Template',
			code: `<DatePickerLite v-model="selectedDate" label="Date de début" :custom-rules="customRules" />`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()\nconst customRules = [{\n\ttype: 'custom' as const,\n\toptions: {\n\t\tvalidate: (value: string | undefined) => !value || (/^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value) && new Date(value.split('/').reverse().join('-')) >= new Date(2025, 0, 1)),\n\t\tmessage: 'La date doit être postérieure au 1er janvier 2025.',\n\t},\n}]`,
		}],
	},
	render: args => ({
		components: { DatePickerLite },
		setup() {
			const value = ref<Date | undefined>()
			const customRules = [{
				type: 'custom' as const,
				options: {
					validate: (value: string | undefined) => !value || (/^\d{2}\/\d{2}\/\d{4}$/.test(value) && new Date(value.split('/').reverse().join('-')) >= new Date(2025, 0, 1)),
					message: 'La date doit être postérieure au 1er janvier 2025.',
				},
			}]
			const updateValue = (nextValue: Date | undefined) => {
				value.value = nextValue
				args['onUpdate:modelValue']?.(nextValue)
			}
			return { args, customRules, value, updateValue }
		},
		template: `
			<DatePickerLite
				v-bind="args"
				:model-value="value"
				label="Date de début"
				use-vuetify-validation="false"
				:custom-rules="customRules"
				@update:model-value="updateValue"
			/>
		`,
	}),
}

export const NoValidateOnBlur: Story = {
	args: {
		label: 'Date de début',
		required: true,
		isValidateOnBlur: false,
	},
	parameters: {
		docs: {
			description: {
				story: 'Avec `isValidateOnBlur: false`, la validation est déclenchée dès la modification de la valeur.',
			},
		},
		sourceCode: [{
			name: 'Template',
			code: `<DatePickerLite v-model="selectedDate" label="Date de début" required :is-validate-on-blur="false" />`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()`,
		}],
	},
}

export const SyFormValidation: Story = {
	parameters: {
		sourceCode: [{
			name: 'Template',
			code: `<SyForm @submit="onSubmit">\n\t<DatePickerLite v-model="selectedDate" label="Date de début" required display-asterisk />\n\t<VBtn type="submit">Soumettre</VBtn>\n\t<p v-if="result">{{ result }}</p>\n</SyForm>`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite, SyForm } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()\nconst result = ref('')\nconst onSubmit = ({ isValid }: { isValid: boolean }) => {\n\tresult.value = isValid ? 'Formulaire valide.' : 'Formulaire invalide.'\n}`,
		}],
	},
	render: args => ({
		components: { DatePickerLite, SyForm, VBtn },
		setup() {
			const value = ref<Date | undefined>()
			const result = ref('')
			const updateValue = (nextValue: Date | undefined) => {
				value.value = nextValue
				args['onUpdate:modelValue']?.(nextValue)
			}
			const onSubmit = ({ isValid }: { isValid: boolean }) => {
				result.value = isValid ? 'Formulaire valide.' : 'Formulaire invalide.'
			}
			return { args, value, result, updateValue, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<DatePickerLite v-bind="args" :model-value="value" label="Date de début" required display-asterisk @update:model-value="updateValue" />
				<VBtn class="mt-4" color="primary" type="submit">Soumettre</VBtn>
				<p v-if="result" class="mt-2">{{ result }}</p>
			</SyForm>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		sourceCode: [{
			name: 'Template',
			code: `<VForm @submit.prevent="onSubmit">\n\t<DatePickerLite ref="datePicker" v-model="selectedDate" label="Date de début" required display-asterisk />\n\t<VBtn type="submit">Soumettre</VBtn>\n\t<p v-if="result">{{ result }}</p>\n</VForm>`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()\nconst datePicker = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)\nconst result = ref('')\nconst onSubmit = async () => {\n\tresult.value = await datePicker.value?.validateOnSubmit() ? 'Formulaire valide.' : 'Formulaire invalide.'\n}`,
		}],
	},
	render: args => ({
		components: { DatePickerLite, VBtn, VForm },
		setup() {
			const value = ref<Date | undefined>()
			const datePicker = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const result = ref('')
			const updateValue = (nextValue: Date | undefined) => {
				value.value = nextValue
				args['onUpdate:modelValue']?.(nextValue)
			}
			const onSubmit = async () => {
				result.value = await datePicker.value?.validateOnSubmit() ? 'Formulaire valide.' : 'Formulaire invalide.'
			}
			return { args, value, datePicker, result, updateValue, onSubmit }
		},
		template: `
			<VForm @submit.prevent="onSubmit">
				<DatePickerLite ref="datePicker" v-bind="args" :model-value="value" label="Date de début" required display-asterisk @update:model-value="updateValue" />
				<VBtn class="mt-4" color="primary" type="submit">Soumettre</VBtn>
				<p v-if="result" class="mt-2">{{ result }}</p>
			</VForm>
		`,
	}),
}

export const SyFormVuetifyValidation: Story = {
	parameters: {
		sourceCode: [{
			name: 'Template',
			code: `<SyForm @submit="onSubmit">\n\t<DatePickerLite v-model="selectedDate" label="Date de début" />\n\t<VBtn type="submit">Soumettre</VBtn>\n\t<p v-if="result">{{ result }}</p>\n</SyForm>`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite, SyForm } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()\nconst result = ref('')\nconst onSubmit = ({ isValid }: { isValid: boolean }) => {\n\tresult.value = isValid ? 'Formulaire valide.' : 'Formulaire invalide.'\n}`,
		}],
	},
	render: args => ({
		components: { DatePickerLite, SyForm, VBtn },
		setup() {
			const value = ref<Date | undefined>()
			const result = ref('')
			const updateValue = (nextValue: Date | undefined) => {
				value.value = nextValue
				args['onUpdate:modelValue']?.(nextValue)
			}
			const onSubmit = ({ isValid }: { isValid: boolean }) => {
				result.value = isValid ? 'Formulaire valide.' : 'Formulaire invalide.'
			}
			return { args, value, result, updateValue, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<DatePickerLite v-bind="args" :model-value="value" label="Date de début" @update:model-value="updateValue" />
				<VBtn class="mt-4" color="primary" type="submit">Soumettre</VBtn>
				<p v-if="result" class="mt-2">{{ result }}</p>
			</SyForm>
		`,
	}),
}

export const VFormAndVuetifyValidation: Story = {
	parameters: {
		sourceCode: [{
			name: 'Template',
			code: `<VForm ref="form" @submit.prevent="onSubmit">\n\t<DatePickerLite v-model="selectedDate" label="Date de début" />\n\t<VBtn type="submit">Soumettre</VBtn>\n\t<p v-if="result">{{ result }}</p>\n</VForm>`,
		}, {
			name: 'Script',
			code: `import { DatePickerLite } from '@cnamts/synapse'\nimport { ref } from 'vue'\n\nconst selectedDate = ref<Date | undefined>()\nconst form = ref<InstanceType<typeof VForm> | null>(null)\nconst result = ref('')\nconst onSubmit = async () => {\n\tconst validation = await form.value?.validate()\n\tresult.value = validation?.valid ? 'Formulaire valide.' : 'Formulaire invalide.'\n}`,
		}],
	},
	render: args => ({
		components: { DatePickerLite, VBtn, VForm },
		setup() {
			const value = ref<Date | undefined>()
			const form = ref<InstanceType<typeof VForm> | null>(null)
			const result = ref('')
			const updateValue = (nextValue: Date | undefined) => {
				value.value = nextValue
				args['onUpdate:modelValue']?.(nextValue)
			}
			const onSubmit = async () => {
				const validation = await form.value?.validate()
				result.value = validation?.valid ? 'Formulaire valide.' : 'Formulaire invalide.'
			}
			return { args, value, form, result, updateValue, onSubmit }
		},
		template: `
			<VForm ref="form" @submit.prevent="onSubmit">
				<DatePickerLite v-bind="args" :model-value="value" label="Date de début" @update:model-value="updateValue" />
				<VBtn class="mt-4" color="primary" type="submit">Soumettre</VBtn>
				<p v-if="result" class="mt-2">{{ result }}</p>
			</VForm>
		`,
	}),
}

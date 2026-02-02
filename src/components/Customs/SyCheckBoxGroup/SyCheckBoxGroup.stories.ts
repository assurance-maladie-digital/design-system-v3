import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { VBtn } from 'vuetify/components'

const meta: Meta<typeof SyCheckBoxGroup> = {
	title: 'Composants/Formulaires/SyCheckBoxGroup',
	component: SyCheckBoxGroup,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'SyCheckBoxGroup est un composant de groupe de cases à cocher basé sur SyCheckbox.',
			},
		},
	},
	argTypes: {
		'modelValue': { control: false },
		'onUpdate:modelValue': { action: 'update:modelValue' },
		'onChange': { action: 'change' },
		'label': { control: 'text' },
		'displayAsterisk': { control: 'boolean' },
		'disabled': { control: 'boolean' },
		'readonly': { control: 'boolean' },
		'required': { control: 'boolean' },
		'multiple': { control: 'boolean' },
		'hideDetails': { control: 'boolean' },
		'density': {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
		},
		'options': { control: 'object' },
	},
}

export default meta

type Story = StoryObj<typeof meta>

const baseOptions = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

export const Default: Story = {
	args: {
		label: 'Choisissez une ou plusieurs options',
		options: baseOptions,
		multiple: false,
		required: false,
	},
	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const value = ref<string | null>(null)
			return { args, value }
		},
		template: '<SyCheckBoxGroup v-model="value" v-bind="args" />',
	}),
}

export const Disabled: Story = {
	args: {
		label: 'Groupe désactivé',
		disabled: true,
		options: baseOptions,
		multiple: false,
	},
	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const value = ref<string | null>('a')
			return { args, value }
		},
		template: '<SyCheckBoxGroup v-model="value" v-bind="args" />',
	}),
}

export const Required: Story = {
	args: {
		label: 'Choisissez une option (obligatoire)',
		required: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
		multiple: false,
		id: 'sy-checkbox-group-required',
		isValidateOnBlur: false,
	},
	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const value = ref<string | null>(null)
			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide !')
				}
			}
			return { args, value, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<SyCheckBoxGroup v-model="value" v-bind="args" />
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

export const Multiple: Story = {
	args: {
		label: 'Choisissez plusieurs options',
		options: baseOptions,
		multiple: true,
		required: false,
	},
	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const value = ref<Array<string>>(['a'])
			return { args, value }
		},
		template: '<SyCheckBoxGroup v-model="value" v-bind="args" />',
	}),
}

export const MultipleRequired: Story = {
	args: {
		label: 'Choisissez au moins une option (multiple requis)',
		options: baseOptions,
		multiple: true,
		required: true,
		id: 'sy-checkbox-group-multiple-required',
		isValidateOnBlur: false,
	},
	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const value = ref<Array<string>>([])
			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide !')
				}
			}
			return { args, value, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<SyCheckBoxGroup v-model="value" v-bind="args" />
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

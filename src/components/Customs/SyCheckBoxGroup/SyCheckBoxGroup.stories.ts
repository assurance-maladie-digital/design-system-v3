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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<SyCheckBoxGroup
						v-model="value"
						label="Choisissez une option"
						:options="options"
					/>
					<div class="mt-2">Sélection : {{ value }}</div>
				`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
					import { ref } from 'vue'
					import { SyCheckBoxGroup } from '@cnamts/synapse'

					const value = ref<string | null>(null)
					const options = [
						{ label: 'Option A', value: 'a' },
						{ label: 'Option B', value: 'b' },
						{ label: 'Option C', value: 'c' },
					]
					</script>
				`,
			},
		],
	},
	args: {
		label: 'Choisissez une option',
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
		template: `
			<div>
				<SyCheckBoxGroup v-model="value" v-bind="args" />
				<div class="mt-2">Sélection : {{ value }}</div>
			</div>
		`,
	}),
}

export const Disabled: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<SyCheckBoxGroup
						v-model="value"
						label="CheckBoxGroup désactivé"
						:options="options"
						disabled
						hide-details
					/>
					<div class="mt-2">Sélection : {{ value }}</div>
				`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
					import { ref } from 'vue'
					import { SyCheckBoxGroup } from '@cnamts/synapse'

					const value = ref<string | null>('a')
					const options = [
						{ label: 'Option A', value: 'a' },
						{ label: 'Option B', value: 'b' },
						{ label: 'Option C', value: 'c' },
					]
					</script>
				`,
			},
		],
	},
	args: {
		label: 'CheckBoxGroup désactivé',
		disabled: true,
		options: baseOptions,
		multiple: false,
		hideDetails: true,
	},
	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const value = ref<string | null>('a')
			return { args, value }
		},
		template: `
			<div>
				<SyCheckBoxGroup v-model="value" v-bind="args" />
				<div class="mt-2">Sélection : {{ value }}</div>
			</div>
		`,
	}),
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<SyForm ref="form" @submit="onSubmit">
						<SyCheckBoxGroup
							v-model="value"
							label="Choisissez une option (obligatoire)"
							:options="options"
							required
							:is-validate-on-blur="false"
							id="sy-checkbox-group-required"
						/>
						<div class="mt-2">Sélection : {{ value }}</div>
						<VBtn type="submit" class="mt-4" color="primary">Valider</VBtn>
					</SyForm>
				`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
					import { ref } from 'vue'
					import { VBtn } from 'vuetify/components'
					import { SyForm, SyCheckBoxGroup } from '@cnamts/synapse'

					const value = ref<string | null>(null)
					const options = [
						{ label: 'Option A', value: 'a' },
						{ label: 'Option B', value: 'b' },
					]

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
			<SyForm ref="form" @submit="onSubmit">
				<SyCheckBoxGroup v-model="value" required v-bind="args" />
				<div class="mt-2">Sélection : {{ value }}</div>
				<VBtn type="submit" class="mt-4" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

export const Multiple: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<SyCheckBoxGroup
						v-model="values"
						label="Choisissez plusieurs options"
						:options="options"
						multiple
					/>
					<div class="mt-2">Sélection : {{ values }}</div>
				`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
					import { ref } from 'vue'
					import { SyCheckBoxGroup } from '@cnamts/synapse'

					const values = ref<Array<string>>([])
					const options = [
						{ label: 'Option A', value: 'a' },
						{ label: 'Option B', value: 'b' },
						{ label: 'Option C', value: 'c' },
					]
					</script>
				`,
			},
		],
	},
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
		template: `
			<div>
				<SyCheckBoxGroup v-model="value" v-bind="args" />
				<div class="mt-2">Sélection : {{ value }}</div>
			</div>
		`,
	}),
}

export const MultipleRequired: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<SyForm ref="form" @submit="onSubmit">
						<SyCheckBoxGroup
							v-model="values"
							label="Choisissez au moins une option"
							:options="options"
							multiple
							required
							:custom-rules="customRules"
							:is-validate-on-blur="false"
							id="sy-checkbox-group-multiple-required"
						/>
						<div class="mt-2">Sélection : {{ values }}</div>
						<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
					</SyForm>
				`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
					import { ref } from 'vue'
					import { VBtn } from 'vuetify/components'
					import { SyForm, SyCheckBoxGroup } from '@cnamts/synapse'

					const values = ref<Array<string>>([])
					const options = [
						{ label: 'Option A', value: 'a' },
						{ label: 'Option B', value: 'b' },
						{ label: 'Option C', value: 'c' },
					]

					const customRules = [
						{
							type: 'custom',
							options: {
								message: 'Veuillez sélectionner au moins 2 options.',
								validate: (value: Array<string>) => Array.isArray(value) && value.length >= 2,
							},
						},
					]

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
	args: {
		label: 'Choisissez au moins une option (multiple requis)',
		options: baseOptions,
		multiple: true,
		required: true,
		customRules: [
			{
				type: 'custom',
				options: {
					message: 'Veuillez sélectionner au moins 2 options.',
					validate: (value: Array<string>) => Array.isArray(value) && value.length >= 2,
				},
			},
		],
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
			<SyForm ref="form" @submit="onSubmit">
				<SyCheckBoxGroup v-model="value" required v-bind="args" />
				<div class="mt-2">Sélection : {{ value }}</div>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

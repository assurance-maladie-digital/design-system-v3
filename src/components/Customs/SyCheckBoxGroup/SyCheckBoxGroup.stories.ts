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

export const ListModel: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<SyCheckBoxGroup
						v-model="selected"
						label="v-model comme une liste (tableau)"
						:options="options"
						multiple
						hide-details
					/>
					<div class="mt-2">Sélection : {{ selected }}</div>
				`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
					import { ref } from 'vue'
					import { SyCheckBoxGroup } from '@cnamts/synapse'

					const selected = ref<Array<string>>(['a'])
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
		label: 'v-model comme une liste (tableau)',
		options: baseOptions,
		multiple: true,
		required: false,
		hideDetails: true,
	},
	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const selected = ref<Array<string>>(['a'])
			return { args, selected }
		},
		template: `
			<div>
				<SyCheckBoxGroup v-model="selected" v-bind="args" />
				<div class="mt-2">Sélection : {{ selected }}</div>
			</div>
		`,
	}),
}

export const FormValidation: Story = {
	args: {
		label: 'Choisissez une option (obligatoire)',
		required: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
		multiple: false,
		id: 'sy-checkbox-group-form-validation',
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
							id="sy-checkbox-group-form-validation"
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
}

export const CustomColors: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<div>
						<SyCheckBoxGroup
							v-model="value1"
							color="primary"
							label="Couleur primaire (par défaut)"
							:options="options"
							:show-success-messages="false"
						/>
						<SyCheckBoxGroup
							v-model="value2"
							color="secondary"
							label="Couleur secondaire"
							:options="options"
							:show-success-messages="false"
						/>
						<SyCheckBoxGroup
							v-model="value3"
							color="onSuccessVariant"
							label="Couleur succès"
							:options="options"
							:show-success-messages="false"
						/>
						<SyCheckBoxGroup
							v-model="value4"
							color="error"
							label="Couleur erreur"
							:options="options"
							:show-success-messages="false"
						/>
						<SyCheckBoxGroup
							v-model="value5"
							color="onWarningVariant"
							label="Couleur avertissement"
							:options="options"
							:show-success-messages="false"
						/>
					</div>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'

const value1 = ref<string | null>('a')
const value2 = ref<string | null>('a')
const value3 = ref<string | null>('a')
const value4 = ref<string | null>('a')
const value5 = ref<string | null>('a')

const options = [
	{ label: 'Value 1', value: 'a' },
	{ label: 'Value 2', value: 'b' },
]
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Couleurs personnalisées
Le composant SyCheckBoxGroup peut être personnalisé avec différentes couleurs pour s'adapter à votre thème.
				`,
			},
		},
	},
	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const options = [
				{ label: 'Value 1', value: 'a' },
				{ label: 'Value 2', value: 'b' },
			]
			const value1 = ref<string | null>('a')
			const value2 = ref<string | null>('a')
			const value3 = ref<string | null>('a')
			const value4 = ref<string | null>('a')
			const value5 = ref<string | null>('a')
			return { args, options, value1, value2, value3, value4, value5 }
		},
		template: `
			<div>
              <SyCheckBoxGroup v-model="value1" color="primary" label="Couleur primaire (par défaut)"
                               :options="options" :show-success-messages="false"
              />
              <SyCheckBoxGroup v-model="value2" color="secondary" label="Couleur secondaire" :options="options"
                               :show-success-messages="false"
              />
              <SyCheckBoxGroup v-model="value3" color="onSuccessVariant" label="Couleur succès" :options="options"
                               :show-success-messages="false"
              />
              <SyCheckBoxGroup v-model="value4" color="error" label="Couleur erreur" :options="options"
                               :show-success-messages="false"
              />
              <SyCheckBoxGroup v-model="value5" color="onWarningVariant" label="Couleur avertissement"
                               :options="options"
                               :show-success-messages="false"
              />
			</div>
		`,
	}),
}

export const DifferentDensities: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<div>
						<SyCheckBoxGroup
							v-model="val1"
							density="default"
							label="Default density"
							:options="options"
							:show-success-messages="false"
						/>
						<SyCheckBoxGroup
							v-model="val2"
							density="comfortable"
							label="Comfortable"
							:options="options"
							:show-success-messages="false"
						/>
						<SyCheckBoxGroup
							v-model="val3"
							density="compact"
							label="Compact"
							:options="options"
							:show-success-messages="false"
						/>
					</div>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'

const val1 = ref<string | null>(null)
const val2 = ref<string | null>(null)
const val3 = ref<string | null>(null)

const options = [
	{ label: 'Value 1', value: 'a' },
	{ label: 'Value 2', value: 'b' },
]
</script>`,
			},
		],
		docs: {
			description: {
				story: `
### Différentes densités
Le composant SyCheckBoxGroup prend en charge différentes densités pour s'adapter à différents contextes d'interface utilisateur.
				`,
			},
		},
	},
	render: () => ({
		components: { SyCheckBoxGroup },
		setup() {
			const val1 = ref<string | null>(null)
			const val2 = ref<string | null>(null)
			const val3 = ref<string | null>(null)
			const options = [
				{ label: 'Value 1', value: 'a' },
				{ label: 'Value 2', value: 'b' },
			]
			return { val1, val2, val3, options }
		},
		template: `
			<div>
				<SyCheckBoxGroup v-model="val1" density="default" label="Default density" :options="options" :show-success-messages="false" />
				<SyCheckBoxGroup v-model="val2" density="comfortable" label="Comfortable" :options="options" :show-success-messages="false" />
				<SyCheckBoxGroup v-model="val3" density="compact" label="Compact" :options="options" :show-success-messages="false" />
			</div>
		`,
	}),
}

export const Readonly: Story = {
	args: {
		readonly: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
			{ label: 'Option C', value: 'c' },
		],
	},
	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const value = ref<string | null>('a')
			return { args, value }
		},
		template: `
			<div>
				<SyCheckBoxGroup v-model="value" v-bind="args" label="CheckBoxGroup en lecture seule" />
				<div class="mt-2">Sélection : {{ value }}</div>
			</div>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<SyCheckBoxGroup
						v-model="value"
						label="CheckBoxGroup en lecture seule"
						:options="options"
						readonly
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
}

export const CustomRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<SyCheckBoxGroup
							v-model="selected"
							:options="options"
							label="Options"
							:custom-warning-rules="warningRules"
							:custom-success-rules="successRules"
							:is-validate-on-blur="false"
						/>
					</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'

const selected = ref<string | null>('A')

const options = [
	{ label: 'Option A', value: 'A' },
	{ label: 'Option B', value: 'B' },
]

const warningRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string | null) => {
				if (value !== 'A') {
					return 'Vous devez sélectionner l’option A'
				}
				return true
			},
			fieldIdentifier: 'option',
		},
	},
]

const successRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string | null) => value === 'A',
			successMessage: 'Option A sélectionnée',
			fieldIdentifier: 'option',
		},
	},
]
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const selected = ref<string | null>('A')
			const options = [
				{ label: 'Option A', value: 'A' },
				{ label: 'Option B', value: 'B' },
			]
			const warningRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string | null) => {
							if (value !== 'A') {
								return 'Vous devez sélectionner l’option A'
							}
							return true
						},
					},
				},
			]
			const successRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string | null) => value === 'A',
						successMessage: 'Option A sélectionnée',
					},
				},
			]
			return { args, selected, options, warningRules, successRules }
		},
		template: `
			<SyCheckBoxGroup
				v-model="selected"
				label="Options"
				:options="options"
				:custom-warning-rules="warningRules"
				:custom-success-rules="successRules"
				:is-validate-on-blur="false"
			/>
		`,
	}),
}

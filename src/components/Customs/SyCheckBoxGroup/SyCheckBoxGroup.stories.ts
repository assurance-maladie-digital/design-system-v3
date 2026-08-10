import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import SyCheckBoxGroup from './SyCheckBoxGroup.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { VBtn } from 'vuetify/components'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import type { SyCheckBoxGroupProps } from './types'

const meta: Meta<SyCheckBoxGroupProps> = {
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
				component: `
SyCheckBoxGroup est un composant de groupe de cases à cocher.
Il permet de choisir **une ou plusieurs valeurs** parmi une liste d'options.
			`,
			},
		},
	},
	argTypes: {
		...getValidationDocumentation(),
		locales: {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (libellés et messages de validation). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant. La prop accepte un objet partiel : seules les clés renseignées surchargent les valeurs par défaut, le reste est conservé.',
			control: 'object',
			table: {
				type: { summary: 'object', detail: `{
	requiredField: (label: string) => string,
	labelledbyMessage: string,
	optionLabel: (value: unknown) => string,
}` },
				category: 'props',
			},
		},
		modelValue: { control: false },
		helpText: {
			description: 'Texte d\'aide affiché sous le groupe (disparaît en cas de message de validation)',
			control: 'text',
		},
		label: {
			description: 'Label du groupe',
			control: 'text',
		},
		options: {
			description: 'Liste des options du checkbox-group',
			control: 'object',
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
			description: 'Couleur du groupe',
		},
		density: {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Densité du groupe',
		},
		displayAsterisk: {
			description: 'Affiche un astérisque pour les champs requis',
			control: 'boolean',
		},
		multiple: {
			description: 'Permet la sélection multiple (tableau)',
			control: 'boolean',
		},
		ariaLabel: {
			description: 'Label ARIA pour les lecteurs d\'écran',
			control: 'text',
		},
		ariaLabelledby: {
			description: 'ID d\'un élément qui labelise le groupe',
			control: 'text',
		},
		title: {
			description: 'Attribut title du groupe',
			control: 'text',
		},
		name: {
			description: 'Nom du groupe (attribut name)',
			control: 'text',
		},
	},
}

export default meta

type Story = StoryObj<SyCheckBoxGroupProps>

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

export const RequiredWithAsterisk: Story = {
	args: {
		label: 'Champ obligatoire',
		required: true,
		displayAsterisk: true,
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
		multiple: false,
	},

	parameters: {
		docs: {
			description: {
				story: `
### Affichage de l'astérisque
Ce story démontre l'affichage d'un astérisque (*) sur le label pour indiquer qu'un champ est obligatoire.
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<SyCheckBoxGroup
	v-model="selected"
	label="Champ obligatoire"
	:options="options"
	required
	display-asterisk
/>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
]
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const selected = ref<string | null>(null)
			return { args, selected }
		},
		template: `
			<SyCheckBoxGroup
				v-model="selected"
				v-bind="args"
			/>
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
							color="on-success-variant"
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
							color="on-warning-variant"
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
              <SyCheckBoxGroup v-model="value3" color="on-success-variant" label="Couleur succès" :options="options"
                               :show-success-messages="false"
              />
              <SyCheckBoxGroup v-model="value4" color="error" label="Couleur erreur" :options="options"
                               :show-success-messages="false"
              />
              <SyCheckBoxGroup v-model="value5" color="on-warning-variant" label="Couleur avertissement"
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

export const EventShowcase: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Événements
Ce story démontre les événements émis par le composant :
- **update:modelValue** : Émis lorsque la valeur change
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div>
		<SyCheckBoxGroup
			v-model="selected"
			label="Sélectionnez une ou plusieurs options"
			:options="options"
			:multiple="multiple"
			@update:model-value="onUpdate"
		/>
		<div class="mt-4">
			<p>Valeur sélectionnée : {{ selected }}</p>
			<p>Dernier événement : {{ lastEvent }}</p>
		</div>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'

const selected = ref<string | null>(null)
const lastEvent = ref('')
const multiple = ref(true)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

const onUpdate = (value: string | null) => {
	lastEvent.value = \`update:modelValue: \${value}\`
	console.log('update:modelValue', value)
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const selected = ref<(string | number) | (string | number)[] | null>(null)
			const lastEvent = ref('Aucun événement')
			const multiple = ref(true)

			const options = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
				{ label: 'Option C', value: 'c' },
			]

			const onUpdate = (value: (string | number) | (string | number)[] | null) => {
				lastEvent.value = `update:modelValue: ${JSON.stringify(value)}`
			}

			return { args, selected, options, multiple, lastEvent, onUpdate }
		},
		template: `
			<div>
				<SyCheckBoxGroup
					v-model="selected"
					label="Sélectionnez une ou plusieurs options"
					:options="options"
					:multiple="multiple"
					@update:model-value="onUpdate"
				/>
				<div class="mt-4 pa-4 bg-grey-lighten-4 rounded">
					<p><strong>Valeur sélectionnée :</strong> {{ selected || 'Aucune' }}</p>
					<p><strong>Dernier événement :</strong> {{ lastEvent }}</p>
				</div>
			</div>
		`,
	}),
}

export const HelpText: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Texte d'aide (helpText)
Affiche un texte d'aide sous les options du groupe. Il disparaît automatiquement lorsqu'un message de validation (erreur, avertissement, succès) est présent, et réapparaît en dessous une fois les messages affichés.
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<SyCheckBoxGroup
	v-model="value"
	label="Choisissez une option"
	:options="options"
	required
	help-text="Sélectionnez au moins une option dans la liste."
	:is-validate-on-blur="false"
/>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'

const value = ref<string | null>(null)
const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
]
</script>`,
			},
		],
	},
	args: {
		label: 'Choisissez une option',
		required: true,
		helpText: 'Sélectionnez au moins une option dans la liste.',
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
		multiple: false,
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
				<VBtn type="submit" class="mt-4" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

export const HideDetails: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### hideDetails
Contrôle l'affichage de la zone de messages sous le champ.

| Valeur | Comportement |
|--------|-------------|
| \`'auto'\` (défaut) | Zone affichée uniquement si un message est présent |
| \`false\` | Zone toujours affichée (espace réservé même sans message) |
| \`true\` | Zone toujours masquée |
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm @submit="onSubmit">
		<p>hide-details="auto" (défaut)</p>
		<SyCheckBoxGroup v-model="selected" label="Option" :options="options" required hide-details="auto" />

		<p>:hide-details="false" (espace toujours réservé)</p>
		<SyCheckBoxGroup v-model="selected" label="Option" :options="options" required :hide-details="false" />

		<p>:hide-details="true" (messages jamais affichés)</p>
		<SyCheckBoxGroup v-model="selected" label="Option" :options="options" required :hide-details="true" />

		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const selected = ref<string | null>(null)
const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
]
const onSubmit = (event: { isValid: boolean }) => {
	if (event.isValid) alert('Formulaire valide !')
}
</script>`,
			},
		],
	},

	render: () => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)
			const options = [
				{ label: 'Option A', value: 'a' },
				{ label: 'Option B', value: 'b' },
			]
			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) alert('Formulaire valide !')
			}
			return { selected, options, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<p class="mb-1 text-body-2">hide-details="auto" (défaut)</p>
				<SyCheckBoxGroup v-model="selected" label="Choisissez une option" :options="options" required hide-details="auto" />

				<p class="mt-4 mb-1 text-body-2">:hide-details="false" (espace toujours réservé)</p>
				<SyCheckBoxGroup v-model="selected" label="Choisissez une option" :options="options" required :hide-details="false" />

				<p class="mt-4 mb-1 text-body-2">:hide-details="true" (messages jamais affichés)</p>
				<SyCheckBoxGroup v-model="selected" label="Choisissez une option" :options="options" required :hide-details="true" />

				<VBtn type="submit" class="mt-6" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

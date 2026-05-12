import type { Meta, StoryObj } from '@storybook/vue3'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import SyAlert from '../../../SyAlert/SyAlert.vue'
import { VBtn, VMenu, VList, VListItem, VListItemTitle } from 'vuetify/components'
import { ref } from 'vue'
import { fn } from '@storybook/test'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta: Meta<typeof SySelect> = {
	title: 'Composants/Formulaires/Selects/SySelect',
	component: SySelect,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['onUpdate:modelValue', 'selectedValue', 'isOpen', 'closeList'] },
	},
	argTypes: {
		...getValidationDocumentation('string'),
		selectedValue: { control: 'text' },
		items: { control: 'object' },
		displayAsterisk: { control: 'boolean' },
		textKey: {
			control: 'text',
			description: 'Nom de la propriété qui contient le texte à afficher',
		},
		plainTextKey: {
			control: 'text',
			description: 'Nom de la propriété qui contient le texte à afficher en mode texte brut (utile dans le cas de données HTML)',
		},
		allowHtml: {
			control: 'boolean',
			description: 'Permet d\'afficher du texte en HTML',
		},
		valueKey: {
			control: 'text',
			description: 'Nom de la propriété qui contient la valeur à retourner',
		},
		returnObject: {
			control: 'boolean',
			description: 'Retourne l\'objet complet sélectionné',
		},
		clearable: {
			control: 'boolean',
			description: 'Permet de vider la sélection',
		},
		multiple: {
			control: 'boolean',
			description: 'Permet la sélection multiple d\'options',
		},
		chips: {
			control: 'boolean',
			description: 'Affiche les options sélectionnées sous forme de chips',
		},
		variantStyle: {
			control: 'select',
			options: ['outlined', 'plain', 'underlined', 'filled', 'solo', 'solo-inverted', 'solo-filled'],
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
			description: 'Couleur du champ',
		},
		density: {
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			description: 'Définit la densité du champ de sélection',
		},
		width: {
			control: 'text',
			description: 'Permet de définir une largeur personnalisée pour le champ de sélection',
		},
		helpText: {
			control: 'text',
			description: 'Texte d\'aide à la saisie',
		},
		prependTooltip: {
			description: 'Si le texte du prepend tooltip est renseigné alors l\'icône du  tooltip s\'affiche',
			control: 'text',
		},
		appendTooltip: {
			description: 'Si le texte du append tooltip est renseigné alors l\'icône du  tooltip s\'affiche',
			control: 'text',
		},
		tooltipLocation: {
			description: 'Position des tooltips',
			control: 'select',
			options: ['top', 'bottom', 'start', 'end'],
			default: 'top',
		},
		append: {
			description: 'Slot pour ajouter du contenu à droite du champ',
			control: false,
			table: {
				type: { summary: 'VNode' },
				category: 'slots',
			},
		},
		prepend: {
			description: 'Slot pour ajouter du contenu à gauche du champ',
			control: false,
			table: {
				type: { summary: 'VNode' },
				category: 'slots',
			},
		},
	},
} as Meta<typeof SySelect>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SySelect } from '@cnamts/synapse'
					
					const items =  [
						{ text: 'Lorem Ipsum is simply dummy text of the printing and typesetting', value: 'Adrien' },
						{ text: 'Industry. Lorem Ipsum has been the industry's standard dummy', value: 'Axel' },
						{ text: 'Text ever since the 1500s, when an unknown printer took a galley', value: 'Baptiste' },
						{ text: 'Of type and scrambled it to make a type specimen book. It has', value: 'Clement' },
						{ text: 'Survived not only five centuries, but also the leap into electronic', value: 'Corentin' },
						{ text: 'Cum haec taliaque sollicitas eius aures everberarent ', value: 'Damien' },
						{ text: 'Expositas semper eius modi rumoribus et patentes, varia ', value: 'David' },
						{ text: 'Expositas semper eius modi rumoribus et patentes, varia', value: 'Eloi' },
						{ text: 'Emensis itaque difficultatibus multis et nive obrutis callibus', value: 'Louis' },
						{ text: 'Plurimis ubi prope Rauracum ventum est ad supercilia', value: 'Valentin' },
					],
				</script>
				`,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Lorem Ipsum is simply dummy text of the printing and typesetting', value: 'Adrien' },
			{ text: 'Industry. Lorem Ipsum has been the industry\'s standard dummy', value: 'Axel' },
			{ text: 'Text ever since the 1500s, when an unknown printer took a galley', value: 'Baptiste' },
			{ text: 'Of type and scrambled it to make a type specimen book. It has', value: 'Clement' },
			{ text: 'Survived not only five centuries, but also the leap into electronic', value: 'Corentin' },
			{ text: 'Cum haec taliaque sollicitas eius aures everberarent ', value: 'Damien' },
			{ text: 'Expositas semper eius modi rumoribus et patentes, varia ', value: 'David' },
			{ text: 'Expositas semper eius modi rumoribus et patentes, varia', value: 'Eloi' },
			{ text: 'Emensis itaque difficultatibus multis et nive obrutis callibus', value: 'Louis' },
			{ text: 'Plurimis ubi prope Rauracum ventum est ad supercilia', value: 'Valentin' },
		],
		'customSuccessRules': [{
			type: 'custom',
			options: {
				validate: (v: unknown) => v !== null && v !== undefined,
				successMessage: 'Option sélectionnée avec succès.',
			},
		}],
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				const value = ref(null)
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-model="value"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const HelpText: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
						help-text="Texte d'aide à la saisie"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SySelect } from '@cnamts/synapse'
					
					const items =  [
						{ text: 'Adrien', value: 'Adrien' },
						{ text: 'Axel', value: 'Axel' },
						{ text: 'Baptiste', value: 'Baptiste' },
						{ text: 'Clement', value: 'Clement' },
						{ text: 'Corentin', value: 'Corentin' },
						{ text: 'Damien', value: 'Damien' },
						{ text: 'David', value: 'David' },
						{ text: 'Eloi', value: 'Eloi' },
						{ text: 'Louis', value: 'Louis' },
						{ text: 'Valentin', value: 'Valentin' },
					],
				</script>
				`,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Adrien', value: 'Adrien' },
			{ text: 'Axel', value: 'Axel' },
			{ text: 'Baptiste', value: 'Baptiste' },
			{ text: 'Clement', value: 'Clement' },
			{ text: 'Corentin', value: 'Corentin' },
			{ text: 'Damien', value: 'Damien' },
			{ text: 'David', value: 'David' },
			{ text: 'Eloi', value: 'Eloi' },
			{ text: 'Louis', value: 'Louis' },
			{ text: 'Valentin', value: 'Valentin' },
		],
		'helpText': 'Texte d\'aide à la saisie',
		'hideDetails': false,
		'customSuccessRules': [{
			type: 'custom',
			options: {
				validate: (v: unknown) => v !== null && v !== undefined,
				successMessage: 'Option sélectionnée avec succès.',
			},
		}],
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				const value = ref(null)
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-model="value"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<p class="mb-2 text-caption text-grey-darken-2">Ce champ est obligatoire</p>
					<SySelect
						v-model="value"
						:items="items"
						required
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SySelect } from '@cnamts/synapse'
					const value = ref(null)
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					]
				</script>
				`,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		'required': true,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				const value = ref(null)
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<p class="mb-2 text-caption text-grey-darken-2">Ce champ est obligatoire</p>
					<SySelect
						v-model="value"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const RequiredWithAsterisk: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Version du champ de sélection requis avec un astérisque visuel.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SySelect
    v-model="value"
    :items="items"
    label="Sélectionnez une option"
    required
    display-asterisk
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import SySelect from '@cnamts/synapse'

const value = ref('')
const items = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
]
</script>
        `,
			},
		],
	},
	args: {
		...Default.args,
		'label': 'Sélectionnez une option',
		'required': true,
		'displayAsterisk': true,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				const value = ref(null)
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-model="value"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const SlotPrepend: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
						prepend-icon="success"
					>
					</SySelect>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SySelect } from '@cnamts/synapse'

					const value = ref(null)
					const items = [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					]
				</script>
				`,
			},
		],
	},
	args: {
		...Default.args,
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		'prependIcon': 'success',
		'disableClickButton': false,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				const value = ref(null)
				const onPrependIconClick = fn()
				return { args, value, onPrependIconClick }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						v-model="value"
						@prepend-icon-click="onPrependIconClick"
					/>
				</div>
			`,
		}
	},
}

export const SlotAppend: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
						append-icon="success"
					>
					</SySelect>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SySelect } from '@cnamts/synapse'

					const value = ref(null)
					const items = [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					]
				</script>
				`,
			},
		],
	},
	args: {
		...Default.args,
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		'appendIcon': 'success',
		'disableClickButton': false,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				const value = ref(null)
				const onAppendIconClick = fn()
				return { args, value, onAppendIconClick }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						v-model="value"
						@append-icon-click="onAppendIconClick"
					/>
				</div>
			`,
		}
	},
}

export const WithTooltips: Story = {
	args: {
		...Default.args,
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		'label': 'Champ avec tooltips',
		'prependTooltip': 'Information à gauche du champ',
		'appendTooltip': 'Information à droite du champ',
		'tooltipLocation': 'top',
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				const value = ref(null)
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<p class="mb-4">
						Des icônes d'information avec tooltips sont affichées de chaque côté du champ.
						Survolez-les pour voir les messages d'aide qui apparaissent en haut grâce à la prop tooltipLocation="top".
					</p>
					<SySelect
						v-bind="args"
						v-model="value"
					/>
				</div>
			`,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Exemple de champ avec des tooltips d\'information. Les icônes d\'information apparaissent automatiquement lorsque les props prependTooltip et/ou appendTooltip sont renseignées. La position des tooltips peut être contrôlée avec la prop tooltipLocation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SySelect
		v-model="value"
		:items="items"
		label="Champ avec tooltips"
		prependTooltip="Information à gauche du champ"
		appendTooltip="Information à droite du champ"
		tooltipLocation="top"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SySelect } from '@cnamts/synapse'

	const value = ref(null)
	const items = [
		{ text: 'Option 1', value: '1' },
		{ text: 'Option 2', value: '2' },
	]
</script>
				`,
			},
		],
	},
}

export const MultipleSelection: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Exemple de sélection multiple avec SySelect. Les options dans le menu déroulant sont affichées avec des cases à cocher pour faciliter la sélection multiple.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SySelect
    v-model="selectedOptions"
    :items="options"
    label="Options"
    multiple
  />
  <div class="mt-4">
    Options sélectionnées: {{ selectedOptions }}
  </div>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import SySelect from '@cnamts/synapse'

const selectedOptions = ref([])
const options = [
						{ text: 'Adrien', value: 'Adrien' },
						{ text: 'Axel', value: 'Axel' },
						{ text: 'Baptiste', value: 'Baptiste' },
						{ text: 'Clement', value: 'Clement' },
						{ text: 'Corentin', value: 'Corentin' },
						{ text: 'Damien', value: 'Damien' },
						{ text: 'David', value: 'David' },
						{ text: 'Eloi', value: 'Eloi' },
						{ text: 'Louis', value: 'Louis' },
						{ text: 'Valentin', value: 'Valentin' },
]
</script>
        `,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Adrien', value: 'Adrien' },
			{ text: 'Axel', value: 'Axel' },
			{ text: 'Baptiste', value: 'Baptiste' },
			{ text: 'Clement', value: 'Clement' },
			{ text: 'Corentin', value: 'Corentin' },
			{ text: 'Damien', value: 'Damien' },
			{ text: 'David', value: 'David' },
			{ text: 'Eloi', value: 'Eloi' },
			{ text: 'Louis', value: 'Louis' },
			{ text: 'Valentin', value: 'Valentin' },
		],
		'label': 'Sélection multiple',
		'multiple': true,
		'clearable': true,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				const selectedOptions = ref(null)

				return { args, selectedOptions }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-model="selectedOptions"
						v-bind="args"
					/>
					<div class="mt-4">
						Options sélectionnées: {{ selectedOptions }}
					</div>
				</div>
			`,
		}
	},
}

export const ChipsDisplay: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Exemple de sélection multiple avec affichage en chips. Les options sélectionnées sont affichées sous forme de chips dans le champ, et les options dans le menu déroulant sont affichées avec des cases à cocher.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SySelect
    v-model="selectedOptions"
    :items="options"
    label="Options"
    multiple
    chips
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import SySelect from '@cnamts/synapse'

const selectedOptions = ref([])
const options = [
  { text: 'Option 1', value: '1' },
  { text: 'Option 2', value: '2' },
  { text: 'Option 3', value: '3' },
  { text: 'Option 4', value: '4' },
]
</script>
        `,
			},
		],
	},
	args: {
		'items': [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
			{ text: 'Option 3', value: '3' },
			{ text: 'Option 4', value: '4' },
		],
		'label': 'Sélection avec chips',
		'multiple': true,
		'chips': true,
		'clearable': true,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				const selectedOptions = ref(null)

				return { args, selectedOptions }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-model="selectedOptions"
						v-bind="args"
					/>
				</div>
			`,
		}
	},
}

export const withCustomKey: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<SySelect
							v-model="value"
							:items="items"
							text-key="customKey"
						/>
					</template>
					`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
						import { SySelect } from '@cnamts/synapse'
						
						const items =  [
							{ customKey: 'Choix 1', value: '1' },
							{ customKey: 'Choix 2', value: '2' },
						],
					</script>
					`,
			},
		],
	},
	args: {
		'items': [
			{ customKey: 'Choix 1', value: '1' },
			{ customKey: 'Choix 2', value: '2' },
		],
		'customSuccessRules': [{
			type: 'custom',
			options: {
				validate: (v: unknown) => v !== null && v !== undefined,
				successMessage: 'Option sélectionnée avec succès.',
			},
		}],
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				const value = ref(null)
				return { args, value }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-model="value"
						v-bind="args"
						text-key="customKey"
					/>
				</div>
			`,
		}
	},
}

export const Info: Story = {
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
				<SyAlert v-model="args.modelValue" :type="args.type" :variant="tonal" :closable="false">
					<template #default>
						<b>Format des items :</b>
						<ul>
							<li>- Si les items passés en props sont des objets, le composant les utilisera directement.</li>
							<li>- Si les items sont un tableau de string, le composant les utilisera directement.</li>
						</ul>
					</template>
					</SyAlert>
			`,
		}
	},
	tags: ['!dev'],
}

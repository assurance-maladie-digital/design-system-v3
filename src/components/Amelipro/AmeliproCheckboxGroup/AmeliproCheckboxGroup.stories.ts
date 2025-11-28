import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproCheckboxGroup from './AmeliproCheckboxGroup.vue'
import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'

const meta = {
	argTypes: {
		'`append-${index}`': { description: 'Permet de rajouter un élément après le label des checkbox, il y a un slot par item de la liste' },
		'`subItem-${index}`': { description: 'Permet de rajouter un élément sous une checkbox seulement lorsqu’elle est cochée (existe seulement si les props horizontal et fullHorizontal sont à false)' },
		'append': { description: 'Permet de rajouter un élément après les label de toutes les checkbox' },
		'required': { description: 'Permet de rendre la selection obligatoire' },
		'change:selected': { description: 'Événement émis au click sur une checkbox retourne les items sélectionnés' },
		'disabled': { description: 'Permet de désactiver la CheckboxGroup' },
		'fullHorizontal': { description: 'Permet d’afficher le checkboxGroup ainsi que le label à l’horizontal' },
		'groupLabel': { description: 'Label du groupe de checkbox' },
		'hiddenLabel': { description: 'Permet de masquer le label du groupe de checkbox, dans une démarche d’amélioration de l’accessibilité, il est recommandé de ne pas utiliser cette property dans la mesure du possible' },
		'horizontal': { description: 'Permet d’afficher le checkboxGroup à l’horizontal' },
		'horizontalLabel': { description: 'Permet d’afficher le checkboxGroup avec le label à l’horizontal tout en gardant les checkbox sous forme de colonnes' },
		'labelInfo': { description: 'Slot pour ajouter une tooltip après le label du groupe si besoin' },
		'modelValue': {
			description: 'Tableau d’objets qui permet de générer les checkbox',
			table: {
				type: {
					detail: `Array<{
	description?: string;
	disabled?: boolean;
	isChecked: boolean;
	label: string;
	value: string;
}[]>`,
					summary: 'AmeliproCheckboxGroupItem[]',
				},
			},
		},
		'multipleRequired': { description: 'Permet de rendre la selection multiple obligatoire' },
		'multipleRequiredErrorMessage': { description: 'Message d’erreur affiché lorsque la props multipleRequired est active' },
		'pills': { description: 'Change le style du groupe de checkbox ' },
		'requiredErrorMessage': { description: 'Message d’erreur affiché lorsque la props required est active' },
		'subItem': { description: 'Permet de rajouter un élément sous toutes checkbox seulement lorsqu’elle sont cochées (existe seulement si les props horizontal et fullHorizontal sont à false)' },
		'uniqueId': { description: 'Id unique du groupe de checkbox' },
		'update:model-value': { description: 'Événement émis au changement du v-model' },
	},
	component: AmeliproCheckboxGroup,
	title: 'Composants/Amelipro/Formulaires/AmeliproCheckboxGroup',
} as Meta<typeof AmeliproCheckboxGroup>

export default meta

type Story = StoryObj<typeof AmeliproCheckboxGroup>

const baseItems = [
	{ isChecked: false, label: 'Option 1', value: '1' },
	{ isChecked: false, label: 'Option 2', value: '2' },
	{ isChecked: false, label: 'Option 3', value: '3' },
]

const items = [
	{
		disabled: true,
		isChecked: true,
		label: '1',
		value: 'Valeur 1',
	},
	{
		description: 'ma-tooltip',
		disabled: true,
		isChecked: false,
		label: '2',
		value: 'Valeur 2',
	},
	{
		isChecked: false,
		label: '3',
		value: 'Valeur 3',
	},
	{
		isChecked: false,
		label: '4',
		value: 'Valeur 4',
	},
	{
		isChecked: false,
		label: '5',
		value: 'Valeur 5',
	},
]

export const Default: Story = {
	args: {
		groupLabel: 'Exemple de checkbox',
		modelValue: items,
		uniqueId: 'checkbox-group',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCheckboxGroup
		v-model="value"
		group-label="Exemple de checkbox"
		unique-id="checkbox-group"
	>
		<template #append-1>
			<AmeliproTooltips
				classes="ml-2"
				tooltip-text="contenu de la tooltip"
				unique-id="ma-tooltip"
			/>
		</template>
	</AmeliproCheckboxGroup>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	import { AmeliproCheckboxGroup } from '@cnamts/synapse'

	const value = ref([
		{
			disabled: true,
			isChecked: true,
			label: '1',
			value: 'Valeur 1',
		},
		{
			description: 'ma-tooltip',
			disabled: true,
			isChecked: false,
			label: '2',
			value: 'Valeur 2',
		},
		{
			isChecked: false,
			label: '3',
			value: 'Valeur 3',
		},
		{
			isChecked: false,
			label: '4',
			value: 'Valeur 4',
		},
		{
			isChecked: false,
			label: '5',
			value: 'Valeur 5',
		},
	])
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup, AmeliproTooltips },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproCheckboxGroup
	:group-label="args.groupLabel"
	:unique-id="args.uniqueId"
	v-bind="args"
	v-model="model"
>
	<template #append-1>
		<AmeliproTooltips
			classes="ml-2"
			tooltip-text="contenu de la tooltip"
			unique-id="ma-tooltip"
		/>
	</template>
</AmeliproCheckboxGroup>`,
	}),
}

export const Disabled: Story = {
	args: {
		groupLabel: 'Groupe désactivé',
		modelValue: baseItems.map(i => ({ ...i, disabled: true })),
		uniqueId: 'checkbox-group-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le groupe de checkbox est désactivé grâce à la prop <code>disabled</code>.</p>
	<AmeliproCheckboxGroup
		v-model="value"
		group-label="Groupe désactivé"
		unique-id="checkbox-group-disabled"
		:model-value="items"
		disabled
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	const items = [
		{ isChecked: false, label: 'Option 1', value: '1', disabled: true },
		{ isChecked: false, label: 'Option 2', value: '2', disabled: true },
		{ isChecked: false, label: 'Option 3', value: '3', disabled: true },
	]
	const value = ref(items)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le groupe de checkbox est désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproCheckboxGroup v-bind="args" v-model="model" />`,
	}),
}

export const Required: Story = {
	args: {
		groupLabel: 'Groupe obligatoire',
		modelValue: baseItems,
		uniqueId: 'checkbox-group-required',
		required: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La sélection d’au moins une option est obligatoire grâce à la prop <code>required</code>.</p>
	<AmeliproCheckboxGroup
		v-model="value"
		group-label="Groupe obligatoire"
		unique-id="checkbox-group-required"
		:model-value="items"
		required
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	const items = [
		{ isChecked: false, label: 'Option 1', value: '1' },
		{ isChecked: false, label: 'Option 2', value: '2' },
		{ isChecked: false, label: 'Option 3', value: '3' },
	]
	const value = ref(items)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La sélection d’au moins une option est obligatoire grâce à la prop
          <code>required</code>.</p>
<AmeliproCheckboxGroup 
	v-bind="args" 
	v-model="model" 
/>`,
	}),
}

export const MultipleRequired: Story = {
	args: {
		groupLabel: 'Sélection multiple obligatoire',
		modelValue: [
			{ isChecked: false, label: 'Option 1', value: '1' },
			{ isChecked: false, label: 'Option 2', value: '2' },
			{ isChecked: false, label: 'Option 3', value: '3' },
		],
		uniqueId: 'checkbox-group-multiple-required',
		multipleRequired: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La sélection d’au moins deux options est obligatoire grâce à la prop <code>multipleRequired</code>.</p>
  <AmeliproCheckboxGroup
	v-model="value"
	group-label="Sélection multiple obligatoire"
	unique-id="checkbox-group-multiple-required"
	:model-value="items"
	multiple-required
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  const items = [
	{ isChecked: false, label: 'Option 1', value: '1' },
	{ isChecked: false, label: 'Option 2', value: '2' },
	{ isChecked: false, label: 'Option 3', value: '3' },
  ]
  const value = ref(items)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La sélection d’au moins deux options est obligatoire grâce à la prop <code>multipleRequired</code>.</p>
<AmeliproCheckboxGroup v-bind="args" v-model="model" />`,
	}),
}

export const Horizontal: Story = {
	args: {
		groupLabel: 'Affichage horizontal',
		modelValue: [
			{ isChecked: false, label: 'Option 1', value: '1' },
			{ isChecked: false, label: 'Option 2', value: '2' },
			{ isChecked: false, label: 'Option 3', value: '3' },
		],
		uniqueId: 'checkbox-group-horizontal',
		horizontal: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le groupe de checkbox est affiché horizontalement grâce à la prop <code>horizontal</code>.</p>
	<AmeliproCheckboxGroup
		v-model="value"
		group-label="Affichage horizontal"
		unique-id="checkbox-group-horizontal"
		:model-value="items"
		horizontal
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	const items = [
		{ isChecked: false, label: 'Option 1', value: '1' },
		{ isChecked: false, label: 'Option 2', value: '2' },
		{ isChecked: false, label: 'Option 3', value: '3' },
	]
	const value = ref(items)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le groupe de checkbox est affiché horizontalement grâce à la prop <code>horizontal</code>.</p>
<AmeliproCheckboxGroup v-bind="args" v-model="model" />`,
	}),
}

export const FullHorizontal: Story = {
	args: {
		groupLabel: 'Affichage fullHorizontal',
		modelValue: [
			{ isChecked: false, label: 'Option 1', value: '1' },
			{ isChecked: false, label: 'Option 2', value: '2' },
			{ isChecked: false, label: 'Option 3', value: '3' },
		],
		uniqueId: 'checkbox-group-full-horizontal',
		fullHorizontal: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le groupe de checkbox et son label sont affichés à l’horizontal grâce à la prop <code>fullHorizontal</code>.</p>
  <AmeliproCheckboxGroup
    v-model="value"
    group-label="Affichage fullHorizontal"
    unique-id="checkbox-group-full-horizontal"
    :model-value="items"
    full-horizontal
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  const items = [
    { isChecked: false, label: 'Option 1', value: '1' },
    { isChecked: false, label: 'Option 2', value: '2' },
    { isChecked: false, label: 'Option 3', value: '3' }
  ]
  const value = ref(items)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le groupe de checkbox et son label sont affichés à l’horizontal grâce à la prop <code>fullHorizontal</code>.</p>
<AmeliproCheckboxGroup v-bind="args" v-model="model" />`,
	}),
}

export const HorizontalLabel: Story = {
	args: {
		groupLabel: 'Affichage horizontalLabel',
		modelValue: [
			{ isChecked: false, label: 'Option 1', value: '1' },
			{ isChecked: false, label: 'Option 2', value: '2' },
			{ isChecked: false, label: 'Option 3', value: '3' },
		],
		uniqueId: 'checkbox-group-horizontal-label',
		horizontalLabel: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le label du groupe est affiché à l’horizontal grâce à la prop <code>horizontalLabel</code>, tandis que les checkbox restent en colonnes.</p>
	<AmeliproCheckboxGroup
		v-model="value"
		group-label="Affichage horizontalLabel"
		unique-id="checkbox-group-horizontal-label"
		:model-value="items"
		horizontal-label
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	const items = [
		{ isChecked: false, label: 'Option 1', value: '1' },
		{ isChecked: false, label: 'Option 2', value: '2' },
		{ isChecked: false, label: 'Option 3', value: '3' }
	]
	const value = ref(items)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le label du groupe est affiché à l’horizontal grâce à la prop <code>horizontalLabel</code>, tandis que les checkbox restent en colonnes.</p>
<AmeliproCheckboxGroup v-bind="args" v-model="model" />`,
	}),
}

export const Pills: Story = {
	args: {
		groupLabel: 'Affichage en mode pills',
		modelValue: [
			{ isChecked: false, label: 'Option 1', value: '1' },
			{ isChecked: false, label: 'Option 2', value: '2' },
			{ isChecked: false, label: 'Option 3', value: '3' },
		],
		uniqueId: 'checkbox-group-pills',
		pills: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le groupe de checkbox utilise le style <code>pills</code> pour un rendu visuel différent.</p>
  <AmeliproCheckboxGroup
    v-model="value"
    group-label="Affichage en mode pills"
    unique-id="checkbox-group-pills"
    :model-value="items"
    pills
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  const items = [
    { isChecked: false, label: 'Option 1', value: '1' },
    { isChecked: false, label: 'Option 2', value: '2' },
    { isChecked: false, label: 'Option 3', value: '3' }
  ]
  const value = ref(items)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le groupe de checkbox utilise le style <code>pills</code> pour un rendu visuel différent.</p>
<AmeliproCheckboxGroup v-bind="args" v-model="model" />`,
	}),
}

export const HiddenLabel: Story = {
	args: {
		groupLabel: 'Label masqué',
		modelValue: [
			{ isChecked: false, label: 'Option 1', value: '1' },
			{ isChecked: false, label: 'Option 2', value: '2' },
			{ isChecked: false, label: 'Option 3', value: '3' },
		],
		uniqueId: 'checkbox-group-hidden-label',
		hiddenLabel: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le label du groupe est masqué grâce à la prop <code>hiddenLabel</code>.</p>
	<AmeliproCheckboxGroup
		v-model="value"
		group-label="Label masqué"
		unique-id="checkbox-group-hidden-label"
		:model-value="items"
		hidden-label
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { ref } from 'vue'
	const items = [
		{ isChecked: false, label: 'Option 1', value: '1' },
		{ isChecked: false, label: 'Option 2', value: '2' },
		{ isChecked: false, label: 'Option 3', value: '3' }
	]
	const value = ref(items)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCheckboxGroup },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le label du groupe est masqué grâce à la prop <code>hiddenLabel</code>.</p>
<AmeliproCheckboxGroup v-bind="args" v-model="model" />`,
	}),
}

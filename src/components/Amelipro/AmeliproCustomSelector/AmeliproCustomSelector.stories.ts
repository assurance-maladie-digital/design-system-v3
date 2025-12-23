import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproCustomSelector from './AmeliproCustomSelector.vue'
import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'

const meta = {
	argTypes: {
		'required': { description: 'Permet de rendre la selection obligatoire d’au moins une option' },
		'change:selected': { description: 'Événement émis au click sur une checkbox/bouton radio retourne le ou les éléments sélectionnés selon si la property unique est activé ou non et un identifiant pour le groupe' },
		'disabled': { description: 'Permet de désactiver le CustomSelector' },
		'groupLabel': { description: 'Label du groupe de checkbox/boutons radios' },
		'itemsPerLine': { description: 'Nombre de boutons par ligne' },
		'labelDescription': { description: 'Id de la tooltip associée au label si il y en a une' },
		'labelInfo': { description: 'Slot pour ajouter une tooltip après le label du groupe si besoin' },
		'labelMarginBottom': { description: 'Valeur du margin-bottom du label' },
		'modelValue': {
			description: 'Tableau d’objets qui permet de générer les checkbox/boutons radios',
			table: {
				type: {
					detail: `Array<{
	disabled?: boolean;
	isChecked: boolean;
	label: string;
	value: string;
}[]>`,
					summary: 'AmeliproCustomSelectorItem[]',
				},
			},
		},
		'multipleRequired': { description: 'Permet de rendre la selection multiple obligatoire' },
		'multipleRequiredErrorMessage': { description: 'Message d’erreur affiché lorsque la props multipleRequired est active' },
		'requiredErrorMessage': { description: 'Message d’erreur affiché lorsque la props required est active' },
		'unique': { description: 'Pour avoir seulement un item sélectionnable ' },
		'uniqueId': { description: 'Id unique du groupe de checkbox/boutons radios' },
		'update:model-value': { description: 'Événement émis au changement du v-model' },
	},
	component: AmeliproCustomSelector,
	title: 'Composants/Amelipro/Formulaires/AmeliproCustomSelector',
} as Meta<typeof AmeliproCustomSelector>

export default meta

type Story = StoryObj<typeof AmeliproCustomSelector>

const items = [
	{
		id: 'item',
		isChecked: false,
		label: 'option 1',
		value: 'toto',
	},
	{
		id: 'item2',
		isChecked: false,
		label: 'option 2',
		value: 'titi',
	},
	{
		id: 'item3',
		isChecked: true,
		label: 'option 3',
		value: 'tutu',
	},
	{
		id: 'item4',
		isChecked: false,
		label: 'option 4',
		value: 'tata',
	},
]

export const Default: Story = {
	args: {
		groupLabel: 'Mon label',
		modelValue: items,
		uniqueId: 'custom-selector-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCustomSelector
		v-model="value"
		group-label="Mon label"
		unique-id="custom-selector-id"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue';
	import { AmeliproCustomSelector } from '@cnamts/synapse';

	const value = ref([
		{
			id: 'item',
			isChecked: false,
			label: 'option 1',
			value: 'toto',
		},
		{
			id: 'item2',
			isChecked: false,
			label: 'option 2',
			value: 'titi',
		},
		{
			id: 'item3',
			isChecked: true,
			label: 'option 3',
			value: 'tutu',
		},
		{
			id: 'item4',
			isChecked: false,
			label: 'option 4',
			value: 'tata',
		},
	]);
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproCustomSelector
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Disabled: Story = {
	args: {
		groupLabel: 'Sélecteur désactivé',
		modelValue: items,
		uniqueId: 'custom-selector-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le composant est entièrement désactivé grâce à la prop <code>disabled</code>.</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="Sélecteur désactivé"
    unique-id="custom-selector-disabled"
    disabled
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le composant est entièrement désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproCustomSelector v-bind="args" v-model="model" />`,
	}),
}

export const DisabledItem: Story = {
	args: {
		groupLabel: 'Un item désactivé',
		modelValue: items.map(i => i.id === 'item2' ? { ...i, disabled: true } : i),
		uniqueId: 'custom-selector-disableditem',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Un seul item est désactivé grâce à la prop <code>disabled</code> sur l’item.</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="Un item désactivé"
    unique-id="custom-selector-disableditem"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items.map(i => i.id === 'item2' ? { ...i, disabled: true } : i), null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Un seul item est désactivé grâce à la prop <code>disabled</code> sur l’item.</p>
<AmeliproCustomSelector v-bind="args" v-model="model" />`,
	}),
}

export const UniqueSelection: Story = {
	args: {
		groupLabel: 'Sélection unique (radio)',
		modelValue: items.map(i => ({ ...i, isChecked: i.id === 'item2' })),
		uniqueId: 'custom-selector-unique',
		unique: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Un seul choix possible grâce à la prop <code>unique</code> (mode radio).</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="Sélection unique (radio)"
    unique-id="custom-selector-unique"
    unique
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items.map(i => ({ ...i, isChecked: i.id === 'item2' })), null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Un seul choix possible grâce à la prop <code>unique</code> (mode radio).</p>
<AmeliproCustomSelector v-bind="args" v-model="model" />`,
	}),
}

export const Required: Story = {
	args: {
		groupLabel: 'Sélection obligatoire',
		modelValue: items,
		uniqueId: 'custom-selector-required',
		required: true,
		requiredErrorMessage: 'Veuillez sélectionner au moins une option.',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La sélection d’au moins une option est obligatoire grâce à la prop <code>required</code>.</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="Sélection obligatoire"
    unique-id="custom-selector-required"
    required
    required-error-message="Veuillez sélectionner au moins une option."
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La sélection d’au moins une option est obligatoire grâce à la prop
          <code>required</code>.</p>
<AmeliproCustomSelector v-bind="args" v-model="model" />`,
	}),
}

export const MultipleRequired: Story = {
	args: {
		groupLabel: 'Sélection multiple obligatoire',
		modelValue: items,
		uniqueId: 'custom-selector-multireq',
		multipleRequired: true,
		multipleRequiredErrorMessage: 'Veuillez sélectionner au moins deux options.',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La sélection de plusieurs options est obligatoire grâce à la prop <code>multipleRequired</code>.</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="Sélection multiple obligatoire"
    unique-id="custom-selector-multireq"
    multiple-required
    multiple-required-error-message="Veuillez sélectionner au moins deux options."
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La sélection de plusieurs options est obligatoire grâce à la prop <code>multipleRequired</code>.</p>
<AmeliproCustomSelector v-bind="args" v-model="model" />`,
	}),
}

export const ItemsPerLine: Story = {
	args: {
		groupLabel: '2 boutons par ligne',
		modelValue: items,
		uniqueId: 'custom-selector-itemsperline',
		itemsPerLine: 2,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le nombre de boutons par ligne est défini via la prop <code>itemsPerLine</code>.</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="2 boutons par ligne"
    unique-id="custom-selector-itemsperline"
    :items-per-line="2"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le nombre de boutons par ligne est défini via la prop <code>itemsPerLine</code>.</p>
<AmeliproCustomSelector v-bind="args" v-model="model" />`,
	}),
}

export const LabelInfo: Story = {
	args: {
		groupLabel: 'Label avec info-bulle',
		modelValue: items,
		uniqueId: 'custom-selector-labelinfo',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>labelInfo</code> permet d’ajouter une info-bulle au label du groupe.</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="Label avec info-bulle"
    unique-id="custom-selector-labelinfo"
  >
	<template #labelInfo>
		<AmeliproTooltips
			tooltip-text="Info-bulle personnalisée"
			unique-id="amelipro-tooltip-id"
		/>
	</template>
  </AmeliproCustomSelector>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector, AmeliproTooltips },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le slot <code>labelInfo</code> permet d’ajouter une info-bulle au label du groupe.</p>
<AmeliproCustomSelector v-bind="args" v-model="model">
	<template #labelInfo>
		<AmeliproTooltips
			tooltip-text="Info-bulle personnalisée"
			unique-id="amelipro-tooltip-id"
		/>
	</template>
</AmeliproCustomSelector>`,
	}),
}

export const LabelDescription: Story = {
	args: {
		groupLabel: 'Label avec description',
		modelValue: items,
		uniqueId: 'custom-selector-labeldesc',
		labelDescription: 'description-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La prop <code>labelDescription</code> permet d’associer une description au composant pour l’accessibilité.</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="Label avec description"
    unique-id="custom-selector-labeldesc"
    label-description="description-id"
  />
  <p id="description-id">Description associée au composant pour l’accessibilité.</p>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La prop <code>labelDescription</code> permet d’associer une description au composant pour l’accessibilité.</p>
<AmeliproCustomSelector v-bind="args" v-model="model" label-description="description-id" />
<p id="description-id" class="mt-2">Description associée au composant pour l’accessibilité.</p>`,
	}),
}

export const LabelMarginBottom: Story = {
	args: {
		groupLabel: 'Label avec marge personnalisée',
		modelValue: items,
		uniqueId: 'custom-selector-labelmb',
		labelMarginBottom: '32px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>La prop <code>labelMarginBottom</code> permet de personnaliser l’espacement sous le label.</p>
  <AmeliproCustomSelector
    v-model="value"
    group-label="Label avec marge personnalisée"
    unique-id="custom-selector-labelmb"
    label-margin-bottom="32px"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproCustomSelector } from '@cnamts/synapse'
  const value = ref(${JSON.stringify(items, null, 2)})
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCustomSelector },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">La prop <code>labelMarginBottom</code> permet de personnaliser l’espacement sous le label.</p>
<AmeliproCustomSelector v-bind="args" v-model="model" />`,
	}),
}

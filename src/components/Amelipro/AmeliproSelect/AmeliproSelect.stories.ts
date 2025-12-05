import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproSelect from './AmeliproSelect.vue'
import type { SelectItem } from './types'
// --- LabelInfo ---
import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'

const meta = {
	argTypes: {
		'append': { description: 'Slot permettant d’ajouter des éléments à la suite du champs (à droite)' },
		'required': { description: 'Passe le select en required' },
		'classes': { description: 'classes css à ajouter au container du composant' },
		'clearable': { description: 'Rends le select "clearable"' },
		'disabled': { description: 'Desactive le select' },
		'fullWidthErrorMsg': { description: 'défini que la largeur du message d’erreur peut dépasser du champs si le container est plus grand que le champ' },
		'globalMaxWidth': { description: 'Gère la largeur maximale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalMinWidth': { description: 'Gère la largeur minimale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalWidth': { description: 'Gère la largeur du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'hideErrorMessage': { description: 'Masque ou affiche le message d’erreur, si la valeur est à "auto" le message ne sera rendu que s’il y en a un' },
		'horizontal': { description: 'Passe le label sur la meme ligne que le select' },
		'inputMaxWidth': { description: 'Gère la largeur maximale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'inputMinWidth': { description: 'Gère la largeur minimale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'items': {
			description: 'Items du select',
			table: {
				type: {
					detail: `Array<{
	title: string | number;
	value: string | number;
	disabled?: boolean;
}>`,
					summary: 'SelectItem[] | String[]',
				},
			},
		},
		'label': { description: 'Label du select' },
		'labelInfo': { description: 'Slot permettant d’ajouter des éléments à la suite du label (à droite)' },
		'labelMaxWidth': { description: 'Gère la largeur maximale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'labelMinWidth': { description: 'Gère la largeur minimale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'messagesToDisplay': { description: 'Liste des messages d’erreur à afficher' },
		'modelValue': {
			description: 'valeur du champ',
			table: {
				type: {
					detail: `{
	title: string | number;
	value: string | number;
	disabled?: boolean;
}`,
					summary: 'SelectItem | string | undefined',
				},
			},
		},
		'placeholder': { description: 'Placeholder du select' },
		'readonly': { description: 'Passe le select en lecture seule' },
		'rules': { description: 'Tableau des règles à appliquer au champ' },
		'uniqueId': { description: 'Id unique du select' },
		'update:model-value': { description: 'Event émis au changement du v-model' },
		'validateOn': { description: 'Défini le moment où la validation du champ se fait, voir la documentation de Vuetify pour plus d’informtations' },
	},
	component: AmeliproSelect,
	title: 'Composants/Amelipro/Formulaires/AmeliproSelect',
} as Meta<typeof AmeliproSelect>
export default meta

type Story = StoryObj<typeof AmeliproSelect>

const items: SelectItem[] = [
	{
		title: 'Lille',
		value: 1,
	},
	{
		title: 'Paris',
		value: 2,
	},
	{
		title: 'Bordeaux',
		value: 3,
	},
	{
		title: 'Tours',
		value: 4,
	},
	{
		title: 'Marseille',
		value: 5,
	},
]

export const Default: Story = {
	args: {
		items,
		label: 'Mon label',
		uniqueId: 'amelipro-select-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproSelect
		v-model="model"
		:items="items"
		label="Mon label"
		unique-id="amelipro-select-id"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproSelect } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()

	const items = [
		{
			title: 'Lille',
			value: 1,
		},
		{
			title: 'Paris',
			value: 2,
		},
		{
			title: 'Bordeaux',
			value: 3,
		},
		{
			title: 'Tours',
			value: 4,
		},
		{
			title: 'Marseille',
			value: 5,
		},
	]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproSelect },
		setup() {
			const model = ref()

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproSelect
	v-bind="args"
	v-model="model"
/>`,
	}),

}

// --- Disabled ---
export const Disabled: Story = {
	args: {
		items,
		label: 'Select désactivé',
		uniqueId: 'amelipro-select-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le select est désactivé grâce à la prop <code>disabled</code>.</p>
  <AmeliproSelect
    v-model="model"
    :items="items"
    label="Select désactivé"
    unique-id="amelipro-select-disabled"
    disabled
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproSelect } from '@cnamts/synapse'
  const model = ref()
  const items = [
    { title: 'Lille', value: 1 },
    { title: 'Paris', value: 2 },
    { title: 'Bordeaux', value: 3 },
    { title: 'Tours', value: 4 },
    { title: 'Marseille', value: 5 },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproSelect },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le select est désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproSelect v-bind="args" v-model="model" />`,
	}),
}

// --- Required ---
export const Required: Story = {
	args: {
		items,
		label: 'Select obligatoire',
		uniqueId: 'amelipro-select-required',
		required: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le select est obligatoire grâce à la prop <code>required</code>.</p>
  <AmeliproSelect
    v-model="model"
    :items="items"
    label="Select obligatoire"
    unique-id="amelipro-select-required"
    required
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproSelect } from '@cnamts/synapse'
  const model = ref()
  const items = [
    { title: 'Lille', value: 1 },
    { title: 'Paris', value: 2 },
    { title: 'Bordeaux', value: 3 },
    { title: 'Tours', value: 4 },
    { title: 'Marseille', value: 5 },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproSelect },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le select est obligatoire grâce à la prop <code>required</code>.</p>
<AmeliproSelect v-bind="args" v-model="model" />`,
	}),
}

// --- Clearable ---
export const Clearable: Story = {
	args: {
		items,
		label: 'Select clearable',
		uniqueId: 'amelipro-select-clearable',
		clearable: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le select peut être vidé grâce à la prop <code>clearable</code>.</p>
  <AmeliproSelect
    v-model="model"
    :items="items"
    label="Select clearable"
    unique-id="amelipro-select-clearable"
    clearable
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproSelect } from '@cnamts/synapse'
  const model = ref()
  const items = [
    { title: 'Lille', value: 1 },
    { title: 'Paris', value: 2 },
    { title: 'Bordeaux', value: 3 },
    { title: 'Tours', value: 4 },
    { title: 'Marseille', value: 5 },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproSelect },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le select peut être vidé grâce à la prop <code>clearable</code>.</p>
<AmeliproSelect v-bind="args" v-model="model" />`,
	}),
}

// --- Placeholder ---
export const Placeholder: Story = {
	args: {
		items,
		label: 'Select avec placeholder',
		uniqueId: 'amelipro-select-placeholder',
		placeholder: 'Choisissez une ville',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le select affiche un placeholder grâce à la prop <code>placeholder</code>.</p>
  <AmeliproSelect
    v-model="model"
    :items="items"
    label="Select avec placeholder"
    unique-id="amelipro-select-placeholder"
    placeholder="Choisissez une ville"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproSelect } from '@cnamts/synapse'
  const model = ref()
  const items = [
    { title: 'Lille', value: 1 },
    { title: 'Paris', value: 2 },
    { title: 'Bordeaux', value: 3 },
    { title: 'Tours', value: 4 },
    { title: 'Marseille', value: 5 },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproSelect },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le select affiche un placeholder grâce à la prop <code>placeholder</code>.</p>
<AmeliproSelect v-bind="args" v-model="model" />`,
	}),
}

// --- Readonly ---
export const Readonly: Story = {
	args: {
		items,
		label: 'Select en lecture seule',
		uniqueId: 'amelipro-select-readonly',
		readonly: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le select est en lecture seule grâce à la prop <code>readonly</code>.</p>
  <AmeliproSelect
    v-model="model"
    :items="items"
    label="Select en lecture seule"
    unique-id="amelipro-select-readonly"
    readonly
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproSelect } from '@cnamts/synapse'
  const model = ref()
  const items = [
    { title: 'Lille', value: 1 },
    { title: 'Paris', value: 2 },
    { title: 'Bordeaux', value: 3 },
    { title: 'Tours', value: 4 },
    { title: 'Marseille', value: 5 },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproSelect },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le select est en lecture seule grâce à la prop <code>readonly</code>.</p>
<AmeliproSelect v-bind="args" v-model="model" />`,
	}),
}

// --- Horizontal ---
export const Horizontal: Story = {
	args: {
		items,
		label: 'Label horizontal',
		uniqueId: 'amelipro-select-horizontal',
		horizontal: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le label est affiché à l’horizontal grâce à la prop <code>horizontal</code>.</p>
  <AmeliproSelect
    v-model="model"
    :items="items"
    label="Label horizontal"
    unique-id="amelipro-select-horizontal"
    horizontal
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproSelect } from '@cnamts/synapse'
  const model = ref()
  const items = [
    { title: 'Lille', value: 1 },
    { title: 'Paris', value: 2 },
    { title: 'Bordeaux', value: 3 },
    { title: 'Tours', value: 4 },
    { title: 'Marseille', value: 5 },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproSelect },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le label est affiché à l’horizontal grâce à la prop <code>horizontal</code>.</p>
<AmeliproSelect v-bind="args" v-model="model" />`,
	}),
}

export const LabelInfo: Story = {
	args: {
		items,
		label: 'Label avec info-bulle',
		uniqueId: 'amelipro-select-labelinfo',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le slot <code>labelInfo</code> permet d’ajouter une info-bulle à droite du label.</p>
  <AmeliproSelect
    v-model="model"
    :items="items"
    label="Label avec info-bulle"
    unique-id="amelipro-select-labelinfo"
  >
    <template #labelInfo>
      <AmeliproTooltips
        tooltip-text="Info-bulle personnalisée"
        unique-id="amelipro-tooltip-id"
      />
    </template>
  </AmeliproSelect>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { ref } from 'vue'
  import { AmeliproSelect } from '@cnamts/synapse'
  import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'
  const model = ref()
  const items = [
    { title: 'Lille', value: 1 },
    { title: 'Paris', value: 2 },
    { title: 'Bordeaux', value: 3 },
    { title: 'Tours', value: 4 },
    { title: 'Marseille', value: 5 },
  ]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproSelect, AmeliproTooltips },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le slot <code>labelInfo</code> permet d’ajouter une info-bulle à droite du label.</p>
<AmeliproSelect v-bind="args" v-model="model">
  <template #labelInfo>
    <AmeliproTooltips
      tooltip-text="Info-bulle personnalisée"
      unique-id="amelipro-tooltip-id"
    />
  </template>
</AmeliproSelect>`,
	}),
}

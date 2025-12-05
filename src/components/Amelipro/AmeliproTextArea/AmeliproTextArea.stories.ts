import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproTextArea from './AmeliproTextArea.vue'

const meta = {
	argTypes: {
		'append': { description: 'Permet d\'ajouter un élément juste après le champ' },
		'required': {
			default: false,
			description: 'Défini que le champ est obligatoire',
			name: 'required',
			type: 'boolean',
		},
		'classes': { description: 'Classes à appliquer à la racine du composant' },
		'counter': { description: 'Défini la valeur du compteur de caractères' },
		'disabled': { description: 'Désactive le champ de texte' },
		'globalMaxWidth': { description: 'Gère la largeur maximale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalMinWidth': { description: 'Gère la largeur minimale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalWidth': { description: 'Gère la largeur du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'horizontal': { description: 'Passe le champ de texte au format horizontal' },
		'inputMaxWidth': { description: 'Gère la largeur maximale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'inputMinWidth': { description: 'Gère la largeur minimale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'label': { description: 'Défini le label du champ' },
		'labelInfo': { description: 'Permet d\'ajouter des infos à la suite du libellé du champ' },
		'labelMaxWidth': { description: 'Gère la largeur maximale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'labelMinWidth': { description: 'Gère la largeur minimale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'modelValue': { description: 'Défini la valeur du champ' },
		'readonly': { description: 'Passe le champ de texte en lecture seule' },
		'rules': {
			description: 'Liste des règles à respecter pour valider le champ',
			table: { type: { summary: 'ValidationRule[]' } },
		},
		'uniqueId': { description: 'Défini un id pour le champ' },
		'update:model-value': { description: 'Événement émis au changement du v-model' },
		'validateOn': { description: 'Défini le moment où la validation du champ se fait, voir la documentation de Vuetify pour plus d\'informtations' },
	},
	component: AmeliproTextArea,
	title: 'Composants/Amelipro/Formulaires/AmeliproTextArea',
} as Meta<typeof AmeliproTextArea>

export default meta

type Story = StoryObj<typeof AmeliproTextArea>

export const Default: Story = {
	args: {
		label: 'Mon label',
		uniqueId: 'text-area-example',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTextArea
		v-model="model"
		label="Label"
		unique-id="text-area-example"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextArea } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextArea },
		setup() {
			const model = ref()

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproTextArea
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Disabled: Story = {
	args: {
		label: 'Champ désactivé',
		uniqueId: 'text-area-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est désactivé grâce à la prop <code>disabled</code>.</p>
	<AmeliproTextArea
		v-model="model"
		label="Champ désactivé"
		unique-id="text-area-disabled"
		disabled
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextArea } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextArea },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le champ est désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproTextArea
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const LectureSeule: Story = {
	args: {
		label: 'Lecture seule',
		uniqueId: 'text-area-readonly',
		readonly: true,
		modelValue: 'Valeur en lecture seule',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est en lecture seule grâce à la prop <code>readonly</code>.</p>
	<AmeliproTextArea
		v-model="model"
		label="Lecture seule"
		unique-id="text-area-readonly"
		readonly
		model-value="Valeur en lecture seule"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextArea } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref('Valeur en lecture seule')
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextArea },
		setup() {
			const model = ref('Valeur en lecture seule')
			watch(() => args.modelValue, (newValue) => {
				model.value = String(newValue)
			})
			return { args, model }
		},
		template: `
<p>Le champ est en lecture seule grâce à la prop <code>readonly</code>.</p>
<AmeliproTextArea
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Required: Story = {
	args: {
		label: 'Champ obligatoire',
		uniqueId: 'text-area-required',
		required: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est obligatoire grâce à la prop <code>required</code>.</p>
	<AmeliproTextArea
		v-model="model"
		label="Champ obligatoire"
		unique-id="text-area-required"
		required
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextArea } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextArea },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le champ est obligatoire grâce à la prop <code>required</code>.</p>
<AmeliproTextArea
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const LargeurPersonnalisee: Story = {
	args: {
		label: 'Largeur personnalisée',
		uniqueId: 'text-area-largeur',
		globalWidth: '400px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La largeur du champ est fixée à 400px via la prop <code>globalWidth</code>.</p>
	<AmeliproTextArea
		v-model="model"
		label="Largeur personnalisée"
		unique-id="text-area-largeur"
		global-width="400px"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextArea } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextArea },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>La largeur du champ est fixée à 400px via la prop <code>globalWidth</code>.</p>
<AmeliproTextArea
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Horizontal: Story = {
	args: {
		label: 'Affichage horizontal',
		uniqueId: 'text-area-horizontal',
		horizontal: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est affiché en horizontal grâce à la prop <code>horizontal</code>.</p>
	<AmeliproTextArea
		v-model="model"
		label="Affichage horizontal"
		unique-id="text-area-horizontal"
		horizontal
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextArea } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextArea },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le champ est affiché en horizontal grâce à la prop <code>horizontal</code>.</p>
<AmeliproTextArea
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Validation: Story = {
	args: {
		label: 'Validation personnalisée',
		uniqueId: 'text-area-validation',
		rules: [
			v => !!v || 'Ce champ est obligatoire',
			v => (v ? typeof v === 'string' && v.startsWith('B') : true) || 'La valeur doit commencer par "B"',
		],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Ce champ est obligatoire et la valeur doit commencer par la lettre "B".</p>
	<AmeliproTextArea
		v-model="model"
		label="Validation personnalisée"
		unique-id="text-area-validation"
		:rules="[
			v => !!v || 'Ce champ est obligatoire',
			v => (v ? v.startsWith('B') : true) || 'La valeur doit commencer par "B"',
		]"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextArea } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextArea },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Ce champ est obligatoire et la valeur doit commencer par la lettre "B".</p>
<AmeliproTextArea
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const LargeurLabel: Story = {
	args: {
		label: 'Un très long label dont la largeur est personnalisée',
		uniqueId: 'text-area-label-width',
		labelMaxWidth: '200px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La largeur du label est fixée à 200px via la prop <code>labelMaxWidth</code>.</p>
	<AmeliproTextArea
		v-model="model"
		label="Un très long label dont la largeur est personnalisée"
		unique-id="text-area-label-width"
		label-max-width="200px"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextArea } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextArea },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>La largeur du label est fixée à 200px via la prop <code>labelMaxWidth</code>.</p>
<AmeliproTextArea
	v-bind="args"
	v-model="model"
/>`,
	}),
}

import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproAutoCompleteField from './AmeliproAutoCompleteField.vue'

const meta = {
	argTypes: {
		'required': { description: 'Défini le champ comme étant obligatoire' },
		'classes': { description: 'Permet d’ajouter des classes au wrapper du composant' },
		'disabled': { description: 'Défini le champ comme désactivé' },
		'globalMaxWidth': { description: 'Gère la largeur maximale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalMinWidth': { description: 'Gère la largeur minimale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalWidth': { description: 'Gère la largeur du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'hideErrorMessage': { description: 'Masque ou affiche le message d’erreur, si la valeur est à "auto" le message ne sera rendu que s’il y en a un' },
		'horizontal': { description: 'Change l’affichage du champ pour qu’il soit horizontal' },
		'inputMaxWidth': { description: 'Gère la largeur maximale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'inputMinWidth': { description: 'Gère la largeur minimale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'items': { description: 'Contenu de la liste d’autocomplétion' },
		'label': { description: 'Défini le label du champ' },
		'labelMaxWidth': { description: 'Gère la largeur maximale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'labelMinWidth': { description: 'Gère la largeur minimale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'modelValue': { description: 'valeur du champ' },
		'placeholder': { description: 'Défini le placeholder du champ' },
		'readonly': { description: 'Défini que le champ est en lecture seule' },
		'rules': { description: 'Liste des règles à respecter pour valider le champ' },
		'uniqueId': { description: 'Défini un id pour le champ' },
		'update:menu': { description: 'Event émis au changement d’état de la liste d’autocomplétion' },
		'validateOn': { description: 'Défini le moment où la validation du champ se fait, voir la documentation de Vuetify pour plus d’informtations' },
	},
	component: AmeliproAutoCompleteField,
	title: 'Composants/Amelipro/Formulaires/AmeliproAutoCompleteField',
} as Meta<typeof AmeliproAutoCompleteField>
export default meta

type Story = StoryObj<typeof AmeliproAutoCompleteField>

const items = [
	{
		title: 'Bordeaux',
		value: 'Bordeaux',
	},
	{
		title: 'Bagnolet',
		value: 'Bagnolet',
	},
	{
		title: 'Bagneux',
		value: 'Bagneux',
	},
	{
		title: 'Arcachon',
		value: 'Arcachon',
	},
	{
		title: 'Paris',
		value: 'Paris',
	},
	{
		title: 'Lille',
		value: 'Lille',
	},
	{
		title: 'Lyon',
		value: 'Lyon',
	},
	{
		title: 'Brest',
		value: 'Brest',
	},
	{
		title: 'Marseille',
		value: 'Marseille',
	},
	{
		title: 'Toulouse',
		value: 'Toulouse',
	},
]

export const Default: Story = {
	args: {
		items,
		label: 'Mon label',
		uniqueId: 'amelipro-auto-complete-field-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-id"
		label="Mon label"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [
		{
			title: 'Bordeaux',
			value: 'Bordeaux',
		},
		{
			title: 'Bagnolet',
			value: 'Bagnolet',
		},
		{
			title: 'Bagneux',
			value: 'Bagneux',
		},
		{
			title: 'Arcachon',
			value: 'Arcachon',
		},
		{
			title: 'Paris',
			value: 'Paris',
		},
		{
			title: 'Lille',
			value: 'Lille',
		},
		{
			title: 'Lyon',
			value: 'Lyon',
		},
		{
			title: 'Brest',
			value: 'Brest',
		},
		{
			title: 'Marseille',
			value: 'Marseille',
		},
		{
			title: 'Toulouse',
			value: 'Toulouse',
		},
	];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}
export const AvecPlaceholder: Story = {
	args: {
		items,
		label: 'Avec placeholder',
		uniqueId: 'amelipro-auto-complete-field-placeholder',
		placeholder: 'Commencez à taper une ville…',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Un texte d’aide s’affiche dans le champ grâce à la prop <code>placeholder</code>.</p>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-placeholder"
		label="Avec placeholder"
		placeholder="Commencez à taper une ville…"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Un texte d’aide s’affiche dans le champ grâce à la prop <code>placeholder</code>.</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const MasquerErreur: Story = {
	args: {
		items,
		label: 'Masquage du message d’erreur',
		uniqueId: 'amelipro-auto-complete-field-hide-error',
		required: true,
		hideErrorMessage: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le message d’erreur ne s’affiche pas grâce à la prop <code>hideErrorMessage</code>.</p>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-hide-error"
		label="Masquage du message d’erreur"
		required: true,
		hide-error-message
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Le message d’erreur ne s’affiche pas grâce à la prop <code>hideErrorMessage</code>.</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const LargeurLabel: Story = {
	args: {
		items,
		label: 'Un très long label dont la largeur est personnalisée',
		uniqueId: 'amelipro-auto-complete-field-label-width',
		labelMaxWidth: '200px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La largeur du label est fixée à 200px via la prop <code>labelMaxWidth</code>.</p>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-label-width"
		label="Un très long label dont la largeur est personnalisée"
		label-max-width="200px"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>La largeur du label est fixée à 200px via la prop <code>labelMaxWidth</code>.</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}
export const LectureSeule: Story = {
	args: {
		items,
		label: 'Lecture seule',
		uniqueId: 'amelipro-auto-complete-field-readonly',
		readonly: true,
		modelValue: 'Bordeaux',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est en lecture seule grâce à la prop <code>readonly</code>.</p>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-readonly"
		label="Lecture seule"
		readonly
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref('Bordeaux');

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref('Bordeaux')
			watch(() => args.modelValue, (newValue) => {
				model.value = String(newValue)
			})
			return { args, model }
		},
		template: `
<p>Le champ est en lecture seule grâce à la prop <code>readonly</code>.</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}
export const LargeurPersonnalisee: Story = {
	args: {
		items,
		label: 'Largeur personnalisée',
		uniqueId: 'amelipro-auto-complete-field-largeur',
		globalWidth: '400px',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>La largeur du champ est fixée à 400px via la prop <code>globalWidth</code>.</p>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-largeur"
		label="Largeur personnalisée"
		global-width="400px"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>La largeur du champ est fixée à 400px via la prop <code>globalWidth</code>.</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Disabled: Story = {
	args: {
		items,
		label: 'Champ désactivé',
		uniqueId: 'amelipro-auto-complete-field-disabled',
		disabled: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est désactivé grâce à la prop <code>disabled</code>.</p>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-disabled"
		label="Champ désactivé"
		disabled
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p>Le champ est désactivé grâce à la prop <code>disabled</code>.</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Required: Story = {
	args: {
		items,
		label: 'Champ obligatoire',
		uniqueId: 'amelipro-auto-complete-field-required',
		required: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est obligatoire grâce à la prop <code>required</code>.</p>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-required"
		label="Champ obligatoire"
		required
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p>Le champ est obligatoire grâce à la prop <code>required</code>.</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}
export const Horizontal: Story = {
	args: {
		items,
		label: 'Affichage horizontal',
		uniqueId: 'amelipro-auto-complete-field-horizontal',
		horizontal: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Le champ est affiché en horizontal grâce à la prop <code>horizontal</code>.</p>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-horizontal"
		label="Affichage horizontal"
		horizontal
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p>Le champ est affiché en horizontal grâce à la prop <code>horizontal</code>.</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>`,
	}),
}

export const Validation: Story = {
	args: {
		items,
		label: 'Validation personnalisée',
		uniqueId: 'amelipro-auto-complete-field-validation',
		required: true,
		rules: [
			v => (v ? typeof v === 'string' && v.startsWith('B') : true) || 'La valeur doit commencer par "B"',
		],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<p>Ce champ est obligatoire et la valeur doit commencer par la lettre "B".</p>
<template>
	<AmeliproAutoCompleteField
		v-model="model"
		:items="items"
		unique-id="amelipro-auto-complete-field-validation"
		label="Validation personnalisée"
		required: true,
		:rules="[
			v => (v ? v.startsWith('B') : true) || 'La valeur doit commencer par "B"',
		]"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAutoCompleteField } from '@cnamts/synapse';
	import { ref } from 'vue';

	const model = ref();

	const items = [/* ... */];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAutoCompleteField },
		setup() {
			const model = ref()
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<p>Ce champ est obligatoire et la valeur doit commencer par la lettre "B".</p>
<AmeliproAutoCompleteField
	v-bind="args"
	v-model="model"
/>
`,
	}),
}

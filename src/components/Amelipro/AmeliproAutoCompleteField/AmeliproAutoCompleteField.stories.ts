import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproAutoCompleteField from './AmeliproAutoCompleteField.vue'

const meta = {
	argTypes: {
		'ariaRequired': { description: 'Défini le champ comme étant obligatoire' },
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
	import AmeliproAutoCompleteField from '@cnamts/synapse';
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

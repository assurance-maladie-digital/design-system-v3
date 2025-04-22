import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproSelect from './AmeliproSelect.vue'
import type { SelectItem } from './types'

const meta = {
	argTypes: {
		'append': { description: 'Slot permettant d’ajouter des éléments à la suite du champs (à droite)' },
		'ariaRequired': { description: 'Passe le select en required' },
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
	import AmeliproSelect from '@amelipro/amelipro-vue3';
	import { ref } from 'vue';

	const model = ref();

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
	];
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

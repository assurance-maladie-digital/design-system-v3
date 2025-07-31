import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproCustomSelector from './AmeliproCustomSelector.vue'
import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'

const meta = {
	argTypes: {
		'ariaRequired': { description: 'Permet de rendre la selection obligatoire d’au moins une option' },
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
		'requiredErrorMessage': { description: 'Message d’erreur affiché lorsque la props ariaRequired est active' },
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
	>
		<template #labelInfo>
			<AmeliproTooltips
				class="ml-2"
				tooltip-text="contenu de la tooltip"
				unique-id="ma-tooltip"
			/>
		</template>
	</AmeliproCustomSelector>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue';
	import { AmeliproCustomSelector, AmeliproTooltips } from '@cnamts/synapse';

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
		components: { AmeliproCustomSelector, AmeliproTooltips },
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
>
	<template #labelInfo>
		<AmeliproTooltips
			class="ml-2"
			tooltip-text="contenu de la tooltip"
			unique-id="ma-tooltip"
		/>
	</template>
</AmeliproCustomSelector>`,
	}),
}

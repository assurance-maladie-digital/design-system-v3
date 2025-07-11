import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproIllustratedRadioGroup from './AmeliproIllustratedRadioGroup.vue'

const meta = {
	argTypes: {
		'ariaRequired': { description: 'Permet de rendre la selection obligatoire' },
		'change:selected': { description: 'Événement émis au click sur un bouton radio retourne la valeur sélectionnée' },
		'disabled': { description: 'Permet de désactiver le groupe de boutons radios' },
		'error': { description: 'Permet de mettre le champ en erreur' },
		'groupLabel': { description: 'Libellé du groupe de boutons radios' },
		'iconSize': { description: 'Taille des icones dans le groupe' },
		'labelInfo': { description: 'Slot pour ajouter une tooltip après le label du groupe si besoin' },
		'modelValue': {
			description: 'Tableau d’objets qui permet de générer les boutons radios',
			table: {
				type: {
					detail: `Array<{
	icon: string;
    iconDefaultColor: string;
	isChecked: boolean;
    label: string;
    value: string;
}[]>`,
					summary: 'AmeliproIllustratedRadioGroupItem[]',
				},
			},
		},
		'uniqueId': { description: 'Id du groupe de boutons radios, il doit être unique' },
		'update:model-value': {
			action: 'update:model-value',
			description: 'Événement émis au changement du v-model',
		},
	},
	component: AmeliproIllustratedRadioGroup,
	title: 'Composants/Amelipro/Formulaires/AmeliproIllustratedRadioGroup',
} as Meta<typeof AmeliproIllustratedRadioGroup>

export default meta

type Story = StoryObj<typeof AmeliproIllustratedRadioGroup>

const items = [
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-yellow',
		isChecked: false,
		label: '1',
		value: 'Valeur 1',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-green',
		isChecked: false,
		label: '2',
		value: 'Valeur 2',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-red',
		isChecked: false,
		label: '3',
		value: 'Valeur 3',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-yellow',
		isChecked: false,
		label: '4',
		value: 'Valeur 4',
	},
	{
		icon: 'vaccination',
		iconDefaultColor: 'ap-yellow',
		isChecked: false,
		label: '5',
		value: 'Valeur 5',
	},
]

export const Default: Story = {
	args: {
		groupLabel: 'Libellé du groupe',
		modelValue: items,
		uniqueId: 'unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproIllustratedRadioGroup
		v-model="value"
		group-label="Libellé du groupe"
		unique-id="unique-id"
		@update:model-value="args['update:model-value']"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `
<script setup lang="ts">
	import { inject, ref } from 'vue'
	import { AmeliproIllustratedRadioGroup } from '@cnamts/synapse'

	const value = ref([
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-yellow',
			isChecked: false,
			label: '1',
			value: 'Valeur 1',
		},
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-green',
			isChecked: false,
			label: '2',
			value: 'Valeur 2',
		},
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-red',
			isChecked: false,
			label: '3',
			value: 'Valeur 3',
		},
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-yellow',
			isChecked: false,
			label: '4',
			value: 'Valeur 4',
		},
		{
			icon: 'vaccination',
			iconDefaultColor: 'ap-yellow',
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
		components: { AmeliproIllustratedRadioGroup },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproIllustratedRadioGroup
	v-bind="args"
	v-model="model"
	@update:model-value="args['update:model-value']"
/>`,
	}),
}

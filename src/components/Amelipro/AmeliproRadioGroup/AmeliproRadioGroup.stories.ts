import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproRadioGroup from './AmeliproRadioGroup.vue'

const meta = {
	argTypes: {
		'`append-${index}`': { description: 'Permet de rajouter un élément après le label des boutons radios, il y a un slot par item de la liste' },
		'`subItem-${index}`': { description: 'Permet de rajouter un élément sous un bouton radio seulement lorsqu’il est coché (existe seulement si les props horizontal et fullHorizontal sont à false)' },
		'append': { description: 'Permet de rajouter un élément générique après le label des boutons radios' },
		'ariaRequired': { description: 'Permet de rendre la selection obligatoire' },
		'change:selected': { description: 'Événement émis au click sur un bouton radio retourne la valeur sélectionnée' },
		'disabled': { description: 'Permet de désactiver le groupe de boutons radios' },
		'error': { description: 'Permet de mettre le champ en erreur' },
		'fullHorizontal': { description: 'Permet d’afficher le radioGroup ainsi que le titre a l’horizontal' },
		'groupLabel': { description: 'Libellé du groupe de boutons radios' },
		'hiddenLabel': { description: 'Permet de masquer le label du groupe de checkbox, dans une démarche d’amélioration de l’accessibilité, il est recommandé de ne pas utiliser cette property dans la mesure du possible' },
		'horizontal': { description: 'Permet d’afficher le radioGroup à l’horizontal' },
		'horizontalLabel': { description: 'Permet d’afficher le radioGroup avec le label à l’horizontal tout en gardant les boutons radios sous forme de colonnes' },
		'labelInfo': { description: 'Slot pour ajouter une tooltip après le label du groupe si besoin' },
		'modelValue': {
			description: 'Tableau d’objets qui permet de générer les boutons radios',
			table: {
				type: {
					detail: `Array<{
	isChecked: boolean;
	label: string;
    value: string;
}[]>`,
					summary: 'AmeliproRadioGroupItem[]',
				},
			},
		},
		'pills': { description: 'Change le style du groupe de bouttons radio' },
		'requiredErrorMessage': { description: 'Message d’erreur qui s’affiche si le champ est obligatoire et qu’aucune valeur n’est sélectionnée' },
		'subItem': { description: 'Permet de rajouter un élément générique sous un bouton radio seulement lorsqu’il est coché (existe seulement si les props horizontal et fullHorizontal sont à false)' },
		'uniqueId': { description: 'Id du groupe de boutons radios, il doit être unique' },
		'update:model-value': {
			action: 'update:model-value',
			description: 'Événement émis au changement du v-model',
		},
	},
	component: AmeliproRadioGroup,
	title: 'Composants/Amelipro/Formulaires/AmeliproRadioGroup',
} as Meta<typeof AmeliproRadioGroup>

export default meta

type Story = StoryObj<typeof AmeliproRadioGroup>

const items = [
	{
		isChecked: false,
		label: '1',
		value: 'Valeur 1',
	},
	{
		isChecked: false,
		label: '2',
		value: 'Valeur 2',
	},
	{
		isChecked: true,
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
		groupLabel: 'Libellé du groupe',
		modelValue: items,
		uniqueId: 'radio-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproRadioGroup
		v-model="items"
		group-label="Libellé du groupe"
		unique-id="radio-id"
		@update:model-value="args['update:model-value']"
	/>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue';

	const items = ref([
		{
			isChecked: false,
			label: '1',
			value: 'Valeur 1',
		},
		{
			isChecked: false,
			label: '2',
			value: 'Valeur 2',
		},
		{
			isChecked: true,
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
	]);
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproRadioGroup },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
<AmeliproRadioGroup
	v-bind="args"
	v-model="model"
	@update:model-value="args['update:model-value']"
/>`,
	}),
}

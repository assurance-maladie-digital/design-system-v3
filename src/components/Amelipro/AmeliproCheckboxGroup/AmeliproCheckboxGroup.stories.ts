import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproCheckboxGroup from './AmeliproCheckboxGroup.vue'
import AmeliproTooltips from '../AmeliproTooltips/AmeliproTooltips.vue'

const meta = {
	argTypes: {
		'`append-${index}`': { description: 'Permet de rajouter un élément après le label des checkbox, il y a un slot par item de la liste' },
		'`subItem-${index}`': { description: 'Permet de rajouter un élément sous une checkbox seulement lorsqu’elle est cochée (existe seulement si les props horizontal et fullHorizontal sont à false)' },
		'append': { description: 'Permet de rajouter un élément après les label de toutes les checkbox' },
		'ariaRequired': { description: 'Permet de rendre la selection obligatoire' },
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
		'requiredErrorMessage': { description: 'Message d’erreur affiché lorsque la props ariaRequired est active' },
		'subItem': { description: 'Permet de rajouter un élément sous toutes checkbox seulement lorsqu’elle sont cochées (existe seulement si les props horizontal et fullHorizontal sont à false)' },
		'uniqueId': { description: 'Id unique du groupe de checkbox' },
		'update:model-value': { description: 'Événement émis au changement du v-model' },
	},
	component: AmeliproCheckboxGroup,
	title: 'Composants/Amelipro/Formulaires/AmeliproCheckboxGroup',
} as Meta<typeof AmeliproCheckboxGroup>

export default meta

type Story = StoryObj<typeof AmeliproCheckboxGroup>

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
				class="ml-2"
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
	import { ref } from 'vue';

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
	]);
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
			class="ml-2"
			tooltip-text="contenu de la tooltip"
			unique-id="ma-tooltip"
		/>
	</template>
</AmeliproCheckboxGroup>`,
	}),
}

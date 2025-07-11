import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproTextArea from './AmeliproTextArea.vue'

const meta = {
	argTypes: {
		'append': { description: 'Permet d\'ajouter un élément juste après le champ' },
		'ariaRequired': {
			default: false,
			description: 'Défini que le champ est obligatoire',
			name: 'aria-required',
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
		'update:model-value': {
			action: 'update:model-value',
			description: 'Événement émis au changement du v-model',
		},
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
		@update:model-value="args['update:model-value']"
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
	@update:model-value="args['update:model-value']"
/>`,
	}),
}

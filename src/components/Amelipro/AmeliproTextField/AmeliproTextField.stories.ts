import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproTextField from './AmeliproTextField.vue'

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
		'clearable': { description: 'Affiche un bouton permettant de vider le champ' },
		'counter': { description: 'Défini la valeur du compteur de caractères' },
		'disabled': { description: 'Désactive le champ de texte' },
		'fullWidthErrorMsg': { description: 'Donne au messages d’erreurs la largeur totale du composant au lieu de la limiter à la largeur du champ' },
		'globalMaxWidth': { description: 'Gère la largeur maximale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalMinWidth': { description: 'Gère la largeur minimale du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'globalWidth': { description: 'Gère la largeur du composant, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'hideErrorMessage': { description: 'Masque ou affiche le message d’erreur, si la valeur est à "auto" le message ne sera rendu que s’il y en a un' },
		'horizontal': { description: 'Passe le champ au format horizontal' },
		'inputMaxWidth': { description: 'Gère la largeur maximale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'inputMinWidth': { description: 'Gère la largeur minimale du champ, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'label': { description: 'Défini le label du champ' },
		'labelInfo': { description: 'Permet d\'ajouter des infos à la suite du libellé du champ' },
		'labelMaxWidth': { description: 'Gère la largeur maximale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'labelMinWidth': { description: 'Gère la largeur minimale du label, attend une valeur et une unité valide css (ex : 400px ou 25%)' },
		'maxDate': { description: 'Date limite maximale pour le champ (uniquement si type date), format attendu YYYY-MM-DD' },
		'maxNumber': { description: 'Nombre maximal pour le champ (uniquement si type number)' },
		'messagesToDisplay': { description: 'Messages à afficher' },
		'minDate': { description: 'Date limite minimale pour le champ (uniquement si type date), format attendu YYYY-MM-DD' },
		'minNumber': { description: 'Nombre minimal pour le champ (uniquement si type number)' },
		'modelValue': { description: 'Défini la valeur du champ' },
		'placeholder': { description: 'Placeholder du champ' },
		'readonly': { description: 'Passe le champ de texte en lecture seule' },
		'rules': {
			description: 'Liste des règles à respecter pour valider le champ',
			table: { type: 'ValidationRule[]' },
		},
		'type': { description: 'Type du champ' },
		'uniqueId': { description: 'Défini un id pour le champ' },
		'update:model-value': {
			action: 'update:model-value',
			description: 'Événement émis au changement du v-model',
		},
		'validateOn': { description: 'Défini le moment où la validation du champ se fait, voir la documentation de Vuetify pour plus d’informtations' },
	},
	component: AmeliproTextField,
	title: 'Composants/Amelipro/Formulaires/AmeliproTextField',
} as Meta<typeof AmeliproTextField>

export default meta

type Story = StoryObj<typeof AmeliproTextField>

export const Default: Story = {
	args: {
		label: 'Mon label',
		modelValue: '',
		uniqueId: 'text-example',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTextField
		v-model="model"
		label="Label"
		unique-id="text-example"
		@update:model-value="args['update:model-value']"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
			<AmeliproTextField
				v-bind="args"
				v-model="model"
			/>
		`,
	}),
}

export const Date: Story = {
	args: {
		ariaRequired: true,
		label: 'Mon label',
		maxDate: '2024-02-20',
		minDate: '2024-01-20',
		modelValue: '',
		type: 'date',
		uniqueId: 'date-example',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTextField
		v-model="model"
		aria-required
		class="mt-2"
		label="Mon label"
		max-date="2024-02-20"
		min-date="2024-01-20"
		type="date"
		unique-id="date-example"
		@update:model-value="args['update:model-value']"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
			<AmeliproTextField
				:aria-required="args.ariaRequired"
				class="mt-2"
				:label="args.label"
				:max-date="args.maxDate"
				:min-date="args.minDate"
				:type="args.type"
				:unique-id="args.id"
				v-bind="args"
				v-model="model"
				@update:model-value="args['update:model-value']"
			/>
		`,
	}),
}

export const Number: Story = {
	args: {
		ariaRequired: true,
		label: 'Mon label',
		maxNumber: '10',
		minNumber: '0',
		modelValue: '',
		type: 'number',
		uniqueId: 'number-example',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTextField
		v-model="model"
		aria-required
		class="mt-2"
		label="Mon label"
		max-number="10"
		min-number="0"
		type="number"
		unique-id="number-example"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTextField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref()
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTextField },
		setup() {
			const model = ref()

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
			<AmeliproTextField
				v-bind="args"
				:aria-required="args.ariaRequired"
				class="mt-2"
				:label="args.label"
				:max-number="args.maxNumber"
				:min-number="args.minNumber"
				:type="args.type"
				:uniqueId="args.id"
				v-model="model"
			/>
		`,
	}),
}

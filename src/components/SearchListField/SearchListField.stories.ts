import type { StoryObj, Meta } from '@storybook/vue3-vite'
import SearchListField from './SearchListField.vue'
import { fn } from 'storybook/test'

const meta = {
	title: 'Composants/Filtres/SearchListField',
	component: SearchListField,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['filteredItems', 'search', 'emitChangeEvent', 'onUpdate:modelValue'] },
	},
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	argTypes: {
		locales: {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (titre de la liste et compteur d\'éléments). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant. La prop accepte un objet partiel : seules les clés renseignées surchargent les valeurs par défaut, le reste est conservé.',
			control: 'object',
			table: {
				type: { summary: 'object', detail: `{
	searchListTitle: string,
	nbItems: (count: number) => string,
}` },
				category: 'props',
			},
		},
		modelValue: {
			default: '[]',
		},
		items: { control: { type: 'object' } },
		returnObject: {
			description: 'Si true, retourne l\'objet entier au lieu de la valeur',
			control: 'boolean',
		},
		label: {
			description: 'Label du champ de recherche',
			control: 'text',
			default: 'Rechercher',
		},
		listLabel: {
			description: 'Legend pour le fieldset contenant la liste des éléments sélectionnables',
			control: 'text',
			default: 'Liste des éléments',
		},
	},
} satisfies Meta<typeof SearchListField>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Story par défaut
 */
export const Default: Story = {
	args: {
		'modelValue': [],
		'items': [
			{
				label: 'Chirurgien-dentiste',
				value: 'chirurgien-dentiste',
			},
			{
				label: 'Infirmier',
				value: 'infirmier',
			},
			{
				label: 'Orthophoniste',
				value: 'orthophoniste',
			},
			{
				label: 'Orthoptiste',
				value: 'orthoptiste',
			},
			{
				label: 'Pédicure-podologue',
				value: 'pedicure-podologue',
			},
			{
				label: 'Pharmacien',
				value: 'pharmacien',
			},
		],
		'label': 'Filtrer la liste des professions',
		'listLabel': 'Choisisser parmi la liste des professions',
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { SearchListField },
			setup() {
				return { args }
			},
			template: `
                <div>
                    <SearchListField v-bind="args" v-model="args.modelValue"/>
                    <div style="margin-top: 20px;">
                        <strong>Valeur(s) sélectionnée(s) :</strong>
                        <pre>{{ args.modelValue }}</pre>
                    </div>
                </div>
            `,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SearchListField
   	v-model="modelValue"
	:items="items"
	label="Filtrer la liste des professions"
  />
  {{ modelValue }}
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SearchListField } from '@cnamts/synapse'

const modelValue = ref([])

const items = [
  {
	label: 'Chirurgien-dentiste',
	value: 'chirurgien-dentiste',
  },
  {
	label: 'Infirmier',
	value: 'infirmier',
  },
  {
	label: 'Orthophoniste',
	value: 'orthophoniste',
  },
  {
	label: 'Orthoptiste',
	value: 'orthoptiste',
  },
  {
	label: 'Pédicure-podologue',
	value: 'pedicure-podologue',
  },
  {
	label: 'Pharmacien',
	value: 'pharmacien',
  },
]
</script>
        `,
			},
		],
	},
}

export const WithReturnObject: Story = {
	args: {
		'modelValue': [],
		'returnObject': true,
		'items': [
			{
				label: 'Chirurgien-dentiste',
				value: 'chirurgien-dentiste',
			},
			{
				label: 'Infirmier',
				value: 'infirmier',
			},
			{
				label: 'Orthophoniste',
				value: 'orthophoniste',
			},
			{
				label: 'Orthoptiste',
				value: 'orthoptiste',
			},
			{
				label: 'Pédicure-podologue',
				value: 'pedicure-podologue',
			},
			{
				label: 'Pharmacien',
				value: 'pharmacien',
			},
		],
		'label': 'Filtrer la liste des professions',
		'listLabel': 'Choisisser parmi la liste des professions',
		'onUpdate:modelValue': fn(),
	},
	argTypes: {
		returnObject: { control: false },
	},
	render: (args) => {
		return {
			components: { SearchListField },
			setup() {
				return { args }
			},
			template: `
				<div>
					<SearchListField v-bind="args" v-model="args.modelValue"/>
					<div style="margin-top: 20px;">
						<strong>Valeur(s) sélectionnée(s) :</strong>
						<pre>{{ args.modelValue }}</pre>
					</div>
				</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SearchListField
	v-model="modelValue"
	:items="items"
	label="Filtrer la liste des professions"
	:return-object="true"
  />
  {{ modelValue }}
</template>
		`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SearchListField } from '@cnamts/synapse'

const modelValue = ref([])

const items = [
  {
	label: 'Chirurgien-dentiste',
	value: 'chirurgien-dentiste',
  },
  {
	label: 'Infirmier',
	value: 'infirmier',
  },
  // ... autres objets
]
</script>
		`,
			},
		],
	},
}

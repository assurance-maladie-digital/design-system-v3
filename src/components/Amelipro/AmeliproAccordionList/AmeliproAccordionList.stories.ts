import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordionList from './AmeliproAccordionList.vue'
import type { IDataListItem } from '../types'

const meta = {
	argTypes: {
		'`accordionContent-${accordion.id}`': { description: 'Slot individuel pour le contenu des accordéons' },
		'`headingContent-${accordion.id}`': { description: 'Slot individuel pour la partie droite du header des accordéons' },
		'accordionContent': { description: 'Slot générique permettant de donner le même aspect à tout le contenu des accordéons' },
		'change:pagination-select': {
			description: 'Événement émis sur le change du select de nombre de résultat par page',
			type: 'void',
		},
		'change:sort-select': {
			description: 'Événement émis sur le change du select de tri de la liste. Retourne la valeur de l’option sélectionnée',
			type: 'string | number',
		},
		'click': {
			description: 'Événement émis au click sur la pagination',
			type: 'void',
		},
		'counterLabel': { description: 'Label du compteur de résultats en haut de la liste de résultats' },
		'defaultItemOpened': { description: 'Index du bloc dépliant ouvert par défaut' },
		'groupBorderColor': { description: 'Couleur des bordures des blocs dépliants' },
		'groupBordered': { description: 'Défini des bordure sur les blocs dépliants' },
		'groupColor': { description: 'Couleur de fond des blocs dépliants' },
		'headingContent': { description: 'Slot générique permettant de donner le même aspect à toutes les parties droite du header des accordéons' },
		'hiddenLabels': { description: 'Masque les labels des champs select' },
		'hideSeparator': { description: 'Masque le séparateur entre le titre et le contenu des panneaux dépliants' },
		'items': {
			description: 'Tableau comprenant la liste des résultats',
			table: {
				type: {
					detail: `Array<{
	accordionTitle: string,
	id: number,
	[key: string]: string
}>`,
					summary: 'IDataListItem[]',
				},
			},
		},
		'itemsToDisplayDesktop': { description: 'Nombre d’éléments affichés par page en desktop par défaut' },
		'itemsToDisplayMobile': { description: 'Nombre d’éléments affichés par page en mobile par défaut' },
		'noResultListInfos': { description: 'Masques les informations et les filtres au-dessus de la liste de résultats' },
		'paginationSelectLabel': { description: 'Label du select de pagination' },
		'paginationSelectPlaceholder': { description: 'Placeholder du select de pagination' },
		'sortSelectItems': { description: 'Items du select dédié aux tris' },
		'sortSelectLabel': { description: 'Label du select de tri' },
		'sortSelectPlaceholder': { description: 'Placeholder du select de tri' },
		'title': { description: 'Titre de la liste' },
		'titleLevel': { description: 'Niveau de titre des items de la liste' },
		'titleUppercase': { description: 'Défini si les titres des accordéons sont affichés en lettres capitales' },
		'uniqueId': { description: 'Identifiant unique de la liste' },

	},
	component: AmeliproAccordionList,
	title: 'Composants/Amelipro/Listes de résultats/AmeliproAccordionList',
} as Meta<typeof AmeliproAccordionList>

export default meta

type Story = StoryObj<typeof AmeliproAccordionList>

const items: IDataListItem[] = [
	{
		accordionTitle: 'Titre 1',
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 0,
		name: 'Bernard',
	},
	{
		accordionTitle: 'Titre 2',
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 1,
		name: 'Pierre',
	},
	{
		accordionTitle: 'Titre 3',
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 2,
		name: 'Souris',
	},
	{
		accordionTitle: 'Titre 4',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 3,
		name: 'Jabot',
	},
	{
		accordionTitle: 'Titre 5',
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 4,
		name: 'Bernard',
	},
	{
		accordionTitle: 'Titre 6',
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 5,
		name: 'Pierre',
	},
	{
		accordionTitle: 'Titre 7',
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 6,
		name: 'Souris',
	},
	{
		accordionTitle: 'Titre 8',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 7,
		name: 'Jabot',
	},
	{
		accordionTitle: 'Titre 9',
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 8,
		name: 'Bernard',
	},
	{
		accordionTitle: 'Titre 10',
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 9,
		name: 'Pierre',
	},
	{
		accordionTitle: 'Titre 11',
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 10,
		name: 'Souris',
	},
	{
		accordionTitle: 'Titre 12',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 11,
		name: 'Jabot',
	},
]

export const Default: Story = {
	args: {
		items,
		title: 'Exemple de liste de résultats',
		uniqueId: 'amelipro-accordion-list-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordionList
		:items="items"
		title="Exemple de liste de résultats"
		unique-id="amelipro-accordion-list-unique-id"
		v-bind="args"
	>
		<template #headingContent="item">
			<p class="mb-0">
				{{ item.firstname }} {{ item.name }}
			</p>
		</template>

		<template #accordionContent="item">
			<p class="mb-0">
				{{ item.email }}
			</p>
		</template>
	</AmeliproAccordionList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAccordionList } from '@cnamts/synapse'

	const items = [
		{
			accordionTitle: 'Titre 1',
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 0,
			name: 'Bernard',
		},
		{
			accordionTitle: 'Titre 2',
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 1,
			name: 'Pierre',
		},
		{
			accordionTitle: 'Titre 3',
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 2,
			name: 'Souris',
		},
		{
			accordionTitle: 'Titre 4',
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 3,
			name: 'Jabot',
		},
		{
			accordionTitle: 'Titre 5',
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 4,
			name: 'Bernard',
		},
		{
			accordionTitle: 'Titre 6',
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 5,
			name: 'Pierre',
		},
		{
			accordionTitle: 'Titre 7',
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 6,
			name: 'Souris',
		},
		{
			accordionTitle: 'Titre 8',
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 7,
			name: 'Jabot',
		},
		{
			accordionTitle: 'Titre 9',
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 8,
			name: 'Bernard',
		},
		{
			accordionTitle: 'Titre 10',
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 9,
			name: 'Pierre',
		},
		{
			accordionTitle: 'Titre 11',
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 10,
			name: 'Souris',
		},
		{
			accordionTitle: 'Titre 12',
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 11,
			name: 'Jabot',
		},
	]
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionList },
		setup() {
			return { args }
		},
		template: `
	<AmeliproAccordionList
		v-bind="args"
	>
		<template #headingContent="item">
			<p class="mb-0">
				{{ item.firstname }} {{ item.name }}
			</p>
		</template>

		<template #accordionContent="item">
			<p class="mb-0">
				{{ item.email }}
			</p>
		</template>
	</AmeliproAccordionList>`,
	}),
}

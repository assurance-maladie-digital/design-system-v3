import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordionResultList from './AmeliproAccordionResultList.vue'
import type { IDataListItem } from '../types'

const meta = {
	argTypes: {
		'`accordionContent-${accordion.id}`': { description: 'Slot individuel pour le contenu des accordéons' },
		'`headingContent-${accordion.id}`': { description: 'Slot individuel pour la partie droite du header des accordéons' },
		'accordionContent': { description: 'Slot générique permettant de donner le même aspect à tout le contenu des accordéons' },
		'change:pagination-select': {
			table: { category: 'events' },
			description: 'Événement émis sur le change du select de nombre de résultat par page',
		},
		'change:sort-select': {
			table: { category: 'events' },
			description: 'Événement émis sur le change du select de tri de la liste',
		},
		'click': {
			table: { category: 'events' },
			description: 'Événement émis au click sur la pagination',
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
		'title': { description: 'Label de la liste' },
		'uniqueId': { description: 'Identifiant unique de la liste' },

	},
	component: AmeliproAccordionResultList,
	title: 'Composants/Amelipro/Listes de résultats/AmeliproAccordionResultList',
} as Meta<typeof AmeliproAccordionResultList>

export default meta

type Story = StoryObj<typeof AmeliproAccordionResultList>

const items: IDataListItem[] = [
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 0,
		name: 'Bernard',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 1,
		name: 'Pierre',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 2,
		name: 'Souris',
	},
	{
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 3,
		name: 'Jabot',
	},
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 4,
		name: 'Bernard',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 5,
		name: 'Pierre',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 6,
		name: 'Souris',
	},
	{
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 7,
		name: 'Jabot',
	},
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 8,
		name: 'Bernard',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 9,
		name: 'Pierre',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 10,
		name: 'Souris',
	},
	{
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
		uniqueId: 'amelipro-accordion-result-list-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordionResultList
		:items="items"
		title="Exemple de liste de résultats"
		unique-id="amelipro-accordion-result-list-unique-id"
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
	</AmeliproAccordionResultList>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAccordionResultList } from '@cnamts/synapse'

	const items = [
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 0,
			name: 'Bernard',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 1,
			name: 'Pierre',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 2,
			name: 'Souris',
		},
		{
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 3,
			name: 'Jabot',
		},
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 4,
			name: 'Bernard',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 5,
			name: 'Pierre',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 6,
			name: 'Souris',
		},
		{
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 7,
			name: 'Jabot',
		},
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 8,
			name: 'Bernard',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 9,
			name: 'Pierre',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 10,
			name: 'Souris',
		},
		{
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
		components: { AmeliproAccordionResultList },
		setup() {
			return { args }
		},
		template: `
	<AmeliproAccordionResultList
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
	</AmeliproAccordionResultList>`,
	}),
}

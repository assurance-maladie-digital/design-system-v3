import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
import AmeliproResultList from './AmeliproResultList.vue'
import type { IDataListItem } from '../types'

const meta = {
	argTypes: {
		'`result-${item.id}`': { description: 'Slot individuel si tous vos résultats ne sont pas basés sur le même gabarit' },
		'change:pagination-select': { description: 'Événement émis à la sélection d’un nombre de résultats par page. Émet le nombre de résultat par page sélectionné', type: 'number' },
		'change:sort-select': { description: 'Événement émis à la sélection d’un tri. Émet le choix de tri sélectionné', type: '' },
		'click': { description: 'Événement émis au click sur un bouton de pagination', type: 'void' },
		'counterLabel': { description: 'Label du compteur de résultats en haut de la liste de résultats' },
		'hiddenLabels': { description: 'Masque les labels des champs select' },
		'items': {
			description: 'Tableau comprenant la liste des résultats',
			table: {
				type: {
					detail: `Array<{
	id: number,
	[key: string]: string,
}>`,
					summary: 'IDataListItem[]',
				},
			},
		},
		'itemsToDisplayDesktop': { description: 'Nombre d’éléments affichés par page en desktop par défaut' },
		'itemsToDisplayMobile': { description: 'Nombre d’éléments affichés par page en mobile par défaut' },
		'noResultListInfos': { description: 'Masques les informations et les filtres au-dessus de la liste de résultats' },
		'paginationSelect': { description: 'Affiche le select nombre de résultat par page' },
		'paginationSelectLabel': { description: 'Label du select de pagination' },
		'paginationSelectPlaceholder': { description: 'Placeholder du select de pagination' },
		'result': { description: 'Slot générique permettant de donner le même aspect à tout les items de votre liste' },
		'sortSelect': { description: 'Affiche le select de tri' },
		'sortSelectItems': { description: 'Items du select dédié aux tris' },
		'sortSelectLabel': { description: 'Label du select de tri' },
		'sortSelectPlaceholder': { description: 'Placeholder du select de tri' },
		'title': { description: 'Titre de la liste' },
		'uniqueId': { description: 'Identifiant unique de la liste' },
	},
	component: AmeliproResultList,
	title: 'Composants/Amelipro/Listes de résultats/AmeliproResultList',
} as Meta<typeof AmeliproResultList>
export default meta

type Story = StoryObj<typeof AmeliproResultList>

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
		uniqueId: 'amelipro-result-list-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproResultList
		:items="items"
		title="Exemple de liste de résultats"
		unique-id="amelipro-result-list-id"
	>
		<template #result="item">
			<AmeliproCard
				:card-title="[\`Titre de carte \${item.id + 1}\`]"
				class="mb-2"
				:unique-id="[\`result-list-card-\${item.id}\`]"
			>
				<p>{{ item.firstname }} {{ item.name }}</p>

				<p>{{ item.email }}</p>
			</AmeliproCard>
		</template>
	</AmeliproResultList>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproResultList } from '@cnamts/synapse'

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
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproResultList, AmeliproCard },
		setup() {
			return { args }
		},
		template: `
<AmeliproResultList
	v-bind="args"
>
	<template #result="item">
		<AmeliproCard
			:card-title="\`Titre de carte \${item.id + 1}\`"
			class="mb-2"
			:unique-id="[\`result-list-card-\${item.id}\`]"
		>
			<p>{{ item.firstname }} {{ item.name }}</p>

			<p>{{ item.email }}</p>
		</AmeliproCard>
	</template>
</AmeliproResultList>
		`,
	}),

}

import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
import AmeliproTable from './AmeliproTable.vue'
const meta = {
	argTypes: {
		'`item-${headers[cellIndex].name}`': { description: 'Slot généré automatiquement pour chaque colonne (`name` nom de la colonne dans headers) vous devez y bind la ligne, pour permettre de renseigner autres chose que des données textuelles si besoin. Le contenu du slot apparaît seulement si la valeur de la cellule concernée est `undefined`.' },
		'change:pagination-select': {
			table: { category: 'events' },
			description: 'Emit lors d\'un changement sur le select de nombre d\'items par page.',
		},
		'change:sort-select': {
			table: { category: 'events' },
			description: 'Emit lors d\'un changement sur le select de tri.',
		},
		'click': {
			table: { category: 'events' },
			description: 'Emit lors d\'un clic sur la pagination.',
		},
		'counterLabel': { description: 'Label du compteur de résultats en haut du tableau' },
		'dataList': {
			description: 'Tableau comprenant la liste des données d’une ligne du tableau la clé étant la colonne à afficher devant correspondre au `name` d’un élément de la liste d’entêtes',
			table: {
				type: {
					summary: 'IDataListItem[]',
					detail: `Array<{
	id: number,
	[key: string]: string
}`,
				},
			},
		},
		'headers': {
			description: 'Tableau comprenant la liste des entêtes du tableau ainsi que les styles à appliquer aux entêtes et colonnes',
			table: {
				type: {
					summary: 'AmeliproTableHeader[]',
					detail: `Array<{
	name: string;
	title: string;
	align: 'left' | 'right' | 'center';
	headerClasses?: string;
	cellsClasses?: string;
	minWidth: string;
	width: string;
	maxWidth: string;
	descriptionId?: string;
}>`,
				},
			},
		},
		'hiddenLabels': { description: 'Masque les labels des champs select' },
		'itemsToDisplayDesktop': { description: 'Nombre d’éléments affichés par page en desktop par défaut' },
		'itemsToDisplayMobile': { description: 'Nombre d’éléments affichés par page en mobile par défaut' },
		'noTableInfos': { description: 'Masques les informations et les filtres au-dessus du tableau' },
		'paginationSelectLabel': { description: 'Label du select de pagination' },
		'paginationSelectPlaceholder': { description: 'Placeholder du select de pagination' },
		'sortSelectItems': { description: 'Items du select dédié aux tris' },
		'sortSelectLabel': { description: 'Label du select de tri' },
		'sortSelectPlaceholder': { description: 'Placeholder du select de tri' },
		'tableMaxWidth': { description: 'Largeur maximale de la div entourant le tableau' },
		'tableMinWidth': { description: 'Largeur minimale de la div entourant le tableau' },
		'tableWidth': { description: 'Largeur de la div entourant le tableau' },
		'title': { description: 'Titre du tableau' },
		'uniqueId': { description: 'Identifiant unique du tableau' },
		'verticalBorder': { description: 'Affiche des bordures verticales entre les colonnes' },

	},
	component: AmeliproTable,
	parameters: { controls: { exclude: ['`item-${headeritem.name}`'] } },
	title: 'Composants/Amelipro/Tableaux/AmeliproTable',
} as Meta<typeof AmeliproTable>

export default meta

type Story = StoryObj<typeof AmeliproTable>

const headers = [
	{
		align: 'left',
		maxWidth: '25%',
		minWidth: '20%',
		name: 'name',
		title: 'Nom',
		width: '25%',
	},
	{
		align: 'left',
		maxWidth: '25%',
		minWidth: '20%',
		name: 'firstname',
		title: 'Prénom',
		width: '25%',
	},
	{
		align: 'left',
		maxWidth: '25%',
		minWidth: '20%',
		name: 'email',
		title: 'E-mail',
		width: '25%',
	},
]

const dataList = [
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
]

export const Default: Story = {
	args: {
		dataList,
		headers,
		title: 'Exemple de tableau',
		uniqueId: 'table-example',
	},
	parameters: {
		args: {
			dataList,
			headers,
			title: 'Exemple de tableau',
			uniqueId: 'table-example',
		},
		render: () => ({
			components: { AmeliproTable },
			setup() {
				return {}
			},
		}),
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTable
		:data-list="dataList"
		:headers="headers"
		title="Exemple de tableau"
		unique-id="table-example"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproTable } from '@cnamts/synapse'

	const headers = [
		{
			align: 'left',
			maxWidth: '25%',
			minWidth: '20%',
			name: 'name',
			title: 'Nom',
			width: '25%',
		},
		{
			align: 'left',
			maxWidth: '25%',
			minWidth: '20%',
			name: 'firstname',
			title: 'Prénom',
			width: '25%',
		},
		{
			align: 'left',
			maxWidth: '25%',
			minWidth: '20%',
			name: 'email',
			title: 'E-mail',
			width: '25%',
		},
	]

	const dataList = [
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
	]
</script>
				`,
			},
		],
	},
}

// Story n°2

const headersAdvanced = [
	{
		align: 'left',
		maxWidth: '25%',
		minWidth: '20%',
		name: 'name',
		title: 'Nom',
		width: '25%',
	},
	{
		align: 'left',
		maxWidth: '25%',
		minWidth: '20%',
		name: 'firstname',
		title: 'Prénom',
		width: '25%',
	},
	{
		align: 'left',
		maxWidth: '25%',
		minWidth: '20%',
		name: 'email',
		title: 'E-mail',
		width: '25%',
	},
	{
		align: 'left',
		maxWidth: '25%',
		minWidth: '20%',
		name: 'actions',
		title: 'Actions',
		width: '25%',
	},
]

const dataListAdvanced = [
	{
		actions: undefined,
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 0,
		messageText: 'Erreur',
		name: 'Bernard',
		type: 'error',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 1,
		messageText: 'Attention',
		name: 'Pierre',
		type: 'warning',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 2,
		messageText: 'Information',
		name: 'Souris',
	},
	{
		actions: 'Pas de slot',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 3,
		name: 'Jabot',
	},
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 4,
		messageText: 'Erreur',
		name: 'Bernard',
		type: 'error',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 5,
		messageText: 'Attention',
		name: 'Pierre',
		type: 'warning',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 6,
		messageText: 'Information',
		name: 'Souris',
	},
	{
		actions: 'Pas de slot',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 7,
		name: 'Jabot',
	},
	{
		email: 'jean.bernard@gmail.com',
		firstname: 'Jean',
		id: 8,
		messageText: 'Erreur',
		name: 'Bernard',
		type: 'error',
	},
	{
		email: 'simon.pierre@gmail.com',
		firstname: 'Simon',
		id: 9,
		messageText: 'Attention',
		name: 'Pierre',
		type: 'warning',
	},
	{
		email: 'michel.souris@gmail.com',
		firstname: 'Michel',
		id: 10,
		messageText: 'Information',
		name: 'Souris',
	},
	{
		actions: 'Pas de slot',
		email: 'amandine.jabot@gmail.com',
		firstname: 'Amandine',
		id: 11,
		name: 'Jabot',
	},
]

export const Advanced: Story = {
	args: {
		dataList: dataListAdvanced,
		headers: headersAdvanced,
		title: 'Exemple de tableau avancé',
		uniqueId: 'table-example-2',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproTable
		:data-list="dataListAdvanced"
		:headers="headersAdvanced"
		title="Exemple de tableau"
		unique-id="table-example-2"
	>
		<template #item-actions="row">
			<AmeliproMessage
				text
				:type="row.type"
				:unique-id="[\`tableau-slot-message-\${row.id}\`]"
			>
				{{ row.messageText }}
			</AmeliproMessage>
		</template>
	</AmeliproTable>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproMessage, AmeliproTable } from '@cnamts/synapse'

	const headersAdvanced = [
		{
			align: 'left',
			maxWidth: '25%',
			minWidth: '20%',
			name: 'name',
			title: 'Nom',
			width: '25%',
		},
		{
			align: 'left',
			maxWidth: '25%',
			minWidth: '20%',
			name: 'firstname',
			title: 'Prénom',
			width: '25%',
		},
		{
			align: 'left',
			maxWidth: '25%',
			minWidth: '20%',
			name: 'email',
			title: 'E-mail',
			width: '25%',
		},
		{
			align: 'left',
			maxWidth: '25%',
			minWidth: '20%',
			name: 'actions',
			title: 'Actions',
			width: '25%',
		},
	]

	const dataListAdvanced = [
		{
			actions: undefined,
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 0,
			messageText: 'Erreur',
			name: 'Bernard',
			type: 'error',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 1,
			messageText: 'Attention',
			name: 'Pierre',
			type: 'warning',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 2,
			messageText: 'Information',
			name: 'Souris',
		},
		{
			actions: 'Pas de slot',
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 3,
			name: 'Jabot',
		},
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 4,
			messageText: 'Erreur',
			name: 'Bernard',
			type: 'error',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 5,
			messageText: 'Attention',
			name: 'Pierre',
			type: 'warning',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 6,
			messageText: 'Information',
			name: 'Souris',
		},
		{
			actions: 'Pas de slot',
			email: 'amandine.jabot@gmail.com',
			firstname: 'Amandine',
			id: 7,
			name: 'Jabot',
		},
		{
			email: 'jean.bernard@gmail.com',
			firstname: 'Jean',
			id: 8,
			messageText: 'Erreur',
			name: 'Bernard',
			type: 'error',
		},
		{
			email: 'simon.pierre@gmail.com',
			firstname: 'Simon',
			id: 9,
			messageText: 'Attention',
			name: 'Pierre',
			type: 'warning',
		},
		{
			email: 'michel.souris@gmail.com',
			firstname: 'Michel',
			id: 10,
			messageText: 'Information',
			name: 'Souris',
		},
		{
			actions: 'Pas de slot',
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
		components: { AmeliproTable, AmeliproMessage },
		setup() {
			return { args }
		},
		template: `
			<AmeliproTable
				v-bind="args"
			>
				<template #item-actions="row">
					<AmeliproMessage
						text
						:type="row.type"
						:unique-id="[\`tableau-slot-message-\${row.id}\`]"
					>
						{{ row.messageText }}
					</AmeliproMessage>
				</template>
			</AmeliproTable>
		`,
	}),
}

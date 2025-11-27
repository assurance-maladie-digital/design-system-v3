import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproMessage from '../AmeliproMessage/AmeliproMessage.vue'
import AmeliproTable from './AmeliproTable.vue'
import type { AmeliproTableHeader } from './types'
import type { IDataListItem } from '../types'
import { computed, ref } from 'vue'

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
	sort?: {
		ascendant?: {
			label: string,
			disabled: boolean,
		},
		descendant?: {
			label: string,
			disabled: boolean,
		},
	};
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
		'sortSelectDefaultValue': {
			description: 'valeur par défaut sélectionnée dans le select dédié aux tris',
			control: 'text',
		},
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

const headers: AmeliproTableHeader[] = [
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

const dataList: IDataListItem[] = [
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

const headersAdvanced: AmeliproTableHeader[] = [
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

const dataListAdvanced: IDataListItem[] = [
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

export const PaginationEtTri: Story = {
	name: 'Pagination et tri',
	args: {
		dataList,
		headers: [
			{
				align: 'left',
				maxWidth: '25%',
				minWidth: '20%',
				name: 'name',
				title: 'Nom',
				width: '25%',
				sort: {
					ascendant: {
						label: 'tri de A vers Z',
						disabled: false,
					},
					descendant: {
						label: 'tri de Z vers A',
						disabled: false,
					},
				},
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
		],
		title: 'Tableau avec pagination et tri',
		uniqueId: 'table-pagination-tri',
		itemsToDisplayDesktop: 2,
		itemsToDisplayMobile: 1,
		sortSelectDefaultValue: 'desc',
		sortSelectItems: [
			{ title: 'Nom croissant', value: 'asc' },
			{ title: 'Nom décroissant', value: 'desc' },
		],
		sortSelectLabel: 'Trier par',
		sortSelectPlaceholder: 'Choisir un tri',
		paginationSelectLabel: 'Résultats par page',
		paginationSelectPlaceholder: 'Sélectionner',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproTable
        :data-list="sortedDataList"
        :headers="headers"
        title="Tableau avec pagination et tri"
        unique-id="table-pagination-tri"
        :items-to-display-desktop="2"
        :items-to-display-mobile="1"
		sort-select-default-value="name"
        :sort-select-items="[
            { title: 'Nom croissant', value: 'asc' },
            { title: 'Nom décroissant', value: 'desc' }
        ]"
        sort-select-label="Trier par"
        sort-select-placeholder="Choisir un tri"
        pagination-select-label="Résultats par page"
        pagination-select-placeholder="Sélectionner"
        @change:sort-select="onSortChange"
		@asc-sort="onSortAsc"
		@desc-sort="onSortDesc"
    />
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref, computed } from 'vue'
import { AmeliproTable } from '@cnamts/synapse'

const headers = [
    { align: 'left', maxWidth: '25%', minWidth: '20%', name: 'name', title: 'Nom', width: '25%', sort: { ascendant: { label: 'Tri de A vers Z', disabled: false }, descedant: {label: 'Tri de Z vers A', disabled: false } } },
    { align: 'left', maxWidth: '25%', minWidth: '20%', name: 'firstname', title: 'Prénom', width: '25%' },
    { align: 'left', maxWidth: '25%', minWidth: '20%', name: 'email', title: 'E-mail', width: '25%' },
]

const dataList = [
    { email: 'jean.bernard@gmail.com', firstname: 'Jean', id: 0, name: 'Bernard' },
    { email: 'simon.pierre@gmail.com', firstname: 'Simon', id: 1, name: 'Pierre' },
    { email: 'michel.souris@gmail.com', firstname: 'Michel', id: 2, name: 'Souris' },
    { email: 'amandine.jabot@gmail.com', firstname: 'Amandine', id: 3, name: 'Jabot' },
]

const sortValue = ref('name-asc')

const sortedDataList = computed(() => {
	const list = [...(args.dataList ?? [])]
	if (sortValue.value === 'asc') {
		return list.sort((a, b) => (String(a.name ?? '')).localeCompare(String(b.name ?? '')))
	}
	if (sortValue.value === 'desc') {
		return list.sort((a, b) => (String(b.name ?? '')).localeCompare(String(a.name ?? '')))
	}
	return list
})

function onSortChange(val: string) {
    sortValue.value = val
}

function onSortAsc(event: Event, header: string) {
	if (header === 'name') {
		sortValue.value = 'name-asc'
	}
}

function onSortDesc(event: Event, header: string) {
	if (header === 'name') {
		sortValue.value = 'desc'
	}
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproTable },
		setup() {
			const sortValue = ref('name-asc')
			const sortedDataList = computed(() => {
				const list = [...(args.dataList ?? [])]
				if (sortValue.value === 'asc') {
					return list.sort((a, b) => (String(a.name ?? '')).localeCompare(String(b.name ?? '')))
				}
				if (sortValue.value === 'desc') {
					return list.sort((a, b) => (String(b.name ?? '')).localeCompare(String(a.name ?? '')))
				}
				return list
			})
			function onSortChange(val: string) {
				sortValue.value = val
			}

			function onSortAsc(header: string) {
				if (header === 'name') {
					sortValue.value = 'name-asc'
				}
			}

			function onSortDesc(header: string) {
				if (header === 'name') {
					sortValue.value = 'desc'
				}
			}
			return { args, sortedDataList, onSortChange, onSortAsc, onSortDesc }
		},
		template: `
<p class="mb-2">Tableau avec pagination personnalisée et options de tri. Le tri est appliqué via l'événement <code>change:sort-select</code>.</p>
<AmeliproTable
    v-bind="args"
    :data-list="sortedDataList"
    @change:sort-select="onSortChange"
	@asc-sort="onSortAsc"
	@desc-sort="onSortDesc"
/>
        `,
	}),
}

export const LargeurPersonnalisee: Story = {
	name: 'Largeur personnalisée',
	args: {
		dataList,
		headers,
		title: 'Tableau largeur personnalisée',
		uniqueId: 'table-largeur',
		tableMinWidth: '1200px',
		tableMaxWidth: '900px',
		tableWidth: '100%',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproTable
        :data-list="dataList"
        :headers="headers"
        title="Tableau largeur personnalisée"
        unique-id="table-largeur"
        table-min-width="1200px"
        table-max-width="900px"
        table-width="100%"
    />
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproTable },
		setup() { return { args } },
		template: `
<p class="mb-2">Tableau avec largeur personnalisée (<code>tableMinWidth</code>, <code>tableMaxWidth</code>, <code>tableWidth</code>).</p>
<AmeliproTable v-bind="args" />
        `,
	}),
}

export const SansInfosEtFiltres: Story = {
	name: 'Sans infos et filtres',
	args: {
		dataList,
		headers,
		title: 'Tableau sans infos ni filtres',
		uniqueId: 'table-no-infos',
		noTableInfos: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproTable
        :data-list="dataList"
        :headers="headers"
        title="Tableau sans infos ni filtres"
        unique-id="table-no-infos"
        no-table-infos
    />
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproTable },
		setup() { return { args } },
		template: `
<p class="mb-2">Tableau sans affichage des informations et filtres au-dessus du tableau (<code>noTableInfos</code>).</p>
<AmeliproTable v-bind="args" />
        `,
	}),
}

export const BorduresVerticales: Story = {
	name: 'Bordures verticales',
	args: {
		dataList,
		headers,
		title: 'Tableau avec bordures verticales',
		uniqueId: 'table-vertical-border',
		verticalBorder: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <AmeliproTable
        :data-list="dataList"
        :headers="headers"
        title="Tableau avec bordures verticales"
        unique-id="table-vertical-border"
        vertical-border
    />
</template>
                `,
			},
		],
	},
	render: args => ({
		components: { AmeliproTable },
		setup() { return { args } },
		template: `
<p class="mb-2">Tableau avec bordures verticales entre les colonnes (<code>verticalBorder</code>).</p>
<AmeliproTable v-bind="args" />
        `,
	}),
}

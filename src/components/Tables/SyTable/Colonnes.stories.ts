import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import type { VDataTable } from 'vuetify/components'
import SyTable from './SyTable.vue'
import { commonTableArgTypes } from '../common/storyArgTypes'
import type { DataTableHeaders } from '../common/types'
import { users, usersHeaders, wideHeaders, wideUsers } from '../common/storyData'

const meta = {
	title: 'Composants/Tableaux/SyTable/Colonnes',
	component: SyTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		...commonTableArgTypes,
		items: {
			description: 'Liste des éléments à afficher dans le tableau',
			control: { type: 'object' },
			table: {
				category: 'props',
				defaultValue: { summary: '[]' },
			},
		},
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

// Jeu spécifique à l'alignement : colonnes alignées au centre / début / fin.
const alignmentHeaders: DataTableHeaders[] = [
	{ title: 'ID', key: 'id', align: 'center', sortable: false },
	{ title: 'Nom', key: 'lastname', align: 'start', sortable: false },
	{ title: 'Date de naissance', key: 'birthdate', align: 'center', sortable: false },
	{ title: 'NIR', key: 'nir', align: 'end', sortable: false },
]

const alignmentItems = [
	{ id: '1', lastname: 'Lefebvre', birthdate: '18/02/1989', nir: '1 89 02 75 120 005 79' },
	{ id: '2', lastname: 'Richard', birthdate: '22/05/1991', nir: '2 91 05 75 120 005 76' },
	{ id: '3', lastname: 'Fournier', birthdate: '11/11/2000', nir: '2 00 11 42 120 008 87' },
]

/**
 * Alignement des colonnes (`align`) : chaque en-tête peut aligner son contenu
 * `start`, `center` ou `end`.
 */
export const DataAlignment: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable
		v-model:options="options"
		:headers="headers"
		:items="items"
		suffix="alignment-table"
	/>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable } from '@cnamts/synapse'

	const options = ref({ itemsPerPage: 4 })

	const headers = [
		{ title: 'ID', key: 'id', align: 'center' },
		{ title: 'Nom', key: 'lastname', align: 'start' },
		{ title: 'Date de naissance', key: 'birthdate', align: 'center' },
		{ title: 'NIR', key: 'nir', align: 'end' },
	]

	const items = ref([
		{ id: '1', lastname: 'Lefebvre', birthdate: '18/02/1989', nir: '1 89 02 75 120 005 79' },
		{ id: '2', lastname: 'Richard', birthdate: '22/05/1991', nir: '2 91 05 75 120 005 76' },
		{ id: '3', lastname: 'Fournier', birthdate: '11/11/2000', nir: '2 00 11 42 120 008 87' },
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': alignmentHeaders,
		'items': alignmentItems,
		'options': { itemsPerPage: 4 },
		'suffix': 'alignment-table',
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<SyTable v-model:options="args.options" v-bind="args" suffix="alignment-table" />
		`,
	}),
}

/**
 * Colonnes redimensionnables (`resizable-columns`) : une poignée sur le bord des
 * en-têtes permet d'ajuster la largeur des colonnes.
 */
export const ResizableColumns: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable
		v-model:options="options"
		:headers="headers"
		:items="items"
		:resizable-columns="true"
		suffix="resizable-columns"
	/>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable } from '@cnamts/synapse'

	const options = ref({ itemsPerPage: 4 })

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', value: 'email' },
	]

	const items = ref([
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
		{ firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com' },
		{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@exemple.com' },
		{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@exemple.com' },
	])
</script>
`,
			},
		],
	},
	args: {
		'resizableColumns': true,
		'headers': usersHeaders,
		'items': users,
		'options': { itemsPerPage: 4 },
		'suffix': 'resizable-columns',
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<SyTable v-model:options="args.options" v-bind="args" suffix="resizable-columns" />
		`,
	}),
}

/**
 * Colonnes épinglées (`pinned-columns`) et sélection collante (`sticky-select`) :
 * certaines colonnes restent visibles lors du défilement horizontal.
 */
export const PinnedColumns: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div style="max-width: 900px; overflow: auto;">
		<SyTable
			v-model:options="options"
			:headers="headers"
			:items="items"
			show-select
			sticky-select
			:pinned-columns="pinnedColumns"
			suffix="pinned-columns-table"
		/>
	</div>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable } from '@cnamts/synapse'

	const options = ref({ itemsPerPage: 5 })

	const headers = [
		{ title: 'ID', key: 'id', width: 80 },
		{ title: 'Nom', key: 'lastname', width: 160 },
		{ title: 'Prénom', key: 'firstname', width: 160 },
		{ title: 'Email', key: 'email', width: 240 },
		{ title: 'Ville', key: 'city', width: 160 },
		{ title: 'Pays', key: 'country', width: 160 },
		{ title: 'Téléphone', key: 'phone', width: 180 },
		{ title: 'Statut', key: 'status', width: 140 },
		{ title: 'Dernière connexion', key: 'lastLogin', width: 200 },
		{ title: 'Actions', key: 'actions', width: 140 },
	]

	const items = ref([/* … lignes larges … */])

	// La colonne « Actions » reste épinglée à droite
	const pinnedColumns = ref([
		{ key: 'actions', side: 'right' },
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': wideHeaders,
		'items': wideUsers,
		'options': { itemsPerPage: 5 },
		'suffix': 'pinned-columns-table',
		'showSelect': true,
		'stickySelect': true,
		'pinnedColumns': [
			{ key: 'actions', side: 'right' },
		],
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<div style="max-width: 900px; overflow: auto;">
				<SyTable v-model:options="args.options" v-bind="args" suffix="pinned-columns-table" />
			</div>
		`,
	}),
}

/**
 * Contrôles de colonnes (`enable-column-controls`) : une interface permet de
 * réordonner et d'afficher/masquer les colonnes.
 */
export const ColumnControls: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable
		v-model:options="options"
		:headers="headers"
		:items="items"
		suffix="column-control-table"
		enable-column-controls
	/>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable } from '@cnamts/synapse'

	const options = ref({ itemsPerPage: 4 })

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', value: 'email' },
	]

	const items = ref([
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
		{ firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com' },
		{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@exemple.com' },
		{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@exemple.com' },
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': usersHeaders,
		'items': users,
		'options': { itemsPerPage: 4 },
		'caption': '',
		'suffix': 'column-control-table',
		'density': 'default',
		'striped': false,
		'enableColumnControls': true,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<SyTable v-model:options="args.options" v-bind="args" />
		`,
	}),
}

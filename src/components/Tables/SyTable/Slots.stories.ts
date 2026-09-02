import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import type { VDataTable } from 'vuetify/components'
import SyTable from './SyTable.vue'
import { commonTableArgTypes, commonTableExcludedControls, syTableItemsArgTypes } from '../common/storyArgTypes'
import { manyUsers, users, usersHeaders } from '../common/storyData'

const meta = {
	title: 'Composants/Tableaux/SyTable/Slots',
	component: SyTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: commonTableExcludedControls },
	},
	argTypes: {
		...commonTableArgTypes,
		...syTableItemsArgTypes,
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

// Jeu spécifique à l'affichage complexe : chaque ligne porte une période imbriquée.
const projectHeaders = [
	{ title: 'Titre', key: 'title' },
	{ title: 'Période', key: 'period' },
]

const projects = [
	{ title: 'Projet Alpha', period: { start: '01/01/2023', end: '30/06/2023' } },
	{ title: 'Projet Beta', period: { start: '15/02/2023', end: '15/08/2023' } },
	{ title: 'Projet Gamma', period: { start: '01/03/2023', end: '31/12/2023' } },
]

/**
 * Slot `#item` : remplace entièrement le rendu d'une ligne (ici, prénom en lien).
 */
export const SlotItem: Story = {
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
		suffix="slot-item-table"
	>
		<template #item="{ item }">
			<tr>
				<td>{{ item.lastname }}</td>
				<td>
					<a href="#" class="text-primary">{{ item.firstname }}</a>
				</td>
				<td>{{ item.email }}</td>
			</tr>
		</template>
	</SyTable>
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
		'suffix': 'slot-item-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<SyTable v-model:options="args.options" v-bind="args" suffix="slot-item-table">
				<template #item="{ item }">
					<tr>
						<td>{{ item.lastname }}</td>
						<td>
							<a href="#" class="text-primary">{{ item.firstname }}</a>
						</td>
						<td>{{ item.email }}</td>
					</tr>
				</template>
			</SyTable>
		`,
	}),
}

/**
 * Slot `#headers` : personnalise entièrement la ligne d'en-tête du tableau.
 */
export const SlotHeaders: Story = {
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
		suffix="slot-headers-table"
	>
		<template #headers="{ columns }">
			<tr>
				<th v-for="column in columns" :key="column.key">
					<span class="font-weight-bold text-primary">{{ column.title }}</span>
				</th>
			</tr>
		</template>
	</SyTable>
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
		'suffix': 'slot-headers-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<SyTable v-model:options="args.options" v-bind="args" suffix="slot-headers-table">
				<template #headers="{ columns }">
					<tr>
						<th v-for="column in columns" :key="column.key">
							<span class="font-weight-bold text-primary">{{ column.title }}</span>
						</th>
					</tr>
				</template>
			</SyTable>
		`,
	}),
}

/**
 * Slot `#header.<key>` : personnalise l'en-tête d'une seule colonne.
 */
export const SlotHeader: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable :headers="headers" :items="items">
		<template #header.lastname>
			<span class="text-primary font-weight-bold">Nom de famille</span>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable } from '@cnamts/synapse'

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', value: 'email' },
	]

	const items = ref([/* … plusieurs lignes … */])
</script>
`,
			},
		],
	},
	args: {
		'headers': usersHeaders,
		'items': manyUsers,
		'suffix': 'slot-header-table',
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<SyTable v-model:options="args.options" v-bind="args">
				<template #header.lastname>
					<span class="text-primary font-weight-bold">Nom de famille</span>
				</template>
			</SyTable>
		`,
	}),
}

/**
 * Slot `#item.<key>` : personnalise l'affichage d'une cellule (ici, une période
 * imbriquée reformatée en texte).
 */
export const ComplexItemsDisplay: Story = {
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
		:headers="headers"
		:items="items"
		suffix="items-display-cell-table"
	>
		<template #[\`item.period\`]="{ item }">
			Depuis le {{ item.period.start }} jusqu'au {{ item.period.end }}
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable } from '@cnamts/synapse'

	const headers = [
		{ title: 'Titre', key: 'title' },
		{ title: 'Période', key: 'period' },
	]

	const items = ref([
		{ title: 'Projet Alpha', period: { start: '01/01/2023', end: '30/06/2023' } },
		{ title: 'Projet Beta', period: { start: '15/02/2023', end: '15/08/2023' } },
		{ title: 'Projet Gamma', period: { start: '01/03/2023', end: '31/12/2023' } },
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': projectHeaders,
		'items': projects,
		'caption': 'Périodes des projets en cours',
		'suffix': 'items-display-cell-table',
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args }
		},
		template: `
			<SyTable v-bind="args">
				<template #[\`item.period\`]="{ item }">
					Depuis le {{ item.period.start }} jusqu'au {{ item.period.end }}
				</template>
			</SyTable>
		`,
	}),
}

import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import type { VDataTable } from 'vuetify/components'
import SyTable from './SyTable.vue'
import { commonTableArgTypes, commonTableExcludedControls } from '../common/storyArgTypes'
import { manyUsers, users, usersHeaders } from '../common/storyData'

const meta = {
	title: 'Composants/Tableaux/SyTable/Pagination',
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

/**
 * Choix du nombre de lignes par page (`items-per-page-options`) : la liste
 * déroulante du pied de page propose les paliers fournis.
 */
export const ItemsPerPageOptions: Story = {
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
		:items-per-page-options="[5, 10, 15]"
		suffix="items-per-page-options-table"
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

	const options = ref({ itemsPerPage: 5 })

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', value: 'email' },
	]

	// Un jeu d'au moins 15 lignes pour illustrer les différents paliers
	const items = ref([
		/* … */
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': usersHeaders,
		'items': manyUsers,
		'options': { itemsPerPage: 5 },
		'itemsPerPageOptions': [5, 10, 15],
		'caption': '',
		'suffix': 'items-per-page-options-table',
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
			<SyTable v-model:options="args.options" v-bind="args" />
		`,
	}),
}

/**
 * Masquer le pied de page (`hide-default-footer`) : utile quand toutes les lignes
 * sont affichées (`itemsPerPage: -1`) ou lorsque la pagination est gérée ailleurs.
 */
export const HideDefaultFooter: Story = {
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
		suffix="hide-footer-table"
		hide-default-footer
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

	const options = ref({ itemsPerPage: -1 })

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	const items = ref([
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Simone', lastname: 'Bellefeuille', email: 'simone.bellefeuille@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
		{ firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com' },
		{ firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@example.com' },
		{ firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@example.com' },
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': usersHeaders,
		'items': users,
		'options': { itemsPerPage: -1 },
		'suffix': 'hide-footer-table',
		'hideDefaultFooter': true,
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
			<SyTable v-model:options="args.options" v-bind="args" />
		`,
	}),
}

/**
 * Saisie directe de la page (`page-input`) : un champ numérique permet d'aller
 * directement à une page donnée, en complément des flèches de navigation.
 */
export const PageInput: Story = {
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
		suffix="page-input-table"
		page-input
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

	const options = ref({ itemsPerPage: 5 })

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	// Plusieurs pages pour illustrer le saut de page
	const items = ref([
		/* … */
	])
</script>
`,
			},
		],
	},
	args: {
		'headers': usersHeaders,
		'items': manyUsers,
		'options': { itemsPerPage: 5 },
		'suffix': 'page-input-table',
		'pageInput': true,
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
			<SyTable v-model:options="args.options" v-bind="args" />
		`,
	}),
}

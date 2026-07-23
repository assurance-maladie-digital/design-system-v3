import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import type { VDataTable } from 'vuetify/components'
import SyTable from './SyTable.vue'
import { commonTableArgTypes } from '../common/storyArgTypes'
import { users, usersHeaders } from '../common/storyData'

const meta = {
	title: 'Composants/Tableaux/SyTable/Sélection',
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
		showFilters: {
			description: 'Affiche les filtres au-dessus du tableau',
			control: { type: 'boolean' },
		},
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Sélection multiple : `show-select` ajoute une colonne de cases à cocher.
 * La sélection est un `v-model` (tableau des lignes sélectionnées).
 */
export const RowSelection: Story = {
	name: 'Row Selection',
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
		v-model="selection"
		:headers="headers"
		:items="items"
		show-select
		show-filters
		suffix="selection-table"
	/>
	<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
		<h3 class="text-h6 mb-3">Item(s) sélectionné(s) ({{ selection.length }})</h3>
		<div v-for="(item, index) in selection" :key="index" class="mb-2 pa-2 bg-grey-lighten-3">
			<div><strong>Nom :</strong> {{ item.lastname }}</div>
			<div><strong>Prénom :</strong> {{ item.firstname }}</div>
			<div><strong>Email :</strong> {{ item.email }}</div>
		</div>
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

	const options = ref({ itemsPerPage: 4 })
	const selection = ref([])

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
		headers: usersHeaders,
		items: users,
		options: { itemsPerPage: 4 },
		caption: '',
		suffix: 'selection-table',
		density: 'default',
		striped: false,
		showSelect: true,
		showFilters: true,
	},
	render: args => ({
		components: { SyTable },
		setup() {
			const items = ref(args.items)
			const selection = ref<Record<string, unknown>[]>([])
			return { args, selection, items }
		},
		template: `
			<div>
				<SyTable v-model:options="args.options" v-model="selection" v-bind="args" suffix="selection-table" />
				<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
					<h3 class="text-h6 mb-3">Item(s) sélectionné(s) ({{ selection.length }})</h3>
					<div v-for="(item, index) in selection" :key="index" class="mb-2 pa-2 bg-grey-lighten-3">
						<div><strong>Nom :</strong> {{ item.lastname }}</div>
						<div><strong>Prénom :</strong> {{ item.firstname }}</div>
						<div><strong>Email :</strong> {{ item.email }}</div>
					</div>
				</div>
			</div>
		`,
	}),
}

/**
 * Sélection unique : `show-select-single` limite la sélection à une seule ligne
 * (boutons radio). Le `v-model` contient au plus un élément.
 */
export const SingleRowSelection: Story = {
	name: 'Single Row Selection',
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
		v-model="selection"
		:headers="headers"
		:items="items"
		show-select-single
		show-filters
		suffix="selection-table"
	/>
	<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
		<h3 class="text-h6 mb-3">Item(s) sélectionné(s) ({{ selection.length }})</h3>
		<div v-for="(item, index) in selection" :key="index" class="mb-2 pa-2 bg-grey-lighten-3">
			<div><strong>Nom :</strong> {{ item.lastname }}</div>
			<div><strong>Prénom :</strong> {{ item.firstname }}</div>
			<div><strong>Email :</strong> {{ item.email }}</div>
		</div>
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

	const options = ref({ itemsPerPage: 4 })
	const selection = ref([])

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
		headers: usersHeaders,
		items: users,
		options: { itemsPerPage: 4 },
		caption: '',
		suffix: 'selection-table',
		density: 'default',
		striped: false,
		showSelectSingle: true,
		showFilters: true,
	},
	render: args => ({
		components: { SyTable },
		setup() {
			const items = ref(args.items)
			const selection = ref<Record<string, unknown>[]>([])
			return { args, selection, items }
		},
		template: `
			<div>
				<SyTable v-model:options="args.options" v-model="selection" v-bind="args" suffix="selection-table" />
				<div v-if="selection.length" class="mt-4 pa-4 bg-grey-lighten-4">
					<h3 class="text-h6 mb-3">Item(s) sélectionné(s) ({{ selection.length }})</h3>
					<div v-for="(item, index) in selection" :key="index" class="mb-2 pa-2 bg-grey-lighten-3">
						<div><strong>Nom :</strong> {{ item.lastname }}</div>
						<div><strong>Prénom :</strong> {{ item.firstname }}</div>
						<div><strong>Email :</strong> {{ item.email }}</div>
					</div>
				</div>
			</div>
		`,
	}),
}

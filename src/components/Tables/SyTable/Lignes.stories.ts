import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, defineComponent, ref } from 'vue'
import { fn } from 'storybook/test'
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'
import type { VDataTable } from 'vuetify/components'
import SyTable from './SyTable.vue'
import { commonTableArgTypes, commonTableExcludedControls, syTableItemsArgTypes } from '../common/storyArgTypes'
import { users, usersHeaders } from '../common/storyData'

const meta = {
	title: 'Composants/Tableaux/SyTable/Lignes',
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

const clickableHeaders = [
	{ title: 'Nom', key: 'lastname' },
	{ title: 'Prénom', key: 'firstname' },
	{ title: 'Email', key: 'email' },
]

const clickableItems = [
	{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ firstname: 'Alice', lastname: 'Dupont', email: 'alice.dupont@example.com' },
	{ firstname: 'Marc', lastname: 'Lefevre', email: 'marc.lefevre@example.com' },
]

/**
 * Lignes cliquables (`clickable-row`) : chaque clic sur une ligne émet
 * l'évènement `@row-click` avec l'élément correspondant.
 */
export const ClickableRow: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div>
		<SyTable
			v-model:options="options"
			:headers="headers"
			:items="items"
			clickable-row
			suffix="clickable-row-table"
			@row-click="selectedRow = $event"
		/>
		<div v-if="selectedRow" class="mt-4 pa-4 bg-grey-lighten-4">
			<h3 class="text-h6 mb-3">Ligne cliquée</h3>
			<div class="pa-2 bg-grey-lighten-3">
				<div><strong>Nom :</strong> {{ selectedRow.lastname }}</div>
				<div><strong>Prénom :</strong> {{ selectedRow.firstname }}</div>
				<div><strong>Email :</strong> {{ selectedRow.email }}</div>
			</div>
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

	const options = ref({ itemsPerPage: 5, filters: [] })
	const selectedRow = ref(null)

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	const items = [
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
		{ firstname: 'Alice', lastname: 'Dupont', email: 'alice.dupont@example.com' },
		{ firstname: 'Marc', lastname: 'Lefevre', email: 'marc.lefevre@example.com' },
	]
</script>
`,
			},
		],
	},
	args: {
		'headers': clickableHeaders,
		'items': clickableItems,
		'options': { itemsPerPage: 5, filters: [] },
		'clickableRow': true,
		'suffix': 'clickable-row-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
		'onRow-click': fn(),
	},
	render: args => ({
		components: {
			ClickableRowTableCanvas: defineComponent({
				components: { SyTable },
				emits: ['row-click'],
				setup() {
					const boundArgs = computed(() => {
						return Object.fromEntries(Object.entries(args).filter(([key]) => key !== 'onRow-click'))
					})

					return { args, boundArgs }
				},
				template: `
					<SyTable
						v-model:options="args.options"
						v-bind="boundArgs"
						@row-click="$emit('row-click', $event)"
					/>
				`,
			}),
		},
		setup() {
			const selectedRow = ref<Record<string, unknown> | null>(null)
			const handleRowClick = (item: Record<string, unknown>) => {
				selectedRow.value = item
				args['onRow-click']?.(item)
			}
			return { selectedRow, handleRowClick }
		},
		template: `
			<div>
				<ClickableRowTableCanvas @row-click="handleRowClick" />
				<div v-if="selectedRow" class="mt-4 pa-4 bg-grey-lighten-4">
					<h3 class="text-h6 mb-3">Ligne cliquée</h3>
					<div class="pa-2 bg-grey-lighten-3">
						<div><strong>Nom :</strong> {{ selectedRow.lastname }}</div>
						<div><strong>Prénom :</strong> {{ selectedRow.firstname }}</div>
						<div><strong>Email :</strong> {{ selectedRow.email }}</div>
					</div>
				</div>
			</div>
		`,
	}),
}

/**
 * Lignes dépliables (`show-expand`) : le slot `#item.data-table-expand`
 * personnalise le déclencheur, et `#expanded-row` le contenu déplié.
 */
export const ExpandableRows: Story = {
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
		show-expand
		caption="Tableau complexe"
		suffix="expand-table"
	>
		<template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
			<v-btn
				:append-icon="isExpanded(internalItem) ? mdiChevronUp : mdiChevronDown"
				:text="isExpanded(internalItem) ? 'Fermer' : \`Plus d'info\`"
				class="text-none"
				color="medium-emphasis"
				size="small"
				variant="text"
				width="105"
				border
				slim
				@click="toggleExpand(internalItem)"
			/>
		</template>

		<template #expanded-row="{ columns, item }">
			<tr>
				<td :colspan="columns.length" class="py-2">
					<strong>Informations complémentaires :</strong>
					<p>Plus de détails pour {{ item.firstname }} {{ item.lastname }}.</p>
				</td>
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
	import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

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
		'showExpand': true,
		'suffix': 'expandable-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: args => ({
		components: { SyTable },
		setup() {
			return { args, mdiChevronDown, mdiChevronUp }
		},
		template: `
			<SyTable
				v-model:options="args.options"
				v-bind="args"
				show-expand
				caption="Tableau complexe"
				suffix="expand-table"
			>
				<template #item.data-table-expand="{ internalItem, isExpanded, toggleExpand }">
					<VBtn
						:append-icon="isExpanded(internalItem) ? mdiChevronUp : mdiChevronDown"
						:text="isExpanded(internalItem) ? 'Fermer' : \`Plus d'info\`"
						class="text-none"
						color="medium-emphasis"
						size="small"
						variant="text"
						width="105"
						border
						slim
						@click="toggleExpand(internalItem)"
					/>
				</template>

				<template #expanded-row="{ columns, item }">
					<tr>
						<td :colspan="columns.length" class="py-2">
							<strong>Informations complémentaires :</strong>
							<p>Plus de détails pour {{ item.firstname }} {{ item.lastname }}.</p>
						</td>
					</tr>
				</template>
			</SyTable>
		`,
	}),
}

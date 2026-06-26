import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { mdiDelete } from '@mdi/js'
import type { VDataTable } from 'vuetify/components'
import SyTable from './SyTable.vue'

const meta = {
	title: 'Composants/Tableaux/SyTable/Actions groupées',
	component: SyTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { hideNoControlsWarning: true },
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

const headers = [
	{ title: 'Nom', key: 'lastname' },
	{ title: 'Prénom', key: 'firstname' },
	{ title: 'Email', key: 'email' },
]

const baseItems = [
	{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ id: 3, firstname: 'Camille', lastname: 'Tremblay', email: 'camille.tremblay@example.com' },
]

/**
 * Suppression en masse : cochez des lignes (`show-select`) pour faire apparaître la
 * barre d'actions groupées. `show-delete-selected` ajoute le bouton intégré qui émet
 * `@delete-multiple(items)`. La sélection s'appuie sur le `v-model` existant.
 */
export const Default: Story = {
	args: {
		suffix: 'bulk-actions',
		showSelect: true,
		showDeleteSelected: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
	},
	render: args => ({
		components: { SyTable },
		setup() {
			const items = ref([...baseItems])
			const selected = ref<number[]>([])

			function onDeleteMultiple(toDelete: Record<string, unknown>[]) {
				const ids = new Set(toDelete.map(i => i.id))
				items.value = items.value.filter(i => !ids.has(i.id))
			}

			return { args, headers, items, selected, onDeleteMultiple }
		},
		template: `
			<SyTable
				v-bind="args"
				v-model="selected"
				:headers="headers"
				:items="items"
				@delete-multiple="onDeleteMultiple"
			/>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable
		suffix="bulk-actions"
		show-select
		show-delete-selected
		selection-key="id"
		hide-default-footer
		v-model="selected"
		:headers="headers"
		:items="items"
		@delete-multiple="onDeleteMultiple"
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

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
	]

	const items = ref([
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	])
	const selected = ref([])

	function onDeleteMultiple(toDelete) {
		const ids = new Set(toDelete.map(i => i.id))
		items.value = items.value.filter(i => !ids.has(i.id))
	}
</script>
`,
			},
		],
	},
}

/**
 * Barre personnalisée via le slot `#bulk-actions`, qui expose
 * `{ selected, count, clearSelection, deleteSelected }`.
 */
export const CustomBar: Story = {
	args: {
		suffix: 'bulk-actions-custom',
		showSelect: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
	},
	render: args => ({
		components: { SyTable },
		setup() {
			const items = ref([...baseItems])
			const selected = ref<number[]>([])

			function onDeleteMultiple(toDelete: Record<string, unknown>[]) {
				const ids = new Set(toDelete.map(i => i.id))
				items.value = items.value.filter(i => !ids.has(i.id))
			}

			return { args, headers, items, selected, onDeleteMultiple, mdiDelete }
		},
		template: `
			<SyTable
				v-bind="args"
				v-model="selected"
				:headers="headers"
				:items="items"
				@delete-multiple="onDeleteMultiple"
			>
				<template #bulk-actions="{ count, deleteSelected, clearSelection }">
					<VBtn color="error" variant="flat" size="small" :prepend-icon="mdiDelete" @click="deleteSelected">
						Supprimer {{ count }} patient(s)
					</VBtn>
					<VBtn variant="text" size="small" @click="clearSelection">Annuler</VBtn>
				</template>
			</SyTable>
		`,
	}),
}

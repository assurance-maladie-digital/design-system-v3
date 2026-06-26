import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { mdiDelete, mdiPencil } from '@mdi/js'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Actions groupées',
	component: SyServerTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { hideNoControlsWarning: true },
	},
} satisfies Meta<typeof SyServerTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

const headers = [
	{ title: 'Nom', key: 'lastname', editable: true },
	{ title: 'Prénom', key: 'firstname', editable: true },
	{ title: 'Email', key: 'email', editable: true },
]

const baseItems = [
	{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ id: 3, firstname: 'Camille', lastname: 'Tremblay', email: 'camille.tremblay@example.com' },
]

/**
 * Suppression en masse sur SyServerTable. Même API que SyTable (`show-select`,
 * `show-delete-selected`, évènement `@delete-multiple`, slot `#bulk-actions`),
 * mutualisée dans `common/`.
 */
export const Default: Story = {
	args: {
		suffix: 'server-bulk-actions',
		serverItemsLength: baseItems.length,
		showSelect: true,
		showDeleteSelected: true,
		showEditSelected: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const items = ref([...baseItems])
			const selected = ref<number[]>([])

			function onDeleteMultiple(toDelete: Record<string, unknown>[]) {
				const ids = new Set(toDelete.map(i => i.id))
				items.value = items.value.filter(i => !ids.has(i.id))
			}

			function onSaveMultiple(updatedItems: Record<string, unknown>[]) {
				const byId = new Map(updatedItems.map(i => [i.id, i]))
				items.value = items.value.map(i => (byId.get(i.id) ?? i)) as typeof baseItems
			}

			return { args, headers, items, selected, onDeleteMultiple, onSaveMultiple }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model="selected"
				:headers="headers"
				:items="items"
				:server-items-length="items.length"
				@delete-multiple="onDeleteMultiple"
				@save-multiple="onSaveMultiple"
			/>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyServerTable
		suffix="server-bulk-actions"
		show-select
		show-delete-selected
		show-edit-selected
		selection-key="id"
		hide-default-footer
		v-model="selected"
		:headers="headers"
		:items="items"
		:server-items-length="items.length"
		@delete-multiple="onDeleteMultiple"
		@save-multiple="onSaveMultiple"
	/>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyServerTable } from '@cnamts/synapse'

	// Les colonnes \`editable: true\` constituent le formulaire d'édition groupée
	const headers = [
		{ title: 'Nom', key: 'lastname', editable: true },
		{ title: 'Prénom', key: 'firstname', editable: true },
		{ title: 'Email', key: 'email', editable: true },
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

	function onSaveMultiple(updatedItems) {
		const byId = new Map(updatedItems.map(i => [i.id, i]))
		items.value = items.value.map(i => byId.get(i.id) ?? i)
	}
</script>
`,
			},
		],
	},
}

/**
 * Barre personnalisée via le slot `#bulk-actions`, qui expose
 * `{ selected, count, clearSelection, deleteSelected, editSelected }`.
 * `show-edit-selected` reste nécessaire pour que la boîte de dialogue d'édition soit disponible.
 */
export const CustomBar: Story = {
	args: {
		suffix: 'server-bulk-actions-custom',
		caption: 'Liste des patients',
		serverItemsLength: baseItems.length,
		showSelect: true,
		showEditSelected: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
	},
	render: args => ({
		components: { SyServerTable },
		setup() {
			const items = ref([...baseItems])
			const selected = ref<number[]>([])

			function onDeleteMultiple(toDelete: Record<string, unknown>[]) {
				const ids = new Set(toDelete.map(i => i.id))
				items.value = items.value.filter(i => !ids.has(i.id))
			}

			function onSaveMultiple(updatedItems: Record<string, unknown>[]) {
				const byId = new Map(updatedItems.map(i => [i.id, i]))
				items.value = items.value.map(i => (byId.get(i.id) ?? i)) as typeof baseItems
			}

			return { args, headers, items, selected, onDeleteMultiple, onSaveMultiple, mdiDelete, mdiPencil }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model="selected"
				:headers="headers"
				:items="items"
				:server-items-length="items.length"
				:bulk-selected-label="(count) => count + ' patient' + (count > 1 ? 's' : '') + ' sélectionné' + (count > 1 ? 's' : '')"
				:bulk-edit-title="(count) => 'Modifier ' + count + ' patient' + (count > 1 ? 's' : '')"
				:bulk-edit-position-label="(current, total) => 'Patient ' + current + ' sur ' + total"
				@delete-multiple="onDeleteMultiple"
				@save-multiple="onSaveMultiple"
			>
				<template #bulk-actions="{ count, deleteSelected, editSelected }">
					<VBtn color="primary" variant="flat" size="small" :prepend-icon="mdiPencil" @click="editSelected">
						Modifier {{ count }} patient(s)
					</VBtn>
					<VBtn color="error" variant="flat" size="small" :prepend-icon="mdiDelete" @click="deleteSelected">
						Supprimer {{ count }} patient(s)
					</VBtn>
				</template>
			</SyServerTable>
		`,
	}),
}

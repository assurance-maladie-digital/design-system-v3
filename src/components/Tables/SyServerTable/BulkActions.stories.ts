import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
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
 * Suppression en masse sur SyServerTable. Même API que SyTable (`show-select`,
 * `show-delete-selected`, évènement `@delete-multiple`, slot `#bulk-actions`),
 * mutualisée dans `common/`.
 */
export const Default: Story = {
	args: {
		suffix: 'server-bulk-actions',
		showSelect: true,
		showDeleteSelected: true,
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

			return { args, headers, items, selected, onDeleteMultiple }
		},
		template: `
			<SyServerTable
				v-bind="args"
				v-model="selected"
				:headers="headers"
				:items="items"
				:server-items-length="items.length"
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
	<SyServerTable
		suffix="server-bulk-actions"
		show-select
		show-delete-selected
		selection-key="id"
		hide-default-footer
		v-model="selected"
		:headers="headers"
		:items="items"
		:server-items-length="items.length"
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
	import { SyServerTable } from '@cnamts/synapse'

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

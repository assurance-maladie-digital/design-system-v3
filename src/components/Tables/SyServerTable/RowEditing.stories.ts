import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { mdiCheck, mdiClose, mdiDelete, mdiPencil } from '@mdi/js'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Édition de lignes',
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
	{ title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
]

const baseItems = [
	{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
	{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	{ id: 3, firstname: 'Camille', lastname: 'Tremblay', email: 'camille.tremblay@example.com' },
]

/**
 * Édition inline + suppression ligne à ligne sur SyServerTable.
 *
 * Le moteur d'édition est mutualisé avec SyTable (`useTableEditing`) : même API
 * (`editable`, header `editable: true`, slot `#item.actions`, évènements
 * `@save` / `@cancel` / `@delete`). La persistance reste à la charge du parent.
 */
export const Default: Story = {
	args: {
		suffix: 'server-row-editing',
		serverItemsLength: baseItems.length,
		editable: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
	},
	render: args => ({
		components: { SyServerTable, SyIconButton },
		setup() {
			const items = ref([...baseItems])

			function onSave(updated: Record<string, unknown>) {
				const index = items.value.findIndex(i => i.id === updated.id)
				if (index !== -1) {
					items.value[index] = { ...(items.value[index]), ...updated } as typeof baseItems[number]
				}
			}

			function onDelete(item: Record<string, unknown>) {
				items.value = items.value.filter(i => i.id !== item.id)
			}

			return { args, headers, items, onSave, onDelete, mdiPencil, mdiDelete, mdiCheck, mdiClose }
		},
		template: `
			<SyServerTable
				v-bind="args"
				:headers="headers"
				:items="items"
				:server-items-length="items.length"
				@save="onSave"
				@delete="onDelete"
			>
				<template #item.actions="{ isEditing, edit, save, cancel, remove }">
					<template v-if="!isEditing">
						<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
						<SyIconButton :icon="mdiDelete" label="Supprimer" density="comfortable" @click-icon-button="remove" />
					</template>
					<template v-else>
						<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="onSuccessVariant" style="opacity: 0.6" @click-icon-button="save" />
						<SyIconButton :icon="mdiClose" label="Annuler" density="comfortable" @click-icon-button="cancel" />
					</template>
				</template>
			</SyServerTable>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyServerTable
		suffix="server-row-editing"
		editable
		selection-key="id"
		hide-default-footer
		:headers="headers"
		:items="items"
		:server-items-length="items.length"
		@save="onSave"
		@delete="onDelete"
	>
		<template #item.actions="{ isEditing, edit, save, cancel, remove }">
			<template v-if="!isEditing">
				<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
				<SyIconButton :icon="mdiDelete" label="Supprimer" density="comfortable" @click-icon-button="remove" />
			</template>
			<template v-else>
				<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="onSuccessVariant" @click-icon-button="save" />
				<SyIconButton :icon="mdiClose" label="Annuler" density="comfortable" @click-icon-button="cancel" />
			</template>
		</template>
	</SyServerTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyServerTable, SyIconButton } from '@cnamts/synapse'
	import { mdiCheck, mdiClose, mdiDelete, mdiPencil } from '@mdi/js'

	const headers = [
		{ title: 'Nom', key: 'lastname', editable: true },
		{ title: 'Prénom', key: 'firstname', editable: true },
		{ title: 'Email', key: 'email', editable: true },
		{ title: 'Actions', key: 'actions', sortable: false, align: 'end' },
	]

	const items = ref([
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	])

	// SyServerTable ne mute jamais \`items\` : on persiste nous-mêmes l'item modifié
	function onSave(updated) {
		const index = items.value.findIndex(i => i.id === updated.id)
		if (index !== -1) {
			items.value[index] = { ...items.value[index], ...updated }
		}
	}

	function onDelete(item) {
		items.value = items.value.filter(i => i.id !== item.id)
	}
</script>
`,
			},
		],
	},
}

/**
 * Éditeur de cellule personnalisé via le slot `#edit.<key>`.
 * Ici la colonne « Nom » est mise en majuscules à la saisie, les autres gardent l'éditeur par défaut.
 */
export const CustomEditor: Story = {
	args: {
		suffix: 'server-row-editing-custom',
		serverItemsLength: baseItems.length,
		editable: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
	},
	render: args => ({
		components: { SyServerTable, SyIconButton },
		setup() {
			const items = ref([...baseItems])

			function onSave(updated: Record<string, unknown>) {
				const index = items.value.findIndex(i => i.id === updated.id)
				if (index !== -1) {
					items.value[index] = { ...(items.value[index]), ...updated } as typeof baseItems[number]
				}
			}

			return { args, headers, items, onSave, mdiPencil, mdiDelete, mdiCheck, mdiClose }
		},
		template: `
			<SyServerTable
				v-bind="args"
				:headers="headers"
				:items="items"
				:server-items-length="items.length"
				@save="onSave"
			>
				<template #edit.lastname="{ value, update }">
					<input
						:value="value"
						style="width:100%;padding:4px;text-transform:uppercase"
						@input="update($event.target.value.toUpperCase())"
					>
				</template>
				<template #item.actions="{ isEditing, edit, save, cancel }">
					<template v-if="!isEditing">
						<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
					</template>
					<template v-else>
						<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="onSuccessVariant" style="opacity: 0.6" @click-icon-button="save" />
						<SyIconButton :icon="mdiClose" label="Annuler" density="comfortable" @click-icon-button="cancel" />
					</template>
				</template>
			</SyServerTable>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyServerTable
		suffix="server-row-editing-custom"
		editable
		selection-key="id"
		hide-default-footer
		:headers="headers"
		:items="items"
		:server-items-length="items.length"
		@save="onSave"
	>
		<!-- Éditeur personnalisé pour la colonne "Nom" (saisie en majuscules) -->
		<template #edit.lastname="{ value, update }">
			<input
				:value="value"
				style="width:100%;padding:4px;text-transform:uppercase"
				@input="update($event.target.value.toUpperCase())"
			>
		</template>
		<template #item.actions="{ isEditing, edit, save, cancel }">
			<template v-if="!isEditing">
				<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
			</template>
			<template v-else>
				<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="onSuccessVariant" @click-icon-button="save" />
				<SyIconButton :icon="mdiClose" label="Annuler" density="comfortable" @click-icon-button="cancel" />
			</template>
		</template>
	</SyServerTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyServerTable, SyIconButton } from '@cnamts/synapse'
	import { mdiCheck, mdiClose, mdiPencil } from '@mdi/js'

	const headers = [
		{ title: 'Nom', key: 'lastname', editable: true },
		{ title: 'Prénom', key: 'firstname', editable: true },
		{ title: 'Email', key: 'email', editable: true },
		{ title: 'Actions', key: 'actions', sortable: false, align: 'end' },
	]

	const items = ref([
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	])

	function onSave(updated) {
		const index = items.value.findIndex(i => i.id === updated.id)
		if (index !== -1) {
			items.value[index] = { ...items.value[index], ...updated }
		}
	}
</script>
`,
			},
		],
	},
}

import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { mdiCheck, mdiClose, mdiDelete, mdiPencil } from '@mdi/js'
import type { VDataTable } from 'vuetify/components'
import SyTable from './SyTable.vue'
import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'

const meta = {
	title: 'Composants/Tableaux/SyTable/Édition de lignes',
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
	argTypes: {
		'item.actions': {
			description: 'Slot d\'actions par ligne. Reçoit les helpers d\'édition `{ item, isEditing, edit, save, cancel, remove }`.',
			control: undefined,
			table: {
				category: 'slots',
				type: { summary: 'slot', detail: '{ item, isEditing: boolean, edit: () => void, save: () => void, cancel: () => void, remove: () => void }' },
			},
		},
		'edit.<columnKey>': {
			description: 'Personnalise l\'éditeur d\'une cellule en édition inline. Remplacer `<columnKey>` par la clé de la colonne. Par défaut un `SyTextField`.',
			control: undefined,
			table: {
				category: 'slots',
				type: { summary: 'slot', detail: '{ item, value: unknown, update: (value: unknown) => void }' },
			},
		},
		'onEdit': {
			action: 'edit',
			description: 'Émis à l\'entrée en édition inline d\'une ligne.',
			table: {
				category: 'events',
				type: { summary: '(item: Record<string, unknown>) => void' },
			},
		},
		'onSave': {
			action: 'save',
			description: 'Émis à la validation de l\'édition inline. Reçoit la ligne mise à jour et l\'originale.',
			table: {
				category: 'events',
				type: { summary: '(updated: Record<string, unknown>, original: Record<string, unknown> | null) => void' },
			},
		},
		'onCancel': {
			action: 'cancel',
			description: 'Émis à l\'annulation de l\'édition inline.',
			table: {
				category: 'events',
				type: { summary: '(item: Record<string, unknown> | null) => void' },
			},
		},
		'onDelete': {
			action: 'delete',
			description: 'Émis au clic sur l\'action de suppression d\'une ligne.',
			table: {
				category: 'events',
				type: { summary: '(item: Record<string, unknown>) => void' },
			},
		},
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

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
 * Édition inline + suppression ligne à ligne.
 *
 * - `editable` active le moteur ; chaque header `editable: true` devient un champ en mode édition.
 * - Le slot `#item.actions` reçoit les helpers `{ item, isEditing, edit, save, cancel, remove }`.
 * - Le composant n'altère jamais `items` : il émet `@save(updated, original)`, `@cancel`, `@delete`.
 */
export const Default: Story = {
	args: {
		suffix: 'row-editing',
		editable: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
	},
	render: args => ({
		components: { SyTable, SyIconButton },
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
			<SyTable
				v-bind="args"
				:headers="headers"
				:items="items"
				@save="onSave"
				@delete="onDelete"
			>
				<template #item.actions="{ isEditing, edit, save, cancel, remove }">
					<template v-if="!isEditing">
						<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
						<SyIconButton :icon="mdiDelete" label="Supprimer" density="comfortable" color="error" @click-icon-button="remove" />
					</template>
					<template v-else>
						<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="onSuccessVariant" style="opacity: 0.6" @click-icon-button="save" />
						<SyIconButton :icon="mdiClose" label="Annuler" density="comfortable" @click-icon-button="cancel" />
					</template>
				</template>
			</SyTable>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable
		suffix="row-editing"
		editable
		selection-key="id"
		hide-default-footer
		:headers="headers"
		:items="items"
		@save="onSave"
		@delete="onDelete"
	>
		<!-- Le slot reçoit les helpers d'édition -->
		<template #item.actions="{ isEditing, edit, save, cancel, remove }">
			<template v-if="!isEditing">
				<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
				<SyIconButton :icon="mdiDelete" label="Supprimer" density="comfortable" color="error" @click-icon-button="remove" />
			</template>
			<template v-else>
				<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="onSuccessVariant" @click-icon-button="save" />
				<SyIconButton :icon="mdiClose" label="Annuler" density="comfortable" @click-icon-button="cancel" />
			</template>
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
	import { SyTable, SyIconButton } from '@cnamts/synapse'
	import { mdiCheck, mdiClose, mdiDelete, mdiPencil } from '@mdi/js'

	// Seules les colonnes \`editable: true\` deviennent éditables
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

	// SyTable ne mute jamais \`items\` : on persiste nous-mêmes l'item modifié
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
 * Ici la colonne « Nom » utilise un `<input>` HTML personnalisé ; les autres gardent l'éditeur par défaut.
 */
export const CustomEditor: Story = {
	args: {
		suffix: 'row-editing-custom',
		editable: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
	},
	render: args => ({
		components: { SyTable, SyIconButton },
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
			<SyTable
				v-bind="args"
				:headers="headers"
				:items="items"
				@save="onSave"
			>
				<template #edit.lastname="{ value, update }">
					<input
						:value="value"
						style="width:100%;padding:4px;border:1px solid #767676;border-radius:4px;background:#fff"
						@input="update($event.target.value)"
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
			</SyTable>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyTable
		suffix="row-editing-custom"
		editable
		selection-key="id"
		hide-default-footer
		:headers="headers"
		:items="items"
		@save="onSave"
	>
		<!-- Éditeur personnalisé pour la colonne "Nom" (input HTML) -->
		<template #edit.lastname="{ value, update }">
			<input
				:value="value"
				style="width:100%;padding:4px;border:1px solid #767676;border-radius:4px;background:#fff"
				@input="update($event.target.value)"
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
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyTable, SyIconButton } from '@cnamts/synapse'
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

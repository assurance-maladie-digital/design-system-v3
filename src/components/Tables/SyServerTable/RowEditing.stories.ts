import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { mdiCheck, mdiClose, mdiDelete, mdiPencil } from '@mdi/js'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import SyIconButton from '@/components/Customs/SyIconButton/SyIconButton.vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import { commonTableArgTypes, commonTableEventArgs } from '../common/storyArgTypes'
import { useServerEditingDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Édition/Ligne par ligne',
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
	argTypes: {
		...commonTableArgTypes,
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
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable, SyIconButton },
		setup() {
			const { items, state, StateEnum } = useServerEditingDemo(baseItems)

			function onSave(updated: Record<string, unknown>) {
				const index = items.value.findIndex(i => i.id === updated.id)
				if (index !== -1) {
					items.value[index] = { ...(items.value[index]), ...updated } as typeof baseItems[number]
				}
			}

			function onDelete(item: Record<string, unknown>) {
				items.value = items.value.filter(i => i.id !== item.id)
			}

			return { args, headers, items, state, StateEnum, onSave, onDelete, mdiPencil, mdiDelete, mdiCheck, mdiClose }
		},
		template: `
			<SyServerTable
				v-bind="args"
				:headers="headers"
				:items="items"
				:server-items-length="items.length" :loading="state === StateEnum.PENDING"
				@save="onSave"
				@delete="onDelete"
			>
				<template #item.actions="{ isEditing, edit, save, cancel, remove }">
					<template v-if="!isEditing">
						<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
						<SyIconButton :icon="mdiDelete" label="Supprimer" density="comfortable" color="error" @click-icon-button="remove" />
					</template>
					<template v-else>
						<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="on-success-variant" style="opacity: 0.6" @click-icon-button="save" />
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
		:loading="state === StateEnum.PENDING"
		@save="onSave"
		@delete="onDelete"
	>
		<template #item.actions="{ isEditing, edit, save, cancel, remove }">
			<template v-if="!isEditing">
				<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
				<SyIconButton :icon="mdiDelete" label="Supprimer" density="comfortable" color="error" @click-icon-button="remove" />
			</template>
			<template v-else>
				<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="on-success-variant" style="opacity: 0.6" @click-icon-button="save" />
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
	import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
	import { mdiCheck, mdiClose, mdiDelete, mdiPencil } from '@mdi/js'

	const headers = [
		{ title: 'Nom', key: 'lastname', editable: true },
		{ title: 'Prénom', key: 'firstname', editable: true },
		{ title: 'Email', key: 'email', editable: true },
		{ title: 'Actions', key: 'actions', sortable: false, align: 'end' },
	]

	const items = ref([])
	const state = ref(StateEnum.IDLE)

	const getPatients = () => [
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	]

	// Chargement initial (à remplacer par un appel serveur)
	async function fetchData() {
		state.value = StateEnum.PENDING
		await new Promise(r => setTimeout(r, 800))
		items.value = getPatients()
		state.value = StateEnum.RESOLVED
	}
	fetchData()

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
 * Ici la colonne « Nom » utilise un `<input>` HTML personnalisé ; les autres gardent l'éditeur par défaut.
 */
export const CustomEditor: Story = {
	args: {
		suffix: 'server-row-editing-custom',
		serverItemsLength: baseItems.length,
		editable: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable, SyIconButton },
		setup() {
			const { items, state, StateEnum } = useServerEditingDemo(baseItems)

			function onSave(updated: Record<string, unknown>) {
				const index = items.value.findIndex(i => i.id === updated.id)
				if (index !== -1) {
					items.value[index] = { ...(items.value[index]), ...updated } as typeof baseItems[number]
				}
			}

			return { args, headers, items, state, StateEnum, onSave, mdiPencil, mdiDelete, mdiCheck, mdiClose }
		},
		template: `
			<SyServerTable
				v-bind="args"
				:headers="headers"
				:items="items"
				:server-items-length="items.length" :loading="state === StateEnum.PENDING"
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
						<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="on-success-variant" style="opacity: 0.6" @click-icon-button="save" />
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
		:loading="state === StateEnum.PENDING"
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
				<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="on-success-variant" style="opacity: 0.6" @click-icon-button="save" />
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
	import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
	import { mdiCheck, mdiClose, mdiPencil } from '@mdi/js'

	const headers = [
		{ title: 'Nom', key: 'lastname', editable: true },
		{ title: 'Prénom', key: 'firstname', editable: true },
		{ title: 'Email', key: 'email', editable: true },
		{ title: 'Actions', key: 'actions', sortable: false, align: 'end' },
	]

	const items = ref([])
	const state = ref(StateEnum.IDLE)

	const getPatients = () => [
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	]

	// Chargement initial (à remplacer par un appel serveur)
	async function fetchData() {
		state.value = StateEnum.PENDING
		await new Promise(r => setTimeout(r, 800))
		items.value = getPatients()
		state.value = StateEnum.RESOLVED
	}
	fetchData()

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

/**
 * Éditer une colonne dont la valeur est **non primitive** (ici une `Date`), via
 * le **DatePicker du Design System**. L'éditeur texte par défaut ne gère que les
 * primitives ; pour un objet / `Date` / tableau, il faut fournir un slot
 * `#edit.<colonne>` avec un éditeur adapté (sinon aucun éditeur n'est rendu et un
 * avertissement est émis en dev). Le rendu **hors édition** passe par `#item.<colonne>`.
 *
 * Le `DatePicker` travaille avec une **chaîne formatée** (`format`) : on convertit
 * donc `Date` ↔ chaîne dans le slot pour conserver une `Date` en donnée.
 */
export const NonPrimitiveEditor: Story = {
	args: {
		suffix: 'server-row-editing-nonprimitive',
		serverItemsLength: 2,
		editable: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable, SyIconButton, DatePicker },
		setup() {
			const rows = [
				{ id: 1, firstname: 'Virginie', birthdate: new Date('1985-04-12') },
				{ id: 2, firstname: 'Étienne', birthdate: new Date('1990-11-30') },
			]
			const { items, state, StateEnum } = useServerEditingDemo(rows)
			const editHeaders = [
				{ title: 'Prénom', key: 'firstname', editable: true },
				{ title: 'Naissance', key: 'birthdate', editable: true },
				{ title: 'Actions', key: 'actions', sortable: false, align: 'end' as const },
			]
			function onSave(updated: Record<string, unknown>) {
				const index = items.value.findIndex(i => i.id === updated.id)
				if (index !== -1) {
					items.value[index] = { ...items.value[index], ...updated } as typeof rows[number]
				}
			}
			// Pont Date ↔ chaîne « DD/MM/YYYY » attendue par le DatePicker du DS
			const dateToStr = (d: unknown): string =>
				d instanceof Date
					? [String(d.getDate()).padStart(2, '0'), String(d.getMonth() + 1).padStart(2, '0'), d.getFullYear()].join('/')
					: ''
			const strToDate = (s: unknown): Date | null => {
				if (typeof s !== 'string') return null
				const [dd, mm, yyyy] = s.split('/').map(Number)
				if (!dd || !mm || !yyyy) return null
				return new Date(yyyy, mm - 1, dd)
			}

			return { args, editHeaders, items, state, StateEnum, onSave, dateToStr, strToDate, mdiCheck, mdiClose, mdiPencil }
		},
		template: `
			<SyServerTable v-bind="args" :headers="editHeaders" :items="items" :server-items-length="items.length" :loading="state === StateEnum.PENDING" @save="onSave">
				<!-- Rendu hors édition d'une valeur objet : via #item.<colonne> -->
				<template #item.birthdate="{ item }">
					{{ item.birthdate.toLocaleDateString('fr-FR') }}
				</template>
				<!-- Édition d'une valeur non primitive : DatePicker du DS via #edit.<colonne> -->
				<template #edit.birthdate="{ value, update }">
					<DatePicker :model-value="dateToStr(value)" format="DD/MM/YYYY" density="compact" hide-details disable-error-handling @update:model-value="s => update(strToDate(s))" />
				</template>
				<template #item.actions="{ isEditing, edit, save, cancel }">
					<template v-if="!isEditing">
						<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
					</template>
					<template v-else>
						<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="on-success-variant" style="opacity: 0.6" @click-icon-button="save" />
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
	<SyServerTable suffix="server-row-editing-nonprimitive" editable selection-key="id" hide-default-footer :headers="headers" :items="items" :server-items-length="items.length" :loading="state === StateEnum.PENDING" @save="onSave">
		<!-- Rendu hors édition d'une valeur non primitive -->
		<template #item.birthdate="{ item }">
			{{ item.birthdate.toLocaleDateString('fr-FR') }}
		</template>
		<!-- Éditeur adapté : DatePicker du DS (l'éditeur texte par défaut ne gère pas les objets/Date) -->
		<template #edit.birthdate="{ value, update }">
			<DatePicker :model-value="dateToStr(value)" format="DD/MM/YYYY" density="compact" hide-details disable-error-handling @update:model-value="s => update(strToDate(s))" />
		</template>
		<template #item.actions="{ isEditing, edit, save, cancel }">
			<template v-if="!isEditing">
				<SyIconButton :icon="mdiPencil" label="Éditer" density="comfortable" @click-icon-button="edit" />
			</template>
			<template v-else>
				<SyIconButton :icon="mdiCheck" label="Valider" density="comfortable" color="on-success-variant" style="opacity: 0.6" @click-icon-button="save" />
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
	import { SyServerTable, SyIconButton, DatePicker } from '@cnamts/synapse'
	import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
	import { mdiCheck, mdiClose, mdiPencil } from '@mdi/js'

	const headers = [
		{ title: 'Prénom', key: 'firstname', editable: true },
		{ title: 'Naissance', key: 'birthdate', editable: true },
		{ title: 'Actions', key: 'actions', sortable: false, align: 'end' },
	]

	const items = ref([])
	const state = ref(StateEnum.IDLE)

	const getPatients = () => [
		{ id: 1, firstname: 'Virginie', birthdate: new Date('1985-04-12') },
		{ id: 2, firstname: 'Étienne', birthdate: new Date('1990-11-30') },
	]

	// Chargement initial (à remplacer par un appel serveur)
	async function fetchData() {
		state.value = StateEnum.PENDING
		await new Promise(r => setTimeout(r, 800))
		items.value = getPatients()
		state.value = StateEnum.RESOLVED
	}
	fetchData()

	// La valeur est une Date (non primitive) : DatePicker du DS via le slot #edit,
	// avec conversion Date <-> chaîne « DD/MM/YYYY »
	const dateToStr = (d) => d instanceof Date
		? [String(d.getDate()).padStart(2, '0'), String(d.getMonth() + 1).padStart(2, '0'), d.getFullYear()].join('/')
		: ''
	const strToDate = (s) => {
		if (typeof s !== 'string') return null
		const [dd, mm, yyyy] = s.split('/').map(Number)
		if (!dd || !mm || !yyyy) return null
		return new Date(yyyy, mm - 1, dd)
	}

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

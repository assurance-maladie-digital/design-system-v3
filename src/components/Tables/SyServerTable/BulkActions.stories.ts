import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, ref } from 'vue'
import { mdiChevronLeft, mdiChevronRight, mdiDelete, mdiPencil } from '@mdi/js'
import type { VDataTable } from 'vuetify/components'
import SyServerTable from './SyServerTable.vue'
import DialogBox from '@/components/DialogBox/DialogBox.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import { commonTableArgTypes, commonTableEventArgs, commonTableExcludedControls } from '../common/storyArgTypes'
import { useServerEditingDemo } from '../common/serverStoryHelpers'

const meta = {
	title: 'Composants/Tableaux/SyServerTable/Édition/Actions groupées',
	component: SyServerTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { hideNoControlsWarning: true, exclude: commonTableExcludedControls },
	},
	argTypes: {
		...commonTableArgTypes,
		'bulk-actions': {
			description: 'Barre affichée quand des lignes sont sélectionnées. Le composant ne fournit que la sélection ; **le projet rend ses propres actions** (éditer, supprimer, exporter…) et pilote leur UX (DialogBox, drawer, page…).',
			control: undefined,
			table: {
				category: 'slots',
				type: { summary: 'slot', detail: '{ selected: Record<string, unknown>[], count: number, clearSelection: () => void }' },
			},
		},
	},
} satisfies Meta<typeof SyServerTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

const headers = [
	{ title: 'Nom', key: 'lastname' },
	{ title: 'Prénom', key: 'firstname' },
	{ title: 'Email', key: 'email' },
	{ title: 'Statut', key: 'statut' },
]

const baseItems = [
	{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com', statut: 'Actif' },
	{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com', statut: 'Inactif' },
	{ id: 3, firstname: 'Camille', lastname: 'Tremblay', email: 'camille.tremblay@example.com', statut: 'Actif' },
]

// Jeu plus long + conteneur scrollable pour illustrer la barre d'actions
// « sticky » : elle reste visible en haut même après avoir sélectionné une
// ligne située plus bas dans le tableau.
const manyItems = [
	{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com', statut: 'Actif' },
	{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com', statut: 'Inactif' },
	{ id: 3, firstname: 'Camille', lastname: 'Tremblay', email: 'camille.tremblay@example.com', statut: 'Actif' },
	{ id: 4, firstname: 'Thierry', lastname: 'Bobu', email: 'thierry.bobu@example.com', statut: 'Actif' },
	{ id: 5, firstname: 'Bernadette', lastname: 'Langelier', email: 'bernadette.langelier@example.com', statut: 'Suspendu' },
	{ id: 6, firstname: 'Agate', lastname: 'Roy', email: 'agate.roy@example.com', statut: 'Actif' },
	{ id: 7, firstname: 'Louis', lastname: 'Denis', email: 'louis.denis@example.com', statut: 'Inactif' },
	{ id: 8, firstname: 'Édith', lastname: 'Cartier', email: 'edith.cartier@example.com', statut: 'Actif' },
	{ id: 9, firstname: 'Alphonse', lastname: 'Bouvier', email: 'alphonse.bouvier@example.com', statut: 'Suspendu' },
	{ id: 10, firstname: 'Rosemarie', lastname: 'Quessy', email: 'rosemarie.quessy@example.com', statut: 'Actif' },
	{ id: 11, firstname: 'Serge', lastname: 'Rivard', email: 'serge.rivard@example.com', statut: 'Inactif' },
	{ id: 12, firstname: 'Delphine', lastname: 'Robillard', email: 'delphine.robillard@example.com', statut: 'Actif' },
]

const statutOptions = [
	{ text: 'Actif', value: 'Actif' },
	{ text: 'Inactif', value: 'Inactif' },
	{ text: 'Suspendu', value: 'Suspendu' },
]

/**
 * Le tableau n'expose que la **sélection** via le slot `#bulk-actions`
 * (`{ selected, count, clearSelection }`). L'édition groupée et la suppression
 * sont **pilotées par le projet** avec des `DialogBox` du Design System.
 *
 * Pattern recommandé en multi-sélection : **appliquer un attribut partagé** à
 * toute la sélection (ici le statut). On n'édite pas des valeurs propres à
 * chaque ligne (nom, email…) — pour cela voir le variant « édition séquentielle ».
 */
export const Default: Story = {
	args: {
		suffix: 'server-bulk-actions',
		caption: 'Liste des patients',
		serverItemsLength: manyItems.length,
		showSelect: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable, DialogBox, SySelect },
		setup() {
			const { items, state, StateEnum } = useServerEditingDemo(manyItems)
			const selected = ref<number[]>([])
			let clearAfter = () => {}

			// Édition : appliquer un statut commun à toute la sélection
			const editOpen = ref(false)
			const statut = ref('Actif')
			const toEdit = ref<typeof baseItems>([])
			function openEdit(rows: typeof baseItems, clearSelection: () => void) {
				toEdit.value = rows
				clearAfter = clearSelection
				statut.value = 'Actif'
				editOpen.value = true
			}
			function applyEdit() {
				const ids = new Set(toEdit.value.map(r => r.id))
				items.value = items.value.map(r => ids.has(r.id) ? { ...r, statut: statut.value } : r) as typeof baseItems
				editOpen.value = false
				clearAfter()
			}

			// Suppression : confirmation
			const deleteOpen = ref(false)
			const toDelete = ref<typeof baseItems>([])
			function openDelete(rows: typeof baseItems, clearSelection: () => void) {
				toDelete.value = rows
				clearAfter = clearSelection
				deleteOpen.value = true
			}
			function applyDelete() {
				const ids = new Set(toDelete.value.map(r => r.id))
				items.value = items.value.filter(r => !ids.has(r.id))
				deleteOpen.value = false
				clearAfter()
			}

			return { args, headers, items, state, StateEnum, selected, statutOptions, statut, editOpen, deleteOpen, openEdit, applyEdit, openDelete, applyDelete, mdiPencil, mdiDelete }
		},
		template: `
			<div>
				<!-- Conteneur scrollable : la barre d'actions reste « sticky » en haut -->
				<div style="max-height: 360px; overflow: auto; border-radius: 4px;">
					<SyServerTable v-bind="args" v-model="selected" :headers="headers" :items="items" :server-items-length="items.length" :loading="state === StateEnum.PENDING">
						<template #bulk-actions="{ selected, count, clearSelection }">
							<VBtn color="primary" variant="flat" size="small" :prepend-icon="mdiPencil" @click="openEdit(selected, clearSelection)">
								Modifier le statut ({{ count }})
							</VBtn>
							<VBtn color="error" variant="flat" size="small" :prepend-icon="mdiDelete" @click="openDelete(selected, clearSelection)">
								Supprimer ({{ count }})
							</VBtn>
						</template>
					</SyServerTable>
				</div>

				<DialogBox v-model="editOpen" title="Modifier le statut de la sélection" confirm-btn-text="Appliquer" @confirm="applyEdit" @cancel="editOpen = false">
					<SySelect v-model="statut" :items="statutOptions" label="Nouveau statut" disable-error-handling />
				</DialogBox>

				<DialogBox v-model="deleteOpen" title="Supprimer la sélection" confirm-btn-text="Supprimer" @confirm="applyDelete" @cancel="deleteOpen = false">
					<p>Confirmer la suppression des lignes sélectionnées ?</p>
				</DialogBox>
			</div>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<!-- La barre d'actions groupées est « sticky » par défaut : elle reste visible
	     en haut quand on fait défiler le tableau (désactivable via :sticky-bulk-actions="false"). -->
	<SyServerTable suffix="server-bulk-actions" show-select selection-key="id" v-model="selected" :headers="headers" :items="items" :server-items-length="items.length" :loading="state === StateEnum.PENDING">
		<!-- Le projet rend ses propres actions ; le tableau ne fournit que la sélection -->
		<template #bulk-actions="{ selected, count, clearSelection }">
			<VBtn color="primary" variant="flat" size="small" :prepend-icon="mdiPencil" @click="openEdit(selected, clearSelection)">
				Modifier le statut ({{ count }})
			</VBtn>
			<VBtn color="error" variant="flat" size="small" :prepend-icon="mdiDelete" @click="openDelete(selected, clearSelection)">
				Supprimer ({{ count }})
			</VBtn>
		</template>
	</SyServerTable>

	<!-- Édition : appliquer un statut commun à toute la sélection -->
	<DialogBox v-model="editOpen" title="Modifier le statut de la sélection" confirm-btn-text="Appliquer" @confirm="applyEdit" @cancel="editOpen = false">
		<SySelect v-model="statut" :items="statutOptions" label="Nouveau statut" disable-error-handling />
	</DialogBox>

	<!-- Suppression -->
	<DialogBox v-model="deleteOpen" title="Supprimer la sélection" confirm-btn-text="Supprimer" @confirm="applyDelete" @cancel="deleteOpen = false">
		<p>Confirmer la suppression des lignes sélectionnées ?</p>
	</DialogBox>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { ref } from 'vue'
	import { SyServerTable, DialogBox, SySelect } from '@cnamts/synapse'
	import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
	import { mdiDelete, mdiPencil } from '@mdi/js'

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
		{ title: 'Statut', key: 'statut' },
	]
	const items = ref([])
	const state = ref(StateEnum.IDLE)
	const selected = ref([])

	const getPatients = () => [
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com', statut: 'Actif' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com', statut: 'Inactif' },
	]

	// Chargement initial (à remplacer par un appel serveur)
	async function fetchData() {
		state.value = StateEnum.PENDING
		await new Promise(r => setTimeout(r, 800))
		items.value = getPatients()
		state.value = StateEnum.RESOLVED
	}
	fetchData()
	const statutOptions = [
		{ text: 'Actif', value: 'Actif' },
		{ text: 'Inactif', value: 'Inactif' },
		{ text: 'Suspendu', value: 'Suspendu' },
	]

	let clearAfter = () => {}

	// Édition : appliquer un statut commun à toute la sélection
	const editOpen = ref(false)
	const statut = ref('Actif')
	const toEdit = ref([])
	function openEdit(rows, clearSelection) {
		toEdit.value = rows; clearAfter = clearSelection; statut.value = 'Actif'; editOpen.value = true
	}
	function applyEdit() {
		const ids = new Set(toEdit.value.map(r => r.id))
		items.value = items.value.map(r => ids.has(r.id) ? { ...r, statut: statut.value } : r)
		editOpen.value = false; clearAfter()
	}

	// Suppression
	const deleteOpen = ref(false)
	const toDelete = ref([])
	function openDelete(rows, clearSelection) {
		toDelete.value = rows; clearAfter = clearSelection; deleteOpen.value = true
	}
	function applyDelete() {
		const ids = new Set(toDelete.value.map(r => r.id))
		items.value = items.value.filter(r => !ids.has(r.id))
		deleteOpen.value = false; clearAfter()
	}
</script>
`,
			},
		],
	},
}

/**
 * Pattern avancé : édition **séquentielle** ligne par ligne, entièrement
 * pilotée par le projet. Adapté quand chaque ligne a des valeurs propres à
 * éditer (nom, email…). Le projet gère lui-même l'accessibilité — position
 * annoncée en `aria-live` et navigation Précédent/Suivant.
 */
export const SequentialEdit: Story = {
	args: {
		suffix: 'server-bulk-actions-sequential',
		caption: 'Liste des patients',
		serverItemsLength: baseItems.length,
		showSelect: true,
		selectionKey: 'id',
		hideDefaultFooter: true,
		...commonTableEventArgs(),
	},
	render: args => ({
		components: { SyServerTable, DialogBox, SyTextField, SySelect },
		setup() {
			const { items, state, StateEnum } = useServerEditingDemo(baseItems)
			const selected = ref<number[]>([])
			let clearAfter = () => {}

			const open = ref(false)
			const drafts = ref<typeof baseItems>([])
			const index = ref(0)
			const current = computed(() => drafts.value[index.value])
			const position = computed(() => `Ligne ${index.value + 1} sur ${drafts.value.length}`)

			function openEdit(rows: typeof baseItems, clearSelection: () => void) {
				drafts.value = rows.map(r => ({ ...r }))
				index.value = 0
				clearAfter = clearSelection
				open.value = true
			}
			function prev() {
				if (index.value > 0) index.value--
			}
			function next() {
				if (index.value < drafts.value.length - 1) index.value++
			}
			function apply() {
				const byId = new Map(drafts.value.map(r => [r.id, r]))
				items.value = items.value.map(r => byId.get(r.id) ?? r) as typeof baseItems
				open.value = false
				clearAfter()
			}

			return { args, headers, items, state, StateEnum, selected, open, drafts, index, current, position, statutOptions, openEdit, prev, next, apply, mdiPencil, mdiChevronLeft, mdiChevronRight }
		},
		template: `
			<div>
				<SyServerTable v-bind="args" v-model="selected" :headers="headers" :items="items" :server-items-length="items.length" :loading="state === StateEnum.PENDING">
					<template #bulk-actions="{ selected, count, clearSelection }">
						<VBtn color="primary" variant="flat" size="small" :prepend-icon="mdiPencil" @click="openEdit(selected, clearSelection)">
							Modifier {{ count }} ligne(s)
						</VBtn>
					</template>
				</SyServerTable>

				<DialogBox v-model="open" title="Édition" confirm-btn-text="Appliquer" @confirm="apply" @cancel="open = false">
					<div v-if="drafts.length > 1" class="d-flex align-center justify-space-between mb-4">
						<VBtn color="primary" variant="flat" size="small" :prepend-icon="mdiChevronLeft" :disabled="index === 0" aria-label="Ligne précédente" @click="prev">Précédent</VBtn>
						<span role="status" aria-live="polite" class="text-body-2">{{ position }}</span>
						<VBtn color="primary" variant="flat" size="small" :append-icon="mdiChevronRight" :disabled="index === drafts.length - 1" aria-label="Ligne suivante" @click="next">Suivant</VBtn>
					</div>
					<div v-if="current" class="d-flex flex-column ga-3">
						<SyTextField v-model="current.lastname" label="Nom" disable-error-handling />
						<SyTextField v-model="current.firstname" label="Prénom" disable-error-handling />
						<SyTextField v-model="current.email" label="Email" disable-error-handling />
						<SySelect v-model="current.statut" :items="statutOptions" label="Statut" disable-error-handling />
					</div>
				</DialogBox>
			</div>
		`,
	}),
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyServerTable suffix="server-bulk-actions-sequential" caption="Liste des patients" show-select selection-key="id" v-model="selected" :headers="headers" :items="items" :server-items-length="items.length" :loading="state === StateEnum.PENDING">
		<template #bulk-actions="{ selected, count, clearSelection }">
			<VBtn color="primary" variant="flat" size="small" :prepend-icon="mdiPencil" @click="openEdit(selected, clearSelection)">
				Modifier {{ count }} ligne(s)
			</VBtn>
		</template>
	</SyServerTable>

	<!-- Édition séquentielle : navigation et accessibilité gérées par le projet -->
	<DialogBox v-model="open" title="Édition" confirm-btn-text="Appliquer" @confirm="apply" @cancel="open = false">
		<div v-if="drafts.length > 1" class="d-flex align-center justify-space-between mb-4">
			<VBtn color="primary" variant="flat" size="small" :prepend-icon="mdiChevronLeft" :disabled="index === 0" aria-label="Ligne précédente" @click="prev">Précédent</VBtn>
			<span role="status" aria-live="polite">{{ position }}</span>
			<VBtn color="primary" variant="flat" size="small" :append-icon="mdiChevronRight" :disabled="index === drafts.length - 1" aria-label="Ligne suivante" @click="next">Suivant</VBtn>
		</div>
		<div v-if="current" class="d-flex flex-column ga-3">
			<SyTextField v-model="current.lastname" label="Nom" disable-error-handling />
			<SyTextField v-model="current.firstname" label="Prénom" disable-error-handling />
			<SyTextField v-model="current.email" label="Email" disable-error-handling />
			<SySelect v-model="current.statut" :items="statutOptions" label="Statut" disable-error-handling />
		</div>
	</DialogBox>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SyServerTable, DialogBox, SyTextField, SySelect } from '@cnamts/synapse'
	import { StateEnum } from '@cnamts/synapse/src/components/Tables/common/constants/StateEnum'
	import { mdiChevronLeft, mdiChevronRight, mdiPencil } from '@mdi/js'

	const headers = [
		{ title: 'Nom', key: 'lastname' },
		{ title: 'Prénom', key: 'firstname' },
		{ title: 'Email', key: 'email' },
		{ title: 'Statut', key: 'statut' },
	]
	const items = ref([])
	const state = ref(StateEnum.IDLE)
	const selected = ref([])

	const getPatients = () => [
		{ id: 1, firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com', statut: 'Actif' },
		{ id: 2, firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com', statut: 'Inactif' },
	]

	// Chargement initial (à remplacer par un appel serveur)
	async function fetchData() {
		state.value = StateEnum.PENDING
		await new Promise(r => setTimeout(r, 800))
		items.value = getPatients()
		state.value = StateEnum.RESOLVED
	}
	fetchData()
	const statutOptions = [
		{ text: 'Actif', value: 'Actif' },
		{ text: 'Inactif', value: 'Inactif' },
		{ text: 'Suspendu', value: 'Suspendu' },
	]

	let clearAfter = () => {}
	const open = ref(false)
	const drafts = ref([])
	const index = ref(0)
	const current = computed(() => drafts.value[index.value])
	const position = computed(() => 'Ligne ' + (index.value + 1) + ' sur ' + drafts.value.length)

	function openEdit(rows, clearSelection) {
		drafts.value = rows.map(r => ({ ...r })); index.value = 0; clearAfter = clearSelection; open.value = true
	}
	function prev() { if (index.value > 0) index.value-- }
	function next() { if (index.value < drafts.value.length - 1) index.value++ }
	function apply() {
		const byId = new Map(drafts.value.map(r => [r.id, r]))
		items.value = items.value.map(r => byId.get(r.id) ?? r)
		open.value = false; clearAfter()
	}
</script>
`,
			},
		],
	},
}

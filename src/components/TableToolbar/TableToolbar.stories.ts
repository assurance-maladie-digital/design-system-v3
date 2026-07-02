import type { Meta, StoryObj } from '@storybook/vue3-vite'
import TableToolbar from './TableToolbar.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import { ref, computed } from 'vue'
import { fn } from 'storybook/test'
import SyTable from '@/components/Tables/SyTable/SyTable.vue'

const meta = {
	title: 'Composants/Tableaux/TableToolbar',
	component: TableToolbar,
	argTypes: {
		'nbTotal': {
			description: 'Le nombre total de résultats',
			type: 'number',
			control: {
				type: 'number',
			},
			table: {
				category: 'props',
			},
		},
		'nbFiltered': {
			description: 'Le nombre de résultats filtrés.',
			type: 'number',
			control: {
				type: 'number',
			},
		},
		'search': {
			description: 'La valeur du champ de recherche',
			type: 'string',
			control: {
				type: 'text',
			},
		},
		'searchLabel': {
			description: 'Le label du champ de recherche',
			type: 'string',
			control: {
				type: 'text',
			},
			defaultValue: 'Rechercher',
		},
		'showAddButton': {
			description: 'Affiche le bouton d\'ajout',
			type: 'boolean',
			control: {
				type: 'boolean',
			},
		},
		'addButtonLabel': {
			description: 'Le label du bouton d\'ajout',
			type: 'string',
			control: {
				type: 'text',
			},
			defaultValue: 'Ajouter',
		},
		'loading': {
			description: 'Désactive les éléments interactifs',
			type: 'boolean',
			control: {
				type: 'boolean',
			},
			defaultValue: false,
		},
		'locales': {
			description: 'Traductions',
			control: {
				type: 'object',
			},
			table: {
				type: {
					summary: 'object',
				},
				defaultValue: {
					summary: 'Locales',
					detail: `{
	rowText: (lignes: string, plural: boolean): string =>
\`\${lignes} ligne\${plural ? 's' : ''}\`,
	search: 'Rechercher',
	addBtnLabel: 'Ajouter',
}`,
				},
			},
		},
		'vuetifyOptions': {
			control: 'object',
			description: 'Personnalisation des composants Vuetify internes',
			table: {
				category: 'props',
				defaultValue: {
					summary: 'object',
					detail: `
{
	toolbar: {
		flat: true,
		color: '#FFFFFF',
		height: 'auto',
		minHeight: '56px',
		class: 'd-flex',
	},
	addBtn: {
		variant: 'outlined',
		color: 'primary',
		class: 'my-1 px-2 px-md-4',
		minWidth: '44px',
	},
	addIconLabel: {
		class: 'mr-1',
	},
	textField: {
		variant: 'underlined',
		clearable: true,
		singleLine: true,
		hideDetails: true,
	},
}`,
				},
			},
		},
		'filters': {
			control: 'text',
			description: 'Slot pour ajouter des filtres',
		},
		'searchLeft': {
			control: 'text',
			description: 'Slot pour le contenu à gauche du champ de recherche',
		},
		'searchRight': {
			control: 'text',
			description: 'Slot pour le contenu à droite du champ de recherche',
		},
		'onAdd': {
			description: 'Événement émis lors du clic sur le bouton d\'ajout',
			table: {
				category: 'events',
			},
		},
		'onUpdate:search': {
			description: 'Événement émis lors de la modification du champ de recherche',
			table: {
				category: 'events',
			},
		},
	},
	parameters: {
		controls: {
			exclude: ['add', 'update:search'],
		},
	},
} satisfies Meta<typeof TableToolbar>

export default meta

type Story = StoryObj<typeof meta>

const headers = [
	{
		title: 'Nom',
		sortable: true,
		key: 'lastname',
	},
	{
		title: 'Prénom',
		sortable: true,
		key: 'firstname',
	},
	{
		title: 'Email',
		sortable: true,
		key: 'email',
	},
]

const items = [
	{
		firstname: 'Virginie',
		lastname: 'Beauchesne',
		email: 'virginie.beauchesne@example.com',
	},
	{
		firstname: 'Étienne',
		lastname: 'Salois',
		email: 'etienne.salois@example.com',
	},
]

const defaultVuetifyOptions = {
	textField: {
		variant: 'outlined',
		density: 'compact',
		hideDetails: true,
		clearable: true,
	},
}

const createFilteredItems = (search: { value: string | undefined }) => computed(() => {
	if (!search.value) {
		return items
	}

	const value = search.value.toLowerCase()

	return items.filter(item => (
		item.firstname.toLowerCase().includes(value)
		|| item.lastname.toLowerCase().includes(value)
		|| item.email.toLowerCase().includes(value)
	))
})

export const Default: Story = {
	args: {
		'nbTotal': 2,
		'onAdd': fn(),
		'onUpdate:search': fn(),
		'vuetifyOptions': defaultVuetifyOptions,
	},
	render: args => ({
		components: { TableToolbar, SyTable },
		setup() {
			const search = ref('')
			const filteredItems = createFilteredItems(search)

			return { args, headers, items, filteredItems, search }
		},
		template: `
			<SyTable
				:headers="headers"
				:items="filteredItems"
				:items-per-page="5"
				hide-default-footer
				:save-state="false"
				suffix="table-toolbar-default"
			>
				<template #top>
					<TableToolbar
						v-bind="args"
						v-model:search="search"
						:nb-total="items.length"
						:nb-filtered="filteredItems.length"
					/>
				</template>
			</SyTable>
		`,
	}),
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
		:headers="headers"
		:items="filteredItems"
		:items-per-page="5"
		hide-default-footer
		:save-state="false"
		suffix="table-toolbar-default"
	>
		<template #top>
			<TableToolbar
				v-model:search="search"
				:nb-total="items.length"
				:nb-filtered="filteredItems.length"
			/>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SyTable, TableToolbar } from '@cnamts/synapse'

	const headers = [
		{ title: 'Nom', sortable: true, key: 'lastname' },
		{ title: 'Prénom', sortable: true, key: 'firstname' },
		{ title: 'Email', sortable: true, key: 'email' },
	]

	const items = [
		{
			firstname: 'Virginie',
			lastname: 'Beauchesne',
			email: 'virginie.beauchesne@example.com',
		},
		{
			firstname: 'Étienne',
			lastname: 'Salois',
			email: 'etienne.salois@example.com',
		},
	]

	const search = ref('')

	const filteredItems = computed(() => {
		if (!search.value) return items

		const value = search.value.toLowerCase()

		return items.filter(item => (
			item.firstname.toLowerCase().includes(value)
			|| item.lastname.toLowerCase().includes(value)
			|| item.email.toLowerCase().includes(value)
		))
	})
</script>
`,
			},
		],
	},
}

export const AddButton: Story = {
	args: {
		'nbTotal': 2,
		'onAdd': fn(),
		'onUpdate:search': fn(),
		'vuetifyOptions': defaultVuetifyOptions,
	},
	render: args => ({
		components: { TableToolbar, SyTable },
		setup() {
			const search = ref('')
			const filteredItems = createFilteredItems(search)

			return { args, headers, items, filteredItems, search }
		},
		template: `
			<SyTable
				:headers="headers"
				:items="filteredItems"
				:items-per-page="5"
				hide-default-footer
				:save-state="false"
				suffix="table-toolbar-add-button"
			>
				<template #top>
					<TableToolbar
						v-bind="args"
						v-model:search="search"
						:nb-total="items.length"
						:nb-filtered="filteredItems.length"
						show-add-button
					/>
				</template>
			</SyTable>
		`,
	}),
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
		:headers="headers"
		:items="filteredItems"
		:items-per-page="5"
		hide-default-footer
		:save-state="false"
		suffix="table-toolbar-add-button"
	>
		<template #top>
			<TableToolbar
				v-model:search="search"
				:nb-total="items.length"
				:nb-filtered="filteredItems.length"
				show-add-button
			/>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SyTable, TableToolbar } from '@cnamts/synapse'

	const headers = [
		{ title: 'Nom', sortable: true, key: 'lastname' },
		{ title: 'Prénom', sortable: true, key: 'firstname' },
		{ title: 'Email', sortable: true, key: 'email' },
	]

	const items = [
		{
			firstname: 'Virginie',
			lastname: 'Beauchesne',
			email: 'virginie.beauchesne@example.com',
		},
		{
			firstname: 'Étienne',
			lastname: 'Salois',
			email: 'etienne.salois@example.com',
		},
	]

	const search = ref('')

	const filteredItems = computed(() => {
		if (!search.value) return items

		const value = search.value.toLowerCase()

		return items.filter(item => (
			item.firstname.toLowerCase().includes(value)
			|| item.lastname.toLowerCase().includes(value)
			|| item.email.toLowerCase().includes(value)
		))
	})
</script>
`,
			},
		],
	},
}

export const Labels: Story = {
	args: {
		'nbTotal': 2,
		'onAdd': fn(),
		'onUpdate:search': fn(),
		'showAddButton': true,
		'addButtonLabel': 'Ajouter un patient',
		'searchLabel': 'Rechercher un patient',
		'vuetifyOptions': defaultVuetifyOptions,
	},
	render: args => ({
		components: { TableToolbar, SyTable },
		setup() {
			const search = ref('')
			const filteredItems = createFilteredItems(search)

			return { args, headers, items, filteredItems, search }
		},
		template: `
			<SyTable
				:headers="headers"
				:items="filteredItems"
				:items-per-page="5"
				hide-default-footer
				:save-state="false"
				suffix="table-toolbar-labels"
			>
				<template #top>
					<TableToolbar
						v-bind="args"
						v-model:search="search"
						:nb-total="items.length"
						:nb-filtered="filteredItems.length"
						show-add-button
						add-button-label="Ajouter un patient"
						search-label="Rechercher un patient"
					/>
				</template>
			</SyTable>
		`,
	}),
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
		:headers="headers"
		:items="filteredItems"
		:items-per-page="5"
		hide-default-footer
		:save-state="false"
		suffix="table-toolbar-labels"
	>
		<template #top>
			<TableToolbar
				v-model:search="search"
				:nb-total="items.length"
				:nb-filtered="filteredItems.length"
				show-add-button
				add-button-label="Ajouter un patient"
				search-label="Rechercher un patient"
			/>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SyTable, TableToolbar } from '@cnamts/synapse'

	const headers = [
		{ title: 'Nom', sortable: true, key: 'lastname' },
		{ title: 'Prénom', sortable: true, key: 'firstname' },
		{ title: 'Email', sortable: true, key: 'email' },
	]

	const items = [
		{
			firstname: 'Virginie',
			lastname: 'Beauchesne',
			email: 'virginie.beauchesne@example.com',
		},
		{
			firstname: 'Étienne',
			lastname: 'Salois',
			email: 'etienne.salois@example.com',
		},
	]

	const search = ref('')

	const filteredItems = computed(() => {
		if (!search.value) return items

		const value = search.value.toLowerCase()

		return items.filter(item => (
			item.firstname.toLowerCase().includes(value)
			|| item.lastname.toLowerCase().includes(value)
			|| item.email.toLowerCase().includes(value)
		))
	})
</script>
`,
			},
		],
	},
}

export const Loading: Story = {
	args: {
		'nbTotal': 2,
		'onAdd': fn(),
		'onUpdate:search': fn(),
		'loading': true,
		'vuetifyOptions': defaultVuetifyOptions,
	},
	render: args => ({
		components: { TableToolbar, SyTable },
		setup() {
			const search = ref('')
			const filteredItems = createFilteredItems(search)

			return { args, headers, items, filteredItems, search }
		},
		template: `
			<SyTable
				:headers="headers"
				:items="filteredItems"
				:items-per-page="5"
				hide-default-footer
				:save-state="false"
				suffix="table-toolbar-loading"
			>
				<template #top>
					<TableToolbar
						v-bind="args"
						v-model:search="search"
						:nb-total="items.length"
						:nb-filtered="filteredItems.length"
						loading
					/>
				</template>
			</SyTable>
		`,
	}),
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
		:headers="headers"
		:items="filteredItems"
		:items-per-page="5"
		hide-default-footer
		:save-state="false"
		suffix="table-toolbar-loading"
	>
		<template #top>
			<TableToolbar
				v-model:search="search"
				:nb-total="items.length"
				:nb-filtered="filteredItems.length"
				loading
			/>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SyTable, TableToolbar } from '@cnamts/synapse'

	const headers = [
		{ title: 'Nom', sortable: true, key: 'lastname' },
		{ title: 'Prénom', sortable: true, key: 'firstname' },
		{ title: 'Email', sortable: true, key: 'email' },
	]

	const items = [
		{
			firstname: 'Virginie',
			lastname: 'Beauchesne',
			email: 'virginie.beauchesne@example.com',
		},
		{
			firstname: 'Étienne',
			lastname: 'Salois',
			email: 'etienne.salois@example.com',
		},
	]

	const search = ref('')

	const filteredItems = computed(() => {
		if (!search.value) return items

		const value = search.value.toLowerCase()

		return items.filter(item => (
			item.firstname.toLowerCase().includes(value)
			|| item.lastname.toLowerCase().includes(value)
			|| item.email.toLowerCase().includes(value)
		))
	})
</script>
`,
			},
		],
	},
}

export const NbFiltered: Story = {
	args: {
		'nbTotal': 2,
		'nbFiltered': 1,
		'onAdd': fn(),
		'onUpdate:search': fn(),
		'vuetifyOptions': defaultVuetifyOptions,
	},
	render: args => ({
		components: { TableToolbar, SyTable },
		setup() {
			const search = ref('')
			const filteredItems = createFilteredItems(search)

			return { args, headers, items, filteredItems, search }
		},
		template: `
			<SyTable
				:headers="headers"
				:items="filteredItems"
				:items-per-page="5"
				hide-default-footer
				:save-state="false"
				suffix="table-toolbar-nb-filtered"
			>
				<template #top>
					<TableToolbar
						v-bind="args"
						v-model:search="search"
						:nb-total="items.length"
						:nb-filtered="1"
					/>
				</template>
			</SyTable>
		`,
	}),
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
		:headers="headers"
		:items="filteredItems"
		:items-per-page="5"
		hide-default-footer
		:save-state="false"
		suffix="table-toolbar-nb-filtered"
	>
		<template #top>
			<TableToolbar
				v-model:search="search"
				:nb-total="items.length"
				:nb-filtered="1"
			/>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SyTable, TableToolbar } from '@cnamts/synapse'

	const headers = [
		{
			title: 'Nom',
			sortable: true,
			key: 'lastname',
		},
		{
			title: 'Prénom',
			sortable: true,
			key: 'firstname',
		},
		{
			title: 'Email',
			sortable: true,
			key: 'email',
		},
	]

	const items = [
		{
			firstname: 'Virginie',
			lastname: 'Beauchesne',
			email: 'virginie.beauchesne@example.com',
		},
		{
			firstname: 'Étienne',
			lastname: 'Salois',
			email: 'etienne.salois@example.com',
		},
	]

	const search = ref('')

	const filteredItems = computed(() => {
		if (!search.value) {
			return items
		}

		const value = search.value.toLowerCase()

		return items.filter(item => (
			item.firstname.toLowerCase().includes(value)
			|| item.lastname.toLowerCase().includes(value)
			|| item.email.toLowerCase().includes(value)
		))
	})
</script>
`,
			},
		],
	},
}

export const SlotFilters: Story = {
	args: {
		'nbTotal': 2,
		'onAdd': fn(),
		'onUpdate:search': fn(),
		'vuetifyOptions': defaultVuetifyOptions,
	},
	render: args => ({
		components: { TableToolbar, SySelect, SyTable },
		setup() {
			const search = ref<string | undefined>(undefined)

			const filteredItems = createFilteredItems(search)

			const filterItems = ref<{ text: string, value: string }[]>(
				items.map(item => ({
					text: item.lastname,
					value: item.lastname,
				})),
			)

			return { args, headers, items, filteredItems, filterItems, search }
		},
		template: `
			<SyTable
				:headers="headers"
				:items="filteredItems"
				:items-per-page="5"
				hide-default-footer
				:save-state="false"
				suffix="table-toolbar-filters"
			>
				<template #top>
					<TableToolbar
						v-bind="args"
						v-model:search="search"
						:nb-total="items.length"
						:nb-filtered="filteredItems.length"
					>
						<template #filters>
							<div class="px-4">
								<SySelect
									v-model="search"
									:items="filterItems"
									label="Nom"
									density="compact"
									width="150"
									hide-details
									clearable
								/>
							</div>
						</template>
					</TableToolbar>
				</template>
			</SyTable>
		`,
	}),
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
		:headers="headers"
		:items="filteredItems"
		:items-per-page="5"
		hide-default-footer
		:save-state="false"
		suffix="table-toolbar-filters"
	>
		<template #top>
			<TableToolbar
				v-model:search="search"
				:nb-total="items.length"
				:nb-filtered="filteredItems.length"
			>
				<template #filters>
					<div class="px-4">
						<SySelect
							v-model="search"
							:items="filterItems"
							label="Nom"
							density="compact"
							width="150"
							hide-details
							clearable
						/>
					</div>
				</template>
			</TableToolbar>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SySelect, SyTable, TableToolbar } from '@cnamts/synapse'

	const headers = [
		{ title: 'Nom', sortable: true, key: 'lastname' },
		{ title: 'Prénom', sortable: true, key: 'firstname' },
		{ title: 'Email', sortable: true, key: 'email' },
	]

	const items = [
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	]

	const search = ref('')

	const filterItems = ref(
		items.map(item => ({
			text: item.lastname,
			value: item.lastname,
		})),
	)

	const filteredItems = computed(() => {
		if (!search.value) return items

		const value = search.value.toLowerCase()

		return items.filter(item => (
			item.firstname.toLowerCase().includes(value)
			|| item.lastname.toLowerCase().includes(value)
			|| item.email.toLowerCase().includes(value)
		))
	})
</script>
`,
			},
		],
	},
}

export const OtherSlots: Story = {
	args: {
		'nbTotal': 2,
		'onAdd': fn(),
		'onUpdate:search': fn(),
		'vuetifyOptions': defaultVuetifyOptions,
	},
	render: args => ({
		components: { TableToolbar, SyTable },
		setup() {
			const search = ref('')
			const filteredItems = createFilteredItems(search)

			return { args, headers, items, filteredItems, search }
		},
		template: `
			<SyTable
				:headers="headers"
				:items="filteredItems"
				:items-per-page="5"
				hide-default-footer
				:save-state="false"
				suffix="table-toolbar-other-slots"
			>
				<template #top>
					<TableToolbar
						v-bind="args"
						v-model:search="search"
						:nb-total="items.length"
						:nb-filtered="filteredItems.length"
					>
						<template #search-left>
							<VBtn
								color="primary"
								variant="outlined"
								size="small"
								class="mx-5"
							>
								Exemple
							</VBtn>
						</template>
					</TableToolbar>
				</template>
			</SyTable>
		`,
	}),
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
		:headers="headers"
		:items="filteredItems"
		:items-per-page="5"
		hide-default-footer
		:save-state="false"
		suffix="table-toolbar-other-slots"
	>
		<template #top>
			<TableToolbar
				v-model:search="search"
				:nb-total="items.length"
				:nb-filtered="filteredItems.length"
			>
				<template #search-left>
					<VBtn
						color="primary"
						variant="outlined"
						size="small"
						class="mx-5"
					>
						Exemple
					</VBtn>
				</template>
			</TableToolbar>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SyTable, TableToolbar } from '@cnamts/synapse'

	const headers = [
		{ title: 'Nom', sortable: true, key: 'lastname' },
		{ title: 'Prénom', sortable: true, key: 'firstname' },
		{ title: 'Email', sortable: true, key: 'email' },
	]

	const items = [
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	]

	const search = ref('')

	const filteredItems = computed(() => {
		if (!search.value) return items

		const value = search.value.toLowerCase()

		return items.filter(item => (
			item.firstname.toLowerCase().includes(value)
			|| item.lastname.toLowerCase().includes(value)
			|| item.email.toLowerCase().includes(value)
		))
	})
</script>
`,
			},
		],
	},
}

export const Customization: Story = {
	args: {
		'nbTotal': 2,
		'onAdd': fn(),
		'onUpdate:search': fn(),
		'showAddButton': true,
		'vuetifyOptions': {
			toolbar: {
				class: 'py-2',
			},
			textField: {
				variant: 'outlined',
				density: 'compact',
				hideDetails: true,
				clearable: true,
			},
			addBtn: {
				color: 'secondary',
			},
			addIcon: {
				class: 'd-none',
			},
		},
	},
	render: args => ({
		components: { TableToolbar, SyTable },
		setup() {
			const search = ref('')
			const filteredItems = createFilteredItems(search)

			return { args, headers, items, filteredItems, search }
		},
		template: `
			<SyTable
				:headers="headers"
				:items="filteredItems"
				:items-per-page="5"
				hide-default-footer
				:save-state="false"
				suffix="table-toolbar-customization"
			>
				<template #top>
					<TableToolbar
						v-bind="args"
						v-model:search="search"
						:nb-total="items.length"
						:nb-filtered="filteredItems.length"
					/>
				</template>
			</SyTable>
		`,
	}),
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
		:headers="headers"
		:items="filteredItems"
		:items-per-page="5"
		hide-default-footer
		:save-state="false"
		suffix="table-toolbar-customization"
	>
		<template #top>
			<TableToolbar
				v-model:search="search"
				:nb-total="items.length"
				:nb-filtered="filteredItems.length"
				show-add-button
				:vuetify-options="vuetifyOptions"
			/>
		</template>
	</SyTable>
</template>
`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
	import { computed, ref } from 'vue'
	import { SyTable, TableToolbar } from '@cnamts/synapse'

	const headers = [
		{ title: 'Nom', sortable: true, key: 'lastname' },
		{ title: 'Prénom', sortable: true, key: 'firstname' },
		{ title: 'Email', sortable: true, key: 'email' },
	]

	const items = [
		{ firstname: 'Virginie', lastname: 'Beauchesne', email: 'virginie.beauchesne@example.com' },
		{ firstname: 'Étienne', lastname: 'Salois', email: 'etienne.salois@example.com' },
	]

	const search = ref('')

	const filteredItems = computed(() => {
		if (!search.value) return items

		const value = search.value.toLowerCase()

		return items.filter(item => (
			item.firstname.toLowerCase().includes(value)
			|| item.lastname.toLowerCase().includes(value)
			|| item.email.toLowerCase().includes(value)
		))
	})

	const vuetifyOptions = {
		toolbar: {
			class: 'py-2',
		},
		textField: {
			variant: 'outlined',
			density: 'compact',
			hideDetails: true,
			clearable: true,
		},
		addBtn: {
			color: 'secondary',
		},
		addIcon: {
			class: 'd-none',
		},
	}
</script>
`,
			},
		],
	},
}

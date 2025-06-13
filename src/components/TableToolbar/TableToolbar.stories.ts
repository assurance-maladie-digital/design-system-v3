import type { Meta, StoryObj } from '@storybook/vue3'
import TableToolbar from './TableToolbar.vue'
import SySelect from '../Customs/SySelect/SySelect.vue'
import { VDataTable } from 'vuetify/components'
import { ref } from 'vue'
import { fn } from '@storybook/test'

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

export const Default: Story = {
	args: {
		'nbTotal': 2,
		'onAdd': fn(),
		'onUpdate:search': fn(),
	},

	render: (args) => {
		return {
			components: { TableToolbar, VDataTable },
			setup() {
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

				return { args, headers, items, search }
			},
			template: `
				<VDataTable
					:headers="args.headers"
					:items="args.items"
					:search="args.search"
					:items-per-page="5"
					hide-default-footer
				>
					<template #top>
						<TableToolbar
							v-bind="args"
							v-model:search="search"
						/>
					</template>
				</VDataTable>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VDataTable
						:headers="args.headers"
						:items="args.items"
						:search="args.search"
						:items-per-page="5"
						hide-default-footer
					>
						<template #top>
							<TableToolbar
								v-model:search="search"
								:nb-total="items.length"
								show-add-button
							/>
						</template>
					</VDataTable>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { TableToolbar } from '@cnamts/synapse'
					import { VDataTable } from 'vuetify/components'
					import { ref } from 'vue'

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
	},
	render: (args) => {
		return {
			components: { TableToolbar, VDataTable },
			setup() {
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

				return { args, headers, items, search }
			},
			template: `
				<VDataTable
					:headers="args.headers"
					:items="args.items"
					:search="args.search"
					:items-per-page="5"
					hide-default-footer
				>
					<template #top>
						<TableToolbar
							v-bind="args"
							v-model:search="search"
							show-add-button
						/>
					</template>
				</VDataTable>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VDataTable
						:headers="headers"
						:items="items"
						:search="search"
						:items-per-page="5"
						hide-default-footer
					>
						<template #top>
							<TableToolbar
								v-model:search="search"
								:nb-total="items.length"
								show-add-button
							/>
						</template>
					</VDataTable>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { TableToolbar } from '@cnamts/synapse'
					import { VDataTable } from 'vuetify/components'
					import { ref } from 'vue'

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
	},
	render: (args) => {
		return {
			components: { TableToolbar, VDataTable },
			setup() {
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

				return { args, headers, items, search }
			},
			template: `
				<VDataTable
					:headers="args.headers"
					:items="args.items"
					:search="args.search"
					:items-per-page="5"
					hide-default-footer
				>
					<template #top>
						<TableToolbar
							v-bind="args"
							v-model:search="search"
						/>
					</template>
				</VDataTable>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VDataTable
						:headers="headers"
						:items="items"
						:search="search"
						:items-per-page="5"
						hide-default-footer
					>
						<template #top>
							<TableToolbar
								v-model:search="search"
								:nb-total="items.length"
								show-add-button
								add-button-label="Ajouter un patient"
								search-label="Rechercher un patient"
							/>
						</template>
					</VDataTable>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { TableToolbar } from '@cnamts/synapse'
					import { VDataTable } from 'vuetify/components'
					import { ref } from 'vue'

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
	},
	render: (args) => {
		return {
			components: { TableToolbar, VDataTable },
			setup() {
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

				return { args, headers, items, search }
			},
			template: `
				<VDataTable
					:headers="args.headers"
					:items="args.items"
					:items-per-page="args.nbFiltered"
					:search="args.search"
					loading
					hide-default-footer
				>
					<template #top>
						<TableToolbar
							v-bind="args"
							v-model:search="search"
						/>
					</template>
				</VDataTable>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VDataTable
						:headers="headers"
						:items="items"
						:search="search"
						loading
						hide-default-footer
					>
						<template #top>
							<TableToolbar
								v-model:search="search"
								:nb-total="items.length"
							/>
						</template>
					</VDataTable>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { TableToolbar } from '@cnamts/synapse'
					import { VDataTable } from 'vuetify/components'
					import { ref } from 'vue'

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
	},
	render: (args) => {
		return {
			components: { TableToolbar, VDataTable },
			setup() {
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

				return { args, headers, items, search }
			},
			template: `
				<VDataTable
					:headers="args.headers"
					:items="args.items"
					:search="args.search"
					:items-per-page="5"
					hide-default-footer
				>
					<template #top>
						<TableToolbar
							v-bind="args"
							v-model:search="search"
						/>
					</template>
				</VDataTable>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VDataTable
						:headers="headers"
						:items="items"
						:items-per-page="1"
						:search="search"
						hide-default-footer
					>
						<template #top>
							<TableToolbar
								v-model:search="search"
								:nb-filtered="1"
								:nb-total="items.length"
							/>
						</template>
					</VDataTable>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { TableToolbar } from '@cnamts/synapse'
					import { VDataTable } from 'vuetify/components'
					import { ref } from 'vue'

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
	},
	render: (args) => {
		return {
			components: { TableToolbar, SySelect, VDataTable },
			setup() {
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

				const filterItems = ref<{ text: string, value: string }[]>([])

				items.forEach((item) => {
					filterItems.value.push({
						text: item.lastname,
						value: item.lastname,
					})
				})

				return { args, headers, items, filterItems, search }
			},
			template: `
				<VDataTable
					:headers="args.headers"
					:items="args.items"
					:search="args.search"
					:items-per-page="5"
					hide-default-footer
				>
					<template #top>
						<TableToolbar
							v-bind="args"
							v-model:search="args.search"
						>
							<template #filters>
								<div class="py-1">
									<SySelect
										v-model="search"
										:items="filterItems"
										label="Nom"
										density="compact"
										width="100"
										hide-messages
										clearable
									/>
								</div>
							</template>
						</TableToolbar>
					</template>
				</VDataTable>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VDataTable
						:headers="headers"
						:items="items"
						:search="search"
						:items-per-page="5"
						hide-default-footer
					>
						<template #top>
							<TableToolbar
								v-model:search="search"
								:nb-total="items.length"
							>
								<template #filters>
									<div class="py-4">
										<SySelect 
											v-model="search" 
											:items="filterItems" 
											label="Nom" 
											density="compact" 
											width="100"
											hide-messages
											clearable 
										/>
									</div>
								</template>
							</TableToolbar>
						</template>
					</VDataTable>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { TableToolbar, SySelect } from '@cnamts/synapse'
					import { VDataTable } from 'vuetify/components'
					import { ref } from 'vue'

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
					
					const filterItems = ref<{ text: string, value: string }[]>([])

					items.forEach((item) => {
						filterItems.value.push({
							text: item.lastname,
							value: item.lastname,
						})
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
	},
	render: (args) => {
		return {
			components: { TableToolbar, VDataTable },
			setup() {
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

				return { args, headers, items, search }
			},
			template: `
				<VDataTable
					:headers="args.headers"
					:items="args.items"
					:search="args.search"
					:items-per-page="5"
					hide-default-footer
				>
					<template #top>
						<TableToolbar
							v-bind="args"
							v-model:search="search"
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
				</VDataTable>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VDataTable
						:headers="headers"
						:items="items"
						:search="search"
						:items-per-page="5"
						hide-default-footer
					>
						<template #top>
							<TableToolbar
								v-model:search="search"
								:nb-total="items.length"
								show-add-button
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
					</VDataTable>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { TableToolbar } from '@cnamts/synapse'
					import { VDataTable } from 'vuetify/components'
					import { ref } from 'vue'

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
				density: 'compact',
			},
			addBtn: {
				color: 'secondary',
			},
			addIcon: {
				class: 'd-none',
			},
		},
	},
	render: (args) => {
		return {
			components: { TableToolbar, VDataTable },
			setup() {
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

				return { args, headers, items, search }
			},
			template: `
				<VDataTable
					:headers="args.headers"
					:items="args.items"
					:search="args.search"
					:items-per-page="5"
					hide-default-footer
				>
					<template #top>
						<TableToolbar
							v-bind="args"
							v-model:search="search"
						/>
					</template>
				</VDataTable>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<VDataTable
						:headers="headers"
						:items="items"
						:search="search"
						:items-per-page="5"
						hide-default-footer
					>
						<template #top>
							<TableToolbar
								v-model:search="search"
								show-add-button
								:nb-total="items.length"
								:vuetifyOptions
							/>
						</template>
					</VDataTable>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { TableToolbar } from '@cnamts/synapse'
					import { VDataTable } from 'vuetify/components'
					import { ref } from 'vue'

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

					const vuetifyOptions = {
						toolbar: {
							class: 'py-2',
						},
						textField: {
							variant: 'outlined',
							density: 'compact',
						},
						addBtn: {
							height: '40px',
							color: '#663399',
						},
						addIcon: {
							class: 'd-none',
						},
					}

					const search = ref('')
				</script>
				`,
			},
		],
	},
}

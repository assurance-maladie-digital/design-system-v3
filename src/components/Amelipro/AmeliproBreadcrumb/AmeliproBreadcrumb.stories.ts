import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproBreadcrumb from './AmeliproBreadcrumb.vue'
import type { AmeliproBreadcrumbItem } from './types'

const meta = {
	argTypes: {
		click: { description: 'Événement émis au clic sur un élément. Émet la valeur de l’`id` de l’élément cliqué.', type: 'string' },
		items: { description: 'Liste des éléments du fil d’Ariane' },
		uniqueId: { description: 'Identifiant unique du composant' },
	},
	component: AmeliproBreadcrumb,
	title: 'Composants/Amelipro/Mise en page/AmeliproBreadcrumb',
} as Meta<typeof AmeliproBreadcrumb>
export default meta

type Story = StoryObj<typeof AmeliproBreadcrumb>

export const Default: Story = {
	args: {
		items: [
			{
				id: 'breadcrumb-item-id-1',
				title: 'Breadcrumb item 1',
			},
			{
				id: 'breadcrumb-item-id-2',
				title: 'Breadcrumb item 2',
			},
			{
				id: 'breadcrumb-item-id-3',
				title: 'Breadcrumb item 3',
			},
			{
				id: 'breadcrumb-item-id-4',
				title: 'Breadcrumb item 4',
			},
		] as AmeliproBreadcrumbItem[],
		uniqueId: 'amelipro-breadcrumb-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproBreadcrumb
		:items="items"
		unique-id="amelipro-breadcrumb-unique-id"

	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproBreadcrumb } from '@cnamts/synapse'

	const items = [
		{
			id: 'breadcrumb-item-id-1',
			title: 'Breadcrumb item 1',
		},
		{
			id: 'breadcrumb-item-id-2',
			title: 'Breadcrumb item 2',
		},
		{
			id: 'breadcrumb-item-id-3',
			title: 'Breadcrumb item 3',
		},
		{
			id: 'breadcrumb-item-id-4',
			title: 'Breadcrumb item 4',
		},
	]
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproBreadcrumb },
		setup() {
			return { args }
		},
		template: `
			<AmeliproBreadcrumb
				v-bind="args"
			/>
		`,
	}),
}

// --- Fil d’Ariane avec clic sur un élément ---
export const AvecClic: Story = {
	name: 'Avec gestion du clic',
	args: {
		items: [
			{ id: 'item-1', title: 'Accueil' },
			{ id: 'item-2', title: 'Dossier' },
			{ id: 'item-3', title: 'Sous-dossier' },
			{ id: 'item-4', title: 'Courant' },
		] as AmeliproBreadcrumbItem[],
		uniqueId: 'amelipro-breadcrumb-clic',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <AmeliproBreadcrumb
    :items="items"
    unique-id="amelipro-breadcrumb-clic"
    @click="onClick"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproBreadcrumb } from '@cnamts/synapse'
import type { AmeliproBreadcrumbItem } from '@cnamts/synapse'

const items: AmeliproBreadcrumbItem[] = [
  { id: 'item-1', title: 'Accueil' },
  { id: 'item-2', title: 'Dossier' },
  { id: 'item-3', title: 'Sous-dossier' },
  { id: 'item-4', title: 'Courant' },
]

function onClick(id: string) {
  alert('Élément cliqué : ' + id)
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproBreadcrumb },
		setup() {
			function onClick(id: string) {
				alert('Élément cliqué : ' + id)
			}
			return { args, onClick }
		},
		template: `
<p class="mb-2">Gestion de l’événement <code>click</code> sur un élément du fil d’Ariane.</p>
<AmeliproBreadcrumb
  v-bind="args"
  @click="onClick"
/>
`,
	}),
}

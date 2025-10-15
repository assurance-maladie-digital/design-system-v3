import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproPagination from './AmeliproPagination.vue'

const meta = {
	argTypes: {
		activePageDefault: { description: 'Numéro de page active par défaut' },
		click: { description: 'Événement émis lorsque l’utilisateur clique sur un des boutons. Retourne le numéro de page active', type: 'number' },
		items: {
			description: 'Liste des pages composants la pagination, la propriété key étant le numéro de la page',
			table: {
				type: {
					detail: `Array<{
	key: number;
	href?: string;
	to?: string
}>`,
					summary: 'PaginationTypes[]',
				},
			},
		},
		uniqueId: { description: 'Identifiant unique de la pagination' },
	},
	component: AmeliproPagination,
	title: 'Composants/Amelipro/AmeliproPagination',
} as Meta<typeof AmeliproPagination>
export default meta

type Story = StoryObj<typeof AmeliproPagination>

export const Default: Story = {
	name: 'Default',
	args: {
		items: [
			{ key: 1 },
			{ key: 2 },
			{ key: 3 },
			{ key: 4 },
			{ key: 5 },
		],
		activePageDefault: 1,
		uniqueId: 'pagination-basique',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Pagination simple sur 5 pages, sans navigation interne ni liens.</p>
    <AmeliproPagination
        :items="[
            { key: 1 },
            { key: 2 },
            { key: 3 },
            { key: 4 },
            { key: 5 }
        ]"
        active-page-default="1"
        unique-id="pagination-basique"
    />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproPagination } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPagination },
		setup() { return { args } },
		template: `
<p class="mb-2">Pagination simple sur 5 pages, sans navigation interne ni liens.</p>
<AmeliproPagination v-bind="args" />
        `,
	}),
}

export const PaginationLongue: Story = {
	name: 'Pagination longue (plus de 5 pages)',
	args: {
		items: Array.from({ length: 10 }, (_, i) => ({ key: i + 1 })),
		activePageDefault: 6,
		uniqueId: 'pagination-longue',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>Pagination longue (plus de 5 pages) avec gestion des chevrons et affichage dynamique.</p>
    <AmeliproPagination
        :items="Array.from({ length: 10 }, (_, i) => ({ key: i + 1 }))"
        active-page-default="6"
        unique-id="pagination-longue"
    />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproPagination } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPagination },
		setup() { return { args } },
		template: `
<p class="mb-2">Pagination longue (plus de 5 pages) avec gestion des chevrons et affichage dynamique.</p>
<AmeliproPagination v-bind="args" />
        `,
	}),
}

export const EvenementClick: Story = {
	name: 'Gestion de l’événement click',
	args: {
		items: [
			{ key: 1 },
			{ key: 2 },
			{ key: 3 },
			{ key: 4 },
			{ key: 5 },
		],
		activePageDefault: 1,
		uniqueId: 'pagination-click',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <p>La pagination émet un événement <code>click</code> à chaque changement de page.</p>
    <AmeliproPagination
        :items="[
            { key: 1 },
            { key: 2 },
            { key: 3 },
            { key: 4 },
            { key: 5 }
        ]"
        active-page-default="1"
        unique-id="pagination-click"
        @click="onPageClick"
    />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { AmeliproPagination } from '@cnamts/synapse'

function onPageClick(page: number) {
    alert('Page active : ' + page)
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproPagination },
		setup() {
			function onPageClick(page: number) {
				alert('Page active : ' + page)
			}
			return { args, onPageClick }
		},
		template: `
<p class="mb-2">La pagination émet un événement <code>click</code> à chaque changement de page.</p>
<AmeliproPagination v-bind="args" @click="onPageClick" />
        `,
	}),
}

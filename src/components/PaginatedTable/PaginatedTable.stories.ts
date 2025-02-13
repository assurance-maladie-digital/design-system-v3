import type { Meta, StoryObj } from '@storybook/vue3'
import PaginatedTable from './PaginatedTable.vue'

const meta: Meta<typeof PaginatedTable> = {
	title: 'Composants/Tableaux/PaginatedTable',
	component: PaginatedTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: [] },
	},
	argTypes: {
		headers: {
			control: { type: 'object' },
			table: {
				type: {
					summary: 'array',
				},
				category: 'props',
			},
		},
		items: {
			control: { type: 'object' },
			table: {
				type: {
					summary: 'array',
				},
				category: 'props',
			},
		},
		options: {
			control: { type: 'object' },
		},
		serverItemsLength: {
			control: { type: 'number' },
		},
		suffix: {
			control: { type: 'string' },
		},
		itemsPerPage: {
			control: { type: 'number' },
		},
	},
} as Meta<typeof PaginatedTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PaginatedTable
						:options="options"
						:headers="headers"
						:items="items"
						@update:options="options.value = $event"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PaginatedTable } from '@cnamts/synapse'
					
					const options = ref({
						itemsPerPage: 2,
					})
					
					const headers = ref([
						{
							title: 'Nom',
							key: 'lastname',
						},
						{
							title: 'Prénom',
							key: 'firstname',
						},
						{
                            title: 'Email',
							value: 'email',
						},
					])
						
					const items = ref([
						{
							firstname: 'Virginie',
							lastname: 'Beauchesne',
							email: 'virginie.beauchesne@example.com',
						},
						{
							firstname: 'Simone',
							lastname: 'Bellefeuille',
							email: 'simone.bellefeuille@example.com',
						},
						{
							firstname: 'Étienne',
							lastname: 'Salois',
							email: 'etienne.salois@example.com',
						},
						{
							firstname: 'Thierry',
							lastname: 'Bobu',
							email: 'thierry.bobu@example.com',
						},
					])
				</script>
				`,
			},
		],
	},
	args: {
		options: {
			itemsPerPage: 2,
		},
		headers: [
			{
				title: 'Nom',
				key: 'lastname',
			},
			{
				title: 'Prénom',
				key: 'firstname',
				value: 'firstname',
			},
			{
				title: 'Email',
				value: 'email',
			},
		],
		items: [
			{
				firstname: 'Virginie',
				lastname: 'Beauchesne',
				email: 'virginie.beauchesne@example.com',
			},
			{
				firstname: 'Simone',
				lastname: 'Bellefeuille',
				email: 'simone.bellefeuille@example.com',
			},
			{
				firstname: 'Étienne',
				lastname: 'Salois',
				email: 'etienne.salois@example.com',
			},
			{
				firstname: 'Thierry',
				lastname: 'Bobu',
				email: 'thierry.bobu@example.com',
			},
		],
	},
	render: (args) => {
		return {
			components: { PaginatedTable },
			setup() {
				return { args }
			},
			template: `
              <div class="pa-4">
                <PaginatedTable 
					:items="args.items"
					:headers="args.headers"
					:options="args.options"
					@update:options="args.options.value = $event"
				/>
              </div>
            `,
		}
	},
}

export const SortBy: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PaginatedTable
						:options="options"
						:headers="headers"
						:items="items"
						@update:options="options.value = $event"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PaginatedTable } from '@cnamts/synapse'
					
					const options = ref({
						sortBy: 'lastname',
						sortDesc: true,
					})
					
					const headers = ref([
						{
							title: 'Nom',
							key: 'lastname',
						},
						{
							title: 'Prénom',
							key: 'firstname',
						},
						{
                            title: 'Email',
							value: 'email',
						},
					])
						
					const items = ref([
						{
							firstname: 'Virginie',
							lastname: 'Beauchesne',
							email: 'virginie.beauchesne@example.com',
						},
						{
							firstname: 'Simone',
							lastname: 'Bellefeuille',
							email: 'simone.bellefeuille@example.com',
						},
						{
							firstname: 'Étienne',
							lastname: 'Salois',
							email: 'etienne.salois@example.com',
						},
						{
							firstname: 'Thierry',
							lastname: 'Bobu',
							email: 'thierry.bobu@example.com',
						},
					])
				</script>
				`,
			},
		],
	},
	args: {
		options: {
			sortBy: 'lastname',
			sortDesc: true,
		},
		headers: [
			{
				title: 'Nom',
				key: 'lastname',
				filterable: true,
			},
			{
				title: 'Prénom',
				key: 'firstname',
				value: 'firstname',
			},
			{
				title: 'Email',
				value: 'email',
			},
		],
		items: [
			{
				firstname: 'Virginie',
				lastname: 'Beauchesne',
				email: 'virginie.beauchesne@example.com',
			},
			{
				firstname: 'Simone',
				lastname: 'Bellefeuille',
				email: 'simone.bellefeuille@example.com',
			},
			{
				firstname: 'Étienne',
				lastname: 'Salois',
				email: 'etienne.salois@example.com',
			},
			{
				firstname: 'Thierry',
				lastname: 'Bobu',
				email: 'thierry.bobu@example.com',
			},
		],
	},
	render: (args) => {
		return {
			components: { PaginatedTable },
			setup() {
				return { args }
			},
			template: `
              <div class="pa-4">
                <PaginatedTable 
					:items="args.items"
					:headers="args.headers"
					:options="args.options"
					@update:options="args.options.value = $event"
				/>
              </div>
            `,
		}
	},
}

export const TableServer: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PaginatedTable
						:options="options"
						:headers="headers"
						:items="items"
						@update:options="options.value = $event"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PaginatedTable } from '@cnamts/synapse'
					
					const options = ref({
						itemsPerPage: 2,
						sortBy: 'lastname',
						sortDesc: false,
					})
					
					const headers = ref([
						{
							title: 'Nom',
							key: 'lastname',
							filterable: true,
						},
						{
							title: 'Prénom',
							key: 'firstname',
						},
						{
                            title: 'Email',
							value: 'email',
						},
					])
						
					const items = ref([
						{
							firstname: 'Virginie',
							lastname: 'Beauchesne',
							email: 'virginie.beauchesne@example.com',
						},
						{
							firstname: 'Simone',
							lastname: 'Bellefeuille',
							email: 'simone.bellefeuille@example.com',
						},
						{
							firstname: 'Étienne',
							lastname: 'Salois',
							email: 'etienne.salois@example.com',
						},
						{
							firstname: 'Thierry',
							lastname: 'Bobu',
							email: 'thierry.bobu@example.com',
						},
					])
				</script>
				`,
			},
		],
	},
	args: {
		options: {
			itemsPerPage: 2,
			sortBy: 'lastname',
			sortDesc: false,
		},
		headers: [
			{
				title: 'Nom',
				key: 'lastname',
				filterable: true,
			},
			{
				title: 'Prénom',
				key: 'firstname',
			},
			{
				title: 'Email',
				value: 'email',
			},
		],
		items: [
			{
				firstname: 'Virginie',
				lastname: 'Beauchesne',
				email: 'virginie.beauchesne@example.com',
			},
			{
				firstname: 'Simone',
				lastname: 'Bellefeuille',
				email: 'simone.bellefeuille@example.com',
			},
			{
				firstname: 'Étienne',
				lastname: 'Salois',
				email: 'etienne.salois@example.com',
			},
			{
				firstname: 'Thierry',
				lastname: 'Bobu',
				email: 'thierry.bobu@example.com',
			},
		],
	},
	render: (args) => {
		return {
			components: { PaginatedTable },
			setup() {
				return { args }
			},
			template: `
              <div class="pa-4">
                <PaginatedTable 
					:items="args.items"
					:headers="args.headers"
					:options="args.options"
					@update:options="args.options.value = $event"
				/>
              </div>
            `,
		}
	},
}

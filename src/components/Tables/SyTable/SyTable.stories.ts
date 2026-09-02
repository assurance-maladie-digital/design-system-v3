import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { ref } from 'vue'
import SyTable from './SyTable.vue'
import { commonTableArgTypes, commonTableExcludedControls } from '../common/storyArgTypes'
import type { DataOptions } from '../common/types'
import type { VDataTable } from 'vuetify/components'

const meta = {
	title: 'Composants/Tableaux/SyTable',
	component: SyTable,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: commonTableExcludedControls },
	},
	argTypes: {
		...commonTableArgTypes,
		items: {
			description: 'Liste des éléments à afficher dans le tableau',
			control: { type: 'object' },
			table: {
				category: 'props',
				defaultValue: {
					summary: '[]',
				},
			},
		},
	},
} satisfies Meta<typeof SyTable & typeof VDataTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
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
						v-model:options="options"
						:headers="headers"
						:items="items"
						suffix="default-table"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SyTable } from '@cnamts/synapse'
					
					const options = ref({
						itemsPerPage: 4,
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
						{
							firstname: 'Bernadette',
							lastname: 'Langelier',
							email: 'bernadette.langelier@exemple.com'
						},
						{
							firstname: 'Agate',
							lastname: 'Roy',
							email: 'agate.roy@exemple.com'
						}
					])
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		],
		'items': [
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
			{
				firstname: 'Bernadette',
				lastname: 'Langelier',
				email: 'bernadette.langelier@exemple.com',
			},
			{
				firstname: 'Agate',
				lastname: 'Roy',
				email: 'agate.roy@exemple.com',
			},
		],
		'options': {
			itemsPerPage: 4,
		},
		'caption': '',
		'suffix': 'default-table',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyTable },
			setup() {
				return { args }
			},
			template: `
				<SyTable
					v-model:options="args.options"
					v-bind="args"
				/>
			`,
		}
	},
}

export const ManyTables: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div class="d-flex flex-column gap-4">
						<SyTable
							v-model:options="options1"
							:headers="headers"
							:items="items1"
							suffix="table-1"
						/>
						<SyTable
							v-model:options="options2"
							:headers="headers"
							:items="items2"
							suffix="table-2"
						/>
					</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { SyTable } from '@cnamts/synapse'
					
					const options1 = ref({
						itemsPerPage: 4,
					})
					
					const options2 = ref({
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
						{
							firstname: 'Bernadette',
							lastname: 'Langelier',
							email: 'bernadette.langelier@exemple.com'
						},
						{
							firstname: 'Agate',
							lastname: 'Roy',
							email: 'agate.roy@exemple.com'
						}
					])
				</script>
				`,
			},
		],
	},
	args: {
		'headers': [
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
		],
		'items': [
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
			{
				firstname: 'Bernadette',
				lastname: 'Langelier',
				email: 'bernadette.langelier@exemple.com',
			},
			{
				firstname: 'Agate',
				lastname: 'Roy',
				email: 'agate.roy@exemple.com',
			},
		],
		'caption': '',
		'suffix': 'multi-server',
		'density': 'default',
		'striped': false,
		'onUpdate:options': fn(),
	},
	render: (args) => {
		return {
			components: { SyTable },
			setup() {
				const options1 = ref<Partial<DataOptions>>({
					itemsPerPage: 4,
				})
				const options2 = ref<Partial<DataOptions>>({
					itemsPerPage: 2,
				})
				return { args, options1, options2 }
			},
			template: `
				<div>
					<SyTable
						v-model:options="options1"
						v-bind="args"
						suffix="table1"
						class="mb-10"
					/>
					<SyTable
						v-model:options="options2"
						v-bind="args"
						suffix="table2"
					/>
				</div>
			`,
		}
	},
}

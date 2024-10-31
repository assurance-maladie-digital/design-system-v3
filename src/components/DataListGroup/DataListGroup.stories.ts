import DataListGroup from './DataListGroup.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { mdiAccount, mdiCalendar, mdiCardAccountDetails, mdiDoctor, mdiPencil } from '@mdi/js'

const meta: Meta<typeof DataListGroup> = {
	title: 'Components/DataListGroup',
	component: DataListGroup,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['width', 'minWidth', 'maxWidth'] },
	},
	argTypes: {
		items: { control: 'object' },
		icons: { control: 'object' },
		itemWidth: { control: 'text' },
		loading: { control: 'boolean' },
		renderHtmlValue: { control: 'boolean' },
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataListGroup :items="items" />
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataListGroup from '@cnamts/synapse'
										
					const items = [
						{
							title: 'Informations patient',
							items: [
								{
									key: 'Nom',
									value: 'Dupont',
								},
								{
									key: 'Prénom',
									value: 'Paul',
								},
								{
									key: 'Date de naissance',
									value: '24/09/1970',
								},
							],
						},
						{
							title: 'Médecin traitant',
							items: [
								{
									key: 'Nom du praticien',
									value: 'Gérard Leblanc',
								},
								{
									key: 'N° RPPS',
									value: 'XXXXX',
								},
							],
						},
						{
							title: 'Autres informations',
							items: [
								{
									key: 'Dernière modification',
									value: '04/06/2020',
								},
							],
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{
				title: 'Informations patient',
				items: [
					{
						key: 'Nom',
						value: 'Dupont',
					},
					{
						key: 'Prénom',
						value: 'Paul',
					},
					{
						key: 'Date de naissance',
						value: '24/09/1970',
					},
				],
			},
			{
				title: 'Médecin traitant',
				items: [
					{
						key: 'Nom du praticien',
						value: 'Gérard Leblanc',
					},

					{
						key: 'N° RPPS',
						value: 'XXXXX',
					},
				],
			},
			{
				title: 'Autres informations',
				items: [
					{
						key: 'Dernière modification',
						value: '04/06/2020',
					},
				],
			},
		],
		icons: undefined,
		itemWidth: '200px',
		loading: false,
		renderHtmlValue: false,
	},
	render: (args) => {
		return {
			components: { DataListGroup },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataListGroup 
						v-bind="args" 
						:items="args.items"
						:icons="args.icons"
						:item-width="args.itemWidth"
						:loading="args.loading"
						:render-html-value="args.renderHtmlValue"
					/>
				</div>
			`,
		}
	},
}

export const Icons: Story = {
	parameters: {
		controls: { exclude: ['itemWidth', 'loading', 'renderHtmlValue', 'click:list-item'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataListGroup 
						:items="items" 
						:icons="icons"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataListGroup from '@cnamts/synapse'
					import { mdiCalendar, mdiAccount, mdiDoctor, mdiCardAccountDetails, mdiPencil } from '@mdi/js'
					
					const icons = {
						calendarIcon: mdiCalendar,
						accountIcon: mdiAccount,
						doctorIcon: mdiDoctor,
						cardAccountIcon: mdiCardAccountDetails,
						editIcon: mdiPencil,
					}
										
					const items = [
						{
							title: 'Informations patient',
							items: [
								{
									key: 'Nom',
									value: 'Dupont',
									icon: 'accountIcon',
								},
								{
									key: 'Prénom',
									value: 'Paul',
									icon: 'accountIcon',
								},
								{
									key: 'Date de naissance',
									value: '24/09/1970',
									icon: 'calendarIcon',
								},
							],
						},
						{
							title: 'Médecin traitant',
							items: [
								{
									key: 'Nom du praticien',
									value: 'Gérard Leblanc',
									icon: 'doctorIcon',
								},
								{
									key: 'N° RPPS',
									value: 'XXXXX',
									icon: 'cardAccountIcon',
								},
							],
						},
						{
							title: 'Autres informations',
							items: [
								{
									key: 'Dernière modification',
									value: '04/06/2020',
									icon: 'editIcon',
								},
							],
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{
				title: 'Informations patient',
				items: [
					{
						key: 'Nom',
						value: 'Dupont',
						icon: 'accountIcon',
					},
					{
						key: 'Prénom',
						value: 'Paul',
						icon: 'accountIcon',
					},
					{
						key: 'Date de naissance',
						value: '24/09/1970',
						icon: 'calendarIcon',
					},
				],
			},
			{
				title: 'Médecin traitant',
				items: [
					{
						key: 'Nom du praticien',
						value: 'Gérard Leblanc',
						icon: 'doctorIcon',
					},
					{
						key: 'N° RPPS',
						value: 'XXXXX',
						icon: 'cardAccountIcon',
					},
				],
			},
			{
				title: 'Autres informations',
				items: [
					{
						key: 'Dernière modification',
						value: '04/06/2020',
						icon: 'editIcon',
					},
				],
			},
		],
		icons: {
			calendarIcon: mdiCalendar,
			accountIcon: mdiAccount,
			doctorIcon: mdiDoctor,
			cardAccountIcon: mdiCardAccountDetails,
			editIcon: mdiPencil,
		},
	},
	render: (args) => {
		return {
			components: { DataListGroup },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataListGroup 
						v-bind="args" 
						:items="args.items"
						:icons="args.icons"
					/>
				</div>
			`,
		}
	},
}

export const ActionBtn: Story = {
	parameters: {
		controls: { exclude: ['icons', 'itemWidth', 'loading', 'renderHtmlValue', 'click:list-item'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataListGroup 
						:items="items" 
						@click:list-item="updateBirthdate"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataListGroup from '@cnamts/synapse'
										
					const items = [
						{
							title: 'Informations patient',
							items: [
								{
									key: 'Nom',
									value: 'Dupont',
								},
								{
									key: 'Prénom',
									value: 'Paul',
								},
								{
									key: 'Date de naissance',
									value: '24/09/1970',
									action: 'Modifier',
								},
							],
						},
						{
							title: 'Médecin traitant',
							items: [
								{
									key: 'Nom du praticien',
									value: 'Gérard Leblanc',
								},
								{
									key: 'N° RPPS',
									value: 'XXXXX',
								},
							],
						},
						{
							title: 'Autres informations',
							items: [
								{
									key: 'Dernière modification',
									value: '04/06/2020',
								},
							],
						},
					]
					
					const updateBirthdate = (eventValue: object) => {
						items.value[eventValue.dataListIndex].items[eventValue.itemIndex].value = '25/09/1970'
					}
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{
				title: 'Informations patient',
				items: [
					{
						key: 'Nom',
						value: 'Dupont',
					},
					{
						key: 'Prénom',
						value: 'Paul',
					},
					{
						key: 'Date de naissance',
						value: '24/09/1970',
						action: 'Modifier',
					},
				],
			},
			{
				title: 'Médecin traitant',
				items: [
					{
						key: 'Nom du praticien',
						value: 'Gérard Leblanc',
					},

					{
						key: 'N° RPPS',
						value: 'XXXXX',
					},
				],
			},
			{
				title: 'Autres informations',
				items: [
					{
						key: 'Dernière modification',
						value: '04/06/2020',
					},
				],
			},
		],
		icons: undefined,
		itemWidth: '200px',
		loading: false,
		renderHtmlValue: false,
	},
	render: (args) => {
		return {
			components: { DataListGroup },
			setup() {
				const updateBirthdate = (eventValue: object) => {
					args.items[eventValue.dataListIndex].items[eventValue.itemIndex].value = '25/09/1970'
				}
				return { args, updateBirthdate }
			},
			template: `
				<div class="pa-4">
                    <DataListGroup 
						v-bind="args" 
						:items="args.items"
						@click:list-item="updateBirthdate"
					/>
				</div>
			`,
		}
	},
}

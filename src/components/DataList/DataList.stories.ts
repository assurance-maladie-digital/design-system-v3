import DataList from './DataList.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { mdiAccount, mdiCalendar, mdiInformationOutline } from '@mdi/js'

const meta: Meta<typeof DataList> = {
	title: 'Components/DataList',
	component: DataList,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['renderHtmlValue'] },
	},
	argTypes: {
		items: { control: 'object' },
		icons: { control: 'object' },
		listTitle: { control: 'text' },
		titleClass: { control: 'text' },
		placeholder: { control: 'text' },
		row: { control: 'boolean' },
		loading: { control: 'boolean' },
		itemsNumberLoading: { control: 'number' },
		headingLoading: { control: 'boolean' },
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
					<DataList :items="items" />
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataList from '@cnamts/synapse'
										
					const items = [
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
					]
				</script>
				`,
			},
		],
	},
	args: {
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
		icons: undefined,
		listTitle: undefined,
		titleClass: 'text-subtitle-1 font-weight-bold mb-3',
		row: false,
		placeholder: undefined,
		loading: false,
		itemsNumberLoading: 1,
		headingLoading: false,
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataList 
						v-bind="args" 
						:items="args.items"
						:icons="args.icons"
						:list-title="args.listTitle"
						:title-class="args.titleClass"
						:row="args.row"
						:placeholder="args.placeholder"
						:loading="args.loading"
						:items-number-loading="args.itemsNumberLoading"
						:heading-loading="args.headingLoading"
						:render-html-value="args.renderHtmlValue"
					/>
				</div>
			`,
		}
	},
}

export const Row: Story = {
	parameters: {
		controls: { exclude: ['icons', 'listTitle', 'titleClass', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'renderHtmlValue', 'title', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList 
						:items="items" 
						row 
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataList from '@cnamts/synapse'
										
					const items = [
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
					]
				</script>
				`,
			},
		],
	},
	args: {
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
		icons: undefined,
		listTitle: undefined,
		titleClass: 'text-subtitle-1 font-weight-bold mb-3',
		row: true,
		placeholder: undefined,
		loading: false,
		itemsNumberLoading: 1,
		headingLoading: false,
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataList 
						v-bind="args" 
						:items="args.items"
						:icons="args.icons"
						:list-title="args.listTitle"
						:title-class="args.titleClass"
						:row="args.row"
						:placeholder="args.placeholder"
						:loading="args.loading"
						:items-number-loading="args.itemsNumberLoading"
						:heading-loading="args.headingLoading"
						:render-html-value="args.renderHtmlValue"
					/>
				</div>
			`,
		}
	},
}

export const Title: Story = {
	parameters: {
		controls: { exclude: ['icons', 'title', 'row', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'renderHtmlValue', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList 
						:items="items" 
						list-title="Informations personnelles" 
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataList from '@cnamts/synapse'
										
					const items = [
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
					]
				</script>
				`,
			},
		],
	},
	args: {
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
		icons: undefined,
		listTitle: 'Informations personnelles',
		titleClass: 'text-subtitle-1 font-weight-bold mb-3',
		row: false,
		placeholder: undefined,
		loading: false,
		itemsNumberLoading: 1,
		headingLoading: false,
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataList 
						v-bind="args" 
						:items="args.items"
						:icons="args.icons"
						:list-title="args.listTitle"
						:title-class="args.titleClass"
						:row="args.row"
						:placeholder="args.placeholder"
						:loading="args.loading"
						:items-number-loading="args.itemsNumberLoading"
						:heading-loading="args.headingLoading"
						:render-html-value="args.renderHtmlValue"
					/>
				</div>
			`,
		}
	},
}

export const Icons: Story = {
	parameters: {
		controls: { exclude: ['listTitle', 'titleClass', 'row', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'renderHtmlValue', 'title', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList 
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
					import DataList from '@cnamts/synapse'
					import { mdiCalendar, mdiAccount, mdiInformationOutline } from '@mdi/js'
					
					const icons = {
						calendarIcon: mdiCalendar,
						accountIcon: mdiAccount,
						mdiInformationOutline: mdiInformationOutline,
					}
										
					const items = [
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
					]
				</script>
				`,
			},
		],
	},
	args: {
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
		icons: {
			calendarIcon: mdiCalendar,
			accountIcon: mdiAccount,
			mdiInformationOutline: mdiInformationOutline,
		},
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataList 
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
		controls: { exclude: ['icons', 'listTitle', 'titleClass', 'row', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'renderHtmlValue', 'title', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList 
						:items="items" 
						@click:item-action="updateBirthdate"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataList from '@cnamts/synapse'
							
					const items = [
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
					]
					
					const updateBirthdate = (index: number) => {
						items[index].value = '25/09/1970'
					}
				</script>
				`,
			},
		],
	},
	args: {
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
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				const updateBirthdate = (index: number) => {
					args.items[index].value = '25/09/1970'
				}
				return { args, updateBirthdate }
			},
			template: `
				<div class="pa-4">
                    <DataList 
						v-bind="args" 
						:items="args.items"
						@click:item-action="updateBirthdate"
					/>
				</div>
			`,
		}
	},
}

export const Chips: Story = {
	parameters: {
		controls: { exclude: ['icons', 'listTitle', 'titleClass', 'row', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'renderHtmlValue', 'title', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList :items="items" />
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataList from '@cnamts/synapse'
										
					const items = [
						{
							key: 'Nom',
							value: 'Dupont',
							chip: true,
						},
						{
							key: 'Prénom',
							value: 'Paul',
							chip: true,
						},
						{
							key: 'Date de naissance',
							value: '24/09/1970',
							chip: true,
						},
						{
                            key: 'Statut',
                            value: 'Enregistré',
                            chip: true,
                            options: {
                                chip: {
                                    color: 'success',
                                }
                            }
						}
					]
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{
				key: 'Nom',
				value: 'Dupont',
				chip: true,
			},
			{
				key: 'Prénom',
				value: 'Paul',
				chip: true,
			},
			{
				key: 'Date de naissance',
				value: '24/09/1970',
				chip: true,
			},
			{
				key: 'Statut',
				value: 'Enregistré',
				chip: true,
				options: {
					chip: {
						color: 'success',
					},
				},
			},
		],
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataList 
						v-bind="args" 
						:items="args.items"
					/>
				</div>
			`,
		}
	},
}

export const ValeurHtml: Story = {
	parameters: {
		controls: { exclude: ['icons', 'listTitle', 'titleClass', 'row', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'title', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList 
						:items="items"
						item-width="auto"
						render-html-value
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataList from '@cnamts/synapse'
										
					const items = [
						{
							key: 'Nom',
							value: 'Dupont'
						},
						{
							key: 'Prénom',
							value: 'Paul'
						},
						{
							key: 'Adresse',
							value: '<b>50 Avenue du Professeur André Lemierre</b><br>75020 Paris'
						}
					]
				</script>
				`,
			},
		],
	},
	args: {
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
				key: 'Adresse',
				value: '<b>50 Avenue du Professeur André Lemierre</b><br>75020 Paris',
			},
		],
		renderHtmlValue: true,
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataList 
						v-bind="args" 
						:items="args.items"
						:render-html-value="args.renderHtmlValue"
					/>
				</div>
			`,
		}
	},
}

export const Loading: Story = {
	parameters: {
		controls: { exclude: ['icons', 'titleClass', 'row', 'placeholder', 'renderHtmlValue', 'listTitle', 'title', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList 
						:items="items"
						:items-number-loading="3"
						loading
						list-title="Titre"
						heading-loading
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataList from '@cnamts/synapse'
										
					const items = [
						{
							key: 'Nom',
							value: 'Dupont'
						},
						{
							key: 'Prénom',
							value: 'Paul'
						},
						{
							key: 'Date de naissance',
							value: '24/09/1970',
						}
					]
				</script>
				`,
			},
		],
	},
	args: {
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
		itemsNumberLoading: 3,
		loading: true,
		listTitle: 'Titre',
		headingLoading: true,
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <DataList 
						v-bind="args" 
						:items="args.items"
						:items-number-loading="args.itemsNumberLoading"
						:loading="args.loading"
						:list-title="args.listTitle"
						:heading-loading="args.headingLoading"
					/>
				</div>
			`,
		}
	},
}

export const SlotTitle: Story = {
	parameters: {
		controls: { exclude: ['icons', 'titleClass', 'row', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'renderHtmlValue', 'listTitle', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList :items="items">
						<template #title>
							<template #title>
							<h3 class="text-subtitle-1 text-primary font-weight-bold">
								Liste de données
							</h3>
							<p class="text-subtitle-2 mb-3">
								Informations complémentair
							</p>
						</template>
					</DataList>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import DataList from '@cnamts/synapse'
					import { mdiInformationOutline } from '@mdi/js'
										
					const items = [
						{
							key: 'Nom',
							value: 'Dupont'
						},
						{
							key: 'Prénom',
							value: 'Paul'
						},
						{
							key: 'Date de naissance',
							value: '24/09/1970',
						}
					]
					
					const informationIcon = mdiInformationOutline
				</script>
				`,
			},
		],
	},
	args: {
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
		icons: {
			informationIcon: mdiInformationOutline,
		},
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<DataList :items="args.items">
						<template #title>
							<h3 class="text-subtitle-1 text-primary font-weight-bold">
								Liste de données
							</h3>
							<p class="text-subtitle-2 mb-3">
								Informations complémentaires
							</p>
						</template>
					</DataList>
				</div>
			`,
		}
	},
}

export const Customisation: Story = {
	parameters: {
		controls: { exclude: ['icons', 'titleClass', 'row', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'renderHtmlValue', 'listTitle', 'click:item-action'] },
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<DataList 
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
					import DataList from '@cnamts/synapse'
					import { mdiAccount, mdiCalendar, mdiInformationOutline } from '@mdi/js'
										
					const items = [
						{
							key: 'Nom',
							value: 'Dupont',
							icon: 'accountIcon',
							options: itemOptions,
						},
						{
							key: 'Prénom',
							value: 'Paul',
							icon: 'accountIcon',
							options: itemOptions,
						},
						{
							key: 'Date de naissance',
							value: '24/09/1970',
							icon: 'calendarIcon',
							options: itemOptions,
						}
					]
					
					const icons = {
						calendarIcon: mdiCalendar,
						accountIcon: mdiAccount,
						mdiInformationOutline: mdiInformationOutline,
					}
                    
                    const itemOptions = {
						icon: {
							color: 'primary',
							class: 'mt-0 mr-4',
						},
					}
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{
				key: 'Nom',
				value: 'Dupont',
				icon: 'accountIcon',
				options: {
					icon: {
						color: 'primary',
						class: 'mt-0 mr-4',
					},
				},
			},
			{
				key: 'Prénom',
				value: 'Paul',
				icon: 'accountIcon',
				options: {
					icon: {
						color: 'primary',
						class: 'mt-0 mr-4',
					},
				},
			},
			{
				key: 'Date de naissance',
				value: '24/09/1970',
				icon: 'calendarIcon',
				options: {
					icon: {
						color: 'primary',
						class: 'mt-0 mr-4',
					},
				},
			},
		],
		icons: {
			calendarIcon: mdiCalendar,
			accountIcon: mdiAccount,
			mdiInformationOutline: mdiInformationOutline,
		},
	},
	render: (args) => {
		return {
			components: { DataList },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<DataList 
						:items="args.items"
						:icons="args.icons"
					/>
				</div>
			`,
		}
	},
}

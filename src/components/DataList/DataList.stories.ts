import DataList from './DataList.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { mdiAccount, mdiCalendar, mdiInformationOutline } from '@mdi/js'

const meta: Meta<typeof DataList> = {
	title: 'Components/DataList',
	component: DataList,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['renderHtmlValue'] },
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

export const Icons: Story = {
	parameters: {
		controls: { exclude: ['listTitle', 'titleClass', 'row', 'placeholder', 'loading', 'itemsNumberLoading', 'headingLoading', 'renderHtmlValue', 'title', 'click:item-action'] },
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

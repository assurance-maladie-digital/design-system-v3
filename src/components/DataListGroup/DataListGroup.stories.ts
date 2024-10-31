import DataListGroup from './DataListGroup.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

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

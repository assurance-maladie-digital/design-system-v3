import type { Meta, StoryObj } from '@storybook/vue3-vite'

import CollapsibleList from './CollapsibleList.vue'

const meta = {
	title: 'Composants/Données/CollapsibleList',
	component: CollapsibleList,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		listTitle: {
			control: 'text',
		},
		items: {
			control: 'object',
		},
		headingLevel: {
			control: { type: 'select' },
			options: [1, 2, 3, 4, 5, 6],
		},
	},
} as Meta<typeof CollapsibleList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="pa-4">
		<CollapsibleList 
			:list-title="listTitle"
			:items="items" 
  :heading-level="headingLevel"		/>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CollapsibleList } from '@cnamts/synapse'
	
	const listTitle = 'Santé'
	 const headingLevel = 4
	const items = [
        		{
			text: 'Mon espace santé',
			href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
		},
		{
			text: 'Accomplir les bons gestes',
			href: 'https://www.ameli.fr/assure/sante/bons-gestes',
		},
	]
</script>
				`,
			},
		],
	},
	args: {
		listTitle: 'Santé',
		headingLevel: 4,
		items: [
			{
				text: 'Mon espace santé',
				href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
			},
			{
				text: 'Accomplir les bons gestes',
				href: 'https://www.ameli.fr/assure/sante/bons-gestes',
			},
		],
	},
	render: (args) => {
		return {
			components: { CollapsibleList },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<CollapsibleList v-bind="args"/>
				</div>
			`,
		}
	},
}

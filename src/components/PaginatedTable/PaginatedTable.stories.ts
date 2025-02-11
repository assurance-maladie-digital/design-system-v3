import type { Meta, StoryObj } from '@storybook/vue3'
import PaginatedTable from './PaginatedTable.vue'
import { ref } from 'vue'

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
		controls: { exclude: ['modelValue'] },
	},
	argTypes: {

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
					
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PaginatedTable } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {

	},
	render: (args) => {
		return {
			components: { PaginatedTable },
			setup() {
				const value = ref({ from: null, to: null })
				return { args, value }
			},
			template: `
              <div class="pa-4">
                <PaginatedTable v-bind="args" v-model="value"/>
              </div>
            `,
		}
	},
}

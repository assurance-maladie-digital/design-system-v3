import HeaderLoading from './HeaderLoading.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof HeaderLoading> = {
	title: 'Composants/Structure/HeaderLoading',
	component: HeaderLoading,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['heading', 'itemsNumber', 'row'] },
	},
	argTypes: {
		width: { control: 'text' },
		height: { control: 'text' },
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
					<HeaderLoading :width="width" :height="height" />
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderLoading } from '@cnamts/synapse'
					
					const width = '100px'
					const height = '1rem'
				</script>
				`,
			},
		],
	},
	args: {
		width: '100px',
		height: '1rem',
	},
	render: (args) => {
		return {
			components: { HeaderLoading },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
                    <HeaderLoading v-bind="args" />
				</div>
			`,
		}
	},
}

import type { Meta, StoryObj } from '@storybook/vue3'
import NotFoundPage from './NotFoundPage.vue'

const meta = {
	title: 'Templates/NotFoundPage',
	component: NotFoundPage,
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof NotFoundPage>

export default meta

type Story = StoryObj<typeof NotFoundPage>

export const Default: Story = {
	parameters: {
		query: {
			support_id: '',
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
						<NotFoundPage />
					</div>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { NotFoundPage } from '@cnamts/synapse'
				</script>

				`,
			},
		],
	},
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
}

export const WithErrorCode: Story = {
	parameters: {
		query: {
			support_id: '1234567890123456789',
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
						<NotFoundPage />
					</div>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { NotFoundPage } from '@cnamts/synapse'
				</script>

				`,
			},
		],
	},
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
}

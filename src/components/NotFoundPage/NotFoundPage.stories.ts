import type { Meta, StoryObj } from '@storybook/vue3'
import NotFoundPage from './NotFoundPage.vue'

const meta = {
	title: 'Templates/NotFoundPage',
	component: NotFoundPage,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		hideBtn: {
			control: { type: 'boolean' },
		},
		btnText: {
			control: { type: 'text' },
		},
		btnHref: {
			control: { type: 'text' },
		},
		btnLink: {
			control: { type: 'text' },
		},
	},
} satisfies Meta<typeof NotFoundPage>

export default meta

type Story = StoryObj<typeof NotFoundPage>

export const Default: Story = {
	parameters: {
		query: {
			support_id: '',
		},
		btnText: 'Retour à l’accueil',
		btnHref: '/',
		hideBtn: false,
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
						<NotFoundPage 
							btn-text="Retour à l’accueil" 
							btn-href="/" 
						/>
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
		btnText: 'Retour à l’accueil',
		btnHref: '/',
		hideBtn: false,
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
						<NotFoundPage 
							btn-text="Retour à l’accueil" 
							btn-href="/" 
						/>
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

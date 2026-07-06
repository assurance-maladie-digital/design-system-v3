import type { Meta, StoryObj } from '@storybook/vue3-vite'
import NotFoundPage from './NotFoundPage.vue'

const meta: Meta<typeof NotFoundPage> = {
	title: 'Templates/NotFoundPage',
	component: NotFoundPage,
	parameters: {
		layout: 'fullscreen',
		docs: {
			inlineStories: true,
		},
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
	args: {
		btnText: 'Retour à l’accueil',
		btnHref: '/',
	},
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
	args: {
		btnText: 'Retour à l’accueil',
		btnHref: '/',
	},
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

export const CustomIllustration: Story = {
	args: {
		btnText: 'Retour à l’accueil',
		btnHref: '/',
	},
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
						<NotFoundPage btn-text="Retour à l’accueil" btn-href="/">
							<template #illustration>
								<div style="width: 260px; height: 200px; display: grid; place-items: center; border-radius: 12px; background: white; border: 2px dashed #0D419A;">
									<span style="font-weight: 700; color: #0D419A;">Illustration</span>
								</div>
							</template>
						</NotFoundPage>
					</div>
				</template>
				`,
			},
			{
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
	render: args => ({
		components: { NotFoundPage },
		setup() {
			return { args }
		},
		template: `
			<NotFoundPage v-bind="args">
				<template #illustration>
					<div style="width: 260px; height: 200px; display: grid; place-items: center; border-radius: 12px; background: white; border: 2px dashed #0D419A;">
						<span style="font-weight: 700; color: #0D419A;">Illustration</span>
					</div>
				</template>
			</NotFoundPage>
		`,
	}),
}

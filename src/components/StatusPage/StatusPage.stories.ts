import type { Meta, StoryObj } from '@storybook/vue3'
import StatusPage from './StatusPage.vue'

const meta = {
	title: 'Templates/StatusPage',
	component: StatusPage,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		'headingLevel': {
			control: { type: 'select' },
			options: [1, 2, 3, 4, 5, 6],
		},
		'code': {
			description: 'Code d\'erreur affiché en premier plan',
		},
		'codeErrorText': {
			description: 'Text affiché avant le code d\'erreur pour les outils d\'accessibilité',
			table: {
				defaultValue: {
					summary: 'Code d\'erreur\xa0: ',
				},
			},
		},
		'additional-content': {
			control: {
				type: 'text',
			},
			table: {
				type: {
					summary: '{}',
				},
			},
		},
		'action': {
			control: {
				type: 'text',
			},
			table: {
				type: {
					summary: '{}',
				},
			},
		},
		'illustration': {
			control: {
				type: 'text',
			},
			table: {
				type: {
					summary: '{}',
				},
			},
		},
	},
} satisfies Meta<typeof StatusPage>

export default meta

type Story = StoryObj<typeof StatusPage>

export const Default: Story = {
	args: {
		headingLevel: 1,
		pageTitle: 'une erreur est survenue',
		code: '500',
		message: 'Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
							<StatusPage
								page-title="une erreur est survenue"
								code="500"
								message="Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646"
							>
					</div>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { StatusPage } from '@cnamts/synapse'
				</script>
				
				`,
			},
		],
	},
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
}

export const WithLink: Story = {
	args: {
		...Default.args,
		headingLevel: 1,
		btnHref: '/',
		btnText: 'Retour à l\'accueil',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
							<StatusPage
								page-title="une erreur est survenue"
								code="500"
								message="Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646"
								btn-href=""
								btn-text="Retour à l'accueil"
							>
					</div>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { StatusPage } from '@cnamts/synapse'
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
		...Default.args,
		btnHref: '/',
		btnText: 'Retour à l\'accueil',
		headingLevel: 1,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="padding: 20px; background: rgb(231, 236, 245)">
							<StatusPage
								page-title="une erreur est survenue"
								code="500"
								message="Une erreur est survenue de notre côté, veuillez réessayer plus tard."
								btn-href="/"
								btn-text="Retour à l'accueil"
							>
								<template #illustration>
									<div style="width: 260px; height: 200px; display: grid; place-items: center; border-radius: 12px; background: white; border: 2px dashed #0D419A;">
										<span style="font-weight: 700; color: #0D419A;">Illustration</span>
									</div>
								</template>
							</StatusPage>
					</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { StatusPage } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
	render: args => ({
		components: { StatusPage },
		setup() {
			return { args }
		},
		template: `
			<StatusPage v-bind="args">
				<template #illustration>
					<div style="width: 260px; height: 200px; display: grid; place-items: center; border-radius: 12px; background: white; border: 2px dashed #0D419A;">
						<span style="font-weight: 700; color: #0D419A;">Illustration</span>
					</div>
				</template>
			</StatusPage>
		`,
	}),
}

export const WithRole: Story = {
	args: {
		pageTitle: 'Une erreur est survenue',
		message: 'Veuillez réessayer ultérieurement.',
		code: '500',
		role: 'main',
		uniqueId: 'status-page-main',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<StatusPage
						page-title="Une erreur est survenue"
						message="Veuillez réessayer ultérieurement."
						code="500"
						role="main"
						unique-id="status-page-main"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { StatusPage } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

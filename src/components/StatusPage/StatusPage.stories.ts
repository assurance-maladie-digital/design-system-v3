import type { Meta, StoryObj } from '@storybook/vue3-vite'
import StatusPage from './StatusPage.vue'
import { VBtn } from 'vuetify/components'

const meta = {
	title: 'Templates/StatusPage',
	component: StatusPage,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
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
				code: `<template>
	<StatusPage
		page-title="une erreur est survenue"
		code="500"
		message="Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { StatusPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
}

export const WithLink: Story = {
	args: {
		...Default.args,
		btnHref: '/',
		btnText: 'Retour à l\'accueil',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<StatusPage
		page-title="une erreur est survenue"
		code="500"
		message="Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646"
		btn-href="/"
		btn-text="Retour à l'accueil"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { StatusPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
}

export const CustomIllustration: Story = {
	args: {
		...Default.args,
		btnHref: '/',
		btnText: 'Retour à l\'accueil',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<StatusPage
		page-title="une erreur est survenue"
		code="500"
		message="Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646"
		btn-href="/"
		btn-text="Retour à l'accueil"
	>
		<template #illustration>
			<div
				class="d-flex align-center justify-center rounded-lg bg-surface border-md border-dashed border-primary border-opacity-100"
				style="width: 260px; height: 200px;"
			>
				<span class="font-weight-bold text-primary">Illustration</span>
			</div>
		</template>
	</StatusPage>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { StatusPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { StatusPage },
		setup() {
			return { args }
		},
		template: `
			<StatusPage v-bind="args">
				<template #illustration>
					<div
						class="d-flex align-center justify-center rounded-lg bg-surface border-md border-dashed border-primary border-opacity-100"
						style="width: 260px; height: 200px;"
					>
						<span class="font-weight-bold text-primary">Illustration</span>
					</div>
				</template>
			</StatusPage>
		`,
	}),
}

export const SlotAction: Story = {
	args: {
		...Default.args,
	},
	parameters: {
		docs: {
			description: {
				story: 'Le contenu du slot `action` remplace le bouton par défaut : il n\'est pas nécessaire de passer `hide-btn`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<StatusPage
		page-title="une erreur est survenue"
		code="500"
		message="Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646"
	>
		<template #action>
			<div class="d-flex ga-2 mt-4">
				<VBtn
					href="/"
					color="primary"
				>
					Retour à l'accueil
				</VBtn>
				<VBtn
					variant="outlined"
					color="primary"
				>
					Déconnexion
				</VBtn>
			</div>
		</template>
	</StatusPage>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { StatusPage } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'
</script>`,
			},
		],
	},
	render: args => ({
		components: { StatusPage, VBtn },
		setup() {
			return { args }
		},
		template: `
			<StatusPage v-bind="args">
				<template #action>
					<div class="d-flex ga-2 mt-4">
						<VBtn
							href="/"
							color="primary"
						>
							Retour à l'accueil
						</VBtn>
						<VBtn
							variant="outlined"
							color="primary"
						>
							Déconnexion
						</VBtn>
					</div>
				</template>
			</StatusPage>
		`,
	}),
}

export const SlotAdditionalContent: Story = {
	args: {
		...Default.args,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<StatusPage
		page-title="une erreur est survenue"
		code="500"
		message="Une erreur est survenue de notre côté, veuillez réessayer plus tard. Si le problème persiste veuillez nous contacter par téléphone au 3646"
	>
		<template #additional-content>
			<p class="text-center">
				Si le problème persiste, veuillez contacter le support technique.
			</p>
		</template>
	</StatusPage>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { StatusPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { StatusPage },
		setup() {
			return { args }
		},
		template: `
			<StatusPage v-bind="args">
				<template #additional-content>
					<p class="text-center">
						Si le problème persiste, veuillez contacter le support technique.
					</p>
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
				code: `<template>
	<StatusPage
		page-title="Une erreur est survenue"
		message="Veuillez réessayer ultérieurement."
		code="500"
		role="main"
		unique-id="status-page-main"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { StatusPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
}

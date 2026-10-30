import type { Meta, StoryObj } from '@storybook/vue3-vite'
import ErrorPage from './ErrorPage.vue'
import { VBtn } from 'vuetify/components'

const meta: Meta = {
	title: 'Templates/ErrorPage',
	component: ErrorPage,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		() => ({ template: '<div style="padding: 20px; background: rgb(231, 236, 245)"><story /></div>' }),
	],
} satisfies Meta<typeof ErrorPage>

export default meta

type Story = StoryObj<typeof ErrorPage>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<ErrorPage />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ErrorPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
}

export const WithLink: Story = {
	args: {
		btnHref: '/',
		btnText: 'Retour à l\'accueil',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<ErrorPage
		btn-href="/"
		btn-text="Retour à l'accueil"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ErrorPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
}

export const CustomIllustration: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<ErrorPage>
		<template #illustration>
			<div
				class="d-flex align-center justify-center rounded-lg bg-surface border-md border-dashed border-primary border-opacity-100"
				style="width: 260px; height: 200px;"
			>
				<span class="font-weight-bold text-primary">Illustration</span>
			</div>
		</template>
	</ErrorPage>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ErrorPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { ErrorPage },
		setup() {
			return { args }
		},
		template: `
			<ErrorPage v-bind="args">
				<template #illustration>
					<div
						class="d-flex align-center justify-center rounded-lg bg-surface border-md border-dashed border-primary border-opacity-100"
						style="width: 260px; height: 200px;"
					>
						<span class="font-weight-bold text-primary">Illustration</span>
					</div>
				</template>
			</ErrorPage>
		`,
	}),
}

export const SlotAction: Story = {
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
	<ErrorPage>
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
	</ErrorPage>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ErrorPage } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'
</script>`,
			},
		],
	},
	render: args => ({
		components: { ErrorPage, VBtn },
		setup() {
			return { args }
		},
		template: `
			<ErrorPage v-bind="args">
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
			</ErrorPage>
		`,
	}),
}

export const SlotAdditionalContent: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<ErrorPage>
		<template #additional-content>
			<p class="text-center">
				Si le problème persiste, veuillez contacter le support technique.
			</p>
		</template>
	</ErrorPage>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ErrorPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
	render: args => ({
		components: { ErrorPage },
		setup() {
			return { args }
		},
		template: `
			<ErrorPage v-bind="args">
				<template #additional-content>
					<p class="text-center">
						Si le problème persiste, veuillez contacter le support technique.
					</p>
				</template>
			</ErrorPage>
		`,
	}),
}

export const WithRole: Story = {
	args: {
		role: 'region',
		uniqueId: 'error-page-region',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<ErrorPage
		role="region"
		unique-id="error-page-region"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ErrorPage } from '@cnamts/synapse'
</script>`,
			},
		],
	},
}

import { fn } from '@storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import DialogBox from '../DialogBox/DialogBox.vue'
import PageContainer from '../PageContainer/PageContainer.vue'
import CookiesSelection from './CookiesSelection.vue'
import CookieBanner from '../CookieBanner/CookieBanner.vue'
import { ref } from 'vue'

const meta = {
	title: 'Templates/CookiesSelection',
	component: CookiesSelection,
	argTypes: {
		'items': {
			description: 'Liste des cookies à afficher',
			control: 'object',
			table: {
				type: {
					summary: 'CookiesItems',
					detail: `{
	essentials?: {
		name: string
		description?: string
		conservation: string
	}[],
	functional?: {
		name: string
		description?: string
		conservation: string
	}[],
	analytics?: {
		name: string
		description?: string
		conservation: string
	}[],
}`,
				},
			},
		},
		// @ts-expect-error - 'cookie-description-${cookieName}' storybook can't infer dynamic slot name
		'cookie-description-${cookieName}': {
			description: 'Slot pour personnaliser la description d’un cookie',
			control: 'none',
			table: {
				category: 'Slots',
				type: {
					summary: 'Cookie',
					detail: `{
	name: string
	description?: string
	conservation: string
}`,
				},
			},
		},
		'onSubmit': {
			description: 'Événement émis lors de la soumission du formulaire',
			action: 'submit',
			table: {
				category: 'Events',
				type: {
					summary: `{
	essentials?: boolean,
	functional?: boolean,
	analytics?: boolean
}'`,
				},
			},
		},
	},
	parameters: {
		docs: {
			controls: { exclude: ['submit', 'slotName'] },
		},
	},
	args: {
		items: {
			essentials: [
				{
					name: 'session',
					description: 'Sauvegarde la session pour rester connecté.',
					conservation: '20 heures',
				},
				{
					name: 'cookie_policy',
					description: 'Sauvegarde les préférences de cookies.',
					conservation: '1 an',
				},
			],
			functional: [
				{
					name: 'contrast',
					description: 'Sauvegarde la personnalisation de l’affichage.',
					conservation: '1 an',
				},
			],
			analytics: [
				{
					name: 'user_id',
					description: 'Sauvegarde l’identifiant unique de visiteur.',
					conservation: '6 mois',
				},
			],
		},
	},
} satisfies Meta<typeof CookiesSelection>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		onSubmit: fn(),
	},
	decorators: [() => ({
		components: { PageContainer },
		template: '<PageContainer size="m"><story/></PageContainer>',
	})],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer size="m">
		<CookiesSelection
			:items="items"
			@submit="onSubmit"
		/>
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CookiesSelection, PageContainer } from '@cnamts/synapse'

	const items = {
		essentials: [
			{
				name: 'session',
				description: 'Sauvegarde la session pour rester connecté.',
				conservation: '20 heures',
			},
			{
				name: 'cookie_policy',
				description: 'Sauvegarde les préférences de cookies.',
				conservation: '1 an',
			},
		],
		functional: [
			{
				name: 'contrast',
				description: 'Sauvegarde la personnalisation de l’affichage.',
				conservation: '1 an',
			},
		],
		analytics: [
			{
				name: 'user_id',
				description: 'Sauvegarde l’identifiant unique de visiteur.',
				conservation: '6 mois',
			},
		],
	}

	function onSubmit(e) {
		console.log(e)
	}
</script>
				`,
			},
		],
	},
}

export const InDialogBox: Story = {
	args: {
		onSubmit: fn(),
	},
	decorators: [() => ({
		components: { PageContainer, DialogBox },
		template: `<DialogBox
	hideActions
	persistent
	:modelValue="true"
>
	<div style="overflow: auto">
		<story/>
	</div>
</DialogBox>`,
	})],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<DialogBox
		hideActions
		persistent
		:modelValue="true"
	>
		<div style="overflow: auto">
			<CookiesSelection
				:items="items"
				@submit="onSubmit"
			/>
		</div>
	</DialogBox>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CookiesSelection, DialogBox } from '@cnamts/synapse'

	const items = {
		essentials: [
			{
				name: 'session',
				description: 'Sauvegarde la session pour rester connecté.',
				conservation: '20 heures',
			},
			{
				name: 'cookie_policy',
				description: 'Sauvegarde les préférences de cookies.',
				conservation: '1 an',
			},
		],
		functional: [
			{
				name: 'contrast',
				description: 'Sauvegarde la personnalisation de l’affichage.',
				conservation: '1 an',
			},
		],
		analytics: [
			{
				name: 'user_id',
				description: 'Sauvegarde l’identifiant unique de visiteur.',
				conservation: '6 mois',
			},
		],
	}

	function onSubmit(e) {
		console.log(e)
	}
</script>
				`,
			},
		],
	},
}

export const CookieDescriptionSlot: Story = {
	args: {
		items: {
			functional: [
				{
					name: 'contrast',
					conservation: '1 an',
				},
				{
					name: 'privacy',
					conservation: '1 an',
				},
				{
					name: 'cookie_policy',
					description: 'Sauvegarde les préférences de cookies.',
					conservation: '1 an',
				},
			],
		},
		onSubmit: fn(),
	},
	render: (args) => {
		return {
			components: { CookiesSelection, PageContainer },
			setup() {
				return { args }
			},
			template: `<PageContainer size="m">
	<CookiesSelection
		:items="args.items"
	>
		<template #cookie-description-contrast="{ cookie }">
			voir : <a href="#">En savoir plus</a>
		</template>

		<template #cookie-description-privacy="{ cookie }">
			<a href="#">Politique de confidentialité</a>
		</template>
	</CookiesSelection>
</PageContainer>`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<PageContainer size="m">
		<CookiesSelection
			:items="items"
			@submit="onSubmit"
		>
			<template #cookie-description-contrast="{ cookie }">
				voir : <a href="#">En savoir plus</a>
			</template>
			<template #cookie-description-privacy="{ cookie }">
				<a href="#">Politique de confidentialité</a>
			</template>
		</CookiesSelection>
	</PageContainer>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CookiesSelection, PageContainer } from '@cnamts/synapse'

	const items = {
		functional: [
				{
					name: 'contrast',
					conservation: '1 an',
				},
				{
					name: 'privacy',
					conservation: '1 an',
				},
				{
					name: 'cookie_policy',
					description: 'Sauvegarde les préférences de cookies.',
					conservation: '1 an',
				},
			],
	}

	function onSubmit(e) {
		console.log(e)
	}
</script>
				`,
			},
		],
	},
}

export const WithCookieBannerComponent: Story = {
	args: {},
	render: (args) => {
		return {
			components: { CookieBanner, DialogBox, CookiesSelection },
			setup() {
				const openBanner = ref(true)
				const openDialog = ref(false)

				function onSubmit(e: unknown) {
					console.log('Les cookies suivants ont été sélectionnés :', e)
					openDialog.value = false
					openBanner.value = false
					alert('Vos préférences ont été enregistrées.')
				}

				return { args, openBanner, openDialog, onSubmit }
			},
			template: `
			<div style="height: 500px; display: flex; align-items: center; justify-content: center;">
				<VBtn @click="openBanner = true" v-if="!openBanner && !openDialog">Reset</VBtn>
				<CookieBanner
					v-model="openBanner"
					@customize="openDialog = true"
				/>
					
				<DialogBox
					hideActions
					persistent
					v-model="openDialog"
				>
					<div style="overflow: auto">
						<CookiesSelection
							v-bind="args"
							@submit="onSubmit"
						/>
					</div>
				</DialogBox>
			</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<DialogBox
		hideActions
		persistent
		v-model="openDialog"
	>
		<div style="overflow: auto">
			<CookiesSelection
				:items="items"
				@submit="onSubmit"
			/>
		</div>
	</DialogBox>


	<CookieBanner
		v-model="openBanner"
		@customize="openDialog = true"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CookiesSelection, DialogBox, CookieBanner } from '@cnamts/synapse'

	const openBanner = ref(true)
	const openDialog = ref(false)

	const items = {
		essentials: [
			{
				name: 'session',
				description: 'Sauvegarde la session pour rester connecté.',
				conservation: '20 heures',
			},
			{
				name: 'cookie_policy',
				description: 'Sauvegarde les préférences de cookies.',
				conservation: '1 an',
			},
		],
		functional: [
			{
				name: 'contrast',
				description: 'Sauvegarde la personnalisation de l’affichage.',
				conservation: '1 an',
			},
		],
		analytics: [
			{
				name: 'user_id',
				description: 'Sauvegarde l’identifiant unique de visiteur.',
				conservation: '6 mois',
			},
		],
	}

	function onSubmit(e) {
		console.log('Les cookies suivants ont été sélectionnés :', e)
		openDialog.value = false
		openBanner.value = false
		alert('Vos préférences ont été enregistrées.')
	}

</script>`,
			},
		],
	},
}

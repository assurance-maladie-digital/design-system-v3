import { type Meta, type StoryObj } from '@storybook/vue3'
import CookieBanner from './CookieBanner.vue'
import { fn } from '@storybook/test'
import { VBtn } from 'vuetify/components'
import { ref, watch } from 'vue'

const meta = {
	title: 'Templates/CookieBanner',
	component: CookieBanner,
	argTypes: {
		'modelValue': {
			description: 'V-model, control la visibilité de la bannière',
			control: { type: 'boolean' },
			table: {
				defaultValue: { summary: 'true' },
				category: 'props',
			},
		},
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
			category: 'props',
		},

		'onAccept': {
			action: 'accept',
			description: 'Événement émis lors de l\'acceptation des cookies',
			table: {
				category: 'Events',
				type: { summary: '' },
			},
		},
		'onReject': {
			action: 'reject',
			description: 'Événement émis lors du refus des cookies',
			table: {
				category: 'Events',
				type: { summary: '' },
			},
		},
		'onCustomize': {
			action: 'customize',
			description: 'Événement émis lors de la personnalisation des cookies',
			table: {
				category: 'Events',
				type: { summary: '' },
			},
		},
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore-  Object literal may only specify known properties
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lors de la mise à jour de la visibilité de la bannière',
			table: {
				category: 'Events',
				type: { summary: 'Boolean' },
			},
		},
		'vuetifyOptions': {
			description: 'Options de personnalisation des composants Vuetify internes',
			control: { type: 'object' },
			table: {
				defaultValue: {
					summary: '{}',
					detail: `{
	banner: {
		width: '800px',
		maxWidth: '100%',
		rounded: true,
		elevation: 2,
		class: 'pa-8 ma-8',
		stacked: true,
		location: 'bottom',
		position: 'fixed',
		maxHeight: 'calc(100dvh - 64px)',
		density: 'compact',
	},
	closeBtn: {
		icon: true,
		variant: 'text',
		width: '32px',
		height: '32px',
		class: 'mt-n2 mr-n2 ml-4',
	},
	backBtn: {
		icon: true,
		variant: 'text',
		width: '32px',
		height: '32px',
		class: 'mt-n2 mr-n2 ml-4',
	},
	customizeBtn: {
		color: 'primary',
		height: 'auto',
		minHeight: '44px',
		class: 'text-wrap ma-2',
		variant: 'outlined',
	},
	rejectBtn: {
		color: 'primary',
		height: 'auto',
		minHeight: '44px',
		class: 'text-wrap ma-2',
	},
	acceptBtn: {
		color: 'primary',
		height: 'auto',
		minHeight: '44px',
		class: 'text-wrap ma-2',
	},
}`,
				},
				type: {
					summary: 'Record<string, Record<string, unknown>>',
					detail: `{
	banner: VBannerOptions,
	closeBtn: VBtnOptions,
	customizeBtn: VBtnOptions,
	rejectBtn: VBtnOptions,
	acceptBtn: VBtnOptions,
}`,
				},
				category: 'props',
			},
		},
		'default': {
			description: 'Description de la bannière',
			control: { type: 'text' },
			table: {
				defaultValue: { summary: 'undefined' },
				type: { summary: '{}' },
				category: 'slots',
			},
		},
	},
	parameters: {
		layout: 'fullscreen',
		controls: {
			exclude: ['reject', 'accept', 'customize'],
		},
	},
	args: {
		modelValue: true,
	},
} satisfies Meta<typeof CookieBanner>

export default meta

type Story = StoryObj<typeof meta>

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

export const Default: Story = {
	argTypes: {
		onAccept: { action: 'accept' },
		onReject: { action: 'reject' },
		onCustomize: { action: 'customize' },
	},
	args: {
		items,
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
	},

	decorators: [
		() => ({
			template: '<div style="height: 500px;"><story /></div>',
		}),
	],

	render: (args) => {
		return {
			components: { CookieBanner, VBtn },
			setup() {
				const open = ref(true)
				watch(() => args.modelValue, (value) => {
					open.value = !!value
				}, { immediate: true })
				return { args, open }
			},
			template: `
			<div style="height: 500px; display: flex; align-items: center; justify-content: center;">
				<VBtn @click="open = true" v-if="!open">Reset</VBtn>
				<CookieBanner v-bind="args" v-model="open">
					<template #default v-if="args.default">
						{{ args.default }}
					</template>
				</CookieBanner>
			</div>
			`,
		}
	},

	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<CookieBanner
		:items
		@accept="onAccept"
		@reject="onReject"
		@customize="onCustomize"
		v-model="modelValue"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CookieBanner } from '@cnamts/synapse'

	const modelValue = ref(true)

	const onAccept = () => {
		console.log('Accept')
	}

	const onReject = () => {
		console.log('Reject')
	}

	const onCustomize = () => {
		console.log('Customize')
	}
	
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
</script>`,
			},
		],
	},
}

export const WithoutCookiesItems: Story = {
	args: {
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
	},
	render: (args) => {
		return {
			components: { CookieBanner, VBtn },
			setup() {
				const open = ref(true)
				watch(() => args.modelValue, (value) => {
					open.value = !!value
				}, { immediate: true })
				return { args, open }
			},
			template: `
			<div style="height: 500px; display: flex; align-items: center; justify-content: center;">
				<VBtn @click="open = true" v-if="!open">Reset</VBtn>
				<CookieBanner v-bind="args" v-model="open" >
					<template #default v-if="args.default">
						{{ args.default }}
					</template>
				</CookieBanner>
			</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<CookieBanner
		@accept="onAccept"
		@reject="onReject"
		@customize="onCustomize"
		v-model="modelValue"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CookieBanner } from '@cnamts/synapse'

	const modelValue = ref(true)
</script>`,
			},
		],
	},
}

export const DescriptionSlot: Story = {
	args: {
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
		items,
	},
	render: (args) => {
		return {
			components: { CookieBanner, VBtn },
			setup() {
				const open = ref(true)
				watch(() => args.modelValue, (value) => {
					open.value = !!value
				}, { immediate: true })
				return { args, open }
			},
			template: `
			<div style="height: 500px; display: flex; align-items: center; justify-content: center;">
				<VBtn @click="open = true" v-if="!open">Reset</VBtn>
				<CookieBanner v-bind="args" v-model="open">
					<p><b>Custom</b> description</p>
				</CookieBanner>
			</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<CookieBanner
		:items
		@accept="onAccept"
		@reject="onReject"
		@customize="onCustomize"
		v-model="modelValue"
	>
		<p><b>Custom</b> description</p>
	</CookieBanner>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CookieBanner } from '@cnamts/synapse'

	const modelValue = ref(true)

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
</script>`,
			},
		],
	},
	decorators: [
		() => ({
			template: '<div style="overflow: auto; max-height: 500px"><story /></div>',
		}),
	],
}

export const Customization: Story = {
	args: {
		items,
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
		vuetifyOptions: {
			banner: {
				color: '#ced9eb',
			},
			customizeBtn: {
				variant: 'text',
				color: 'orange',
			},
			rejectBtn: {
				variant: 'outlined',
			},
			acceptBtn: {
				variant: 'outlined',
			},
		},
	},
	render: (args) => {
		return {
			components: { CookieBanner, VBtn },
			setup() {
				const open = ref(true)
				watch(() => args.modelValue, (value) => {
					open.value = !!value
				}, { immediate: true })
				return { args, open }
			},
			template: `
			<div style="height: 500px; display: flex; align-items: center; justify-content: center;">
				<VBtn @click="open = true" v-if="!open">Reset</VBtn>
				<CookieBanner v-bind="args" v-model="open" >
					<template #default v-if="args.default">
						{{ args.default }}
					</template>
				</CookieBanner>
			</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<CookieBanner
		:items
		@accept="onAccept"
		@reject="onReject"
		@customize="onCustomize"
		v-model="modelValue"
		:cookiesRoute="cookiesRoute"
		:vuetifyOptions="vuetifyOptions"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { CookieBanner } from '@cnamts/synapse'

	const modelValue = ref(true)

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

	const vuetifyOptions = {
		sheet: {
			color: '#ced9eb',
		},
		customizeBtn: {
			variant: 'text',
			color: 'orange',
		},
		rejectBtn: {
			variant: 'outlined',
		},
		acceptBtn: {
			variant: 'outlined',
		},
	}
</script>`,
			},
		],
	},
}

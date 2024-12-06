import { type Meta, type StoryObj } from '@storybook/vue3'
import CookieBanner from './CookieBanner.vue'
import { fn } from '@storybook/test'
import { VBtn } from 'vuetify/components'
import { ref, watch } from 'vue'
import DialogBox from '../DialogBox/DialogBox.vue'
import CookiesSelection from '../CookiesSelection/CookiesSelection.vue'

const meta = {
	title: 'Composants/Feedback/CookieBanner',
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
		'cookiesRoute': {
			description: 'Route vers la page de gestion des cookies',
			control: { type: 'text' },
			table: {
				defaultValue: { summary: 'undefined' },
				type: { summary: 'RouteLocationRaw' },
				category: 'props',
			},
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
	sheet: {
		width: '800px',
		maxWidth: '100%',
		rounded: true,
		elevation: 3,
		class: 'pa-8',
	},
	closeBtn: {
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
	sheet: VSheetOptions,
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
	},
	args: {
		modelValue: true,
	},
} satisfies Meta<typeof CookieBanner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	argTypes: {
		cookiesRoute: { control: { type: 'text' } },
		onAccept: { action: 'accept' },
		onReject: { action: 'reject' },
		onCustomize: { action: 'customize' },
	},
	args: {
		cookiesRoute: '/cookie',
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
		SourceCode: [
			{
				name: 'Template',
				code: `<template>
	<CookieBanner
		cookiesRoute="/cookie"
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
</script>`,
			},
		],
	},
}

export const WithoutCookiesRoute: Story = {
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
		SourceCode: [
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
		SourceCode: [
			{
				name: 'Template',
				code: `<template>
	<CookieBanner
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
</script>`,
			},
		],
	},
}

export const Customization: Story = {
	args: {
		onAccept: fn(),
		onReject: fn(),
		onCustomize: fn(),
		vuetifyOptions: {
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
		SourceCode: [
			{
				name: 'Template',
				code: `<template>
	<CookieBanner
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

export const WithCookiesSelectionsComponent: Story = {
	args: {
	},
	render: (args) => {
		return {
			components: { CookieBanner, DialogBox, CookiesSelection },
			setup() {
				const openBanner = ref(true)
				const openDialog = ref(false)
				watch(() => args.modelValue, (value) => {
					openBanner.value = !!value
				}, { immediate: true })

				function onSubmit(e: unknown) {
					console.log('Les cookies suivants ont été sélectionnés :', e)
					openDialog.value = false
					openBanner.value = false
					alert('Vos préférences ont été enregistrées.')
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

				return { args, openBanner, openDialog, onSubmit, items }
			},
			template: `
			<div style="height: 500px; display: flex; align-items: center; justify-content: center;">
				<VBtn @click="openBanner = true" v-if="!openBanner && !openDialog">Reset</VBtn>
				<CookieBanner
					v-bind="args"
					v-model="openBanner"
					@customize="openDialog = true"
				>
					<template #default v-if="args.default">
						{{ args.default }}
					</template>
				</CookieBanner>
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

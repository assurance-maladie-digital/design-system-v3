import LangBtn from './LangBtn.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { VBtn, VMenu, VList, VListItem, VListItemTitle } from 'vuetify/components'

const meta: Meta<typeof LangBtn> = {
	title: 'Composants/Boutons/LangBtn',
	component: LangBtn,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['currentLangData', 'updateLang', 'selectedLanguage'] },
	},
	argTypes: {
		modelValue: { control: 'text' },
		hideDownArrow: { control: 'boolean' },
		ariaLabel: { control: 'text' },
		// @ts-expect-error Type '"array"' is not assignable to type 'Control | undefined'.
		availableLanguages: { control: { type: 'array' } },
		vuetifyOptions: {
			control: { type: 'object' },
			default: () => ({
				menu: {
					offsetY: true,
				},
				btn: {
					color: 'primary',
					variant: 'outlined',
					ripple: true,
				},
				icon: {
					class: 'ml-1',
				},
			}),
		},
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LangBtn
		v-model="value"
		:items="items"
		:aria-label="ariaLabel"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import LangBtn from '@cnamts/synapse'
	import { ref } from 'vue'

	const value = ref('fr')
	const items = ['fr', 'en', 'es']
	const ariaLabel = 'Choix de la langue'
</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'fr',
		hideDownArrow: false,
		ariaLabel: 'Choix de la langue',
		availableLanguages: ['fr', 'en', 'es'],
		vuetifyOptions: {
			menu: {
				offsetY: true,
			},
			btn: {
				color: 'primary',
				variant: 'outlined',
				ripple: true,
			},
			icon: {
				class: 'ml-1',
			},
		},
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<LangBtn :vuetify-options="args.vuetifyOptions" v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

export const AllLanguages: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LangBtn
		v-model="value"
		:aria-label="ariaLabel"
		available-languages="*"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import LangBtn from '@cnamts/synapse'
	import { ref } from 'vue'

	const value = ref('fr')
	const ariaLabel = 'Choix de la langue'
</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'fr',
		hideDownArrow: false,
		ariaLabel: 'Choix de la langue',
		availableLanguages: '*',
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<LangBtn v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

export const NoDownArrow: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LangBtn
		v-model="value"
		:items="items"
		:aria-label="ariaLabel"
		hide-down-arrow
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import LangBtn from '@cnamts/synapse'
	import { ref } from 'vue'

	const value = ref('fr')
	const items = ['fr', 'en', 'es']
	const ariaLabel = 'Choix de la langue'
</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'fr',
		hideDownArrow: true,
		ariaLabel: 'Choix de la langue',
		availableLanguages: ['fr', 'en', 'de'],
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<LangBtn v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

export const FlatBtn: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LangBtn
		v-model="value"
		:items="items"
		:aria-label="ariaLabel"
		:vuetify-options="vuetifyOptions"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import LangBtn from '@cnamts/synapse'
	import { ref } from 'vue'

	const value = ref('fr')
	const items = ['fr', 'en', 'es']
	const ariaLabel = 'Choix de la langue'
	
	const vuetifyOptions = {
		btn: {
			color: 'primary',
			variant: 'flat',
			ripple: true,
		},
	}
</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'fr',
		hideDownArrow: false,
		ariaLabel: 'Choix de la langue',
		availableLanguages: ['fr', 'en', 'de'],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				variant: 'flat',
				ripple: true,
			},
		},
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<LangBtn :vuetify-options="args.vuetifyOptions" v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

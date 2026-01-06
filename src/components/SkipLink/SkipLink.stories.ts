import type { Meta, StoryObj } from '@storybook/vue3'
import SkipLink from './SkipLink.vue'
import { computed } from 'vue'

const getMainTargetUrl = (): string => {
	if (typeof window === 'undefined') {
		return '#main'
	}

	try {
		const locationFromTop = window.top?.location
		const locationFromParent = window.parent?.location
		const loc = locationFromTop ?? locationFromParent ?? window.location
		return `${loc.origin}${loc.pathname}${loc.search}#main`
	} catch {
		return `${window.location.origin}${window.location.pathname}${window.location.search}#main`
	}
}

const meta = {
	title: 'Composants/Navigation/SkipLink',
	component: SkipLink,
	argTypes: {
		default: {
			control: { type: 'text' },
			default: 'Skip to content',
		},
	},
	parameters: {
		layout: 'fullscreen',
	},
} as Meta<typeof SkipLink>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="pa-8">
		<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
		<SkipLink 
			label="Aller au contenu principal"
			target="#main" 
		/>
		<div id="main" />
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SkipLink } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		target: '',
	},
	render: (args) => {
		return {
			components: { SkipLink },
			setup() {
				const resolvedTarget = computed(() => {
					return !args.target || args.target.includes('/iframe.html')
						? getMainTargetUrl()
						: args.target
				})

				return { args, resolvedTarget }
			},
			template: `
				<div class="pa-8">
					<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
					<SkipLink 
						:target="resolvedTarget"
						:label="args.label"
					>
						<template #default v-if="args.default"><span v-html="args.default"/></template>
					</SkipLink>
					<div id="main" />
				</div>
			`,
		}
	},
}

export const WithSlot: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="pa-8">
		<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
		<SkipLink target="#main">
			<template #default>
				<b>lorem ipsum</b>
			</template>
		</SkipLink>
		<div id="main" />
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SkipLink } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		target: '',
		default: '<b>lorem ipsum</b>',
	},
	render: (args) => {
		return {
			components: { SkipLink },
			setup() {
				const resolvedTarget = computed(() => {
					return !args.target || args.target.includes('/iframe.html')
						? getMainTargetUrl()
						: args.target
				})

				return { args, resolvedTarget }
			},
			template: `
				<div class="pa-8">
					<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
					<SkipLink 
						v-bind="{ ...args, target: resolvedTarget }"
					>
						<template #default v-if="args.default"><span v-html="args.default"/></template>
					</SkipLink>
					<div id="main" />
				</div>
			`,
		}
	},
}

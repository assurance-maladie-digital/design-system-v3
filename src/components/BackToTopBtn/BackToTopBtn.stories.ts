import type { Meta, StoryObj } from '@storybook/vue3'

import BackToTopBtn from './BackToTopBtn.vue'
import { VCard, VSheet } from 'vuetify/components'

const meta = {
	title: 'Composants/Boutons/BackToTopBtn',
	component: BackToTopBtn,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		threshold: {
			control: { type: 'range', max: 2000 },
		},
		nudgeRight: {
			control: { type: 'range' },
			default: 16,
		},
		nudgeBottom: {
			control: { type: 'range' },
			default: 16,
		},
		target: {
			control: { type: 'text' },
		},
		default: {
			control: { type: 'text' },
		},
		icon: {
			control: { type: 'text' },
		},
	},
	args: {
		threshold: 120,
		nudgeRight: 16,
		nudgeBottom: 16,
		target: 'target',
		default: 'Retour en haut',
	},
} satisfies Meta<typeof BackToTopBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VCard
		id="target"
		width="100%"
		max-height="200px"
		class="overflow-y-auto"
		style="scroll-behavior: smooth"
	>
		<VSheet
			height="600px"
			class="d-flex flex-column align-center"
		>
			<p class="pa-2">
				Haut de la section.
			</p>
		</VSheet>
		<BackToTopBtn :target="target">
			Retour en haut
		</BackToTopBtn>
	</VCard>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import BackToTopBtn from '@cnamts/BackToTopBtn'
	import { VCard, VSheet } from 'vuetify/components'
</script>
				`,
			},
		],
	},
	args: {
		target: 'target',
		vuetifyOptions: {
			btn: {
				variant: 'outlined',
				color: 'primary',
				class: 'text-wrap px-0 px-md-4',
			},
			icon: {
				color: 'primary',
				size: 'small',
				class: 'ml-0 ml-md-1',
			},
		},
	},
	render: (args) => {
		return {
			components: {
				BackToTopBtn,
				VCard,
				VSheet,
			},
			setup() {
				return { args }
			},
			template: `
				<VCard
					id="target"
					width="100%"
					max-height="200px"
					class="overflow-y-auto"
					style="scroll-behavior: smooth"
				>
					<VSheet
						height="600px"
						class="d-flex flex-column align-center"
					>
						<p class="pa-2">
							Haut de la section.
						</p>
					</VSheet>
					<BackToTopBtn v-bind="args" :vuetify-options="args.vuetifyOptions">
						{{args.default}}
					</BackToTopBtn>
				</VCard>
			`,
		}
	},
	play: async ({ canvasElement }) => {
		await new Promise((resolve: (v: unknown) => void) => setTimeout(resolve, 1000))
		const container = canvasElement.querySelector('#target')
		container?.scrollTo(0, 1000)
	},
}

export const Customization: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VCard
		id="btn-customization"
		width="100%"
		max-height="200px"
		class="overflow-y-auto"
		style="scroll-behavior: smooth"
	>
		<VSheet
			height="600px"
			class="d-flex flex-column align-center"
		>
			<p class="pa-2">
				Haut de la section.
			</p>
		</VSheet>
		<BackToTopBtn 
			:target="btn-customization" 
			:vuetify-options="vuetifyOptions"
		>
			Retour en haut
		</BackToTopBtn>
	</VCard>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import BackToTopBtn from '@cnamts/BackToTopBtn'
	import { VCard, VSheet } from 'vuetify/components'
	
	const vuetifyOptions = {
		btn: {
			variant: 'elevated',
			color: 'primary',
			rounded: true,
		},
		icon: {
			color: 'white',
		},
	}
</script>
				`,
			},
		],
	},
	args: {
		target: 'btn-customization',
		vuetifyOptions: {
			btn: {
				variant: 'elevated',
				color: 'primary',
				rounded: true,
			},
			icon: {
				color: 'white',
			},
		},
	},
	render: (args) => {
		return {
			components: {
				BackToTopBtn,
			},
			setup() {
				return { args }
			},
			template: `
				<VCard
					id="btn-customization"
					width="100%"
					max-height="200px"
					class="overflow-y-auto"
					style="scroll-behavior: smooth"
				>
					<VSheet
						height="600px"
						class="d-flex flex-column align-center"
					>
						<p class="pa-2">
							Haut de la section.
						</p>
					</VSheet>
					<BackToTopBtn v-bind="args" :vuetify-options="args.vuetifyOptions">
						{{args.default}}
					</BackToTopBtn>
				</VCard>
			`,
		}
	},
	play: async ({ canvasElement }) => {
		await new Promise((resolve: (v: unknown) => void) => setTimeout(resolve, 1000))
		const container = canvasElement.querySelector('#btn-customization')
		container?.scrollTo(0, 1000)
	},
}

export const CustomPosition: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VCard
		id="pill-btn"
		width="100%"
		max-height="200px"
		class="overflow-y-auto"
		style="scroll-behavior: smooth"
	>
		<VSheet
			height="600px"
			class="d-flex flex-column align-center"
		>
			<p class="pa-2">
				Haut de la section.
			</p>
		</VSheet>
		<BackToTopBtn 
			:target="pill-btn"
			:nudge-right="30"
			:nudge-bottom="30"
			:vuetify-options="vuetifyOptions"
		>
			Retour en haut
		</BackToTopBtn>
	</VCard>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import BackToTopBtn from '@cnamts/BackToTopBtn'
	import { VCard, VSheet } from 'vuetify/components'
	
	const vuetifyOptions = {
		btn: {
			variant: 'outlined',
			color: 'primary',
			minWidth: 92,
			rounded: true,
		}
	}
</script>
				`,
			},
		],
	},
	args: {
		target: 'pill-btn',
		nudgeRight: 30,
		nudgeBottom: 30,
		vuetifyOptions: {
			btn: {
				variant: 'outlined',
				color: 'primary',
				minWidth: 92,
				rounded: true,
			},
		},
	},
	render: (args) => {
		return {
			components: {
				BackToTopBtn,
			},
			setup() {
				return { args }
			},
			template: `
				<VCard
					id="pill-btn"
					width="100%"
					max-height="200px"
					class="overflow-y-auto"
					style="scroll-behavior: smooth"
				>
					<VSheet
						height="600px"
						class="d-flex flex-column align-center"
					>
						<p class="pa-2">
							Haut de la section.
						</p>
					</VSheet>
					<BackToTopBtn 
						v-bind="args" 
						:nudge-right="args.nudgeRight"
						:nudge-bottom="args.nudgeBottom"
						:vuetify-options="args.vuetifyOptions"
					>
						{{args.default}}
					</BackToTopBtn>
				</VCard>
			`,
		}
	},
	play: async ({ canvasElement }) => {
		await new Promise((resolve: (v: unknown) => void) => setTimeout(resolve, 1000))
		const container = canvasElement.querySelector('#pill-btn')
		container?.scrollTo(0, 1000)
	},
}

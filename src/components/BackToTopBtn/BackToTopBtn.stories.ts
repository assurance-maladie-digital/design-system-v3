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
			description: 'Distance par rapport au bas de la page à partir de laquelle le bouton apparaît',
			table: {
				type: { summary: 'number' },
			},
		},
		nudgeRight: {
			control: { type: 'range' },
			description: 'Décalage du bouton par rapport au bord droit de la fenêtre',
			default: 16,
			table: {
				type: { summary: 'number' },
			},
		},
		nudgeBottom: {
			control: { type: 'range' },
			description: 'Décalage du bouton par rapport au bord inférieur de la fenêtre',
			default: 16,
			table: {
				type: { summary: 'number' },
			},
		},
		target: {
			control: { type: 'text' },
			description: 'ID du conteneur devant être scrollé',
			table: {
				type: { summary: 'string' },
			},
		},
		default: {
			description: 'Texte du bouton',
			control: { type: 'text' },
		},
		icon: {
			description: 'Icône du bouton',
			control: { type: 'text' },
		},
		vuetifyOptions: {
			control: { type: 'object' },
			description: 'Options de personnalisation du bouton',
			default: () => ({
				btn: {
					variant: 'outlined',
					color: 'primary',
					class: 'text-wrap px-0 px-md-4',
				},
				icon: {
					color: 'primary',
					size: 'medium',
					class: 'ml-0 ml-md-2',
				},
			}),
			table: {
				category: 'props',
				type: {
					summary: 'object',
					detail: `
{
	btn: Record<string, unknown>,
	icon: Record<string, unknown>,
}`,
				},
			},
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
		<BackToTopBtn target="target">
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
				size: 'medium',
				class: 'ml-0 ml-md-2',
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
				const { default: defaultSlot, ...props } = args
				return {
					defaultSlot,
					props,
				}
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
					<BackToTopBtn v-bind="props" :vuetify-options="props.vuetifyOptions">
						{{ defaultSlot }}
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
			target="btn-customization" 
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
				const { default: defaultSlot, ...props } = args
				return {
					defaultSlot,
					props,
				}
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
					<BackToTopBtn v-bind="props" :vuetify-options="props.vuetifyOptions">
						{{defaultSlot}}
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
			target="pill-btn"
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
				const { default: defaultSlot, ...props } = args
				return {
					defaultSlot,
					props,
				}
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
						v-bind="props" 
						:nudge-right="props.nudgeRight"
						:nudge-bottom="props.nudgeBottom"
						:vuetify-options="props.vuetifyOptions"
					>
						{{defaultSlot}}
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

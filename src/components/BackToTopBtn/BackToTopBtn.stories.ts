import type { Meta, StoryObj } from '@storybook/vue3'

import BackToTopBtn from './BackToTopBtn.vue'
import { VCard, VSheet } from 'vuetify/components'

const meta = {
	title: 'Components/BackToTopBtn',
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

export const PillBtn: Story = {
	args: {
		target: 'pill-btn',
		vuetifyOptions: {
			btn: {
				variant: 'outlined',
				color: 'medium-emphasis',
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
				<v-btn
					color="primary"
					variant="outlined"
					size="small"
					rounded
					@click="() => { window.location.href = '' }"
				>
					VuetifyOptions
				</v-btn>
			`,
		}
	},
}

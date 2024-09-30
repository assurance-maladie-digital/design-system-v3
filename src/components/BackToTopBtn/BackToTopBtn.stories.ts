import type { Meta, StoryObj } from '@storybook/vue3'

import BackToTopBtn from './BackToTopBtn.vue'

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
		vuetifyOptions: {
			control: { type: 'object' },
			description: 'Customisez les options des composants internes de Vuetify',
			table: {
				category: 'props',
			},
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
		target: 'testcontainer',
		default: 'Retour en haut',
	},
} satisfies Meta<typeof BackToTopBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: (args) => {
		return {
			components: {
				BackToTopBtn,
			},
			setup() {
				return { args }
			},
			template: `
				<div
					id="testcontainer"
					style="height: 60vh; overflow: scroll; position: relative; border: 1px solid black; scroll-behavior: smooth; background: #fff"
				>
					<p>Scroll down</p>
					<div style="height: 360vh" />
					<BackToTopBtn
						v-bind="args"
					>
						{{args.default}}
					</BackToTopBtn>
				</div>
			`,
		}
	},
	play: async ({ canvasElement }) => {
		await new Promise((resolve: (v: unknown) => void) => setTimeout(resolve, 2000))
		const container = canvasElement.querySelector('#testcontainer')
		container?.scrollTo(0, 1000)
	},
}

export const Customization: Story = {
	args: {
		target: 'btn-customization',
		vuetifyOptions: {
			btn: {
				variant: 'tonal',
				color: 'red',
				rounded: false,
			},
			icon: {
				color: 'red',
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
				<div
					id="btn-customization"
					style="height: 60vh; overflow: scroll; position: relative; border: 1px solid black; scroll-behavior: smooth; background: #fff"
				>
					<p>Scroll down</p>
					<div style="height: 360vh" />
					<BackToTopBtn
						v-bind="args"
					>
						{{args.default}}
					</BackToTopBtn>
				</div>
			`,
		}
	},
	play: async ({ canvasElement }) => {
		await new Promise((resolve: (v: unknown) => void) => setTimeout(resolve, 2000))
		const container = canvasElement.querySelector('#btn-customization')
		container?.scrollTo(0, 1000)
	},
}

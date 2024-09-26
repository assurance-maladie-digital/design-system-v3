import type { Meta, StoryObj } from '@storybook/vue3'
import SkipLink from './SkipLink.vue'

const meta = {
	title: 'Components/SkipLink',
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
	render: (args) => {
		return {
			components: { SkipLink },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-8">
					<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
					<SkipLink 
						:target="args.target"
						:label="args.label"
					>
						<template #default v-if="args.default"><span v-html="args.default"/></template>
					</SkipLink>
				</div>
			`,
		}
	},
}

export const WithSlot: Story = {
	args: {
		default: '<b>lorem ipsum</b>',
	},
	render: (args) => {
		return {
			components: { SkipLink },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-8">
					<p>Pour afficher le composant, cliquez ici et appuyer sur <kbd>Tab</kbd>.</p>
					<SkipLink 
						v-bind="args"
					>
						<template #default v-if="args.default"><span v-html="args.default"/></template>
					</SkipLink>
				</div>
			`,
		}
	},
}

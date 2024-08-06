import type { Meta, StoryObj } from '@storybook/vue3'

import TestComponent from './TestComponent.vue'
import { fn } from '@storybook/test'

const meta = {
	title: 'Components/TestComponent',
	component: TestComponent,
	tags: ['autodocs'],
	args: { onClick: fn() },
	parameters: {
		layout: 'fullscreen',
	},
} satisfies Meta<typeof TestComponent>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		number1: 1,
		number2: 2,
	},
}

export const WithDifferentNumbers: Story = {
	args: {
		number1: 3,
		number2: 4,
	},
}

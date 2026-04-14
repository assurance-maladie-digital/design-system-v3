import type { Meta, StoryObj } from '@storybook/vue3'
import { VSkeletonLoader } from 'vuetify/components'

const meta: Meta = {
	title: 'Composants/Composants Vuetify/VSkeletonLoader',
	tags: ['!dev'],
	render: args => ({
		components: { VSkeletonLoader },
		setup() {
			return { args }
		},
		template: '<v-skeleton-loader v-bind="args" />',
	}),
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		type: 'card',
		loading: true,
	},
}

export const Article: Story = {
	args: {
		type: 'article',
		loading: true,
	},
}

export const Avatar: Story = {
	args: {
		type: 'avatar',
		loading: true,
	},
}

export const Card: Story = {
	args: {
		type: 'card',
		loading: true,
	},
}

export const ListItem: Story = {
	args: {
		type: 'list-item-avatar',
		loading: true,
	},
}

export const Boilerplate: Story = {
	args: {
		type: 'card',
		boilerplate: true,
	},
}

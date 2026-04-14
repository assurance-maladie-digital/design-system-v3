import type { Meta, StoryObj } from '@storybook/vue3'
import { VSkeletonLoader } from 'vuetify/components'

const meta: Meta<typeof VSkeletonLoader> = {
	title: 'Composants/Composants Vuetify/VSkeletonLoader',
	tags: ['!dev'],
	component: VSkeletonLoader,
	parameters: {
		docs: {
			source: {
				transform: (src: string) =>
					src.replace(/VSkeletonLoader/g, 'v-skeleton-loader'),
			},
		},
	},
	argTypes: {
		type: {
			control: { type: 'select' },
			options: ['article', 'avatar', 'card', 'list-item-avatar'],
			description: 'Type de skeleton loader',
		},
		loading: {
			control: { type: 'boolean' },
			description: 'Affiche le skeleton loader',
		},
		boilerplate: {
			control: { type: 'boolean' },
			description: 'Affiche une version simplifiée du skeleton loader',
		},
	},
}

export default meta

type Story = StoryObj<typeof VSkeletonLoader>

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

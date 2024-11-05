import type { Meta, StoryObj } from '@storybook/vue3'

import HeaderNavbar from './HeaderNavbar.vue'

const meta = {
	component: HeaderNavbar,
} satisfies Meta<typeof HeaderNavbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		items: [
			{
				label: 'Home',
				to: '/',
			},
			{
				label: 'About',
				to: '/about',
			},
		],
	},
}

export const WithScroll: Story = {
	args: {
		items: [
			{
				label: 'Home',
				to: '/',
			},
			{
				label: 'About',
				to: '/about',
			},
		],
	},
	decorators: [
		() => ({
			template: `
			<div>
				<story/>
				<div
					style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
				>Contenu de la page</div>
			</div>`,
		}),
	],
}

export const WithManyItems: Story = {
	args: {
		items: [
			{
				label: 'Home',
				to: '/',
			},
			{
				label: 'About',
				to: '/about',
			},
			{
				label: 'Services',
				to: '/services',
			},
			{
				label: 'Contact',
				to: '/contact',
			},
			{
				label: 'Blog',
				to: '/blog',
			},
			{
				label: 'Portfolio',
				to: '/portfolio',
			},
			{
				label: 'Team',
				to: '/team',
			},
			{
				label: 'Careers',
				to: '/careers',
			},
		],
	},
}

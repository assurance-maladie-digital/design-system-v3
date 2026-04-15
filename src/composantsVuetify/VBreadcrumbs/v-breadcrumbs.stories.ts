import type { Meta, StoryObj } from '@storybook/vue3'
import { VBreadcrumbs } from 'vuetify/components'

const meta = {
	title: 'Composants/Composants Vuetify/VBreadcrumbs',
	component: VBreadcrumbs,
	parameters: {
		docs: {
			source: {
				transform: (src: string) =>
					src.replace(/VBreadcrumbs/g, 'v-breadcrumbs'),
			},
		},
	},
	tags: ['!dev'],
	argTypes: {
		items: {
			control: 'object',
			description: 'Liste des éléments du fil d\'ariane',
		},
		divider: {
			control: 'text',
			description: 'Caractère de séparation entre les éléments',
		},
		disabled: {
			control: 'boolean',
			description: 'Désactive tous les liens',
		},
		color: {
			control: 'text',
			description: 'Couleur appliquée aux liens actifs (ex: primary, secondary, error...)',
		},
	},
} satisfies Meta<typeof VBreadcrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		color: 'primary',
		items: [
			{
				title: 'Accueil',
				disabled: false,
				href: '#',
			},
			{
				title: 'Catégorie',
				disabled: false,
				href: '#',
			},
			{
				title: 'Page actuelle',
				disabled: true,
			},
		],
	},
}

export const PrimaryColor: Story = {
	args: {
		color: 'primary',
		items: [
			{
				title: 'Accueil',
				disabled: false,
				href: '#',
			},
			{
				title: 'Catégorie',
				disabled: false,
				href: '#',
			},
			{
				title: 'Page actuelle',
				disabled: true,
			},
		],
	},
}

export const CustomDivider: Story = {
	args: {
		divider: '›',
		color: 'primary',
		items: [
			{
				title: 'Accueil',
				disabled: false,
				href: '#',
			},
			{
				title: 'Catégorie',
				disabled: false,
				href: '#',
			},
			{
				title: 'Sous-catégorie',
				disabled: false,
				href: '#',
			},
			{
				title: 'Page actuelle',
				disabled: true,
			},
		],
	},
}

export const Disabled: Story = {
	args: {
		items: [
			{
				title: 'Accueil',
				href: '#',
				disabled: true,
			},
			{
				title: 'Catégorie',
				href: '#',
				disabled: true,
			},
			{
				title: 'Page actuelle',
			},
		],
	},
}

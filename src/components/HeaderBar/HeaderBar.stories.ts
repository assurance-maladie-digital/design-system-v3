import type { Meta, StoryObj } from '@storybook/vue3'

import HeaderBar from './HeaderBar.vue'

const meta = {
	title: 'Components/HeaderBar',
	component: HeaderBar,
	argTypes: {
		'serviceTitle': {
			control: { type: 'text' },
			description: 'Le nom du service tel qu\'il sera affiché a coté du logo.',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'serviceSubtitle': {
			control: { type: 'text' },
			description: 'Le sous-titre du service.',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'homeAriaLabel': {
			control: { type: 'text' },
			description: 'Le texte de l\'attribut aria-label pour le logo du header.',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'Logo de l\'Assurance Maladie, cliquez pour revenir à l\'accueil',
				},
			},
		},
		'sticky': {
			control: { type: 'boolean' },
			description: 'Si le header doit rester collé en haut de la page lors du scroll.',
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		'hideWhenDown': {
			control: { type: 'boolean' },
			description: 'Si le header doit se cacher lors du scroll vers le bas en mode mobile. \n Cette propriété est ignorée en mode desktop. \n Présuppose que le header est en mode sticky.',
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		'prepend': {
			control: { type: 'text' },
			table: {
				type: {
					summary: '{ menu-open: boolean }',
				},
			},
		},
		'append': {
			control: { type: 'text' },
			table: {
				type: {
					summary: '{ menu-open: boolean }',
				},
			},
		},
		'menu': {
			control: { type: 'text' },
			table: {
				type: {
					summary: '{ menu-open: boolean }',
				},
			},
		},
		'logo': {
			control: { type: 'text' },
			table: {
				type: {
					summary: `{ 
						menu-open: boolean,
						home-aria-label: string,
						service-title: string,
						service-subtitle: string,
					}`,
				},
			},
		},
		'header-side': {
			control: { type: 'text' },
			table: {
				type: {
					summary: '{ menu-open: boolean }',
				},
			},
		},
	},
} satisfies Meta<typeof HeaderBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubtitle: 'Design System',
	},
}

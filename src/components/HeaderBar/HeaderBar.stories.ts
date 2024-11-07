import type { Meta, StoryObj } from '@storybook/vue3'

import HeaderBar from './HeaderBar.vue'
import { VBtn } from 'vuetify/components'
import { mdiMagnify } from '@mdi/js'

const meta = {
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
					summary:
						'Logo de l\'Assurance Maladie, cliquez pour revenir à l\'accueil',
				},
			},
		},
		'sticky': {
			control: { type: 'boolean' },
			description:
				'Si le header doit rester collé en haut de la page lors du scroll.',
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		'hideWhenDown': {
			control: { type: 'boolean' },
			description:
				'Si le header doit se cacher lors du scroll vers le bas en mode mobile. \n Cette propriété est ignorée en mode desktop. \n Présuppose que le header est en mode sticky.',
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
		'logo-brand-content': {
			control: { type: 'text' },
			description: 'Le contenu a droite du logo de l\'assurance maladie. Peut être utilisé pour accoler un autre logo par exemple.',
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
			description: 'Contenu a droite du header. Utile pour ajouter un menu secondaire par exemple.',
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
	decorators: [
		() => ({
			template: `<div class="position: relative"><story/></div>`,
		}),
	],
}

export const WithRightMenu: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubtitle: 'Design System',
	},
	render: (args) => {
		return {
			components: { HeaderBar, VBtn },
			setup() {
				const searchIcon = mdiMagnify
				return { args, searchIcon }
			},
			template: `<div class="position: relative">
				<HeaderBar v-bind="args">
					<template #header-side="{ menuOpen }">
						<div class="d-flex justify-center h-100 ga-4 pr-4">
							<VBtn
								variant="text"
								:prepend-icon="searchIcon"
								color="primary"
							>
								Rechercher
							</VBtn>
							<VBtn
								color="primary"
								:prepend-icon="mdiAccountCircleOutline"
							>
								Login
							</VBtn>
						</div>
					</template>
				</HeaderBar>
			</div>`,
		}
	},
}

export const Sticky: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubtitle: 'Design System',
	},
	decorators: [
		() => ({
			template: `<div class="position: relative">
			<story/>
			<div
				style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
			>Contenu de la page</div>
	</div>`,
		}),
	],
}

export const WithExternalTopMenu: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubtitle: 'Design System',
	},
	decorators: [
		() => ({
			template: `
			<div class="position: relative">
				<div style="background-color: orange; margin:auto; max-width: 1712px; padding: 1rem 4rem">
					Menu supérieur externe au composant
				</div>
				<story/>
				<div
					style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
				>Contenu de la page</div>
			</div>`,
		}),
	],
}

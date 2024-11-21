import type { Meta, StoryObj } from '@storybook/vue3'

import HeaderNavbar from './HeaderNavbar.vue'
import { VBtn } from 'vuetify/components'
import BackBtn from '../BackBtn/BackBtn.vue'

const meta = {
	title: 'Composants/Structure/HeaderBar/HeaderNavbar',
	component: HeaderNavbar,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		'items': {
			control: { type: 'object' },
			description: 'Liste des items de navigation.',
			table: {
				type: {
					summary: 'Array<...>',
					detail: 'Array<{ label: string, href?: string, to?: string }>',
				},
			},
		},
		'logo': {
			control: { type: 'text' },
			description: 'Remplacer le logo.',
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
		'navigation-bar-prepend': {
			control: { type: 'text' },
			description: 'Contenu a gauche de la barre de navigation (desktop).',
			table: {
				type: {
					summary: '{}',
				},
			},
		},
		'navigation-bar-append': {
			control: { type: 'text' },
			description: 'Contenu a droite de la barre de navigation (desktop).',
			table: {
				type: {
					summary: '{}',
				},
			},
		},
		'navigation-bar-content': {
			control: { type: 'text' },
			description: 'Remplace le contenu de la barre de navigation (desktop).',
			table: {
				type: {
					summary: '{}',
				},
			},
		},
		'navigation-menu-prepend': {
			control: { type: 'text' },
			description: 'Contenu en haut du menu de navigation (mobile).',
			table: {
				type: {
					summary: '{ menu-open: boolean }',
				},
			},
		},
		'navigation-menu-append': {
			control: { type: 'text' },
			description: 'Contenu en bas du menu de navigation (mobile).',
			table: {
				type: {
					summary: '{ menu-open: boolean }',
				},
			},
		},
		'navigation-menu-content': {
			control: { type: 'text' },
			description: 'Remplace le contenu du menu de navigation (mobile). Utiliser les composants `HeaderMenuSection` et `HeaderMenuItem`.',
			table: {
				type: {
					summary: '{ menu-open: boolean }',
				},
			},
		},
	},
} satisfies Meta<typeof HeaderNavbar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		items: [
			{
				label: 'Home',
				href: '/',
			},
			{
				label: 'About',
				href: '/about',
			},
		],
	},
}

export const WithScroll: Story = {
	args: {
		items: [
			{
				label: 'Home',
				href: '/',
			},
			{
				label: 'About',
				href: '/about',
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
				href: '/',
			},
			{
				label: 'About',
				href: '/about',
			},
			{
				label: 'Services',
				href: '/services',
			},
			{
				label: 'Contact',
				href: '/contact',
			},
			{
				label: 'Blog',
				href: '/blog',
			},
			{
				label: 'Portfolio',
				href: '/portfolio',
			},
			{
				label: 'Team',
				href: '/team',
			},
			{
				label: 'Careers',
				href: '/careers',
			},
		],
	},
}

export const WithSlots: Story = {
	args: {
		...Default.args,
	},
	render: (args) => {
		return {
			components: { HeaderNavbar, VBtn, BackBtn },
			setup() {
				return { args }
			},
			template: `
				<HeaderNavbar v-bind="args">
					<template #logo-brand-content>
						<svg
							width="22"
							height="64"
							fill="#0c419a"
							role="img"
							focusable="false"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 22 64"
						>
							<path d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z" />
						</svg>
						<img
							src="/logo-msa.svg"
							alt="MSA : Santé, Famille, Retraite, Services"
							width="115px"
							height="52px"
						/>
					</template>
					<template #navigation-bar-prepend>
						<BackBtn
							dark="true"
							class="mr-4"
						/>
					</template>
					<template #navigation-bar-append>
						<VBtn
							variant="tonal"
							color="white"
						>
							Besoin d’aide ?
						</VBtn>
					</template>
					<template #navigation-menu-append>
						<VBtn
							variant="tonal"
							color="primary"
							class="my-12 mx-8"
						>
							Besoin d’aide ?
						</VBtn>
					</template>
				</HeaderNavbar>
			`,
		}
	},

}

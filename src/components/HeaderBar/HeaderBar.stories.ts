import type { Meta, StoryObj } from '@storybook/vue3'

import HeaderBar from './HeaderBar.vue'
import { VBtn } from 'vuetify/components'
import { mdiMagnify, mdiAccountCircleOutline } from '@mdi/js'
import SubHeader from '../SubHeader/SubHeader.vue'
import LogoBrandSection from '../LogoBrandSection/LogoBrandSection.vue'

const meta = {
	component: HeaderBar,
	parameters: {
		layout: 'fullscreen',
	},
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
		'homeLink': {
			control: { type: 'object' },
			description: 'Le lien de retour vers la home. Renseigner soit `href` soit `to` pour avoir un lien de type `<a>` ou `<router-link>`.',
			table: {
				type: {
					summary: `{
						href?: string,
						to?: RouteLocationRaw,
						ariaLabel?: string,
					}`,
				},
				defaultValue: {
					summary: `{ href: '/' }`,
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderBar
						service-title="Synapse"
						service-subtitle="Design System"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBar } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
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
				const accountIcon = mdiAccountCircleOutline
				return { args, searchIcon, accountIcon }
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
								:prepend-icon="accountIcon"
							>
								Login
							</VBtn>
						</div>
					</template>
				</HeaderBar>
			</div>`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderBar
						service-title="Synapse"
						service-subtitle="Design System"
					>
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
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBar } from '@cnamts/synapse'
					import { VBtn } from 'vuetify/components'
					import { mdiMagnify, mdiAccountCircleOutline } from '@mdi/js'
				</script>
				`,
			},
		],
	},
}

export const CustomLogo: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubtitle: 'Design System',
		sticky: false,
	},
	render: (args) => {
		return {
			components: { HeaderBar, LogoBrandSection },
			setup() {
				const logo = {
					menuOpen: false,
					homeAriaLabel: 'Logo de l\'Assurance Maladie, cliquez pour revenir à l\'accueil',
					serviceTitle: 'Synapse',
					serviceSubtitle: 'Design System',
				}
				return { args, logo }
			},
			template: `
				<HeaderBar v-bind="args">
					<template #logo-brand-content="{ menuOpen }">
						<svg data-v-7f5c1754="" width="22" height="64" fill="#0c419a" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 64" class="vd-divider"><path data-v-7f5c1754="" d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z"></path></svg>
						<img
							src="/ameli.svg"
							alt="Logo de ameli.fr"
						>
					</template>
				</HeaderBar>
				<br>
				<HeaderBar v-bind="args">
					<template #logo-brand-content="{ menuOpen }">
						<svg data-v-7f5c1754="" width="22" height="64" fill="#0c419a" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 64" class="vd-divider"><path data-v-7f5c1754="" d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z"></path></svg>
						<img
							src="/ameli-pro.svg"
							alt="Logo de ameli-pro"
						>
					</template>
				</HeaderBar>
				<br>
				<HeaderBar v-bind="args">
					<template #logo-brand-content="{ menuOpen }">
						<svg data-v-7f5c1754="" width="22" height="64" fill="#0c419a" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 64" class="vd-divider"><path data-v-7f5c1754="" d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z"></path></svg>
						<img
							src="/cnam.svg"
							alt="Logo de la CPAM"
						>
					</template>
				</HeaderBar>
				<br>
				<HeaderBar v-bind="args">
					<template #logo-brand-content="{ menuOpen }">
						<svg data-v-7f5c1754="" width="22" height="64" fill="#006386" role="img" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 64" class="vd-divider"><path data-v-7f5c1754="" d="M14.3 49.3c-.2 0-.4-.2-.4-.4V14.2c0-.2.2-.4.4-.4.3 0 .5.2.5.4v34.7c0 .2-.2.4-.5.4Z"></path></svg>
						<img
							src="/compte-ameli.svg"
							alt="Logo du compte ameli"
						>
					</template>
				</HeaderBar>
				<br>
				<HeaderBar v-bind="args">
					<template #logo="{ menuOpen }">
						<svg data-v-7f5c1754="" fill="#0c419a" aria-label="l’Assurance Maladie: Risques Professionnels" width="211" height="64" viewBox="0 0 211 64" role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" aria-hidden="false" class=""><path fill="#cd545b" d="M68 55.8h2.8a3 3 0 0 1 2 .6c.5.4.8 1 .8 1.8 0 .6-.2 1-.4 1.4-.2.4-.6.6-1 .9l1.8 3.3h-1.5l-1.6-3h-1.6v3H68zm2.6 3.8c.5 0 1 0 1.2-.3.2-.3.4-.6.4-1 0-1-.6-1.4-1.6-1.4h-1.3v2.7zm4.5-3.8h1.3v8H75zm5.4 8.2a6.5 6.5 0 0 1-2.7-.6L78 62c1 .5 1.9.7 2.7.7.4 0 .8 0 1-.2.3-.2.4-.5.4-.8 0-.3 0-.5-.2-.6-.1-.2-.3-.3-.6-.4l-1.1-.5a7 7 0 0 1-1.3-.5l-.8-.7a2 2 0 0 1-.2-1.1c0-.7.2-1.2.7-1.6.5-.4 1.2-.6 2.1-.6a6.1 6.1 0 0 1 2.6.5l-.2 1.3-1.2-.4c-.4-.2-.8-.2-1.2-.2a2 2 0 0 0-1.1.2c-.2.2-.4.4-.4.7 0 .3 0 .5.2.6l.5.4 1 .3c1 .3 1.6.6 2 1 .5.4.7 1 .7 1.6 0 .6-.3 1.2-.7 1.6-.5.4-1.3.7-2.4.7zm11.7-4.2c0 1-.3 2-.8 2.7l.7.7-.8.8-.7-.7a4 4 0 0 1-2.3.7 4 4 0 0 1-2-.6c-.7-.3-1.1-.8-1.5-1.4-.3-.6-.5-1.4-.5-2.2 0-.8.2-1.6.5-2.2.4-.6.8-1 1.4-1.4a4 4 0 0 1 2-.5 4 4 0 0 1 2.1.5c.6.3 1 .8 1.4 1.4.3.6.5 1.4.5 2.2zm-4 2.9c.6 0 1-.1 1.4-.4l-1-.9.8-.8 1 .9c.3-.5.4-1 .4-1.7 0-.8-.2-1.5-.7-2-.4-.6-1-.9-1.8-.9s-1.5.3-2 .8c-.4.6-.6 1.3-.6 2.1 0 .9.2 1.6.7 2 .4.6 1 .9 1.9.9zm8.5 1.3c-1 0-1.9-.4-2.4-1-.6-.6-.9-1.5-.9-2.6v-4.6h1.3V60c0 .9.2 1.6.5 2 .2.5.8.7 1.5.7.8 0 1.3-.2 1.6-.7.3-.4.4-1.1.4-2v-4.2h1.3v4.6c0 1.1-.2 2-.8 2.6-.5.6-1.4 1-2.5 1zm5-8.2h5v1.3h-3.6v2h2.9v1.2h-3v2.2h3.9v1.3h-5.2zm8.8 8.2a6.5 6.5 0 0 1-2.7-.6l.2-1.4c1 .5 1.9.7 2.7.7.4 0 .8 0 1-.2.3-.2.4-.5.4-.8 0-.3 0-.5-.2-.6-.1-.2-.3-.3-.6-.4l-1.1-.5a7 7 0 0 1-1.3-.5l-.8-.7a2 2 0 0 1-.2-1.1c0-.7.2-1.2.7-1.6.5-.4 1.2-.6 2.1-.6a6.1 6.1 0 0 1 2.6.5l-.2 1.3-1.3-.4c-.3-.2-.7-.2-1.1-.2a2 2 0 0 0-1.1.2c-.3.2-.4.4-.4.7 0 .3 0 .5.2.6l.5.4 1 .3c1 .3 1.6.6 2 1 .5.4.7 1 .7 1.6 0 .6-.3 1.2-.7 1.6-.5.4-1.3.7-2.4.7zm6.9-8.2h2.7c1.9 0 2.8.9 2.8 2.6 0 .9-.2 1.5-.7 2-.5.4-1.2.6-2 .6h-1.5v2.8h-1.3zm2.6 4c.5 0 1 0 1.2-.3.2-.2.4-.6.4-1 0-.6-.2-1-.4-1.2-.3-.2-.7-.4-1.2-.4h-1.3v3zm4-4h2.9a3 3 0 0 1 2 .6c.5.4.7 1 .7 1.8 0 .6-.1 1-.3 1.4l-1 .9 1.7 3.3h-1.5l-1.5-3h-1.6v3h-1.3zm2.6 3.8c.6 0 1 0 1.2-.3.3-.3.4-.6.4-1 0-1-.5-1.4-1.6-1.4h-1.2v2.7zm8 4.4a4 4 0 0 1-2-.6c-.6-.3-1.1-.8-1.5-1.4-.3-.6-.5-1.4-.5-2.2 0-.8.2-1.6.5-2.2.4-.6.9-1 1.4-1.4a4 4 0 0 1 2-.5 4 4 0 0 1 2.1.5c.6.3 1 .8 1.4 1.4.3.6.5 1.4.5 2.2 0 .8-.2 1.6-.5 2.2-.3.6-.8 1.1-1.4 1.4a4 4 0 0 1-2 .6zm0-1.3c.8 0 1.4-.3 1.9-.8.4-.5.6-1.2.6-2 0-1-.2-1.6-.6-2.2-.5-.5-1.1-.8-2-.8-.7 0-1.4.3-1.8.8-.4.6-.7 1.3-.7 2.1 0 .9.3 1.6.7 2 .4.6 1 .9 1.9.9zm5.2-6.9h5v1.3h-3.6v2h2.7v1.2h-2.7v3.5h-1.4zm6 0h5v1.3h-3.6v2h2.8v1.2h-2.8v2.2h3.7v1.3h-5zm8.7 8.2a6.5 6.5 0 0 1-2.6-.6l.2-1.4c1 .5 1.9.7 2.7.7.4 0 .8 0 1-.2.3-.2.4-.5.4-.8 0-.3 0-.5-.2-.6l-.6-.4-1.2-.5a7 7 0 0 1-1.2-.5l-.8-.7a2 2 0 0 1-.3-1.1c0-.7.3-1.2.8-1.6.5-.4 1.2-.6 2.1-.6a6.1 6.1 0 0 1 2.5.5v1.3l-1.4-.4c-.4-.2-.8-.2-1.2-.2a2 2 0 0 0-1 .2c-.3.2-.4.4-.4.7 0 .3 0 .5.2.6l.5.4 1 .3c1 .3 1.6.6 2 1 .4.4.7 1 .7 1.6 0 .6-.3 1.2-.8 1.6-.4.4-1.2.7-2.4.7zm6.7 0a6.5 6.5 0 0 1-2.7-.6l.2-1.4c1 .5 1.9.7 2.7.7.4 0 .8 0 1-.2.3-.2.4-.5.4-.8 0-.3 0-.5-.2-.6-.1-.2-.3-.3-.6-.4l-1.1-.5a7 7 0 0 1-1.3-.5l-.7-.7a2 2 0 0 1-.3-1.1c0-.7.2-1.2.7-1.6.5-.4 1.2-.6 2.2-.6a6.1 6.1 0 0 1 2.5.5l-.2 1.3-1.2-.4c-.4-.2-.8-.2-1.2-.2a2 2 0 0 0-1 .2c-.3.2-.5.4-.5.7l.2.6.5.4 1 .3c1 .3 1.6.6 2 1 .5.4.7 1 .7 1.6 0 .6-.3 1.2-.7 1.6-.5.4-1.3.7-2.4.7zm4.3-8.2h1.3v8h-1.3zm6.6 8.2a4 4 0 0 1-2-.6c-.6-.3-1.1-.8-1.4-1.4-.4-.6-.6-1.4-.6-2.2 0-.8.2-1.6.6-2.2.3-.6.8-1 1.4-1.4a4 4 0 0 1 2-.5 4 4 0 0 1 2 .5c.6.3 1 .8 1.4 1.4.4.6.5 1.4.5 2.2 0 .8-.1 1.6-.5 2.2-.3.6-.8 1.1-1.4 1.4a4 4 0 0 1-2 .6zm0-1.3c.8 0 1.4-.3 1.9-.8.4-.5.6-1.2.6-2 0-1-.2-1.6-.6-2.2-.5-.5-1.1-.8-2-.8-.7 0-1.4.3-1.8.8-.4.6-.7 1.3-.7 2.1 0 .9.3 1.6.7 2 .4.6 1 .9 1.9.9zm5.2-6.9h1.4l3.6 5.5v-5.5h1.3v8h-1l-4-5.8v5.8h-1.3zm8 0h1.4l3.6 5.5v-5.5h1.4v8h-1.1l-3.9-5.8v5.8h-1.3zm8.2 0h5v1.3h-3.7v2h2.9v1.2h-2.9v2.2h3.8v1.3h-5.1zm6.4 0h1.3v6.8h3.4v1.2H200zm8 8.2a6.5 6.5 0 0 1-2.6-.6l.1-1.4c1 .5 1.9.7 2.7.7.4 0 .8 0 1-.2.3-.2.4-.5.4-.8 0-.3 0-.5-.2-.6-.1-.2-.3-.3-.6-.4l-1.1-.5a7 7 0 0 1-1.2-.5c-.4-.2-.6-.4-.8-.7a2 2 0 0 1-.3-1.1c0-.7.2-1.2.7-1.6.5-.4 1.2-.6 2.2-.6a6.1 6.1 0 0 1 2.5.5l-.1 1.3-1.3-.4c-.4-.2-.8-.2-1.2-.2a2 2 0 0 0-1 .2c-.3.2-.4.4-.4.7l.1.6.6.4 1 .3c.9.3 1.5.6 2 1 .4.4.6 1 .6 1.6 0 .6-.2 1.2-.7 1.6-.5.4-1.3.7-2.4.7z"></path><g role="presentation" aria-hidden="true"><path d="m3.3 32.3-.4-.4c.1-.3.3-.5.3-.8 0-.3 0-.4-.2-.4s-.3.1-.4.4l-.2.4c-.1.3-.4.6-.8.6-.5 0-.9-.5-.8-1.1 0-.4.1-.7.4-1l.4.4a1 1 0 0 0-.3.6c0 .2.1.4.3.4.2 0 .2-.2.4-.4l.1-.4c.2-.3.5-.6.9-.5.5 0 .9.5.8 1.2 0 .2-.2.7-.5 1Z"></path><path d="M.5 28 0 27l.5-.2.4.9-.4.2Zm.4.6.3-1.8h.5L1.6 28h.6l.1-1 .6.1-.1 1 .6.2.2-1.3.6.1-.3 2-3-.5Z"></path><path d="M2.8 26c-1-.3-1.4-1-1.2-1.8l.6-.8.3.5c-.1.1-.3.2-.3.5-.1.4.2.8.7.9.6.1 1 0 1.2-.5 0-.2 0-.4-.2-.6l.5-.3c.2.4.3.7.2 1-.1.9-.8 1.3-1.8 1Z"></path><path d="m3.7 22.8-1.5-.5.3-.7 1.6.6c.5.2.8.1.9-.2.1-.3 0-.6-.5-.8l-1.6-.6.2-.6 1.5.6c1 .3 1.2.9 1 1.6-.4.8-1 1-1.9.6Z"></path><path d="m3.7 18.6.5-1c.3-.6.7-1 1.4-.6.6.3.6.9.3 1.5l-.2.3 1 .5-.3.6-2.7-1.3Zm1.7-.3c.2-.3.1-.6-.2-.7-.2-.2-.4 0-.6.3l-.1.3.7.4.2-.3Zm.3.2-.2-.6h2l-.4.6H5.7Z"></path><path d="m5.4 15.3.4-.6 2.5 1.7-.3.5-2.6-1.6Z"></path><path d="m7.3 13.5-.5.7-.4-.4 1.4-1.9.5.4-.6.7 2 1.4-.4.6-2-1.5Z"></path><path d="m8.5 11 1.3-1.3.5.4-.9.8.5.4.7-.7.4.4-.7.7.5.5.9-1 .4.5-1.3 1.4-2.3-2Zm.1-.7v-1h.7l-.2 1h-.5Z"></path><path d="M13.6 9.7v-.6c.3 0 .6 0 .8-.2.2-.2.3-.4.2-.5-.2-.2-.3-.1-.6 0h-.4c-.4.2-.7.1-1-.2-.3-.4-.2-1 .3-1.4.3-.2.6-.3 1-.3v.6a1 1 0 0 0-.7.1c-.1.2-.2.4-.1.5h.6l.4-.1c.4-.1.7-.1 1 .3.2.4.2 1-.4 1.4-.3.3-.7.4-1 .4Z"></path><path d="M15.5 6.8c-.5-.8-.4-1.6.3-2 .7-.5 1.5-.2 2 .6s.3 1.6-.4 2c-.6.5-1.4.2-2-.6Zm1.7-1c-.3-.6-.7-.7-1-.5-.4.2-.5.6-.1 1.1.3.6.7.8 1 .6.4-.3.4-.7.1-1.2Z"></path><path d="M18.7 5c-.5-1 0-1.8.6-2.1.4-.2.7-.1 1 0l-.2.5h-.6c-.3.2-.5.7-.2 1.2.2.6.7.8 1 .6.3-.1.4-.3.5-.5l.5.2c-.1.4-.3.7-.7.8-.7.3-1.5.1-2-.8Z"></path><path d="m21.4 2.1.6-.2 1 2.8-.6.2-1-2.8Z"></path><path d="M24 1.2 25 1l1.7 2.7-.7.1-.8-1.3-.4-1v2.7l-.7.2V1.2Zm.2 1.8 1.4-.4.2.5-1.4.4-.2-.5Z"></path><path d="m26.9.5.7-.1.3 2.4 1.2-.2v.6l-1.8.3-.4-3Z"></path><path d="m29.8.1 2-.1v.6h-1.2v.7l1-.1v.6h-1v.7H32V3l-1.9.1-.2-3Z"></path></g><g><path d="M100.1 45V30.6h3.8v14.6c0 .8.4 1 .7 1h.5l.5 2.9a5 5 0 0 1-2 .3c-2.6 0-3.5-1.7-3.5-4.4Z"></path><path d="m75.7 40.4 3.8-8.5h4V49h-3.6V38.4l-3 7.8h-2.4l-3-7.8v10.7H68V32h4l3.8 8.5Z"></path><path d="M107.1 45.5c0-2.8 2.3-4.3 7.4-4.9 0-1.1-.8-1.8-2.2-1.8-1 0-2.1.4-3.4 1.2l-1.3-2.6c1.6-1 3.5-1.7 5.5-1.7 3.3 0 5 1.9 5 5.9V49h-3.5v-1.3s-1.5 1.6-3.6 1.6c-2.4 0-3.9-1.7-3.9-4Zm7.4-.3V43c-2.7.3-3.7 1.2-3.7 2.2 0 .8.5 1.2 1.5 1.2.8 0 1.5-.5 2.2-1.2Z"></path><path d="M86.1 45.5c0-2.8 2.3-4.3 7.4-4.9 0-1.1-.8-1.8-2.2-1.8-1 0-2.1.4-3.4 1.2l-1.3-2.6c1.6-1 3.5-1.7 5.5-1.7 3.3 0 5 1.9 5 5.9V49h-3.5v-1.3S92 49.4 90 49.4c-2.4 0-3.9-1.7-3.9-4Zm7.4-.3V43c-2.7.3-3.7 1.2-3.7 2.2 0 .8.6 1.2 1.5 1.2.8 0 1.6-.5 2.2-1.2Z"></path><path d="M129 30.6v6.3a4.1 4.1 0 0 0-3.2-1.2c-2.7 0-5.3 2.6-5.3 6.8 0 4.3 2 7 5.2 7 1.8 0 3.1-1.4 3.2-1.5v1.1h3.8V30.6H129Zm-2.3 15.7c-1.5 0-2.4-1.2-2.4-3.8 0-2.5 1.1-3.6 2.4-3.6.6 0 1.4.2 2.2.8v5.4c-.7.8-1.4 1.2-2.2 1.2Z"></path><path d="M135.7 32c0-1.2 1-2 2.2-2 1.2 0 2.2.8 2.2 2s-1 2-2.2 2c-1.3 0-2.2-.8-2.2-2Zm.3 4h3.8V49H136V36Z"></path><path d="M142.2 42.5c0-4.2 2.6-6.8 5.9-6.8 3.6 0 5.6 2.7 5.6 6.3l-.1 1.7h-7.7c.3 2 1.6 2.8 3.3 2.8 1 0 1.8-.4 2.8-1l1.3 2.5c-1.3.9-3 1.4-4.6 1.4-3.8 0-6.5-2.5-6.5-6.9Zm8.3-1.4c0-1.4-.9-2.5-2.4-2.5-1.2 0-2 .9-2.3 2.5h4.7Z"></path><path d="M68 23.3V8.8h3.7v14.7c0 .8.4 1 .7 1h.5l.4 2.9a5 5 0 0 1-1.9.3c-2.6 0-3.5-1.7-3.5-4.4Z"></path><path d="m88.1 23.3 1 4.1h4l-5.3-17.3h-4.4l-5.3 17.3h4l1-4.1h5Zm-4.2-3 1.6-6.6h.2l1.6 6.5H84Z"></path><path d="m93.9 25.9 1.7-2.4c1.1.9 2.2 1.3 3.3 1.3 1.1 0 1.6-.4 1.6-1 0-1-1.2-1.4-2.6-1.9-1.6-.6-3.4-1.7-3.4-3.8 0-2.5 2-4.2 5-4.2 1.9 0 3.4.8 4.5 1.7l-1.7 2.4c-1-.7-1.8-1.2-2.8-1.2-1 0-1.4.4-1.4 1 0 1 1.2 1.2 2.5 1.7 1.6.7 3.5 1.6 3.5 4s-1.9 4.2-5.3 4.2c-1.7 0-3.6-.7-5-1.8Z"></path><path d="m105.3 25.9 1.7-2.4c1.1.9 2.2 1.3 3.3 1.3 1.1 0 1.6-.4 1.6-1 0-1-1.2-1.4-2.6-1.9-1.6-.6-3.4-1.7-3.4-3.8 0-2.5 2-4.2 5-4.2 1.9 0 3.4.8 4.5 1.7l-1.7 2.4c-1-.7-1.8-1.2-2.8-1.2-1 0-1.4.4-1.4 1 0 1 1.2 1.2 2.5 1.7 1.6.7 3.5 1.6 3.5 4s-1.9 4.2-5.3 4.2c-1.7 0-3.6-.7-5-1.8Z"></path><path d="M132.2 14.3h3.8V16c.8-1.4 2.5-2 3.4-2 .8 0 1.2.2 1.6.3l-.4 3.6c-.5-.2-1.1-.4-1.7-.4-1.5 0-2.8 1.3-2.9 3v6.8h-3.8V14.3Z"></path><path d="M155.7 14.3h3.8v1.6c1-1 2.2-2 4-2 2.7 0 4 2 4 5.3v8.2h-3.9v-7.7c0-1.9-.5-2.5-1.6-2.5-1 0-1.6.5-2.5 1.3v8.8h-3.8v-13Z"></path><path d="M180.6 20.8c0-4.3 2.7-6.9 5.9-6.9 3.7 0 5.7 2.8 5.7 6.3 0 .7 0 1.4-.2 1.8h-7.7c.4 1.9 1.7 2.8 3.4 2.8 1 0 1.8-.4 2.7-1l1.3 2.4c-1.3 1-3 1.5-4.6 1.5-3.7 0-6.5-2.5-6.5-6.9Zm8.4-1.4c0-1.4-.9-2.5-2.4-2.5-1.2 0-2 .8-2.3 2.5h4.7Z"></path><path d="M141.8 23.7c0-2.7 2.3-4.3 7.4-4.8 0-1.2-.8-1.9-2.2-1.9a7 7 0 0 0-3.4 1.2l-1.3-2.5c1.6-1 3.4-1.8 5.5-1.8 3.3 0 5 2 5 6v7.5h-3.6V26s-1.4 1.6-3.5 1.6c-2.4 0-4-1.7-4-4Zm7.4-.2v-2.3c-2.7.4-3.8 1.3-3.8 2.3 0 .8.6 1.2 1.5 1.2s1.7-.5 2.3-1.2Z"></path><path d="M76.7 8.8c-.8 0-1.9.6-1.9 1.7 0 1 .8 1.5 1.6 1.5 0 1.2-1 1.8-1.5 2.1l1 1.4c3.3-1 4-6.7.8-6.7Z"></path><path d="M125.3 14.3V23c-.8 1-1.4 1.4-2.3 1.4-1 0-1.6-.6-1.6-2.5v-7.6h-3.8v8.3c0 3 1.4 5.1 4 5.1 2.5 0 3.8-1.6 3.8-1.6v1.3h3.7V14.3h-3.8Z"></path><path d="M176.3 24.6c-1.7 0-3-1.5-3-3.7 0-2.3 1.3-3.8 3-3.8.6 0 1.1.2 1.7.7l1.8-2.5c-.9-.8-2.1-1.3-3.7-1.3a6.5 6.5 0 0 0-6.6 6.9c0 4.3 2.7 6.8 6.3 6.8 1.4 0 3-.4 4.2-1.5l-1.4-2.7c-.7.6-1.5 1-2.3 1Z"></path></g><path d="M34.8 9c-.1-.2-.4-.3-.6-.3H34c-.2-.2-5.3 0-6.5.7 0-.8-.4-1.8-1.7-2-1-.3-3.1.7-2.4 2.8 0 .3.3.6.7.8.2 0 .5 0 .7.6h.3l.2.2h.5c.4.4.8-.1 1-.5l.7 2c-.2-.2-1.8-.6-2.5.2s-1.2 1.8-1.7 3.5c-.2.4-.5.7-1 .9-.9.3-.4.7-.2.7a6 6 0 0 0 2 0c.4-.2.1-1 .5-1.4l.8-1c0 .5 0 .8-.3 1.5-.2.7-1 1-1.3 1.3-.4.5.6.5.8.5.7-.2 1-.2 1.3-.4.4-.2.2-.8.3-1 .3-.7 1.4-2 1.6-2.3.8.2 1.7.2 2 .2 1.9-.2 2.3-1.5 2-2.6-.1-1-.7-1.5-.9-1.8l-.9-1.4 3.5-.9c0 .3.3.3.4.4.2.1.3 0 .2-.1a.6.6 0 0 1-.2-.2h.7c.3 0 .4-.4.3-.5Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M61 26.7c-.5-2.6-2.9-4.1-4.1-4.7l-1.4-.4-.4-.2c.1-.5.8-.5 1.2-1.3 1-2.3-1.2-3.8-2.8-3.5-.8.2-1.3.4-1.5 1 0 .4-.3.4-.7.8-.2.2.1.4.2.5l-.1.3v.5s-.3.3 0 .7l.3.8c0 .1 0 .2-.3 0l-3.4-1a37.4 37.4 0 0 1-4.2-4.7c-.7 0 .5 1.3-.1.8-.2 0-.7-.4-.8-.5l-.1-.2-.3-.3H42.2c-.2 0-.1.5 0 .7 0 0 .4 1.2.6 1.4l1.5 1 2.6 3c.7.7 3.8 2.5 3.9 2.6.2 0 .5.8 0 5.5-.1 1.8-1.4 5.6-.8 7.5.4 1.3.9 2.2 1.3 5.6.1.8-.5 1.3-1.3 2l-1.4.8c-.2.2 0 .4.2.5.2 0 .5.3.8.3.3.1.9 0 1.4-.3.7-.3.7-.4 1-.6.5-.3 1-.3 1.2-.8.2-.6-.3-1.4-.3-1.7.4-2.8.9-4.1.2-5.8-.2-.3 1-4 1-3.4.2.9.3 3.8.3 5.9 0 .9.8 4.2 1 5.4.4 1.8-2.6 3.2-2 3.8l1 .3 1-.1c.3-.1.6-.5.7-.6.6-.8.4-.6 1-1.1.4-.5 0-1.4 0-1.8v-2.9c0-1.9 0-2.4.2-3.2l1-6.2s.2 0 .3-.2c.2-.2.1-.5.2-.7 0-.2 0 0 0 0l.2.6-.2.8c-.2.4.1.4.2.5 0 0 1-.7 1.2-1l.1-.8-.2-1.8c.2-.9 1-3.2.8-3.8Zm-2.2 3.6c-.2.5-.2 0-.6 1.7V31.1c0-2.1-1.5-6.5-.6-5.6 0 0 1.2.8 1.4 1.4.2.5.1 1.8-.2 3.4Z"></path><path d="M20 35.3c-.3-.3-1.6-2-2.4-2.7l-1-1.5c-1.6-2-1.9-2.1-3-2.2-.1-.2 0-.3 0-.4 1.3-.5.9-1.6.8-1.7l.2-.6-.2-1-.1-.7c-.8-.9-2.6-.9-3.5-.3-.8.5-.3.9-.6 1.6-.1.5 0 .9.3 1.2 0 .3.8.7.7 1.2-.2.6-1 .7-1 .7l-.3.1c-1.4.8-2.7 2-2.9 3.2 0 1 1.7 2.5 2.7 3.3.1 1.7 1.2 4.4 1.3 4.5.1.3-.3-.3-1.4-.7-.6-.1-1.2-.9-1.4 0 0 .4 0 1-.3 1.8-.2.6 0 1.5.7 1.5.5 0 .8-1.4.8-1.4s2.3 1 3.3.7c.7-.2.8-2.7.2-5-.2-.8.4 1.3 2 3.1.2.4 0 .7.2 2.2v1c0 .7-.7 1.6.9 2 1.6.4 1.5.8 2.5.1.5-.3-1.4-.5-1.8-1.6v-.2c0-.9.3-2.9.2-3.6-.6-3.4-2-5-2.2-5.8 0-2.4-.2-3.2 0-2.6l1 1.5.3.3.4.4 2.8 2.1s.1 1 .6 1c.4 0 2.3-1 2.2-1.1 0-.3-2-.3-2-.4ZM9.7 34l-1-1.8c.4-.7 1-1 1-.9.2 0 0 2.7 0 2.7Z"></path><path d="M51.8 54.8c-.1 0-1.2-.5-2.2-2-.5-.8-3.8-7-4.3-8.2-.9-2.4-8-6.7-8.2-7-.2-.1-.2-.5-.1-.8.5-2 .3-3.8.4-4.1.3-.7.8-1.7.4-2.3l-.7-1.2s3.7 1.4 4.6 1.2c.8-.2 4.5-2.8 4.7-2.9.5-.2 1.8.1 3-1.3.5-.5.2-.6 0-.6.1 0-.1-.2-.4 0-.2.1-1.3.4-1.1.2.8-.5.2-.7.2-.7-.3.3-1.8.7-2.1 1l-.8.5c-.9.5-2.4 1.3-4 1.7-.3 0-3.3-2-5-2.2-1-.1-1.3 0-1.8.1-.6.2-.6-.7 0-1 .2 0 .6-.1.7-.4.2-.4 0-.7 0-.8v-.2l-.1-.1v-.5c.3-.2.2-.4.1-.4-.1-.1-.6-.4-.7-.7 0-.6-.3-.9-.3-1.2 0 0-.1-.8-.4-1-.4-.4-1.2-.8-2.8-.3-.6.1-.5.4-1.8.6-1.6.3-2.4 2.7-2.3 3.7.1.8.8.4.8.7 0 .6-.1 1.5 1 1.8.3 0 1.8-.2 2.4 0 0 0 .5 0 .2.4-.1.2-1.6.9-2 1-1 .4-3.6 4.6-4.3 5-.7.3-1 .6-1.3.8-1 .6-2.1 1.4-2.7 1.4-.7 0-1.4.3-1.9 1.5-.1.3 0 .5.3.5 0 .1.2.3.4.3.2.2.5 0 .7 0l1-.7c.5-.2 4-1.5 4.7-2.1 1.2-.6 3.5-3 4-3s1.6 1 1.2 3c0 .7-1 2-1.4 2.6-1 1.5-.2 2.7-.4 3-1 1.6-2.2 3.7-4.2 5.5-.8.6-2.4.7-3.3 1-2 .5-4.2 2-5.7 2.8-.5.3-1-.3-1.6-.4-.7 0-.7 1-1 1.8l-.7 1.5c-.1.4-.7 1.7-.1 2.2.4.7 1.5-1.4 2.4-2.3.4-.5.7-.7 1.7-1 .6 0 5.6-1.4 8.8-2.2h.3c4.2-1.1 8.6-6.6 8.7-6.6l7.2 3.5c.7.4.7 1.8 1.5 3.4a22 22 0 0 0 4.4 4.9c.4.4 0 1 .2 1.6.2.6.6.6 1.1.6l1.6-.2c.7 0 .5 0 1.3.2.4 0 1.3.1 2-.5 1-1.2-1.2-.6-2.3-1.1Z"></path><path d="M44 51.7a.4.4 0 0 0-.6-.2 22.2 22.2 0 0 1-21-.6.5.5 0 0 0-.6.2c-.1.2 0 .4.1.6a23 23 0 0 0 21.9.5c.2 0 .3-.3.2-.5Z"></path><path d="M12.9 22.9h-.2c-.2-.2-.3-.4-.2-.6 2-4.4 5.2-8 9.3-10.4.2-.1.5 0 .6.2.2.2 0 .4-.1.6-4 2.3-7.1 5.7-9 10l-.4.2Z"></path><path d="M50.3 17.3c-.1 0-.3 0-.3-.2A22 22 0 0 0 36.5 10c-.2 0-.4-.3-.3-.5 0-.3.2-.4.5-.4a23 23 0 0 1 14 7.5v.7h-.4Z"></path></svg>
					</template>
				</HeaderBar>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderBar>
						<template #logo="{ menuOpen }">
							<LogoBrandSection
								theme="ameli"
							>
						</template>
					</HeaderBar>
					<br>
					<HeaderBar>
						<template #logo="{ menuOpen }">
							<LogoBrandSection
								theme="ameli-pro"
							>
						</template>
					</HeaderBar>
					<br>
					<HeaderBar>
						<template #logo="{ menuOpen }">
							<LogoBrandSection
								theme="cnam"
							>
						</template>
					</HeaderBar>
					<br>
					<HeaderBar>
						<template #logo="{ menuOpen }">
							<LogoBrandSection
								theme="compte-ameli"
							>
						</template>
					</HeaderBar>
					<br>
					<HeaderBar>
						<template #logo="{ menuOpen }">
							<LogoBrandSection
								theme="compte-entreprise"
							>
						</template>
					</HeaderBar>
					<br>
					<HeaderBar>
						<template #logo="{ menuOpen }">
							<LogoBrandSection
								theme="risque-pro"
							>
						</template>
					</HeaderBar>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBar, LogoBrandSection } from '@cnamts/synapse'

				</script>
				`,
			},
		],
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderBar
						service-title="Synapse"
						service-subtitle="Design System"
					/>
					<div
						style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
					>Contenu de la page</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBar } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

export const WithExternalTopMenu: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubtitle: 'Design System',
	},
	decorators: [
		() => ({
			template: `
				<div style="margin: auto; max-width: 1712px; display: flex;">
					<div
						style="background-color: #ed76b3; padding: 0.7rem 0.8rem; width: fit-content;"
					>Menu supérieur externe au composant</div>
					<div
						style="padding: 0.7rem 0.8rem; width: fit-content;"
					>Autre lien</div>
				</div>
				<story/>
				<div
					style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
				>Contenu de la page</div>
			`,
		}),
	],
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<div style="margin: auto; max-width: 1712px; display: flex;">
						<div
							style="background-color: #ed76b3; padding: 0.7rem 0.8rem; width: fit-content;"
						>Menu supérieur externe au composant</div>
						<div
							style="padding: 0.7rem 0.8rem; width: fit-content;"
						>Autre lien</div>
					</div>
					<HeaderBar
						service-title="Synapse"
						service-subtitle="Design System"
					/>
					<div
						style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
					>Contenu de la page</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBar } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

export const WithSubHeader: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubtitle: 'Design System',
	},
	render: (args) => {
		return {
			components: { HeaderBar, SubHeader },
			setup() {
				const searchIcon = mdiMagnify
				return { args, searchIcon }
			},
			template: `
				<HeaderBar v-bind="args">
					<template #append="{ menuOpen }">
						<SubHeader
							title-text="Paul Dupont"
							sub-title-text="1 69 08 75 125 456 75"
						/>
					</template>
				</HeaderBar>
				<div
					style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
				>Contenu de la page</div>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<HeaderBar v-bind="args">
						<template #append="{ menuOpen }">
							<SubHeader
								title-text="Paul Dupont"
								sub-title-text="1 69 08 75 125 456 75"
							/>
						</template>
					</HeaderBar>
					<div
						style="height: 200vh; background-color: #f5f5f5; margin: auto; margin-top: 2rem; max-width: 1200px; padding: 1em;"
					>Contenu de la page</div>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { HeaderBar, SubHeader } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

import type { Meta, StoryObj } from '@storybook/vue3'

import HeaderBar from './HeaderBar.vue'
import { VBtn } from 'vuetify/components'
import { mdiMagnify, mdiAccountCircleOutline } from '@mdi/js'
import SubHeader from '../SubHeader/SubHeader.vue'

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

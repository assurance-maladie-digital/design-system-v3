import type { Meta, StoryObj } from '@storybook/vue3'
import LogoBrandSection from './LogoBrandSection.vue'

const meta = {
	title: 'Composants/Données/LogoBrandSection',
	component: LogoBrandSection,
	argTypes: {
		'theme': {
			description: 'Applique un preset de style à la section.',
			control: {
				type: 'select',
			},
			options: [
				'ameli',
				'ameli-pro',
				'cnam',
				'compte-ameli',
				'compte-entreprise',
				'default',
				'risque-pro',
			],
		},
		'serviceTitle': {
			description: 'Le titre du service (titre de niveau 1).',
		},
		'serviceSubTitle': {
			description: 'Le sous-titre du service (titre de niveau 2).',
		},
		'mobileVersion': {
			control: {
				type: 'boolean',
			},
			description: 'Affiche la version mobile.',
		},
		'reduceLogo': {
			control: {
				type: 'boolean',
			},
			description: 'Affiche la version Avatar du logo de l’Assurance Maladie s’il y a une marque secondaire. Sinon, masque la signature.<br> Déprécié, la ronde seule ne devrait plus être utilisée.',
		},
		'homeLink': {
			description: 'Le lien vers la page d’accueil. <br>La valeur `false` permet de désactiver le lien..',
			table: {
				type: {
					summary: '{ href?: string, to?: RouteLocationRaw, ariaLabel?: string }',
				},
				defaultValue: { summary: `{ href: '/'}` },
			},
		},
		'default': {
			control: {
				type: 'text',
			},
			description: 'Slot pour remplacer le contenu et afficher une marque partenaire.',
			table: {
				type: {
					summary: '{}',
				},
			},
		},
		'brand-content': {
			control: {
				type: 'text',
			},
			description: 'Slot pour personnaliser le contenu de la marque.',
			table: {
				type: {
					summary: '{}',
				},
			},
		},
	},
	args: {
		theme: 'default',
	},
} satisfies Meta<typeof LogoBrandSection>

export default meta

type Story = StoryObj<typeof LogoBrandSection>

export const Default: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubTitle: 'Documentation du Design System',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LogoBrandSection
						service-title="Synapse"
						service-sub-title="Documentation du Design System"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { LogoBrandSection } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

export const WithBrand: Story = {
	args: {
		serviceTitle: 'Synapse',
		serviceSubTitle: ' Documentation du Design System',
	},
	render: (args) => {
		return {
			components: { LogoBrandSection },
			setup() {
				return { args }
			},
			template: `
				<LogoBrandSection v-bind="args">
					<img
						src="/logo-msa.svg"
						alt="Logo MSA"
						width="115px"
						height="52px"
						class="ml-8 my-auto"
					/>
				</LogoBrandSection>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<LogoBrandSection>
						<img src="/logo-msa.svg" alt="Logo MSA" width="115px" height="52px" class="ml-8 my-auto">
					</LogoBrandSection>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { LogoBrandSection } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
}

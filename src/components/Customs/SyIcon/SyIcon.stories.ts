import type { Meta, StoryObj } from '@storybook/vue3'
import SyIcon from './SyIcon.vue'
import SyIconAccessibility from './SyIconAccessibility.vue'
import { mdiHome, mdiAlert, mdiStar } from '@mdi/js'

const meta = {
	title: 'Composants/Données/SyIcon',
	component: SyIcon,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	argTypes: {
		icon: {
			control: { type: 'text' },
			description: 'Nom de l\'icône à afficher (format Material Design Icons)',
		},
		label: {
			control: { type: 'text' },
			description: 'Label d\'accessibilité pour l\'icône (utilisé avec decorative=false)',
		},
		decorative: {
			control: { type: 'boolean' },
			description: 'Indique si l\'icône est décorative (true) ou informative (false)',
			default: true,
		},
		color: {
			control: { type: 'text' },
			description: 'Couleur de l\'icône (nom de couleur Vuetify)',
		},
		size: {
			options: ['x-small', 'small', 'default', 'large', 'x-large'],
			control: {
				type: 'select',
			},
			description: 'Taille de l\'icône (x-small, small, default, large, x-large ou valeur en px)',
			default: 'default',
		},
	},
} satisfies Meta<typeof SyIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				language: 'vue',
				code: `
				<template>
					<SyIcon :icon="mdiHome" :decorative="false" label="Accueil"/>
				</template>`,
			},
		],
	},
	args: {
		icon: mdiHome,
		label: 'Accueil',
		decorative: false,
	},
	render: args => ({
		components: { SyIcon },
		setup() {
			return { args, mdiHome }
		},
		template: `
			<div class="pa-4">
				<SyIcon v-bind="args" />
			</div>
		`,
	}),
}

export const WithColor: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				language: 'vue',
				code: `
					<template>
						<SyIcon :icon="mdiAlert" color="error" :decorative="false" label="Alerte" />
					</template>`,
			},
		],
	},
	args: {
		icon: mdiAlert,
		color: 'error',
		label: 'Alerte',
		decorative: false,
	},
	render: args => ({
		components: { SyIcon },
		setup() {
			return { args, mdiAlert }
		},
		template: `
			<div class="pa-4">
				<SyIcon v-bind="args" />
			</div>
		`,
	}),
}

export const WithSize: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				language: 'vue',
				code: `<template>
  <SyIcon :icon="mdiStar" size="x-large" />
</template>`,
			},
		],
	},
	args: {
		icon: mdiStar,
		size: 'x-large',
		decorative: true,
	},
	render: args => ({
		components: { SyIcon },
		setup() {
			return { args, mdiStar }
		},
		template: `
			<div class="pa-4">
				<SyIcon v-bind="args" />
			</div>
		`,
	}),
}

export const AccessibilityDemo: Story = {
	args: {
		icon: mdiStar, // Using an icon from the imported icons
	},
	render: () => ({
		components: { SyIconAccessibility },
		template: '<SyIconAccessibility />',
	}),
}

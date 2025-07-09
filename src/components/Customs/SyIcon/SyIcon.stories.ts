import type { Meta, StoryObj } from '@storybook/vue3'
import SyIcon from './SyIcon.vue'
import SyIconAccessibility from './SyIconAccessibility.vue'
import { mdiHome, mdiAlert, mdiStar, mdiDelete, mdiClose, mdiInformation } from '@mdi/js'

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
		role: {
			options: ['img', 'button', 'presentation'],
			control: {
				type: 'select',
			},
			description: 'Rôle ARIA de l\'icône (img, button, presentation)',
		},
		autoDetectButton: {
			control: { type: 'boolean' },
			description: 'Active la détection automatique du rôle bouton pour les icônes interactives',
			default: false,
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

export const Decorative: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				language: 'vue',
				code: `
					<template>
						<SyIcon :icon="mdiStar" :decorative="true" />
					</template>`,
			},
		],
	},
	args: {
		icon: mdiStar,
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

export const ExplicitButtonRole: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				language: 'vue',
				code: `
					<template>
						<SyIcon 
							:icon="mdiDelete" 
							:decorative="false" 
							role="button" 
							label="Supprimer" 
							@click="handleClick" 
						/>
					</template>`,
			},
		],
	},
	args: {
		icon: mdiDelete,
		decorative: false,
		role: 'button',
		label: 'Supprimer',
	},
	render: args => ({
		components: { SyIcon },
		setup() {
			const handleClick = () => {
				alert('Bouton cliqué !')
			}
			return { args, mdiDelete, handleClick }
		},
		template: `
			<div class="pa-4">
				<SyIcon v-bind="args" @click="handleClick" />
			</div>
		`,
	}),
}

export const AutoDetectButtonRole: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				language: 'vue',
				code: `
					<template>
						<SyIcon 
							:icon="mdiClose" 
							:decorative="false" 
							:auto-detect-button="true" 
							label="Fermer" 
							@click="handleClick" 
						/>
					</template>`,
			},
		],
	},
	args: {
		icon: mdiClose,
		decorative: false,
		autoDetectButton: true,
		label: 'Fermer',
	},
	render: args => ({
		components: { SyIcon },
		setup() {
			const handleClick = () => {
				alert('Fermeture !')
			}
			return { args, mdiClose, handleClick }
		},
		template: `
			<div class="pa-4">
				<SyIcon v-bind="args" @click="handleClick" />
			</div>
		`,
	}),
}

export const InformativeIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				language: 'vue',
				code: `
					<template>
						<SyIcon 
							:icon="mdiInformation" 
							:decorative="false" 
							role="img" 
							label="Information importante" 
						/>
					</template>`,
			},
		],
	},
	args: {
		icon: mdiInformation,
		decorative: false,
		role: 'img',
		label: 'Information importante',
		color: 'info',
	},
	render: args => ({
		components: { SyIcon },
		setup() {
			return { args, mdiInformation }
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

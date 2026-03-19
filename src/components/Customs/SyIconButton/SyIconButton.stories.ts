import type { Meta, StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import SyIconButton from './SyIconButton.vue'
import { mdiClose, mdiAlert, mdiMagnify } from '@mdi/js'

const meta = {
	title: 'Composants/Boutons/SyIconButton',
	component: SyIconButton,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	argTypes: {
		'icon': {
			control: { type: 'text' },
			description: 'Nom de l\'icône à afficher (format Material Design Icons)',
		},
		'label': {
			control: { type: 'text' },
			description: 'Texte accessible obligatoire porté par `aria-label` sur le bouton',
		},
		'color': {
			control: { type: 'text' },
			description: 'Couleur de l\'icône (nom de couleur Vuetify)',
		},
		'size': {
			options: ['x-small', 'small', 'default', 'large', 'x-large'],
			control: {
				type: 'select',
			},
			description: 'Taille du bouton et de l\'icône',
			default: 'default',
		},
		'disabled': {
			control: { type: 'boolean' },
			description: 'Désactive le bouton',
			default: false,
		},
		'onClick-icon-button': {
			action: 'click-icon-button',
			description: 'Événement émis lors du clic sur le bouton',
		},
		'variant': {
			options: ['flat', 'elevated', 'tonal', 'outlined', 'text', 'plain'],
			control: { type: 'select' },
			description: 'Variante visuelle du bouton',
		},
	},
} satisfies Meta<typeof SyIconButton>

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
					<SyIconButton :icon="mdiClose" label="Fermer" @click-icon-button="handleClick" />
				</template>`,
			},
		],
	},
	args: {
		'icon': mdiClose,
		'label': 'Fermer',
		'onClick-icon-button': fn(),
	},
	render: args => ({
		components: { SyIconButton },
		setup() {
			const handleClick = () => {
				alert('Bouton cliqué !')
			}
			return { args, mdiClose, handleClick }
		},
		template: `
			<div class="pa-4">
				<SyIconButton v-bind="args" @click-icon-button="handleClick" />
			</div>
		`,
	}),
}

export const Disabled: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				language: 'vue',
				code: `
				<template>
					<SyIconButton :icon="mdiClose" label="Fermer" :disabled="true" />
				</template>`,
			},
		],
	},
	args: {
		'icon': mdiClose,
		'label': 'Fermer',
		'disabled': true,
		'onClick-icon-button': fn(),
	},
	render: args => ({
		components: { SyIconButton },
		setup() {
			return { args, mdiClose }
		},
		template: `
			<div class="pa-4">
				<SyIconButton v-bind="args" />
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
					<SyIconButton :icon="mdiAlert" label="Alerte" color="red" />
				</template>`,
			},
		],
	},
	args: {
		'icon': mdiAlert,
		'label': 'Alerte',
		'color': 'red',
		'onClick-icon-button': fn(),
	},
	render: args => ({
		components: { SyIconButton },
		setup() {
			return { args, mdiAlert }
		},
		template: `
			<div class="pa-4">
				<SyIconButton v-bind="args" />
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
				code: `
				<template>
					<SyIconButton :icon="mdiMagnify" label="Rechercher" size="small" />
				</template>`,
			},
		],
	},
	args: {
		'icon': mdiMagnify,
		'label': 'Rechercher',
		'size': 'small',
		'onClick-icon-button': fn(),
	},
	render: args => ({
		components: { SyIconButton },
		setup() {
			return { args, mdiMagnify }
		},
		template: `
			<div class="pa-4">
				<SyIconButton v-bind="args" />
			</div>
		`,
	}),
}

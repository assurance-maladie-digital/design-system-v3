import LangBtn from './LangBtn.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { VBtn, VMenu, VList, VListItem, VListItemTitle } from 'vuetify/components'

const meta = {
	title: 'Components/LangBtn',
	component: LangBtn,
	argTypes: {
		'modelValue': {
			control: { type: 'select', options: ['fr', 'en', 'es', 'de', '*'] },
			description: 'La langue sélectionnée actuellement',
		},
		'hideDownArrow': {
			control: { type: 'boolean' },
			description: 'Masquer ou afficher la flèche du bouton',
		},
		'ariaLabel': {
			control: { type: 'text' },
			description: 'L\'étiquette ARIA pour l\'accessibilité',
		},
		'availableLanguages': {
			control: { type: 'array' },
			description: 'Les langues disponibles à choisir',
		},
		'update:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lors de la sélection de langue',
		},
	},
} as Meta<typeof LangBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: 'en',
		hideDownArrow: false,
		ariaLabel: 'Select a language',
		availableLanguages: ['fr', 'co', 'es'],
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div>
					<LangBtn v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

export const AllLanguages: Story = {
	args: {
		modelValue: 'fr',
		hideDownArrow: false,
		ariaLabel: 'Select a language',
		availableLanguages: '*',
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div>
					<LangBtn v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

export const NoDownArrow: Story = {
	args: {
		modelValue: 'fr',
		hideDownArrow: true,
		ariaLabel: 'Select a language',
		availableLanguages: ['fr', 'en', 'de'],
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div>
					<LangBtn v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

import LangBtn from './LangBtn.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import { VBtn, VMenu, VList, VListItem, VListItemTitle } from 'vuetify/components'

const meta: Meta<typeof LangBtn> = {
	title: 'Components/LangBtn',
	component: LangBtn,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['currentLangData', 'updateLang', 'selectedLanguage'] },
	},
	argTypes: {
		modelValue: { control: 'text' },
		hideDownArrow: { control: 'boolean' },
		ariaLabel: { control: 'text' },
		// @ts-expect-error Type '"array"' is not assignable to type 'Control | undefined'.
		availableLanguages: { control: { type: 'array' } },
		vuetifyOptions: {
			constrol: { type: 'object' },
			default: () => ({
				menu: {
					offsetY: true,
				},
				btn: {
					color: 'primary',
					variant: 'outlined',
					ripple: true,
				},
				icon: {
					class: 'ml-1',
				},
			}),
		},
	},
}

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: 'en',
		hideDownArrow: false,
		ariaLabel: 'Select a language',
		availableLanguages: ['fr', 'co', 'es'],
		vuetifyOptions: {
			menu: {
				offsetY: true,
			},
			btn: {
				color: 'primary',
				variant: 'outlined',
				ripple: true,
			},
			icon: {
				class: 'ml-1',
			},
		},
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<LangBtn :vuetify-options="args.vuetifyOptions" v-bind="args" @update:modelValue="args['update:modelValue']" />
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
				<div class="pa-4">
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
				<div class="pa-4">
					<LangBtn v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

export const FlatBtn: Story = {
	args: {
		modelValue: 'fr',
		hideDownArrow: false,
		ariaLabel: 'Select a language',
		availableLanguages: ['fr', 'en', 'de'],
		vuetifyOptions: {
			btn: {
				color: 'primary',
				variant: 'flat',
				ripple: true,
			},
		},
	},
	render: (args) => {
		return {
			components: { LangBtn, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<LangBtn :vuetify-options="args.vuetifyOptions" v-bind="args" @update:modelValue="args['update:modelValue']" />
				</div>
			`,
		}
	},
}

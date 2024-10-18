import type { Meta, StoryObj } from '@storybook/vue3'
import CustomInputSelect from './CustomInputSelect.vue'
import { VBtn, VMenu, VList, VListItem, VListItemTitle } from 'vuetify/components'
import { ref } from 'vue'

const meta = {
	title: 'Components/CustomInputSelect',
	component: CustomInputSelect,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		selectedValue: { control: 'text' },
		items: { control: 'object' },
		errorMessages: { control: 'object' },
	},
} as Meta<typeof CustomInputSelect>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { CustomInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<CustomInputSelect
					v-bind="args"
				/>
			`,
		}
	},
}

export const Outlined: Story = {
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { CustomInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<CustomInputSelect
					v-bind="args"
					outlined
				/>
			`,
		}
	},
}

export const withError: Story = {
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { CustomInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				const errorMessages = ref([])
				const triggerError = () => {
					// @ts-expect-error test error message
					errorMessages.value = ['This is a test error message']
				}
				return { args, errorMessages, triggerError }
			},
			template: `
				<div>
					<CustomInputSelect
						v-bind="args"
						:error-messages="errorMessages"
					/>
					<VBtn @click="triggerError">
						Trigger Error
					</VBtn>
				</div>
			`,
		}
	},
}

export const withCustomKey: Story = {
	args: {
		items: [
			{ customKey: 'Option 1', value: '1' },
			{ customKey: 'Option 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { CustomInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div>
					<CustomInputSelect
						v-bind="args"
						outlined
						text-key="customKey"
					/>
				</div>
			`,
		}
	},
}

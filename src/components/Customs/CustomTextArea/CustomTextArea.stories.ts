import type { Meta, StoryObj } from '@storybook/vue3'
import CustomTextArea from '@/components/Customs/CustomTextArea/CustomTextArea.vue'
import { VIcon } from 'vuetify/components'

const meta = {
	title: 'Components/CustomTextArea',
	component: CustomTextArea,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue'] },
	},
	argTypes: {
		modelValue: { control: 'text' },
		label: { control: 'text' },
		prependIcon: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		appendIcon: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		prependInnerIcon: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		appendInnerIcon: {
			control: 'select',
			options: ['info', 'success', 'warning', 'error', 'close'],
		},
		variantStyle: {
			control: 'select',
			options: ['outlined', 'plain', 'underlined', 'filled', 'solo', 'solo-inverted', 'solo-filled'],
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
		},
	},
} as Meta<typeof CustomTextArea>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<CustomTextArea
						v-model="value"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import CustomTextArea from '@cnamts/CustomTextArea'
				</script>
				`,
			},
		],
	},
	args: {
		label: 'Label',
		appendIcon: 'close',
		prependInnerIcon: 'info',
		showDivider: true,
		appendInnerIcon: 'success',
		variantStyle: 'outlined',
		color: 'primary',
		isClearable: true,
		title: 'champs de test',
		ariaLabel: 'champs de test',
	},
	render: (args) => {
		return {
			components: { CustomTextArea, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<CustomTextArea
						v-bind="args"
					/>
				</div>
				<br/><br/><br/><br/>
			`,
		}
	},
}

import type { Meta, StoryObj } from '@storybook/vue3'
import ChipList from './ChipList.vue'

const meta = {
	title: 'Composants/Données/ChipList',
	component: ChipList,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['copy'] },
	},
	argTypes: {
		items: {
			control: { Array },
			default: [],
		},
		overflowLimit: {
			control: { type: 'number' },
			default: 4,
		},
	},
} satisfies Meta<typeof ChipList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
	<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
   import ChipList from '@/components/ChipList/ChipList.vue'
	const items = [
		{
			text: 'Email',
			value: 'email',
			state: 'info',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'success',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'error',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'warning',
		},

	]
    
</script>
                `,
			},
		],
	},
	args: {
		items: [
			{
				text: 'Email',
				value: 'email',
				state: 'info',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'success',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'error',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'warning',
			},
		],
		overflowLimit: 4,
	},
	render: (args) => {
		return {
			components: { ChipList },
			setup() {
				return { args }
			},
			template: `
			<ChipList
		:items="args.items"
		:overflow-limit="args.overflowLimit"
	/>
            `,
		}
	},
}

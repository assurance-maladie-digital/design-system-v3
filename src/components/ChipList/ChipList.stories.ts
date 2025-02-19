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
			control: { type: 'range' },
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
			state: '',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: '',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: '',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: '',
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
				state: '',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: '',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: '',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: '',
			},
		],
		overflowLimit: 5,
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

export const Success: Story = {
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
			state: 'success',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'success',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'success',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'success',
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
				state: 'success',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'success',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'success',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'success',
			},
		],
		overflowLimit: 5,
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

export const Info: Story = {
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
			state: 'info',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'info',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'info',
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
				state: 'info',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'info',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'info',
			},
		],
		overflowLimit: 5,
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

export const Warning: Story = {
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
			state: 'warning',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'warning',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'warning',
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
				state: 'warning',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'warning',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'warning',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'warning',
			},
		],
		overflowLimit: 5,
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

export const Error: Story = {
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
			state: 'error',
		},
		{
			text: 'Courrier',
			value: 'courrier',
			state: 'error',

		},
		{
			text: 'SMS',
			value: 'sms',
			state: 'error',
		},

		{
			text: 'Telephone',
			value: 'telephone',
			state: 'error',
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
				state: 'error',
			},
			{
				text: 'Courrier',
				value: 'courrier',
				state: 'error',

			},
			{
				text: 'SMS',
				value: 'sms',
				state: 'error',
			},

			{
				text: 'Telephone',
				value: 'telephone',
				state: 'error',
			},
		],
		overflowLimit: 5,
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

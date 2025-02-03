import type { Meta, StoryObj } from '@storybook/vue3'
import SySelect from '@/components/Customs/SySelect/SySelect.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'
import { VBtn, VMenu, VList, VListItem, VListItemTitle } from 'vuetify/components'
import { ref } from 'vue'

const meta: Meta<typeof SySelect> = {
	title: 'Composants/Formulaires/SySelect',
	component: SySelect,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['selectedValue', 'isOpen', 'closeList'] },
	},
	argTypes: {
		selectedValue: { control: 'text' },
		items: { control: 'object' },
		errorMessages: { control: 'object' },
		required: { control: 'boolean' },
	},
} as Meta<typeof SySelect>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SySelect from '@cnamts/SySelect'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
					/>
				</div>
				<br/><br/><br/><br/>
			`,
		}
	},
}

export const Required: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
						required
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SySelect from '@cnamts/SySelect'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
		required: true,
	},
	render: (args) => {
		return {
			components: { SySelect },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						:required="args.required"
					/>
				</div>
			`,
		}
	},
}

export const withCustomError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SySelect
						v-model="value"
						:items="items"
						:error-messages="errorMessages"
					/>
					<VBtn @click="triggerError">
						Trigger Error
					</VBtn>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SySelect from '@cnamts/SySelect'
					import { ref } from 'vue'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					],
					
					const errorMessages = ref([])
					
					const triggerError = () => {
						errorMessages.value = ['This is a test error message']
					}
				</script>
				`,
			},
		],
	},
	args: {
		items: [
			{ text: 'Option 1', value: '1' },
			{ text: 'Option 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				const errorMessages = ref([])
				const triggerError = () => {
					// @ts-expect-error test error message
					errorMessages.value = ['This is a test error message']
				}
				return { args, errorMessages, triggerError }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						:error-messages="errorMessages"
					/>
				</div>
				<div class="px-4">
					<VBtn @click="triggerError">
						Trigger Error
					</VBtn>
				</div>
			`,
		}
	},
}

export const withCustomKey: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
					<template>
						<SySelect
							v-model="value"
							:items="items"
							text-key="customKey"
						/>
					</template>
					`,
			},
			{
				name: 'Script',
				code: `
					<script setup lang="ts">
						import SySelect from '@cnamts/SySelect'
						
						const items =  [
							{ customKey: 'Choix 1', value: '1' },
							{ customKey: 'Choix 2', value: '2' },
						],
					</script>
					`,
			},
		],
	},
	args: {
		items: [
			{ customKey: 'Choix 1', value: '1' },
			{ customKey: 'Choix 2', value: '2' },
		],
	},
	render: (args) => {
		return {
			components: { SySelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="pa-4">
					<SySelect
						v-bind="args"
						text-key="customKey"
					/>
				</div>
			`,
		}
	},
}

export const Info: Story = {
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
				<SyAlert v-model="args.modelValue" :type="args.type" :variant="tonal" :closable="false">
					<template #default>
						<b>Format des items :</b>
						<ul>
							<li>- Si les items passés en props sont des objets, le composant les utilisera directement.</li>
							<li>- Si les items sont un tableau de string, le composant les utilisera directement.</li>
						</ul>
					</template>
				</SyAlert>
			`,
		}
	},
	tags: ['!dev'],
}

import type { Meta, StoryObj } from '@storybook/vue3'
import SyInputSelect from './SyInputSelect.vue'
import { VBtn, VMenu, VList, VListItem, VListItemTitle } from 'vuetify/components'
import { ref } from 'vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'

const meta = {
	title: 'Composants/Formulaires/SyInputSelect',
	component: SyInputSelect,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['selectedValue', 'isOpen', 'toggleMenu', 'closeList', 'selectItem', 'selectedItem', 'getItemText'] },
	},
	argTypes: {
		selectedValue: { control: 'text' },
		items: { control: 'object' },
		errorMessages: { control: 'object' },
		required: { control: 'boolean' },
		outlined: { control: 'boolean' },
		textKey: { control: 'text' },
		valueKey: { control: 'text' },
		vuetifyOptions: { control: 'object' },
	},
} as Meta<typeof SyInputSelect>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyInputSelect
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
					import SyInputSelect from '@cnamts/SyInputSelect'
					
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
		vuetifyOptions: {
			menu: {
				color: 'primary',
			},
			option: {
				color: 'primary',
			},
		},
	},
	render: (args) => {
		return {
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
						v-bind="args"
						:vuetify-options="args.vuetifyOptions"
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
					<SyInputSelect
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
					import SyInputSelect from '@cnamts/SyInputSelect'
					
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
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
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
					<SyInputSelect
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
					import SyInputSelect from '@cnamts/SyInputSelect'
					import { ref } from 'vue'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					]
					
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
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				const errorMessages = ref([])
				const triggerError = () => {
					// @ts-expect-error test error message
					errorMessages.value = ['This is a test error message']
				}
				return { args, errorMessages, triggerError }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
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
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyInputSelect
						v-model="value"
						:items="items"
						text-key="customKey"
						outlined
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SyInputSelect from '@cnamts/SyInputSelect'
					
					const items =  [
						{ customKey: 'Choix 1', value: '1' },
						{ customKey: 'Choix 2', value: '2' }
					]
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
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
						v-bind="args"
						outlined
						text-key="customKey"
					/>
				</div>
			`,
		}
	},
}

export const withCustomStyles: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyInputSelect
						v-model="value"
						:items="items"
						:vuetify-options="vuetifyOptions
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import SyInputSelect from '@cnamts/SyInputSelect'
					
					const items =  [
						{ text: 'Option 1', value: '1' },
						{ text: 'Option 2', value: '2' },
					]
					
					const vuetifyOptions = {
						menu: {
							color: 'secondary',
						},
						option: {
							color: 'secondary',
						},
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
		vuetifyOptions: {
			menu: {
				color: 'secondary',
			},
			option: {
				color: 'secondary',
			},
		},
	},
	render: (args) => {
		return {
			components: { SyInputSelect, VBtn, VMenu, VList, VListItem, VListItemTitle },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyInputSelect
						v-bind="args"
						:items="args.items"
						:vuetify-options="args.vuetifyOptions"
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

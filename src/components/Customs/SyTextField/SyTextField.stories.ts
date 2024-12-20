import type { Meta, StoryObj } from '@storybook/vue3'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { VIcon } from 'vuetify/components'
import { ref } from 'vue'
import { mdiAccountBox } from '@mdi/js'

const meta = {
	title: 'Composants/Formulaires/SyTextField',
	component: SyTextField,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['modelValue', 'appendInnerIconColor'] },
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
} as Meta<typeof SyTextField>

export default meta

type Story = StoryObj<typeof meta>
export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField v-model="value" />
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		showDivider: false,
		variantStyle: 'outlined',
		color: 'primary',
		isClearable: true,
		label: 'Label',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField v-bind="args" />
				</div>
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
					<SyTextField 
						v-model="value" 
						required
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		showDivider: false,
		variantStyle: 'outlined',
		color: 'primary',
		isClearable: true,
		label: 'Label',
		required: true,
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField v-bind="args" />
				</div>
			`,
		}
	},
}

export const WithCustomError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
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
					import { SyTextField } from '@cnamts/synapse'
					
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
		showDivider: false,
		variantStyle: 'outlined',
		color: 'primary',
		isClearable: true,
		label: 'Label',
		required: false,
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
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
					<SyTextField v-bind="args" :error-messages="errorMessages" />
				</div>
				<VBtn class="ml-8" @click="triggerError">
					Trigger Error
				</VBtn>
			`,
		}
	},
}

export const SlotPrepend: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						prepend-icon="info"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'Label',
		color: 'primary',
		prependIcon: 'info',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:label="args.label"
						:prepend-icon="args.prependIcon"
					/>
				</div>
			`,
		}
	},
}

export const SlotAppend: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						append-icon="success"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'champs de text',
		color: 'primary',
		appendIcon: 'success',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:append-icon="args.appendIcon"
					/>
				</div>
			`,
		}
	},
}

export const SlotPrependInner: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						prepend-inner-icon="info"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'Label',
		color: 'primary',
		prependInnerIcon: 'info',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:prepend-inner-icon="args.prependInnerIcon"
					/>
				</div>
			`,
		}
	},
}

export const SlotPrependInnerDivider: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						prepend-inner-icon="info"
						show-divider
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: true,
		label: 'Label',
		color: 'primary',
		prependInnerIcon: 'info',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:prepend-inner-icon="args.prependInnerIcon"
						:show-divider="args.showDivider"
					/>
				</div>
			`,
		}
	},
}

export const SlotAppendInner: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField 
						v-model="value" 
						append-inner-icon="success"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'Label',
		color: 'primary',
		appendInnerIcon: 'success',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
						:append-inner-icon="args.appendInnerIcon"
					/>
				</div>
			`,
		}
	},
}

export const SlotCustomIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<SyTextField v-model="value">
						<template #append-inner>
							<VIcon>
								{{ iconName }}
							</VIcon>
						</template>
					</SyTextField>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { SyTextField } from '@cnamts/synapse'
					import { mdiAccountBox } from '@mdi/js'
					
					const iconName = mdiAccountBox
				</script>
				`,
			},
		],
	},
	args: {
		variantStyle: 'outlined',
		isClearable: true,
		showDivider: false,
		label: 'Label',
		color: 'primary',
	},
	render: (args) => {
		return {
			components: { SyTextField, VIcon },
			setup() {
				const iconName = ref(mdiAccountBox)

				return { args, iconName }
			},
			template: `
				<div class="d-flex flex-wrap align-center pa-4">
					<SyTextField
						v-bind="args"
					>
						<template #append-inner>
							<VIcon>
								{{ iconName }}
							</VIcon>
						</template>
					</SyTextField>
				</div>
			`,
		}
	},
}

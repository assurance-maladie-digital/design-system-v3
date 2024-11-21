import type { Meta, StoryObj } from '@storybook/vue3'
import Alert from './Alert.vue'
import { VBtn } from 'vuetify/components'

const meta = {
	title: 'Composants/Feedback/Alert',
	component: Alert,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['prependIcon', 'dismissAlert'] },
	},
	args: {
		modelValue: true,
	},
	argTypes: {
		type: {
			options: ['info', 'warning', 'success', 'error'],
			control: { type: 'select' },
			default: 'info',
		},
		variant: {
			options: ['outlined', 'tonal'],
			control: { type: 'select' },
			default: 'outlined',
		},
	},
} as Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center justify-center">
		<Alert v-model="showAlert" type="success" variant="tonal" :closable="true">
			<template #default>This is a success alert</template>
		</Alert>

		<VBtn v-if="!showAlert" color="primary" @click="showAlert = true">
			Réinitialiser
		</VBtn>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import Alert from '@cnamts/synapse'
	import { ref } from 'vue'
	
	const showAlert = ref(true);
</script>
				`,
			},
		],
	},
	args: {
		modelValue: true,
		type: 'success',
		closable: true,
		variant: 'tonal',
		default: 'Alert content',
	},
	render: (args) => {
		return {
			components: { Alert, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center justify-center">
					<Alert v-model="args.modelValue" :type="args.type" :variant="args.variant" :closable="args.closable">
						<template #default>{{ args.default }}</template>
					</Alert>
					<VBtn v-if="!args.modelValue" color="primary" @click="args.modelValue = true" class="ma-6">
						Réinitialiser
					</VBtn>
				</div>
			`,
		}
	},
}

export const Outlined: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center justify-center">
		<Alert v-model="showAlert" type="warning" variant="outlined" :closable="true">
			<template #default>This is a warning alert</template>
		</Alert>

		<VBtn v-if="!showAlert" color="primary" @click="showAlert = true">
			Réinitialiser
		</VBtn>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import Alert from '@cnamts/synapse'
	import { ref } from 'vue'
	
	const showAlert = ref(true);
</script>
				`,
			},
		],
	},
	args: {
		type: 'warning',
		closable: true,
		variant: 'outlined',
		default: 'Alert content',
	},
	render: (args) => {
		return {
			components: { Alert, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center justify-center">
					<Alert v-model="args.modelValue" :type="args.type" :variant="args.variant" :closable="args.closable">
						<template #default>{{ args.default }}</template>
					</Alert>
					<VBtn v-if="!args.modelValue" color="primary" @click="args.modelValue = true" class="ma-6">
						Réinitialiser
					</VBtn>
				</div>
			`,
		}
	},
}

export const SlotIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center justify-center">
		<Alert v-model="showAlert" type="success" variant="tonal" :closable="true">
			<template #default>This is a success alert</template>
			<template #icon>{{ icon }}</template>
		</Alert>

		<VBtn v-if="!showAlert" color="primary" @click="showAlert = true">
			Réinitialiser
		</VBtn>
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import Alert from '@cnamts/synapse'
	import { ref } from 'vue'
	import { mdiAccountCheck } from '@mdi/js'
	
	const showAlert = ref(true);
    const icon = mdiAccountCheck;
</script>
				`,
			},
		],
	},
	args: {
		type: 'success',
		closable: true,
		variant: 'tonal',
		default: 'Alert content',
		icon: 'M21.1,12.5L22.5,13.91L15.97,20.5L12.5,17L13.9,15.59L15.97,17.67L21.1,12.5M10,17L13,20H3V18C3,15.79 6.58,14 11,14L12.89,14.11L10,17M11,4A4,4 0 0,1 15,8A4,4 0 0,1 11,12A4,4 0 0,1 7,8A4,4 0 0,1 11,4Z',
	},
	render: (args) => {
		return {
			components: { Alert, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center justify-center">
					<Alert v-model="args.modelValue" :type="args.type" :variant="args.variant" :closable="args.closable">
						<template #default>{{ args.default }}</template>
						<template #icon>{{ args.icon }}</template>
					</Alert>
					<VBtn v-if="!args.modelValue" color="primary" @click="args.modelValue = true" class="ma-6">
						Réinitialiser
					</VBtn>
				</div>
			`,
		}
	},
}

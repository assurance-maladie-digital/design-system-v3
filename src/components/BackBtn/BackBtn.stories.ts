import type { Meta, StoryObj } from '@storybook/vue3'

import BackBtn from './BackBtn.vue'
import SyAlert from '@/components/SyAlert/SyAlert.vue'

import { VSheet } from 'vuetify/components'

const meta = {
	title: 'Composants/Boutons/BackBtn',
	component: BackBtn,
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		dark: {
			control: 'boolean',
		},
		hideBackIcon: {
			control: 'boolean',
		},
	},
} as Meta<typeof BackBtn>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VSheet class="pa-4">
		<BackBtn />
	</VSheet>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import BackBtn from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		dark: false,
	},
	render: (args) => {
		return {
			components: { BackBtn, VSheet },
			setup() {
				return { args }
			},
			template: `
				<VSheet
					v-if="args.dark"
					color="primary"
					class="pa-4"
				>
				<BackBtn v-bind="args" />
				</VSheet>
				<VSheet
					v-else
					class="pa-4"
				>
					<BackBtn v-bind="args" />
				</VSheet>
			`,
		}
	},
}

export const Dark: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VSheet color="primary" class="pa-4">
		<BackBtn dark />
	</VSheet>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import BackBtn from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		dark: true,
	},
	render: (args) => {
		return {
			components: { BackBtn, VSheet },
			setup() {
				return { args }
			},
			template: `
				<VSheet
					color="primary"
					class="pa-4"
				>
				<BackBtn v-bind="args" />
				</VSheet>
			`,
		}
	},
}

export const HideBackIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VSheet class="pa-4">
		<BackBtn hide-back-icon />
	</VSheet>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import BackBtn from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		hideBackIcon: true,
	},
	render: (args) => {
		return {
			components: { BackBtn },
			setup() {
				return { args }
			},
			template: `
				<VSheet class="pa-4">
					<BackBtn v-bind="args" />
				</VSheet>
			`,
		}
	},
}

export const DarkAndHideBackIcon: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VSheet class="pa-4">
		<BackBtn
			dark 
			hide-back-icon 
		/>
	</VSheet>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import BackBtn from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		dark: true,
		hideBackIcon: true,
	},
	render: (args) => {
		return {
			components: { BackBtn },
			setup() {
				return { args }
			},
			template: `
				<VSheet
					color="primary"
					class="pa-4"
				>
				<BackBtn v-bind="args" />
				</VSheet>
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
					<template #default>Par défaut, le composant BackBtn n'effectue aucune action, vous devez
						implémenter une redirection ou une action lors du clic sur le bouton.
					</template>
				</SyAlert>
			`,
		}
	},
	tags: ['!dev'],
}

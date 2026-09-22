import type { Meta, StoryObj } from '@storybook/vue3-vite'
import SyAlert from './SyAlert.vue'
import { VBtn } from 'vuetify/components'

const meta = {
	title: 'Composants/Feedback/SyAlert',
	component: SyAlert,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['prependIcon', 'dismissAlert'] },
	},
	args: {
		modelValue: true,
	},
	argTypes: {
		modelValue: {
			control: { type: 'boolean' },
			description: 'Contrôle l\'affichage de l\'alerte',
			table: {
				category: 'props',
			},
		},
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
		role: {
			description: 'Rôle ARIA appliqué au conteneur de l’alerte.',
			control: 'text',
			default: 'alert',
			table: {
				category: 'props',
				type: {
					summary: 'string',
				},
				defaultValue: {
					summary: 'alert',
				},
			},
		},
		ariaLive: {
			name: 'aria-live',
			description: 'Priorité d’annonce du message par les technologies d’assistance.',
			control: 'select',
			options: [undefined, 'off', 'polite', 'assertive'],
			table: {
				category: 'props',
				type: {
					summary: 'off, polite, assertive',
				},
			},
		},
		density: {
			description: 'Densité de l’alerte.',
			control: 'select',
			options: ['default', 'comfortable', 'compact'],
			table: {
				category: 'props',
			},
		},
	},
} as Meta<typeof SyAlert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center justify-center">
		<SyAlert v-model="showAlert" type="success" variant="tonal" :closable="true" style="width: 100%">
			<template #default>Contenu de l'alerte</template>
		</SyAlert>

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
	import { SyAlert } from '@cnamts/synapse'
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
		role: 'alert',
		default: 'Contenu de l\'alerte',
	},
	render: (args) => {
		return {
			components: { SyAlert, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center justify-center">
					<SyAlert v-model="args.modelValue" :type="args.type" :variant="args.variant" :closable="args.closable" :density="args.density" :role="args.role" :aria-live="args.ariaLive" style="width: 100%">
						<template #default>{{ args.default }}</template>
					</SyAlert>
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
		<SyAlert v-model="showAlert" type="warning" variant="outlined" :closable="true" style="width: 100%">
			<template #default>Contenu de l'alerte</template>
		</SyAlert>

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
	import { SyAlert } from '@cnamts/synapse'
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
		role: 'alert',
		default: 'Contenu de l\'alerte',
	},
	render: (args) => {
		return {
			components: { SyAlert, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center justify-center">
					<SyAlert v-model="args.modelValue" :type="args.type" :variant="args.variant" :closable="args.closable" :role="args.role" :aria-live="args.ariaLive" style="width: 100%">
						<template #default>{{ args.default }}</template>
					</SyAlert>
					<VBtn v-if="!args.modelValue" color="primary" @click="args.modelValue = true" class="ma-6">
						Réinitialiser
					</VBtn>
				</div>
			`,
		}
	},
}

export const Density: Story = {
	args: {
		type: 'info',
		default: 'Contenu de l’alerte',
	},
	parameters: {
		controls: {
			exclude: ['density'],
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-column ga-4">
		<SyAlert density="default" type="info">Densité par défaut</SyAlert>
		<SyAlert density="comfortable" type="info">Densité confortable</SyAlert>
		<SyAlert density="compact" type="info">Densité compacte</SyAlert>
	</div>
</template>`,
			},
		],
	},
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-column ga-4">
					<SyAlert v-bind="args" density="default">Densité par défaut</SyAlert>
					<SyAlert v-bind="args" density="comfortable">Densité confortable</SyAlert>
					<SyAlert v-bind="args" density="compact">Densité compacte</SyAlert>
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
		<SyAlert v-model="showAlert" type="success" variant="tonal" :closable="true" style="width: 100%">
			<template #default>Contenu de l'alerte</template>
			<template #icon>{{ icon }}</template>
		</SyAlert>

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
	import { SyAlert } from '@cnamts/synapse'
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
		role: 'alert',
		default: 'Contenu de l\'alerte',
		icon: 'M21.1,12.5L22.5,13.91L15.97,20.5L12.5,17L13.9,15.59L15.97,17.67L21.1,12.5M10,17L13,20H3V18C3,15.79 6.58,14 11,14L12.89,14.11L10,17M11,4A4,4 0 0,1 15,8A4,4 0 0,1 11,12A4,4 0 0,1 7,8A4,4 0 0,1 11,4Z',
	},
	render: (args) => {
		return {
			components: { SyAlert, VBtn },
			setup() {
				return { args }
			},
			template: `
				<div class="d-flex flex-wrap align-center justify-center">
					<SyAlert v-model="args.modelValue" :type="args.type" :variant="args.variant" :closable="args.closable" :role="args.role" :aria-live="args.ariaLive" style="width: 100%">
						<template #default>{{ args.default }}</template>
						<template #icon>{{ args.icon }}</template>
					</SyAlert>
					<VBtn v-if="!args.modelValue" color="primary" @click="args.modelValue = true" class="ma-6">
						Réinitialiser
					</VBtn>
				</div>
			`,
		}
	},
}

export const StatusMessage: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyAlert role="status" aria-live="polite" type="success" variant="outlined" style="width: 100%">
		Votre action a bien été prise en compte.
	</SyAlert>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { SyAlert } from '@cnamts/synapse'
</script>
				`,
			},
		],
	},
	args: {
		modelValue: true,
		type: 'success',
		closable: false,
		variant: 'outlined',
		role: 'status',
		ariaLive: 'polite',
		default: 'Votre action a bien été prise en compte.',
	},
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
				<SyAlert v-model="args.modelValue" :type="args.type" :variant="args.variant" :closable="args.closable" :role="args.role" :aria-live="args.ariaLive" style="width: 100%">
					<template #default>{{ args.default }}</template>
				</SyAlert>
			`,
		}
	},
}

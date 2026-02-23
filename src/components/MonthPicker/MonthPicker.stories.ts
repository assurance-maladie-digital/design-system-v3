import { fn } from '@storybook/test'
import MonthPicker from './MonthPicker.vue'
import type { Meta, StoryObj } from '@storybook/vue3'

const meta: Meta<typeof MonthPicker> = {
	title: 'Composants/Formulaires/MonthPicker',
	component: MonthPicker,
	argTypes: {
		'modelValue': { control: 'text' },
		'btnLabel': { control: 'text' },
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lorsque la valeur du sélecteur de mois change. La nouvelle valeur est passée en argument.',
			table: {
				type: { summary: 'string' },
			},
		},
		'onUpdate:open': {
			action: 'update:open',
			description: 'Événement émis lorsque le sélecteur de mois est ouvert ou fermé.',
			table: {
				type: { summary: 'boolean' },
			},
		},
	},
}

export default meta
type Story = StoryObj<typeof MonthPicker>

export const Default: Story = {
	args: {
		'modelValue': '11/2025',
		'label': 'Début du projet (MM/YYYY)',
		'onUpdate:modelValue': fn(),
		'onUpdate:open': fn(),
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<MonthPicker
						v-model="selectedMonth"
						label="Début du projet (MM/YYYY)"
					/>
				</template>
				`,
			}, {
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { MonthPicker } from '@cnamts/synapse'
					import { ref } from 'vue'

					const selectedMonth = ref('11/2025')
				</script>
				`,
			},
		],
	},
}

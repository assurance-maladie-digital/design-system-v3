import type { Meta, StoryObj } from '@storybook/vue3'
import RangeField from './RangeField.vue'

const meta = {
	title: 'Composants/Formulaires/RangeField',
	component: RangeField,
	argTypes: {
		'min': {
			control: 'number',
			description: 'Valeur minimale du champ',
			table: {
				type: {
					summary: 'number',
				},
			},
		},
		'max': {
			control: 'number',
			description: 'Valeur maximale du champ',
			table: {
				type: {
					summary: 'number',
				},
			},
		},
		'step': {
			control: 'number',
			description: 'Le pas du slider',
			table: {
				type: {
					summary: 'number',
				},
			},
		},
		'modelValue': {
			control: 'object',
			description: 'Valeur du champ',
			defaultValue: [0, 0],
			table: {
				category: 'props',
				type: {
					summary: '[number, number]',
				},
			},
		},
		'onUpdate:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lors de la modification de la valeur du champ',
			table: {
				category: 'events',
				type: {
					summary: '[number, number]',
				},
			},
		},
		'bgColor': {
			control: 'color',
			description: 'Couleur de fond du champ',
			table: {
				type: {
					summary: 'string',
				},
			},
		},
		'vuetifyOptions': {
			control: 'object',
			description: 'Personnalisation des composants Vuetify internes',
			table: {
				category: 'props',
				defaultValue: {
					detail: `
					{
						textField: {
							hideDetails: true,
							class: 'ma-3',
							variant: 'outlined',
						},
					}`,
				},
				type: {
					summary: 'Record<string, any>',
					detail: `
					{
	textField?: Record<string, any>,
	rangeSlider?: Record<string, any>,
}
					`,
				},
			},
		},
	},
} satisfies Meta<typeof RangeField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="width: 300px;">
		<RangeField v-model="range" />
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { RangeField } from '@cnamts/synapse'
	import { ref } from 'vue'

	const range = ref([0, 100])
</script>
				`,
			},
		],
	},
}

export const OtherRange: Story = {
	args: {
		min: -50,
		max: 50,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="width: 300px;">
		<RangeField v-model="modelValue" :min="-50" :max="50" />
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { RangeField } from '@cnamts/synapse'
	import { ref } from 'vue'
	const modelValue = ref([50, 80])
</script>
				`,
			},
		],
	},
}

export const Customization: Story = {
	args: {
		vuetifyOptions: {
			textField: {
				variant: 'plain',
			},
			rangeSlider: {
				'thumb-color': 'purple',
				'track-color': 'LightSteelBlue',
				'track-fill-color': 'purple',
			},
		},
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div style="width: 300px;">
		<RangeField vuetifyOptions="vuetifyOptions" v-model="range" />
	</div>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { RangeField } from '@cnamts/synapse'
	import { ref } from 'vue'
	const vuetifyOptions = {
		textField: {
			variant: 'plain',
		},
		rangeSlider: {
			'thumb-color': 'purple',
			'track-color': 'LightSteelBlue',
			'track-fill-color': 'purple',
		},
	}
	const range = ref([0, 100])
</script>
				`,
			},
		],
	},
}

import type { StoryObj, Meta } from '@storybook/vue3'
import SearchListField from './SearchListField.vue'

const meta = {
	title: 'Composants/Formulaires/SearchListField',
	component: SearchListField,
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: ['filteredItems', 'search', 'emitChangeEvent'] },
	},
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	argTypes: {
		modelValue: {
			default: '[]',
		},
		items: { control: { type: 'object' } },
	},
} satisfies Meta<typeof SearchListField>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Story par défaut
 */
export const Default: Story = {
	args: {
		modelValue: [],
		items: [
			{
				label: 'Chirurgien-dentiste',
				value: 'chirurgien-dentiste',
			},
			{
				label: 'Infirmier',
				value: 'infirmier',
			},
			{
				label: 'Orthophoniste',
				value: 'orthophoniste',
			},
			{
				label: 'Orthoptiste',
				value: 'orthoptiste',
			},
			{
				label: 'Pédicure-podologue',
				value: 'pedicure-podologue',
			},
			{
				label: 'Pharmacien',
				value: 'pharmacien',
			},
		],
	},
	render: (args) => {
		return {
			components: { SearchListField },
			setup() {
				return { args }
			},
			template: `
                <SearchListField v-bind="args" v-model="args.modelValue"/>
            `,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <SearchListField
   	v-model="modelValue"
	:items="items"
  />
  {{ modelValue }}
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { SearchListField } from '@cnamts/synapse'

const modelValue = ref('')

const items = [
  {
	label: 'Chirurgien-dentiste',
	value: 'chirurgien-dentiste',
  },
  {
	label: 'Infirmier',
	value: 'infirmier',
  },
  {
	label: 'Orthophoniste',
	value: 'orthophoniste',
  },
  {
	label: 'Orthoptiste',
	value: 'orthoptiste',
  },
  {
	label: 'Pédicure-podologue',
	value: 'pedicure-podologue',
  },
  {
	label: 'Pharmacien',
	value: 'pharmacien',
  },
]
</script>
        `,
			},
		],
	},
}

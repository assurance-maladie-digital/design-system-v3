import type { StoryObj, Meta } from '@storybook/vue3'
import RatingPicker from './RatingPicker.vue'

const meta = {
	title: 'Composants/Feedback/RatingPicker',
	component: RatingPicker,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
	},
	argTypes: {
		type: {
			description: 'Le type de notation.',
			control: {
				type: 'select',
				options: ['emotion', 'number', 'stars'],
			},
			table: {
				type: {
					summary: 'emotion, number, stars',
				},
				defaultValue: {
					summary: 'emotion',
				},
			},
		},
		label: {
			description: 'Le libellé du champ.',
			control: 'text',
			default: null,
			table: {
				type: {
					summary: 'string | null',
				},
			},
		},
		readonly: {
			description: 'Si le champ est en lecture seule.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		itemLabels: {
			description: 'Les libellés des items.',
			control: 'array',
			default: null,
			table: {
				type: {
					summary: 'string[]',
				},
			},
		},
		twoEmotions: {
			description: 'Si le champ est en deux émotions.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		hideAlert: {
			description: 'Si le champ est en alerte.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
		modelValue: {
			description: 'La valeur sélectionnée.',
			control: 'number',
			default: -1,
			table: {
				type: {
					summary: 'number',
				},
			},
		},
	},
} satisfies Meta<typeof RatingPicker>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Story par défaut
 */
export const Default: Story = {
	args: {
		type: 'emotion',
		label: 'Êtes-vous satisfait de ce service ?',
		readonly: false,
		twoEmotions: false,
		hideAlert: false,
		modelValue: -1,
	},
	render: (args) => {
		return {
			components: { RatingPicker },
			setup() {
				return { args }
			},
			template: `
                <RatingPicker v-bind="args" v-model="args.modelValue"/>
            `,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<RatingPicker
		v-model="ratingEmotion"
		label="Êtes-vous satisfait de ce service ?"
		type="emotion"
	/>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import RatingPicker from '@cnamts/synapse'

const ratingEmotion = ref(-1)
</script>
        `,
			},
		],
	},
}

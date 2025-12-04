import type { StoryObj, Meta } from '@storybook/vue3'
import RatingPicker from './RatingPicker.vue'
import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
import { VBtn, VSpacer } from 'vuetify/components'
import { fn } from '@storybook/test'

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
			control: 'select',
			options: ['emotion', 'number', 'stars'],
			default: 'emotion',
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
		center: {
			description: 'Si le champ doit être centré dans la page.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
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
			control: 'object',
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
		'type': 'emotion',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'twoEmotions': false,
		'hideAlert': false,
		'modelValue': -1,
		'onUpdate:modelValue': fn(),
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
import { RatingPicker } from '@cnamts/synapse'

const ratingEmotion = ref(-1)
</script>
        `,
			},
		],
	},
}

export const TwoEmotions: Story = {
	args: {
		'type': 'emotion',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'twoEmotions': true,
		'hideAlert': false,
		'modelValue': -1,
		'onUpdate:modelValue': fn(),
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
		two-emotions
	/>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { RatingPicker } from '@cnamts/synapse'

const ratingEmotion = ref(-1)
</script>
        `,
			},
		],
	},
}

export const Numbers: Story = {
	args: {
		'type': 'number',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'hideAlert': false,
		'modelValue': -1,
		'onUpdate:modelValue': fn(),
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
		v-model="ratingNumber"
		label="Êtes-vous satisfait de ce service ?"
		type="number"
	/>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { RatingPicker } from '@cnamts/synapse'

const ratingNumber = ref(-1)
</script>
        `,
			},
		],
	},
}

export const Stars: Story = {
	args: {
		'type': 'stars',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'hideAlert': false,
		'modelValue': -1,
		'onUpdate:modelValue': fn(),
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
		v-model="ratingStar"
		label="Êtes-vous satisfait de ce service ?"
		type="stars"
	/>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { RatingPicker } from '@cnamts/synapse'

const ratingStar = ref(-1)
</script>
        `,
			},
		],
	},
}

export const ReadOnly: Story = {
	args: {
		'type': 'emotion',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': true,
		'twoEmotions': false,
		'hideAlert': false,
		'modelValue': -1,
		'onUpdate:modelValue': fn(),
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
		readonly
	/>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { RatingPicker } from '@cnamts/synapse'

const ratingEmotion = ref(-1)
</script>
        `,
			},
		],
	},
}

export const HideAlert: Story = {
	args: {
		'type': 'emotion',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'twoEmotions': false,
		'hideAlert': true,
		'modelValue': -1,
		'onUpdate:modelValue': fn(),
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
		hide-alert
	/>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { RatingPicker } from '@cnamts/synapse'

const ratingEmotion = ref(-1)
</script>
        `,
			},
		],
	},
}

export const DefaultSlot: Story = {
	args: {
		'type': 'emotion',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'twoEmotions': false,
		'hideAlert': false,
		'modelValue': -1,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { RatingPicker, SySelect, VBtn, VSpacer },
			setup() {
				const items = [
					{
						text: 'Via une recherche internet',
						value: 'internet',
					},
					{
						text: 'Via un professionnel de santé',
						value: 'professional',
					},
					{
						text: 'Via un ami',
						value: 'friend',
					},
				]
				return { args, items }
			},
			template: `
                <RatingPicker v-bind="args" v-model="args.modelValue">
					<SySelect
						:items="items"
						label="Comment avez-vous connu ce service ?"
						class="mt-8"
					/>
					<div class="d-flex">
						<VSpacer/>

						<VBtn
							right
							color="primary"
						>
							Terminé
						</VBtn>
					</div>
				</RatingPicker>
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
	>
		<SySelect
			:items="items"
			label="Comment avez-vous connu ce service ?"
			class="mt-8"
		/>
		<div class="d-flex">
			<VSpacer/>

			<VBtn
				right
				color="primary"
			>
				Terminé
			</VBtn>
		</div>
	</RatingPicker>
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { RatingPicker, SySelect } from '@cnamts/synapse'
import { VBtn, VSpacer } from 'vuetify/components'

const ratingEmotion = ref(-1)

const items = [
	{
		text: 'Via une recherche internet',
		value: 'internet'
	},
	{
		text: 'Via un professionnel de santé',
		value: 'professional'
	},
	{
		text: 'Via un ami',
		value: 'friend'
	}
]
</script>
        `,
			},
		],
	},
}

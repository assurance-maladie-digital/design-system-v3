import type { StoryObj, Meta } from '@storybook/vue3-vite'
import RatingPicker from './RatingPicker.vue'
import { VBtn, VSpacer } from 'vuetify/components'
import { fn } from 'storybook/test'
import SyTextArea from '../SyTextArea/SyTextArea.vue'

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
		freeTextLabel: {
			description: 'Le libellé du champ de texte libre. Ajouter aria-label ou aria-labelledby au <textarea> : <textarea :aria-label="props.freeTextLabel" …> . Ce champ doit être utilisé en slot pour être pris en compte. Voir l’exemple de la story "DefaultSlot".',
			control: 'text',
			default: null,
			table: {
				type: {
					summary: 'string | null',
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
		'modelValue': 2,
		'freeTextLabel': 'Pouvez-vous nous en dire plus ?',
		'onUpdate:modelValue': fn() },
	render: (args) => {
		return {
			components: { RatingPicker, VBtn, VSpacer, SyTextArea },
			setup() {
				return { args }
			},
			template: `
				<RatingPicker v-bind="args" v-model="args.modelValue">
					<div class="mt-8">

						<SyTextArea
							id="rating-picker-comment"
							class="w-100 pa-3"
							:label="args.freeTextLabel"
							rows="4"
						/>

						<div class="d-flex mt-4">
							<VSpacer />

							<VBtn
								right
								color="primary"
							>
								Terminé
							</VBtn>
						</div>
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
		:free-text-label="'Pouvez-vous nous en dire plus ?'"
	>
		<div class="mt-8">
			<label
				for="rating-picker-comment"
				class="d-block mb-2"
			>
				{{ freeTextLabel }}
			</label>

			<textarea
				id="rating-picker-comment"
				class="w-100 pa-3"
				rows="4"
			/>

			<div class="d-flex mt-4">
				<VSpacer />

				<VBtn
					right
					color="primary"
				>
					Terminé
				</VBtn>
			</div>
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
import { RatingPicker } from '@cnamts/synapse'
import { VBtn, VSpacer } from 'vuetify/components'

const ratingEmotion = ref(2)
const freeTextLabel = 'Pouvez-vous nous en dire plus ?'
</script>
				`,
			},
		],
	},
}

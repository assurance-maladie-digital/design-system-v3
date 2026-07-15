import type { StoryObj, Meta } from '@storybook/vue3-vite'
import { ref } from 'vue'
import RatingPicker from './RatingPicker.vue'
import { VBtn, VSpacer } from 'vuetify/components'
import { fn } from 'storybook/test'
import SyTextArea from '../SyTextArea/SyTextArea.vue'
import SyForm from '../Customs/SyForm/SyForm.vue'
import DialogBox from '../DialogBox/DialogBox.vue'
import SyAlert from '../SyAlert/SyAlert.vue'
import './RatingPicker.stories.scss'

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
		controls: {
			exclude: /^on*/,
		},
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
		lockAfterSelection: {
			description: 'Si le champ doit être verrouillé après la sélection d’une valeur.',
			control: 'boolean',
			default: true,
			table: {
				type: {
					summary: 'boolean',
				},
			},
		},
	},
} satisfies Meta<typeof RatingPicker>

export default meta

type Story = StoryObj<typeof meta>

const RecommendedAccessibilityStoryNotice = {
	template: `
		<div
			class="mb-6 pa-4"
			role="note"
			style="border: 1px solid #0C41BD; border-radius: 4px; background-color: #F4F7FF; color: #1F2937;"
		>
			<strong>Recommandation accessibilité :</strong>
			pour un parcours complet, il est préférable de consulter la story
			<strong>AccessibilityBestPractices</strong>, qui laisse l’utilisateur modifier sa réponse jusqu’à la validation du formulaire.
		</div>
	`,
}

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
			components: { RatingPicker, RecommendedAccessibilityStoryNotice },
			setup() {
				return { args }
			},
			template: `
				<RecommendedAccessibilityStoryNotice />
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
			components: { RatingPicker, RecommendedAccessibilityStoryNotice },
			setup() {
				return { args }
			},
			template: `
				<RecommendedAccessibilityStoryNotice />
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
			components: { RatingPicker, RecommendedAccessibilityStoryNotice },
			setup() {
				return { args }
			},
			template: `
				<RecommendedAccessibilityStoryNotice />
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
			components: { RatingPicker, RecommendedAccessibilityStoryNotice },
			setup() {
				return { args }
			},
			template: `
				<RecommendedAccessibilityStoryNotice />
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
			components: { RatingPicker, RecommendedAccessibilityStoryNotice },
			setup() {
				return { args }
			},
			template: `
				<RecommendedAccessibilityStoryNotice />
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
			components: { RatingPicker, RecommendedAccessibilityStoryNotice },
			setup() {
				return { args }
			},
			template: `
				<RecommendedAccessibilityStoryNotice />
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
			components: { RatingPicker, RecommendedAccessibilityStoryNotice, VBtn, VSpacer, SyTextArea },
			setup() {
				return { args }
			},
			template: `
				<RecommendedAccessibilityStoryNotice />
				<form @submit.prevent>
					<RatingPicker v-bind="args" v-model="args.modelValue">
						<div class="mt-8">

							<SyTextArea
								id="rating-picker-comment"
								class="w-100 pa-3"
								:label="args.freeTextLabel"
								rows="4"
							/>

							<div class="d-flex mt-6">
								<VBtn
									right
									type="submit"
									color="primary"
								>
									Terminé
								</VBtn>
							</div>
						</div>
					</RatingPicker>
				</form>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form class="mt-8" @submit.prevent>
		<RatingPicker
			v-model="ratingEmotion"
			label="Êtes-vous satisfait de ce service ?"
			type="emotion"
			:free-text-label="'Pouvez-vous nous en dire plus ?'"
		>
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

			<div class="d-flex mt-6">
				<VBtn
					right
					color="primary"
					type="submit"
				>
					Terminé
				</VBtn>
			</div>
		</RatingPicker>
	</form>
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

export const AccessibilityBestPractices: Story = {
	args: {
		'type': 'emotion',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'twoEmotions': false,
		'hideAlert': true,
		'modelValue': -1,
		'freeTextLabel': 'Pouvez-vous nous en dire plus ?',
		'lockAfterSelection': false,
		'center': false,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, RatingPicker, SyAlert, SyForm, SyTextArea, VBtn },
			setup() {
				const dialogOpen = ref(false)
				const isSubmitted = ref(false)

				function handleSubmit() {
					if (args.modelValue === -1) {
						dialogOpen.value = true
						return
					}

					isSubmitted.value = true
				}

				return { args, dialogOpen, handleSubmit, isSubmitted }
			},
			template: `
				<div style="max-width: 800px; margin: 0 auto;">
					<SyForm @submit="handleSubmit">
						<RatingPicker
							v-bind="args"
							v-model="args.modelValue"
							:readonly="args.readonly || isSubmitted"
						>
							<div class="mt-8">
								<SyTextArea
									id="rating-picker-accessibility-comment"
									class="w-100"
									:label="args.freeTextLabel"
									:readonly="isSubmitted"
									rows="4"
								/>
							</div>
						</RatingPicker>

						<div class="d-flex mt-6">
							<VBtn v-if="!isSubmitted" class="rating-picker-submit-button" type="submit" color="primary">Transmettre mon avis</VBtn>
							<SyAlert v-model="isSubmitted" type="success" variant="outlined" :closable="false" role="status" aria-live="polite" style="width: 100%">
								Merci pour votre réponse
							</SyAlert>
						</div>
					</SyForm>
				</div>

				<DialogBox
					v-model="dialogOpen"
					title="Réponse manquante"
				>
					Veuillez sélectionner une réponse avant de valider.

					<template #actions>
						<VBtn color="primary" @click="dialogOpen = false">Compris</VBtn>
					</template>
				</DialogBox>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div style="max-width: 800px; margin: 0 auto;">
		<SyForm @submit="handleSubmit">
			<RatingPicker
				v-model="ratingEmotion"
				label="Êtes-vous satisfait de ce service ?"
				type="emotion"
				:hide-alert="true"
				:readonly="isSubmitted"
				:lock-after-selection="false"
			>
				<div class="mt-8">
					<SyTextArea
						id="rating-picker-accessibility-comment"
						class="w-100"
						:label="freeTextLabel"
						:readonly="isSubmitted"
						rows="4"
					/>
				</div>
			</RatingPicker>

			<div class="d-flex mt-6">
				<VBtn v-if="!isSubmitted" class="rating-picker-submit-button" type="submit" color="primary">Transmettre mon avis</VBtn>
				<SyAlert v-model="isSubmitted" type="success" variant="outlined" :closable="false" role="status" aria-live="polite" style="width: 100%">
					Merci pour votre réponse
				</SyAlert>
			</div>
		</SyForm>
	</div>

	<DialogBox
		v-model="dialogOpen"
		title="Réponse manquante"
	>
		Veuillez sélectionner une réponse avant de valider.

		<template #actions>
			<VBtn color="primary" @click="dialogOpen = false">Compris</VBtn>
		</template>
	</DialogBox>
</template>

<style>
.rating-picker-submit-button:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 2px;
}
</style>
		`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DialogBox, RatingPicker, SyAlert, SyForm, SyTextArea } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const ratingEmotion = ref(-1)
const dialogOpen = ref(false)
const isSubmitted = ref(false)
const freeTextLabel = 'Pouvez-vous nous en dire plus ?'

function handleSubmit() {
	if (ratingEmotion.value === -1) {
		dialogOpen.value = true
		return
	}

	isSubmitted.value = true
}
</script>
		`,
			},
		],
	},
}

export const NoLockAfterSelectionEmotion: Story = {
	args: {
		'type': 'emotion',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'twoEmotions': false,
		'hideAlert': true,
		'modelValue': -1,
		'lockAfterSelection': false,
		'center': false,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, RatingPicker, SyAlert, SyForm, VBtn },
			setup() {
				const dialogOpen = ref(false)
				const isSubmitted = ref(false)

				function handleSubmit() {
					if (args.modelValue === -1) {
						dialogOpen.value = true
						return
					}

					isSubmitted.value = true
				}

				return { args, dialogOpen, handleSubmit, isSubmitted }
			},
			template: `
				<div style="max-width: 800px; margin: 0 auto;">
					<SyForm @submit="handleSubmit">
						<RatingPicker v-bind="args" v-model="args.modelValue" :readonly="args.readonly || isSubmitted"/>

						<div class="d-flex mt-6">
							<VBtn v-if="!isSubmitted" class="rating-picker-submit-button" type="submit" color="primary">Transmettre mon avis</VBtn>
							<SyAlert v-model="isSubmitted" type="success" variant="outlined" :closable="false" style="width: 100%">
								Merci pour votre réponse
							</SyAlert>
						</div>
					</SyForm>
				</div>

				<DialogBox
					v-model="dialogOpen"
					title="Réponse manquante"
				>
					Veuillez sélectionner une réponse avant de valider.

					<template #actions>
						<VBtn color="primary" @click="dialogOpen = false">Compris</VBtn>
					</template>
				</DialogBox>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div style="max-width: 800px; margin: 0 auto;">
		<SyForm @submit="handleSubmit">
			<RatingPicker
				v-model="ratingEmotion"
				label="Êtes-vous satisfait de ce service ?"
				type="emotion"
				:readonly="isSubmitted"
				:lock-after-selection="false"
				:hide-alert="true"
			/>

			<div class="d-flex">
				<VBtn v-if="!isSubmitted" class="rating-picker-submit-button" type="submit" color="primary">Transmettre mon avis</VBtn>
				<SyAlert v-model="isSubmitted" type="success" variant="outlined" :closable="false" style="width: 100%">
					Merci pour votre réponse
				</SyAlert>
			</div>

		</SyForm>
	</div>

	<DialogBox
		v-model="dialogOpen"
		title="Réponse manquante"
	>
		Veuillez sélectionner une réponse avant de valider.

		<template #actions>
			<VBtn color="primary" @click="dialogOpen = false">Compris</VBtn>
		</template>
	</DialogBox>
</template>

<style>
.rating-picker-submit-button:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 2px;
}
</style>
		`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DialogBox, RatingPicker, SyAlert, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const ratingEmotion = ref(-1)
const dialogOpen = ref(false)
const isSubmitted = ref(false)

function handleSubmit() {
	if (ratingEmotion.value === -1) {
		dialogOpen.value = true
		return
	}

	isSubmitted.value = true
}
</script>
		`,
			},
		],
	},
}

export const NoLockAfterSelectionNumber: Story = {
	args: {
		'type': 'number',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'hideAlert': true,
		'center': false,
		'modelValue': -1,
		'lockAfterSelection': false,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, RatingPicker, SyAlert, SyForm, VBtn },
			setup() {
				const dialogOpen = ref(false)
				const isSubmitted = ref(false)

				function handleSubmit() {
					if (args.modelValue === -1) {
						dialogOpen.value = true
						return
					}

					isSubmitted.value = true
				}

				return { args, dialogOpen, handleSubmit, isSubmitted }
			},
			template: `
				<div style="max-width: 800px; margin: 0 auto;">
					<SyForm @submit="handleSubmit">
						<RatingPicker v-bind="args" v-model="args.modelValue" :readonly="args.readonly || isSubmitted"/>

						<div class="d-flex mt-6">
							<VBtn v-if="!isSubmitted" class="rating-picker-submit-button" type="submit" color="primary">Transmettre mon avis</VBtn>
							<SyAlert v-model="isSubmitted" type="success" variant="outlined" :closable="false" style="width: 100%">
								Merci pour votre réponse
							</SyAlert>
						</div>
					</SyForm>
				</div>

				<DialogBox
					v-model="dialogOpen"
					title="Réponse manquante"
				>
					Veuillez sélectionner une réponse avant de valider.

					<template #actions>
						<VBtn color="primary" @click="dialogOpen = false">Compris</VBtn>
					</template>
				</DialogBox>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div style="max-width: 800px; margin: 0 auto;">
		<SyForm @submit="handleSubmit">
			<RatingPicker
				v-model="ratingNumber"
				label="Êtes-vous satisfait de ce service ?"
				type="number"
				:readonly="isSubmitted"
				:lock-after-selection="false"
				:hide-alert="true"
			/>

			<div class="d-flex mt-6">
				<VBtn v-if="!isSubmitted" class="rating-picker-submit-button" type="submit" color="primary">Transmettre mon avis</VBtn>
				<SyAlert v-model="isSubmitted" type="success" variant="outlined" :closable="false" style="width: 100%">
					Merci pour votre réponse
				</SyAlert>
			</div>

		</SyForm>
	</div>

	<DialogBox
		v-model="dialogOpen"
		title="Réponse manquante"
	>
		Veuillez sélectionner une réponse avant de valider.

		<template #actions>
			<VBtn color="primary" @click="dialogOpen = false">Transmettre mon avis</VBtn>
		</template>
	</DialogBox>
</template>

<style>
.rating-picker-submit-button:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 2px;
}
</style>
		`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DialogBox, RatingPicker, SyAlert, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const ratingNumber = ref(-1)
const dialogOpen = ref(false)
const isSubmitted = ref(false)

function handleSubmit() {
	if (ratingNumber.value === -1) {
		dialogOpen.value = true
		return
	}

	isSubmitted.value = true
}
</script>
		`,
			},
		],
	},
}

export const NoLockAfterSelectionStars: Story = {
	args: {
		'type': 'stars',
		'label': 'Êtes-vous satisfait de ce service ?',
		'readonly': false,
		'hideAlert': true,
		'center': false,
		'modelValue': -1,
		'lockAfterSelection': false,
		'onUpdate:modelValue': fn(),
	},
	render: (args) => {
		return {
			components: { DialogBox, RatingPicker, SyAlert, SyForm, VBtn },
			setup() {
				const dialogOpen = ref(false)
				const isSubmitted = ref(false)

				function handleSubmit() {
					if (args.modelValue === -1) {
						dialogOpen.value = true
						return
					}

					isSubmitted.value = true
				}

				return { args, dialogOpen, handleSubmit, isSubmitted }
			},
			template: `
				<div style="max-width: 800px; margin: 0 auto;">
					<SyForm @submit="handleSubmit">
						<RatingPicker v-bind="args" v-model="args.modelValue" :readonly="args.readonly || isSubmitted"/>

						<div class="d-flex mt-6">
							<VBtn v-if="!isSubmitted" class="rating-picker-submit-button" type="submit" color="primary">Transmettre mon avis</VBtn>
							<SyAlert v-model="isSubmitted" type="success" variant="outlined" :closable="false" style="width: 100%">
								Merci pour votre réponse
							</SyAlert>
						</div>
					</SyForm>
				</div>

				<DialogBox
					v-model="dialogOpen"
					title="Réponse manquante"
				>
					Veuillez sélectionner une réponse avant de valider.

					<template #actions>
						<VBtn color="primary" @click="dialogOpen = false">Compris</VBtn>
					</template>
				</DialogBox>
			`,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<div style="max-width: 800px; margin: 0 auto;">
		<SyForm @submit="handleSubmit">
			<RatingPicker
				v-model="ratingStars"
				label="Êtes-vous satisfait de ce service ?"
				type="stars"
				:hide-alert="true"
				:readonly="isSubmitted"
				:lock-after-selection="false"
			/>

			<div class="d-flex mt-6">
				<VBtn v-if="!isSubmitted" class="rating-picker-submit-button" type="submit" color="primary">Transmettre mon avis</VBtn>
				<SyAlert v-model="isSubmitted" type="success" variant="outlined" :closable="false" style="width: 100%">
					Merci pour votre réponse
				</SyAlert>
			</div>

		</SyForm>
	</div>

	<DialogBox
		v-model="dialogOpen"
		title="Réponse manquante"
	>
		Veuillez sélectionner une réponse avant de valider.

		<template #actions>
			<VBtn color="primary" @click="dialogOpen = false">Compris</VBtn>
		</template>
	</DialogBox>
</template>

<style>
.rating-picker-submit-button:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 2px;
}
</style>
		`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { DialogBox, RatingPicker, SyAlert, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const ratingStars = ref(-1)
const dialogOpen = ref(false)
const isSubmitted = ref(false)

function handleSubmit() {
	if (ratingStars.value === -1) {
		dialogOpen.value = true
		return
	}

	isSubmitted.value = true
}
</script>
		`,
			},
		],
	},
}

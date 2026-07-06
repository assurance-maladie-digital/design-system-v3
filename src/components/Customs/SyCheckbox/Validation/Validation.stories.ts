import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, onMounted, ref } from 'vue'
import SyCheckbox from '../SyCheckbox.vue'
import SyForm from '../../SyForm/SyForm.vue'
import { VBtn, VForm } from 'vuetify/components'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

const meta: Meta<typeof SyCheckbox> = {
	title: 'Composants/Formulaires/SyCheckbox/Validation',
	component: SyCheckbox,
	decorators: [
		() => ({ template: '<div style="padding: 20px;"><story/></div>' }),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: 'Stories démontrant les différents cas de validation de SyCheckbox (système unifié). Pour une case unique, « required » signifie que la case doit être cochée.',
			},
		},
	},
	argTypes: {
		...getValidationDocumentation(),
		label: { control: 'text', description: 'Label de la case' },
	},
	args: {
		label: 'J\'accepte les conditions générales',
		required: true,
	},
}

export default meta
type Story = StoryObj<typeof SyCheckbox>

/**
 * Champ requis : la case doit être cochée, sinon une erreur s'affiche à la validation.
 */
export const WithError: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyCheckbox
		ref="checkboxRef"
		v-model="accepted"
		label="J'accepte les conditions générales"
		required
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyCheckbox } from '@cnamts/synapse'

const accepted = ref(false)
const checkboxRef = ref()

// Affiche l'état dès le chargement
onMounted(() => checkboxRef.value?.validateOnSubmit())
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const accepted = ref(false)
			const checkboxRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			onMounted(() => checkboxRef.value?.validateOnSubmit())
			return { args, accepted, checkboxRef }
		},
		template: `<SyCheckbox ref="checkboxRef" v-model="accepted" v-bind="args" />`,
	}),
}

/**
 * Avertissement (customWarningRules) : non bloquant.
 */
export const WithWarning: Story = {
	args: {
		required: false,
		customWarningRules: [{
			type: 'custom',
			options: {
				validate: (value: unknown) => value === true,
				warningMessage: 'Il est recommandé de cocher cette case.',
			},
		}],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyCheckbox
		ref="checkboxRef"
		v-model="accepted"
		label="J'accepte les conditions générales"
		:custom-warning-rules="warningRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyCheckbox } from '@cnamts/synapse'

const accepted = ref(false)
const checkboxRef = ref()

const warningRules = [{
	type: 'custom',
	options: {
		validate: (value: unknown) => value === true,
		warningMessage: 'Il est recommandé de cocher cette case.',
	},
}]

// Affiche l'état dès le chargement
onMounted(() => checkboxRef.value?.validateOnSubmit())
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const accepted = ref(false)
			const checkboxRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			onMounted(() => checkboxRef.value?.validateOnSubmit())
			return { args, accepted, checkboxRef }
		},
		template: `<SyCheckbox ref="checkboxRef" v-model="accepted" v-bind="args" />`,
	}),
}

/**
 * Message de succès (customSuccessRules + showSuccessMessages).
 */
export const WithSuccess: Story = {
	args: {
		required: false,
		showSuccessMessages: true,
		customSuccessRules: [{
			type: 'custom',
			options: {
				validate: (value: unknown) => value === true,
				successMessage: 'Merci d\'avoir accepté.',
			},
		}],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyCheckbox
		ref="checkboxRef"
		v-model="accepted"
		label="J'accepte les conditions générales"
		:custom-success-rules="successRules"
		show-success-messages
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyCheckbox } from '@cnamts/synapse'

const accepted = ref(true)
const checkboxRef = ref()

const successRules = [{
	type: 'custom',
	options: {
		validate: (value: unknown) => value === true,
		successMessage: 'Merci d\\'avoir accepté.',
	},
}]

// Affiche l'état dès le chargement
onMounted(() => checkboxRef.value?.validateOnSubmit())
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const accepted = ref(true)
			const checkboxRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			onMounted(() => checkboxRef.value?.validateOnSubmit())
			return { args, accepted, checkboxRef }
		},
		template: `<SyCheckbox ref="checkboxRef" v-model="accepted" v-bind="args" />`,
	}),
}

/**
 * Règle personnalisée (customRules) avec validation **contextuelle** : ici la case ne peut être
 * cochée que si un prérequis est validé. C'est un vrai cas d'usage de `customRules`, distinct de
 * `required` (qui se contente d'exiger que la case soit cochée).
 */
export const WithCustomRules: Story = {
	parameters: {
		docs: {
			description: {
				story: 'La règle dépend d\'un état externe (le prérequis). Cocher la case sans valider le prérequis déclenche une erreur.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyCheckbox v-model="prerequisite" label="Prérequis : j'ai lu le document" hide-details />
	<SyCheckbox
		v-model="accepted"
		label="J'accepte (uniquement si le prérequis est validé)"
		:custom-rules="customRules"
		:is-validate-on-blur="false"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { computed, ref } from 'vue'
import { SyCheckbox } from '@cnamts/synapse'

const prerequisite = ref(false)
const accepted = ref(false)

const customRules = computed(() => [{
	type: 'custom',
	options: {
		// Valide tant que la case n'est pas cochée, ou que le prérequis est rempli
		validate: (value: unknown) => value !== true || prerequisite.value,
		message: 'Vous devez d\\'abord valider le prérequis avant de cocher cette case.',
	},
}])
</script>`,
			},
		],
	},
	render: () => ({
		components: { SyCheckbox },
		setup() {
			const prerequisite = ref(false)
			const accepted = ref(false)

			const customRules = computed(() => [{
				type: 'custom',
				options: {
					validate: (value: unknown) => value !== true || prerequisite.value,
					message: 'Vous devez d\'abord valider le prérequis avant de cocher cette case.',
				},
			}])

			return { prerequisite, accepted, customRules }
		},
		template: `
			<div class="d-flex flex-column ga-2">
				<SyCheckbox v-model="prerequisite" label="Prérequis : j'ai lu le document" hide-details />
				<SyCheckbox
					v-model="accepted"
					label="J'accepte (uniquement si le prérequis est validé)"
					:custom-rules="customRules"
					:is-validate-on-blur="false"
				/>
			</div>
		`,
	}),
}

/**
 * Messages externes : l'état d'erreur est piloté par la prop errorMessages.
 */
export const ExternalMessages: Story = {
	args: {
		required: false,
		hasError: true,
		errorMessages: ['Cette case est invalide (message externe).'],
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyCheckbox
		v-model="accepted"
		label="J'accepte les conditions générales"
		:has-error="true"
		:error-messages="errorMessages"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckbox } from '@cnamts/synapse'

const accepted = ref(false)
const errorMessages = ['Cette case est invalide (message externe).']
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const accepted = ref(false)
			return { args, accepted }
		},
		template: `<SyCheckbox v-model="accepted" v-bind="args" />`,
	}),
}

/**
 * Avec `disableErrorHandling: true`, les règles sont ignorées visuellement : aucune erreur ne
 * s'affiche même si la case requise reste décochée (utile quand la validation est pilotée ailleurs).
 */
export const DisableErrorHandling: Story = {
	args: {
		required: true,
		disableErrorHandling: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyCheckbox
		ref="checkboxRef"
		v-model="accepted"
		label="J'accepte les conditions générales"
		required
		disable-error-handling
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyCheckbox } from '@cnamts/synapse'

const accepted = ref(false)
const checkboxRef = ref()

// Même en déclenchant la validation, aucune erreur ne s'affiche
onMounted(() => checkboxRef.value?.validateOnSubmit())
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox },
		setup() {
			const accepted = ref(false)
			const checkboxRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			onMounted(() => checkboxRef.value?.validateOnSubmit())
			return { args, accepted, checkboxRef }
		},
		template: `<SyCheckbox ref="checkboxRef" v-model="accepted" v-bind="args" />`,
	}),
}

/**
 * Intégration avec SyForm : la case s'enregistre automatiquement (useValidatable)
 * et est validée à la soumission du formulaire.
 */
export const SyFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Il faut privilégier l\'utilisation de `SyForm`, qui valide automatiquement les composants enregistrés via `useValidatable`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm @submit="onSubmit">
		<SyCheckbox v-model="accepted" label="J'accepte les conditions générales" required />
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckbox, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const accepted = ref(false)

function onSubmit(e: { isValid: boolean }) {
	alert(e.isValid ? 'Formulaire valide !' : 'Veuillez cocher la case.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox, SyForm, VBtn },
		setup() {
			const accepted = ref(false)
			function onSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Formulaire valide !' : 'Veuillez cocher la case.')
			}
			return { args, accepted, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<SyCheckbox v-model="accepted" v-bind="args" />
				<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Intégration avec un VForm Vuetify natif : la validation est déclenchée manuellement via la ref
 * du composant (`validateOnSubmit`). Il est toutefois recommandé d'utiliser `SyForm` pour
 * l'intégration automatique.
 */
export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec un `VForm` natif, la case n\'est pas auto-enregistrée : on appelle `validateOnSubmit()` via une ref. Préférez `SyForm` (cf. story SyFormValidation).',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<VForm @submit.prevent="handleSubmit">
		<SyCheckbox
			ref="checkboxRef"
			v-model="accepted"
			label="J'accepte les conditions générales"
			required
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckbox } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const accepted = ref(false)
const checkboxRef = ref()

async function handleSubmit() {
	const isValid = await checkboxRef.value?.validateOnSubmit()
	alert(isValid ? 'Formulaire valide !' : 'Veuillez cocher la case.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox, VForm, VBtn },
		setup() {
			const accepted = ref(false)
			const checkboxRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			async function handleSubmit() {
				const isValid = await checkboxRef.value?.validateOnSubmit()
				alert(isValid ? 'Formulaire valide !' : 'Veuillez cocher la case.')
			}

			return { args, accepted, checkboxRef, handleSubmit }
		},
		template: `
			<VForm @submit.prevent="handleSubmit">
				<SyCheckbox ref="checkboxRef" v-model="accepted" v-bind="args" />
				<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
			</VForm>
		`,
	}),
}

/**
 * Mode de validation natif Vuetify (`useVuetifyValidation`) intégré à `SyForm`.
 * Les règles sont de simples fonctions `(value) => true | 'message'`, comme la prop `rules` de Vuetify.
 */
export const SyFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Avec `use-vuetify-validation`, la case délègue sa validation à Vuetify via la prop `rules` (fonctions natives), tout en restant intégrée à `SyForm`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyForm @submit="handleSubmit">
		<SyCheckbox
			v-model="accepted"
			label="J'accepte les conditions générales"
			:use-vuetify-validation="true"
			:rules="vuetifyRules"
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckbox, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const accepted = ref(false)

const vuetifyRules = [
	(value: boolean | null) => value === true || 'Vous devez cocher cette case.',
]

function handleSubmit(e: { isValid: boolean }) {
	alert(e.isValid ? 'Formulaire valide !' : 'Veuillez cocher la case.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox, SyForm, VBtn },
		setup() {
			const accepted = ref(false)

			const vuetifyRules = [
				(value: boolean | null) => value === true || 'Vous devez cocher cette case.',
			]

			function handleSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Formulaire valide !' : 'Veuillez cocher la case.')
			}

			return { args, accepted, vuetifyRules, handleSubmit }
		},
		template: `
			<SyForm @submit="handleSubmit">
				<SyCheckbox
					v-bind="args"
					v-model="accepted"
					:use-vuetify-validation="true"
					:rules="vuetifyRules"
				/>
				<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Mode de validation natif Vuetify (`useVuetifyValidation`) dans un `VForm` Vuetify.
 */
export const VFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation déléguée à Vuetify (`use-vuetify-validation` + `rules`) dans un `VForm` natif.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<VForm @submit.prevent="handleSubmit">
		<SyCheckbox
			v-model="accepted"
			label="J'accepte les conditions générales"
			:use-vuetify-validation="true"
			:rules="vuetifyRules"
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckbox } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const accepted = ref(false)

const vuetifyRules = [
	(value: boolean | null) => value === true || 'Vous devez cocher cette case.',
]

async function handleSubmit(e: Promise<{ valid: boolean }>) {
	const { valid } = await e
	alert(valid ? 'Formulaire valide !' : 'Veuillez cocher la case.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckbox, VForm, VBtn },
		setup() {
			const accepted = ref(false)

			const vuetifyRules = [
				(value: boolean | null) => value === true || 'Vous devez cocher cette case.',
			]

			async function handleSubmit(e: Promise<{ valid: boolean }>) {
				const { valid } = await e
				alert(valid ? 'Formulaire valide !' : 'Veuillez cocher la case.')
			}

			return { args, accepted, vuetifyRules, handleSubmit }
		},
		template: `
			<VForm @submit.prevent="handleSubmit">
				<SyCheckbox
					v-bind="args"
					v-model="accepted"
					:use-vuetify-validation="true"
					:rules="vuetifyRules"
				/>
				<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
			</VForm>
		`,
	}),
}

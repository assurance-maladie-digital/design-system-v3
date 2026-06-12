import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SyCheckBoxGroup from '../SyCheckBoxGroup.vue'
import SyForm from '../../SyForm/SyForm.vue'
import { VBtn, VForm } from 'vuetify/components'

const meta: Meta<typeof SyCheckBoxGroup> = {
	title: 'Composants/Formulaires/SyCheckBoxGroup/Validation',
	component: SyCheckBoxGroup,
	parameters: {
		docs: {
			description: {
				component: 'Stories démontrant les différents cas de validation avec SyCheckBoxGroup.',
			},
		},
	},
	argTypes: {
		label: { control: 'text', description: 'Label du groupe' },
		options: { control: 'object', description: 'Liste des options' },
		required: { control: 'boolean', description: 'Champ requis' },
		disabled: { control: 'boolean', description: 'Désactivé' },
		readonly: { control: 'boolean', description: 'Lecture seule' },
		useVuetifyValidation: { control: 'boolean', description: 'Validation Vuetify native' },
		showSuccessMessages: { control: 'boolean', description: 'Afficher les messages de succès' },
		multiple: { control: 'boolean', description: 'Sélection multiple' },
	},
	args: {
		label: 'Choisissez une ou plusieurs options',
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
			{ label: 'Option C', value: 'c' },
		],
		required: true,
	},
}

export default meta
type Story = StoryObj<typeof SyCheckBoxGroup>

/**
 * Validation avec customRules (règles personnalisées Synapse)
 * Utilise le système de validation personnalisé du design system
 */
export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation avec customRules
Utilise les **customRules** pour définir des règles de validation personnalisées.

**Caractéristiques :**
- Règles de type ValidationRule (Synapse)
- Support des messages d'erreur, warning, success
- Validation programmatique via validateOnSubmit
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm ref="form" @submit="onSubmit">
		<SyCheckBoxGroup
			v-model="selected"
			label="Sélectionnez au moins 2 options"
			:options="options"
			:custom-rules="customRules"
			:multiple="true"
			required
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'
import type { ValidationRule } from '@/composables/unifyValidation/useValidation'

const selected = ref<string[]>([])

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

const customRules: ValidationRule[] = [
	{
		type: 'custom',
		options: {
			validate: (value: unknown) => Array.isArray(value) && value.length >= 2,
			message: 'Vous devez sélectionner au moins 2 options',
			fieldIdentifier: 'Options',
		},
	},
]

const onSubmit = (event: { isValid: boolean }) => {
	if (event.isValid) {
		alert('Formulaire valide !')
	}
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string[]>(['a'])

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: unknown) => Array.isArray(value) && value.length >= 2,
						message: 'Vous devez sélectionner au moins 2 options',
						fieldIdentifier: 'Options',
					},
				},
			]

			const onSubmit = (event: { isValid: boolean }) => {
				alert(event.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, selected, customRules, onSubmit }
		},
		template: `
			<SyForm ref="form" @submit="onSubmit">
				<SyCheckBoxGroup
					v-model="selected"
					v-bind="args"
					:custom-rules="customRules"
					:multiple="true"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Validation avec customWarningRules (règles d'avertissement Synapse)
 * La soumission est autorisée malgré le warning
 */
export const WithWarning: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation avec customWarningRules
Utilise les **customWarningRules** pour afficher un avertissement non bloquant.

**Caractéristiques :**
- Le warning n'empêche pas la soumission du formulaire
- Affiché avec la couleur warning (orange)
- Utile pour des conseils ou recommandations
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm ref="form" @submit="onSubmit">
		<SyCheckBoxGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			:custom-warning-rules="customWarningRules"
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'
import type { ValidationRule } from '@/composables/unifyValidation/useValidation'

const selected = ref<string | null>('b')

const options = [
	{ label: 'Option A (recommandée)', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

const customWarningRules: ValidationRule[] = [
	{
		type: 'custom',
		options: {
			validate: (value: unknown) => value === 'a',
			message: "L'option A est recommandée",
			fieldIdentifier: 'Option',
		},
	},
]

const onSubmit = (event: { isValid: boolean }) => {
	alert('Formulaire soumis (les warnings ne bloquent pas la soumission)')
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>('b')

			const customWarningRules = [
				{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === 'a',
						message: 'L\'option A est recommandée',
						fieldIdentifier: 'Option',
					},
				},
			]

			const onSubmit = () => {
				alert('Formulaire soumis (les warnings ne bloquent pas la soumission)')
			}

			return { args, selected, customWarningRules, onSubmit }
		},
		template: `
			<SyForm ref="form" @submit="onSubmit">
				<SyCheckBoxGroup
					v-model="selected"
					v-bind="args"
					:custom-warning-rules="customWarningRules"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Validation avec customSuccessRules (règles de succès Synapse)
 * Affiche un message de succès quand une option valide est sélectionnée
 */
export const WithSuccess: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une option valide est présélectionnée et déclenche la confirmation de succès au chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm ref="form" @submit="onSubmit">
		<SyCheckBoxGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			show-success-messages
			:custom-success-rules="customSuccessRules"
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'
import type { ValidationRule } from '@/composables/unifyValidation/useValidation'

const selected = ref<string | null>('a')

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

const customSuccessRules: ValidationRule[] = [
	{
		type: 'custom',
		options: {
			validate: (value: unknown) => value !== null && value !== undefined,
			successMessage: 'Sélection confirmée.',
		},
	},
]

const onSubmit = (event: { isValid: boolean }) => {
	if (event.isValid) {
		alert('Formulaire valide !')
	}
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>('a')

			const customSuccessRules = [
				{
					type: 'custom',
					options: {
						validate: (value: unknown) => value !== null && value !== undefined,
						successMessage: 'Sélection confirmée.',
					},
				},
			]

			const onSubmit = (event: { isValid: boolean }) => {
				alert(event.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, selected, customSuccessRules, onSubmit }
		},
		template: `
			<SyForm ref="form" @submit="onSubmit">
				<SyCheckBoxGroup
					v-model="selected"
					v-bind="args"
					show-success-messages
					:custom-success-rules="customSuccessRules"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * disableErrorHandling: true — la validation est complètement désactivée
 */
export const DisableErrorHandling: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### disableErrorHandling à true
Avec **disableErrorHandling: true**, toute la validation est désactivée : aucun message d'erreur, warning ou succès ne s'affiche, quelle que soit la valeur.

**Caractéristiques :**
- Aucune règle n'est évaluée
- Le champ ne passe jamais dans un état d'erreur visuel
- Utile pour des champs en lecture contrôlée par le parent
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm>
		<SyCheckBoxGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			disable-error-handling
			required
		/>
		<VBtn type="submit" color="primary">Valider (aucune erreur)</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)
			return { args, selected }
		},
		template: `
			<SyForm>
				<SyCheckBoxGroup
					v-model="selected"
					v-bind="args"
					disable-error-handling
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider (aucune erreur)</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Validation avec SyForm (composant formulaire du design system)
 * Utilise le système de validation unifié avec useValidation et useValidatable
 */
export const SyFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation avec SyForm
Utilise le composant **SyForm** du design system qui intègre le système de validation unifié.

**Caractéristiques :**
- Validation automatique à la soumission
- Gestion des erreurs via le composable useValidation
- Support des customRules, warningRules, successRules
- Messages de validation traduits
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm ref="form" @submit="onSubmit">
		<SyCheckBoxGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			required
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

const onSubmit = (event: { isValid: boolean }) => {
	if (event.isValid) {
		alert('Formulaire valide !')
	}
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)

			const onSubmit = (event: { isValid: boolean }) => {
				alert(event.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, selected, onSubmit }
		},
		template: `
			<SyForm ref="form" @submit="onSubmit">
				<SyCheckBoxGroup
					v-model="selected"
					v-bind="args"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Validation avec VForm natif (sans useVuetifyValidation)
 * Utilise VForm de Vuetify avec la validation Synapse
 */
export const VFormValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation avec VForm natif
Intégration avec **VForm** natif Vuetify en conservant la validation Synapse. La soumission appelle **validateOnSubmit()** manuellement sur le composant pour déclencher la validation.

**Caractéristiques :**
- Validation Synapse (customRules, required, etc.)
- Pas de useVuetifyValidation
- Appel manuel de validateOnSubmit() sur le ref du composant
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<VForm @submit.prevent="onSubmit">
		<SyCheckBoxGroup
			ref="checkboxRef"
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			required
			class="mb-4"
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const selected = ref<string | null>(null)
const checkboxRef = ref(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

async function onSubmit() {
	const isValid = await checkboxRef.value?.validateOnSubmit()
	if (isValid) {
		alert('Formulaire valide : ' + JSON.stringify(selected.value))
	} else {
		alert('Formulaire invalide : veuillez choisir une option.')
	}
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup, VForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)
			const checkboxRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			async function onSubmit() {
				const isValid = await checkboxRef.value?.validateOnSubmit()
				if (isValid) {
					alert(`Formulaire valide : ${JSON.stringify(selected.value)}`)
				}
				else {
					alert('Formulaire invalide : veuillez choisir une option.')
				}
			}

			return { args, selected, checkboxRef, onSubmit }
		},
		template: `
			<VForm @submit.prevent="onSubmit">
				<SyCheckBoxGroup
					ref="checkboxRef"
					v-model="selected"
					v-bind="args"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
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
				story: 'Avec `use-vuetify-validation`, le groupe délègue sa validation à Vuetify via la prop `rules` (fonctions natives), tout en restant intégré à `SyForm`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm @submit="onSubmit">
		<SyCheckBoxGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			:use-vuetify-validation="true"
			:rules="vuetifyRules"
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

const vuetifyRules = [
	(value: unknown) => (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined) || 'Veuillez sélectionner au moins une option.',
]

function onSubmit(e: { isValid: boolean }) {
	alert(e.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)

			const vuetifyRules = [
				(value: unknown) => (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined) || 'Veuillez sélectionner au moins une option.',
			]

			function onSubmit(e: { isValid: boolean }) {
				alert(e.isValid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, selected, vuetifyRules, onSubmit }
		},
		template: `
			<SyForm @submit="onSubmit">
				<SyCheckBoxGroup
					v-bind="args"
					v-model="selected"
					:use-vuetify-validation="true"
					:rules="vuetifyRules"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
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
				code: `
<template>
	<VForm @submit.prevent="onSubmit">
		<SyCheckBoxGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			:use-vuetify-validation="true"
			:rules="vuetifyRules"
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
]

const vuetifyRules = [
	(value: unknown) => (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined) || 'Veuillez sélectionner au moins une option.',
]

async function onSubmit(e: Promise<{ valid: boolean }>) {
	const { valid } = await e
	alert(valid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyCheckBoxGroup, VForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)

			const vuetifyRules = [
				(value: unknown) => (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined) || 'Veuillez sélectionner au moins une option.',
			]

			async function onSubmit(e: Promise<{ valid: boolean }>) {
				const { valid } = await e
				alert(valid ? 'Formulaire valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, selected, vuetifyRules, onSubmit }
		},
		template: `
			<VForm @submit.prevent="onSubmit">
				<SyCheckBoxGroup
					v-bind="args"
					v-model="selected"
					:use-vuetify-validation="true"
					:rules="vuetifyRules"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</VForm>
		`,
	}),
}

/**
 * Validation multiple avec customRules
 * Valide qu'au moins N options sont sélectionnées
 */
export const MultipleSelectionValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation de sélection multiple
Exemple de validation sur un groupe de checkboxes avec **multiple="true"**.
Valide que l'utilisateur a sélectionné au moins 2 options.

**Caractéristiques :**
- Mode multiple activé
- Règle personnalisée sur la taille du tableau
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm ref="form" @submit="onSubmit">
		<SyCheckBoxGroup
			v-model="selected"
			label="Sélectionnez au moins 2 options"
			:options="options"
			:multiple="true"
			:custom-rules="minSelectionRules"
			required
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'
import type { ValidationRule } from '@/composables/unifyValidation/useValidation'

const selected = ref<string[]>([])

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
	{ label: 'Option C', value: 'c' },
	{ label: 'Option D', value: 'd' },
]

const minSelectionRules: ValidationRule[] = [
	{
		type: 'custom',
		options: {
			validate: (value: unknown) => Array.isArray(value) && value.length >= 2,
			message: 'Veuillez sélectionner au moins 2 options',
			fieldIdentifier: 'Sélection',
		},
	},
]

const onSubmit = (event: { isValid: boolean }) => {
	if (event.isValid) {
		alert('Formulaire valide ! Sélection : ' + JSON.stringify(selected.value))
	}
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string[]>([])

			const minSelectionRules = [
				{
					type: 'custom',
					options: {
						validate: (value: unknown) => Array.isArray(value) && value.length >= 2,
						message: 'Veuillez sélectionner au moins 2 options',
						fieldIdentifier: 'Sélection',
					},
				},
			]

			const onSubmit = (event: { isValid: boolean }) => {
				alert(event.isValid ? 'Formulaire valide ! Sélection : ' + JSON.stringify(selected.value) : 'Veuillez corriger les erreurs.')
			}

			return { args, selected, minSelectionRules, onSubmit }
		},
		template: `
			<SyForm ref="form" @submit="onSubmit">
				<SyCheckBoxGroup
					v-model="selected"
					v-bind="args"
					:multiple="true"
					:custom-rules="minSelectionRules"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Validation avec customRules combinées (warning + success)
 * Démonstration de l'utilisation simultanée des règles warning et success
 */
export const CustomRules: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation combinée avec customRules
Ce story démontre l'utilisation simultanée des **customWarningRules** et **customSuccessRules**.

**Caractéristiques :**
- Warning si l'option A n'est pas sélectionnée
- Message de succès si l'option A est sélectionnée
- Validation immédiate (isValidateOnBlur: false)
			`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyCheckBoxGroup
		v-model="selected"
		:options="options"
		label="Options"
		:custom-warning-rules="warningRules"
		:custom-success-rules="successRules"
		:is-validate-on-blur="false"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyCheckBoxGroup } from '@cnamts/synapse'
import type { ValidationRule } from '@/composables/unifyValidation/useValidation'

const selected = ref<string | null>('A')

const options = [
	{ label: 'Option A', value: 'A' },
	{ label: 'Option B', value: 'B' },
]

const warningRules: ValidationRule[] = [
	{
		type: 'custom',
		options: {
			validate: (value: string | null) => {
				if (value !== 'A') {
					return "Vous devez sélectionner l'option A"
				}
				return true
			},
			fieldIdentifier: 'option',
		},
	},
]

const successRules: ValidationRule[] = [
	{
		type: 'custom',
		options: {
			validate: (value: string | null) => value === 'A',
			successMessage: 'Option A sélectionnée',
			fieldIdentifier: 'option',
		},
	},
]
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyCheckBoxGroup },
		setup() {
			const selected = ref<string | null>('A')
			const options = [
				{ label: 'Option A', value: 'A' },
				{ label: 'Option B', value: 'B' },
			]
			const warningRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string | null) => {
							if (value !== 'A') {
								return 'Vous devez sélectionner l\'option A'
							}
							return true
						},
					},
				},
			]
			const successRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string | null) => value === 'A',
						successMessage: 'Option A sélectionnée',
					},
				},
			]
			return { args, selected, options, warningRules, successRules }
		},
		template: `
			<SyCheckBoxGroup
				v-model="selected"
				label="Options"
				:options="options"
				:custom-warning-rules="warningRules"
				:custom-success-rules="successRules"
				:is-validate-on-blur="false"
			/>
		`,
	}),
}

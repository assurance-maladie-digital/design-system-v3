import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import SyRadioGroup from '../SyRadioGroup.vue'
import SyForm from '../../SyForm/SyForm.vue'
import { VBtn, VForm } from 'vuetify/components'

const meta: Meta<typeof SyRadioGroup> = {
	title: 'Composants/Formulaires/SyRadioGroup/Validation',
	component: SyRadioGroup,
	parameters: {
		docs: {
			description: {
				component: 'Stories démontrant les différents cas de validation avec SyRadioGroup.',
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
	},
	args: {
		label: 'Choisissez une option',
		options: [
			{ label: 'Option A', value: 'a' },
			{ label: 'Option B', value: 'b' },
		],
		required: true,
	},
}

export default meta
type Story = StoryObj<typeof SyRadioGroup>

/**
 * Validation avec SyForm (composant formulaire du design system)
 * Utilise le système de validation unifié avec useValidation et useValidatable
 */
export const WithSyForm: Story = {
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
		<SyRadioGroup
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
import { SyRadioGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
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
		components: { SyRadioGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide !')
				}
			}

			return { args, selected, onSubmit }
		},
		template: `
			<SyForm ref="form" @submit="onSubmit">
				<SyRadioGroup
					v-model="selected"
					v-bind="args"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Validation avec VForm (composant natif Vuetify) + useVuetifyValidation
 * Utilise la validation native de Vuetify
 */
export const WithVFormAndVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation avec VForm et useVuetifyValidation
Utilise le composant natif **VForm** de Vuetify avec la prop **useVuetifyValidation**.

**Caractéristiques :**
- Validation native Vuetify via les props :rules
- Compatible avec VForm de Vuetify
- Pas de messages de succès (Vuetify ne les gère pas)
- Validation côté template avec fonctions
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<VForm ref="form" @submit.prevent="submit">
		<SyRadioGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			:rules="rules"
			use-vuetify-validation
			required
		/>
		<VBtn type="submit" color="primary">Valider</VBtn>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyRadioGroup } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'
import type { VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'

const selected = ref<string | null>(null)
const form = ref<InstanceType<typeof VForm> | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
]

const rules: VuetifyValidationRule[] = [
	(v: string | null) => !!v || 'Une sélection est requise',
	(v: string | null) => v === 'a' || 'Vous devez sélectionner l'option A',
]

const submit = async () => {
	const { valid } = await form.value?.validate() || { valid: false }
	if (valid) {
		alert('Formulaire valide !')
	}
}
</script>`,
			},
		],
	},

	render: args => ({
		components: { SyRadioGroup, VForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)
			const form = ref<InstanceType<typeof VForm> | null>(null)

			const rules = [
				(v: string | null) => !!v || 'Une sélection est requise',
				(v: string | null) => v === 'a' || 'Vous devez sélectionner l\'option A',
			]

			const submit = async () => {
				const { valid } = await form.value?.validate() || { valid: false }
				if (valid) {
					alert('Formulaire valide !')
				}
			}

			return { args, selected, form, rules, submit }
		},
		template: `
			<VForm ref="form" @submit.prevent="submit">
				<SyRadioGroup
					v-model="selected"
					v-bind="args"
					:rules="rules"
					use-vuetify-validation
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</VForm>
		`,
	}),
}

/**
 * Validation avec SyForm et useVuetifyValidation
 * Combine le SyForm avec la validation Vuetify native
 */
export const WithSyFormAndVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation avec SyForm et useVuetifyValidation
Combine **SyForm** avec la prop **useVuetifyValidation** pour utiliser les règles Vuetify.

**Caractéristiques :**
- SyForm gère la soumission
- useVuetifyValidation active la validation native Vuetify
- Les règles sont passées via la prop :rules
				`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm ref="form" @submit="onSubmit">
		<SyRadioGroup
			v-model="selected"
			label="Choisissez une option"
			:options="options"
			:rules="rules"
			use-vuetify-validation
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
import { SyRadioGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'
import type { VuetifyValidationRule } from '@/composables/unifyValidation/useValidation'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
]

const rules: VuetifyValidationRule[] = [
	(v: string | null) => !!v || 'Une sélection est requise',
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
		components: { SyRadioGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>(null)

			const rules = [
				(v: string | null) => !!v || 'Une sélection est requise',
			]

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide !')
				}
			}

			return { args, selected, rules, onSubmit }
		},
		template: `
			<SyForm ref="form" @submit="onSubmit">
				<SyRadioGroup
					v-model="selected"
					v-bind="args"
					:rules="rules"
					use-vuetify-validation
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

/**
 * Validation avec customRules (règles personnalisées Synapse)
 * Utilise le système de validation personnalisé du design system
 */
export const WithCustomRules: Story = {
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
		<SyRadioGroup
			v-model="selected"
			label="Sélectionnez l'option A"
			:options="options"
			:custom-rules="customRules"
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
import { SyRadioGroup, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'
import type { ValidationRule } from '@/composables/validation/useValidation'

const selected = ref<string | null>(null)

const options = [
	{ label: 'Option A', value: 'A' },
	{ label: 'Option B', value: 'B' },
]

const customRules: ValidationRule[] = [
	{
		type: 'custom',
		options: {
			validate: (value: unknown) => value === 'A',
			message: 'Vous devez sélectionner l'option A',
			fieldIdentifier: 'Option',
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
		components: { SyRadioGroup, SyForm, VBtn },
		setup() {
			const selected = ref<string | null>('A')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: unknown) => value === 'A',
						message: 'Vous devez sélectionner l\'option A',
						fieldIdentifier: 'Option',
					},
				},
			]

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert('Formulaire valide !')
				}
			}

			return { args, selected, customRules, onSubmit }
		},
		template: `
			<SyForm ref="form" @submit="onSubmit">
				<SyRadioGroup
					v-model="selected"
					v-bind="args"
					:custom-rules="customRules"
				/>
				<VBtn type="submit" class="mt-2" color="primary">Valider</VBtn>
			</SyForm>
		`,
	}),
}

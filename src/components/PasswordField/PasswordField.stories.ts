import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PasswordField from './PasswordField.vue'
import type { PasswordFieldProps } from './types'
import { fn } from 'storybook/test'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'

type PasswordFieldStoryArgs = PasswordFieldProps & {
	'onUpdate:modelValue': (...args: unknown[]) => unknown
	'onSubmit': (...args: unknown[]) => unknown
}

const meta = {
	title: 'Composants/Formulaires/PasswordField',
	component: PasswordField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		controls: { exclude: '^on*' },
		docs: {
			description: {
				component: `PasswordField est un champ de saisie sécurisé pour les mots de passe`,
			},
		},
	},
	argTypes: {
		'locales': {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (libellés d\'affichage/masquage du mot de passe, message de champ requis et libellé de vidage). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant.',
			control: 'object',
			table: {
				type: { summary: 'object', detail: `{
	hidePassword: string,
	showPassword: string,
	showedPassword: string,
	hidedPassword: string,
	required: string,
	clearPassword: (label: string) => string,
}` },
				category: 'props',
			},
		},
		...getValidationDocumentation('string'),
		'modelValue': {
			control: 'text',
			description: 'Valeur du champ de mot de passe',
		},
		'variantStyle': {
			control: 'select',
			options: ['outlined', 'underlined'],
			description: 'Style du champ (contour ou souligné)',
		},
		'color': {
			control: 'select',
			options: ['primary', 'secondary', 'error', 'warning', 'success', 'info'],
			description: 'Couleur principale du champ',
		},
		'label': {
			control: 'text',
			description: 'Libellé du champ',
		},
		'displayAsterisk': {
			control: 'boolean',
			description: 'Affiche un astérisque à côté du libellé pour indiquer que le champ est obligatoire',
		},
		'bgColor': {
			control: 'color',
			description: 'Couleur de fond du champ',
		},
		'clearable': {
			control: 'boolean',
			description: 'Affiche un bouton pour vider le champ',
		},
		'autocompleteType': {
			control: 'select',
			options: ['current-password', 'new-password'],
			description: 'Type d\'auto-complétion',
			default: 'current-password',
		},
		'helpText': {
			control: 'text',
			description: 'Texte d\'aide affiché sous le champ',
		},
		'hideDetails': {
			control: 'boolean',
			description: 'Masque la zone de détails (messages d\'erreur, d\'aide…) sous le champ',
		},
		'update:modelValue': {
			action: 'update:modelValue',
			description: 'Événement émis lors de la mise à jour de la valeur du champ',
			table: {
				type: 'string',
			},
			category: 'Events',
		},
	},
	args: {
		'modelValue': '',
		'variantStyle': 'outlined',
		'color': 'primary',
		'label': 'Mot de passe',
		'required': false,
		'errorMessages': null,
		'warningMessages': null,
		'successMessages': null,
		'readonly': false,
		'disabled': false,
		'placeholder': 'Entrez votre mot de passe',
		'customRules': [],
		'customWarningRules': [],
		'customSuccessRules': [],
		'showSuccessMessages': false,
		'displayAsterisk': false,
		'clearable': false,
		'isValidateOnBlur': true,
		'bgColor': 'white',
		'onUpdate:modelValue': fn(),
	},
} as Meta<PasswordFieldStoryArgs>

export default meta

type Story = StoryObj<PasswordFieldStoryArgs>

/**
 * Story par défaut montrant un champ de mot de passe basique.
 */
export const Default: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PasswordField
						v-model="password"
						label="Mot de passe"
						placeholder="Entrez votre mot de passe"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('')
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { PasswordField },
		setup() {
			const password = ref(args.modelValue ?? '')
			return { args, password }
		},
		template: `
			<PasswordField
				v-bind="args"
				v-model="password"
			/>
		`,
	}),
}

/**
 * Champ de mot de passe avec validation requise.
 */
export const Required: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PasswordField
						v-model="password"
						label="Mot de passe"
						:required="true"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		required: true,
		displayAsterisk: false,
	},
}

/**
 * Champ de mot de passe avec validation requise avec asterisk.
 */
export const RequiredWithAsterisk: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PasswordField
						v-model="password"
						label="Mot de passe"
						:required="true"
						:display-asterisk="true"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		required: true,
		displayAsterisk: true,
	},
}

/**
 * Champ de mot de passe désactivé.
 */
export const Disabled: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PasswordField
						v-model="password"
						label="Mot de passe"
						:disabled="true"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('MonMotDePasse123')
				</script>
				`,
			},
		],
	},
	args: {
		disabled: true,
		modelValue: 'MonMotDePasse123',
	},
}

/**
 * Champ de mot de passe en lecture seule.
 */
export const ReadOnly: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PasswordField
						v-model="password"
						label="Mot de passe"
						:readonly="true"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('MonMotDePasse123')
				</script>
				`,
			},
		],
	},
	args: {
		readonly: true,
		modelValue: 'MonMotDePasse123',
	},
}

export const HelpText: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PasswordField
						v-model="password"
						label="Mot de passe"
						:help-text="helpText"
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('MonMotDePasse123')
					const helpText = ref('Votre mot de passe doit contenir au moins 8 caractères.')
				</script>
				`,
			},
		],
	},
	args: {
		helpText: 'Votre mot de passe doit contenir au moins 8 caractères.',
		modelValue: 'MonMotDePasse123',
	},
}

export const HideDetails: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
				<template>
					<PasswordField
						v-model="password"
						label="Mot de passe"
						:hide-details="true"
						required
					/>
				</template>
				`,
			},
			{
				name: 'Script',
				code: `
				<script setup lang="ts">
					import { ref } from 'vue'
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('')
				</script>
				`,
			},
		],
	},
	args: {
		hideDetails: true,
		required: true,
		modelValue: '',
	},
}

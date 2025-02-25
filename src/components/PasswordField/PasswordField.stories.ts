import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import PasswordField from './PasswordField.vue'
import { VBtn } from 'vuetify/components'

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
		docs: {
			description: {
				component: 'Le composant PasswordField est un champ de saisie sécurisé pour les mots de passe. Il hérite des fonctionnalités du SyTextField avec des fonctionnalités spécifiques pour la gestion des mots de passe comme le masquage/affichage du texte et la validation avancée.',
			},
		},
	},
	argTypes: {
		modelValue: {
			description: 'La valeur du modèle pour le champ.',
			control: 'text',
			default: null,
			table: {
				type: {
					summary: 'string | null',
				},
			},
		},
		variantStyle: {
			description: 'Définit le style visuel du champ (outlined ou underlined).',
			control: 'select',
			options: ['outlined', 'underlined'],
			default: 'outlined',
			table: {
				type: {
					summary: 'string',
				},
				defaultValue: { summary: 'outlined' },
			},
		},
		required: {
			description: 'Indique si le champ est requis.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: 'false' },
			},
		},
		isValidateOnBlur: {
			control: 'boolean',
			description: 'Active la validation automatique lors de la perte de focus',
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: 'true' },
			},
		},
		customRules: {
			description: 'Règles de validation personnalisées pour les erreurs.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
					detail: '{ type: string, options: { message: string, validate: (value: string) => string } }[]',
				},
			},
		},
		customWarningRules: {
			description: 'Règles de validation personnalisées pour les avertissements.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
					detail: '{ type: string, options: { warningMessage: string, validate: (value: string) => string } }[]',
				},
			},
		},
		customSuccessRules: {
			description: 'Règles de validation personnalisées pour les succès.',
			control: 'object',
			table: {
				type: {
					summary: 'array',
					detail: '{ type: string, options: { successMessage: string, validate: (value: string) => string } }[]',
				},
			},
		},
		showSuccessMessages: {
			description: 'Affiche les messages de succès.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: 'false' },
			},
		},
		isDisabled: {
			description: 'Désactive le champ.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: 'false' },
			},
		},
		isReadOnly: {
			description: 'Rend le champ en lecture seule.',
			control: 'boolean',
			default: false,
			table: {
				type: {
					summary: 'boolean',
				},
				defaultValue: { summary: 'false' },
			},
		},
	},
} satisfies Meta<typeof PasswordField>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Story par défaut montrant un champ de mot de passe simple.
 */
export const Default: Story = {
	args: {
		modelValue: '',
		variantStyle: 'outlined',
		required: false,
		isValidateOnBlur: true,
		customRules: [],
		showSuccessMessages: false,
	},
	render: (args) => {
		return {
			components: { PasswordField },
			setup() {
				return { args }
			},
			template: `
                <PasswordField v-bind="args" v-model="args.modelValue"/>
            `,
		}
	},
	parameters: {
		docs: {
			description: {
				story: 'Version basique du champ de mot de passe avec le style outlined par défaut.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PasswordField
    v-model="password"
    variant-style="outlined"
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField from '@cnamts/synapse'

const password = ref('')
</script>
        `,
			},
		],
	},
}

/**
 * Story avec champ requis.
 */
export const Required: Story = {
	args: {
		...Default.args,
		required: true,
	},
	parameters: {
		docs: {
			description: {
				story: 'Champ de mot de passe requis avec validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PasswordField
    v-model="password"
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
import PasswordField from '@cnamts/synapse'

const password = ref('')
</script>
        `,
			},
		],
	},
}

/**
 * Story avec validation et différents états
 */
export const WithValidation: Story = {
	args: {
		...Default.args,
		modelValue: '',
		required: true,
		showSuccessMessages: true,
		customRules: [
			{
				type: 'custom',
				options: {
					message: 'Le mot de passe doit contenir au moins 8 caractères',
					validate: (value: string) => value.length >= 8,
				},
			},
		],
		customWarningRules: [
			{
				type: 'custom',
				options: {
					warningMessage: 'Le mot de passe devrait contenir des caractères spéciaux',
					validate: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
				},
			},
		],
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					successMessage: 'Le mot de passe est fort',
					validate: (value: string) => {
						const hasLength = value.length >= 8
						const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
						const hasNumber = /[0-9]/.test(value)
						return hasLength && hasSpecial && hasNumber
					},
				},
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story: 'Exemple de champ avec validation complète : erreur, warning et succès.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PasswordField
    v-model="password"
    :required="true"
    :show-success-messages="true"
    :custom-rules="customRules"
    :custom-warning-rules="customWarningRules"
    :custom-success-rules="customSuccessRules"
  />
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField from '@cnamts/synapse'

const password = ref('')

const customRules = [{
  type: 'custom',
  options: {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
    validate: (value: string) => value.length >= 8,
  },
}]

const customWarningRules = [{
  type: 'custom',
  options: {
    warningMessage: 'Le mot de passe devrait contenir des caractères spéciaux',
    validate: (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
  },
}]

const customSuccessRules = [{
  type: 'custom',
  options: {
    successMessage: 'Le mot de passe est fort',
    validate: (value: string) => {
      const hasLength = value.length >= 8
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
      const hasNumber = /[0-9]/.test(value)
      return hasLength && hasSpecial && hasNumber
    },
  },
}]
</script>
				`,
			},
		],
	},
}

/**
 * Story avec validation complète (erreur, warning, succès).
 */
export const WithFullValidation: Story = {
	args: {
		...Default.args,
		showSuccessMessages: true,
		customRules: [
			{
				type: 'minLength',
				options: {
					length: 8,
					message: 'Le mot de passe doit comporter au moins 8 caractères.',
					validate: (value: string) => value.length >= 8,
				},
			},
		],
		customWarningRules: [
			{
				type: 'custom',
				options: {
					warningMessage: 'Le mot de passe devrait contenir au moins une majuscule.',
					validate: (value: string) => /[A-Z]/.test(value),
				},
			},
		],
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					successMessage: 'Le mot de passe est fort !',
					validate: (value: string) => {
						const hasLength = value.length >= 8
						const hasUpper = /[A-Z]/.test(value)
						const hasLower = /[a-z]/.test(value)
						const hasNumber = /[0-9]/.test(value)
						return hasLength && hasUpper && hasLower && hasNumber
					},
				},
			},
		],
	},
	parameters: {
		docs: {
			description: {
				story: 'Exemple complet avec validation montrant les différents états (erreur, warning, succès) et leurs icônes associées.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
  <PasswordField
    v-model="password"
    :show-success-messages="true"
    :custom-rules="[
      {
        type: 'minLength',
        options: {
          length: 8,
          message: 'Le mot de passe doit comporter au moins 8 caractères.'
        }
      }
    ]"
    :custom-warning-rules="[
      {
        type: 'custom',
        options: {
          warningMessage: 'Le mot de passe devrait contenir au moins une majuscule.',
          validate: value => /[A-Z]/.test(value)
        }
      }
    ]"
    :custom-success-rules="[
      {
        type: 'custom',
        options: {
          successMessage: 'Le mot de passe est fort !',
          validate: value => 
            value.length >= 8 && 
            /[A-Z]/.test(value) && 
            /[a-z]/.test(value) && 
            /[0-9]/.test(value)
        }
      }
    ]"
  />
</template>
        `,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField from '@cnamts/synapse'

const password = ref('')
</script>
        `,
			},
		],
	},
}

/**
 * Story avec validation de formulaire
 */
export const WithFormValidation: Story = {
	args: {
		...Default.args,
		required: true,
		customRules: [
			{
				type: 'custom',
				options: {
					message: 'Le mot de passe doit contenir au moins 8 caractères',
					validate: (value: string) => value.length >= 8,
				},
			},
		],
	},
	render: args => ({
		components: { PasswordField, VBtn },
		setup() {
			const password = ref('')
			const passwordFieldRef = ref()
			const isValid = ref(false)

			function handleSubmit() {
				isValid.value = passwordFieldRef.value?.validateOnSubmit() ?? false
				alert(isValid.value ? 'Formulaire soumis avec succès !' : 'Veuillez corriger les erreurs avant de soumettre.')
			}

			return { args, password, passwordFieldRef, isValid, handleSubmit }
		},
		template: `
			<form @submit.prevent="handleSubmit">
				<PasswordField
					ref="passwordFieldRef"
					v-model="password"
					v-bind="args"
					label="Mot de passe"
				/>
				<div>
					<VBtn type="submit" class="mt-4" color="primary">
						Valider
					</VBtn>
				</div>
			</form>
		`,
	}),
	parameters: {
		docs: {
			description: {
				story: 'Exemple de validation de formulaire avec le composant PasswordField.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<form @submit.prevent="handleSubmit">
		<PasswordField
			ref="passwordFieldRef"
			v-model="password"
			required
			:custom-rules="[
				{
					type: 'custom',
					options: {
						message: 'Le mot de passe doit contenir au moins 8 caractères',
						validate: value => value.length >= 8
					}
				}
			]"
		/>
		<VBtn type="submit" class="mt-4" color="primary">
			Valider
		</VBtn>
	</form>
</template>
				`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import PasswordField from '@cnamts/synapse'

const password = ref('')
const passwordFieldRef = ref()
const isValid = ref(false)

function handleSubmit() {
	isValid.value = passwordFieldRef.value?.validateOnSubmit() ?? false
	alert(isValid.value ? 'Formulaire soumis avec succès !' : 'Veuillez corriger les erreurs avant de soumettre.')
}
</script>
				`,
			},
		],
	},
}

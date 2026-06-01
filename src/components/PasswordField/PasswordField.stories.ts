import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import PasswordField from './PasswordField.vue'

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
				component: `PasswordField est un champ de saisie sécurisé pour les mots de passe`,
			},
		},
	},
	argTypes: {
		modelValue: {
			control: 'text',
			description: 'Valeur du champ de mot de passe',
		},
		variantStyle: {
			control: 'select',
			options: ['outlined', 'underlined'],
			description: 'Style du champ (contour ou souligné)',
		},
		color: {
			control: 'select',
			options: ['primary', 'secondary', 'error', 'warning', 'success', 'info'],
			description: 'Couleur principale du champ',
		},
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
		required: {
			control: 'boolean',
			description: 'Indique si le champ est obligatoire',
		},
		errorMessages: {
			control: 'object',
			description: 'Messages d\'erreur à afficher',
		},
		warningMessages: {
			control: 'object',
			description: 'Messages d\'avertissement à afficher',
		},
		successMessages: {
			control: 'object',
			description: 'Messages de succès à afficher',
		},
		readonly: {
			control: 'boolean',
			description: 'Indique si le champ est en lecture seule',
		},
		disabled: {
			control: 'boolean',
			description: 'Indique si le champ est désactivé',
		},
		placeholder: {
			control: 'text',
			description: 'Texte d\'indication affiché lorsque le champ est vide',
		},
		customRules: {
			control: 'object',
			description: 'Règles de validation personnalisées',
		},
		customWarningRules: {
			control: 'object',
			description: 'Règles d\'avertissement personnalisées',
		},
		customSuccessRules: {
			control: 'object',
			description: 'Règles de succès personnalisées',
		},
		successDisplay: {
			control: 'select',
			options: ['none', 'icon', 'all'],
			description: 'Contrôle l\'affichage du succès : `none` masque tout, `icon` affiche bordure + icône sans texte, `all` affiche tout.',
			table: {
				type: { summary: '\'none\' | \'icon\' | \'all\'' },
				defaultValue: { summary: '\'none\'' },
			},
		},
		displayAsterisk: {
			control: 'boolean',
			description: 'Affiche un astérisque à côté du libellé pour indiquer que le champ est obligatoire',
		},
		isValidateOnBlur: {
			control: 'boolean',
			description: 'Indique si la validation doit être effectuée lors de la perte de focus',
		},
		bgColor: {
			control: 'color',
			description: 'Couleur de fond du champ',
		},
		autocompleteType: {
			control: 'select',
			options: ['current-password', 'new-password'],
			description: 'Type d\'auto-complétion',
			default: 'current-password',
		},
	},
	args: {
		modelValue: '',
		variantStyle: 'outlined',
		color: 'primary',
		label: 'Mot de passe',
		required: false,
		errorMessages: null,
		warningMessages: null,
		successMessages: null,
		readonly: false,
		disabled: false,
		placeholder: 'Entrez votre mot de passe',
		customRules: [],
		customWarningRules: [],
		customSuccessRules: [],
		displayAsterisk: false,
		isValidateOnBlur: true,
		bgColor: 'white',
	},
} satisfies Meta<typeof PasswordField>

export default meta

type Story = StoryObj<typeof meta>

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
			const password = ref(args.modelValue)
			return { args, password }
		},
		template: `
			<PasswordField
				v-model="password"
				:variant-style="args.variantStyle"
				:color="args.color"
				:label="args.label"
				:required="args.required"
				:error-messages="args.errorMessages"
				:warning-messages="args.warningMessages"
				:success-messages="args.successMessages"
				:readonly="args.readonly"
				:disabled="args.disabled"
				:placeholder="args.placeholder"
				:custom-rules="args.customRules"
				:custom-warning-rules="args.customWarningRules"
				:custom-success-rules="args.customSuccessRules"
				:success-display="args.successDisplay"
				:display-asterisk="args.displayAsterisk"
				:is-validate-on-blur="args.isValidateOnBlur"
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

/**
 * Champ de mot de passe avec règles de validation qui génèrent une erreur.
 */
export const WithError: Story = {
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
						:custom-rules="customRules"
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
					
					const password = ref('Mdp123')
					
					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || value.length < 8) {
										return 'Le mot de passe doit contenir au moins 8 caractères'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'Mdp123',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value || value.length < 8) {
							return 'Le mot de passe doit contenir au moins 8 caractères'
						}
						return true
					},
					fieldIdentifier: 'password',
				},
			},
		],
	},
}

/**
 * Champ de mot de passe avec règles de validation qui génèrent un avertissement.
 */
export const WithWarning: Story = {
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
						:custom-warning-rules="customWarningRules"
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
					
					const password = ref('MotDePasse123')
					
					const customWarningRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
									if (!hasSpecialChar) {
										return 'Le mot de passe pourrait être plus fort avec des caractères spéciaux'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'MotDePasse123',
		customWarningRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
						if (!hasSpecialChar) {
							return 'Le mot de passe pourrait être plus fort avec des caractères spéciaux'
						}
						return true
					},
					fieldIdentifier: 'password',
				},
			},
		],
	},
}

/**
 * Champ de mot de passe avec règles de validation qui génèrent un succès.
 */
export const WithSuccess: Story = {
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
					import { PasswordField } from '@cnamts/synapse'
					
					const password = ref('MotDePasse123!@#')
					
					const customSuccessRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									const hasUpperCase = /[A-Z]/.test(value)
									const hasLowerCase = /[a-z]/.test(value)
									const hasNumber = /[0-9]/.test(value)
									const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
									const hasMinLength = value.length >= 8
									
									if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength) {
										return 'Mot de passe fort'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	args: {
		modelValue: 'MotDePasse123!@#',
		successDisplay: 'all',
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						const hasUpperCase = /[A-Z]/.test(value)
						const hasLowerCase = /[a-z]/.test(value)
						const hasNumber = /[0-9]/.test(value)
						const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value)
						const isLongEnough = value.length >= 8

						if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && isLongEnough) {
							return true
						}
						return false
					},
					successMessage: 'Mot de passe fort',
				},
			},
		],
	},
}

/**
 * Démonstration des différents types de validation (erreurs, avertissements, succès).
 */
export const WithValidation: Story = {
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
						:custom-rules="customRules"
						:custom-warning-rules="customWarningRules"
						:custom-success-rules="customSuccessRules"
						:success-display="true"
						:display-asterisk="true"
						:is-validate-on-blur="false"
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
					
					// Règles personnalisées pour la validation du mot de passe
					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || value.length < 8) {
										return 'Le mot de passe doit contenir au moins 8 caractères'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
					
					const customWarningRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
										return 'Le mot de passe pourrait être plus fort avec des caractères spéciaux (ex: ! @ &)'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
					
					const customSuccessRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (value && value.length >= 12
										&& /[A-Z]/.test(value)
										&& /[0-9]/.test(value)
										&& /[!@#$%^&*(),.?":{}|<>]/.test(value)) {
										return 'Mot de passe très sécurisé !'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { PasswordField },
		setup() {
			const password = ref('')

			// Règles personnalisées pour la validation du mot de passe
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.length < 8) {
								return 'Le mot de passe doit contenir au moins 8 caractères'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			const customWarningRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
								return 'Le mot de passe pourrait être plus fort avec des caractères spéciaux'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			const customSuccessRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (value && value.length >= 12
								&& /[A-Z]/.test(value)
								&& /[0-9]/.test(value)
								&& /[!@#$%^&*(),.?":{}|<>]/.test(value)) {
								return true
							}
							return 'Pas encore un mot de passe fort'
						},
						successMessage: 'Mot de passe très sécurisé !',
						fieldIdentifier: 'password',
					},
				},
			]

			return { args, password, customRules, customWarningRules, customSuccessRules }
		},
		template: `
			<div>
				<p class="mb-2">Entrez un mot de passe pour voir les différents types de validation :</p>
				<PasswordField
					v-model="password"
					:variant-style="args.variantStyle"
					:color="args.color"
					label="Mot de passe"
					:required="true"
					:custom-rules="customRules"
					:custom-warning-rules="customWarningRules"
					:custom-success-rules="customSuccessRules"
					:success-display="true"
					:display-asterisk="true"
					:is-validate-on-blur="true"
				/>
				<div class="mt-4">
					<p><strong>Conseils pour tester :</strong></p>
					<ul>
						<li>Laissez le champ vide pour voir l'erreur de champ requis</li>
						<li>Entrez moins de 8 caractères pour voir l'erreur de longueur</li>
						<li>Entrez un mot de passe sans caractères spéciaux pour voir l'avertissement</li>
						<li>Entrez un mot de passe fort (12+ caractères avec majuscules, chiffres et caractères spéciaux) pour voir le message de succès</li>
					</ul>
				</div>
			</div>
		`,
	}),
}

/**
 * Champ de mot de passe avec règles de validation personnalisées.
 */
export const WithCustomRules: Story = {
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
						:custom-rules="customRules"
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
					
					// Règles personnalisées pour la validation du mot de passe
					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value: string) => {
									if (!value || value.length < 8) {
										return 'Le mot de passe doit contenir au moins 8 caractères'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value) => {
									if (!value || !/[A-Z]/.test(value)) {
										return 'Le mot de passe doit contenir au moins une lettre majuscule'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value) => {
									if (!value || !/[0-9]/.test(value)) {
										return 'Le mot de passe doit contenir au moins un chiffre'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { PasswordField },
		setup() {
			const password = ref(args.modelValue)

			// Règles personnalisées pour la validation du mot de passe
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.length < 8) {
								return 'Le mot de passe doit contenir au moins 8 caractères'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/[A-Z]/.test(value)) {
								return 'Le mot de passe doit contenir au moins une lettre majuscule'
							}
							return true
						},
						fieldIdentifier: 'password',
						successMessage: 'Le mot de passe est sécurisé',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/[0-9]/.test(value)) {
								return 'Le mot de passe doit contenir au moins un chiffre'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			return { args, password, customRules }
		},
		template: `
			<PasswordField
				v-model="password"
				:variant-style="args.variantStyle"
				:color="args.color"
				:label="args.label"
				:required="args.required"
				:readonly="args.readonly"
				:disabled="args.disabled"
				:placeholder="args.placeholder"
				:custom-rules="customRules"
				:success-display="args.successDisplay"
				:display-asterisk="args.displayAsterisk"
				:is-validate-on-blur="args.isValidateOnBlur"
			/>
		`,
	}),
}

/**
 * Démonstration de la validation de formulaire avec la méthode validateOnSubmit.
 */
export const WithFormValidation: Story = {
	parameters: {
		a11y: {
			disable: true,
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
							label="Mot de passe"
							:required="true"
							:custom-rules="customRules"
							:display-asterisk="true"
							:is-validate-on-blur="false"
						/>
						<button 
							type="submit" 
							class="mt-4 px-4 py-2 bg-primary text-white rounded"
						>
							Valider
						</button>
					</form>
					<div v-if="formStatus" class="mt-4 p-4 rounded" :class="formStatus.includes('succès') ? 'bg-success-lighten5' : 'bg-error-lighten5'">
						{{ formStatus }}
					</div>
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
					const passwordFieldRef = ref(null)
					const formStatus = ref('')
					
					// Règles personnalisées pour la validation du mot de passe
					const customRules = [
						{
							type: 'custom',
							options: {
								validate: (value) => {
									if (!value || value.length < 8) {
										return 'Le mot de passe doit contenir au moins 8 caractères'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
						{
							type: 'custom',
							options: {
								validate: (value) => {
									if (!value || !/[A-Z]/.test(value)) {
										return 'Le mot de passe doit contenir au moins une lettre majuscule'
									}
									return true
								},
								fieldIdentifier: 'password',
							},
						},
					]
					
					// Fonction de soumission du formulaire
					const handleSubmit = async (): Promise<void> => {
						if (passwordFieldRef.value) {
							const isValid = await passwordFieldRef.value.validateOnSubmit()
							if (isValid) {
								formStatus.value = 'Formulaire soumis avec succès !'
							} else {
								formStatus.value = 'Erreur de validation, veuillez corriger les champs'
							}
						}
					}
				</script>
				`,
			},
		],
	},
	render: args => ({
		components: { PasswordField },
		setup() {
			const password = ref('')
			const passwordFieldRef = ref<InstanceType<typeof PasswordField> | null>(null)
			const formStatus = ref('')

			// Règles personnalisées pour la validation du mot de passe
			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.length < 8) {
								return 'Le mot de passe doit contenir au moins 8 caractères'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/[A-Z]/.test(value)) {
								return 'Le mot de passe doit contenir au moins une lettre majuscule'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			// Fonction de soumission du formulaire
			const handleSubmit = async () => {
				if (passwordFieldRef.value) {
					const isValid = await passwordFieldRef.value.validateOnSubmit()
					if (isValid) {
						formStatus.value = 'Formulaire soumis avec succès !'
					}
					else {
						formStatus.value = 'Erreur de validation, veuillez corriger les champs'
					}
				}
			}

			return { args, password, passwordFieldRef, customRules, handleSubmit, formStatus }
		},
		template: `
			<div>
				<form @submit.prevent="handleSubmit" class="mb-4">
					<PasswordField
						ref="passwordFieldRef"
						v-model="password"
						:variant-style="args.variantStyle"
						:color="args.color"
						label="Mot de passe"
						:required="true"
						:custom-rules="customRules"
						:display-asterisk="true"
						:is-validate-on-blur="false"
					/>
					<button 
						type="submit" 
						class="mt-4 px-4 py-2 bg-primary text-white rounded"
					>
						Valider
					</button>
				</form>
				<div v-if="formStatus" class="mt-4 p-4 rounded" :class="formStatus.includes('succès') ? 'bg-success-lighten5' : 'bg-error-lighten5'">
					{{ formStatus }}
				</div>
				<div class="mt-4">
					<p><strong>Instructions :</strong></p>
					<p>Ce formulaire utilise la méthode <code>validateOnSubmit()</code> pour valider le champ lors de la soumission.</p>
					<p>La validation ne se fait pas à la perte de focus (<code>isValidateOnBlur="false"</code>) mais uniquement lors du clic sur le bouton.</p>
				</div>
			</div>
		`,
	}),
}

export const WithoutSuccessMessages: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: `
### Contrôle de l'affichage du succès

Cette story illustre la propriété \`successDisplay\` avec ses trois valeurs : \`'none'\` (défaut, rien affiché), \`'icon'\` (bordure + icône sans texte), \`'all'\` (tout affiché).
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <PasswordField
    v-model="value1"
    label="successDisplay: 'all'"
    required
    success-display="all"
  />
  <PasswordField
    v-model="value2"
    label="successDisplay: 'icon'"
    required
    success-display="icon"
  />
  <PasswordField
    v-model="value3"
    label="successDisplay: 'none' (défaut)"
    required
  />
</template>`,
			},
		],
	},
	render: () => ({
		components: { PasswordField },
		setup() {
			const value1 = ref('P@ssw0rd123')
			const value2 = ref('P@ssw0rd123')
			const value3 = ref('P@ssw0rd123')

			return { value1, value2, value3 }
		},
		template: `
			<div class="pa-4 d-flex flex-column" style="gap: 24px;">
				<div>
					<p class="text-subtitle-2 mb-2">successDisplay="all" — bordure + icône + texte</p>
					<PasswordField v-model="value1" label="Mot de passe" required success-display="all" />
				</div>
				<div>
					<p class="text-subtitle-2 mb-2">successDisplay="icon" — bordure + icône, sans texte</p>
					<PasswordField v-model="value2" label="Mot de passe" required success-display="icon" />
				</div>
				<div>
					<p class="text-subtitle-2 mb-2">successDisplay="none" (défaut) — rien affiché</p>
					<PasswordField v-model="value3" label="Mot de passe" required />
				</div>
			</div>
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		a11y: {
			disable: true,
		},
		docs: {
			description: {
				story: `
### Désactivation de la gestion des erreurs

Cette story illustre l'utilisation de la propriété \`disableErrorHandling\` qui permet de désactiver complètement
la gestion et l'affichage des erreurs dans un champ, même si des règles de validation sont définies.

Cela peut être utile dans des cas particuliers où vous souhaitez définir des règles de validation
mais gérer leur affichage différemment, ou utiliser la validation uniquement au niveau du formulaire parent.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <!-- Champ avec validation normale -->
  <PasswordField
    v-model="value1"
    label="Mot de passe avec validation"
    required
    :custom-rules="customRules"
  />

  <!-- Champ avec gestion d'erreurs désactivée -->
  <PasswordField
    v-model="value2"
    label="Mot de passe sans gestion d'erreurs"
    required
    disableErrorHandling
    :custom-rules="customRules"
  />
</template>`,
			},
		],
	},
	render: () => ({
		components: { PasswordField },
		setup() {
			const value1 = ref('')
			const value2 = ref('')

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || value.length < 8) {
								return 'Le mot de passe doit contenir au moins 8 caractères'
							}
							return true
						},
						fieldIdentifier: 'password',
					},
				},
			]

			return { value1, value2, customRules }
		},
		template: `
			<div>
				<p class="mb-4">Cette démonstration compare un PasswordField standard et un avec \`disableErrorHandling=true\`.</p>

				<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 16px;">
					<div>
						<p class="text-subtitle-2 mb-2">Validation normale</p>
						<PasswordField
							v-model="value1"
							label="Mot de passe avec validation"
							required
							:custom-rules="customRules"
						/>
					</div>

					<div>
						<p class="text-subtitle-2 mb-2">Sans gestion d'erreurs</p>
						<PasswordField
							v-model="value2"
							label="Mot de passe sans gestion d'erreurs"
							required
							disableErrorHandling
							:custom-rules="customRules"
						/>
					</div>
				</div>

				<div class="mt-4 text-body-2">
					<p>Instructions :</p>
					<ol>
						<li class="ml-4">Cliquez dans un champ puis en dehors pour déclencher la validation</li>
						<li class="ml-4">Le champ de gauche affichera une erreur requise, mais pas celui de droite</li>
						<li class="ml-4">Vous pouvez également essayer de soumettre les deux champs pour voir la différence de comportement</li>
					</ol>
				</div>
			</div>
		`,
	}),
}

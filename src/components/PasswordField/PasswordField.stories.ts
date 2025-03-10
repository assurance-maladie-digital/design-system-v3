import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import PasswordField from './PasswordField.vue'

const meta = {
	title: 'Composants/Formulaires/Passwordfield',
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
		isReadOnly: {
			control: 'boolean',
			description: 'Indique si le champ est en lecture seule',
		},
		isDisabled: {
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
		showSuccessMessages: {
			control: 'boolean',
			description: 'Indique si les messages de succès doivent être affichés',
		},
		displayAsterisk: {
			control: 'boolean',
			description: 'Affiche un astérisque à côté du libellé pour indiquer que le champ est obligatoire',
		},
		isValidateOnBlur: {
			control: 'boolean',
			description: 'Indique si la validation doit être effectuée lors de la perte de focus',
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
		isReadOnly: false,
		isDisabled: false,
		placeholder: 'Entrez votre mot de passe',
		customRules: [],
		customWarningRules: [],
		customSuccessRules: [],
		showSuccessMessages: true,
		displayAsterisk: false,
		isValidateOnBlur: true,
	},
} satisfies Meta<typeof PasswordField>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Story par défaut montrant un champ de mot de passe basique.
 */
export const Default: Story = {
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
				:is-read-only="args.isReadOnly"
				:is-disabled="args.isDisabled"
				:placeholder="args.placeholder"
				:custom-rules="args.customRules"
				:custom-warning-rules="args.customWarningRules"
				:custom-success-rules="args.customSuccessRules"
				:show-success-messages="args.showSuccessMessages"
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
	args: {
		required: true,
		displayAsterisk: false,
	},
}

/**
 * Champ de mot de passe avec validation requise avec asterisk.
 */
export const RequiredWithAsterisk: Story = {
	args: {
		required: true,
		displayAsterisk: true,
	},
}

/**
 * Champ de mot de passe avec style souligné.
 */
export const Underlined: Story = {
	args: {
		variantStyle: 'underlined',
	},
}

/**
 * Champ de mot de passe désactivé.
 */
export const Disabled: Story = {
	args: {
		isDisabled: true,
		modelValue: 'MonMotDePasse123',
	},
}

/**
 * Champ de mot de passe en lecture seule.
 */
export const ReadOnly: Story = {
	args: {
		isReadOnly: true,
		modelValue: 'MonMotDePasse123',
	},
}

/**
 * Champ de mot de passe avec règles de validation qui génèrent une erreur.
 */
export const WithError: Story = {
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
	args: {
		modelValue: 'MotDePasse123!@#',
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
							return 'Mot de passe fort'
						}
						return false
					},
					fieldIdentifier: 'password',
					isSuccess: true,
				},
			},
		],
	},
}

/**
 * Démonstration des différents types de validation (erreurs, avertissements, succès).
 */
export const WithValidation: Story = {
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
					:show-success-messages="true"
					:display-asterisk="true"
					:is-validate-on-blur="false"
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
				:is-read-only="args.isReadOnly"
				:is-disabled="args.isDisabled"
				:placeholder="args.placeholder"
				:custom-rules="customRules"
				:show-success-messages="args.showSuccessMessages"
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
			const handleSubmit = () => {
				if (passwordFieldRef.value) {
					const isValid = passwordFieldRef.value.validateOnSubmit()
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

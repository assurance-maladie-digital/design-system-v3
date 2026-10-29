import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch, onMounted } from 'vue'
import type { SubmitEventPromise } from 'vuetify'
import { VBtn, VForm } from 'vuetify/components'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import { fn } from 'storybook/test'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import type { SyTextFieldProps } from '../types'

const meta = {
	title: 'Composants/Formulaires/SyTextField/Validation',
	component: SyTextField,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `Exemples de validation pour le composant SyTextField`,
			},
		},
	},
	argTypes: {
		...getValidationDocumentation('string'),
		modelValue: {
			control: 'text',
			description: 'Valeur du champ texte',
		},
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
		color: {
			type: { name: 'string', required: false },
			control: 'select',
			options: ['primary', 'secondary', 'success', 'error', 'warning'],
			description: 'Couleur du champ',
			table: {
				type: { summary: 'string' },
			},
		},
		baseColor: {
			type: { name: 'string', required: false },
			control: 'text',
			description: 'Couleur de base du champ (par défaut hérite de color)',
			table: {
				type: { summary: 'string' },
			},
		},
		bgColor: {
			type: { name: 'string', required: false },
			control: 'color',
			description: 'Couleur de fond du champ',
			table: {
				type: { summary: 'string' },
			},
		},
	},
	args: {
		'modelValue': '',
		'label': 'Nom',
		'required': false,
		'errorMessages': null,
		'warningMessages': null,
		'successMessages': null,
		'readonly': false,
		'disabled': false,
		'customRules': [],
		'customWarningRules': [],
		'customSuccessRules': [],
		'isValidateOnBlur': true,
		'onUpdate:modelValue': fn(),
	},
} as Meta<typeof SyTextField>

export default meta

type Story = StoryObj<SyTextFieldProps>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: 'La valeur initiale ne respecte pas la règle : la validation est déclenchée au montage via `validateOnSubmit()` pour afficher l\'erreur dès le chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextField
		ref="fieldRef"
		v-model="value"
		label="Adresse email"
		:custom-rules="customRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'

const value = ref('not-an-email')
const fieldRef = ref<InstanceType<typeof SyTextField> | null>(null)

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
			message: 'L\\'adresse email est invalide.',
			fieldIdentifier: 'email',
		},
	},
]

onMounted(() => {
	fieldRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Adresse email',
		modelValue: 'not-an-email',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => emailPattern.test(value),
					message: 'L\'adresse email est invalide.',
					fieldIdentifier: 'email',
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<SyTextField ref="fieldRef" v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

export const WithWarning: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Les règles d\'avertissement (`customWarningRules`) sont non bloquantes. La validation est déclenchée au montage via `validateOnSubmit()` pour afficher l\'avertissement dès le chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextField
		ref="fieldRef"
		v-model="value"
		label="Nom d'utilisateur"
		:custom-warning-rules="customWarningRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'

const value = ref('ab')
const fieldRef = ref<InstanceType<typeof SyTextField> | null>(null)

const customWarningRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => value.length >= 3,
			warningMessage: 'Le nom d\\'utilisateur est très court (moins de 3 caractères).',
			fieldIdentifier: 'username',
		},
	},
]

onMounted(() => {
	fieldRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Nom d\'utilisateur',
		modelValue: 'ab',
		customWarningRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => value.length >= 3,
					warningMessage: 'Le nom d\'utilisateur est très court (moins de 3 caractères).',
					fieldIdentifier: 'username',
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<SyTextField ref="fieldRef" v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

export const WithSuccess: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Les règles de succès (`customSuccessRules`) s\'affichent avec `showSuccessMessages`. La validation est déclenchée au montage via `validateOnSubmit()` pour afficher le succès dès le chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextField
		ref="fieldRef"
		v-model="value"
		label="Adresse email"
		show-success-messages
		:custom-success-rules="customSuccessRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'

const value = ref('exemple@domaine.fr')
const fieldRef = ref<InstanceType<typeof SyTextField> | null>(null)

const customSuccessRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
			successMessage: 'L\\'adresse email est valide.',
			fieldIdentifier: 'email',
		},
	},
]

onMounted(() => {
	fieldRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		label: 'Adresse email',
		modelValue: 'exemple@domaine.fr',
		showSuccessMessages: true,
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => emailPattern.test(value),
					successMessage: 'L\'adresse email est valide.',
					fieldIdentifier: 'email',
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref(args.modelValue)
			const fieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			onMounted(() => {
				fieldRef.value?.validateOnSubmit()
			})
			return { args, value, fieldRef }
		},
		template: `
			<div class="pa-4">
				<SyTextField ref="fieldRef" v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

export const WithCustomRules: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextField
		v-model="value"
		label="Mot de passe"
		type="password"
		required
		width="400px"
		:custom-rules="customRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'

const value = ref('')

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => value.length >= 8,
			message: 'Le mot de passe doit contenir au moins 8 caractères.',
			fieldIdentifier: 'password',
		},
	},
	{
		type: 'custom',
		options: {
			validate: (value: string) => /[A-Z]/.test(value),
			message: 'Le mot de passe doit contenir au moins une majuscule.',
			fieldIdentifier: 'password',
		},
	},
]
</script>`,
			},
		],
	},
	args: {
		label: 'Mot de passe',
		type: 'password',
		required: true,
		width: '400px',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => value.length >= 8,
					message: 'Le mot de passe doit contenir au moins 8 caractères.',
					fieldIdentifier: 'password',
				},
			},
			{
				type: 'custom',
				options: {
					validate: (value: string) => /[A-Z]/.test(value),
					message: 'Le mot de passe doit contenir au moins une majuscule.',
					fieldIdentifier: 'password',
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
			<SyTextField v-bind="args" v-model="value" />
		`,
	}),
}

export const DisableErrorHandling: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Désactivation de la gestion des erreurs

Cette story illustre l'utilisation de la propriété \`disableErrorHandling\` qui permet de désactiver complètement
la gestion et l'affichage des erreurs dans un champ, même si des règles de validation sont définies.

Les deux champs sont identiques : valeur vide et même règle \`required\` (message « Ce champ est requis. »).
Ils sont validés au montage via \`validateOnSubmit()\`. Seul le premier affiche l'erreur : avec \`disableErrorHandling\`,
les règles ne sont pas exécutées et \`validateOnSubmit()\` renvoie \`true\`.

La règle est déclarée dans \`customRules\` plutôt qu'avec la prop \`required\` : celle-ci ajoute sa propre règle,
dont le message « Le champ … est requis. » s'afficherait à la place (un seul message affiché par défaut, \`maxErrors: 1\`).
Une règle \`custom\` ne convient pas non plus : hors règle \`required\`, une valeur vide n'est pas validée.

Les Controls sont désactivés : la story compare deux configurations figées. La saisie dans l'un ou l'autre champ alimente l'action \`update:modelValue\`.
`,
			},
		},
		controls: { disable: true },
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-column ga-6">
		<div>
			<p class="text-subtitle-2 mb-2">Avec gestion des erreurs (défaut)</p>
			<SyTextField
				ref="fieldWithHandlingRef"
				v-model="valueWithHandling"
				label="Avec gestion des erreurs"
				:custom-rules="customRules"
			/>
		</div>
		<div>
			<p class="text-subtitle-2 mb-2">Sans gestion des erreurs (disableErrorHandling)</p>
			<SyTextField
				ref="fieldWithoutHandlingRef"
				v-model="valueWithoutHandling"
				label="Sans gestion des erreurs"
				:custom-rules="customRules"
				disable-error-handling
			/>
		</div>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'

const valueWithHandling = ref('')
const valueWithoutHandling = ref('')

const customRules = [
	{
		type: 'required',
		options: {
			message: 'Ce champ est requis.',
		},
	},
]

const fieldWithHandlingRef = ref<InstanceType<typeof SyTextField> | null>(null)
const fieldWithoutHandlingRef = ref<InstanceType<typeof SyTextField> | null>(null)

onMounted(() => {
	fieldWithHandlingRef.value?.validateOnSubmit()
	fieldWithoutHandlingRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const valueWithHandling = ref('')
			const valueWithoutHandling = ref('')

			const customRules = [
				{
					type: 'required',
					options: {
						message: 'Ce champ est requis.',
					},
				},
			]

			const fieldWithHandlingRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)
			const fieldWithoutHandlingRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			onMounted(() => {
				fieldWithHandlingRef.value?.validateOnSubmit()
				fieldWithoutHandlingRef.value?.validateOnSubmit()
			})

			return { args, valueWithHandling, valueWithoutHandling, customRules, fieldWithHandlingRef, fieldWithoutHandlingRef }
		},
		template: `
			<div class="d-flex flex-column ga-6">
				<div>
					<p class="text-subtitle-2 mb-2">Avec gestion des erreurs (défaut)</p>
					<SyTextField
						ref="fieldWithHandlingRef"
						v-model="valueWithHandling"
						@update:model-value="args['onUpdate:modelValue']"
						label="Avec gestion des erreurs"
						:custom-rules="customRules"
					/>
				</div>
				<div>
					<p class="text-subtitle-2 mb-2">Sans gestion des erreurs (disableErrorHandling)</p>
					<SyTextField
						ref="fieldWithoutHandlingRef"
						v-model="valueWithoutHandling"
						@update:model-value="args['onUpdate:modelValue']"
						label="Sans gestion des erreurs"
						:custom-rules="customRules"
						disable-error-handling
					/>
				</div>
			</div>
		`,
	}),
}

/**
 * Validation déclenchée à chaque frappe (isValidateOnBlur: false).
 */
export const ValidateOnInput: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation à la saisie

Lorsque \`isValidateOnBlur\` vaut \`false\`, la validation se déclenche à chaque modification
de la valeur plutôt qu'à la perte de focus. Utile pour un retour immédiat à l'utilisateur.

\`isValidateOnBlur\` est le sujet de la story : sa valeur est figée à \`false\` et son Control est désactivé.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p class="mb-4">La validation se déclenche à chaque frappe (<code>isValidateOnBlur="false"</code>).</p>
	<SyTextField
		v-model="value"
		label="Adresse email"
		required
		:is-validate-on-blur="false"
		:custom-rules="customRules"
		show-success-messages
		width="400px"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'

const value = ref('')

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
			message: 'L\\'adresse email est invalide.',
		},
	},
]
</script>`,
			},
		],
	},
	argTypes: {
		isValidateOnBlur: { control: false },
	},
	args: {
		label: 'Adresse email',
		required: true,
		isValidateOnBlur: false,
		showSuccessMessages: true,
		width: '400px',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => emailPattern.test(value),
					message: 'L\'adresse email est invalide.',
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
			<div>
				<p class="mb-4">La validation se déclenche à chaque frappe (<code>isValidateOnBlur="false"</code>).</p>
				<SyTextField v-bind="args" v-model="value" />
			</div>
		`,
	}),
}

/**
 * Messages de validation injectés directement par le parent (errorMessages, warningMessages, successMessages).
 */
export const ExternalMessages: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Messages externes

Les props \`errorMessages\`, \`warningMessages\` et \`successMessages\` permettent d'injecter
des messages depuis le parent sans déclencher de règle de validation.

Dans cette story, ces trois props sont pilotées par les boutons : leurs Controls sont désactivés.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p class="mb-4">
		Les messages ci-dessous sont injectés par le parent sans déclencher de règle de validation.
	</p>
	<SyTextField
		v-model="value"
		label="Nom"
		show-success-messages
		width="400px"
		:error-messages="errorMessages"
		:warning-messages="warningMessages"
		:success-messages="successMessages"
	/>
	<div class="mt-4 d-flex flex-wrap ga-2 pa-2">
		<VBtn color="error" @click="setError">Simuler une erreur</VBtn>
		<VBtn color="warning" @click="setWarning">Simuler un avertissement</VBtn>
		<VBtn color="success" @click="setSuccess">Simuler un succès</VBtn>
		<VBtn color="black" @click="reset">Réinitialiser</VBtn>
	</div>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')
const errorMessages = ref<string[] | null>(null)
const warningMessages = ref<string[] | null>(null)
const successMessages = ref<string[] | null>(null)

function setError() {
	errorMessages.value = ['Ce nom est déjà utilisé']
	warningMessages.value = null
	successMessages.value = null
}
function setWarning() {
	errorMessages.value = null
	warningMessages.value = ['Ce nom ressemble à un nom générique']
	successMessages.value = null
}
function setSuccess() {
	errorMessages.value = null
	warningMessages.value = null
	successMessages.value = ['Nom accepté par le serveur']
}
function reset() {
	errorMessages.value = null
	warningMessages.value = null
	successMessages.value = null
}
</script>`,
			},
		],
	},
	argTypes: {
		errorMessages: { control: false },
		warningMessages: { control: false },
		successMessages: { control: false },
	},
	args: {
		label: 'Nom',
		showSuccessMessages: true,
		width: '400px',
	},
	render: args => ({
		components: { SyTextField, VBtn },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			const errorMessages = ref<string[] | null>(null)
			const warningMessages = ref<string[] | null>(null)
			const successMessages = ref<string[] | null>(null)

			function setError() {
				errorMessages.value = ['Ce nom est déjà utilisé']
				warningMessages.value = null
				successMessages.value = null
			}
			function setWarning() {
				errorMessages.value = null
				warningMessages.value = ['Ce nom ressemble à un nom générique']
				successMessages.value = null
			}
			function setSuccess() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = ['Nom accepté par le serveur']
			}
			function reset() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = null
			}

			return { args, value, errorMessages, warningMessages, successMessages, setError, setWarning, setSuccess, reset }
		},
		template: `
			<div>
				<p class="mb-4">
					Les messages ci-dessous sont injectés par le parent sans déclencher de règle de validation.
				</p>
				<SyTextField
					v-bind="args"
					v-model="value"
					:error-messages="errorMessages"
					:warning-messages="warningMessages"
					:success-messages="successMessages"
				/>
				<div class="mt-4 d-flex flex-wrap ga-2 pa-2">
					<VBtn color="error" @click="setError">Simuler une erreur</VBtn>
					<VBtn color="warning" @click="setWarning">Simuler un avertissement</VBtn>
					<VBtn color="success" @click="setSuccess">Simuler un succès</VBtn>
					<VBtn color="black" @click="reset">Réinitialiser</VBtn>
				</div>
			</div>
		`,
	}),
}

export const VFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation de style Vuetify

En passant \`useVuetifyValidation="true"\`, le composant délègue la validation à Vuetify.
Les règles sont de simples fonctions qui retournent \`true\` si la valeur est valide,
ou un message d'erreur (chaîne de caractères) sinon — exactement comme avec la prop \`rules\`
native de Vuetify.
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p class="mb-4">
		Les règles sont des fonctions Vuetify natives <code>(value) => true | 'message'</code>.
		Cliquez sur <strong>Valider</strong> ou quittez le champ pour déclencher la validation.
	</p>
	<VForm @submit.prevent="handleSubmit">
		<SyTextField
			v-model="value"
			label="Adresse email"
			:use-vuetify-validation="true"
			:rules="rules"
			required
			:is-validate-on-blur="true"
			width="400px"
		/>
		<div class="mt-4">
			<VBtn type="submit" color="primary">Valider</VBtn>
		</div>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import type { SubmitEventPromise } from 'vuetify'
import { VBtn, VForm } from 'vuetify/components'
import { SyTextField } from '@cnamts/synapse'

const value = ref('')

const rules = [
	(value: string) => !!value || 'Ce champ est requis',
	(value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) || 'L\\'adresse email est invalide',
]

async function handleSubmit(event: SubmitEventPromise) {
	const result = await event
	alert(result.valid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	args: {
		label: 'Adresse email',
		useVuetifyValidation: true,
		required: true,
		isValidateOnBlur: true,
		width: '400px',
		rules: [
			(value: string) => !!value || 'Ce champ est requis',
			(value: string) => emailPattern.test(value) || 'L\'adresse email est invalide',
		],
	},
	render: args => ({
		components: { SyTextField, VBtn, VForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})

			async function handleSubmit(event: SubmitEventPromise) {
				const result = await event
				alert(result.valid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, value, handleSubmit }
		},
		template: `
			<div>
				<p class="mb-4">
					Les règles sont des fonctions Vuetify natives <code>(value) => true | 'message'</code>.
					Cliquez sur <strong>Valider</strong> ou quittez le champ pour déclencher la validation.
				</p>
				<VForm @submit.prevent="handleSubmit">
					<SyTextField v-bind="args" v-model="value" />
					<div class="mt-4">
						<VBtn type="submit" color="primary">Valider</VBtn>
					</div>
				</VForm>
			</div>
		`,
	}),
}

export const SyFormValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyForm @submit="handleSubmit">
		<SyTextField
			v-model="value"
			label="Adresse email"
			required
			width="400px"
			:custom-rules="customRules"
		/>
		<div class="mt-4">
			<VBtn type="submit" color="primary">Valider</VBtn>
		</div>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'
import { SyForm, SyTextField } from '@cnamts/synapse'

const value = ref('')

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
			message: 'L\\'adresse email est invalide.',
			fieldIdentifier: 'email',
		},
	},
]

function handleSubmit(event: { isValid: boolean }) {
	alert(event.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	args: {
		label: 'Adresse email',
		required: true,
		width: '400px',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => emailPattern.test(value),
					message: 'L\'adresse email est invalide.',
					fieldIdentifier: 'email',
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField, VBtn, SyForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})

			function handleSubmit(event: { isValid: boolean }) {
				alert(event.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, value, handleSubmit }
		},
		template: `
			<div>
				<SyForm @submit="handleSubmit">
					<SyTextField v-bind="args" v-model="value" />
					<div class="mt-4">
						<VBtn type="submit" color="primary">Valider</VBtn>
					</div>
				</SyForm>
			</div>
		`,
	}),
}

export const SyFormVuetifyValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyForm @submit="handleSubmit">
		<SyTextField
			v-model="value"
			label="Adresse email"
			:use-vuetify-validation="true"
			:rules="vuetifyRules"
			width="400px"
		/>
		<div class="mt-4">
			<VBtn type="submit" color="primary">Valider</VBtn>
		</div>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { VBtn } from 'vuetify/components'
import { SyForm, SyTextField } from '@cnamts/synapse'

const value = ref('')

const vuetifyRules = [
	(value: string) => !!value || 'Ce champ est requis',
	(value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value) || 'L\\'adresse email est invalide',
]

function handleSubmit(event: { isValid: boolean }) {
	alert(event.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	args: {
		label: 'Adresse email',
		useVuetifyValidation: true,
		width: '400px',
		rules: [
			(value: string) => !!value || 'Ce champ est requis',
			(value: string) => emailPattern.test(value) || 'L\'adresse email est invalide',
		],
	},
	render: args => ({
		components: { SyTextField, VBtn, SyForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})

			function handleSubmit(event: { isValid: boolean }) {
				alert(event.isValid ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, value, handleSubmit }
		},
		template: `
			<div>
				<SyForm @submit="handleSubmit">
					<SyTextField v-bind="args" v-model="value" />
					<div class="mt-4">
						<VBtn type="submit" color="primary">Valider</VBtn>
					</div>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<p>Il faut privilégier l'utilisation de <code>SyForm</code> pour bénéficier de l'intégration.</p>
	<VForm @submit.prevent="handleSubmit">
		<SyTextField
			ref="textFieldRef"
			v-model="value"
			label="Adresse email"
			required
			width="400px"
			:custom-rules="customRules"
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { VBtn, VForm } from 'vuetify/components'
import { SyTextField } from '@cnamts/synapse'

const value = ref('')
const textFieldRef = ref<InstanceType<typeof SyTextField> | null>(null)

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value),
			message: 'L\\'adresse email est invalide.',
			fieldIdentifier: 'email',
		},
	},
]

async function handleSubmit() {
	if (textFieldRef.value) {
		const result = await textFieldRef.value.validateOnSubmit()
		alert(result ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
	}
}
</script>`,
			},
		],
	},
	args: {
		label: 'Adresse email',
		required: true,
		width: '400px',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => emailPattern.test(value),
					message: 'L\'adresse email est invalide.',
					fieldIdentifier: 'email',
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField, VBtn, VForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			const textFieldRef = ref<{ validateOnSubmit: () => Promise<boolean> } | null>(null)

			async function handleSubmit() {
				if (textFieldRef.value) {
					const result = await textFieldRef.value.validateOnSubmit()
					alert(result ? 'Valeur valide !' : 'Veuillez corriger les erreurs.')
				}
			}

			return { args, value, textFieldRef, handleSubmit }
		},
		template: `
			<div>
				<p>Il faut privilégier l'utilisation de <code>SyForm</code> pour bénéficier de l'intégration.</p>
				<VForm @submit.prevent="handleSubmit">
					<SyTextField ref="textFieldRef" v-bind="args" v-model="value" />
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</VForm>
			</div>
		`,
	}),
}

export const EmailValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: `
### Validation d'email

Cette story montre un cas d'usage courant : la validation d'une adresse email. Le champ :
- Est requis
- Vérifie le format de l'email
- Affiche un message de succès quand l'email est valide
`,
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyTextField
		v-model="value"
		label="Email"
		help-text="Format attendu : nom@domaine.fr"
		autocomplete="email"
		required
		show-success-messages
		:custom-rules="customRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { ref } from 'vue'
import { SyTextField } from '@cnamts/synapse'

const value = ref('')

const customRules = [
	{
		type: 'email',
		options: {
			message: 'L\\'email n\\'est pas valide',
			successMessage: 'L\\'email est valide',
		},
	},
]
</script>`,
			},
		],
	},
	args: {
		label: 'Email',
		helpText: 'Format attendu : nom@domaine.fr',
		autocomplete: 'email',
		required: true,
		showSuccessMessages: true,
		customRules: [
			{
				type: 'email',
				options: {
					message: 'L\'email n\'est pas valide',
					successMessage: 'L\'email est valide',
				},
			},
		],
	},
	render: args => ({
		components: { SyTextField },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
			<SyTextField v-bind="args" v-model="value" />
		`,
	}),
}

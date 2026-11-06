import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, watch } from 'vue'
import { VBtn, VForm } from 'vuetify/components'
import { fn } from 'storybook/test'
import LunarCalendar from '../LunarCalendar.vue'
import SyForm from '../../Customs/SyForm/SyForm.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps'
import { renderValidatedOnMount } from '@/stories/utils/renderValidatedOnMount'

const meta = {
	title: 'Composants/Formulaires/LunarCalendar/Validation',
	component: LunarCalendar,
	decorators: [
		() => ({
			template: '<div style="padding: 20px;"><story/></div>',
		}),
	],
	parameters: {
		layout: 'fullscreen',
		docs: {
			description: {
				component: `Exemples de validation pour le composant LunarCalendar`,
			},
		},
	},
	argTypes: {
		...getValidationDocumentation('date'),
		modelValue: {
			control: 'text',
			description: 'La valeur du calendrier lunaire au format DD/MM/YYYY',
		},
		label: {
			control: 'text',
			description: 'Libellé du champ',
		},
	},
	args: {
		'modelValue': '',
		'label': 'Date de naissance',
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
} as Meta<typeof LunarCalendar>

export default meta

type Story = StoryObj<typeof meta>

export const WithError: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Une règle personnalisée (`customRules`) bloque la saisie : un mois lunaire compte 29 ou 30 jours. La validation est déclenchée au montage pour afficher l\'erreur dès le chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LunarCalendar
		ref="fieldRef"
		v-model="dateValue"
		label="Date de naissance"
		:custom-rules="customRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LunarCalendar } from '@cnamts/synapse'

const dateValue = ref('31/08/1445')
const fieldRef = ref<InstanceType<typeof LunarCalendar> | null>(null)

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => {
				if (!value) return true
				const day = Number(value.split('/')[0])
				return isNaN(day) || day <= 30
			},
			message: 'Un mois lunaire compte au plus 30 jours.',
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
		modelValue: '31/08/1445',
		customRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value) return true
						const day = Number(value.split('/')[0])
						return isNaN(day) || day <= 30
					},
					message: 'Un mois lunaire compte au plus 30 jours.',
				},
			},
		],
	},
	render: renderValidatedOnMount(LunarCalendar),
}

export const WithWarning: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LunarCalendar
		ref="fieldRef"
		v-model="dateValue"
		label="Date de naissance"
		:custom-warning-rules="customWarningRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LunarCalendar } from '@cnamts/synapse'

const dateValue = ref('01/01/1900')
const fieldRef = ref<InstanceType<typeof LunarCalendar> | null>(null)

const customWarningRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => {
				if (!value) return true
				const year = Number(value.split('/')[2])
				return isNaN(year) || year >= 1912
			},
			warningMessage: 'Cette date est antérieure à 1912.',
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
		modelValue: '01/01/1900',
		customWarningRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => {
						if (!value) return true
						const year = Number(value.split('/')[2])
						return isNaN(year) || year >= 1912
					},
					warningMessage: 'Cette date est antérieure à 1912.',
				},
			},
		],
	},
	render: renderValidatedOnMount(LunarCalendar),
}

export const WithSuccess: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LunarCalendar
		ref="fieldRef"
		v-model="dateValue"
		label="Date de naissance"
		show-success-messages
		:custom-success-rules="customSuccessRules"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LunarCalendar } from '@cnamts/synapse'

const dateValue = ref('15/08/1450')
const fieldRef = ref<InstanceType<typeof LunarCalendar> | null>(null)

const customSuccessRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => /^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value),
			successMessage: 'Date lunaire valide.',
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
		modelValue: '15/08/1450',
		showSuccessMessages: true,
		customSuccessRules: [
			{
				type: 'custom',
				options: {
					validate: (value: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(value),
					successMessage: 'Date lunaire valide.',
				},
			},
		],
	},
	render: renderValidatedOnMount(LunarCalendar),
}

export const ExternalMessages: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LunarCalendar
		label="Date de naissance"
		v-model="dateValue"
		show-success-messages
		:error-messages="errorMessages"
		:warning-messages="warningMessages"
		:success-messages="successMessages"
	/>
	<div class="mt-4 d-flex flex-wrap ga-2">
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
import { VBtn } from 'vuetify/components'
import { LunarCalendar } from '@cnamts/synapse'

const dateValue = ref('15/08/1450')
const errorMessages = ref<string[] | null>(null)
const warningMessages = ref<string[] | null>(null)
const successMessages = ref<string[] | null>(null)

function setError() {
	errorMessages.value = ['Date non reconnue dans le calendrier lunaire.']
	warningMessages.value = null
	successMessages.value = null
}
function setWarning() {
	errorMessages.value = null
	warningMessages.value = ['Cette date correspond à une période incertaine.']
	successMessages.value = null
}
function setSuccess() {
	errorMessages.value = null
	warningMessages.value = null
	successMessages.value = ['Date lunaire validée par le serveur.']
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
	args: {
		modelValue: '15/08/1450',
		showSuccessMessages: true,
	},
	render: args => ({
		components: { LunarCalendar, VBtn },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			const errorMessages = ref<string[] | null>(null)
			const warningMessages = ref<string[] | null>(null)
			const successMessages = ref<string[] | null>(null)

			function setError() {
				errorMessages.value = ['Date non reconnue dans le calendrier lunaire.']
				warningMessages.value = null
				successMessages.value = null
			}
			function setWarning() {
				errorMessages.value = null
				warningMessages.value = ['Cette date correspond à une période incertaine.']
				successMessages.value = null
			}
			function setSuccess() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = ['Date lunaire validée par le serveur.']
			}
			function reset() {
				errorMessages.value = null
				warningMessages.value = null
				successMessages.value = null
			}

			return { args, value, errorMessages, warningMessages, successMessages, setError, setWarning, setSuccess, reset }
		},
		template: `
			<div class="pa-4">
				<LunarCalendar
					v-bind="args"
					v-model="value"
					show-success-messages
					:error-messages="errorMessages"
					:warning-messages="warningMessages"
					:success-messages="successMessages"
				/>
				<div class="mt-4 d-flex flex-wrap ga-2">
					<VBtn color="error" @click="setError">Simuler une erreur</VBtn>
					<VBtn color="warning" @click="setWarning">Simuler un avertissement</VBtn>
					<VBtn color="success" @click="setSuccess">Simuler un succès</VBtn>
					<VBtn color="black" @click="reset">Réinitialiser</VBtn>
				</div>
			</div>
		`,
	}),
}

export const WithYearConstraints: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Les props `minYear` et `maxYear` bornent l\'année saisie. La valeur initiale (1550) dépasse la borne maximale : l\'erreur est affichée dès le chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LunarCalendar
		ref="fieldRef"
		v-model="dateValue"
		label="Date de naissance"
		:min-year="1400"
		:max-year="1500"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LunarCalendar } from '@cnamts/synapse'

const dateValue = ref('16/08/1550')
const fieldRef = ref<InstanceType<typeof LunarCalendar> | null>(null)

onMounted(() => {
	fieldRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		modelValue: '16/08/1550',
		minYear: 1400,
		maxYear: 1500,
	},
	render: renderValidatedOnMount(LunarCalendar),
}

export const WithMinYearOnly: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Seule la borne minimale (`minYear`) est définie. La valeur initiale (1410) est antérieure à 1420 : l\'erreur est affichée dès le chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LunarCalendar
		ref="fieldRef"
		v-model="dateValue"
		label="Date de naissance"
		:min-year="1420"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LunarCalendar } from '@cnamts/synapse'

const dateValue = ref('12/12/1410')
const fieldRef = ref<InstanceType<typeof LunarCalendar> | null>(null)

onMounted(() => {
	fieldRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		modelValue: '12/12/1410',
		minYear: 1420,
	},
	render: renderValidatedOnMount(LunarCalendar),
}

export const WithMaxYearOnly: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Seule la borne maximale (`maxYear`) est définie. La valeur initiale (1460) est postérieure à 1450 : l\'erreur est affichée dès le chargement.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<LunarCalendar
		ref="fieldRef"
		v-model="dateValue"
		label="Date de naissance"
		:max-year="1450"
	/>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { LunarCalendar } from '@cnamts/synapse'

const dateValue = ref('12/12/1460')
const fieldRef = ref<InstanceType<typeof LunarCalendar> | null>(null)

onMounted(() => {
	fieldRef.value?.validateOnSubmit()
})
</script>`,
			},
		],
	},
	args: {
		modelValue: '12/12/1460',
		maxYear: 1450,
	},
	render: renderValidatedOnMount(LunarCalendar),
}

export const SyFormValidation: Story = {
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<SyForm @submit="handleSubmit">
		<LunarCalendar
			v-model="value"
			label="Date de naissance"
			:custom-rules="customRules"
			required
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
import { LunarCalendar, SyForm } from '@cnamts/synapse'

const value = ref('')

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value: string) => {
				if (!value || !/^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value)) {
					return false
				}
				return true
			},
			message: 'La date doit être au format JJ/MM/AAAA.',
			fieldIdentifier: 'date',
		},
	},
]

function handleSubmit(e: { isValid: boolean }) {
	const isValid = e.isValid
	alert(isValid ? 'Date valide !' : 'Veuillez corriger les erreurs.')
}
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
	},
	render: args => ({
		components: { LunarCalendar, VBtn, SyForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})

			const customRules = [
				{
					type: 'custom',
					options: {
						validate: (value: string) => {
							if (!value || !/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
								return false
							}
							return true
						},
						message: 'La date doit être au format JJ/MM/AAAA.',
						fieldIdentifier: 'date',
					},
				},
			]

			function handleSubmit(e: { isValid: boolean }) {
				const isValid = e.isValid
				alert(isValid ? 'Date valide !' : 'Veuillez corriger les erreurs.')
			}

			return { args, value, customRules, handleSubmit }
		},
		template: `
			<div>
				<SyForm @submit="handleSubmit">
					<LunarCalendar
						v-bind="args"
						v-model="value"
						label="Date de naissance"
						:custom-rules="customRules"
						required
					/>
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
	<VForm @submit.prevent="handleSubmit">
		<LunarCalendar
			ref="lunarRef"
			v-model="value"
			label="Date de naissance"
			:custom-rules="[
				{
					type: 'custom',
					options: {
						validate: (value) => !!value && /^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value),
						message: 'La date doit être au format JJ/MM/AAAA.',
						fieldIdentifier: 'date',
					},
				},
			]"
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
import { LunarCalendar } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const lunarRef = ref()

async function handleSubmit() {
	if (lunarRef.value) {
		const result = await lunarRef.value.validateOnSubmit()
		alert(result ? 'Date valide !' : 'Veuillez corriger les erreurs.')
	}
}
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
	},
	render: args => ({
		components: { LunarCalendar, VBtn, VForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			const lunarRef = ref()

			async function handleSubmit() {
				if (lunarRef.value) {
					const result = await lunarRef.value.validateOnSubmit()
					alert(result ? 'Date valide !' : 'Veuillez corriger les erreurs.')
				}
			}

			return { args, value, lunarRef, handleSubmit }
		},
		template: `
			<div>
				<p>Il faut privilégier l'utilisation de <code>SyForm</code> pour bénéficier de l'intégration native.</p>
				<VForm @submit.prevent="handleSubmit">
					<LunarCalendar
						v-bind="args"
						ref="lunarRef"
						v-model="value"
						label="Date de naissance"
						:custom-rules="[
							{
								type: 'custom',
								options: {
									validate: (value) => !!value && /^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(value),
									message: 'La date doit être au format JJ/MM/AAAA.',
									fieldIdentifier: 'date',
								},
							},
						]"
						required
					/>
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</VForm>
			</div>
		`,
	}),
}

export const SyFormVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify via `useVuetifyValidation`. Les règles sont au format Vuetify (fonctions retournant `true` ou un message d\'erreur), passées via la prop `rules`. En mode Vuetify, `required` n\'ajoute que l\'indication visuelle : la règle d\'obligation doit être fournie dans `rules`. Soumettez le formulaire pour déclencher la validation.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<SyForm @submit="onSubmit">
		<LunarCalendar
			v-model="value"
			label="Date de naissance"
			use-vuetify-validation
			:rules="[
				v => !!v || 'La date de naissance est requise.',
				v => /^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(v) || 'La date doit être au format JJ/MM/AAAA.',
			]"
			required
			class="mb-4"
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</SyForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { LunarCalendar, SyForm } from '@cnamts/synapse'
import { VBtn } from 'vuetify/components'

const value = ref('')

const onSubmit = (event: { isValid: boolean }) => {
	if (event.isValid) {
		alert('Formulaire valide : ' + value.value)
	} else {
		alert('Formulaire invalide.')
	}
}
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
		useVuetifyValidation: true,
	},
	render: args => ({
		components: { LunarCalendar, SyForm, VBtn },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})

			const rules = [
				(v: string) => !!v || 'La date de naissance est requise.',
				(v: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'La date doit être au format JJ/MM/AAAA.',
			]

			const onSubmit = (event: { isValid: boolean }) => {
				if (event.isValid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, rules, onSubmit }
		},
		template: `
			<div class="pa-4">
				<SyForm @submit="onSubmit">
					<LunarCalendar
						v-bind="args"
						v-model="value"
						:rules="rules"
						class="mb-4"
					/>
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</SyForm>
			</div>
		`,
	}),
}

export const VFormAndVuetifyValidation: Story = {
	parameters: {
		docs: {
			description: {
				story: 'Validation native Vuetify (`useVuetifyValidation`) intégrée dans un `VForm` natif (sans SyForm). La soumission déclenche la validation via `form.validate()`.',
			},
		},
		sourceCode: [
			{
				name: 'Template',
				code: `
<template>
	<VForm ref="formRef" @submit.prevent="onSubmit">
		<LunarCalendar
			v-model="value"
			label="Date de naissance"
			use-vuetify-validation
			:rules="[
				v => !!v || 'La date de naissance est requise.',
				v => /^\\d{2}\\/\\d{2}\\/\\d{4}$/.test(v) || 'La date doit être au format JJ/MM/AAAA.',
			]"
			required
			class="mb-4"
		/>
		<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
	</VForm>
</template>`,
			},
			{
				name: 'Script',
				code: `
<script setup lang="ts">
import { ref } from 'vue'
import { LunarCalendar } from '@cnamts/synapse'
import { VBtn, VForm } from 'vuetify/components'

const value = ref('')
const formRef = ref<InstanceType<typeof VForm> | null>(null)

async function onSubmit() {
	const result = await formRef.value?.validate()
	if (result?.valid) {
		alert('Formulaire valide : ' + value.value)
	} else {
		alert('Formulaire invalide.')
	}
}
</script>`,
			},
		],
	},
	args: {
		modelValue: '',
		required: true,
		useVuetifyValidation: true,
	},
	render: args => ({
		components: { LunarCalendar, VBtn, VForm },
		setup() {
			const value = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			const formRef = ref<InstanceType<typeof VForm> | null>(null)

			const rules = [
				(v: string) => !!v || 'La date de naissance est requise.',
				(v: string) => /^\d{2}\/\d{2}\/\d{4}$/.test(v) || 'La date doit être au format JJ/MM/AAAA.',
			]

			async function onSubmit() {
				const result = await formRef.value?.validate()
				if (result?.valid) {
					alert(`Formulaire valide : ${value.value}`)
				}
				else {
					alert('Formulaire invalide.')
				}
			}

			return { args, value, formRef, rules, onSubmit }
		},
		template: `
			<div class="pa-4">
				<VForm ref="formRef" @submit.prevent="onSubmit">
					<LunarCalendar
						v-bind="args"
						v-model="value"
						:rules="rules"
						class="mb-4"
					/>
					<VBtn type="submit" color="primary" class="mt-4">Valider</VBtn>
				</VForm>
			</div>
		`,
	}),
}

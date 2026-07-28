import Captcha from './Captcha.vue'
import type { StoryObj } from '@storybook/vue3-vite'
import { fn } from 'storybook/test'
import { ref, watch } from 'vue'
import SyAlert from '../SyAlert/SyAlert.vue'
import { getValidationDocumentation } from '@/composables/unifyValidation/documentationValidationProps.ts'

export default {
	title: 'Composants/Formulaires/Captcha',
	component: Captcha,
	parameters: {
		layout: 'centered',
		controls: { exclude: ['onUpdate:modelValue', 'onUpdate:type', 'onImageError', 'onAudioError', 'onCreationError'] },
	},
	argTypes: {
		'urlCreate': {
			description: 'URL de création du captcha (retourne l\'identifiant du captcha image audio).',
			control: false,
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'urlGetImage': {
			description: 'URL de récupération de l\'image du captcha. <br> La chaîne `CAPTCHAID` sera remplacée par l\'ID du captcha.',
			control: false,
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'urlGetAudio': {
			description: 'URL de récupération de l\'audio du captcha. <br> La chaîne `CAPTCHAID` sera remplacée par l\'ID du captcha.',
			control: false,
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'modelValue': {
			description: 'La valeur du champs de captcha',
			control: 'string',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'type': {
			description: 'Le type de captcha affiché.',
			options: ['image', 'audio', 'choice'],
			control: {
				type: 'select',
			},
			table: {
				type: { summary: 'image | audio | choice' },
				defaultValue: { summary: '"image"' },
				category: 'props',
			},
		},
		'tagTitle': {
			description: 'Le tag du titre de la section.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				defaultValue: { summary: 'h2' },
				category: 'props',
			},
		},
		'helpDesk': {
			description: 'Le numéro de téléphone du support pour garantir l\'accessibilité du parcours aux personnes en situation de handicap.',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'locale': {
			description: 'La locale (langue) à utiliser pour la génération du captcha. Par défaut, la langue du navigateur est utilisée.',
			control: 'text',
			table: {
				type: { summary: 'string' },
				category: 'props',
			},
		},
		'locales': {
			description: 'Surcharge des chaînes affichées à l\'utilisateur (libellés, textes alternatifs et messages du captcha). Les valeurs par défaut sont définies dans le fichier `locales.ts` du composant. La prop accepte un objet partiel : seules les clés renseignées surchargent les valeurs par défaut, le reste est conservé.',
			control: 'object',
			table: {
				type: { summary: 'object', detail: `{
	hardToRead: string,
	image: {
		new: string,
		change: string,
		textfieldLabel: string,
	},
	audio: {
		new: string,
		change: string,
		textfieldLabel: string,
		loading: string,
	},
	choiceCaptcha: {
		image: string,
		audio: string,
	},
	helpDesk: (phoneNumber: string) => string,
	pause: string,
	play: string,
	renew: string,
	validate: string,
	captchaImgLoading: string,
	captchaImgAlt: string,
	information: {
		securityCheck: string,
		btnAriaLabel: string,
		tooltip: string,
		imageInstruction: string,
		audioInstruction: string,
	},
	defaultErrorMessage: string,
	required: string,
	choiceCaptchaTitle: string,
}` },
				category: 'props',
			},
		},
		'update:modelValue': {
			description: 'Événement émis lors de la mise à jour du champs de captcha.',
			control: false,
			table: {
				type: { summary: 'string' },
				category: 'events',
			},
		},
		'update:type': {
			description: 'Événement émis lors de la mise à jour du type de captcha (image ou audio).',
			control: false,
			table: {
				type: { summary: 'image | audio' },
				category: 'events',
			},
		},
		'imageError': {
			description: 'Événement émis lorsqu\'il y a une erreur lors du chargement de l\'image du captcha.',
			control: false,
			table: {
				type: { summary: 'void' },
				category: 'events',
			},
		},
		'audioError': {
			description: 'Événement émis lorsqu\'il y a une erreur lors du chargement de l\'audio du captcha.',
			control: false,
			table: {
				type: { summary: 'void' },
				category: 'events',
			},
		},
		'creationError': {
			description: 'Événement émis lorsqu\'il y a une erreur lors de la création du captcha.',
			control: false,
			table: {
				type: { summary: 'void' },
				category: 'events',
			},
		},
		'isClearable': {
			description: 'Indique si le champ de captcha est effaçable ou non.',
			control: 'boolean',
			table: {
				type: { summary: 'boolean' },
				defaultValue: { summary: 'false' },
				category: 'props',
			},
		},
		'captchaId': {
			description: 'L\'identifiant du captcha en cours. Utile pour les tests et la validation.',
			control: false,
			table: {
				type: { summary: 'string' },
				category: 'expose',
			},
		},
		'reset': {
			description: 'Méthode exposée pour réinitialiser le captcha.',
			control: false,
			table: {
				type: { summary: '() => void' },
				category: 'expose',
			},
		},
		...getValidationDocumentation(),
	},
}

type Story = StoryObj<typeof Captcha>

export const Default: Story = {
	args: {
		'showSuccessMessages': true,
		'onUpdate:modelValue': fn(),
		'onUpdate:type': fn(),
		'onImageError': fn(),
		'onAudioError': fn(),
		'onCreationError': fn(),
	},
	render: (args) => {
		return {
			components: { Captcha },
			setup() {
				const captchaValue = ref(args.modelValue)
				watch(() => args.modelValue, () => {
					captchaValue.value = args.modelValue
				})

				// Vérification simulée : seules ces réponses correspondent à l'image.
				const verifyCaptcha = () => {
					if (captchaValue.value === 'ytqZNq' || captchaValue.value === '941335') {
						return Promise.resolve({ response: { data: { message: 'Success' } } })
					}
					return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
				}

				const customRules = [
					{
						type: 'custom',
						options: {
							validate: (value: string) => String(value || '').length >= 6,
							message: 'Le captcha doit contenir au moins 6 caractères.',
						},
					},
					{
						type: 'custom',
						options: {
							validate: async () => {
								try {
									const r = await verifyCaptcha()
									return r.response.data.message === 'Success'
								}
								catch {
									return false
								}
							},
							message: 'Le captcha est incorrect',
							successMessage: 'Le captcha est correct',
						},
					},
				]

				return { args, captchaValue, customRules }
			},
			template: `
                <VCard class="pa-8" max-width="600" min-width="300">
                    <Captcha
                        url-create="https://free.mockerapi.com/mock/0adac32b-e832-4553-aa7f-0011b7f35f0c"
                        url-get-image="/captcha/captcha.png"
                        url-get-audio="/captcha/captcha.mp3"
						v-bind="args"
						v-model="captchaValue"
						:custom-rules="customRules"
                    />
                </VCard>
            `,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <VCard class="pa-8" max-width="600">
        <Captcha
			url-create="..."
			url-get-image="..."
			url-get-audio="/..."
			:custom-rules="customRules"
			show-success-messages
		/>
    </VCard>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { Captcha } from '@cnamts/Captcha'
import { VCard } from 'vuetify/components'

const verifyCaptcha = () => {
	// Appelle l'API pour vérifier le captcha et retourne la réponse
}

const customRules = [
	{
		type: 'custom',
		options: {
			validate: (value) => String(value || '').length >= 6,
			message: 'Le captcha doit contenir au moins 6 caractères.',
		},
	},
	{
		type: 'custom',
		options: {
			validate: async () => {
				try {
					const r = await verifyCaptcha()
					return r.response.data.message === 'Success'
				}
				catch {
					return false
				}
			},
			message: 'Le captcha est incorrect',
			successMessage: 'Le captcha est correct',
		},
	},
]
</script>
                `,
			},
		],
	},
}

export const Choice: Story = {
	args: {
		'onUpdate:modelValue': fn(),
		'onUpdate:type': fn(),
		'onImageError': fn(),
		'onAudioError': fn(),
		'onCreationError': fn(),
		'type': 'choice',
	},
	render: (args) => {
		return {
			components: { Captcha },
			setup() {
				const captchaValue = ref(args.modelValue)
				watch(() => args.modelValue, () => {
					captchaValue.value = args.modelValue
				})

				return { args, captchaValue }
			},
			template: `
                <VCard class="pa-8" max-width="600" min-width="300">
                    <Captcha
                        url-create="https://free.mockerapi.com/mock/0adac32b-e832-4553-aa7f-0011b7f35f0c"
                        url-get-image="/captcha/captcha.png"
                        url-get-audio="/captcha/captcha.mp3"
						v-bind="args"
						v-model="captchaValue"
                    />
                </VCard>
            `,
		}
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
    <VCard class="pa-8" max-width="600">
        <Captcha 
			url-create="..."
			url-get-image="..."
			url-get-audio="/..."
			@validation:success="(e) => { ... }"
			@validation:error="(e) => { ... }"
			type="choice"
		/>
    </VCard>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import { Captcha } from '@cnamts/Captcha'
import { VCard } from 'vuetify/components'
</script>
                `,
			},
		],
	},
}

export const WarningDocProps: Story = {
	render: (args) => {
		return {
			components: { SyAlert },
			setup() {
				return { args }
			},
			template: `
				<SyAlert v-model="args.modelValue" :type="args.type" :variant="tonal" :closable="false" class="mb-8">
					<template #default>En raison de limitations techniques sur la documentation, le captcha ne peut pas être rafraîchi sur les exemples.
					</template>
				</SyAlert>
			`,
		}
	},
	tags: ['!dev'],
}

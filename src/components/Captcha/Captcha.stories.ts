import Captcha from './Captcha.vue'
import type { StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import { ref, watch } from 'vue'
import SyAlert from '../SyAlert/SyAlert.vue'

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
			},
		},
		'urlGetImage': {
			description: 'URL de récupération de l\'image du captcha. <br> La chaîne `CAPTCHAID` sera remplacée par l\'ID du captcha.',
			control: false,
			table: {
				type: { summary: 'string' },
			},
		},
		'urlGetAudio': {
			description: 'URL de récupération de l\'audio du captcha. <br> La chaîne `CAPTCHAID` sera remplacée par l\'ID du captcha.',
			control: false,
			table: {
				type: { summary: 'string' },
			},
		},
		'modelValue': {
			description: 'La valeur du champs de captcha',
			control: 'string',
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
			},
		},
		'errorMessage': {
			description: 'Message d\'erreur personnalisé à afficher sous le champ de captcha.',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'tagTitle': {
			description: 'Le tag du titre de la section.',
		},
		'helpDesk': {
			description: 'Le numéro de téléphone du support pour garantir l\'accessibilité du parcours aux personnes en situation de handicap.',
		},
		'locale': {
			description: 'La locale (langue) à utiliser pour la génération du captcha. Par défaut, la langue du navigateur est utilisée.',
			control: 'text',
			table: {
				type: { summary: 'string' },
			},
		},
		'locales': {
			description: 'Les locales à utiliser pour le composant. Voir le fichier locales.ts pour l\'exemple des clés disponibles.',
			control: false,
			table: {
				type: { summary: 'object' },
				defaultValue: { summary: 'locales (importé depuis le fichier locales.ts)' },
			},
		},
		'update:modelValue': {
			description: 'Événement émis lors de la mise à jour du champs de captcha.',
			control: false,
			table: {
				type: { summary: 'string' },
			},
		},
		'update:type': {
			description: 'Événement émis lors de la mise à jour du type de captcha (image ou audio).',
			control: false,
			table: {
				type: { summary: 'image | audio' },
			},
		},
		'imageError': {
			description: 'Événement émis lorsqu\'il y a une erreur lors du chargement de l\'image du captcha.',
			control: false,
			table: {
				type: { summary: 'void' },
			},
		},
		'audioError': {
			description: 'Événement émis lorsqu\'il y a une erreur lors du chargement de l\'audio du captcha.',
			control: false,
			table: {
				type: { summary: 'void' },
			},
		},
		'creationError': {
			description: 'Événement émis lorsqu\'il y a une erreur lors de la création du captcha.',
			control: false,
			table: {
				type: { summary: 'void' },
			},
		},
	},

}

type Story = StoryObj<typeof Captcha>

export const Default: Story = {
	args: {
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
				const verifyCaptcha = () => {
					if (captchaValue.value === 'ytqZNq' || captchaValue.value === '941335') {
						return Promise.resolve({ response: { data: { message: 'Success' } } })
					}
					else {
						return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
					}
				}

				return { args, captchaValue, verifyCaptcha }
			},
			template: `
                <VCard class="pa-8" max-width="600" min-width="300">
                    <Captcha 
                        url-create="https://free.mockerapi.com/mock/0adac32b-e832-4553-aa7f-0011b7f35f0c"
                        url-get-image="/captcha/captcha.png"
                        url-get-audio="/captcha/captcha.mp3"
						:service="verifyCaptcha"
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
			service="(e) => {
				// call the API to verify the captcha and return the response
			}"
			@validation:success="(e) => { ... }"
			@validation:error="(e) => { ... }"
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
				const verifyCaptcha = () => {
					if (captchaValue.value === 'ytqZNq' || captchaValue.value === '941335') {
						return Promise.resolve({ response: { data: { message: 'Success' } } })
					}
					else {
						return Promise.reject({ response: { data: { message: 'Le captcha est incorrect' } } })
					}
				}
				return { args, captchaValue, verifyCaptcha }
			},
			template: `
                <VCard class="pa-8" max-width="600" min-width="300">
                    <Captcha
                        url-create="https://free.mockerapi.com/mock/0adac32b-e832-4553-aa7f-0011b7f35f0c"
                        url-get-image="/captcha/captcha.png"
                        url-get-audio="/captcha/captcha.mp3"
						v-bind="args"
						:service="verifyCaptcha"
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
			service="(e) => {
				// call the API to verify the captcha and return the response
			}"
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

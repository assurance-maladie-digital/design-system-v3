import Captcha from './Captcha.vue'
import type { StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'
import { ref, watch } from 'vue'

export default {
	title: 'Composants/Formulaires/Captcha',
	component: Captcha,
	parameters: {
		layout: 'centered',
		controls: { exclude: ['onUpdate:modelValue', 'onUpdate:type', 'onValidation:click', 'onValidation:success', 'onValidation:error'] },
	},
	argTypes: {
		'service': {
			description: 'Fonction de validation du captcha. Doit retourner une Promise.',
			control: false,
			table: {
				type: { summary: '(value: string, type: "image" | "audio") => Promise<any>' },
			},
		},
		'urlCreate': {
			description: 'URL de création du captcha (retourne un JSON avec les URLs de l\'image et de l\'audio)',
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
		'defaultType': {
			description: 'Le type de captcha affiché par défaut.',
			options: ['image', 'audio', 'choice'],
			control: {
				type: 'select',
			},
			table: {
				type: { summary: 'image | audio | choice' },
				defaultValue: { summary: '"image"' },
			},
		},
		'tagTitle': {
			description: 'Le tag du titre de la section.',
		},
		'helpDesk': {
			description: 'Le numéro d\'aide.',
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
		'validation:click': {
			description: 'Événement émis lors du clic sur le bouton de validation.',
			control: false,
			table: {
				type: { summary: 'void' },
			},
		},
		'validation:success': {
			description: 'Événement émis lorsque la validation du captcha réussit.',
			control: false,
			table: {
				type: { summary: '(response: any) => void' },
			},
		},
		'validation:error': {
			description: 'Événement émis lorsque la validation du captcha échoue.',
			control: false,
			table: {
				type: { summary: '(error: Error) => void' },
			},
		},
	},

}

type Story = StoryObj<typeof Captcha>

export const Default: Story = {
	args: {
		'onUpdate:modelValue': fn(),
		'onUpdate:type': fn(),
		'onValidation:click': fn(),
		'onValidation:success': fn(),
		'onValidation:error': fn(),
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
                <VCard class="pa-4" max-width="600" min-width="300">
                    <Captcha 
                        url-create="/captcha/captcha.json"
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
    <VCard class="pa-4" max-width="600">
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
import Captcha from '@cnamts/Captcha'
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
		'onValidation:click': fn(),
		'onValidation:success': fn(),
		'onValidation:error': fn(),
		'defaultType': 'choice',
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
                <VCard class="pa-4" max-width="600" min-width="300">
                    <Captcha
                        url-create="/captcha/captcha.json"
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
    <VCard class="pa-4" max-width="600">
        <Captcha 
			url-create="..."
			url-get-image="..."
			url-get-audio="/..."
			service="(e) => {
				// call the API to verify the captcha and return the response
			}"
			@validation:success="(e) => { ... }"
			@validation:error="(e) => { ... }"
			default-type="choice"
		/>
    </VCard>
</template>
                `,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
import Captcha from '@cnamts/Captcha'
import { VCard } from 'vuetify/components'
</script>
                `,
			},
		],
	},
}

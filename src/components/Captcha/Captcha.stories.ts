import Captcha from './Captcha.vue'
import type { StoryObj } from '@storybook/vue3'
import { fn } from '@storybook/test'

export default {
	title: 'Composants/Formulaires/Captcha',
	component: Captcha,
	parameters: {
		layout: 'centered',
		controls: { exclude: ['onUpdate:modelValue', 'onUpdate:type', 'onValidation:click', 'onValidation:success', 'onValidation:error'] },
	},

	ArgTypes: {
		service: {
			description: 'Fonction de validation du captcha. Doit retourner une Promise.',
			table: {
				type: { summary: '(value: string, type: "image" | "audio") => Promise<any>' },
				control: false,
			},
		},
		urlCreate: {
			description: 'URL de création du captcha (retourne un JSON avec les URLs de l\'image et de l\'audio)',
			table: {
				type: { summary: 'string' },
				control: { type: false },
			},
		},
		urlGetImage: {
			description: 'URL de récupération de l\'image du captcha',
			table: {
				hidden: true,
				type: { summary: 'string' },
			},
		},
		urlGetAudio: {
			description: 'URL de récupération de l\'audio du captcha',
			table: {
				type: { summary: 'string' },
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
		'service': (e) => {
			console.log('service', e)
			return Promise.reject({ response: { data: { message: 'Captcha invalide' } } })
		},

	},
	render: (args) => {
		return {
			components: { Captcha },
			setup() {
				return { args }
			},
			template: `
                <VCard class="pa-4" max-width="600">
                    <Captcha 
                        url-create="/captcha/captcha.json"
                        url-get-image="/captcha/captcha.png"
                        url-get-audio="/captcha/captcha.mp3"
						v-bind="args"
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
			service="(e) => { ... }"
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

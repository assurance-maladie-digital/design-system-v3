import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproCaptcha from './AmeliproCaptcha.vue'

const meta = {
	argTypes: {
		'captchaInputLabelAudio': { description: 'Libellé du champ texte pour le captcha audio' },
		'captchaInputLabelImg': { description: 'Libellé du champ texte pour le captcha image' },
		'captchaTitle': { description: 'Titre du bloc captcha' },
		'click-play': { description: 'Événement émis au clic sur le bouton lecture', type: 'void' },
		'click-switch': { description: 'Événement émis au clic sur le bouton permettant de passer du captcha image au captcha audio (et inversement). Retourne `true` si l’on bascule vers le captcha audio, `false` dans le cas inverse.', type: 'boolean' },
		'click-update': { description: 'Événement émis au clic sur le bouton permettant de changer d’image ou d’audio', type: 'void' },
		'defaultAudio': { description: 'Charge le composant avec le captcha audio par défaut' },
		'imgAlt': { description: 'Défini une alternative textuelle pour le captcha image' },
		'imgMaxWidth': { description: 'Défini la largeur maximale du captcha image' },
		'imgWidth': { description: 'Défini la largeur du captcha image' },
		'modelValue': { description: 'Défini la valeur du champ de saisie' },
		'switchCaptchaTypeLabelAudio': { description: 'Libellé du bouton permettant de passer du captcha audio au captcha image' },
		'switchCaptchaTypeLabelImg': { description: 'Libellé du bouton permettant de passer du captcha image au captcha audio' },
		'uniqueId': { description: 'Identifiant unique du bloc captcha' },
		'update:model-value': { description: 'Événement émis au changement de valeur du champ de saisie. Retourne un object ICaptcha.', type: 'ICaptcha' },
		'updateCaptchaLabelAudio': { description: 'Libellé du bouton permettant de changer d’audio' },
		'updateCaptchaLabelImg': { description: 'Libellé du bouton permettant de changer d’image' },
	},
	component: AmeliproCaptcha,
	title: 'Composants/Amelipro/Formulaires/AmeliproCaptcha',
} as Meta<typeof AmeliproCaptcha>
export default meta

type Story = StoryObj<typeof AmeliproCaptcha>

export const Default: Story = {
	args: {
		modelValue: {
			audioSrc: '/amelipro/sound/captcha.wav',
			imgSrc: '/amelipro/img/captcha.png',
			inputValue: 'input value',
		},
		uniqueId: 'amelipro-captcha-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproCaptcha
		v-model="model"
		unique-id="amelipro-captcha-unique-id"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproCaptcha } from '@cnamts/synapse'
	import { ref } from 'vue'

	const model = ref({
		audioSrc: '/amelipro/sound/captcha.wav',
		imgSrc: '/amelipro/img/captcha.png',
		inputValue: 'input value',
	})
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCaptcha },
		setup() {
			const model = ref(args.modelValue)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `
			<AmeliproCaptcha
				v-bind="args"
				v-model="model"
			/>
		`,
	}),
}

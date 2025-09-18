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
			inputValue: '',
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
		inputValue: '',
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

export const AudioParDefaut: Story = {
	args: {
		modelValue: {
			audioSrc: '/amelipro/sound/captcha.wav',
			imgSrc: '/amelipro/img/captcha.png',
			inputValue: '',
		},
		uniqueId: 'amelipro-captcha-audio-default',
		defaultAudio: true,
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Le captcha s'affiche en mode audio par défaut grâce à la prop <code>defaultAudio</code>.</p>
  <AmeliproCaptcha
    v-model="model"
    unique-id="amelipro-captcha-audio-default"
    default-audio
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCaptcha } from '@cnamts/synapse'
  import { ref } from 'vue'
  const model = ref({
    audioSrc: '/amelipro/sound/captcha.wav',
    imgSrc: '/amelipro/img/captcha.png',
    inputValue: '',
  })
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCaptcha },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Le captcha s'affiche en mode audio par défaut grâce à la prop <code>defaultAudio</code>.</p>
<AmeliproCaptcha v-bind="args" v-model="model" />`,
	}),
}

export const LabelsPersonnalises: Story = {
	args: {
		modelValue: {
			audioSrc: '/amelipro/sound/captcha.wav',
			imgSrc: '/amelipro/img/captcha.png',
			inputValue: '',
		},
		uniqueId: 'amelipro-captcha-labels',
		captchaInputLabelAudio: 'Code audio personnalisé :',
		captchaInputLabelImg: 'Code image personnalisé :',
		captchaTitle: 'Titre personnalisé',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les labels et le titre sont personnalisés via les props <code>captchaInputLabelAudio</code>, <code>captchaInputLabelImg</code> et <code>captchaTitle</code>.</p>
  <AmeliproCaptcha
    v-model="model"
    unique-id="amelipro-captcha-labels"
    captcha-input-label-audio="Code audio personnalisé :"
    captcha-input-label-img="Code image personnalisé :"
    captcha-title="Titre personnalisé"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCaptcha } from '@cnamts/synapse'
  import { ref } from 'vue'
  const model = ref({
    audioSrc: '/amelipro/sound/captcha.wav',
    imgSrc: '/amelipro/img/captcha.png',
    inputValue: '',
  })
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCaptcha },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Les labels et le titre sont personnalisés via les props <code>captchaInputLabelAudio</code>, <code>captchaInputLabelImg</code> et <code>captchaTitle</code>.</p>
<AmeliproCaptcha v-bind="args" v-model="model" />`,
	}),
}

export const ImagePersonnalisee: Story = {
	args: {
		modelValue: {
			audioSrc: '/amelipro/sound/captcha.wav',
			imgSrc: '/amelipro/img/captcha.png',
			inputValue: '',
		},
		uniqueId: 'amelipro-captcha-img',
		imgAlt: 'Captcha personnalisé',
		imgWidth: '200px',
		imgMaxWidth: '80%',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>L’image du captcha est personnalisée via les props <code>imgAlt</code>, <code>imgWidth</code> et <code>imgMaxWidth</code>.</p>
  <AmeliproCaptcha
    v-model="model"
    unique-id="amelipro-captcha-img"
    img-alt="Captcha personnalisé"
    img-width="200px"
    img-max-width="80%"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCaptcha } from '@cnamts/synapse'
  import { ref } from 'vue'
  const model = ref({
    audioSrc: '/amelipro/sound/captcha.wav',
    imgSrc: '/amelipro/img/captcha.png',
    inputValue: '',
  })
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCaptcha },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">L’image du captcha est personnalisée via les props <code>imgAlt</code>, <code>imgWidth</code> et <code>imgMaxWidth</code>.</p>
<AmeliproCaptcha v-bind="args" v-model="model" />`,
	}),
}

export const BoutonsDeMiseAJour: Story = {
	args: {
		modelValue: {
			audioSrc: '/amelipro/sound/captcha.wav',
			imgSrc: '/amelipro/img/captcha.png',
			inputValue: '',
		},
		uniqueId: 'amelipro-captcha-btns',
		updateCaptchaLabelAudio: 'Nouveau son',
		updateCaptchaLabelImg: 'Nouvelle image',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les libellés des boutons de mise à jour (à gauche) sont personnalisés via les props <code>updateCaptchaLabelAudio</code> et <code>updateCaptchaLabelImg</code>.</p>
  <AmeliproCaptcha
    v-model="model"
    unique-id="amelipro-captcha-btns"
    update-captcha-label-audio="Nouveau son"
    update-captcha-label-img="Nouvelle image"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCaptcha } from '@cnamts/synapse'
  import { ref } from 'vue'
  const model = ref({
    audioSrc: '/amelipro/sound/captcha.wav',
    imgSrc: '/amelipro/img/captcha.png',
    inputValue: '',
  })
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCaptcha },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Les libellés des boutons de mise à jour (à gauche) sont personnalisés via les props <code>updateCaptchaLabelAudio</code> et <code>updateCaptchaLabelImg</code>.</p>
<AmeliproCaptcha v-bind="args" v-model="model" />`,
	}),
}

export const BoutonsDeBascule: Story = {
	args: {
		modelValue: {
			audioSrc: '/amelipro/sound/captcha.wav',
			imgSrc: '/amelipro/img/captcha.png',
			inputValue: '',
		},
		uniqueId: 'amelipro-captcha-switch',
		switchCaptchaTypeLabelAudio: 'Basculer vers image',
		switchCaptchaTypeLabelImg: 'Basculer vers audio',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
  <p>Les libellés des boutons de bascule (à droite) sont personnalisés via les props <code>switchCaptchaTypeLabelAudio</code> et <code>switchCaptchaTypeLabelImg</code>.</p>
  <AmeliproCaptcha
    v-model="model"
    unique-id="amelipro-captcha-switch"
    switch-captcha-type-label-audio="Basculer vers image"
    switch-captcha-type-label-img="Basculer vers audio"
  />
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
  import { AmeliproCaptcha } from '@cnamts/synapse'
  import { ref } from 'vue'
  const model = ref({
    audioSrc: '/amelipro/sound/captcha.wav',
    imgSrc: '/amelipro/img/captcha.png',
    inputValue: '',
  })
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCaptcha },
		setup() {
			const model = ref(args.modelValue)
			watch(() => args.modelValue, (newValue) => {
				model.value = newValue
			})
			return { args, model }
		},
		template: `<p class="mb-2">Les libellés des boutons de bascule (à droite) sont personnalisés via les props <code>switchCaptchaTypeLabelAudio</code> et <code>switchCaptchaTypeLabelImg</code>.</p>
<AmeliproCaptcha v-bind="args" v-model="model" />`,
	}),
}

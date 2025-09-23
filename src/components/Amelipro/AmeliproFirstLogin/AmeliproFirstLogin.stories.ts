import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
import AmeliproFirstLogin from './AmeliproFirstLogin.vue'

const meta = {
	argTypes: {
		'change': { description: 'Événement émis au click sur les boutons annuler et fermer' },
		'click:more-info': { description: 'Événement émis au click sur le bouton plus d\'informations' },
		'update:model-value': { description: 'Événement émis à la mise à jour du v-model de la modale' },
		'confirm': { description: 'Événement émis au click sur le bouton valider' },
		'mainContentMaxHeight': { description: 'Hauteur maximale du contenu principal' },
		'mainContentMinHeight': { description: 'Hauteur minimale du contenu principal' },
		'modelValue': { description: 'Valeur d’affichage de la fenêtre de dialogue' },
		'moreInfoHref': { description: 'Url pour le bouton plus d\'informations' },
		'moreInfoTo': { description: 'Route pour le bouton plus d\'informations' },
		'uniqueId': { description: 'Identifiant unique de la modale' },
	},
	component: AmeliproFirstLogin,
	title: 'Composants/Amelipro/Boites de dialogue/AmeliproFirstLogin',
} as Meta<typeof AmeliproFirstLogin>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		modelValue: false,
		uniqueId: 'amelipro-first-login-unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center justify-center w-100">
		<AmeliproBtn
			unique-id="amelipro-first-login-unique-id-btn"
			@click="value = true"
		>
			Ouvrir la modale de première connexion
		</AmeliproBtn>

		<AmeliproFirstLogin>
			v-model="value"
			unique-id="amelipro-first-login-unique-id"
		/>
	</div>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue
	import { AmeliproBtn, AmeliproFirstLogin } from '@cnamts/synapse'

	const value = ref(false)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproFirstLogin, AmeliproBtn },
		setup() {
			const value = ref<boolean | undefined>(false)

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.modelValue, (newValue) => {
				value.value = newValue
			})
			return { args, value }
		},
		template: `
<div class="d-flex flex-wrap align-center justify-center w-100">
	<AmeliproBtn
		unique-id="amelipro-first-login-unique-id-btn"
		@click="value = true"
	>
		Ouvrir la modale de première connexion
	</AmeliproBtn>

	<AmeliproFirstLogin
		v-bind="args"
		v-model="value"
	/>
</div>`,
	}),
}

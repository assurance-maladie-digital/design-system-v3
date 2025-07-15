import type { Meta, StoryObj } from '@storybook/vue3'
import { ref, watch } from 'vue'
import AmeliproBtn from '../AmeliproBtn/AmeliproBtn.vue'
import AmeliproDialog from './AmeliproDialog.vue'

const meta = {
	argTypes: {
		attach: { description: 'attache le contenu de la boite de dialogue et son overlay à l\'intérieur de v-app' },
		cancelBtnLabel: { description: 'Label du bouton annuler' },
		change: { description: 'Événement émis au click sur les boutons annuler et fermer' },
		confirm: { description: 'Événement émis au click sur le bouton valider' },
		default: { description: 'Contenu principal de la fenêtre' },
		eager: { description: 'Property héritée de Vuetify permettant de charger le contenu de la modale dans le DOM même lorsque la modale est fermée' },
		footer: { description: 'Contenu du footer de la fenêtre' },
		fullscreen: { description: 'Affiche la modale en plein écran' },
		header: { description: 'Titre de la fenêtre' },
		hiddenCancelBtn: { description: 'Masque le bouton Annuler du footer' },
		labelledby: { description: 'Id du titre de la modale' },
		mainContentMaxHeight: { description: 'Hauteur maximale du contenu principal' },
		mainContentMinHeight: { description: 'Hauteur minimale du contenu principal' },
		modelValue: { description: 'Valeur d’affichage de la fenêtre de dialogue' },
		noClickOutside: { description: 'Empêche la fermeture de la modale en cliquant à l’extérieur ou en appuyant sur echap mais la croix de fermeture reste présente' },
		noFooter: { description: 'Masque le footer par défaut' },
		persistent: { description: 'Retire la croix de fermeture' },
		title: { description: 'Titre par défaut' },
		uniqueId: { description: 'Identifiant unique de la modale' },
		validationBtnLabel: { description: 'Label du bouton valider' },
		width: { description: 'Largeur de la fenêtre de dialogue' },
	},
	component: AmeliproDialog,
	title: 'Composants/Amelipro/Boites de dialogue/AmeliproDialog',
} as Meta<typeof AmeliproDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
	args: {
		default: '[Slot: default]',
		modelValue: false,
		uniqueId: 'amelipro-dialog-unique-id',
	},
	parameters: {
		args: {},
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<div class="d-flex flex-wrap align-center justify-center w-100">
		<AmeliproBtn
			unique-id="amelipro-dialog-unique-id-btn"
			@click="value = true"
		>
			Ouvrir la modale
		</AmeliproBtn>

		<AmeliproDialog
			v-model="value"
			labelledby="modal-title"
			unique-id="amelipro-dialog-unique-id"
		>
			<template #header>
				<h2
					id="modal-title"
					class="ma-0 text-h3"
				>
					Mon titre
				</h2>
			</template>

			<template #default>
				[Slot: default]
			</template>
		</AmeliproDialog>
	</div>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	import { ref } from 'vue
	import { AmeliproBtn, AmeliproDialog } from '@cnamts/synapse'

	const value = ref(false)
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproDialog, AmeliproBtn },
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
		unique-id="amelipro-dialog-unique-id-btn"
		@click="value = true"
	>
		Ouvrir la modale
	</AmeliproBtn>

	<AmeliproDialog
		labelledby="modal-title"
		v-bind="args"
		v-model="value"
	>
		<template #header>
			<h2
				id="modal-title"
				class="ma-0 text-h3"
			>
				Mon titre
			</h2>
		</template>

		<template #default>
			{{ args.default }}
		</template>
	</AmeliproDialog>
</div>`,
	}),
}

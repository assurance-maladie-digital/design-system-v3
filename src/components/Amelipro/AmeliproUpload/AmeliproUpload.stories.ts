import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproUpload from './AmeliproUpload.vue'
import { ref, watch } from 'vue'

const meta = {
	argTypes: {
		'required': { description: 'Défini si le champ est obligatoire' },
		'change': {
			table: { category: 'events' },
			description: 'Événement émis au changement de la liste de fichiers par utilisation du click sur le champs, renvoie la liste de fichiers',
		},
		'disabled': { description: 'Désactive le champ' },
		'errorMessages': { description: 'Objet contenant les différents messages d’erreur. Si non renseigné ou partiellement renseigné, les messages d’erreur par défaut ci-dessous seront utilisés.' },
		'errorTitle': { description: 'Texte affiché au-dessus de la liste des erreurs. Si non renseigné, le texte par défaut sera utilisé et gèrera automatiquement le singulier et le pluriel. Si `errorTitle` est renseigné avec une chaîne vide, aucun texte n’est affiché.' },
		'externalErrors': { description: 'Afficher dans le composant des messages pour des erreurs survenues en dehors du composant.' },
		'fileTypeAccepted': {	description: 'Tableau de string au format MIME pour le type de fichier accepté. Exemple : application/pdf (string au format MIME)' },
		'inputLabel': { description: 'Libellé du champ' },
		'maxFileNumber': { description: 'Nombre maximum de fichiers autorisés' },
		'rules': { description: 'Liste des règles supplémentaires à respecter pour valider le champ, en plus des règles par défaut. Si une règle est refusée, l’envoi du formulaire est impossible. Par défaut seule la règle `required` est appliquée (si la prop `required` vaut `true`). ' },
		'uniqueId': { description: 'Identifiant unique pour le champ' },
		'value': { description: 'Liste des fichiers actuelle' },
		'warningRules': { description: '' },
		'warningTitle': { description: '' },
		'update:model-value': {
			table: { category: 'events' },
			description: 'Événement émis au changement du v-model, renvoie la liste de fichiers',
		},
	},
	args: {	modelValue: [] },
	component: AmeliproUpload,
	parameters: { controls: { exclude: ['append-icon'] } },
	title: 'Composants/Amelipro/Formulaires/AmeliproUpload',
} as Meta<typeof AmeliproUpload>

export default meta

type Story = StoryObj<typeof AmeliproUpload>

export const Default: Story = {
	args: {
		fileTypeAccepted: [
			'application/pdf',
			'image/jpeg',
		],
		maxFileNumber: 3,
		uniqueId: 'amelipro-upload-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproUpload
		v-model="modelValue"
		:file-type-accepted="[
			'application/pdf',
			'image/jpeg',
		]"
		:max-file-number="1"
		unique-id="file-input-example"
	/>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproUpload } from '@cnamts/synapse'
	import { ref } from 'vue'

	const modelValue = ref([])
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproUpload },
		setup() {
			const modelValue = ref()

			// Optional: Keeps v-model in sync with storybook args
			watch(() => args.value, (newValue) => {
				modelValue.value = newValue
			})
			return { args, modelValue }
		},
		template: `
			<AmeliproUpload
				v-bind="args"
				v-model="modelValue"
				:file-type-accepted="args.fileTypeAccepted"
				:max-file-number="args.maxFileNumber"
				:unique-id="args.uniqueId"
			/>
		`,
	}),
}

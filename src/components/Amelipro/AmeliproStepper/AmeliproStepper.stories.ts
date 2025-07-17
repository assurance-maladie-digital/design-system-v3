import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
import AmeliproStepper from './AmeliproStepper.vue'

const meta = {
	argTypes: {
		'backBtn': { description: 'Slot dans lequel injecter un bouton retour pour la première étape' },
		'centered': { description: 'Centrer les boutons étape' },
		'change-step': { description: 'Événement émis au click sur une des étapes. Retourne le nouvel `index`', type: 'number' },
		'finalOptionalBtn': { description: 'Slot dans lequel injecter des boutons supplémentaire pour l’étape finale' },
		'finalStepBtn': { description: 'Libellé du bouton de soumission de la dernière étape' },
		'finalStepLeftBtn': { description: 'Slot permettant de mettre un élément à gauche du bouton final' },
		'focusChange': { description: 'Donne le focus au bouton de l’étape sélectionnée manuellement. Utile après un changement manuel de l’étape.' },
		'hideBackBtn': { description: 'Masque le bouton de retour à l’étape précédente' },
		'items': {
			description: 'Tableau comprenant la liste des onglets et leur valeur activé ou désactivé',
			table: {
				type: {
					detail: `Array<{
	label: string;
	disabled: boolean;
	titleDisabled?: boolean;
}>`,
					summary: 'AmeliproStep[]',
				},
			},
		},
		'leftBtn': { description: 'Slot permettant de mettre un élément à gauche des boutons suivant ou transmettre sur toutes les étapes' },
		'manualChangeStep': { description: 'Retire le fonctionnement par défaut du changement automatique des étapes' },
		'next-step': { description: 'Événement émis au click sur le bouton suivant. Retourne le nouvel `index`', type: 'number' },
		'nextBtnLabel': { description: 'Libellé du bouton étape suivant' },
		'noDefaultStyle': { description: 'Retire le style par défaut autour du contenu des étapes' },
		'previous-step': { description: 'Événement émis au click sur le bouton précédent. Retourne le nouvel `index`', type: 'number' },
		'previousBtnLabel': { description: 'Libellé du bouton étape précédente' },
		'stepContent': { description: 'Slot dans lequel injecter le contenu des étapes' },
		'submit': { description: 'Événement émis au click sur le bouton permettant de soumettre la dernière étape.', type: 'void' },
		'uniqueId': { description: 'Identifiant unique du composant' },
		'value': { description: 'Index de l’étape séléctionnée par défaut' },

	},
	component: AmeliproStepper,
	title: 'Composants/Amelipro/Mise en page/AmeliproStepper',
} as Meta<typeof AmeliproStepper>
export default meta

type Story = StoryObj<typeof AmeliproStepper>

const items = [
	{
		disabled: false,
		label: 'Mes Informations',
	},
	{
		disabled: false,
		label: 'Ma démarche',
	},
	{
		label: 'Ma demande',
		disabled: true,
	},
	{
		label: 'Récapitulatif',
		disabled: true,
	},
]

export const Default: Story = {
	args: {
		items,
		noDefaultStyle: true,
		uniqueId: 'amelipro-stepper-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproStepper
		:items="items"
		no-default-style
		unique-id="stepper-example"
		:value="1"
	>
		<template #stepContent>
			<AmeliproCard
				card-title="Titre de mon étape"
				unique-id="current-step-card"
			>
				Contenu de l'étape dans le slot
			</AmeliproCard>
		</template>
	</AmeliproStepper>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproCard, AmeliproStepper } from '@cnamts/synapse'
	
	const items = [
		{
			disabled: false,
			label: 'Mes Informations',
		},
		{
			disabled: false,
			label: 'Ma démarche',
		},
		{
			label: 'Ma demande',
			disabled: true,
		},
		{
			label: 'Récapitulatif',
			disabled: true,
		},
	];
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard, AmeliproStepper },
		setup() {
			return { args }
		},
		template: `
<AmeliproStepper
	v-bind="args"
>
	<template #stepContent>
		<AmeliproCard
			card-title="Titre de mon étape"
			unique-id="current-step-card"
		>
			Contenu de l'étape dans le slot
		</AmeliproCard>
	</template>
</AmeliproStepper>
		`,
	}),

}

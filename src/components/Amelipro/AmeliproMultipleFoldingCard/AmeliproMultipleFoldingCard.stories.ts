import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproMultipleFoldingCard from './AmeliproMultipleFoldingCard.vue'
import type { AmeliproMultipleFoldingCardItem } from './types'

const meta = {
	argTypes: {
		'borderColor': { description: 'Couleur de bordure de la carte' },
		'bordered': { description: 'Permet d’activer ou de désactiver les bordures de la carte' },
		'cardColor': { description: 'Couleur de fond de la carte' },
		'defaultItemOpened': { description: 'Index du bloc ouvert par défaut au chargement du composant' },
		'headerRight': { description: 'le contenu de la partie droite du header' },
		'headerRightWidth': { description: 'Défini la largeur de la partie droite du header de la carte. Cette props est utile seulement si le slot header-right est utilisé' },
		'item': { description: 'Slot généré automatiquement pour tous les blocs dépliants afin d’y insérer le contenu principal du bloc' },
		'item.id': { description: 'Slot généré automatiquement pour chaque bloc dépliant afin d’y insérer le contenu principal du bloc' },
		'manualValidation': { description: 'Active le fonctionnement manuel de la validation des items' },
		'tab-clicked': { description: 'Événement émis au click sur les boutons ouverture/fermeture des cards, renvoie l’id de l’item cliqué' },
		'tabs': {
			description: 'Tableau comprenant la liste des blocs dépliant avec leur identifiant( doit être unique dans la page) et leurs titres',
			table: {
				type: {
					detail: `Array<{
	id: string;
	title: string;
	valid?: boolean;
	error?: boolean;
}>`,
					summary: 'AmeliproMultipleFoldingCardItem[]',
				},
			},
		},
		'title': { description: 'Titre de la carte autour des panneaux dépliants' },
		'titleLevel': { description: 'Niveau de titre des panneaux dépliants' },
		'titleUppercase': { description: 'Transforme le titre de la carte en lettres capitales' },
		'uniqueId': { description: 'identifiant unique du composant' },
	},
	component: AmeliproMultipleFoldingCard,
	title: 'Composants/Amelipro/Cartes/AmeliproMultipleFoldingCard',
} as Meta<typeof AmeliproMultipleFoldingCard>

export default meta

type Story = StoryObj<typeof meta>

const items: AmeliproMultipleFoldingCardItem[] = [
	{
		id: 'amelipro-multiple-folding-card-item-1',
		title: 'Exemple 1',
		valid: true,
	},
	{
		error: true,
		id: 'amelipro-multiple-folding-card-item-2',
		title: 'Exemple 2',
	},
	{
		id: 'amelipro-multiple-folding-card-item-3',
		title: 'Exemple 3',
	},
	{
		id: 'amelipro-multiple-folding-card-item-4',
		title: 'Exemple 4',
	},
]

export const Default: Story = {
	args: {
		tabs: items,
		title: 'Titre de la carte',
		uniqueId: 'amelipro-multiple-folding-card-unique-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproMultipleFoldingCard
		:tabs="items"
		title="Titre de la Carte"
		unique-id="amelipro-multiple-folding-card-unique-id"
	>
		<template #amelipro-multiple-folding-card-item-1>
			<p>Mon test 1</p>
		</template>

		<template #amelipro-multiple-folding-card-item-2>
			<p>Mon test 2</p>
		</template>

		<template #item>
			<p>Mon test global</p>
		</template>
	</AmeliproMultipleFoldingCard>
</template>`,
			},
			{
				name: 'Scripts',
				code: `<script setup lang="ts">
	const items = [
		{
			id: 'amelipro-multiple-folding-card-item-1',
			title: 'Exemple 1',
			valid: true,
		},
		{
			error: true,
			id: 'amelipro-multiple-folding-card-item-2',
			title: 'Exemple 2',
		},
		{
			id: 'amelipro-multiple-folding-card-item-3',
			title: 'Exemple 3',
		},
		{
			id: 'amelipro-multiple-folding-card-item-4',
			title: 'Exemple 4',
		},
	];
</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproMultipleFoldingCard },
		setup() {
			return { args }
		},
		template: `
<AmeliproMultipleFoldingCard
	v-bind="args"
>
	<template #amelipro-multiple-folding-card-item-1>
		<p>Mon test 1</p>
	</template>

	<template #amelipro-multiple-folding-card-item-2>
		<p>Mon test 2</p>
	</template>

	<template #item>
		<p>Mon test global</p>
	</template>
</AmeliproMultipleFoldingCard>`,
	}),
}

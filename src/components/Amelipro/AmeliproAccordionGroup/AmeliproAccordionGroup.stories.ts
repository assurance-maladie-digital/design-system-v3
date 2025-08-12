import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproAccordionGroup from './AmeliproAccordionGroup.vue'

const meta = {
	argTypes: {
		'`accordion-content-${index}`': { description: 'Slot généré automatiquement pour chaque bloc dépliant afin d’y insérer le contenu principal du bloc' },
		'`accordion-header-right-${index}`': { description: 'Slot généré automatiquement pour chaque bloc dépliant afin d’y insérer le contenu de la partie droite du header' },
		'accordion-content': { description: 'Slot généré automatiquement pour tous les bloc dépliant afin de donner le même aspect à tous les contenus principaux de la liste' },
		'accordion-header-right': { description: 'Slot généré automatiquement pour tous les bloc dépliant afin de donner le même aspect à tous les header de la liste' },
		'change': { description: 'Événement émis au click sur les boutons ouverture/fermeture des accordéons. Retourne l’id de l’accordéon ouvert.', type: 'string | null' },
		'defaultItemOpened': { description: 'Index du bloc ouvert par défaut au chargement du composant' },
		'groupBorderColor': { description: 'Couleur de bordure des panneaux dépliants' },
		'groupBordered': { description: 'Défini une bordure aux panneaux dépliants' },
		'groupColor': { description: 'Couleur de fond des panneaux dépliants' },
		'groupTitleLevel': { description: 'Niveau de titre des panneaux dépliants' },
		'groupTitleUppercase': { description: 'Transforme les titres des panneaux dépliants en lettres capitales' },
		'headerRightWidth': { description: 'Défini la largeur de la partie droite des headers des cartes. Cette props est utile seulement si le slot accordion-header-right est utilisé' },
		'hideSeparator': { description: 'Masque le séparateur entre le titre et le contenu des panneaux dépliants' },
		'items': {
			description: 'Tableau comprenant la liste des blocs dépliant avec leur identifiant( doit être unique dans la page) et le titre du bloc',
			table: {
				type: {
					detail: `Array<{
						id: string;
						title: string;
						}>`,
					summary: 'AmeliproAccordionGroupItem[]',
				},
			},
		},
		'openClose': { description: 'Fonction permettant d’ouvrir ou fermer l’accordéon', type: 'void' },
		'uniqueId': { description: 'Identifiant unique du groupe de panneaux dépliants' },

	},
	component: AmeliproAccordionGroup,
	title: 'Composants/Amelipro/Blocs dépliants/AmeliproAccordionGroup',
} as Meta<typeof AmeliproAccordionGroup>
export default meta

type Story = StoryObj<typeof AmeliproAccordionGroup>

const items = [
	{
		id: 'test-1',
		title: 'Exemple 1',
	},
	{
		id: 'test-2',
		title: 'Exemple 2',
	},
	{
		id: 'test-3',
		title: 'Exemple 3',
	},
	{
		id: 'test-4',
		title: 'Exemple 4',
	},
]

export const Default: Story = {
	args: {
		'accordion-content': '[Slot: accordion-content]',
		'accordion-header-right': '[Slot: accordion-header-right]',
		items,
		'uniqueId': 'amelipro-accordion-group',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordionGroup
		class="w-100"
		:items="items"
		unique-id="amelipro-accordion-group"
	>
		<template #accordion-header-right>
			[Slot: accordion-header-right]
		</template>

		<template #accordion-content>
			[Slot: accordion-content]
		</template>
	</AmeliproAccordionGroup>
</template>`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproAccordionGroup } from '@cnamts/synapse'

	const items = [
		{
			id: 'test-1',
			title: 'Exemple 1',
		},
		{
			id: 'test-2',
			title: 'Exemple 2',
		},
		{
			id: 'test-3',
			title: 'Exemple 3',
		},
		{
			id: 'test-4',
			title: 'Exemple 4',
		},
	]
</script>
				`,
			},
		],
	},
	render: args => ({
		components: { AmeliproAccordionGroup },
		setup() {
			return { args }
		},
		template: `
	<AmeliproAccordionGroup
		class="w-100"
		v-bind="args"
	>
		<template #accordion-header-right>
			[Slot: accordion-header-right]
		</template>

		<template #accordion-content>
			[Slot: accordion-content]
		</template>
	</AmeliproAccordionGroup>`,
	}),
}

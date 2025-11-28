import type { Meta, StoryObj } from '@storybook/vue3'
import AmeliproCard from '../AmeliproCard/AmeliproCard.vue'
import AmeliproAccordionFrieze from './AmeliproAccordionFrieze.vue'

const meta = {
	argTypes: {
		'`${uniqueId}-slot-slide-${index}-item-${item.uniqueId}`': { description: 'Slots générés automatiquement pour chaque item' },
		'click-next': { description: 'Evénement émis au clic sur le bouton suivant du carrousel' },
		'click-previous': { description: 'Evénement émis au clic sur le bouton précédent du carrousel' },
		'defaultOpenedAccordion': { description: 'id unique du bloc déplié par défaut' },
		'defaultSlide': { description: 'numéro de la slide affichée par défaut' },
		'duration': { description: 'Durée de transition entre les slides du carrousel en secondes' },
		'fillSlideOrientation': { description: 'Définit dans quel sens doivent être remplies les slide prend les valeur `left` ou `right`' },
		'item': { description: 'Slots générés automatiquement pour chaque item, afin de donner le même aspect à tous les items' },
		'items': {
			description: 'Tableau comprenant la liste des blocs dépliants à afficher dans le carrousel',
			table: {
				type: {
					detail: `Array <{
	title?: string,
	linkStyleText?: string,
	uniqueId: string,
	isEmpty?: boolean,
}>`,
					summary: 'AmeliproAccordionFriezeItem[]',
				},
			},
		},
		'labelNextBtn': { description: 'Libellé du bouton suivant, il est affiché au survol du bouton' },
		'labelPreviousBtn': { description: 'Libellé du bouton précédent, il est affiché au survol du bouton' },
		'open-close-event': { description: 'Evénement émis à l\'ouverture ou fermeture des accordéons' },
		'title': { description: 'Titre du carrousel doit être pertinent par rapport au contenu' },
		'uniqueId': { description: 'Identifiant unique du carrousel' },
	},
	component: AmeliproAccordionFrieze,
	title: 'Composants/Amelipro/Listes de résultats/AmeliproAccordionFrieze',
} as Meta<typeof AmeliproAccordionFrieze>
export default meta

type Story = StoryObj<typeof AmeliproAccordionFrieze>

export const Default: Story = {
	args: {
		items: [
			{
				linkStyleText: 'sous-titre 1',
				title: 'titre 1',
				uniqueId: '1',
			},
			{
				linkStyleText: 'sous-titre 2',
				title: 'titre 2',
				uniqueId: '2',
			},
			{
				linkStyleText: 'sous-titre 3',
				title: 'titre 3',
				uniqueId: '3',
			},
			{
				linkStyleText: 'sous-titre 4',
				title: 'titre 4',
				uniqueId: '4',
			},
			{
				linkStyleText: 'sous-titre 5',
				title: 'titre 5',
				uniqueId: '5',
			},
			{
				linkStyleText: 'sous-titre 6',
				title: 'titre 6',
				uniqueId: '6',
			},
			{
				linkStyleText: 'sous-titre 7',
				title: 'titre 7',
				uniqueId: '7',
			},
			{
				linkStyleText: 'sous-titre 8',
				title: 'titre 8',
				uniqueId: '8',
			},
			{
				linkStyleText: 'sous-titre 9',
				title: 'titre 9',
				uniqueId: '9',
			},
			{
				linkStyleText: 'sous-titre 10',
				title: 'titre 10',
				uniqueId: '10',
			},
			{
				linkStyleText: 'sous-titre 11',
				title: 'titre 11',
				uniqueId: '11',
			},
			{
				linkStyleText: 'sous-titre 12',
				title: 'titre 12',
				uniqueId: '12',
			},
			{
				linkStyleText: 'sous-titre 13',
				title: 'titre 13',
				uniqueId: '13',
			},
			{
				linkStyleText: 'sous-titre 14',
				title: 'titre 14',
				uniqueId: '14',
			},
		],
		title: 'Titre du carrousel',
		uniqueId: 'amelipro-accordion-frieze-id',
	},
	parameters: {
		sourceCode: [
			{
				name: 'Template',
				code: `<template>
	<AmeliproAccordionFrieze
		:items="items"
		title="Titre du carrousel"
		unique-id="amelipro-accordion-frieze-id"
	>
		<template 
		  v-for="(item, index) in items"
		  :key="item.uniqueId"
		  #[slotNames[index]]
		  >
				<AmeliproCard 
					card-title="'Contenu ' + item.uniqueId"
					class="mt-4"				
				>
					Le contenu est libre ici, par exemple je reprends le numéro du bloc déplié :
                    {{ item.uniqueId }}
				</AmeliproCard>
		</template>
	</AmeliproAccordionFrieze>
</template>
				`,
			},
			{
				name: 'Script',
				code: `<script setup lang="ts">
	import { AmeliproCard, AmeliproAccordionFrieze } from '@cnamts/synapse'

	const items = [
		{
			linkStyleText: 'sous-titre 1',
			title: 'titre 1',
			uniqueId: '1',
		},
		{
			linkStyleText: 'sous-titre 2',
			title: 'titre 2',
			uniqueId: '2',
		},
		{
			linkStyleText: 'sous-titre 3',
			title: 'titre 3',
			uniqueId: '3',
		},
		{
			linkStyleText: 'sous-titre 4',
			title: 'titre 4',
			uniqueId: '4',
		},
		{
			linkStyleText: 'sous-titre 5',
			title: 'titre 5',
			uniqueId: '5',
		},
		{
			linkStyleText: 'sous-titre 6',
			title: 'titre 6',
			uniqueId: '6',
		},
		{
			linkStyleText: 'sous-titre 7',
			title: 'titre 7',
			uniqueId: '7',
		},
		{
			linkStyleText: 'sous-titre 8',
			title: 'titre 8',
			uniqueId: '8',
		},
		{
			linkStyleText: 'sous-titre 9',
			title: 'titre 9',
			uniqueId: '9',
		},
		{
			linkStyleText: 'sous-titre 10',
			title: 'titre 10',
			uniqueId: '10',
		},
		{
			linkStyleText: 'sous-titre 11',
			title: 'titre 11',
			uniqueId: '11',
		},
		{
			linkStyleText: 'sous-titre 12',
			title: 'titre 12',
			uniqueId: '12',
		},
		{
			linkStyleText: 'sous-titre 13',
			title: 'titre 13',
			uniqueId: '13',
		},
		{
			linkStyleText: 'sous-titre 14',
			title: 'titre 14',
			uniqueId: '14',
		},
	]
	
	const slotNames = items.map((item, index) =>
	\`amelipro-accordion-frieze-id-slot-slide-\${index}-item-\${item.uniqueId}\`
	)

</script>`,
			},
		],
	},
	render: args => ({
		components: { AmeliproCard, AmeliproAccordionFrieze },
		setup() {
			const items = args.items ?? []

			const slotNames = items.map((item, index) =>
				`amelipro-accordion-frieze-id-slot-slide-${index}-item-${item.uniqueId}`,
			)

			return { slotNames, args }
		},
		template: `
          <AmeliproAccordionFrieze
              v-bind="args"
              :items="args.items"
              title="Titre du carrousel"
              unique-id="amelipro-accordion-frieze-id"
          >
            <template
                v-for="(item, index) in args.items"
                :key="item.uniqueId"
                v-slot:[slotNames[index]]
            >
              <AmeliproCard
                  :card-title="\`Contenu \${item.uniqueId}\`"
                  class="mt-4"
              >
                Le contenu est libre ici, par exemple je reprends le numéro du bloc déplié : {{ item.uniqueId }}
              </AmeliproCard>
            </template>
          </AmeliproAccordionFrieze>
        `,
	}),
}

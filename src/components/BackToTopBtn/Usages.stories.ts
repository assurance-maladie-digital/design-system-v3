import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Boutons/BackToTopBtn/Usages',
}

const itemsToDo = [
	'Ce bouton est flottant et situé en bas à droite de la vue navigateur.',
	'Faire revenir l\'utilisateur en haut de page avec un défilement.',
	'Afficher le bouton uniquement après un certain défilement pour ne pas surcharger visuellement l\'interface.',
]

const itemsNotToDo = [
	'Laisser le bouton toujours visible, surtout sur des pages où il est inutile.',
	'Faire revenir l\'utilisateur en haut de page avec une action brusque (comme un retour immédiat) sans animation fluide.',
]

export const UsagePage: StoryObj = {

	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon, Usages },

			setup() {
				const icon = checkIcon

				return { icon, linkICon, croixIcon, checkIcon, itemsNotToDo, itemsToDo }
			},
			template: `
				 <Usages
					:items1="itemsToDo"
					:items2="itemsNotToDo"
				/>
			`,
		}
	},
	tags: ['!dev'],
}

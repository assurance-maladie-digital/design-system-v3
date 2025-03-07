import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Feedback/DialogBox/Usages',
}

const itemsToDo = [
	'Utiliser un titre clair et descriptif pour expliquer l\'objectif de la modale.',
	'Garder le contenu de la modale concis et pertinent.',
	'Adapter la taille de la modale au contenu.',
	'Ajouter une option explicite pour fermer la modale (ex. : bouton "Fermer" ou icône de croix).',
	'La modale se positionne au centre de l\'écran sur un fond noir d\'opacité afin de guider l\'attention de l\'utilisateur.',
]

const itemsNotToDo = [
	'Utiliser une modale pour afficher à l\'utilisateur des informations non-essentielles.',
	'Surcharger la modale avec beaucoup de contenu ou d\'actions à effectuer.',
	'Bloquer la fermeture de la modale (sauf si nécéssaire pour des raisons critiques).',
	'Trop multiplier les modales dans un parcours utilisateur.',
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

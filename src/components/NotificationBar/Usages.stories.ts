import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Feedback/NotificationBar/Usages',
}

const itemsToDo = [
	'La nature du message (erreur, succès, information) doit être clairement exprimée dans le titre de l\'alerte. La couleur ou l\'icône n\'étant pas accessibles ou compréhensibles par tous les utilisateurs.',
	'La barre de notification doit rester affichée jusqu\'à ce que l\'utilisateur souhaite la fermer.',
	'La barre de notifications doit avoir une largeur adaptée à son contenu (avec une largeur max de ??px).',
]

const itemsNotToDo = [
	'Pas plus de 3 lignes.',
	'Il est techniquement possible de faire disparaitre la barre de notification après un délai mais cette pratique n\'est déconseillé pour des raisons d\'accessibilité afin de permettre à tout le monde de prendre le temps nécéssaire de lire la notification.',
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

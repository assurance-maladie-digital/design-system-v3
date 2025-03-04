import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Feedback/SyAlert/Usages',
}

const itemsToDo = [
	'La nature du message (erreur, succès, information) doit être clairement exprimée dans le titre de l\'alerte. La couleur ou l\'icône n\'étant pas accessibles ou compréhensibles par tous les utilisateurs.',
	'Placer la bannière en tête de la section à laquelle elle s\'applique.',
]

const itemsNotToDo = [
	'Utiliser ce composant à la place d\'une page d\'erreur.',

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

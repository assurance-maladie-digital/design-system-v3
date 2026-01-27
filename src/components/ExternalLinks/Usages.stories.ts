import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Navigation/ExternalLinks/Usages',
}

const itemsToDo = [
	'Les liens externes s\'ouvrent par défaut dans une nouvel onglet pour éviter que l\'utilisateur ne quitte accidentellement l\'application.',
	'Privilégier des libellés informatifs, comme "Accèder à la page de l\'URSSAF".',
]

const itemsNotToDo = [
	'Evitez les libellés génériques comme "Cliquez-ici" ou "En savoir plus".',

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

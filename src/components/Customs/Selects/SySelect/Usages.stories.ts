import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Formulaires/Selects/SySelect/Usages',
}

const itemsToDo = [
	'Utiliser un libellé clair et concis.',
	'Trier les options de manière logique (alphabétique, fréquence d\'utilisation).',
	'Limiter le nombre d\'options dans une liste sans recherche.',
]

const itemsNotToDo = [
	'Utiliser le composant pour des choix binaires (préférer un bouton radio).',
	'Utiliser une valeur par défaut si la selection n\'est pas requise.',
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

import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Formulaires/SelectBtnField/Usages',
}
const itemsToDo = [
	'Utiliser des libellés clairs et compréhensibles.',
	'Limiter le nombre d\'options pour éviter la surcharge cognitive.',
]

const itemsNotToDo = [
	'Utiliser ce composant pour un trop grand nombre d\'options. (Privilégier alors un bouton select).',
	'Rendre la sélection ambiguë (ex. : icônes sans texte explicatif).',
	'Forcer une selection initiale si elle n\'est pas nécessaire.',
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

import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Navigation/SkipLink/Usages',
}

const itemsToDo = [
	'Le composant lien d\'évitement est invisible par défaut pour ne pas encombrer l\'interface.',
	'Il doit alors être le premier élément dans l\'ordre du focus.',
	'Les libellés des liens doivent être clairs et concis tel que "Aller au contenu principal" ou "Passer au menu".',
]

const itemsNotToDo = [
	'Utiliser des libellés trop vagues ou trop longs.',

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

import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Formulaires/DatePicker/Usages',
}

const itemsToDo = [
	'La date de fin ne peux pas être avant la date début.',
	'Indiquer à l\'utilisateur le format attendu (JJ/MM/AAAA).',
	'Indiquer la date du jour à l\'utilisateur.',
	'Faciliter le changement de mois et d\'années avec des listes.',
]

const itemsNotToDo = [
	'Laissez uniquement les flèches pour naviguer entre les mois et les années.',
	'Ne pas indiquer la date du jour.',
	'Ne pas différencier la date du jour de la date selectionnée.',
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

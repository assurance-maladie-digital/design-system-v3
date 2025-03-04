import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Formulaires/NirField/Usages',
}

const itemsToDo = [
	'Indiquer à l\'utilisateur le nombre de chiffres.',
	'Donner la possibilité de saisir uniquement des chiffres.',
	'Permettre à l\'utilisateur d\'effacer sa saisie en cliquant sur un bouton.',
	'Ajouter un tooltip selon la cible, permettant d\'indiquer où trouver son numéro de sécurité sociale.',
	'Message d\'erreur uniquement pour le NIR et la clé pour des raisons de sécurité.',
]

const itemsNotToDo = [

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

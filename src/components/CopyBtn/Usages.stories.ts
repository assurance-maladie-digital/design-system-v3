import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Boutons/CopyBtn/Usages',
}

const itemsToDo = [
	'Ce bouton est toujours situé à droite de l\'élément qu\'il permet de copier.',
	'Fournir un feedback clair après l\'action (succès ou echec), comme un message "Texte copié avec succès".',
	'Rendez le texte source sélectionnable manuellement au cas où le bouton échoue.',
]

const itemsNotToDo = [
	'Copier du texte sans le consentement de l\'utilisateur.',
	'Fournir un feedback ambigu ou absent après une action.',
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

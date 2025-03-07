import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Formulaires/SyTextField/Usages',
}

const itemsToDo = [
	'Utiliser un libellé clair et concis.',
	'Indiquer les erreurs en temps réel avec un message explicite (si possible).',
	'Respecter un bon constraste entre texte et le fond pour la lisibilité.',
]

const itemsNotToDo = [
	'Utiliser un "input field" simple quand une version spécifique est disponible (phone field, NIR Field).',
	'L\'utiliser lorsque le texte à saisir est long. Utilisez plutôt le composant textarea.',
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

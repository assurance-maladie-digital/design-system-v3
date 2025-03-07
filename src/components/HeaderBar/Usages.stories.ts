import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'
import Usages from '@/components/Usages/Usages.vue'

export default {
	title: 'Composants/Structure/HeaderBar/Usages',
}

const itemsToDo = [
	'Utiliser une largeur maximale de 1712px (container max de 1600px + left-margin (56px) et right-margin (56px)), le header restant centré dans la page.',
	'Utiliser le type de menu le plus adapté au produit : un burger menu pour les produits complexes et le menu en onglet pour les produits à l\'arborescence restreinte.',
]

const itemsNotToDo = [
	'Utiliser le menu en onglet si il existe plus de 6 entrées différentes.',
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

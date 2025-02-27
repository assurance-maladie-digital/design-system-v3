import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'

export default {
	title: 'Composants/Navigation/ExternalLinks/Usages',
}

export const Usages: StoryObj = {

	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon },

			setup() {
				const icon = checkIcon

				return { icon, linkICon, croixIcon, checkIcon }
			},
			template: `
				 <VRow class="mt-8" style="display: flex;justify-content: center;">
                <VCol cols="12" sm="5" class="m-2 p-2 mr-2 v-col-auto" style="background-color:#E5F7F4;">
                <div class="d-flex" style="color:#004439; font-weight:bold;"><VIcon :icon="checkIcon"/><p class="font-weight-bold mb-2"> À faire</p></div>
                 <ul style="font-size: 13px;margin-left: 20px;">
                 <li style="margin-bottom: 5px;">Les liens externes s'ouvrent par défaut dans une nouvel onglet pour éviter que l'utilisateur ne quitte accidentellement l'application.</li>
                 <li style="margin-bottom: 5px;">Privilégier des libellés informatifs, comme "Accèder à la page de l'URSSAF".</li>                 
                 </ul>
                </VCol>
                <VCol cols="12" sm="5" class="m-2 p-2 v-col-auto" style="background-color:#FCEDEB;">
                <div class="d-flex" style="color:#B33F2E; font-weight:bold;"><VIcon :icon="croixIcon"/><p class="font-weight-bold mb-2"> À ne pas faire</p></div>
                 <ul style="font-size: 13px;margin-left: 20px;">
                 <li style="margin-bottom: 5px;">Evitez les libellés génériques comme "Cliquez-ici" ou "En savoir plus".</li>
                 </ul>
                </VCol>
              </VRow>
			`,
		}
	},
	tags: ['!dev'],
}

import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheck, mdiLink, mdiClose } from '@mdi/js'

const checkIcon = mdiCheck
const croixIcon = mdiClose
const linkICon = mdiLink

export default {
	title: 'Composants/Feedback/DialogBox/Usages',
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
                 <ul style="font-size: 13px;margin-left: 4px;line-height: 28px;">
                 <li>Utiliser un titre clair et descriptif pour expliquer l'objectif de la modale.</li>
                 <li>Garder le contenu de la modale concis et pertinent.</li>
                 <li>Adapter la taille de la modale au contenu.</li>
                 <li>Ajouter une option explicite pour fermer la modale (ex. : bouton "Fermer" ou icône de croix).</li>
                 <li>La modale se positionne au centre de l'écran sur un fond noir d'opacité afin de guider l'attention de l'utilisateur.</li>

                 </ul>
                </VCol>
                <VCol cols="12" sm="5" class="m-2 p-2 v-col-auto" style="background-color:#FCEDEB;">
                <div class="d-flex" style="color:#B33F2E; font-weight:bold;"><VIcon :icon="croixIcon"/><p class="font-weight-bold mb-2"> À ne pas faire</p></div>
                 <ul style="font-size: 13px;margin-left: 4px;line-height: 28px;">
                 <li>Utiliser une modale pour afficher à l'utilisateur des informations non-essentielles.</li>
                 <li>Surcharger la modale avec beaucoup de contenu ou d'actions à effectuer.</li>
                 <li>Bloquer la fermeture de la modale (sauf si nécéssaire pour des raisons critiques).</li>
                 <li>Trop multiplier les modales dans un parcours utilisateur.</li>
                 </ul>
                </VCol>
              </VRow>
			`,
		}
	},
	tags: ['!dev'],
}

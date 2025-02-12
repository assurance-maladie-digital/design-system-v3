import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheck, mdiLink, mdiClose } from '@mdi/js'

const checkIcon = mdiCheck
const croixIcon = mdiClose
const linkICon = mdiLink

export default {
	title: 'Composants/Feedback/NotificationBar/Usages',
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
                 <li>La nature du message (erreur, succès, information) doit être clairement exprimée dans le titre de l'alerte. La couleur ou l'icône n'étant pas accessibles ou compréhensibles par tous les utilisateurs.</li>
                 <li>La barre de notification doit rester affichée jusqu'à ce que l'utilisateur souhaite la fermer.</li>
                 <li>La barre de notifications doit avoir une largeur adaptée à son contenu (avec une largeur max de ??px).</li>
                 
                 </ul>
                </VCol>
                <VCol cols="12" sm="5" class="m-2 p-2 v-col-auto" style="background-color:#FCEDEB;">
                <div class="d-flex" style="color:#B33F2E; font-weight:bold;"><VIcon :icon="croixIcon"/><p class="font-weight-bold mb-2"> À ne pas faire</p></div>
                 <ul style="font-size: 13px;margin-left: 4px;line-height: 28px;">
                 <li>Pas plus de 3 lignes.</li>
                 <li>Il est techniquement possible de faire disparaitre la barre de notification après un délai mais cette pratique n'est déconseillé pour des raisons d'accessibilité afin de permettre à tout le monde de prendre le temps nécéssaire de lire la notification.</li>
                 </ul>
                </VCol>
              </VRow>
			`,
		}
	},
	tags: ['!dev'],
}

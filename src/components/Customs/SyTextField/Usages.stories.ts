import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { checkIcon, linkICon, croixIcon } from '@/constants/icons'

export default {
	title: 'Composants/Formulaires/SyTextField/Usages',
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
                 <li style="margin-bottom: 5px;">Utiliser un libellé clair et concis.</li>
                 <li style="margin-bottom: 5px;">Indiquer les erreurs en temps réel avec un message explicite (si possible).</li>
                 <li style="margin-bottom: 5px;">Respecter un bon constraste entre texte et le fond pour la lisibilité.</li>
                 
                 </ul>
                </VCol>
                <VCol cols="12" sm="5" class="m-2 p-2 v-col-auto" style="background-color:#FCEDEB;">
                <div class="d-flex" style="color:#B33F2E; font-weight:bold;"><VIcon :icon="croixIcon"/><p class="font-weight-bold mb-2"> À ne pas faire</p></div>
                 <ul style="font-size: 13px;margin-left: 20px;">
                 <li style="margin-bottom: 5px;">Utiliser un "input field" simple quand une version spécifique est disponible (phone field, NIR Field).</li>
                 <li style="margin-bottom: 5px;">L'utiliser lorsque le texte à saisir est long. Utilisez plutôt le composant textarea.</li>
                 </ul>
                </VCol>
              </VRow>
			`,
		}
	},
	tags: ['!dev'],
}

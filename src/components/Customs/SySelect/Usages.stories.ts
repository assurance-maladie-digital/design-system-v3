import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { mdiCheck, mdiLink, mdiClose } from '@mdi/js'

const checkIcon = mdiCheck
const croixIcon = mdiClose
const linkICon = mdiLink

export default {
	title: 'Composants/Formulaires/SySelect/Usages',
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
                 <li>Utiliser un libellé clair et concis.</li>
                 <li>Trier les options de manière logique (alphabétique, fréquence d'utilisation).</li>
                 <li>Limiter le nombre d'options dans une liste sans recherche.</li>
                 
                 </ul>
                </VCol>
                <VCol cols="12" sm="5" class="m-2 p-2 v-col-auto" style="background-color:#FCEDEB;">
                <div class="d-flex" style="color:#B33F2E; font-weight:bold;"><VIcon :icon="croixIcon"/><p class="font-weight-bold mb-2"> À ne pas faire</p></div>
                 <ul style="font-size: 13px;margin-left: 4px;line-height: 28px;">
                 <li>Utiliser le composant pour des choix binaires (préférer un bouton radio).</li>
                 <li>Utiliser une valeur par défaut si la selection n'est pas requise.</li>
                 </ul>
                </VCol>
              </VRow>
			`,
		}
	},
	tags: ['!dev'],
}

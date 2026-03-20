import {
    VDivider,
    VExpansionPanel,
    VExpansionPanels,
    VExpansionPanelText,
    VExpansionPanelTitle
} from 'vuetify/components'
import type {StoryObj} from '@storybook/vue3'

export default {
    title: 'Guide Du Dev/Correspondance composants Amelipro',
}

export const ApComponents: StoryObj = {
    render: () => {
        return {
            components: {
                VExpansionPanels,
                VExpansionPanel,
                VExpansionPanelTitle,
                VExpansionPanelText,
                VDivider,
            },
            setup() {
                return {}
            },
            template: `
              <VExpansionPanels>

                <VExpansionPanel>
                  <VExpansionPanelTitle class="font-weight-bold">
                    FooterBar
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <p>
                      Les composant de barre de tâches peuvent êtres crées en utilisant les composants Vuetify <span
                        class="component-name"
                    >VbtnGroup</span>, <span class="component-name">Vbtn</span> et <span class="component-name">VProgressLinear</span>.
                    </p>
                    <ul class="mt-4">
                      <li>
                        <a href="https://vuetifyjs.com/api/v-btn-group" target="_blank" rel="noopener noreferrer">
                          Documentation du composant Vuetify VbtnGroup
                        </a>
                      </li>
                      <li>
                        <a href="https://vuetifyjs.com/api/v-btn" target="_blank" rel="noopener noreferrer">
                          Documentation du composant Vuetify Vbtn
                        </a>
                      </li>
                      <li>
                        <a href="https://vuetifyjs.com/components/progress-linear" target="_blank"
                           rel="noopener noreferrer"
                        >
                          Documentation du composant Vuetify VProgressLinear
                        </a>
                      </li>
                    </ul>
                    <p class="mt-4">
                      <VDivider class="pb-2"/>
                      <a href="https://maloron.net/am/cnamuipav2/cnamui-barre-taches.htm">
                        Documentation du composant Portail Barre de tâches correspondant
                      </a>
                    </p>
                  </VExpansionPanelText>
                </VExpansionPanel>

                <VExpansionPanel>
                  <VExpansionPanelTitle class="font-weight-bold">
                    HeaderBar
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <p>
                      Les boutons de bases peuvent êtres crées en utilisant le composant <span class="component-name">VBtn</span>
                      de Vuetify.
                      <br>
                      <a href="https://vuetifyjs.com/api/v-btn" target="_blank" rel="noopener noreferrer">
                        Documentation du composant Vuetify Vbtn
                      </a>
                    </p>

                    <div class="mt-4">
								<pre>
	&lt;VBtn color=&quot;primary&quot;&gt;
		Bouton d’action primaire
	&lt;/VBtn&gt;
	&lt;VBtn&gt;
		Bouton d’action par d&#233;faut
	&lt;/VBtn&gt;
								</pre>
                    </div>

                    <p class="mt-4">
                      Les boutons case à cocher ou radio peuvent êtres crées avec le composant Vuetify <span
                        class="component-name"
                    >VBtnToggle</span>.
                      <a href="https://vuetifyjs.com/components/button-groups" target="_blank"
                         rel="noopener noreferrer"
                      >
                        Documentation du composant Vuetify VBtnToggle
                      </a>
                    </p>
                    <p class="mt-6">
                      <VDivider class="pb-2"/>
                      <a href="https://maloron.net/am/cnamuipav2/cnamui-buttons.htm">
                        Documentation du composant Portail Buttons correspondant
                      </a>
                    </p>
                  </VExpansionPanelText>
                </VExpansionPanel>

                <VExpansionPanel>
                  <VExpansionPanelTitle class="font-weight-bold">
                    Titres de page et de tableau
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <p>
                      Synapse ne propose pas de remplacent au composent <span class="component-name"
                    >Titres de page</span>, Il devra être réalisé en CSS par les développeurs.<br>
                      Les boutons d’actions pourrons être réalisés avec le composant
                      <a href="https://vuetifyjs.com/components/buttons" target="_blank" rel="noopener noreferrer">
                        VBtn
                      </a> de Vuetify.<br>
                      Le composant
                      <a href="https://vuetifyjs.com/api/v-badge" target="_blank" rel="noopener noreferrer">
                        VBadge
                      </a> pourra être utilisé pour ajouter des informations.
                    </p>
                    <div class="mt-4">
<pre>
&lt;VBadge
	color=&quot;primary&quot;
	content=&quot;8&quot;
	class=&quot;mb-4&quot;
	label=&quot;8 notifications non lues&quot;
&gt;
	&lt;VBtn&gt;
		Messagerie
	&lt;/VBtn&gt;
&lt;/VBadge&gt;
</pre>
                    </div>
                    <p class="mt-4">
                      <VDivider class="pb-2"/>
                      <a href="https://maloron.net/am/cnamuipav2/cnamui-titre.htm">
                        Documentation du composant Portail Titres de page et de tableau correspondant
                      </a>
                    </p>
                  </VExpansionPanelText>
                </VExpansionPanel>

                <VExpansionPanel>
                  <VExpansionPanelTitle class="font-weight-bold">
                    Panels et sections
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <p>
                      Le composant Synapse
                      <a href="https://cnam-design-system.netlify.app/?path=/docs/composants-layout-panel--docs"
                         target="_blank" rel="noopener noreferrer"
                      >
                        Accordion
                      </a>
                      permet d’organiser sa page en différents panels.
                    </p>
                    <p class="mt-4">
                      Il est également possibles d’utiliser le composant Vuetify
                      <a href="https://vuetifyjs.com/api/v-divider" target="_blank" rel="noopener noreferrer">
                        VDivider
                      </a>
                      pour séparer visuellement plusieurs sections de la page, que ce soit horizontalement ou
                      verticalement,
                    </p>
                    <p class="mt-4">
                      le composant Synapse
                      <a href="/docs/composants-feedback-syalert--docs" target="_blank" rel="noopener noreferrer">
                        SyAlert
                      </a>
                      peux également être utilisée pour mettre en exergue certaines informations.
                    </p>
                    <p class="mt-4">
                      Pour créé des layouts plus complexes pour formater l’information, il est également possible
                      d’utiliser le système de grid de Vuetify qui est fortement inspiré de celui de Bootstrap.
                      https://vuetifyjs.com/components/grids
                    </p>
                    <p class="mt-4">
                      <VDivider class="pb-2"/>
                      <a href="https://maloron.net/am/cnamuipav2/cnamui-panels.htm">
                        Documentation du composant Portail Panel correspondant
                      </a>
                    </p>
                  </VExpansionPanelText>
                </VExpansionPanel>
              </VExpansionPanels>
            `,
        }
    },
    tags: ['!dev'],
}

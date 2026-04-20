import {
	VDivider,
	VExpansionPanel,
	VExpansionPanels,
	VExpansionPanelText,
	VExpansionPanelTitle,
} from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'

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
                      Le composant <span class="component-name">AmeliproFooter</span> est remplacé par le composant
                      <span class="component-name">FooterBar</span> de Synapse.
                      <br>
                      <a href="https://cnam-design-system.netlify.app/?path=/docs/composants-structure-footerbar--docs"
                         target="_blank" rel="noopener noreferrer"
                      >
                        Documentation du composant Synapse FooterBar
                      </a>
                    </p>
                    <p class="mt-4">
                      <VDivider class="pb-2"/>
                      <a href="https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-footer">
                        Documentation du composant AmeliproFooter correspondant
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
                      Le composant <span class="component-name">AmeliproHeader</span> est remplacé par le composant
                      <span class="component-name">HeaderBar</span> de Synapse.
                      <br>
                      <a href="https://cnam-design-system.netlify.app/?path=/docs/composants-structure-headerbar--docs"
                         target="_blank" rel="noopener noreferrer"
                      >
                        Documentation du composant Synapse HeaderBar
                      </a>
                    </p>
                    <p class="mt-4">
                      <VDivider class="pb-2"/>
                      <a href="https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-header">
                        Documentation du composant AmeliproHeader correspondant
                      </a>
                    </p>
                  </VExpansionPanelText>
                </VExpansionPanel>

                <VExpansionPanel>
                  <VExpansionPanelTitle class="font-weight-bold">
                    Boutons
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
                      <a href="https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-btn">
                        Documentation du composant AmeliproBtn correspondant
                      </a>
                    </p>
                  </VExpansionPanelText>
                </VExpansionPanel>

                <VExpansionPanel>
                  <VExpansionPanelTitle class="font-weight-bold">
                    Tooltips
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <p>
                      Les tooltips de bases peuvent êtres crées en utilisant le composant <span class="component-name">Vtooltip</span>
                      de Vuetify.
                      <br>
                      <a href="https://vuetifyjs.com/en/api/v-tooltip" target="_blank" rel="noopener noreferrer">
                        Documentation du composant Vuetify Vtooltip
                      </a>
                    </p>

                    <div class="mt-4">
								<pre>
    &lt;v-tooltip text=&quot;Tooltip&quot;&gt;
      &lt;template v-slot:activator=&quot;{ props }&quot;&gt;
        &lt;v-btn v-bind=&quot;props&quot;&gt;
          Hover Over Me
        &lt;/v-btn&gt;
      &lt;/template&gt;
    &lt;/v-tooltip&gt;
								</pre>
                    </div>

                    <p class="mt-6">
                      <VDivider class="pb-2"/>
                      <a href="https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-tooltips">
                        Documentation du composant AmeliproTooltips correspondant
                      </a>
                    </p>
                  </VExpansionPanelText>
                </VExpansionPanel>
                <VExpansionPanel>
                  <VExpansionPanelTitle class="font-weight-bold">
                    Layout
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <p>
                      Le composant <span class="component-name">AmeliproContentLayout</span> est remplacé par le
                      composant
                      <span class="component-name">PageContainer</span> de Synapse.
                      <br>
                      <a href="https://cnam-design-system.netlify.app/?path=/docs/composants-layout-pagecontainer--docs"
                         target="_blank" rel="noopener noreferrer"
                      >
                        Documentation du composant Synapse PageContainer
                      </a>
                    </p>
                    <p class="mt-4">
                      <VDivider class="pb-2"/>
                      <a href="https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-content-layout">
                        Documentation du composant AmeliproContentLayout correspondant
                      </a>
                    </p>
                  </VExpansionPanelText>
                </VExpansionPanel>
                <VExpansionPanel>
                  <VExpansionPanelTitle class="font-weight-bold">
                    Pagination
                  </VExpansionPanelTitle>
                  <VExpansionPanelText>
                    <p>
                      Le composant <span class="component-name">AmeliproPagination</span> est remplacé par le
                      composant
                      <span class="component-name">SyPagination</span> de Synapse.
                      <br>
                      <a href="https://cnam-design-system.netlify.app/?path=/docs/composants-navigation-sypagination--docs"
                         target="_blank" rel="noopener noreferrer"
                      >
                        Documentation du composant Synapse SyPagination
                      </a>
                    </p>
                    <p class="mt-4">
                      <VDivider class="pb-2"/>
                      <a href="https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-pagination">
                        Documentation du composant AmeliproPagination correspondant
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

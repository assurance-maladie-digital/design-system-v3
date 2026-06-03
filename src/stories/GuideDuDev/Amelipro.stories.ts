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
				const panels = [
					{
						title: 'AmeliProFooter',
						synapse: {
							name: 'FooterBar',
							url: 'https://cnam-design-system.netlify.app/?path=/docs/composants-structure-footerbar--docs',
						},
						amelipro: {
							name: 'AmeliproFooter',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-footer',
						},
					},
					{
						title: 'AmeliproHeader',
						synapse: {
							name: 'HeaderBar',
							url: 'https://cnam-design-system.netlify.app/?path=/docs/composants-structure-headerbar--docs',
						},
						amelipro: {
							name: 'AmeliproHeader',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-header',
						},
					},
					{
						title: 'AmeliproContentLayout',
						synapse: {
							name: 'PageContainer',
							url: 'https://cnam-design-system.netlify.app/?path=/docs/composants-layout-pagecontainer--docs',
						},
						amelipro: {
							name: 'AmeliproContentLayout',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-content-layout',
						},
					},
					{
						title: 'AmeliproPagination',
						synapse: {
							name: 'SyPagination',
							url: 'https://cnam-design-system.netlify.app/?path=/docs/composants-navigation-sypagination--docs',
						},
						amelipro: {
							name: 'AmeliproPagination',
							url: 'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-pagination',
						},
					},
					{
						title: 'AmeliproBtn',
						text: `
                            Les boutons de base peuvent être créés avec VBtn de Vuetify.
                            Les boutons toggle avec VBtnToggle.
						`,
						example: `
                            <VBtn color="primary">Bouton d’action primaire</VBtn>
                            <VBtn>Bouton d’action par défaut</VBtn>
						`,
						vuetifyDocs: 'https://vuetifyjs.com/api/v-btn',
						ameliproUrl:
                            'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-btn',
					},
					{
						title: 'AmeliproTooltips',
						example: `
                            <v-tooltip text="Tooltip">
                              <template v-slot:activator="{ props }">
                                <v-btn v-bind="props">Hover Over Me</v-btn>
                              </template>
                            </v-tooltip>
						`,
						vuetifyDocs: 'https://vuetifyjs.com/en/api/v-tooltip',
						ameliproUrl:
                            'https://p2-design-system-dev.app.ge-4.digital.ramage/composants/amelipro-tooltips',
					},
					{
						title: 'AmeliproPatientLogged',
						components: [{ name: 'Vbtn', url: '' }, { name: 'VCard', url: '' }, { name: 'Vbtn', url: '' }],
					},
				]

				return { panels }
			},

			template: `
              <VExpansionPanels>

                <VExpansionPanel
                    v-for="panel in panels"
                    :key="panel.title"
                >
                  <VExpansionPanelTitle class="font-weight-bold">
                    {{ panel.title }}
                  </VExpansionPanelTitle>

                  <VExpansionPanelText>

                    <!-- Cas générique texte -->
                    <template v-if="panel.text">
                      <p style="white-space: pre-line">
                        {{ panel.text }}
                      </p>
                    </template>

                    <!-- Cas composants -->
                    <template v-else-if="panel.components">
                      <p>
                        Pour reproduire son comportement, utilisez les composants du Design System suivants :
                      </p>
                      
                        <p v-for="component in panel.components" :key="component">
                          <a :href="component.url" target="_blank" rel="noopener noreferrer">
                            {{ component.name }}
                          </a>
                        </p>

                      <p>
                        et implémentez la logique métier directement dans votre projet.
                      </p>
                    </template>

                    <!-- Cas normal Synapse / Amelipro -->
                    <template v-else>
                      <p>
                        Le composant
                        <span class="component-name">{{ panel.amelipro.name }}</span>
                        est remplacé par
                        <span class="component-name">{{ panel.synapse.name }}</span>.
                        <br>
                        <a :href="panel.synapse.url" target="_blank" rel="noopener noreferrer">
                          Documentation du composant Synapse {{ panel.synapse.name }}
                        </a>
                      </p>

                      <p class="mt-4">
                        <VDivider class="pb-2" />
                        <a :href="panel.amelipro.url" target="_blank">
                          Documentation du composant Amelipro {{ panel.amelipro.name }}
                        </a>
                      </p>
                    </template>

                    <!-- Bloc exemple code -->
                    <div v-if="panel.example" class="mt-4">
                      <pre>{{ panel.example }}</pre>
                    </div>

                    <!-- Docs Vuetify -->
                    <p v-if="panel.vuetifyDocs" class="mt-4">
                      <a :href="panel.vuetifyDocs" target="_blank">
                        Documentation Vuetify
                      </a>
                    </p>

                    <!-- Amelipro URL fallback -->
                    <p v-if="panel.ameliproUrl" class="mt-4">
                      <VDivider class="pb-2" />
                      <a :href="panel.ameliproUrl" target="_blank">
                        Documentation Amelipro
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

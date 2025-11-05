import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText } from 'vuetify/components'
import SyAlert from '../../components/SyAlert/SyAlert.vue'
import '../styles/shared.css'

export default {
	title: 'Démarrer/Enrichir le Design System',
	component: SyAlert,
}

export const InfoIntro = {
	render: () => {
		return {
			components: { SyAlert },
			setup() {
				return {}
			},
			template: `
              <SyAlert type="info" variant="tonal" :closable="false">
                <template #default>
                  Toutes les demandes d'enrichissement sont traitées au fil de l'eau en fonction de la disponibilité de l'activité.<br/>Une première estimation sur le délai de livraison de la solution sera annoncée au moment de sa qualification.
                </template>
              </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}

export const Optimisation = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText },
			setup() {
				return {}
			},
			template: `
              <v-expansion-panels class="mt-6">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <p class="text-h5 text-primary">Ajout d'une optimisation</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 60%">Description</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">L'optimisation est proposée en vue d'améliorer la qualité générale du design system.<br/>
                              Elle concerne soit un composant, une fonctionnalité spécifique associée, une page de documentation, une bonne pratique.<br/>
                              L'optimisation n'est pas indispensable au bon fonctionnement du projet. Si c'est le cas, merci de compléter l'anomalie fonctionnelle de niveau majeure.</td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=optimisation.md" target="_blank">
                                Proposer une optimisation
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            `,
		}
	},
	tags: ['!dev'],
}

export const AjoutFonctionnalite = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText },
			setup() {
				return {}
			},
			template: `
              <v-expansion-panels class="mt-2">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <p class="text-h5 text-primary">Ajout d'une fonctionnalité</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 60%">Description</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">Le Studio Design conçoit et fabrique entièrement une nouvelle fonctionnalité dans l'API du composant. Si le besoin concerne l'enrichissement d'une fonctionnalité déjà existante, merci d'utiliser le parcours "déclinaison d'une fonctionnalité".
                              Cette demande doit être justifiée par un besoin du métier et soumise à l'accord du chef de projet du projet associée.<br/>
                              Pour être recevable, les <a style="text-decoration: none; color: rgb(2, 156, 253);" href="#exigences" target="_self">critères d'acceptabilité</a> de la nouvelle fonctionnalité sont respectés.</td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=feature_new.md" target="_blank">
                                Proposer une nouvelle fonctionnalité
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            `,
		}
	},
	tags: ['!dev'],
}

export const DeclinaisonFonctionnalite = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText },
			setup() {
				return {}
			},
			template: `
              <v-expansion-panels class="mt-2">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <p class="text-h5 text-primary">Déclinaison d'une fonctionnalité</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 60%">Description</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">Le Studio Design améliore une fonctionnalité existante d'un composant.<br/>
                              Pour être recevable, les <a style="text-decoration: none; color: rgb(2, 156, 253);" href="#exigences" target="_self">critères d'acceptabilité</a> de la nouvelle fonctionnalité sont respectés.</td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=feature_declinaison.md" target="_blank">
                                Proposer une déclinaison de fonctionnalité
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            `,
		}
	},
	tags: ['!dev'],
}

export const CreationComposant = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText },
			setup() {
				return {}
			},
			template: `
              <v-expansion-panels class="mt-2">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <p class="text-h5 text-primary">Création d'un composant</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 60%">Description</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">Le Studio Design conçoit et fabrique entièrement le composant et la documentation associée. Il met à disposition sa maquette à destination des designers sur l'outil de maquettage Figma.<br/>
                              Pour être recevable, les <a style="text-decoration: none; color: rgb(2, 156, 253);" href="#exigences" target="_self">critères d'acceptabilité</a> du nouveau composant sont respectés.</td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=component_new.md" target="_blank">
                                Proposer la création d'un composant
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            `,
		}
	},
	tags: ['!dev'],
}

export const IntegrationComposant = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText },
			setup() {
				return {}
			},
			template: `
              <v-expansion-panels class="mt-2">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <p class="text-h5 text-primary">Intégration d'un composant</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 60%">Description</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">Le composant est fabriqué en VueJS 3 et sur Figma par un projet puis intégré par le Studio Design dans le design system.<br/>Le Studio Design se charge de fabriquer la documentation associée.<br/>
                              Pour être recevable, les <a style="text-decoration: none; color: rgb(2, 156, 253);" href="#exigences" target="_self">critères d'acceptabilité</a> du nouveau composant sont respectés.</td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=component_integration.md" target="_blank">
                                Proposer l'intégration d'un composant
                              </v-btn>
                            </td>
                          </tr>
                        </tbody>
                    </table>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            `,
		}
	},
	tags: ['!dev'],
}

import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText } from 'vuetify/components'
import SyAlert from '../../components/SyAlert/SyAlert.vue'
import '../styles/shared.css'

export default {
	title: 'Démarrer/Signaler une anomalie',
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
                  Après qualification, les anomalies mineures sont embarquées au fil de l'eau dans les sprints successifs selon la disponibilité de l'activité.<br/>À l'inverse, les anomalies majeures sont embarquées si l'activité le permet dès le prochain sprint.<br/>Aucune anomalie ne peut être embarquée en cours de sprint sauf dérogation.
                </template>
              </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}

export const InfoPratiques = {
	render: () => {
		return {
			components: { SyAlert },
			setup() {
				return {}
			},
			template: `
              <SyAlert type="info" variant="tonal" :closable="false">
                <template #default>Lorsque vous créez une reproduction minimale, supprimez tous les éléments,
                  propriétés, variables, données et autres qui ne sont pas nécessaires pour reproduire l'anomalie. Cela
                  facilitera le traitement du rapport et le temps qu’il faudra pour identifier puis résoudre l'anomalie.
                </template>
              </SyAlert>
            `,
		}
	},
	tags: ['!dev'],
}

export const AnomalieGraphiqueMajeure = {
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
                    <p class="text-h5 text-primary">Anomalie graphique majeure</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 40%">Description</th>
                      <th>Priorisation dans le backlog</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">L'anomalie graphique rend inutilisable le composant concerné.<br/>
                              Le projet est bloqué et ne peut pas mettre en production sans ce correctif.<br/>
                              Si l'anomalie rencontrée ne répond pas à ces critères merci d'utiliser le formulaire dédiée à l'anomalie mineure.</td>
                            <td style="text-align: center;"><b>Prioritaire</b></td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=bug_graphic_major.md" target="_blank">
                                Signaler une anomalie graphique
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

export const AnomalieGraphiqueMineure = {
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
                    <p class="text-h5 text-primary">Anomalie graphique mineure</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 40%">Description</th>
                      <th>Priorisation dans le backlog</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">Une différence existe entre le composant concerné dans sa globalité ou une fonctionnalité spécifique et sa représentation dans le fichier Synapse présent dans l'outil de maquettage Figma.</td>
                            <td style="text-align: center;"><b>Non prioritaire</b></td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=bug_graphic_minor.md" target="_blank">
                                Signaler une anomalie graphique
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

export const AnomalieFonctionnelleMajeure = {
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
                    <p class="text-h5 text-primary">Anomalie fonctionnelle majeure</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 40%">Description</th>
                      <th>Priorisation dans le backlog</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">L'anomalie fonctionnelle rend inutilisable le composant concerné.<br/>
                              Le projet est bloqué et ne peut pas mettre en production sans ce correctif.<br/>
                              Si l'anomalie rencontrée ne répond pas à ces critères merci d'utiliser le formulaire dédiée à l'anomalie mineure.</td>
                            <td style="text-align: center;"><b>Prioritaire</b></td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=bug_functional_major.md" target="_blank">
                                Signaler une anomalie fonctionnelle
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

export const AnomalieFonctionnelleMineure = {
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
                    <p class="text-h5 text-primary">Anomalie fonctionnelle mineure</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 40%">Description</th>
                      <th>Priorisation dans le backlog</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">Le composant concerné ou une fonctionnalité spécifique associée contient un bug de fonctionnement qui perturbe la qualité de son utilisation.</td>
                            <td style="text-align: center;"><b>Non prioritaire</b></td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=bug_functional_minor.md" target="_blank">
                                Signaler une anomalie fonctionnelle
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

export const AnomalieAccessibilite = {
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
                    <p class="text-h5 text-primary">Anomalie d'accessibilité</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 40%">Description</th>
                      <th>Priorisation dans le backlog</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">Le composant concerné ne respecte pas l'accessibilité numérique (RGAA) avec les critères paramétrable au niveau du design system.<br/>Dans le doute, vous pouvez consulter les rapports d'audit disponibles pour chaque composant dans la documentation en ligne présents sur les pages "Accessibilité".</td>
                            <td style="text-align: center;"><b>Prioritaire</b></td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=accessibility.md" target="_blank">
                                Signaler un problème d'accessibilité
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

export const AnomalieDocumentaire = {
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
                    <p class="text-h5 text-primary">Anomalie documentaire</p>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <table>
                      <thead>
                      <tr style="background-color: rgb(12 65 154 / 10%)">
                      <th style="width: 40%">Description</th>
                      <th>Priorisation dans le backlog</th>
                      <th>Action</th>
                      </thead>
                      <tbody>
                          <tr>
                            <td style="padding: 5px">La documentation technique d'un composant (ou toute autre sources d’information, ex: Figma…) contient une anomalie.</td>
                            <td style="text-align: center;"><b>Non prioritaire</b></td>
                            <td style="text-align: center;">
                              <v-btn style="text-decoration: none; color: rgb(2, 156, 253);" href="https://github.com/assurance-maladie-digital/design-system-v3/issues/new?template=documentation.md" target="_blank">
                                Signaler un problème de documentation
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

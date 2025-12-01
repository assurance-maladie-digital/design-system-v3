import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { AccessibiliteItemsIndeterminate, AccessibiliteItemsValidated } from './AccessibiliteItems'
import { mdiCheckboxMarkedCircle, mdiLink, mdiEye } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle
const iconEye = mdiEye
const linkICon = mdiLink

export default {
	title: 'Composants/Formulaires/Selects/SelectBtnField/Accessibilité',
}

export const AccessibilitePanel: StoryObj = {

	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon },

			setup() {
				const icon = checkIcon

				return { AccessibiliteItemsIndeterminate, AccessibiliteItemsValidated, icon, linkICon, iconEye }
			},
			template: `
				<div class="accessibiliteItems" style="display:flex; max-width: none !important;">
					<v-col cols="6">
						<div style="display:flex; margin-bottom: 10px; justify-content: space-between; align-items: center;">
							<h5>{{ AccessibiliteItemsIndeterminate.length }} critères à prendre en charge par le projet</h5>
							<div style="display: flex; align-items: center;">
								<v-btn variant="tonal" color="red" size="x-small" style="margin: 4px;font-size: 8px;"
									   rounded>Tanaguru
								</v-btn>
							</div>
						</div>

						<v-expansion-panels value="opened" multiple>
							<v-expansion-panel v-for="(item, index) in AccessibiliteItemsIndeterminate" :key="index" style="background-color: rgba(42, 96, 158, 0.1); margin-bottom: 10px;">
								<v-expansion-panel-title>
									<VIcon :icon="iconEye" style="margin-right: 5px; color:#5778b7;"/>
									{{ item.title }}
								</v-expansion-panel-title>
								<v-expansion-panel-text>
									<v-expansion-panels>
									<v-expansion-panel v-for="(i, index) in item.items2" :key="i"  style="margin-bottom: 10px;">
											<v-expansion-panel-title
												style="font-weight: bold; font-size: 13px; line-height: 16px;">
												{{ i.subtitle}}
											</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div>
													<p style="font-size: 13px;line-height: 16px;">
														{{ i.precision }}
													</p>
													<div v-for="(value, index) in i.solution"
														 style="margin-top:15px; font-size: 13px;line-height: 16px;">
														<p style="font-weight: bold;">Méthodologie du test : <a
															href="{{i.link}}" target="blank">
															<VIcon :icon="linkICon"/>
														</a></p>
														<p>{{ value.info1 }}</p>
														<p>{{ value.info2 }}</p>
														<p>{{ value.info3 }}</p>
														<p>{{ value.info4 }}</p>

													</div>
													<span style="display:flex; justify-content:center; margin-bottom:5px;">______</span>
												</div>
											</v-expansion-panel-text>
										</v-expansion-panel>
										<v-expansion-panel >
											<v-expansion-panel-title
												style="font-weight: bold; font-size: 13px; line-height: 16px;">
												{{ item.subtitle }}
											</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div v-for="(value, i) in item.items" :key="i">
													<p style="font-size: 13px;line-height: 16px;">
														{{ value.precision }}
													</p>
													<div v-for="element in value.solution"
														 style="margin-top:15px; font-size: 13px;line-height: 16px;">
														<p style="font-weight: bold;">Méthodologie du test : <a
															href="value.link" target="blank">
															<VIcon :icon="linkICon"/>
														</a></p>
														<p>{{ element.info1 }}</p>
														<p>{{ element.info2 }}</p>
														<p>{{ element.info3 }}</p>
													</div>
													<span style="display:flex; justify-content:center; margin-bottom:5px;">______</span>
												</div>
											</v-expansion-panel-text>
										</v-expansion-panel>
									</v-expansion-panels>
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</v-col>
					<v-col cols="6">
						<div style="display:flex; margin-bottom: 10px; justify-content: space-between; align-items: center;">
							<h5>{{ AccessibiliteItemsValidated.length }} critères pris en charge par l'équipe Design System</h5>
							<div style="display: flex; align-items: center;">
								<v-btn variant="tonal" color="red" size="x-small" style="margin: 4px;font-size: 8px;"
									   rounded>Tanaguru
								</v-btn>
							</div>
						</div>
						<v-expansion-panels v-if="AccessibiliteItemsValidated.length > 0" value="opened" multiple>
							<v-expansion-panel 
								v-for="(item, index) in AccessibiliteItemsValidated"
								:key="index" style="background-color: rgba(53,135,0,0.1); margin-bottom: 10px;">
								<v-expansion-panel-title>
									<VIcon color="green" :icon="icon" style="margin-right: 5px;"/>
									{{ item.title }}
								</v-expansion-panel-title>
								<v-expansion-panel-text>
									<v-expansion-panels>
										<v-expansion-panel>
											<v-expansion-panel-title style="font-weight: bold;font-size: 13px; line-height: 16px;">
												{{ item.subtitle }}
											</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div v-for="(value, i) in item.items" :key="i">
													<p style="font-size: 13px;line-height: 16px;">
														{{ value.precision }}
													</p>
													<div v-for="element in value.solution"
														 style="margin-top:15px; font-size: 13px;line-height: 16px;">
														<p style="font-weight: bold;">Méthodologie du test : <a
															href="value.link" target="blank">
															<VIcon :icon="linkICon"/>
														</a></p>
														<p>{{ element.info1 }}</p>
														<p>{{ element.info2 }}</p>
														<p>{{ element.info3 }}</p>
													</div>
													<span style="display:flex; justify-content:center; margin-bottom:5px;">______</span>
												</div>
											</v-expansion-panel-text>
										</v-expansion-panel>
									</v-expansion-panels>
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
						<div v-else style="display: flex;justify-content: center;"><span style="text-align:center;"  >Pas de critère d'accessibilité bloquant</span></div>
					</v-col>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}

export const Legende: StoryObj = {
	args: {
		icon: checkIcon,
	},
	render: (args) => {
		return {
			components: { VIcon },
			setup() {
				return { args }
			},
			template: `
			  <p style="color: grey;font-size: 11px; margin-bottom: 12px;">Date de conception: 20/11/2024</p>
			  <div>
				<p>Le tableau ci-dessous liste nos recommandations suivant les <a target="blank" style="color:#0C41BD;" href="https://www.numerique.gouv.fr/publications/rgaa-accessibilite/#contenu">catégories du RGAA</a>.</p>
				<p style="margin-bottom: 12px;font-weight:bold;">Pour rappel le composant seul ne garantie pas
				  l'accessibilité du site.</p>
				<div style="font-size: 14px">
				  <p>Nous avons deux façons de relever les problèmes d'accessibilité des composants :</p>
				  <div>
					<v-btn variant="tonal" color="grey" size="x-small" style="margin: 2px;font-size: 8px;" rounded>
					  Audit
					</v-btn>
					Problèmes relevés par le projet
				  </div>
				  <div>
					<v-btn variant="tonal" color="red" size="x-small" style="margin: 2px;font-size: 8px;" rounded>
					  Tanaguru
					</v-btn>
					Problèmes relevés par Tanaguru
				  </div>
				</div>
			  </div>
			  	<div class="mt-4">
				  <p>Rapport d’audit manuel : <a href="/audits/SelectBtnField.xlsx" style="color:#0C41BD;">Voir le rapport</a></p>
				  <p style="color: grey; font-size: 14px">Correctifs associés (<a href="https://github.com/assurance-maladie-digital/design-system-v3/issues/916" target="_blank" style="color:#0C41BD;">issue #916</a>)</p>
			  </div>
            `,
		}
	},
	tags: ['!dev'],
}

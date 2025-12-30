import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { AccessibiliteItemsIndeterminate, AccessibiliteItemsValidated } from './AccessibiliteItems'
import { mdiCheckboxMarkedCircle, mdiLink, mdiEye } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle
const iconEye = mdiEye
const linkIcon = mdiLink

export default {
	title: 'Composants/Layout/ToolbarContainer/Accessibilite',
}

export const AccessibilitePanel: StoryObj = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VIcon },
			setup() {
				const icon = checkIcon

				return { AccessibiliteItemsIndeterminate, AccessibiliteItemsValidated, icon, linkIcon, iconEye }
			},
			template: `
				<div class="accessibiliteItems" style="display:flex; flex-wrap: wrap; gap: 16px;">
					<div style="flex:1 1 320px; min-width: 320px;">
						<div style="display:flex; margin-bottom: 10px; justify-content: space-between; align-items: center;">
							<h5>{{ AccessibiliteItemsIndeterminate.length }} criteres a prendre en charge par le projet</h5>
						</div>
						<v-expansion-panels value="opened" multiple>
							<v-expansion-panel v-for="(item, index) in AccessibiliteItemsIndeterminate" :key="index" style="background-color: rgba(42, 96, 158, 0.1); margin-bottom: 10px;">
								<v-expansion-panel-title>
									<VIcon :icon="iconEye" style="margin-right: 5px; color:#5778b7;" />
									{{ item.title }}
								</v-expansion-panel-title>
								<v-expansion-panel-text>
									<v-expansion-panels>
										<v-expansion-panel>
											<v-expansion-panel-title style="font-weight: bold; font-size: 13px; line-height: 16px;">
												{{ item.subtitle }}
											</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div v-for="(value, i) in item.items" :key="i">
													<p style="font-size: 13px; line-height: 16px;">
														{{ value.precision }}
													</p>
													<div v-for="element in value.solution" style="margin-top: 15px; font-size: 13px; line-height: 16px;">
														<p style="font-weight: bold;">Methodologie du test : <a :href="value.link" target="_blank">
															<VIcon :icon="linkIcon" />
														</a></p>
														<p>{{ element.info1 }}</p>
														<p v-if="element.info2">{{ element.info2 }}</p>
														<p v-if="element.info3">{{ element.info3 }}</p>
														<p v-if="element.info4">{{ element.info4 }}</p>
													</div>
												</div>
											</v-expansion-panel-text>
										</v-expansion-panel>
									</v-expansion-panels>
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</div>
					<div style="flex:1 1 320px; min-width: 320px;">
						<div style="display:flex; margin-bottom: 10px; justify-content: space-between; align-items: center;">
							<h5>{{ AccessibiliteItemsValidated.length }} criteres pris en charge par l equipe Design System</h5>
						</div>
						<v-expansion-panels value="opened" multiple>
							<v-expansion-panel v-for="(item, index) in AccessibiliteItemsValidated" :key="index" style="background-color: rgba(53,135,0,0.1); margin-bottom: 10px;">
								<v-expansion-panel-title>
									<VIcon color="green" :icon="icon" style="margin-right: 5px;" />
									{{ item.title }}
								</v-expansion-panel-title>
								<v-expansion-panel-text>
									<v-expansion-panels>
										<v-expansion-panel>
											<v-expansion-panel-title style="font-weight: bold; font-size: 13px; line-height: 16px;">
												{{ item.subtitle }}
											</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div v-for="(value, i) in item.items" :key="i">
													<p style="font-size: 13px; line-height: 16px;">
														{{ value.precision }}
													</p>
													<div v-for="element in value.solution" style="margin-top: 15px; font-size: 13px; line-height: 16px;">
														<p style="font-weight: bold;">Methodologie du test : <a :href="value.link" target="_blank">
															<VIcon :icon="linkIcon" />
														</a></p>
														<p>{{ element.info1 }}</p>
														<p v-if="element.info2">{{ element.info2 }}</p>
														<p v-if="element.info3">{{ element.info3 }}</p>
													</div>
												</div>
											</v-expansion-panel-text>
										</v-expansion-panel>
									</v-expansion-panels>
								</v-expansion-panel-text>
							</v-expansion-panel>
						</v-expansion-panels>
					</div>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}

export const Legende: StoryObj = {
	render: () => {
		return {
			components: { VIcon },
			setup() {
				return { icon: checkIcon, iconEye }
			},
			template: `
				<p style="color: grey; font-size: 11px; margin-bottom: 12px;">Date de conception: 30/12/2025</p>
				<div>
					<p>Le tableau ci-dessous liste nos recommandations suivant les categories du RGAA.</p>
					<p style="margin-bottom: 12px; font-weight:bold;">Le composant seul ne garantit pas l accessibilite du site.</p>
					<div style="font-size: 14px;">
						<p>Nous distinguons les corrections a fournir par le projet et celles integrees dans le Design System :</p>
						<div>
							<VIcon :icon="icon" style="margin-right: 4px; color: green;" /> Pris en charge par le DS
						</div>
						<div>
							<VIcon :icon="iconEye" style="margin-right: 4px; color:#5778b7;" /> A traiter par le projet
						</div>
					</div>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}

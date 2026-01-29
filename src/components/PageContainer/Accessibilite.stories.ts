import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { AccessibiliteItemsIndeterminate, AccessibiliteItemsValidated } from './AccessibiliteItems'
import { mdiCheckboxMarkedCircle, mdiLink, mdiEye } from '@mdi/js'
import SyAlert from '@/components/SyAlert/SyAlert.vue'

const checkIcon = mdiCheckboxMarkedCircle
const iconEye = mdiEye
const linkICon = mdiLink

export default {
	title: 'Composants/Layout/PageContainer/Accessibilité',
}

export const AccessibilitePanel: StoryObj = {

	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon, SyAlert },

			setup() {
				const icon = checkIcon

				return { AccessibiliteItemsIndeterminate, AccessibiliteItemsValidated, icon, linkICon, iconEye, SyAlert }
			},
			template: `
				<div class="mt-6 mb-6">
					<SyAlert
						title="Attention au contraste"
						:closable="false"
					>
						<p> Le composant étant libre dans son implémentation, l'utilisateur doit veiller à la conformité de ce critère au regard de son intégration.</p>
					</SyAlert>
				</div>
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
										<v-expansion-panel>
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
						<v-expansion-panels value="opened" multiple>
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
				<div class="my-4">
					<p>Rapport d’audit manuel : <a href="/audits/PageContainer.xlsx" style="color:#0C41BD;">Voir le rapport</a></p>
					<p style="color: grey; font-size: 14px">Correctifs associés (<a href="https://github.com/assurance-maladie-digital/design-system/issues/4011" target="_blank" style="color:#0C41BD;">issue #4011</a>)</p>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}

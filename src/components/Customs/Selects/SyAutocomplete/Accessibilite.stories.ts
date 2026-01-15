import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon, VTable } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { AccessibiliteItemsIndeterminate, AccessibiliteItemsValidated } from './AccessibiliteItems'
import { mdiCheckboxMarkedCircle, mdiLink, mdiEye, mdiKeyboard } from '@mdi/js'

const checkIcon = mdiCheckboxMarkedCircle
const iconEye = mdiEye
const linkICon = mdiLink
const keyboardIcon = mdiKeyboard

export default {
	title: 'Composants/Formulaires/Selects/SyAutocomplete/Accessibilité',
}

// Story masquée qui n'apparaît que dans le MDX
export const ComboboxKeyboardNavigation: StoryObj = {
	tags: ['!dev'],
	render: () => {
		return {
			components: { VTable, VIcon },
			setup() {
				const keyboardData = [
					{
						touche: 'Flèche bas',
						action: 'Ouvre le menu et place le focus sur la première option (si aucune option active)',
					},
					{
						touche: 'Flèche haut',
						action: 'Ouvre le menu et place le focus sur la première option',
					},
					{
						touche: 'Flèches haut/bas',
						action: 'Déplace l\'option active dans la liste (sans sélectionner)',
					},
					{
						touche: 'Entrée',
						action: 'Sélectionne l\'option active et ferme le menu (single) / sélectionne et garde le menu ouvert (multiple)',
					},
					{
						touche: 'Échap',
						action: 'Ferme le menu',
					},
					{
						touche: 'Caractères imprimables',
						action: 'Met à jour la recherche et ouvre/filtre la liste selon la configuration',
					},
				]
				return { keyboardData, keyboardIcon }
			},
			template: `
				<div>
					<h3><v-icon :icon="keyboardIcon" style="margin-right: 8px;"/>Navigation au clavier</h3>
					<p>SyAutocomplete implémente le pattern combobox avec saisie (WAI-ARIA combobox avec autocomplete "list").</p>
					<v-table density="compact" style="margin-top: 16px;">
						<thead>
							<tr>
								<th>Touche</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(item, index) in keyboardData" :key="index">
								<td><code>{{ item.touche }}</code></td>
								<td>{{ item.action }}</td>
							</tr>
						</tbody>
					</v-table>
					<p style="margin-top: 16px;"><strong>Note:</strong> Le focus DOM reste sur l'input, la navigation d'option est exposée via <code>aria-activedescendant</code>.</p>
				</div>
			`,
		}
	},
}

export const AccessibilitePanel: StoryObj = {
	tags: ['!dev'],
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
								<v-btn variant="tonal" color="red" size="x-small" style="margin: 4px;font-size: 8px;" rounded>Tanaguru</v-btn>
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

										<v-expansion-panel v-for="(i, index) in item.items2" :key="i" style="margin-bottom: 10px;">
											<v-expansion-panel-title style="font-weight: bold; font-size: 13px; line-height: 16px;">
												{{ i.subtitle }}
											</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div>
													<p style="font-size: 13px;line-height: 16px;">{{ i.precision }}</p>
													<div v-for="(value, index) in i.solution" style="margin-top:15px; font-size: 13px;line-height: 16px;">
														<p style="font-weight: bold;">Méthodologie du test : <a href="{{i.link}}" target="blank"><VIcon :icon="linkICon"/></a></p>
														<p>{{ value.info1 }}</p>
														<p>{{ value.info2 }}</p>
														<p>{{ value.info3 }}</p>
													</div>
													<span style="display:flex; justify-content:center; margin-bottom:5px;">______</span>
												</div>
											</v-expansion-panel-text>
										</v-expansion-panel>

										<v-expansion-panel>
											<v-expansion-panel-title style="font-weight: bold; font-size: 13px; line-height: 16px;">
												{{ item.subtitle }}
											</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div v-for="(value, i) in item.items" :key="i">
													<p style="font-size: 13px;line-height: 16px;">{{ value.precision }}</p>
													<div v-for="element in value.solution" style="margin-top:15px; font-size: 13px;line-height: 16px;">
														<p style="font-weight: bold;">Méthodologie du test : <a href="value.link" target="blank"><VIcon :icon="linkICon"/></a></p>
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
								<v-btn variant="tonal" color="red" size="x-small" style="margin: 4px;font-size: 8px;" rounded>Tanaguru</v-btn>
							</div>
						</div>
						<v-expansion-panels value="opened" multiple>
							<v-expansion-panel v-for="(item, index) in AccessibiliteItemsValidated" :key="index" style="background-color: rgba(53,135,0,0.1); margin-bottom: 10px;">
								<v-expansion-panel-title>
									<VIcon color="green" :icon="icon" style="margin-right: 5px;"/>
									{{ item.title }}
								</v-expansion-panel-title>
								<v-expansion-panel-text>
									<v-expansion-panels>
										<v-expansion-panel v-for="(i, index) in item.items2" :key="i" style="margin-bottom: 10px;">
											<v-expansion-panel-title style="font-weight: bold; font-size: 13px; line-height: 16px;">{{ i.subtitle }}</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div>
													<p style="font-size: 13px;line-height: 16px;">{{ i.precision }}</p>
													<div v-for="(value, index) in i.solution" style="margin-top:15px; font-size: 13px;line-height: 16px;">
														<p style="font-weight: bold;">Méthodologie du test : <a href="{{i.link}}" target="blank"><VIcon :icon="linkICon"/></a></p>
														<p>{{ value.info1 }}</p>
														<p>{{ value.info2 }}</p>
														<p>{{ value.info3 }}</p>
													</div>
													<span style="display:flex; justify-content:center; margin-bottom:5px;">______</span>
												</div>
											</v-expansion-panel-text>
										</v-expansion-panel>
										<v-expansion-panel>
											<v-expansion-panel-title style="font-weight: bold; font-size: 13px; line-height: 16px;">{{ item.subtitle }}</v-expansion-panel-title>
											<v-expansion-panel-text>
												<div v-for="(value, i) in item.items" :key="i">
													<p style="font-size: 13px;line-height: 16px;">{{ value.precision }}</p>
													<div v-for="element in value.solution" style="margin-top:15px; font-size: 13px;line-height: 16px;">
														<p style="font-weight: bold;">Méthodologie du test : <a href="value.link" target="blank"><VIcon :icon="linkICon"/></a></p>
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
}

export const Legende: StoryObj = {
	tags: ['!dev'],
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
					<p style="margin-bottom: 12px;font-weight:bold;">Pour rappel le composant seul ne garantie pas l'accessibilité du site.</p>
					<div style="font-size: 14px">
						<p>Nous avons deux façons de relever les problèmes d'accessibilité des composants :</p>
						<div>
							<v-btn variant="tonal" color="grey" size="x-small" style="margin: 2px;font-size: 8px;" rounded>Audit</v-btn>
							Problèmes relevés par le projet
						</div>
						<div>
							<v-btn variant="tonal" color="red" size="x-small" style="margin: 2px;font-size: 8px;" rounded>Tanaguru</v-btn>
							Problèmes relevés par Tanaguru
						</div>
					</div>
					<div class="mt-4">
						<p>Rapport d’audit manuel : <a href="/audits/SyAutocomplete.xlsx" style="color:#0C41BD;">Voir le rapport</a></p>
						<p style="color: grey; font-size: 14px">Correctifs associés (à compléter)</p>
					</div>
				</div>
			`,
		}
	},
}

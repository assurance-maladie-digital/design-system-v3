import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon, VRow, VCol, VSelect, VBtn, VCombobox, VContainer, VListItem } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { VuetifyItems, itemsChips } from './VuetifyItems'
import { mdiCheckboxMarkedCircleOutline, mdiLinkVariant, mdiAlertCircleOutline } from '@mdi/js'
import { computed, ref } from 'vue'

const checkIcon = mdiCheckboxMarkedCircleOutline
const linkICon = mdiLinkVariant
const iconAlert = mdiAlertCircleOutline

export default {
	title: 'Guidelines/Vuetify',
}

export const VuetifyPanel: StoryObj = {
	render: () => {
		return {
			components: { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VListItem, VDataTable, VIcon, VContainer, VSelect, VBtn, VCombobox },
			setup() {
				const menuProps = ref({ top: false })
				const itemValue = ref(0)
				const activeBtnIndex = ref('null')
				const search = ref([])
				const searchString = ref('')
				const items = computed(() => {
					return itemsChips.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
				},
				)

				const itemsString = computed(() => {
					const items = itemsChips.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
					return items.map(o => o.text)
				},
				)

				const cardItem = computed(() => {
					return VuetifyItems[0].items[itemValue.value - 1]
				},
				)
				return { VuetifyItems, menuProps, items, itemsString, checkIcon, iconAlert, linkICon, itemValue, cardItem, activeBtnIndex, search, searchString }
			},
			template: `
				<VSheet :elevation="1"  class="mt-6 pa-4">
					<VRow cols="12" class="d-flex align-items justify-between ">
						<VCol cols="12" sm="6" >
							<v-combobox
								:menu-props="menuProps"
								variant="outlined"
								color="primary"
								v-model="search"
								clearable
								dense
								:items="items"
								item-value="value"
								item-title="text"
								:selected="search ? itemValue = search.value :  itemValue = 0"
								label="Rechercher un composant"
								hide-selected
								return-object 
								style="margin-bottom: -20px"
							/>
						</VCol>
						<VCol cols="12" sm="6" class="v-col-auto">
							<p style="font-size: 13px;">
								<VIcon style="margin-right: 2px;" :icon="iconAlert"/>
								Composant non conforme par défaut.
							</p>
							<p style="font-size: 13px;">
								<VIcon style="margin-right: 2px;" :icon="checkIcon"/>
								Composant conforme.
							</p>
						</VCol>
					</VRow>
				</VSheet>

				<div style="display: flex; justify-content: center;" class="mt-12">
					<v-card v-if="cardItem && itemValue !==0 " class="w-100 w-md-75">
						<v-card-item>
							<v-card-title>
								<div style="align-items: center;display: flex;">
									<VIcon
										v-if="cardItem.errorImportants.length > 0 && cardItem.errorIndeterminated.length > 0"
										style="margin-right: 5px;font-size: 25px;" :icon="iconAlert"/>
									<VIcon v-else style="margin-right: 5px;font-size: 25px;" :icon="checkIcon"/>

									{{ cardItem.name }}
									</div>
							</v-card-title>

							<v-card-text style="margin-top:20px;">
								<v-expansion-panels multiple>

									<v-expansion-panel>
										<v-expansion-panel-title>Erreurs bloquantes
											<v-btn variant="tonal" size="x-small"
												   style="margin-left: 3px;font-size: 9px;" rounded> Tanaguru
											</v-btn>
										</v-expansion-panel-title>
										<v-expansion-panel-text>
											<div v-if="cardItem.errorImportants.length == 0">
												<p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px;">Pas
													d'erreur
													d'accessibilité relevée à ce jour</p>
											</div>
											<div v-for="item in cardItem.errorImportants" :key="index"
												 style="width: 100% !important; font-size: 12px; line-height: 15px;">
												<p style="margin-top: 5px; margin-bottom: 5px;">
													<span
														style="font-weight: bold;">{{ item.match('[0-9.]+')?.join('') || '' }} </span>
													{{ item.replace(/[0-9.]/g, '') }}
												</p>
											</div>
											<v-divider class="mt-4 mb-2" v-if="cardItem.errorImportants.length != 0"
													   style="display: flex; justify-content:center"></v-divider>
											<div style="display: flex;align-items: center;"
												 v-if="cardItem.errorSolutionImportant && cardItem.errorSolutionImportant.length > 0">
												<span style="line-height: 15px; font-weight: bold; margin-right:5px;">Recommandation : </span>
												<div v-for="item in cardItem.errorSolutionImportant" :key="index"
													 style="line-height: 15px;">
													<p style="margin-top: 5px; margin-bottom: 5px;">
														<span> {{ item }} </span>

													</p>
												</div>
											</div>
										</v-expansion-panel-text>
									</v-expansion-panel>

									<v-expansion-panel style="margin-top:10px;">
										<v-expansion-panel-title>Erreurs indéterminées
											<v-btn variant="tonal" size="x-small"
												   style="margin-left: 3px;font-size: 9px;" rounded> Tanaguru
											</v-btn>

										</v-expansion-panel-title>
										<v-expansion-panel-text>
											<div v-if="cardItem.errorIndeterminated.length == 0">
												<p style="margin-top: 5px; margin-bottom: 5px; font-size: 12px;">Pas
													d'erreur
													d'accessibilité relevée à ce jour</p>
											</div>
											<div v-for="item in cardItem.errorIndeterminated" :key="index"
												 style="width: 100% !important; font-size: 12px; line-height: 15px;">

												<p style="margin-top: 5px; margin-bottom: 5px;">
													<span
														style="font-weight: bold;">{{ item.match('[0-9.]+')?.join('') || '' }} </span>
													{{ item.replace(/[0-9.]/g, '') }}
												</p>
											</div>

											<v-divider class="mt-4 mb-2" v-if="cardItem.errorIndeterminated.length != 0" style="display: flex; justify-content:center" />

											<div style="align-items: center;"
												 v-if="cardItem.errorSolutionIndeterminated && cardItem.errorSolutionIndeterminated.length > 0">
												<span style="line-height: 15px; font-weight: bold; margin-right:5px;">Recommandation : </span>
												<div v-for="item in cardItem.errorSolutionIndeterminated" :key="index"
													 style="line-height: 15px;">
													<p style="margin-top: 5px; margin-bottom: 5px;">
														<span> {{ item }} </span>
													</p>
												</div>
											</div>
										</v-expansion-panel-text>
									</v-expansion-panel>
								</v-expansion-panels>

							</v-card-text>
							<v-card-actions>
								<p v-if="cardItem.solution.length > 0">Solution :</p>
								<span v-for="(item, index) in cardItem.solution"
									  style="display:flex; align-items: center; line-height: 15px; font-weight: bold">
								{{ item.name }} <a :href="item.href" v-if="item.href">
								<VBtn color="primary" style="margin-left: 5px;" :icon="linkICon" size="small"
									  variant="text"/></a>
							</span>
							</v-card-actions>
						</v-card-item>
					</v-card>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}

export const Legende: StoryObj = {
	args: {
	},
	render: (args) => {
		return {
			components: { VIcon, VRow, VCol },
			setup() {
				return { args, checkIcon, iconAlert }
			},
			template: `
			  <p class="mb-2" style="color: grey;font-size: 11px;">L'étude porte sur 25 composants à date du 13/12/2024</p>

				<VRow >
				<VCol cols="12" sm="12">
				<div style="font-size: 13px;">
					<p>L'étude relève que la majorité des composants garantissent l'accessibilité numérique par défaut tel que défini par le RGAA. <br />Nous identifions néanmoins pour certains composants qu'un travail d'ajustement est nécessaire. Ce travail peut être réalisé directement par les produits.<br />Dans une démarche d'accélération de la fabrication, nous proposons pour chaque composant relevant d'un manque sur le sujet des solutions afin d'en faciliter <br /> la mise en conformité. Ces solutions peuvent être de nature : composant ou recommandation.</p>
					<br />
					<p>Pour chaque composant, nous indiquons les erreurs remontées par l'outil Tanaguru : Erreurs bloquantes et indéterminées.<br />Ces erreurs doivent être analysées contextuellement. Pour rappel, l'accessibilité numérique ne se mesure par sur des composants seuls dénués de contexte.<br />Une appréciation de la part du développeur est nécessaire pour en évaluer la pertinence.</p>
				</div>
                </VCol>
            
              </VRow>
            `,
		}
	},
	tags: ['!dev'],
}

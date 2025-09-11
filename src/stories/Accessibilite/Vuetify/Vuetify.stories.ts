import { VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText, VDataTable, VIcon, VRow, VCol, VSelect, VBtn, VCombobox, VContainer, VListItem, VChip, VDivider, VSheet, VCard, VCardItem, VCardTitle, VCardText, VBadge, VTooltip } from 'vuetify/components'
import type { StoryObj } from '@storybook/vue3'
import { VuetifyItems, itemsChips } from './VuetifyItems'
import { mdiCheckboxMarkedCircleOutline, mdiLinkVariant, mdiAlertCircleOutline, mdiMagnify, mdiFilterVariant, mdiInformationOutline } from '@mdi/js'
import { computed, ref, watch } from 'vue'

const checkIcon = mdiCheckboxMarkedCircleOutline
const linkIcon = mdiLinkVariant
const iconAlert = mdiAlertCircleOutline
const searchIcon = mdiMagnify
const filterIcon = mdiFilterVariant
const infoIcon = mdiInformationOutline

export default {
	title: 'Accessibilité/Design System/Vuetify',
}

export const VuetifyPanel: StoryObj = {
	render: () => {
		return {
			components: {
				VExpansionPanels, VExpansionPanel, VExpansionPanelTitle, VExpansionPanelText,
				VListItem, VDataTable, VIcon, VContainer, VSelect, VBtn, VCombobox,
				VChip, VDivider, VSheet, VCard, VCardItem, VCardTitle, VCardText, VBadge, VTooltip, VRow, VCol,
			},
			setup() {
				// Configuration de base
				const menuProps = ref({ top: false })
				const itemValue = ref(0)
				const activeBtnIndex = ref('null')
				const search = ref([])
				const searchString = ref('')

				// Filtrage par conformité
				const conformityFilter = ref('all')
				const conformityOptions = [
					{ title: 'Tous les composants', value: 'all' },
					{ title: 'Natifs Conformes', value: 'conform' },
					{ title: 'Natifs Non conformes', value: 'non-conform' },
					{ title: 'Alternatifs Conformes', value: 'alternative' },
				]

				// Tri des items par ordre alphabétique
				const items = computed(() => {
					return itemsChips.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
				})

				const itemsString = computed(() => {
					const sortedItems = itemsChips.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()))
					return sortedItems.map(o => o.text)
				})

				// Récupération du composant sélectionné
				const cardItem = computed(() => {
					return itemValue.value > 0
						? VuetifyItems[0].items[itemValue.value - 1]
						: {
								name: '',
								value: 0,
								errorImportants: [],
								errorIndeterminated: [],
								errorSolutionImportant: [],
								errorSolutionIndeterminated: [],
								solution: [],
							}
				})

				// Vérification si un composant est conforme ou non
				const isComponentConform = (item) => {
					return item && (item.errorImportants.length === 0 && item.errorIndeterminated.length === 0)
				}

				// Vérification si un composant a une solution alternative avec href
				const hasAlternativeSolution = (item) => {
					return item && item.solution && item.solution.some(sol => sol.href)
				}

				// Détermine le statut du composant (conforme, alternatif, non conforme)
				const getComponentStatus = (item) => {
					if (isComponentConform(item)) return 'conform'
					if (hasAlternativeSolution(item)) return 'alternative'
					return 'non-conform'
				}

				// Détermine la couleur du composant selon son statut
				const getComponentColor = (item) => {
					const status = getComponentStatus(item)
					if (status === 'conform') return 'success'
					if (status === 'alternative') return '#a05bb6'
					return 'error'
				}

				// Détermine l'icône du composant selon son statut
				const getComponentIcon = (item) => {
					return getComponentStatus(item) === 'conform' || getComponentStatus(item) === 'alternative' ? checkIcon : iconAlert
				}

				// Filtrage des composants par conformité
				const filteredComponents = computed(() => {
					// Si on veut tous les composants
					if (conformityFilter.value === 'all') {
						return items.value
					}

					// Filtrer selon la conformité sélectionnée
					return items.value.filter((item) => {
						const component = VuetifyItems[0].items.find(c => c.value === item.value)
						const status = getComponentStatus(component)

						switch (conformityFilter.value) {
							case 'conform':
								return status === 'conform'
							case 'non-conform':
								return status === 'non-conform'
							case 'alternative':
								return status === 'alternative'
							default:
								return true
						}
					})
				})

				// Liste des composants filtrés pour affichage
				const displayedComponents = computed(() => {
					return VuetifyItems[0].items.filter((component) => {
						// Filtrage par conformité
						if (conformityFilter.value !== 'all') {
							const status = getComponentStatus(component)

							switch (conformityFilter.value) {
								case 'conform':
									return status === 'conform'
								case 'non-conform':
									return status === 'non-conform'
								case 'alternative':
									return status === 'alternative'
								default:
									return true
							}
						}
						return true
					})
				})

				// Surveillance des changements de filtre
				watch(conformityFilter, () => {
					// Réinitialiser la sélection quand on change de filtre
					itemValue.value = 0
					search.value = []
				})

				return {
					VuetifyItems, menuProps, items: filteredComponents, itemsString,
					checkIcon, iconAlert, linkIcon, searchIcon, filterIcon, infoIcon,
					itemValue, cardItem, activeBtnIndex, search, searchString,
					conformityFilter, conformityOptions, isComponentConform,
					hasAlternativeSolution, getComponentStatus, getComponentColor, getComponentIcon,
					displayedComponents,
					// Les propriétés filterIcon et searchIcon sont déjà définies à la ligne 115
				}
			},
			template: `
				<div class="vuetify-audit-dashboard">
					<!-- En-tête avec filtres et recherche -->
					<VSheet :elevation="2" class="mt-4 pa-4 rounded" style="background: linear-gradient(to right, #f5f7fa, #eef2f7);">
						<h2 class="text-h5 mb-4" style="color: #1867c0; font-weight: 600;">Audit d'accessibilité des composants Vuetify</h2>
						
						<VRow>
							<!-- Filtres -->
							<VCol cols="12" sm="6" md="4">
								<VSelect
									v-model="conformityFilter"
									:items="conformityOptions"
									item-title="title"
									item-value="value"
									label="Filtrer par conformité"
									variant="outlined"
									dense
									color="primary"
									prepend-inner-icon="mdi-filter-variant"
								></VSelect>
							</VCol>
							
							<!-- Recherche -->
							<VCol cols="12" sm="6" md="8">
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
									:selected="search ? itemValue = search.value : itemValue = 0"
									label="Rechercher un composant"
									hide-selected
									return-object
									prepend-inner-icon="mdi-magnify"
								></v-combobox>
							</VCol>
						</VRow>
						
						<!-- Légende -->
						<div class="d-flex flex-wrap mt-4">
							<VChip class="mr-2 mb-2" color="success" variant="outlined">
								<VIcon size="small" class="mr-1" :icon="checkIcon"></VIcon>
								Composant natif conforme
							</VChip>
							<VChip class="mr-2 mb-2" color="error" variant="outlined">
								<VIcon size="small" class="mr-1" :icon="iconAlert"></VIcon>
								Composant natif non conforme
							</VChip>
							<VChip class="mr-2 mb-2" color="#a05bb6" variant="outlined">
								<VIcon size="small" class="mr-1" :icon="checkIcon"></VIcon>
								Composant alternatif conforme
							</VChip>
						</div>
					</VSheet>

				<!-- Liste des composants filtrés -->
				<div class="mt-6">
					<h3 class="text-h6 mb-4">Composants {{ conformityFilter === 'all' ? '' : conformityFilter === 'conform' ? 'conformes' : 'non conformes' }}</h3>
					
					<div v-if="displayedComponents.length === 0" class="text-center pa-4 grey lighten-3 rounded">
						Aucun composant ne correspond aux critères de filtrage.
					</div>
					
					<div v-else class="d-flex flex-wrap gap-2">
						<VChip
							v-for="component in displayedComponents"
							:key="component.value"
							:color="getComponentColor(component)"
							variant="outlined"
							class="ma-1"
							@click="itemValue = component.value; search = items.find(item => item.value === component.value)"
							style="cursor: pointer;"
						>
							<VIcon size="x-small" class="mr-1" :icon="getComponentIcon(component)"></VIcon>
							{{ component.name }}
						</VChip>
					</div>
				</div>

				<!-- Affichage du composant sélectionné -->
				<div class="d-flex justify-center mt-8" v-if="itemValue !== 0">
					<VCard class="w-100 w-md-75" :elevation="3" :class="{'border-success': getComponentStatus(cardItem) === 'conform', 'border-error': getComponentStatus(cardItem) === 'non-conform', 'border-alternative': getComponentStatus(cardItem) === 'alternative'}" style="border-top: 4px solid; border-radius: 8px; overflow: hidden;">
						<VCardItem>
							<VCardTitle class="d-flex align-center">
								<h3 class="text-h5 font-weight-bold">{{ cardItem.name }}</h3>
								<VChip
									class="ml-auto"
									:color="getComponentColor(cardItem)"
									:text="getComponentStatus(cardItem) === 'conform' ? 'Conforme' : getComponentStatus(cardItem) === 'alternative' ? 'Alternative conforme' : 'Non conforme'"
									variant="tonal"
									size="small"
								>
									<template v-slot:prepend>
										<VIcon size="x-small" :icon="getComponentIcon(cardItem)"></VIcon>
									</template>
								</VChip>
							</VCardTitle>

							<VCardText class="pt-4">
								<!-- Statistiques du composant -->
								<div class="d-flex flex-wrap gap-4 mb-6">
									<VCard variant="outlined" class="flex-grow-1">
										<VCardItem>
											<template v-slot:prepend>
												<VAvatar size="36" :color="cardItem.errorImportants.length > 0 ? 'error' : 'success'" variant="tonal">
													<VIcon :icon="cardItem.errorImportants.length > 0 ? iconAlert : checkIcon"></VIcon>
												</VAvatar>
											</template>
											<VCardTitle>Erreurs bloquantes</VCardTitle>
											<VCardSubtitle>{{ cardItem.errorImportants.length }} erreur(s)</VCardSubtitle>
										</VCardItem>
									</VCard>
									
									<VCard variant="outlined" class="flex-grow-1">
										<VCardItem>
											<template v-slot:prepend>
												<VAvatar size="36" :color="cardItem.errorIndeterminated.length > 0 ? 'warning' : 'success'" variant="tonal">
													<VIcon :icon="cardItem.errorIndeterminated.length > 0 ? iconAlert : checkIcon"></VIcon>
												</VAvatar>
											</template>
											<VCardTitle>Erreurs indéterminées</VCardTitle>
											<VCardSubtitle>{{ cardItem.errorIndeterminated.length }} erreur(s)</VCardSubtitle>
										</VCardItem>
									</VCard>
								</div>
								
								<!-- Panneaux d'expansion pour les détails -->
								<VExpansionPanels multiple variant="accordion">
									<!-- Erreurs bloquantes -->
									<VExpansionPanel>
										<VExpansionPanelTitle>
											<div class="d-flex align-center">
												<VIcon :color="cardItem.errorImportants.length > 0 ? 'error' : 'success'" class="mr-2" :icon="cardItem.errorImportants.length > 0 ? iconAlert : checkIcon"></VIcon>
												Erreurs bloquantes
												<VChip class="ml-2" size="x-small" color="primary" variant="tonal">TANAGURU</VChip>
											</div>
										</VExpansionPanelTitle>
										<VExpansionPanelText>
											<div v-if="cardItem.errorImportants.length === 0" class="pa-2 rounded bg-success-lighten-5">
												<p class="text-body-2 mb-0">
													<VIcon size="small" color="success" class="mr-1" :icon="checkIcon"></VIcon>
													Pas d'erreur d'accessibilité bloquante relevée à ce jour
												</p>
											</div>
											
											<VList v-else density="compact" class="bg-error-lighten-5 rounded">
												<VListItem v-for="(item, i) in cardItem.errorImportants" :key="i" class="py-1">
													<VListItemTitle class="text-body-2">
														<span class="font-weight-bold">{{ item.match('[0-9.]+')?.join('') || '' }}</span>
														{{ item.replace(/[0-9.]/g, '') }}
													</VListItemTitle>
												</VListItem>
											</VList>
											
											<VDivider class="my-3" v-if="cardItem.errorSolutionImportant.length !== 0"></VDivider>
											
											<div v-if="cardItem.errorSolutionImportant.length !== 0" class="pa-2 rounded bg-info-lighten-5">
												<p class="text-body-2 mb-0">
													<VIcon size="small" color="info" class="mr-1" :icon="infoIcon"></VIcon>
													<span class="font-weight-bold">Solution : </span>
													{{ cardItem.errorSolutionImportant[0] }}
												</p>
											</div>
										</VExpansionPanelText>
									</VExpansionPanel>

									<VExpansionPanel>
										<VExpansionPanelTitle>
											<div class="d-flex align-center">
												<VIcon :color="cardItem.errorIndeterminated.length > 0 ? iconAlert : checkIcon" class="mr-2" :icon="cardItem.errorIndeterminated.length > 0 ? iconAlert : checkIcon"></VIcon>
												Erreurs indéterminées
												<VChip class="ml-2" size="x-small" color="primary" variant="tonal">TANAGURU</VChip>
											</div>
										</VExpansionPanelTitle>
										<VExpansionPanelText>
											<div v-if="cardItem.errorIndeterminated.length === 0" class="pa-2 rounded bg-success-lighten-5">
												<p class="text-body-2 mb-0">
													<VIcon size="small" color="success" class="mr-1" :icon="checkIcon"></VIcon>
													Pas d'erreur d'accessibilité indéterminée relevée à ce jour
												</p>
											</div>
											
											<VList v-else density="compact" class="bg-warning-lighten-5 rounded">
												<VListItem v-for="(item, i) in cardItem.errorIndeterminated" :key="i" class="py-1">
													<VListItemTitle class="text-body-2">
														<span class="font-weight-bold">{{ item.match('[0-9.]+')?.join('') || '' }}</span>
														{{ item.replace(/[0-9.]/g, '') }}
													</VListItemTitle>
												</VListItem>
											</VList>
											
											<VDivider class="my-3" v-if="cardItem.errorSolutionIndeterminated && cardItem.errorSolutionIndeterminated.length > 0"></VDivider>
											
											<div v-if="cardItem.errorSolutionIndeterminated && cardItem.errorSolutionIndeterminated.length > 0" class="pa-2 rounded bg-info-lighten-5">
												<p class="text-body-2 mb-0">
													<VIcon size="small" color="info" class="mr-1" :icon="infoIcon"></VIcon>
													<span class="font-weight-bold">Solution : </span>
													{{ cardItem.errorSolutionIndeterminated[0] }}
												</p>
											</div>
										</VExpansionPanelText>
									</VExpansionPanel>
								</VExpansionPanels>

							</VCardText>
							<VDivider class="mb-2"></VDivider>
							<VCardActions>
								<VCard variant="flat" class="w-100 bg-primary-lighten-5 pa-3">
									<VCardTitle class="text-h6 pb-2">
										<VIcon color="primary" class="mr-2" icon="mdi-lightbulb-outline"></VIcon>
										Solutions recommandées
									</VCardTitle>
									
									<div v-if="cardItem.solution.length === 0" class="text-body-2 text-grey">
										Aucune solution recommandée pour le moment.
									</div>
									
									<VChipGroup v-else>
										<VChip 
											v-for="(item, index) in cardItem.solution" 
											:key="index"
											color="primary"
											variant="elevated"
											class="ma-1"
											link
											:href="item.href"
											target="_blank"
										>
											<VIcon start size="small" :icon="linkIcon"></VIcon>
											{{ item.name }}
										</VChip>
									</VChipGroup>
								</VCard>
							</VCardActions>
						</VCardItem>
					</VCard>
				</div>
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
			  <p class="mb-2" style="color: grey;font-size: 11px;">L'étude porte sur 25 composants à date du 19/06/2025</p>

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

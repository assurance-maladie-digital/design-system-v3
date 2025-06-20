import type { StoryObj } from '@storybook/vue3'
import { computed, ref } from 'vue'
import { mdiCheckCircle, mdiClockOutline, mdiProgressClock } from '@mdi/js'

export default {
	title: 'Accessibilité/Design System/Avancement',
}

export const PreAudit: StoryObj = {
	render: () => {
		return {
			setup() {},
			template: `
				<v-chip
					class="ma-2"
					color="success"
					variant="elevated"
				>
					59/59 Composants
				</v-chip>
			`,
		}
	},
	tags: ['!dev'],
}

export const Manuel: StoryObj = {
	render: () => {
		return {
			setup() {
				const search = ref('')
				const statusFilter = ref('all')
				const page = ref(1)
				const itemsPerPage = 20
				const headers = [
					{ text: 'Composant', value: 'composant' },
					{ text: 'Statut', value: 'status' },
					{ text: 'Dernière mise à jour', value: 'lastUpdate' },
				]

				const items = [
					{ composant: 'PageContainer', status: 'Audité' },
					{ composant: 'SkipLink', status: 'Audité' },
					{ composant: 'Alerts', status: 'Audité' },
					{ composant: 'NotificationBar', status: 'Non audité' },
					{ composant: 'BackBtn', status: 'Audité' },
					{ composant: 'BackToTopBtn', status: 'Audité' },
					{ composant: 'CopyBtn', status: 'Audité' },
					{ composant: 'LangBtn', status: 'Audité' },
					{ composant: 'DownloadBtn', status: 'Audité' },
					{ composant: 'FranceConnectBtn', status: 'Audité' },
					{ composant: 'SyTextField', status: 'Audité' },
					{ composant: 'HeaderBar', status: 'Non audité' },
					{ composant: 'HeaderNavigationBar', status: 'Non audité' },
					{ composant: 'LogoBrandSection', status: 'Non audité' },
					{ composant: 'SubHeader', status: 'Non audité' },
					{ composant: 'HeaderLoading', status: 'Non audité' },
					{ composant: 'HeaderToolbar', status: 'Non audité' },
					{ composant: 'Footer', status: 'Non audité' },
					{ composant: 'SySelect', status: 'En cours' },
					{ composant: 'SyInputSelect', status: 'Non audité' },
					{ composant: 'Logo', status: 'Audité' },
					{ composant: 'DataListGroup', status: 'Non audité' },
					{ composant: 'DataList', status: 'Non audité' },
					{ composant: 'DataListItem', status: 'Non audité' },
					{ composant: 'DataListLoading', status: 'Non audité' },
					{ composant: 'ErrorPage', status: 'Non audité' },
					{ composant: 'CookieBanner', status: 'Non audité' },
					{ composant: 'ExternalLinks', status: 'Non audité' },
					{ composant: 'ContextualMenu', status: 'Non audité' },
					{ composant: 'DialogBox', status: 'Non audité' },
					{ composant: 'PasswordField', status: 'Non audité' },
					{ composant: 'PhoneField', status: 'Non audité' },
					{ composant: 'UserMenuBtn', status: 'Non audité' },
					{ composant: 'SyBtnSelect', status: 'Non audité' },
					{ composant: 'NirField', status: 'Non audité' },
					{ composant: 'PeriodField', status: 'Non audité' },
					{ composant: 'RangeField', status: 'Non audité' },
					{ composant: 'SearchListField', status: 'Non audité' },
					{ composant: 'SelectBtnField', status: 'Non audité' },
					{ composant: 'RatingPicker', status: 'Non audité' },
					{ composant: 'DatePicker', status: 'Non audité' },
					{ composant: 'FileUpload', status: 'Non audité' },
					{ composant: 'FilePreview', status: 'Non audité' },
					{ composant: 'FileList', status: 'Non audité' },
					{ composant: 'UploadWorkflow', status: 'Non audité' },
					{ composant: 'ChipList', status: 'Non audité' },
					{ composant: 'FilterInline', status: 'Non audité' },
					{ composant: 'FilterSideBar', status: 'Non audité' },
					{ composant: 'PaginatedTable', status: 'Non audité' },
					{ composant: 'TableToolbar', status: 'Non audité' },
					{ composant: 'ErrorPage', status: 'Audité' },
					{ composant: 'NotFoundPage', status: 'En cours' },
					{ composant: 'MaintenancePage', status: 'En cours' },
					{ composant: 'ContextualMenu', status: 'En cours' },
					{ composant: 'ExternalLinks', status: 'En cours' },
				]

				// Options de filtrage par statut
				const statusOptions = [
					{ title: 'Tous les composants', value: 'all' },
					{ title: 'Audités', value: 'audited' },
					{ title: 'En cours', value: 'in-progress' },
					{ title: 'Non audités', value: 'not-audited' },
				]

				// Filtrer les items en fonction de la recherche et du statut
				const filteredItems = computed(() => {
					let result = [...items]

					// Filtrage par statut
					if (statusFilter.value !== 'all') {
						result = result.filter((item) => {
							// Filtrer selon le statut sélectionné
							switch (statusFilter.value) {
								case 'audited':
									return item.status === 'Audité'
								case 'in-progress':
									return item.status === 'En cours'
								case 'not-audited':
									return item.status === 'Non audité'
								default:
									return true
							}
						})
					}

					// Filtrage par recherche
					if (search.value) {
						const searchTerm = search.value.toLowerCase()
						result = result.filter(item => item.composant.toLowerCase().includes(searchTerm))
					}

					return result
				})

				const totalItems = computed(() => items.length)

				const checkedItems = computed(() => {
					return items.filter(item => item.status === 'Audité').length
				})

				// Calcul des éléments paginés
				const paginatedItems = computed(() => {
					const start = (page.value - 1) * itemsPerPage
					const end = start + itemsPerPage
					return filteredItems.value.slice(start, end)
				})

				return { headers, items, filteredItems, totalItems, checkedItems, search, statusFilter, statusOptions, page, itemsPerPage, paginatedItems, mdiCheckCircle, mdiClockOutline, mdiProgressClock }
			},
			template: `
				<div class="audit-dashboard pa-4">
					<div class="d-flex flex-wrap align-center justify-space-between mb-6">
						<div class="d-flex flex-wrap">
							<v-select
								v-model="statusFilter"
								:items="statusOptions"
								item-title="title"
								item-value="value"
								label="Filtrer par statut"
								hide-details
								class="mr-2 mb-2"
								style="max-width: 250px; min-width: 250px"
								density="comfortable"
								variant="outlined"
							></v-select>
							
							<v-text-field
								v-model="search"
								label="Rechercher un composant"
								append-inner-icon="mdi-magnify"
								single-line
								hide-details
								class="mb-2"
								style="max-width: 250px; min-width: 250px"
								density="comfortable"
								variant="outlined"
							></v-text-field>
						</div>
					</div>

					<div class="component-grid mb-6">

						<v-row>
							<v-col
								v-for="item in paginatedItems"
								:key="item.composant"
								cols="12"
								sm="6"
								md="4"
								lg="3"
							>
								<v-card
									class="component-card"
									:class="{ 'audited': item.status === 'Audité', 'in-progress': item.status === 'En cours', 'not-audited': item.status === 'Non audité' }"
									elevation="2"
									height="100%"
								>
									<v-card-item>
										<v-card-title class="text-truncate">{{ item.composant }}</v-card-title>
										<template v-slot:append>
											<v-avatar
												:color="item.status === 'Audité' ? 'success' : (item.status === 'En cours' ? 'info' : 'warning')"
												size="36"
											>
												<v-icon
													:icon="item.status === 'Audité' ? mdiCheckCircle : (item.status === 'En cours' ? mdiProgressClock : mdiClockOutline)"
													color="white"
												></v-icon>
											</v-avatar>
										</template>
									</v-card-item>
									
									<v-card-text>
										<v-chip
											:color="item.status === 'Audité' ? 'success' : (item.status === 'En cours' ? 'info' : 'warning')"
											variant="flat"
											class="mb-2"
										>
											{{ item.status }}
										</v-chip>
									</v-card-text>
								</v-card>
							</v-col>
						</v-row>

						<div class="d-flex justify-center mt-4">
							<v-pagination
								v-model="page"
								:length="Math.ceil(filteredItems.length / itemsPerPage)"
								total-visible="7"
								rounded
							></v-pagination>
						</div>

						<div class="pa-2 text-caption text-right">
							Dernière mise à jour: 20/06/2025
						</div>
					</div>
					
					<style>
					.component-grid {
						background-color: #f5f5f5;
						border-radius: 8px;
						padding: 16px;
					}
					.component-card {
						transition: all 0.3s ease;
						border-left: 5px solid transparent;
						overflow: hidden;
					}
					.component-card:hover {
						transform: translateY(-5px);
					}
					.component-card.audited {
						border-left-color: #4CAF50;
					}
					.component-card.in-progress {
						border-left-color: #2196F3;
					}
					.component-card.not-audited {
						border-left-color: #FF9800;
					}
					</style>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}

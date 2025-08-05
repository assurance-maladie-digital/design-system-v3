import type { StoryObj } from '@storybook/vue3'
import { computed, ref } from 'vue'

export default {
	title: 'Accessibilité/Kit de pré-audit/Outils/Tanaguru/Faux positifs',
}

export const FauxPositifsCards: StoryObj = {
	render: () => {
		return {
			setup() {
				const search = ref('')
				const tanaguruCategoryFilter = ref('all')
				const page = ref(1)
				const itemsPerPage = 8

				const items = [
					{
						tanaguruCategory: 'mandatory-elements',
						tanaguruIssue: 'Propriétés ARIA non autorisées sur leur élément.',
						component: 'Dialog',
						explanation: 'Une boîte de dialogue de type modale doit posséder la balise aria-modal="true" pour indiquer qu’elle est modale.',
					},
				]

				const tanaguruCategories = {
					'colors': {
						label: 'Couleurs',
						color: '#f0b323',
					},
					'forms': {
						label: 'Formulaires',
						color: '#f97316',
					},
					'images': {
						label: 'Images',
						color: '#ddd',
					},
					'information-presentation': {
						label: 'Présentation de l’information',
						color: '#555555',
					},
					'information-structure': {
						label: 'Structure de l’information',
						color: '#a05bb6',
					},
					'links': {
						label: 'Liens',
						color: '#3b82f6',
					},
					'mandatory-elements': {
						label: 'Éléments obligatoires',
						color: '#cc3e50',
					},
					'navigation': {
						label: 'Navigation',
						color: '#4caf50',
					},
					'scripts': {
						label: 'Scripts',
						color: '#2f3e46',
					},
				}

				// Options de filtrage par catégorie Tanaguru
				const tanaguruCategoryOptions = [
					{ title: 'Toutes les catégories', value: 'all' },
					...Object.entries(tanaguruCategories).map(
						([value, { label }]) => ({ title: label, value }),
					),
				]

				// Filtrer les items en fonction de la recherche et du statut
				const filteredItems = computed(() => {
					let result = [...items]

					// Filtrage par statut
					if (tanaguruCategoryFilter.value !== 'all') {
						result = result.filter(({ tanaguruCategory }) => tanaguruCategory === tanaguruCategoryFilter.value)
					}

					// Filtrage par recherche
					if (search.value) {
						const searchTerm = search.value.toLowerCase()
						result = result.filter(({ tanaguruIssue, component }) => tanaguruIssue.toLowerCase().includes(searchTerm) || component.toLowerCase().includes(searchTerm))
					}

					return result
				})

				const totalItems = computed(() => items.length)

				// Calcul des éléments paginés
				const paginatedItems = computed(() => {
					const start = (page.value - 1) * itemsPerPage
					const end = start + itemsPerPage
					return filteredItems.value.slice(start, end)
				})

				// Permet de mettre en évidence les correspondances dans le texte
				const highlightMatch = (text, search) => {
					if (!search) return text

					const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Échappe les caractères spéciaux
					const regex = new RegExp(`(${escapedSearch})`, 'gi')

					return text.replace(regex, '<mark>$1</mark>')
				}

				return { filteredItems, highlightMatch, items, itemsPerPage, page, paginatedItems, search, tanaguruCategories, tanaguruCategoryFilter, tanaguruCategoryOptions, totalItems }
			},
			template: `
				<div class="audit-dashboard pa-4">
					<div class="d-flex flex-wrap align-center justify-space-between mb-6">
						<div class="d-flex flex-wrap">
							<v-select
								v-model="tanaguruCategoryFilter"
								:items="tanaguruCategoryOptions"
								item-title="title"
								item-value="value"
								label="Filtrer par catégorie Tanaguru"
								hide-details
								color="primary"
								class="mr-2 mb-2"
								style="max-width: 250px; min-width: 250px"
								density="comfortable"
								variant="outlined"
							></v-select>

							<v-text-field
								v-model="search"
								label="Rechercher (composant, problème Tanaguru)"
								append-inner-icon="mdi-magnify"
								hide-details
								color="primary"
								class="mb-2"
								style="max-width: 350px; min-width: 350px"
								density="comfortable"
								variant="outlined"
							></v-text-field>
						</div>
					</div>

					<div class="component-grid mb-6">

						<v-row>
							<v-col
								v-for="item in paginatedItems"
								:key="item.component"
								cols="12"
								sm="12"
								md="6"
							>
								<v-card
									class="component-card"
									elevation="2"
									height="100%"
								>
									<v-card-item>
										<v-card-title
											:aria-label="'Composant : ' + item.component"
											:title="'Composant : ' + item.component"
											role="heading"
											aria-level="3"
											class="text-truncate"
											v-html="highlightMatch(item.component, search)"
										/>
									</v-card-item>

									<v-card-text>
										<v-chip
											:color="tanaguruCategories[item.tanaguruCategory].color"
											variant="flat"
											class="mb-2"
											:aria-label="'Catégorie Tanaguru : ' + tanaguruCategories[item.tanaguruCategory].label"
											:title="'Catégorie Tanaguru : ' + tanaguruCategories[item.tanaguruCategory].label"
										>
											{{ tanaguruCategories[item.tanaguruCategory].label }}
										</v-chip>

										<dl class="mt-1">
											<dt class="text-subtitle-3 font-weight-bold">Problème Tanaguru :</dt>
											<dd class="text-body-3 mb-3" v-html="highlightMatch(item.tanaguruIssue, search)"></dd>
											<dt class="text-subtitle-3 font-weight-bold">Explication :</dt>
											<dd class="text-body-3">{{ item.explanation }}</dd>
										</dl>
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

						<div class="d-flex pa-2 justify-space-between">
							<div class="text-caption">Total : {{ totalItems }} </div>
							<div class="text-caption text-right">
								Dernière mise à jour: 05/08/2025
							</div>
						</div>
					</div>
				</div>
			`,
		}
	},
	tags: ['!dev'],
}

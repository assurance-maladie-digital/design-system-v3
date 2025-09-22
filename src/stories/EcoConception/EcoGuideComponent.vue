<script setup lang="ts">
	import { ref, computed, watchEffect } from 'vue'
	import uxUiRules from './datas/ux_ui_rules.json'
	import { mdiChevronDown, mdiChevronUp, mdiMagnify, mdiRefresh } from '@mdi/js'
	// import backRules from './datas/back_rules.json'

	const mdiChevronDownIcon = mdiChevronDown
	const mdiChevronUpIcon = mdiChevronUp
	const mdiMagnifyIcon = mdiMagnify
	const mdiRefreshIcon = mdiRefresh

	interface EcoRule {
		numero: number
		theme?: string
		finalite3mots?: string
		criteres?: string
		actions?: string
		principes_directeurs?: string | null
		statuts?: string | null
		principe_finalite?: string
		evaluation_type?: string | null
		evaluation_description?: string | null
		precisions?: string | null
		page?: string | null
		tests?: string | null
	}

	interface ThemeOption {
		title: string
		value: string
		id: string
	}

	const categories = [
		{ value: 'ux-ui-dev', title: 'UX/UI/Front' },
		{ value: 'gestion-projet', title: 'Gestion de projet' },
		{ value: 'architecture', title: 'Architecture' },
		{ value: 'back', title: 'Backend' },
		{ value: 'environnement-run', title: 'Environnement/Run' },
	]

	const uxUiRulesData = ref(uxUiRules as EcoRule[])
	// const backRulesData = ref(backRules as EcoRule[])
	const DATA_SOURCES: Record<string, () => EcoRule[]> = {
		'ux-ui-dev': () => uxUiRulesData.value,
		// back: () => backRulesData.value,
	}

	const search = ref('')
	const selectedCategory = ref<'ux-ui-dev' | 'gestion-projet' | 'architecture' | 'back' | 'environnement-run'>('ux-ui-dev')
	const selectedTheme = ref<ThemeOption | null>(null)
	const showFilters = ref(true)

	const page = ref(1)
	const itemsPerPage = ref(6)

	const hasDataForCategory = computed(() => !!DATA_SOURCES[selectedCategory.value])

	const currentRules = computed<EcoRule[]>(() => (DATA_SOURCES[selectedCategory.value]?.() ?? []))

	const getAllThemes = () => {
		const allThemes = currentRules.value.map(rule => rule.theme).filter(Boolean)
		return allThemes
	}

	const normalizeString = (str: string): string => {
		return str
			.trim()
			.toLowerCase()
			.normalize('NFD') // Décomposer les caractères accentués
			.replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
			.replace(/\s+/g, ' ') // Normaliser les espaces multiples
	}

	const themes = computed(() => {
		const rawThemes = getAllThemes()
		const themeSet = new Map<string, ThemeOption>()

		for (const rawTheme of rawThemes) {
			if (!rawTheme) continue

			const displayTheme = rawTheme.trim()
			const normalizedId = normalizeString(displayTheme)

			if (!themeSet.has(normalizedId)) {
				themeSet.set(normalizedId, {
					title: displayTheme,
					value: displayTheme,
					id: normalizedId,
				})
			}
		}

		const themesArray = Array.from(themeSet.values()).sort((a, b) =>
			a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' }),
		)
		return themesArray
	})

	const filteredRules = computed(() => {
		if (!hasDataForCategory.value) return []

		const q = (search.value ?? '').trim().toLowerCase()
		const theme = selectedTheme.value

		return currentRules.value.filter((rule) => {
			// On compare en utilisant la même normalisation
			const themeOK = !theme || (rule.theme && theme.value
				&& normalizeString(rule.theme) === normalizeString(theme.value))
			if (!q) return themeOK

			const haystack = [
				rule.actions ?? '',
				rule.criteres ?? '',
				String(rule.numero ?? ''),
				rule.theme ?? '',
			].join(' ').toLowerCase()

			return themeOK && haystack.includes(q)
		})
	})

	const totalPages = computed(() => Math.max(1, Math.ceil(filteredRules.value.length / itemsPerPage.value)))

	const paginatedRules = computed(() => {
		const start = (page.value - 1) * itemsPerPage.value
		return filteredRules.value.slice(start, start + itemsPerPage.value)
	})

	watchEffect(() => {
		// Si changement de catégorie non implémentée => reset thème
		if (!hasDataForCategory.value) selectedTheme.value = null
		if ((page.value - 1) * itemsPerPage.value >= filteredRules.value.length && page.value !== 1) {
			page.value = 1
		}
	})

	const resetFilters = () => {
		search.value = ''
		selectedTheme.value = null
		page.value = 1
	}

	const detailDialog = ref(false)
	const selectedRule = ref<EcoRule | null>(null)
	const showRuleDetails = (rule: EcoRule) => {
		selectedRule.value = rule
		detailDialog.value = true
	}

	const BADGE_MAP: Array<[key: string, color: string]> = [
		['conception des parcours', '#3949AB'],
		['algorithmes', '#7B1FA2'],
		['code léger', '#2E7D32'],
		['dépendances', '#D84315'],
		['requêtes', '#0277BD'],
		['stockage', '#00695C'],
	]

	const getBadgeColor = (theme = '') => {
		const t = theme.toLowerCase()
		for (const [k, c] of BADGE_MAP) if (t.includes(k)) return c
		return '#607D8B'
	}

	const extractThemeNumber = (theme = '') => (theme.match(/^([\d.]+)\s/)?.[1] ?? '')

	const formatTestsWithBullets = (text?: string | null) => {
		if (!text) return ''
		const lines = text.split('\n')
		const items: string[] = []
		const paras: string[] = []
		for (const line of lines) {
			const trimmed = line.trim()
			if (!trimmed) continue
			if (trimmed.startsWith('•')) items.push(trimmed.slice(1).trim())
			else paras.push(trimmed)
		}
		const ul = items.length ? `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>` : ''
		const p = paras.length ? paras.map(x => `<p>${x}</p>`).join('') : ''
		return p + ul
	}
</script>

<template>
	<v-container fluid>
		<v-card
			flat
			class="mt-4"
		>
			<v-card-text class="d-flex justify-space-between align-center px-4 py-2">
				<h3 class="text-h6 text-primary">
					Filtres
				</h3>
				<v-btn
					variant="text"
					:aria-label="showFilters ? 'Masquer les filtres' : 'Afficher les filtres'"
					:icon="showFilters ? mdiChevronUpIcon : mdiChevronDownIcon"
					@click="showFilters = !showFilters"
				/>
			</v-card-text>

			<v-expand-transition>
				<div v-show="showFilters">
					<v-card-text class="pa-2">
						<v-row class="mb-1">
							<v-col
								cols="12"
								md="6"
							>
								<v-select
									v-model="selectedCategory"
									:items="categories"
									label="Catégorie"
									variant="outlined"
									density="comfortable"
									hide-details
									item-title="title"
									item-value="value"
									color="primary"
								/>
							</v-col>
							<v-col
								cols="12"
								md="6"
							>
								<v-select
									v-model="selectedTheme"
									:items="themes"
									label="Sélectionnez un thème"
									return-object
									variant="outlined"
									density="comfortable"
									hide-details
									clearable
									color="primary"
									:disabled="!hasDataForCategory"
									placeholder="Sélectionnez un thème"
								/>
							</v-col>
						</v-row>

						<v-row class="mb-1">
							<v-col
								cols="12"
							>
								<v-text-field
									v-model="search"
									label="Rechercher"
									variant="outlined"
									density="comfortable"
									hide-details
									:prepend-inner-icon="mdiMagnifyIcon"
									clearable
									color="primary"
									placeholder="Rechercher par critères, actions ou numéro de règle ou de thème"
									:disabled="!hasDataForCategory"
								/>
							</v-col>
						</v-row>

						<v-row>
							<v-col
								cols="12"
								class="d-flex justify-end"
							>
								<v-btn
									:prepend-icon="mdiRefreshIcon"
									variant="text"
									color="primary"
									@click="resetFilters"
								>
									Réinitialiser
								</v-btn>
							</v-col>
						</v-row>
					</v-card-text>
				</div>
			</v-expand-transition>

			<v-divider />

			<v-row
				v-if="!hasDataForCategory"
				class="pa-4"
			>
				<v-col
					cols="12"
					md="6"
				>
					<v-alert
						type="info"
						title="Contenu à venir"
						text="Les règles d'éco-conception pour cette catégorie seront disponibles prochainement."
						color="info"
						variant="tonal"
						class="mb-4"
					/>
				</v-col>
			</v-row>

			<v-row
				v-else
				class="pa-4"
			>
				<v-col
					v-if="filteredRules.length === 0"
					cols="12"
				>
					<v-alert
						type="info"
						title="Aucun résultat"
						text="Aucune règle ne correspond à vos critères de recherche."
						color="info"
						variant="tonal"
					/>
				</v-col>

				<template v-else>
					<v-col
						v-for="rule in paginatedRules"
						:key="rule.numero"
						cols="12"
						sm="6"
						md="6"
					>
						<v-card
							height="100%"
							class="d-flex flex-column"
							elevation="2"
						>
							<v-card-title class="text-subtitle-1 text-primary font-weight-bold title-multiline">
								<v-chip
									:color="getBadgeColor(rule.theme)"
									size="small"
									class="mr-2"
								>
									{{ extractThemeNumber(rule.theme) }}
								</v-chip>
								<span class="card-text-wrap">{{ rule.criteres }}</span>
							</v-card-title>

							<v-card-text class="flex-grow-1">
								<p class="text-body-1">
									{{ rule.actions }}
								</p>
							</v-card-text>

							<v-card-actions>
								<v-spacer />
								<v-btn
									variant="text"
									color="primary"
									@click="showRuleDetails(rule)"
								>
									Détails
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-col>
				</template>

				<v-col
					v-if="filteredRules.length > itemsPerPage"
					cols="12"
					class="d-flex justify-center mt-4"
				>
					<v-pagination
						v-model="page"
						:length="totalPages"
						total-visible="7"
						rounded
						color="primary"
					/>
				</v-col>
			</v-row>
		</v-card>

		<v-dialog
			v-model="detailDialog"
			max-width="800px"
		>
			<v-card
				v-if="selectedRule"
				class="detail-card"
				elevation="3"
			>
				<v-card-item>
					<div class="d-flex justify-space-between mb-2">
						<h3>
							{{ selectedRule.finalite3mots }}
						</h3>
						<v-chip
							:color="getBadgeColor(selectedRule.theme)"
							size="small"
						>
							Regle:	{{ selectedRule.numero }}
						</v-chip>
					</div>

					<!-- <h3 class="text-h6 mb-4 mt-4">
						{{ selectedRule.actions || selectedRule.criteres || ('Règle ' + selectedRule.numero) }}
						</h3> -->

					<div class="detail-section">
						<div
							v-if="selectedRule.theme"
							class="detail-item"
						>
							<div class="detail-label">
								Thème
							</div>
							<div class="detail-content">
								{{ selectedRule.theme }}
							</div>
						</div>

						<div
							v-if="selectedRule.criteres"
							class="detail-item"
						>
							<div class="detail-label">
								Critères
							</div>
							<div class="detail-content">
								{{ selectedRule.criteres }}
							</div>
						</div>

						<div
							v-if="selectedRule.actions"
							class="detail-item"
						>
							<div class="detail-label">
								Attendu
							</div>
							<div class="detail-content">
								{{ selectedRule.actions }}
							</div>
						</div>
						<div
							v-if="selectedRule.precisions"
							class="detail-item"
						>
							<div class="detail-label">
								Exemple de mise en œuvre
							</div>
							<div class="detail-content">
								{{ selectedRule.precisions }}
							</div>
						</div>

						<div
							v-if="selectedRule.tests"
							class="detail-item"
						>
							<div class="detail-label">
								Moyen de test ou de contrôle
							</div>
							<div class="detail-content">
								<div
									class="formatted-tests"
									v-html="formatTestsWithBullets(selectedRule.tests)"
								/>
							</div>
						</div>
						<div
							v-if="selectedRule.principes_directeurs"
							class="detail-item"
						>
							<div class="detail-label">
								Principes directeurs
							</div>
							<div class="detail-content">
								{{ selectedRule.principes_directeurs }}
							</div>
						</div>

						<div
							v-if="selectedRule.principe_finalite"
							class="detail-item"
						>
							<div class="detail-label">
								Principe de finalité
							</div>
							<div class="detail-content">
								{{ selectedRule.principe_finalite }}
							</div>
						</div>
					</div>
				</v-card-item>

				<v-card-actions class="pa-4">
					<v-spacer />
					<v-btn
						variant="outlined"
						color="primary"
						@click="detailDialog = false"
					>
						Fermer
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<style lang="scss" scoped>
.detail-section {
	margin-top: 16px;
	display: flex;
	flex-direction: column;
	gap: 20px;
}

.detail-item {
	margin-bottom: 16px;
	border-bottom: 1px solid rgb(0 0 0 / 8%);
	padding-bottom: 16px;
}

.detail-label {
	font-weight: 600;
	color: #0c419a;
	margin-bottom: 8px;
}

.detail-content {
	white-space: pre-wrap;
	line-height: 1.5;
}

.formatted-tests {
	display: block;
	padding-left: 20px;
}

.formatted-tests li {
	display: list-item;
	margin-bottom: 8px;
	list-style-type: disc;
}

.v-card {
	transition: transform 0.3s;
}

.detail-card {
	padding: 24px;
}

.title-multiline {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.title-multiline .v-chip {
	margin-bottom: 8px;
}

.card-text-wrap {
	white-space: normal;
	word-wrap: break-word;
	overflow-wrap: break-word;
	display: block;
	width: 100%;
}
</style>

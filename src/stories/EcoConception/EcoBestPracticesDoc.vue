<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
	import { mdiArrowRight, mdiMagnify } from '@mdi/js'
	import iconsStatus from './icons_status.png'
	import iconsStatus2 from './icons_status2.png'
	import bestPracticesData from './datas/bonnes_pratiques_essentielles.json'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
	import SyCheckBoxGroup from '@/components/Customs/SyCheckBoxGroup/SyCheckBoxGroup.vue'
	import SyPagination from '@/components/Customs/SyPagination/SyPagination.vue'

	type Audience =
		| 'UX / UI'
		| 'Dev Front'
		| 'Dev Back'
		| 'Stratégie'
		| 'Cadrage / Architecture'
		| 'Run / Maintenance'
	type PracticeLevel = 'level1' | 'level2'

	type PlaceholderLevel = 'level1' | 'level2'

	interface PlaceholderCard {
		level: PlaceholderLevel
		label: string
		text: string
		image: string
	}
	interface Pillar {
		id: string
		title: string
		icon: string
	}

	interface PracticeTable {
		title: string
		headers: string[]
		rows: string[][]
	}

	interface PracticeImpact {
		label: string
		before: string
		after: string
		gain: string
	}

	interface PracticeItem {
		id: string
		title: string
		audience: Audience
		pillar: Pillar
		summary: string
		objective?: string
		actionNumbers: number[]
		do: string[]
		dont: string[]
		control: string[]
		tables?: PracticeTable[]
		impacts?: PracticeImpact[]
		priority?: string
		difficulty?: string
		essential?: boolean
		sourcePages?: number[]
		page?: string
		references?: string[]
	}

	// Pagination
	const currentPage = ref(1)
	const itemsPerPage = 8

	const audiencesWithoutPractices: Audience[] = [
		'Dev Back',
		'Stratégie',
		'Cadrage / Architecture',
		'Run / Maintenance',
	]
	const pageCount = computed(() => {
		return Math.ceil(filteredPractices.value.length / itemsPerPage)
	})

	const paginatedPractices = computed(() => {
		const start = (currentPage.value - 1) * itemsPerPage
		const end = start + itemsPerPage

		return filteredPractices.value.slice(start, end)
	})
	const practices = bestPracticesData as PracticeItem[]
	const selectedLevels = ref<PracticeLevel[]>([])
	const selectedAudiences = ref<Audience[] | null>([])
	const selectedPracticeId = ref('')
	const search = ref<string | null>('')
	const detailDialog = ref(false)
	const mdiArrowRightIcon = mdiArrowRight

	const mdiMagnifyIcon = mdiMagnify
	const hasActiveFilters = computed(() => {
		const audiences = selectedAudiences.value ?? []

		return selectedLevels.value.length > 0
			|| audiences.length > 0
			|| Boolean((search.value ?? '').trim())
	})
	const normalizeText = (value = '') => value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')

	const audienceOptions = [
		{
			text: 'UX / UI',
			value: 'UX / UI',
		},
		{
			text: 'Dev Front',
			value: 'Dev Front',
		},
		{
			text: 'Dev Back',
			value: 'Dev Back',
		},
		{
			text: 'Stratégie',
			value: 'Stratégie',
		},
		{
			text: 'Cadrage / Architecture',
			value: 'Cadrage / Architecture',
		},
		{
			text: 'Run / Maintenance',
			value: 'Run / Maintenance',
		},
	] satisfies Array<{
		text: Audience
		value: Audience
	}>

	const levelOptions = [
		{
			id: 'level-1',
			label: 'Niveau #1 Pratiques essentielles',
			value: 'level1',
		},
		{
			id: 'level-2',
			label: 'Niveau #2 Pratiques avancées',
			value: 'level2',
		},
	]
	const audienceOrder: Record<Audience, number> = {
		'UX / UI': 1,
		'Dev Front': 2,
		'Dev Back': 3,
		'Stratégie': 4,
		'Cadrage / Architecture': 5,
		'Run / Maintenance': 6,
	}

	const filteredPractices = computed(() => {
		if (!hasActiveFilters.value) {
			return []
		}

		const query = normalizeText((search.value ?? '').trim())
		const audiences = selectedAudiences.value ?? []

		return practices
			.filter((practice) => {
				const audienceOk = audiences.length === 0
					|| audiences.includes(practice.audience)

				const levelOk = selectedLevels.value.length === 0
					|| (
						selectedLevels.value.includes('level1')
						&& practice.essential === true
					)
					|| (
						selectedLevels.value.includes('level2')
						&& practice.essential !== true
					)

				const searchableContent = normalizeText([
					practice.title,
					practice.summary,
					practice.objective,
					practice.pillar?.title,
					practice.audience,
					practice.priority,
					practice.difficulty,
					practice.actionNumbers?.join(' '),
					practice.do?.join(' '),
					practice.dont?.join(' '),
					practice.control?.join(' '),
				]
					.filter(Boolean)
					.join(' '))

				const searchOk = !query
					|| searchableContent.includes(query)

				return audienceOk && levelOk && searchOk
			})
			.sort((a, b) => {
				// 1. Tri par niveau
				const levelA = a.essential === true ? 1 : 2
				const levelB = b.essential === true ? 1 : 2

				if (levelA !== levelB) {
					return levelA - levelB
				}

				// 2. Tri par métier
				const audienceA = audienceOrder[a.audience] ?? 99
				const audienceB = audienceOrder[b.audience] ?? 99

				if (audienceA !== audienceB) {
					return audienceA - audienceB
				}

				// 3. Tri alphabétique par titre
				return a.title.localeCompare(b.title, 'fr', {
					sensitivity: 'base',
				})
			})
	})

	const hasOnlyAudiencesWithoutPractices = computed(() => {
		const audiences = selectedAudiences.value ?? []

		return audiences.length > 0
			&& audiences.every(audience =>
				audiencesWithoutPractices.includes(audience),
			)
	})

	const placeholderCards = computed<PlaceholderCard[]>(() => {
		if (!hasOnlyAudiencesWithoutPractices.value) {
			return []
		}

		const cards: PlaceholderCard[] = []

		if (selectedLevels.value.includes('level1')) {
			cards.push({
				level: 'level1',
				label: 'Niveau #1',
				image: iconsStatus,
				text: 'Les pratiques essentielles sont en cours d’élaboration. Elles seront disponibles ultérieurement.',
			})
		}

		if (selectedLevels.value.includes('level2')) {
			cards.push({
				level: 'level2',
				label: 'Niveau #2',
				image: iconsStatus2,
				text: 'Les pratiques avancées sont disponibles dans le référentiel CNAM d’écoconception numérique. Pour le consulter, merci de contacter ',
				email: 'studio-design.cnam@assurance-maladie.fr',
			})
		}

		return cards
	})

	const displayedResultsCount = computed(() => {
		return filteredPractices.value.length + placeholderCards.value.length
	})

	const hasNoDisplayedResult = computed(() => {
		return filteredPractices.value.length === 0
			&& placeholderCards.value.length === 0
	})

	const selectedPractice = computed<PracticeItem | null>(() => {
		if (!selectedPracticeId.value) {
			return null
		}

		return practices.find(
			practice => practice.id === selectedPracticeId.value,
		) ?? null
	})

	const openPracticeDetails = (practice: PracticeItem) => {
		selectedPracticeId.value = practice.id
		detailDialog.value = true
	}

	const closePracticeDetails = () => {
		detailDialog.value = false
		selectedPracticeId.value = ''
	}

	const getLevelLabel = (practice: PracticeItem) => {
		return practice.essential ? 'Niveau #1' : 'Niveau #2'
	}

	const getLevelClass = (practice: PracticeItem) => {
		return practice.essential
			? 'practice-level--essential'
			: 'practice-level--advanced'
	}

	const getAudienceClass = (audience: Audience) => {
		switch (audience) {
		case 'UX / UI':
			return 'practice-audience--ux'

		case 'Dev Front':
			return 'practice-audience--front'

		case 'Dev Back':
			return 'practice-audience--back'

		case 'Stratégie':
			return 'practice-audience--strategy'

		case 'Cadrage / Architecture':
			return 'practice-audience--architecture'

		case 'Run / Maintenance':
			return 'practice-audience--run'

		default:
			return 'practice-audience--front'
		}
	}

	const getAudienceLabel = (audience: Audience) => audience

	watch(
		[selectedAudiences, selectedLevels, search],
		() => {
			currentPage.value = 1

			if (
				selectedPracticeId.value
				&& !filteredPractices.value.some(
					practice => practice.id === selectedPracticeId.value,
				)
			) {
				closePracticeDetails()
			}
		},
		{ deep: true },
	)

	watch(selectedAudiences, (value) => {
		if (value === null) {
			selectedAudiences.value = []
		}
	})
</script>

<template>
	<VContainer
		fluid
	>
		<header class="practices-header">
			<p class="practices-intro">
				Ces bonnes pratiques d’écoconception sont classées par métier et par
				niveau d’exigence d’écoconception.
			</p>

			<div class="practices-level">
				<p>
					<strong>Le niveau #1</strong> désigne les bonnes pratiques essentielles
					parmi les bonnes pratiques du référentiel CNAM d’écoconception numérique.
				</p>

				<p>
					Ces bonnes pratiques ont été choisies de façon collective en fonction
					des critères suivants :
				</p>

				<ul>
					<li>Facilité à mettre en œuvre</li>
					<li>Mise en pratique non coûteuse</li>
					<li>Pertinence par rapport aux projets numériques de la CNAM</li>
				</ul>
			</div>

			<p class="practices-level practices-level--last">
				<strong>Le niveau #2</strong> désigne les bonnes pratiques avancées parmi
				les bonnes pratiques du référentiel CNAM d’écoconception numérique.
			</p>
		</header>
		<section class="filters-section">
			<h2 class="filters-title">
				Filtres
			</h2>

			<div class="filters-main-row">
				<VTextField
					v-model="search"
					label="Rechercher"
					placeholder="Rechercher"
					variant="outlined"
					density="comfortable"
					hide-details
					clearable
					color="primary"
					:prepend-inner-icon="mdiMagnifyIcon"
				/>

				<SyAutocomplete
					v-model="selectedAudiences"
					:items="audienceOptions"
					label="Métier"
					placeholder="Métier"
					multiple
					chips
					clearable
					hide-details
					density="comfortable"
					disable-error-handling
				/>
			</div>
			<div class="filters-footer">
				<SyCheckBoxGroup
					v-model="selectedLevels"
					:options="levelOptions"
					multiple
					color="primary"
					density="compact"
					:hide-details="true"
					aria-label="Filtrer les bonnes pratiques par niveau"
					class="level-checkboxes"
				/>

				<div
					v-if="hasActiveFilters"
					class="results-header"
				>
					<p>
						<strong>{{ displayedResultsCount }}</strong>
						{{ displayedResultsCount > 1 ? 'résultats' : 'résultat' }}
					</p>
				</div>
			</div>
		</section>

		<VCard
			v-if="!hasActiveFilters"
			class="empty-state"
		>
			<VCardText class="empty-state__content">
				<img
					src="./box.png"
					alt=""
					class="ci-empty-state-image mb-4"
				>
				<p>
					Veuillez choisir au minimum un niveau de pratiques
					pour afficher un résultat.
				</p>
			</VCardText>
		</VCard>

		<VCard
			v-else-if="
				hasOnlyAudiencesWithoutPractices
					&& selectedLevels.length === 0
					&& filteredPractices.length === 0
			"
			class="empty-state"
		>
			<VCardText class="empty-state__content">
				<img
					src="./box.png"
					alt=""
					class="ci-empty-state-image mb-4"
				>

				<p>
					Veuillez choisir au minimum un niveau de pratiques
					pour afficher un résultat.
				</p>
			</VCardText>
		</VCard>

		<VAlert
			v-else-if="hasNoDisplayedResult"
			type="info"
			variant="tonal"
			class="mb-6"
		>
			Aucune bonne pratique ne correspond aux filtres sélectionnés.
		</VAlert>

		<template v-else>
			<VRow
				v-if="placeholderCards.length > 0"
				class="placeholder-cards"
			>
				<VCol
					v-for="card in placeholderCards"
					:key="card.level"
					cols="12"
					sm="6"
					md="6"
				>
					<VCard class="placeholder-card">
						<VCardText class="placeholder-card__body">
							<span
								class="practice-chip"
								:class="card.level === 'level1'
									? 'practice-level--essential'
									: 'practice-level--advanced'"
							>
								{{ card.label }}
							</span>

							<img
								:src="card.image"
								alt=""
								aria-hidden="true"
								class="placeholder-card__image"
							>

							<p>
								{{ card.text }}
								<a
									v-if="card.email"
									href="mailto:studio-design.cnam@assurance-maladie.fr?subject=Demande%20de%20référentiel%20d%27écoconception"
								>
									{{ card.email }}
								</a>
							</p>
						</VCardText>
					</VCard>
				</VCol>
			</VRow>

			<VRow
				v-if="paginatedPractices.length > 0"
				id="practices-list"
			>
				<VCol
					v-for="practice in paginatedPractices"
					:key="practice.id"
					cols="12"
					sm="6"
					md="6"
				>
					<VCard
						height="100%"
						class="practice-card"
					>
						<VCardText class="practice-card__body">
							<div class="practice-card__badges">
								<span
									class="practice-chip"
									:class="practice.essential
										? 'practice-level--essential'
										: 'practice-level--advanced'"
								>
									{{ practice.essential ? 'Niveau #1' : 'Niveau #2' }}
								</span>

								<span
									class="practice-chip"
									:class="getAudienceClass(practice.audience)"
								>
									{{ getAudienceLabel(practice.audience) }}
								</span>
							</div>

							<div class="practice-card__title">
								<h3>
									{{ practice.title }}
								</h3>
							</div>

							<p class="practice-card__description">
								{{ practice.summary }}
							</p>
						</VCardText>

						<VCardActions class="practice-card__actions">
							<VSpacer />

							<VBtn
								variant="text"
								color="primary"
								:append-icon="mdiArrowRightIcon"
								@click="openPracticeDetails(practice)"
							>
								Lire
							</VBtn>
						</VCardActions>
					</VCard>
				</VCol>
			</VRow>

			<SyPagination
				v-if="pageCount > 1"
				v-model="currentPage"
				:pages="pageCount"
				:visible="5"
				label="Pagination des bonnes pratiques"
				aria-controls="practices-list"
			/>
		</template>

		<VDialog
			v-model="detailDialog"
			max-width="1180"
			scrollable
		>
			<VCard
				v-if="selectedPractice"
				class="detail-card"
			>
				<VCardItem>
					<div class="detail-header">
						<div>
							<p class="detail-eyebrow">
								{{ selectedPractice.pillar.title }}
							</p>

							<SyHeading :level="3">
								{{ selectedPractice.title }}
							</SyHeading>
						</div>

						<div class="detail-badges">
							<span
								class="practice-level"
								:class="getLevelClass(selectedPractice)"
							>
								{{ getLevelLabel(selectedPractice) }}
							</span>

							<span
								class="practice-audience"
								:class="getAudienceClass(selectedPractice.audience)"
							>
								{{ getAudienceLabel(selectedPractice.audience) }}
							</span>
						</div>
					</div>

					<div class="detail-objective">
						<h4>Objectif</h4>

						<p>
							{{ selectedPractice.objective || selectedPractice.summary }}
						</p>
					</div>

					<VRow>
						<VCol
							cols="12"
							md="6"
						>
							<section class="detail-section detail-section--do">
								<h4>À faire</h4>

								<ul>
									<li
										v-for="item in selectedPractice.do"
										:key="item"
									>
										{{ item }}
									</li>
								</ul>
							</section>
						</VCol>

						<VCol
							cols="12"
							md="6"
						>
							<section class="detail-section detail-section--dont">
								<h4>À éviter</h4>

								<ul>
									<li
										v-for="item in selectedPractice.dont"
										:key="item"
									>
										{{ item }}
									</li>
								</ul>
							</section>
						</VCol>
					</VRow>

					<div
						v-if="selectedPractice.tables?.length"
						class="detail-table-section"
					>
						<section
							v-for="table in selectedPractice.tables"
							:key="table.title"
							class="detail-table-card"
						>
							<h4>
								{{ table.title }}
							</h4>

							<div class="detail-table-wrapper">
								<table class="detail-table">
									<thead>
										<tr>
											<th
												v-for="header in table.headers"
												:key="header"
											>
												{{ header }}
											</th>
										</tr>
									</thead>

									<tbody>
										<tr
											v-for="(row, rowIndex) in table.rows"
											:key="rowIndex"
										>
											<td
												v-for="(cell, cellIndex) in row"
												:key="`${rowIndex}-${cellIndex}`"
											>
												{{ cell }}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</section>
					</div>

					<VRow>
						<VCol
							v-if="selectedPractice.control?.length"
							cols="12"
							md="6"
						>
							<section class="detail-section detail-section--control">
								<h4>Moyens de contrôle</h4>

								<ul>
									<li
										v-for="item in selectedPractice.control"
										:key="item"
									>
										{{ item }}
									</li>
								</ul>
							</section>
						</VCol>

						<VCol
							v-if="selectedPractice.impacts?.length"
							cols="12"
							md="6"
						>
							<section class="detail-section detail-section--impact">
								<h4>Impacts attendus</h4>

								<ul class="impact-list">
									<li
										v-for="impact in selectedPractice.impacts"
										:key="impact.label"
									>
										<strong>
											{{ impact.label }}
										</strong>

										<p>{{ impact.before }}</p>
										<p>{{ impact.after }}</p>

										<p class="impact-gain">
											{{ impact.gain }}
										</p>
									</li>
								</ul>
							</section>
						</VCol>
					</VRow>
				</VCardItem>

				<VCardActions class="detail-actions">
					<VSpacer />

					<VBtn
						variant="outlined"
						color="primary"
						@click="closePracticeDetails"
					>
						Fermer
					</VBtn>
				</VCardActions>
			</VCard>
		</VDialog>
	</VContainer>
</template>

<style scoped>
.filters-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
	margin-top: 14px;
}

.level-checkboxes {
	flex: 1;
	margin: 0;
}

.level-checkboxes :deep(.sy-checkbox-group__options) {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 32px;
}

.results-header {
	display: flex;
	align-items: center;
	gap: 4px;
	flex-shrink: 0;
	margin: 0;
	color: var(--eco-text);
	font-size: 16px;
	line-height: 1;
}

.results-header p {
	margin: 0;
}

.practice-audience--ux,
.practice-audience--front,
.practice-audience--back,
.practice-audience--strategy,
.practice-audience--architecture,
.practice-audience--run {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 2px 10px;
	border: 1px solid;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 600;
	line-height: 1.3;
}

.practice-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: 32px;
	padding: 0 12px;
	border: 1px solid;
	border-radius: 100px;
	font-size: 12px;
	font-weight: 600;
	line-height: 1;
	white-space: nowrap;
	box-sizing: border-box;
}

.practice-audience--ux {
	min-height: 32px;
	padding: 4px 8px;
	gap: 4px;
	background: #f9d1e6;
	border-color: #b41567;
	border-radius: 100px;
	color: #b41567;
}

.practice-audience--front {
	background: #ecdef0;
	border-color: #804992;
	color: #804992;
}

.practice-audience--back {
	background: #e8f5e9;
	border-color: #66bb6a;
	color: #2e7d32;
}

.practice-audience--strategy {
	background: #e3f2fd;
	border-color: #42a5f5;
	color: #1565c0;
}

.practice-audience--architecture {
	background: #f3e5f5;
	border-color: #ab47bc;
	color: #6a1b9a;
}

.practice-audience--run {
	background: #eceff1;
	border-color: #90a4ae;
	color: #455a64;
}

.level-description {
	max-width: 1100px;
	margin: 8px 0;
	font-size: 16px;
	line-height: 1.6;
}

.level-description strong {
	color: rgb(var(--v-theme-primary));
}

.statistics-grid {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 16px;
	margin-bottom: 40px;
}

.statistic-card {
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 20px;
	background: #fff;
	border: 1px solid var(--eco-border);
	border-radius: 8px;
	box-shadow: 0 4px 12px rgb(12 65 154 / 5%);
}

.statistic-card strong {
	color: rgb(var(--v-theme-primary));
	font-size: 28px;
	line-height: 1;
}

.statistic-card span {
	color: var(--eco-muted);
	font-size: 14px;
}

.filters-section {
	margin-bottom: 32px;
	padding: 0;
	background: transparent;
	border: 0;
}

.filters-main-row {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
}

.practice-card {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: #fff;
	border: 1px solid #d9e1ef !important;
	border-radius: 8px !important;
	box-shadow: none !important;
	overflow: hidden;
}

.practice-card__body {
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: 16px;
}

.practice-card__badges {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.practice-level--essential {
	background: #e8f7ed;
	border-color: #75c58e;
	color: #176b35;
}

.practice-level--advanced {
	background: #eef3fb;
	border-color: #91acd6;
	color: #214f92;
}

.practice-card h3 {
	color: rgb(var(--v-theme-primary));
	font-size: 20px;
	font-weight: 800;
	line-height: 1.35;
	margin: 0;
}

.practice-card__title {
	min-height: 54px;
	display: flex;
	align-items: flex-start;
}

.practice-card__title h3 {
	margin: 0;
	color: rgb(var(--v-theme-primary));
	font-size: 20px;
	font-weight: 800;
	line-height: 1.35;
}

.practice-card__description {
	color: rgb(var(--v-theme-text));
	flex: 1;
	margin: 0;
	font-size: 16px;
	line-height: 1.5;
}

.practice-card__body > p {
	flex-grow: 1;
	margin-bottom: 20px;
	font-size: 16px;
	line-height: 1.55;
}

.practice-card__metadata {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.metadata-badge {
	display: inline-flex;
	padding: 4px 8px;
	border-radius: 4px;
	background: #f2f5fa;
	color: #44546b;
	font-size: 12px;
	font-weight: 600;
}

.metadata-badge--haute {
	background: #fde8e8;
	color: #991b1b;
}

.metadata-badge--moyenne {
	background: #fef3c7;
	color: #92400e;
}

.metadata-badge--faible {
	background: #ecfdf5;
	color: #166534;
}

.metadata-badge--difficulty {
	background: #edf3fc;
	color: #214f92;
}

.practice-card__actions {
	display: flex;
	justify-content: flex-end;
	margin-top: auto;
}

.detail-card {
	padding: 24px;
	border-radius: 8px;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	gap: 24px;
	margin-bottom: 24px;
}

.detail-header :deep(h3) {
	color: rgb(var(--v-theme-primary));
	font-size: 28px;
	line-height: 1.3;
}

.detail-eyebrow {
	margin-bottom: 6px;
	color: var(--eco-muted);
	font-size: 14px;
	font-weight: 600;
}

.detail-badges {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.detail-objective {
	margin-bottom: 24px;
	padding: 20px;
	background: #edf3fc;
	border-left: 4px solid rgb(var(--v-theme-primary));
	border-radius: 4px;
}

.detail-objective h4 {
	margin-bottom: 8px;
	color: rgb(var(--v-theme-primary));
	font-size: 18px;
	font-weight: 800;
}

.detail-objective p {
	margin: 0;
	line-height: 1.6;
}

.detail-section,
.detail-table-card {
	padding: 20px;
	border: 1px solid rgb(0 0 0 / 8%);
	border-radius: 8px;
}

.detail-section h4,
.detail-table-card h4 {
	margin-bottom: 16px;
	color: rgb(var(--v-theme-primary));
	font-size: 18px;
	font-weight: 800;
}

.detail-section ul {
	padding-left: 22px;
}

.detail-section li {
	margin-bottom: 10px;
	line-height: 1.5;
}

.detail-section--do {
	background: #f0fbf5;
}

.detail-section--dont {
	background: #fff3f4;
}

.detail-section--control {
	background: #f1f7ff;
}

.detail-section--impact {
	background: #fff8e7;
}

.detail-table-section {
	display: grid;
	gap: 16px;
	margin: 24px 0;
}

.detail-table-wrapper {
	width: 100%;
	overflow-x: auto;
}

.detail-table {
	width: 100%;
	min-width: 640px;
	border-collapse: collapse;
}

.detail-table th,
.detail-table td {
	padding: 12px;
	border: 1px solid var(--eco-border);
	text-align: left;
	vertical-align: top;
}

.detail-table th {
	background: #f5f7fb;
	color: rgb(var(--v-theme-primary));
	font-weight: 700;
}

.impact-list {
	list-style: none;
	padding-left: 0 !important;
}

.impact-list li {
	margin-bottom: 16px;
}

.impact-list p {
	margin: 4px 0;
}

.impact-gain {
	color: #0f8f4f;
	font-weight: 700;
}

.detail-actions {
	padding: 16px 24px 24px;
}

.empty-state {
	margin-top: 32px;
	background: #fff;
	border: 1px solid #d9e1ef;
	border-radius: 8px;
}

.empty-state__content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	min-height: 220px;
	padding: 32px;
	text-align: center;
}

.empty-state__image {
	width: 174px;
	height: 100px;
	margin-bottom: 24px;
	object-fit: contain;
}

.empty-state__content p {
	margin: 0;
	color: var(--eco-text);
	font-size: 16px;
	line-height: 1.5;
}

.eco-practices-page {
	max-width: 1440px;
	margin: 0 auto;
	padding: 48px;
}

.practices-header {
	margin-bottom: 40px;
}

.practices-header :deep(h1) {
	margin: 0 0 24px;
	color: rgb(var(--v-theme-primary));
	font-size: 40px;
	font-weight: 800;
	line-height: 1.2;
}

.practices-intro {
	margin: 0 0 28px;
	font-size: 16px;
	line-height: 1.6;
	color: rgb(var(--v-theme-on-surface));
}

.practices-level {
	max-width: 1120px;
	margin-bottom: 24px;
	font-size: 16px;
	line-height: 1.6;
	color: rgb(var(--v-theme-on-surface));
}

.practices-level p {
	margin: 0 0 4px;
}

.practices-level strong {
	font-weight: 700;
}

.practices-level ul {
	margin: 4px 0 0;
	padding-left: 24px;
}

.practices-level li {
	margin: 2px 0;
}

.practices-level--last {
	margin-bottom: 0;
}

.filters-title {
	margin: 0 0 24px;
	color: rgb(var(--v-theme-primary));
	font-size: 24px;
	font-weight: 800;
	line-height: 1.3;
}

.placeholder-cards {
	margin-bottom: 24px;
}

.placeholder-card {
	height: 100%;
	min-height: 248px;
	background: #fff;
	border: 1px solid #d9e1ef !important;
	border-radius: 8px !important;
	box-shadow: none !important;
}

.placeholder-card__body {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	height: 100%;
	padding: 24px;
}

.placeholder-card__image {
	align-self: center;
	width: 150px;
	height: 100px;
	margin: 8px 0 20px;
	object-fit: contain;
}

.placeholder-card p {
	align-self: center;
	max-width: 460px;
	margin: auto 0 0;
	text-align: center;
	font-size: 16px;
	line-height: 1.5;
}

@media (width <= 700px) {
	.eco-practices-page {
		padding: 24px 16px;
	}

	.practices-header {
		margin-bottom: 32px;
	}

	.practices-header :deep(h1) {
		font-size: 32px;
	}

	.practices-level,
	.practices-intro {
		font-size: 15px;
	}
}

@media (width <= 1100px) {
	.statistics-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (width <= 700px) {
	.eco-practices-page {
		padding: 24px 16px;
	}

	.page-header :deep(h1) {
		font-size: 32px;
	}

	.statistics-grid,
	.filters-main-row {
		grid-template-columns: 1fr;
	}

	.level-checkboxes :deep(.sy-checkbox-group__options) {
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
	}

	.detail-header,
	.practice-card__badges {
		flex-direction: column;
		align-items: flex-start;
	}

	.filters-footer {
		align-items: flex-start;
		flex-direction: column;
		gap: 12px;
	}

	.results-header {
		align-self: flex-end;
	}
}
</style>

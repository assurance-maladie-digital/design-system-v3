<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
	import bestPracticesData from './datas/bonnes_pratiques_essentielles.json'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'
	import { mdiMagnify, mdiRefresh } from '@mdi/js'

	type Audience = 'UX / UI' | 'Dev Front' | 'Back'
	type AudienceFilter = 'all' | Audience
	type PracticeFilter = 'all' | 'priority' | 'essential'

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

	const practices = bestPracticesData as PracticeItem[]

	const selectedPillarId = ref<string>('all')
	const selectedPracticeId = ref('')
	const selectedAudience = ref<AudienceFilter>('all')
	const selectedFilter = ref<PracticeFilter>('all')
	const selectedPriority = ref<string>('all')
	const selectedDifficulty = ref<string>('all')
	const search = ref<string | null>('')
	const detailDialog = ref(false)

	const mdiMagnifyIcon = mdiMagnify
	const mdiRefreshIcon = mdiRefresh

	const pillars = computed<Pillar[]>(() => {
		const uniquePillars = new Map<string, Pillar>()

		for (const practice of practices) {
			if (!uniquePillars.has(practice.pillar.id)) {
				uniquePillars.set(practice.pillar.id, practice.pillar)
			}
		}

		return Array.from(uniquePillars.values())
	})

	const normalizeText = (value = '') => value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')

	const priorityOrder: Record<string, number> = {
		Haute: 1,
		Moyenne: 2,
		Faible: 3,
	}

	const filteredPractices = computed(() => (
		practices
			.filter((practice) => {
				const pillarOk = selectedPillarId.value === 'all'
					|| practice.pillar.id === selectedPillarId.value

				const audienceOk = selectedAudience.value === 'all'
					|| practice.audience === selectedAudience.value

				const priorityOk = selectedPriority.value === 'all'
					|| practice.priority === selectedPriority.value

				const difficultyOk = selectedDifficulty.value === 'all'
					|| practice.difficulty === selectedDifficulty.value

				const query = normalizeText((search.value ?? '').trim())
				const searchableContent = normalizeText([
					practice.title,
					practice.summary,
					practice.objective,
					practice.pillar.title,
					practice.audience,
					practice.priority,
					practice.difficulty,
					practice.actionNumbers?.join(' '),
					practice.do?.join(' '),
					practice.dont?.join(' '),
				].filter(Boolean).join(' '))

				const searchOk = !query || searchableContent.includes(query)

				return pillarOk
					&& audienceOk
					&& priorityOk
					&& difficultyOk
					&& searchOk
			})
			.sort((a, b) => {
				const priorityA = priorityOrder[a.priority ?? ''] ?? 99
				const priorityB = priorityOrder[b.priority ?? ''] ?? 99

				if (priorityA !== priorityB) {
					return priorityA - priorityB
				}

				return a.title.localeCompare(b.title)
			})
	))

	const selectedPractice = computed<PracticeItem | null>(() => {
		if (!selectedPracticeId.value) return null

		return filteredPractices.value.find(practice => practice.id === selectedPracticeId.value) ?? null
	})

	const hasNoFilteredPractice = computed(() => filteredPractices.value.length === 0)

	const openPracticeDetails = (practice: PracticeItem) => {
		selectedPracticeId.value = practice.id
		detailDialog.value = true
	}

	const closePracticeDetails = () => {
		detailDialog.value = false
		selectedPracticeId.value = ''
	}

	watch([selectedPillarId, selectedAudience, selectedFilter, selectedPriority, selectedDifficulty, search], () => {
		if (!filteredPractices.value.some(practice => practice.id === selectedPracticeId.value)) {
			selectedPracticeId.value = ''
			detailDialog.value = false
		}
	})

	const resetFilters = () => {
		selectedPillarId.value = 'all'
		selectedAudience.value = 'all'
		selectedFilter.value = 'all'
		selectedPriority.value = 'all'
		selectedDifficulty.value = 'all'
		search.value = ''
		selectedPracticeId.value = ''
		detailDialog.value = false
	}

	const formatActions = (practice: PracticeItem) => practice.actionNumbers?.length
		? practice.actionNumbers.map(number => `Action #${number}`).join(' · ')
		: 'Bonne pratique essentielle'

	const getAudienceClass = (audience: Audience) => {
		if (audience === 'UX / UI') return 'practice-badge--ux'
		if (audience === 'Back') return 'practice-badge--back'
		return 'practice-badge--front'
	}

	const getAudienceLabel = (audience: Audience) => audience === 'Back' ? 'Back' : audience

</script>

<template>
	<v-container
		fluid
		class="eco-referential-page"
	>
		<div class="header">
			<SyHeading :level="1">
				20 bonnes pratiques essentielles d'ecoconception
			</SyHeading>

			<p>
				Consultez les 20 bonnes pratiques essentielles d’écoconception
				classées par thématique, audience et priorité.
			</p>
		</div>

		<v-card
			flat
			class="filters-card"
		>
			<v-card-text class="pa-0">
				<div class="filters-title">
					Filtres
				</div>

				<div class="filters-grid">
					<v-select
						v-model="selectedPillarId"
						:items="[
							{ title: 'Toutes les thématiques', value: 'all' },
							...pillars.map(pillar => ({
								title: pillar.title,
								value: pillar.id,
							})),
						]"
						label="Thématique"
						variant="outlined"
						density="comfortable"
						hide-details
						color="primary"
					/>

					<v-select
						v-model="selectedAudience"
						:items="[
							{ title: 'Toutes les catégories', value: 'all' },
							{ title: 'UX/UI', value: 'UX / UI' },
							{ title: 'Dev Front', value: 'Dev Front' },
							{ title: 'Back', value: 'Back' },
						]"
						label="Catégorie"
						variant="outlined"
						density="comfortable"
						hide-details
						color="primary"
					/>
				</div>

				<div class="search-and-sort-row">
					<v-text-field
						v-model="search"
						label="Rechercher"
						variant="outlined"
						density="comfortable"
						hide-details
						clearable
						color="primary"
						:prepend-inner-icon="mdiMagnifyIcon"
						placeholder="Rechercher"
					/>

					<v-select
						v-model="selectedPriority"
						:items="[
							{ title: 'Toutes les priorités', value: 'all' },
							{ title: 'Priorité haute', value: 'Haute' },
							{ title: 'Priorité moyenne', value: 'Moyenne' },
							{ title: 'Priorité faible', value: 'Faible' },
						]"
						label="Priorité"
						variant="outlined"
						density="comfortable"
						hide-details
						color="primary"
					/>

					<v-select
						v-model="selectedDifficulty"
						:items="[
							{ title: 'Toutes les difficultés', value: 'all' },
							{ title: 'Difficulté faible', value: 'Faible' },
							{ title: 'Difficulté moyenne', value: 'Moyenne' },
							{ title: 'Difficulté élevée', value: 'Élevée' },
						]"
						label="Difficulté"
						variant="outlined"
						density="comfortable"
						hide-details
						color="primary"
					/>
				</div>

				<div class="reset-row">
					<v-btn
						:prepend-icon="mdiRefreshIcon"
						variant="text"
						color="primary"
						@click="resetFilters"
					>
						Réinitialiser
					</v-btn>
				</div>
			</v-card-text>
		</v-card>

		<v-divider class="my-6" />

		<v-alert
			v-if="hasNoFilteredPractice"
			type="info"
			variant="tonal"
			class="mb-6"
		>
			Aucune bonne pratique ne correspond aux filtres sélectionnés.
		</v-alert>

		<v-row v-else>
			<v-col
				v-for="practice in filteredPractices"
				:key="practice.id"
				cols="12"
				sm="6"
				md="6"
			>
				<v-card
					height="100%"
					class="practice-card"
					elevation="2"
				>
					<v-card-title class="practice-card__title">
						<div class="practice-card__topline">
							<v-chip
								size="small"
								class="practice-number"
								color="primary"
								variant="tonal"
							>
								{{ formatActions(practice) }}
							</v-chip>
						</div>

						<span class="practice-title-text">
							{{ practice.title }}
						</span>
					</v-card-title>

					<v-card-text class="practice-card__content">
						<p>{{ practice.summary }}</p>

						<div class="practice-meta">
							<v-chip
								v-if="practice.priority"
								size="small"
								:class="{
									'priority-chip--haute': practice.priority === 'Haute',
									'priority-chip--moyenne': practice.priority === 'Moyenne',
									'priority-chip--faible': practice.priority === 'Faible'
								}"
								variant="tonal"
							>
								Priorité {{ practice.priority }}
							</v-chip>

							<v-chip
								v-if="practice.difficulty"
								size="small"
								:class="{
									'difficulty-chip--moyenne': practice.difficulty === 'Moyenne',
									'difficulty-chip--faible': practice.difficulty === 'Faible'
								}"
								variant="tonal"
							>
								Difficulté {{ practice.difficulty }}
							</v-chip>
						</div>
					</v-card-text>

					<v-card-actions>
						<v-spacer />
						<v-btn
							variant="text"
							color="primary"
							@click="openPracticeDetails(practice)"
						>
							Détails
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>

		<v-dialog
			v-model="detailDialog"
			max-width="1180"
			scrollable
		>
			<v-card
				v-if="selectedPractice"
				class="detail-card"
				elevation="3"
			>
				<v-card-item>
					<div class="detail-header">
						<div>
							<div class="detail-eyebrow">
								{{ selectedPractice.pillar.title }}
							</div>

							<SyHeading :level="3">
								{{ selectedPractice.title }}
							</SyHeading>
						</div>

						<v-chip
							class="practice-badge"
							:class="getAudienceClass(selectedPractice.audience)"
							size="small"
						>
							{{ getAudienceLabel(selectedPractice.audience) }}
						</v-chip>
					</div>

					<p class="detail-objective">
						{{ selectedPractice.objective || selectedPractice.summary }}
					</p>

					<v-row>
						<v-col
							cols="12"
							md="6"
						>
							<div class="detail-section detail-section--do">
								<h4>À faire</h4>
								<ul>
									<li
										v-for="item in selectedPractice.do"
										:key="item"
									>
										{{ item }}
									</li>
								</ul>
							</div>
						</v-col>

						<v-col
							cols="12"
							md="6"
						>
							<div class="detail-section detail-section--dont">
								<h4>À éviter</h4>
								<ul>
									<li
										v-for="item in selectedPractice.dont"
										:key="item"
									>
										{{ item }}
									</li>
								</ul>
							</div>
						</v-col>
					</v-row>

					<div
						v-if="selectedPractice.tables?.length"
						class="detail-table-section"
					>
						<div
							v-for="table in selectedPractice.tables"
							:key="table.title"
							class="detail-table-card"
						>
							<h4>{{ table.title }}</h4>

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
						</div>
					</div>

					<v-row>
						<v-col
							v-if="selectedPractice.control?.length"
							cols="12"
							md="6"
						>
							<div class="detail-section detail-section--control">
								<h4>Moyen de contrôle</h4>
								<ul>
									<li
										v-for="item in selectedPractice.control"
										:key="item"
									>
										{{ item }}
									</li>
								</ul>
							</div>
						</v-col>

						<v-col
							v-if="selectedPractice.impacts?.length"
							cols="12"
							md="6"
						>
							<div class="detail-section detail-section--impact">
								<h4>Impacts attendus</h4>
								<ul>
									<li
										v-for="impact in selectedPractice.impacts"
										:key="impact.label"
										class="impact-item"
									>
										<strong>{{ impact.label }}</strong>
										<p>{{ impact.before }}</p>
										<p>{{ impact.after }}</p>
										<p class="impact-gain">
											{{ impact.gain }}
										</p>
									</li>
								</ul>
							</div>
						</v-col>
					</v-row>
				</v-card-item>

				<v-card-actions class="pa-4">
					<v-spacer />
					<v-btn
						variant="outlined"
						color="primary"
						@click="closePracticeDetails"
					>
						Fermer
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<style scoped>
.eco-referential-page {
	max-width: 1180px;
	margin: 0 auto;
	padding: 48px 32px;
	background: #fff;
	color: #001b3f;
}

.header {
	margin-bottom: 56px;
}

.header :deep(h1) {
	color: #003f9f;
	font-size: 42px;
	font-weight: 800;
	line-height: 1.15;
	margin-bottom: 22px;
}

.header p {
	font-size: 18px;
	line-height: 1.5;
	margin: 0;
	color: #001b3f;
}

.filters-card {
	margin-bottom: 18px;
	background: transparent;
}

.filters-title {
	margin: 0 0 28px 8px;
	color: #003f9f;
	font-size: 18px;
	font-weight: 800;
}

.filters-grid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 24px;
	margin-bottom: 22px;
}

.priority-chip--haute {
	background: #fde8e8 !important;
	color: #991b1b !important;
}

.priority-chip--moyenne {
	background: #fef3c7 !important;
	color: #92400e !important;
}

.priority-chip--faible {
	background: #ecfdf5 !important;
	color: #166534 !important;
}

.difficulty-chip--faible {
	background: #dcfce7 !important;
	color: #166534 !important;
}

.difficulty-chip--moyenne {
	background: #dbeafe !important;
	color: #1e40af !important;
}

.search-and-sort-row {
	display: grid;
	grid-template-columns: minmax(280px, 1.6fr) minmax(180px, 0.7fr) minmax(180px, 0.7fr);
	gap: 24px;
	margin-bottom: 28px;
}

.reset-row {
	display: flex;
	justify-content: flex-end;
	margin-bottom: 18px;
}

.filter-chips {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 8px;
}

.filter-chip {
	border: 1px solid #cbd7eb;
	border-radius: 999px;
	padding: 8px 14px;
	background: #fff;
	color: #003f9f;
	font-weight: 700;
	cursor: pointer;
}

.filter-chip--active {
	background: #003f9f;
	color: #fff;
	border-color: #003f9f;
}

.practice-card {
	display: flex;
	flex-direction: column;
	border-radius: 4px;
	background: #fff;
	border: 1px solid rgb(0 0 0 / 6%);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.practice-card:hover {
	transform: translateY(-2px);
	box-shadow: 0 6px 16px rgb(0 0 0 / 14%);
}

.practice-card__title {
	display: block;
	padding: 20px 20px 10px;
	white-space: normal;
}

.practice-card__topline {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 12px;
}

.practice-title-text {
	display: block;
	color: #003f9f;
	font-size: 20px;
	font-weight: 800;
	line-height: 1.35;
	white-space: normal;
	overflow-wrap: anywhere;
}

.practice-card__content {
	flex-grow: 1;
	padding: 0 20px 8px;
}

.practice-card__content p {
	font-size: 18px;
	line-height: 1.45;
	color: #001b3f;
	margin: 0 0 18px;
}

.practice-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.practice-number {
	font-weight: 700;
}

.practice-badge {
	font-weight: 800;
	color: #fff !important;
}

.practice-badge--ux {
	background: #e86bb5 !important;
}

.practice-badge--front {
	background: #f5b827 !important;
	color: #14315f !important;
}

.practice-badge--back {
	background: #2e7d32 !important;
}

.detail-card {
	padding: 24px;
	border-radius: 4px;
}

.detail-header {
	display: flex;
	justify-content: space-between;
	gap: 24px;
	align-items: flex-start;
	margin-bottom: 20px;
}

.detail-header :deep(h3) {
	color: #003f9f;
	line-height: 1.25;
}

.detail-eyebrow {
	color: #60708d;
	font-weight: 500;
	margin-bottom: 8px;
}

.detail-objective {
	padding: 16px;
	background: #f5f7fb;
	border-left: 4px solid #003f9f;
	line-height: 1.5;
	margin-bottom: 24px;
}

.detail-section {
	height: 100%;
	border-radius: 4px;
	padding: 18px;
	border: 1px solid rgb(0 0 0 / 8%);
}

.detail-section h4,
.detail-table-card h4 {
	color: #003f9f;
	font-size: 18px;
	font-weight: 500;
	margin-bottom: 12px;
}

.detail-section li {
	margin-bottom: 12px;
	line-height: 1.45;
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
	margin: 24px 0 16px;
}

.detail-table-card {
	border: 1px solid rgb(0 0 0 / 8%);
	border-radius: 4px;
	padding: 18px;
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
	border: 1px solid #d9e1ef;
	padding: 12px;
	text-align: center;
	vertical-align: top;
}

.detail-table th {
	background: #f5f7fb;
	color: #003f9f;
	font-weight: 500;
}

.detail-table td:first-child {
	font-weight: 500;
	color: #003f9f;
}

.impact-item {
	margin-bottom: 14px;
}

.impact-item p {
	margin: 4px 0;
}

.impact-gain {
	color: #0f8f4f;
	font-weight: 700;
}

.detail-section h4 {
	margin-bottom: 20px;
}

.detail-section ul {
	padding-left: 22px;
}

@media (width <= 960px) {
	.eco-referential-page {
		padding: 32px 18px;
	}

	.filters-grid,
	.search-and-sort-row {
		grid-template-columns: 1fr;
	}

	.header :deep(h1) {
		font-size: 34px;
	}

	.detail-header {
		flex-direction: column;
	}
}
</style>

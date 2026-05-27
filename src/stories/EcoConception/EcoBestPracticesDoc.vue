<script setup lang="ts">
	import { computed, ref, watch } from 'vue'
	import bestPracticesData from './datas/bonnes_pratiques_essentielles.json'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'

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

	const selectedPillarId = ref(practices[0]?.pillar.id ?? '')
	const selectedPracticeId = ref('')
	const selectedAudience = ref<AudienceFilter>('all')
	const selectedFilter = ref<PracticeFilter>('all')

	const pillars = computed<Pillar[]>(() => {
		const uniquePillars = new Map<string, Pillar>()

		for (const practice of practices) {
			if (!uniquePillars.has(practice.pillar.id)) {
				uniquePillars.set(practice.pillar.id, practice.pillar)
			}
		}

		return Array.from(uniquePillars.values())
	})

	const selectedPillar = computed(() => (
		pillars.value.find(pillar => pillar.id === selectedPillarId.value)
		?? pillars.value[0]
	))

	const currentPillarPractices = computed(() => (
		practices.filter(practice => practice.pillar.id === selectedPillarId.value)
	))

	const filteredPractices = computed(() => (
		currentPillarPractices.value.filter((practice) => {
			const audienceOk = selectedAudience.value === 'all'
				|| practice.audience === selectedAudience.value

			const priorityOk = selectedFilter.value !== 'priority'
				|| practice.priority === 'Haute'

			const essentialOk = selectedFilter.value !== 'essential'
				|| practice.essential === true

			return audienceOk && priorityOk && essentialOk
		})
	))

	const hasNoFilteredPractice = computed(() => filteredPractices.value.length === 0)

	const selectedPractice = computed<PracticeItem | null>(() => {
		if (!selectedPracticeId.value) return null

		return filteredPractices.value.find(practice => practice.id === selectedPracticeId.value) ?? null
	})

	const detailDialog = ref(false)

	const uxUiPractices = computed(() => (
		filteredPractices.value.filter(practice => practice.audience === 'UX / UI')
	))

	const technicalPractices = computed(() => (
		filteredPractices.value.filter(practice => practice.audience !== 'UX / UI')
	))

	const selectPillar = (pillarId: string) => {
		selectedPillarId.value = pillarId
		selectedPracticeId.value = ''
		detailDialog.value = false
	}

	const openPracticeDetails = (practice: PracticeItem) => {
		selectedPracticeId.value = practice.id
		detailDialog.value = true
	}

	const closePracticeDetails = () => {
		detailDialog.value = false
		selectedPracticeId.value = ''
	}

	const resetFilters = () => {
		selectedAudience.value = 'all'
		selectedFilter.value = 'all'
	}

	watch([selectedAudience, selectedFilter, selectedPillarId], () => {
		if (!filteredPractices.value.some(practice => practice.id === selectedPracticeId.value)) {
			selectedPracticeId.value = ''
			detailDialog.value = false
		}
	})

	const formatActions = (practice: PracticeItem) => practice.actionNumbers?.length
		? practice.actionNumbers.map(number => `Action #${number}`).join(' · ')
		: 'Bonne pratique essentielle'

	const getAudienceClass = (audience: Audience) => {
		if (audience === 'UX / UI') return 'eco-rule-sheet__chip--ux'
		if (audience === 'Back') return 'eco-rule-sheet__chip--back'
		return 'eco-rule-sheet__chip--front'
	}

	const getAudienceLabel = (audience: Audience) => audience === 'Back' ? 'Back' : audience

	const setAudienceFilter = (audience: AudienceFilter) => {
		selectedAudience.value = audience
	}

	const togglePracticeFilter = (filter: Exclude<PracticeFilter, 'all'>) => {
		selectedFilter.value = selectedFilter.value === filter ? 'all' : filter
	}
</script>

<template>
	<v-container
		fluid
		class="eco-pdf-doc pa-0"
	>
		<section class="eco-pdf-hero">
			<div class="eco-pdf-hero__title">
				<SyHeading
					:level="2"
					class="text-white mb-1"
				>
					20 bonnes pratiques essentielles d’écoconception
				</SyHeading>
			</div>
		</section>

		<v-row class="ma-0 eco-pdf-layout">
			<v-col
				cols="12"
				md="3"
				class="pa-0 eco-pdf-sidebar"
			>
				<button
					v-for="pillar in pillars"
					:key="pillar.id"
					type="button"
					class="eco-pdf-pillar"
					:class="{ 'eco-pdf-pillar--active': selectedPillarId === pillar.id }"
					@click="selectPillar(pillar.id)"
				>
					<span class="eco-pdf-pillar__icon">{{ pillar.icon }}</span>
					<span>{{ pillar.title }}</span>
				</button>
			</v-col>

			<v-col
				cols="12"
				md="9"
				class="pa-4 pa-md-6 eco-pdf-main"
			>
				<div class="eco-filters">
					<button
						type="button"
						class="eco-filter"
						:class="{ 'eco-filter--active': selectedAudience === 'all' }"
						@click="setAudienceFilter('all')"
					>
						Tous
					</button>

					<button
						type="button"
						class="eco-filter"
						:class="{ 'eco-filter--active': selectedAudience === 'UX / UI' }"
						@click="setAudienceFilter('UX / UI')"
					>
						UX/UI
					</button>

					<button
						type="button"
						class="eco-filter"
						:class="{ 'eco-filter--active': selectedAudience === 'Dev Front' }"
						@click="setAudienceFilter('Dev Front')"
					>
						Dev Front
					</button>

					<button
						type="button"
						class="eco-filter"
						:class="{ 'eco-filter--active': selectedAudience === 'Back' }"
						@click="setAudienceFilter('Back')"
					>
						Back
					</button>

					<button
						type="button"
						class="eco-filter"
						:class="{ 'eco-filter--active': selectedFilter === 'priority' }"
						@click="togglePracticeFilter('priority')"
					>
						Actions prioritaires
					</button>

					<button
						type="button"
						class="eco-filter"
						:class="{ 'eco-filter--active': selectedFilter === 'essential' }"
						@click="togglePracticeFilter('essential')"
					>
						Essentielles
					</button>

					<button
						v-if="selectedAudience !== 'all' || selectedFilter !== 'all'"
						type="button"
						class="eco-filter eco-filter--reset"
						@click="resetFilters"
					>
						Réinitialiser
					</button>
				</div>

				<div
					v-if="!hasNoFilteredPractice"
					class="eco-pdf-columns mb-6"
					:class="{
						'eco-pdf-columns--single':
							(selectedAudience === 'UX / UI' && uxUiPractices.length)
							|| ((selectedAudience === 'Dev Front' || selectedAudience === 'Back') && technicalPractices.length)
					}"
				>
					<!-- UX/UI -->
					<div
						v-if="uxUiPractices.length"
						class="eco-pdf-column eco-pdf-column--ux"
					>
						<div class="eco-pdf-column__header">
							UX / UI
						</div>

						<button
							v-for="practice in uxUiPractices"
							:key="practice.id"
							type="button"
							class="eco-pdf-practice"
							:class="{ 'eco-pdf-practice--active': selectedPractice?.id === practice.id }"
							@click="openPracticeDetails(practice)"
						>
							<span class="eco-pdf-practice__actions">
								{{ formatActions(practice) }}
							</span>

							<span class="eco-pdf-practice__title">
								{{ practice.title }}
							</span>
						</button>
					</div>

					<!-- DEV FRONT / BACK -->
					<div
						v-if="technicalPractices.length"
						class="eco-pdf-column eco-pdf-column--front"
					>
						<div class="eco-pdf-column__header">
							Dev Front / Back
						</div>

						<button
							v-for="practice in technicalPractices"
							:key="practice.id"
							type="button"
							class="eco-pdf-practice"
							:class="{ 'eco-pdf-practice--active': selectedPractice?.id === practice.id }"
							@click="openPracticeDetails(practice)"
						>
							<span class="eco-pdf-practice__actions">
								{{ formatActions(practice) }}
							</span>

							<span class="eco-pdf-practice__title">
								{{ practice.title }}
							</span>
						</button>
					</div>
				</div>

				<v-alert
					v-else
					type="info"
					variant="tonal"
					class="mb-6"
				>
					Aucune bonne pratique ne correspond aux filtres sélectionnés.
				</v-alert>

				<v-dialog
					v-model="detailDialog"
					max-width="1180"
					scrollable
				>
					<v-card
						v-if="selectedPractice"
						class="eco-rule-sheet"
						elevation="0"
					>
						<div class="eco-rule-sheet__header">
							<div class="eco-rule-sheet__title-block">
								<div class="eco-rule-sheet__eyebrow">
									{{ selectedPillar?.title }}
								</div>

								<h3 class="eco-rule-sheet__title">
									{{ selectedPractice.title }}
								</h3>
							</div>

							<v-chip
								class="eco-rule-sheet__chip"
								:class="getAudienceClass(selectedPractice.audience)"
								size="small"
							>
								{{ getAudienceLabel(selectedPractice.audience) }}
							</v-chip>
						</div>

						<v-card-text class="pa-5 pa-md-6">
							<v-alert
								color="primary"
								variant="tonal"
								class="mb-5"
								density="comfortable"
							>
								{{ selectedPractice.objective || selectedPractice.summary }}
							</v-alert>

							<v-row>
								<v-col
									cols="12"
									md="6"
								>
									<div class="eco-section eco-section--do">
										<h4>✅ À faire</h4>
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
									<div class="eco-section eco-section--dont">
										<h4>❌ À éviter</h4>
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
								class="eco-table-section"
							>
								<div
									v-for="table in selectedPractice.tables"
									:key="table.title"
									class="eco-table-card"
								>
									<h4>{{ table.title }}</h4>

									<div class="eco-table-wrapper">
										<table class="eco-table">
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

							<v-row class="mt-1">
								<v-col
									v-if="selectedPractice.control?.length"
									cols="12"
									md="6"
								>
									<div class="eco-section eco-section--check">
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
									<div class="eco-section eco-section--impact">
										<h4>Impacts attendus</h4>

										<ul>
											<li
												v-for="impact in selectedPractice.impacts"
												:key="impact.label"
												class="eco-impact-item"
											>
												<strong>{{ impact.label }}</strong>
												<p>{{ impact.before }}</p>
												<p>{{ impact.after }}</p>
												<p class="eco-impact-gain">
													{{ impact.gain }}
												</p>
											</li>
										</ul>
									</div>
								</v-col>
							</v-row>

							<v-divider class="my-5" />

							<div class="eco-rule-meta">
								<v-chip
									v-for="number in selectedPractice.actionNumbers"
									:key="number"
									color="primary"
									variant="tonal"
								>
									Action #{{ number }}
								</v-chip>

								<v-chip
									v-if="selectedPractice.priority"
									:color="selectedPractice.priority === 'Haute' ? 'error' : 'warning'"
									variant="tonal"
								>
									Priorité {{ selectedPractice.priority }}
								</v-chip>

								<v-chip
									v-if="selectedPractice.difficulty"
									color="success"
									variant="tonal"
								>
									Difficulté {{ selectedPractice.difficulty }}
								</v-chip>

								<v-chip
									v-if="selectedPractice.essential"
									color="primary"
									variant="tonal"
								>
									Essentielle
								</v-chip>
							</div>
							<v-card-actions class="pa-5 pt-0">
								<v-spacer />
								<v-btn
									color="primary"
									variant="outlined"
									@click="closePracticeDetails"
								>
									Fermer
								</v-btn>
							</v-card-actions>
						</v-card-text>
					</v-card>
				</v-dialog>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped>
.eco-pdf-doc {
	width: 100%;
	min-height: auto;
	background: #f5f7fb;
}

.eco-pdf-hero {
	background: #07479f;
	padding: 28px 32px;
	text-align: center;
}

.eco-pdf-layout {
	height: auto;
	min-height: auto;
}

.eco-pdf-main {
	min-width: 0;
	padding-bottom: 0 !important;
}

.eco-pdf-sidebar {
	background: #fff;
	border-right: 1px solid #e3e8f2;
}

.eco-pdf-columns--single {
	grid-template-columns: 1fr;
}

.eco-pdf-pillar {
	position: relative;
	display: block;
	width: calc(100% - 24px);
	margin: 12px;
	padding: 18px 14px;
	border: 3px solid transparent;
	border-radius: 14px;
	background: #07479f;
	color: #fff;
	font-weight: 700;
	text-align: center;
	cursor: pointer;
	transition:
		background 0.2s ease,
		transform 0.2s ease,
		box-shadow 0.2s ease,
		border 0.2s ease;
}

.eco-pdf-pillar:hover {
	background: #06377c;
	transform: translateY(-2px);
}

.eco-pdf-pillar--active {
	background: #fff !important;
	color: #07479f !important;
	border: 2px solid #07479f;
	box-shadow: 0 8px 20px rgb(7 71 159 / 15%);
}

.eco-pdf-pillar__icon {
	display: block;
	font-size: 28px;
	line-height: 1;
	margin-bottom: 8px;
}

.eco-filters {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-bottom: 18px;
}

.eco-filter {
	border: 1px solid #c9d8ef;
	border-radius: 999px;
	padding: 8px 14px;
	background: #fff;
	color: #07479f;
	font-weight: 700;
	cursor: pointer;
}

.eco-filter--active {
	background: #07479f;
	color: #fff;
	border-color: #07479f;
}

.eco-filter--reset {
	border-color: #f5b827;
	color: #14315f;
}

.eco-pdf-columns {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 18px;
}

.eco-pdf-column {
	background: #fff;
	border-radius: 18px;
	padding: 18px;
	box-shadow: 0 10px 30px rgb(12 37 86 / 80%);
}

.eco-pdf-column__header {
	border-radius: 10px;
	padding: 10px 14px;
	margin-bottom: 14px;
	color: #fff;
	font-weight: 800;
	text-align: center;
}

.eco-pdf-column--ux .eco-pdf-column__header {
	background: #e86bb5;
}

.eco-pdf-column--front .eco-pdf-column__header {
	background: #f5b827;
}

.eco-pdf-practice {
	display: block;
	width: 100%;
	border: 1px solid #e3e8f2;
	border-radius: 12px;
	background: #fff;
	padding: 12px 14px;
	margin-bottom: 10px;
	text-align: left;
	cursor: pointer;
	transition: border 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.eco-pdf-practice:hover,
.eco-pdf-practice--active {
	border-color: #07479f;
	box-shadow: 0 8px 20px rgb(7 71 159 / 12%);
	transform: translateY(-1px);
}

.eco-pdf-practice__actions {
	display: block;
	font-size: 12px;
	font-weight: 700;
	color: #0097c7;
	margin-bottom: 4px;
}

.eco-pdf-practice__title {
	display: block;
	font-weight: 700;
	color: #14315f;
	white-space: normal;
	overflow-wrap: anywhere;
}

.eco-empty-column,
.eco-empty-section {
	color: #60708d;
	font-size: 14px;
	margin: 0;
}

.eco-rule-sheet {
	border-radius: 20px;
	overflow: hidden;
	box-shadow: 0 12px 36px rgb(12 37 86 / 10%);
}

.eco-rule-sheet__header {
	display: flex;
	justify-content: space-between;
	gap: 16px;
	align-items: flex-start;
	padding: 22px 26px;
	background: #07479f;
	min-width: 0;
}

.eco-rule-sheet__title-block {
	min-width: 0;
	max-width: 100%;
}

.eco-rule-sheet__eyebrow {
	color: #71d4f6;
	font-weight: 800;
	font-size: 13px;
	margin-bottom: 6px;
}

.eco-rule-sheet__title {
	margin: 0;
	color: #fff;
	font-size: 26px;
	font-weight: 800;
	line-height: 1.25;
	white-space: normal;
	overflow-wrap: anywhere;
	word-break: normal;
}

.eco-rule-sheet__chip {
	flex-shrink: 0;
	color: #fff !important;
	font-weight: 800;
}

.eco-rule-sheet__chip--ux {
	background: #e86bb5 !important;
}

.eco-rule-sheet__chip--front {
	background: #f5b827 !important;
	color: #14315f !important;
}

.eco-rule-sheet__chip--back {
	background: #2e7d32 !important;
}

.eco-section {
	height: 100%;
	border-radius: 16px;
	padding: 18px;
}

.eco-section h4,
.eco-table-card h4 {
	margin-bottom: 12px;
	color: #14315f;
}

.eco-section li {
	margin-bottom: 8px;
	color: #263b5e;
}

.eco-section--do {
	background: #eefbf4;
}

.eco-section--dont {
	background: #fff1f2;
}

.eco-section--check {
	background: #eef6ff;
}

.eco-section--impact {
	background: #fff8e7;
}

.eco-table-section {
	margin: 24px 0 8px;
}

.eco-table-card {
	background: #fff;
	border: 1px solid #e3e8f2;
	border-radius: 16px;
	padding: 18px;
	margin-bottom: 16px;
}

.eco-table-wrapper {
	width: 100%;
	overflow-x: auto;
}

.eco-table {
	width: 100%;
	border-collapse: collapse;
	min-width: 640px;
}

.eco-table th,
.eco-table td {
	border: 1px solid #d9e1ef;
	padding: 12px;
	text-align: center;
	color: #263b5e;
	vertical-align: top;
}

.eco-table th {
	background: #f5f7fb;
	color: #14315f;
	font-weight: 800;
}

.eco-table td:first-child {
	font-weight: 800;
	color: #14315f;
}

.eco-impact-item {
	margin-bottom: 14px;
}

.eco-impact-item p {
	margin: 4px 0;
}

.eco-impact-gain {
	font-weight: 800;
	color: #0f8f4f;
}

.eco-rule-meta {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

@media (width <= 960px) {
	.eco-pdf-columns {
		grid-template-columns: 1fr;
	}

	.eco-pdf-sidebar {
		border-right: 0;
		border-bottom: 1px solid #e3e8f2;
	}

	.eco-rule-sheet__header {
		flex-direction: column;
	}
}
</style>

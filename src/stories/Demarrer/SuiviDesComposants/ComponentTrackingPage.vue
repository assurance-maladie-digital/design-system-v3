<script setup lang="ts">
	import { computed, reactive, watch, ref, onMounted, onUnmounted } from 'vue'
	import SyAutocomplete from '@/components/Customs/Selects/SyAutocomplete/SyAutocomplete.vue'
	import infoData from '../component-info.json'
	import { locales } from './locales'

	interface ComponentInfo {
		componentName: string
		storybookTitle?: string
		status: string
		functionalVersion?: string
		functionalDate?: string
		a11yVersion?: string
		a11yDate?: string
		commits?: Array<{ date: string, message: string }>
		a11yCommits?: Array<{ date: string, message: string }>
	}

	interface FilterState {
		selectedComponents: string[]
		versionFilter: string
		a11yVersionFilter: string
		includeDeprecated: boolean
		cardTabs: Record<string, 'functional' | 'a11y'>
	}

	const filters = reactive<FilterState>({
		selectedComponents: [],
		versionFilter: '',
		a11yVersionFilter: '',
		includeDeprecated: false,
		cardTabs: {},
	})

	// Watch for null from SyAutocomplete and convert to empty array
	watch(() => filters.selectedComponents, (newVal) => {
		if (newVal === null) {
			filters.selectedComponents = []
		}
	})

	// Remove deprecated components from selection when switch is turned off
	watch(() => filters.includeDeprecated, (includeDeprecated) => {
		if (!includeDeprecated && filters.selectedComponents.length > 0) {
			filters.selectedComponents = filters.selectedComponents.filter((compName) => {
				const component = results.find(r => r.componentName === compName)
				return component?.status === 'actif'
			})
		}
	})

	const defaultTab = computed<'functional' | 'a11y'>(() =>
		filters.a11yVersionFilter ? 'a11y' : 'functional',
	)

	const getCardTab = (componentName: string): 'functional' | 'a11y' =>
		filters.cardTabs[componentName] || defaultTab.value

	const setCardTab = (componentName: string, tab: 'functional' | 'a11y') => {
		filters.cardTabs[componentName] = tab
	}

	const resetFilters = () => {
		filters.selectedComponents = []
		filters.versionFilter = ''
		filters.a11yVersionFilter = ''
		filters.includeDeprecated = false
		filters.cardTabs = {}
	}

	const results = (infoData.results ?? []) as ComponentInfo[]

	const componentOptions = computed(() => {
		const allOption = {
			text: locales.autocomplete.selectAll,
			value: '__ALL__',
		}

		const componentItems = results
			.filter(item => filters.includeDeprecated || item.status === 'actif')
			.map(item => ({
				text: item.componentName.split('/').pop() || item.componentName,
				value: item.componentName,
			}))
			.sort((a, b) => a.text.localeCompare(b.text))

		return [allOption, ...componentItems]
	})

	// Handle select all / deselect all
	watch(() => filters.selectedComponents, (newVal, oldVal) => {
		// Check if "__ALL__" was just added
		if (newVal.includes('__ALL__') && !oldVal?.includes('__ALL__')) {
			// Select all available components
			const availableComponents = results
				.filter(item => filters.includeDeprecated || item.status === 'actif')
				.map(item => item.componentName)
			filters.selectedComponents = availableComponents
		}
	}, { deep: true })

	const versions = computed(() => {
		const filteredResults = filters.selectedComponents.length > 0
			? results.filter(r => filters.selectedComponents.includes(r.componentName))
			: results
		return [...new Set(filteredResults.map(r => r.functionalVersion).filter(Boolean) as string[])].sort(
			(a, b) => b.localeCompare(a, undefined, { numeric: true }),
		)
	})

	const a11yVersions = computed(() => {
		const filteredResults = filters.selectedComponents.length > 0
			? results.filter(r => filters.selectedComponents.includes(r.componentName))
			: results
		return [...new Set(filteredResults.map(r => r.a11yVersion).filter(Boolean) as string[])].sort(
			(a, b) => b.localeCompare(a, undefined, { numeric: true }),
		)
	})

	const slug = (title: string) =>
		title.toLowerCase().replace(/[\s/'’()&,.]+/g, '-').replace(/^-+|-+$/g, '')

	const getUrl = (componentName: string, storybookTitle?: string) =>
		storybookTitle
			? `/?path=/docs/${slug(storybookTitle)}--docs`
			: `/?path=/docs/composants-${componentName.toLowerCase().replace(/[^a-z0-9]/g, '')}--docs`

	const REPO = 'https://github.com/assurance-maladie-digital/design-system-v3'

	const formatDate = (dateStr?: string) => {
		if (!dateStr) return null
		let date: Date
		if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
			const [day, month, year] = dateStr.split('/')
			date = new Date(`${year}-${month}-${day}T00:00:00`)
		}
		else {
			date = new Date(dateStr)
		}
		if (Number.isNaN(date.getTime())) return dateStr
		return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
	}

	const renderMessage = (msg: string) => {
		const m = msg.match(/#(\d+)/)
		if (!m) return msg
		const index = m.index ?? 0
		return `${msg.slice(0, index)}<a href="${REPO}/pull/${m[1]}" target="_blank" rel="noopener noreferrer">#${m[1]}</a>${msg.slice(index + m[0].length)}`
	}

	const filteredRows = computed(() => {
		// Si "Toutes les versions" est sélectionné et aucun composant n'est choisi, afficher tous les composants
		if (filters.selectedComponents.length === 0
			&& (filters.versionFilter === '__ALL__' || filters.a11yVersionFilter === '__ALL__')) {
			return [...results].sort((a, b) => {
				const versionA = a.functionalVersion || '0.0.0'
				const versionB = b.functionalVersion || '0.0.0'
				return versionB.localeCompare(versionA, undefined, { numeric: true })
			})
		}

		if (!hasActiveFilter.value) return []

		return [...results]
			.filter(
				item =>
					(filters.selectedComponents.length === 0
						|| filters.selectedComponents.includes(item.componentName))
					&& (filters.versionFilter === '' || filters.versionFilter === '__ALL__' || item.functionalVersion === filters.versionFilter)
					&& (filters.a11yVersionFilter === '' || filters.a11yVersionFilter === '__ALL__' || item.a11yVersion === filters.a11yVersionFilter)
					// Only apply deprecated filter if components are selected
					&& (filters.selectedComponents.length === 0 || filters.includeDeprecated || item.status === 'actif'),
			)
			.sort((a, b) => {
				const versionA = a.functionalVersion || '0.0.0'
				const versionB = b.functionalVersion || '0.0.0'
				return versionB.localeCompare(versionA, undefined, { numeric: true })
			})
	})

	const tabClass = (tab: 'functional' | 'a11y', activeTab: 'functional' | 'a11y') =>
		`ci-tab ${activeTab === tab ? 'active' : ''} ${tab === 'a11y' ? 'a11y' : ''}`

	const hasActiveFilter = computed(() =>
		filters.selectedComponents.length > 0
		|| (filters.versionFilter !== '' && filters.versionFilter !== '__ALL__')
		|| (filters.a11yVersionFilter !== '' && filters.a11yVersionFilter !== '__ALL__'),
	)

	// Keyboard navigation for cards
	const focusedCardIndex = ref<number>(-1)

	const handleKeyDown = (event: KeyboardEvent) => {
		if (filteredRows.value.length === 0) return

		const cards = document.querySelectorAll('.ci-card')
		if (cards.length === 0) return

		switch (event.key) {
		case 'ArrowRight':
			event.preventDefault()
			focusedCardIndex.value = Math.min(focusedCardIndex.value + 1, cards.length - 1)
			cards[focusedCardIndex.value]?.querySelector('a')?.focus()
			break
		case 'ArrowLeft':
			event.preventDefault()
			focusedCardIndex.value = Math.max(focusedCardIndex.value - 1, 0)
			cards[focusedCardIndex.value]?.querySelector('a')?.focus()
			break
		case 'Home':
			event.preventDefault()
			focusedCardIndex.value = 0
			cards[0]?.querySelector('a')?.focus()
			break
		case 'End':
			event.preventDefault()
			focusedCardIndex.value = cards.length - 1
			cards[cards.length - 1]?.querySelector('a')?.focus()
			break
		}
	}

	onMounted(() => {
		document.addEventListener('keydown', handleKeyDown)
	})

	onUnmounted(() => {
		document.removeEventListener('keydown', handleKeyDown)
	})
</script>

<template>
	<div class="ci-container">
		<div class="ci-filters">
			<div class="ci-filters-row">
				<SyAutocomplete
					v-model="filters.selectedComponents"
					:items="componentOptions"
					:multiple="true"
					:chips="true"
					:clearable="true"
					:hide-details="true"
					density="compact"
					text-key="text"
					value-key="value"
					:label="locales.autocomplete.label"
					:placeholder="locales.autocomplete.placeholder"
					menu-id="component-tracking-search"
					style="width: 100%;"
				/>
			</div>
			<div class="ci-filters-row">
				<select
					v-model="filters.versionFilter"
					class="ci-select"
					:aria-label="locales.filters.functionalLabel"
				>
					<option
						value=""
						disabled
					>
						{{ locales.filters.selectFunctionalVersion }}
					</option>
					<option value="__ALL__">
						{{ locales.filters.allVersions }}
					</option>
					<option
						v-for="v in versions"
						:key="v"
						:value="v"
					>
						v{{ v }}
					</option>
				</select>
				<select
					v-model="filters.a11yVersionFilter"
					class="ci-select"
					:aria-label="locales.filters.a11yLabel"
				>
					<option
						value=""
						disabled
					>
						{{ locales.filters.selectA11yVersion }}
					</option>
					<option value="__ALL__">
						{{ locales.filters.allVersions }}
					</option>
					<option
						v-for="v in a11yVersions"
						:key="v"
						:value="v"
					>
						v{{ v }}
					</option>
				</select>
				<label
					class="ci-switch"
					for="include-deprecated"
				>
					<input
						id="include-deprecated"
						v-model="filters.includeDeprecated"
						type="checkbox"
					>
					<span class="ci-switch-slider" />
					<span class="ci-switch-label">{{ locales.filters.includeDeprecated }}</span>
				</label>
				<button
					type="button"
					class="ci-reset-button"
					@click="resetFilters"
				>
					{{ locales.filters.resetFilters }}
				</button>
			</div>
		</div>

		<div
			v-if="filteredRows.length > 0"
			class="ci-meta"
		>
			<strong>{{ filteredRows.length }}</strong> {{ filteredRows.length === 1 ? locales.meta.component : locales.meta.components }}
		</div>

		<div
			v-if="filteredRows.length === 0"
			class="ci-empty-state"
		>
			<img
				src="./box.png"
				alt=""
				class="ci-empty-state-image"
			>
			{{ hasActiveFilter ? locales.noResults.message : locales.emptyState.message }}
		</div>

		<div
			v-else
			class="ci-grid"
		>
			<div
				v-for="item in filteredRows"
				:key="item.componentName"
				class="ci-card"
			>
				<div class="ci-card-header">
					<span class="ci-card-name">
						<a :href="getUrl(item.componentName, item.storybookTitle)">
							{{ item.componentName.split('/').pop() }}
						</a>
					</span>
					<span
						class="ci-card-status"
						:class="item.status === 'déprécié' ? 'deprecie' : 'actif'"
					>
						<span
							class="ci-card-dot"
							:class="item.status === 'déprécié' ? 'deprecie' : 'actif'"
						/>
						{{ item.status === 'déprécié' ? locales.status.displayDeprecated : locales.status.displayActive }}
					</span>
				</div>
				<div class="ci-tabs">
					<button
						:aria-pressed="getCardTab(item.componentName) === 'functional'"
						:aria-label="`${locales.tabs.functional} pour ${item.componentName.split('/').pop()}`"
						:class="tabClass('functional', getCardTab(item.componentName))"
						@click="setCardTab(item.componentName, 'functional')"
					>
						{{ locales.tabs.functional }}
					</button>
					<button
						:aria-pressed="getCardTab(item.componentName) === 'a11y'"
						:aria-label="`${locales.tabs.a11y} pour ${item.componentName.split('/').pop()}`"
						:class="tabClass('a11y', getCardTab(item.componentName))"
						@click="setCardTab(item.componentName, 'a11y')"
					>
						{{ locales.tabs.a11y }}
					</button>
				</div>
				<div class="ci-card-body">
					<div class="ci-version-line">
						<span
							v-if="getCardTab(item.componentName) === 'functional' ? item.functionalVersion : item.a11yVersion"
							class="ci-tag"
							:class="getCardTab(item.componentName) === 'functional' ? 'func' : 'a11y'"
						>
							v{{ getCardTab(item.componentName) === 'functional' ? item.functionalVersion : item.a11yVersion }}
						</span>
						<span
							v-else
							class="ci-tag empty"
						>
							{{ locales.version.unknown }}
						</span>
						<span
							v-if="getCardTab(item.componentName) === 'functional' ? item.functionalVersion : item.a11yVersion"
							class="ci-date"
						>
							{{ formatDate(getCardTab(item.componentName) === 'functional' ? item.functionalDate : item.a11yDate) }}
						</span>
					</div>
					<ul
						v-if="(getCardTab(item.componentName) === 'functional' ? item.commits : item.a11yCommits)?.length"
						class="ci-commits"
					>
						<li
							v-for="(c, i) in getCardTab(item.componentName) === 'functional' ? item.commits : item.a11yCommits"
							:key="i"
						>
							<span class="c-date">{{ formatDate(c.date) }}</span>
							<span
								class="c-msg"
								v-html="renderMessage(c.message)"
							/>
						</li>
					</ul>
					<p
						v-else
						class="ci-empty"
					>
						{{ locales.commits.empty }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
	.ci-container {
		font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		margin-top: 1.5rem;
	}

	.ci-meta {
		font-size: 0.875rem;
		color: #525252;
		margin-bottom: 1.25rem;
	}

	.ci-meta strong {
		color: #0c419a;
	}

	.ci-filters {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1.25rem;
	}

	.ci-filters :deep(.sy-autocomplete) {
		--sy-autocomplete-color: #0c419a;
		--sy-autocomplete-border-color: #0c419a;
		--sy-autocomplete-bg-color: #0c419a;
	}

	.ci-filters-row {
		display: flex;
		gap: 0.75rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.ci-filters-row .ci-select,
	.ci-filters-row .ci-switch {
		flex: 1;
		min-width: 0;
	}

	.ci-select {
		height: 56px;
		padding: 0 2rem 0 0.75rem;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		font-size: 0.875rem;
		background-color: #fff;
		cursor: pointer;
		outline: none;
		box-sizing: border-box;
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23525252' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.6rem center;
	}

	.ci-select:focus {
		border-color: #0c419a;
		box-shadow: 0 0 0 2px rgb(12 65 154 / 15%);
		outline: none;
	}

	.ci-switch input:focus + .ci-switch-slider {
		box-shadow: 0 0 0 2px rgb(12 65 154 / 15%);
		outline: none;
	}

	.ci-tab:focus {
		outline: 2px solid #0c419a;
		outline-offset: -2px;
	}

	.ci-card-name a:focus {
		outline: 2px solid #0c419a;
		outline-offset: 2px;
		border-radius: 2px;
	}

	.ci-switch {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		cursor: pointer;
		user-select: none;
		height: 56px;
		padding: 0 0.75rem;
	}

	.ci-switch input {
		position: absolute;
		opacity: 0;
		width: 0;
		height: 0;
	}

	.ci-switch-slider {
		position: relative;
		width: 44px;
		height: 24px;
		background-color: #e0e0e0;
		border-radius: 12px;
		transition: background-color 0.2s ease;
		flex-shrink: 0;
	}

	.ci-switch-slider::before {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: 20px;
		height: 20px;
		background-color: #fff;
		border-radius: 50%;
		transition: transform 0.2s ease;
		box-shadow: 0 1px 3px rgb(0 0 0 / 20%);
	}

	.ci-switch input:checked + .ci-switch-slider {
		background-color: #0c419a;
	}

	.ci-switch input:checked + .ci-switch-slider::before {
		transform: translateX(20px);
	}

	.ci-switch input:disabled + .ci-switch-slider {
		background-color: #e0e0e0;
		opacity: 0.5;
		cursor: not-allowed;
	}

	.ci-switch input:disabled + .ci-switch-slider::before {
		background-color: #fff;
	}

	.ci-switch input:disabled ~ .ci-switch-label {
		color: #9e9e9e;
		cursor: not-allowed;
	}

	.ci-switch-label {
		font-size: 0.875rem;
		color: #525252;
		font-weight: 500;
	}

	.ci-reset-button {
		height: 40px;
		padding: 0 0.75rem;
		border: 1px solid #0c419a;
		border-radius: 4px;
		background-color: #fff;
		color: #0c419a;
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s ease, color 0.2s ease;
		flex-shrink: 0;
	}

	.ci-reset-button:hover {
		background-color: #0c419a;
		color: #fff;
	}

	.ci-reset-button:focus {
		outline: 2px solid #0c419a;
		outline-offset: 2px;
	}

	.ci-empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: #525252;
		font-size: 1rem;
		background-color: #f8f9fc;
		border-radius: 8px;
		border: 1px dashed #e0e0e0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.ci-empty-state-image {
		width: 120px;
		height: 120px;
		object-fit: contain;
		opacity: 0.6;
	}

	.ci-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
		gap: 1rem;
	}

	@media (width <= 768px) {
		.ci-grid {
			grid-template-columns: 1fr;
		}

		.ci-filters-row {
			flex-direction: column;
			align-items: stretch;
		}

		.ci-filters-row .ci-select,
		.ci-filters-row .ci-switch {
			width: 100%;
		}
	}

	.ci-card {
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background-color: #fff;
		overflow: hidden;
	}

	.ci-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.875rem 1rem;
		background-color: #f4f4f4;
		border-bottom: 1px solid #e0e0e0;
	}

	.ci-card-name a {
		color: #0c419a;
		font-weight: 700;
		font-size: 1rem;
		text-decoration: none;
	}

	.ci-card-name a:hover {
		text-decoration: underline;
	}

	.ci-card-status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		white-space: nowrap;
	}

	.ci-card-status.actif {
		color: #155329;
		background-color: #d1f7d9;
	}

	.ci-card-status.deprecie {
		color: #684e00;
		background-color: #fff2cc;
	}

	.ci-card-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.ci-card-dot.actif {
		background-color: #24a148;
	}

	.ci-card-dot.deprecie {
		background-color: #f1c21b;
	}

	.ci-tabs {
		display: flex;
		border-bottom: 1px solid #e0e0e0;
	}

	.ci-tab {
		flex: 1;
		padding: 0.65rem 0.75rem;
		font-size: 0.8125rem;
		font-weight: 600;
		color: #525252;
		background-color: #fafafa;
		border: none;
		cursor: pointer;
		text-align: center;
	}

	.ci-tab:hover {
		background-color: #f4f4f4;
	}

	.ci-tab.active {
		color: #0c419a;
		background-color: #fff;
		border-bottom: 2px solid #0c419a;
	}

	.ci-tab.active.a11y {
		color: #1a4480;
		border-bottom-color: #1a4480;
	}

	.ci-card-body {
		padding: 1rem;
	}

	.ci-version-line {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-bottom: 0.75rem;
	}

	.ci-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.25rem 0.6rem;
		border-radius: 4px;
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
	}

	.ci-tag.func {
		color: #155329;
		background-color: #d1f7d9;
		border: 1px solid #a7e0b5;
	}

	.ci-tag.a11y {
		color: #1a4480;
		background-color: #e8f4ff;
		border: 1px solid #a8d0ff;
	}

	.ci-tag.empty {
		color: #6f6f6f;
		background-color: #f4f4f4;
		border: 1px solid #e0e0e0;
		font-weight: 500;
	}

	.ci-date {
		font-size: 0.75rem;
		color: #6f6f6f;
	}

	.ci-commits {
		margin: 0;
		padding: 0;
		list-style: none;
		max-height: 200px;
		overflow-y: auto;
	}

	.ci-commits li {
		padding: 0.35rem 0;
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
		font-size: 0.8125rem;
	}

	.ci-commits .c-date {
		color: #6f6f6f;
		font-variant-numeric: tabular-nums;
		white-space: nowrap;
		font-size: 0.75rem;
	}

	.ci-commits .c-msg {
		color: #161616;
		line-height: 1.4;
	}

	.ci-commits .c-msg a {
		color: #0c419a;
		text-decoration: none;
		font-weight: 600;
	}

	.ci-commits .c-msg a:hover {
		text-decoration: underline;
	}

	.ci-empty {
		font-size: 0.8125rem;
		color: #6f6f6f;
		font-style: italic;
	}
</style>

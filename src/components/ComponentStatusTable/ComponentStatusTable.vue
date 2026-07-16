<script setup lang="ts">
	import { computed, ref } from 'vue'
	import qualityData from './code-quality-status.json'
	import FilterInline from '../FilterInline/FilterInline.vue'
	import SyTable from '../Tables/SyTable/SyTable.vue'
	import SySelect from '../Customs/Selects/SySelect/SySelect.vue'
	import SyTextField from '../Customs/SyTextField/SyTextField.vue'

	type ComponentStatusItem = {
		componentName: string
		storybookTitle?: string
		category?: string
		figmaUrl?: string
		propsDocumentationLabel?: string
		hasPropsDocumentation?: boolean
		hasSourceTab?: boolean
		requiredStoriesStatus?: string
		hasUxUsagePage?: boolean
		themeModeStatus?: string
		hasInteractivePlayground?: boolean
		hasUnitTest?: boolean
		hasA11yTest?: boolean
		hasCypressTest?: boolean
		criticality?: string
		functionalVersion?: string
		functionalDate?: string
	}
	const searchTerm = ref('')
	const selectedCategory = ref('Toutes')

	const filters = ref([
		{ name: 'missingProps', title: 'Props / Slots non documentés', value: false },
		{ name: 'missingUxPage', title: 'Page usages UX absente', value: false },
		{ name: 'missingSourceCode', title: 'Onglet source code absent', value: false },
		{ name: 'missingStories', title: 'Stories incomplètes', value: false },
		{ name: 'missingPlayground', title: 'Playground absent', value: false },
		{ name: 'criticalOnly', title: 'Criticité détectée', value: false },
	])

	const tableHeaders = [
		{ title: 'Composant', key: 'componentName' },
		{ title: 'Composant Figma', key: 'figmaUrl' },
		{ title: 'Props / Slots documentés', key: 'propsDocumentationLabel' },
		{ title: 'Onglet source code', key: 'hasSourceTab' },
		{ title: 'Stories requises', key: 'requiredStoriesStatus' },
		{ title: 'Page usages UX', key: 'hasUxUsagePage' },
		{ title: 'Theme mode', key: 'themeMode' },
		{ title: 'Playground interactif', key: 'hasInteractivePlayground' },
		{ title: 'Tests', key: 'tests' },
		{ title: 'Criticité', key: 'criticality' },
		{ title: 'Dernière mise à jour fonctionnelle', key: 'functionalUpdate' },
	]

	const components = computed<ComponentStatusItem[]>(() =>
		(qualityData.results as ComponentStatusItem[])
			.filter(Boolean)
			.filter(item =>
				!item.componentName?.toLowerCase().startsWith('amelipro')
				&& !item.storybookTitle?.toLowerCase().includes('amelipro')
				&& item.category?.toLowerCase() !== 'amelipro',
			),
	)

	const categories = computed(() => [
		'Toutes',
		...new Set(
			components.value
				.map(item => item.category)
				.filter(Boolean),
		),
	])

	const criteriaHeaders = [
		{ title: 'Critère', key: 'critere' },
		{ title: 'Description', key: 'description' },
		{ title: 'Valeurs possibles', key: 'valeurs' },
	]

	const criteriaItems = [
		{
			critere: 'Props / Slots documentés',
			description: 'Vérifie que les props publiques, slots et événements sont décrits dans la documentation Storybook.',
			valeurs: 'Documenté / Manquant',
		},
		{
			critere: 'Composant Figma',
			description: 'Lien vers son composant de référence dans Figma.',
			valeurs: 'Lien Figma / -',
		},
		{
			critere: 'Onglet source code',
			description: 'Vérifie que le composant expose son code source Template + Script ou un exemple clair d’implémentation.',
			valeurs: 'Présent / Absent',
		},
		{
			critere: 'Stories requises',
			description: 'Vérifie la présence des stories importantes : Default, Disabled, Validation.',
			valeurs: 'Complètes / Partiel / Non concerné',
		},
		{
			critere: 'Page usages UX',
			description: 'Vérifie la présence d’une page Usages rédigée par les UX designers dédiée au composant.',
			valeurs: 'Présente / Absente',
		},
		{
			critere: 'Thème mode',
			description: 'Vérifie que le composant possède les déclinaisons graphiques nécessaires.',
			valeurs: 'CNAM / ameli pro',
		},
		{
			critere: 'Playground interactif',
			description: 'Vérifie la présence d’un playground ou d’exemples interactifs permettant de manipuler les props.',
			valeurs: 'Présent / Absent',
		},
		{
			critere: 'Tests',
			description: 'Tests disponibles pour le composant.',
			valeurs: 'UT / A11y / Cypress',
		},
		{
			critere: 'Criticité',
			description: 'Identifie les éléments bloquants ou incomplets impactant la qualité globale du composant.',
			valeurs: 'RAS / Anomalies détectées',
		},
		{
			critere: 'Dernière mise à jour fonctionnelle',
			description: 'Indique la dernière version fonctionnelle du composant et sa date de mise à jour.',
			valeurs: 'vX.X.X - JJ/MM/AAAA / -',
		},
	]
	const getFilterValue = (name: string) =>
		Boolean(filters.value.find(filter => filter.name === name)?.value)

	const activeFilters = computed(() => ({
		missingProps: getFilterValue('missingProps'),
		missingUxPage: getFilterValue('missingUxPage'),
		missingSourceCode: getFilterValue('missingSourceCode'),
		missingStories: getFilterValue('missingStories'),
		missingPlayground: getFilterValue('missingPlayground'),
		criticalOnly: getFilterValue('criticalOnly'),
	}))

	const filteredComponents = computed(() =>
		components.value.filter((item) => {
			const matchesSearch
				= !searchTerm.value
					|| item.componentName.toLowerCase().includes(searchTerm.value.toLowerCase())

			const matchesCategory
				= selectedCategory.value === 'Toutes'
					|| item.category === selectedCategory.value

			return matchesSearch
				&& matchesCategory
				&& (!activeFilters.value.missingProps || !item.hasPropsDocumentation)
				&& (!activeFilters.value.missingUxPage || !item.hasUxUsagePage)
				&& (!activeFilters.value.missingSourceCode || !item.hasSourceTab)
				&& (!activeFilters.value.missingStories || (
					item.requiredStoriesStatus !== 'Complètes'
					&& item.requiredStoriesStatus !== 'Non concerné'
				))
				&& (!activeFilters.value.missingPlayground || !item.hasInteractivePlayground)
				&& (!activeFilters.value.criticalOnly || Boolean(item.criticality))
		}),
	)

	const categoryItems = computed(() =>
		categories.value.map(category => ({
			text: category,
			value: category,
		})),
	)

	function getStoryPath(item: unknown): string {
		const componentItem = item as Partial<ComponentStatusItem>
		const title = componentItem.storybookTitle ?? ''

		return title
			.toLowerCase()
			.replaceAll('/', '-')
			.replaceAll(' ', '')
	}

	function getStorybookLink(
		item: unknown,
		theme?: string,
	): string {
		const storyPath = getStoryPath(item)
		const base = `${window.location.origin}/?path=/docs/${storyPath}--docs`

		return theme
			? `${base}&globals=theme:${theme}`
			: base
	}

	function tagClass(value) {
		if (value === true || value === 'Complètes' || value === 'Présent') return 'tag-green'
		if (value === false || value === 'Manquant' || value === 'Absent') return 'tag-red'
		if (typeof value === 'string' && value.startsWith('Partiel')) return 'tag-blue'
		return 'tag-gray'
	}
</script>

<template>
	<div class="header">
		<h1>Qualité code des composants Studio Design</h1>
	</div>

	<h2 class="mb-4">
		Critères de qualité des composants
	</h2>
	<div class="component-status-page">
		<SyTable
			:headers="criteriaHeaders"
			:items="criteriaItems"
			suffix="quality-criteria"
			:items-per-page="-1"
			hide-default-footer
			striped
		/>
		<div class="quality-filters">
			<div class="filter-field">
				<SySelect
					v-model="selectedCategory"
					label="Catégorie"
					:items="categoryItems"
					text-key="text"
					value-key="value"
					disable-error-handling
					hide-details
					width="260px"
				/>
			</div>

			<div class="filter-field filter-search">
				<SyTextField
					v-model="searchTerm"
					label="Recherche"
					placeholder="Rechercher un composant..."
				/>
			</div>

			<div class="filter-count">
				{{ filteredComponents.length }} composant{{ filteredComponents.length > 1 ? 's' : '' }}
			</div>
		</div>

		<FilterInline
			v-model="filters"
		>
			<template #missingProps="{ props }">
				<VCheckbox
					v-model="props.modelValue"
					label="Afficher les composants avec props / slots non documentés"
					hide-details
					@update:model-value="props['onUpdate:modelValue']"
				/>
			</template>

			<template #missingUxPage="{ props }">
				<VCheckbox
					v-model="props.modelValue"
					label="Afficher les composants sans page usages UX"
					hide-details
					@update:model-value="props['onUpdate:modelValue']"
				/>
			</template>

			<template #missingSourceCode="{ props }">
				<VCheckbox
					v-model="props.modelValue"
					label="Afficher les composants sans onglet source code"
					hide-details
					@update:model-value="props['onUpdate:modelValue']"
				/>
			</template>

			<template #missingStories="{ props }">
				<VCheckbox
					v-model="props.modelValue"
					label="Afficher les composants avec stories incomplètes"
					hide-details
					@update:model-value="props['onUpdate:modelValue']"
				/>
			</template>

			<template #missingPlayground="{ props }">
				<VCheckbox
					v-model="props.modelValue"
					label="Afficher les composants sans playground"
					hide-details
					@update:model-value="props['onUpdate:modelValue']"
				/>
			</template>

			<template #criticalOnly="{ props }">
				<VCheckbox
					v-model="props.modelValue"
					label="Afficher les composants avec criticité"
					hide-details
					@update:model-value="props['onUpdate:modelValue']"
				/>
			</template>
		</FilterInline>

		<SyTable
			class="mt-4"
			:headers="tableHeaders"
			:items="filteredComponents"
			suffix="component-status"
			:items-per-page="20"
			striped
		>
			<template #[`item.figmaUrl`]="{ item }">
				<a
					v-if="item.figmaUrl"
					:href="item.figmaUrl"
					target="_blank"
					rel="noopener noreferrer"
				>
					Ouvrir sur Figma
				</a>

				<span v-else>-</span>
			</template>

			<template #[`item.hasSourceTab`]="{ item }">
				<span :class="['carbon-tag', tagClass(item.hasSourceTab)]">
					{{ item.hasSourceTab ? 'Présent' : 'Absent' }}
				</span>
			</template>

			<template #[`item.requiredStoriesStatus`]="{ item }">
				<span :class="['carbon-tag', tagClass(item.requiredStoriesStatus)]">
					{{ item.requiredStoriesStatus }}
				</span>
			</template>

			<template #[`item.hasUxUsagePage`]="{ item }">
				<span :class="['carbon-tag', tagClass(item.hasUxUsagePage)]">
					{{ item.hasUxUsagePage ? 'Présente' : 'Absente' }}
				</span>
			</template>

			<template #[`item.themeMode`]="{ item }">
				<div class="theme-chips mt-2 mb-2">
					<VChip
						tag="a"
						:href="getStorybookLink(item)"
						target="_blank"
						rel="noopener noreferrer"
						class="cnam-chip"
						size="small"
					>
						CNAM
					</VChip>

					<VChip
						tag="a"
						:href="getStorybookLink(item, 'ap2026')"
						target="_blank"
						rel="noopener noreferrer"
						class="amelipro-chip"
						size="small"
					>
						ameli pro
					</VChip>
				</div>
			</template>

			<template #[`item.hasInteractivePlayground`]="{ item }">
				<span :class="['carbon-tag', tagClass(item.hasInteractivePlayground)]">
					{{ item.hasInteractivePlayground ? 'Présent' : 'Absent' }}
				</span>
			</template>

			<template #[`item.tests`]="{ item }">
				<div class="test-chips mt-2 mb-2">
					<span :class="['test-chip', item.hasUnitTest ? 'test-chip-ok' : 'test-chip-ko']">
						UT
					</span>

					<span :class="['test-chip', item.hasA11yTest ? 'test-chip-ok' : 'test-chip-ko']">
						A11y
					</span>

					<span :class="['test-chip', item.hasCypressTest ? 'test-chip-ok' : 'test-chip-ko']">
						Cypress
					</span>
				</div>
			</template>

			<template #[`item.criticality`]="{ item }">
				<span :class="['carbon-tag', item.criticality ? 'tag-red' : 'tag-green']">
					{{ item.criticality || 'Aucune' }}
				</span>
			</template>

			<template #[`item.functionalUpdate`]="{ item }">
				<div
					v-if="item.functionalVersion"
					class="functional-update"
				>
					<span class="functional-version">
						v{{ item.functionalVersion }}
					</span>
					<span class="functional-date">
						{{ item.functionalDate }}
					</span>
				</div>

				<span v-else>-</span>
			</template>
		</SyTable>
	</div>
</template>
<style>
.quality-filters {
	display: grid;
	grid-template-columns: 260px 1fr auto;
	gap: 24px;
	align-items: start;
	margin: 24px 0;
	padding: 20px;
	background: #f8f9fc;
	border: 1px solid #dbe3f0;
	border-radius: 12px;
}

.filter-field {
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
}

.filter-search {
	margin-top: 0;
}

.filter-count {
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: center;
	align-self: start;
	padding: 0 20px;
	background: #e7ecf5;
	border-radius: 999px;
	font-weight: 700;
	color: #0c419a;
	white-space: nowrap;
}

.component-status-page {
	width: 100%;
	max-width: none;
}

.component-status-page :deep(.v-table__wrapper) {
	overflow-x: auto;
}

.component-status-page :deep(table) {
	min-width: 1600px;
}

.theme-chips {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.theme-chips :deep(.v-chip) {
	min-width: 120px;
	justify-content: center;
	text-decoration: none;
	font-weight: 600;
}

.cnam-chip {
	background: #e8edf7 !important;
	color: #0c4fb5 !important;
}

.amelipro-chip {
	background: #dff0e6 !important;
	color: #0d7a43 !important;
}

.test-chips {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 8px;
}

.test-chip {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-width: 44px;
	padding: 4px 10px;
	border-radius: 999px;
	font-size: 12px;
	font-weight: 700;
}

.test-chip-ok {
	background: #dff0e6;
	color: #0d7a43;
}

.test-chip-ko {
	background: #fde2e2;
	color: #c62828;
}

.functional-update {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
}

.functional-version {
	display: inline-flex;
	padding: 4px 10px;
	border: 1px solid #9bd3ad;
	border-radius: 4px;
	background: #f0fff4;
	color: #1e7e34;
	font-weight: 700;
	font-size: 12px;
}

.functional-date {
	font-size: 12px;
	color: #6b7280;
}
</style>

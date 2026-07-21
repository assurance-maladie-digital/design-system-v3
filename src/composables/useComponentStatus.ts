import codeQualityStatus from '@/components/ComponentStatusTable/code-quality-status.json'

type ThemeName = 'cnam' | 'pa' | 'ap' | 'ap2026'

type StorybookContext = {
	id?: string
	name?: string
	title?: string
	globals?: {
		theme?: ThemeName
	}
}

type GeneratedComponentStatus = {
	componentName: string
	storybookTitle: string
	propsDocumentationLabel: string
	hasSourceTab: boolean
	requiredStoriesStatus: string
	hasUxUsagePage: boolean
	themeStatus: string
	themeModeStatus: string
	hasInteractivePlayground: boolean
	criticality: string
	isFullyCompliant: boolean
	score: number

}

type CodeQualityReport = {
	date: string
	results: GeneratedComponentStatus[]
}

export type StatutResult = {
	component: string
	componentCategory: string
	story: string
	doc: string
	sourceCode: string
	requiredStories: string
	usagePage: string
	visualTheme: string
	themeMode: string
	playground: string
	criticality: string
	score: number
}

const report = codeQualityStatus as CodeQualityReport

function normalizeValue(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]/g, '')
}

function getComponentName(title: string): string {
	const titleParts = title.split('/')

	return titleParts.at(-1) ?? ''
}

function findGeneratedStatus(
	componentTitle: string,
	componentName: string,
): GeneratedComponentStatus | undefined {
	const normalizedTitle = normalizeValue(componentTitle)
	const normalizedName = normalizeValue(componentName)

	return report.results.find((item) => {
		const generatedTitle = normalizeValue(item.storybookTitle)
		const generatedName = normalizeValue(item.componentName)

		return generatedTitle === normalizedTitle
			|| generatedName === normalizedName
	})
}

export function useComponentStatus(
	context: StorybookContext,
): StatutResult {
	const componentTitle = context.title ?? ''
	const componentName = getComponentName(componentTitle)
	const storyName = context.name ?? ''

	const generatedStatus = findGeneratedStatus(
		componentTitle,
		componentName,
	)

	if (!generatedStatus) {
		return {
			component: componentName,
			componentCategory: componentTitle,
			story: storyName,
			doc: 'Non renseigné',
			sourceCode: 'Non renseigné',
			requiredStories: 'Non renseigné',
			usagePage: 'Non renseignée',
			visualTheme: 'Non renseigné',
			themeMode: context.globals?.theme ?? 'Non défini',
			playground: 'Non renseigné',
			criticality: 'Composant absent du rapport généré',
			score: 0,
		}
	}

	return {
		component: generatedStatus.componentName,
		componentCategory: generatedStatus.storybookTitle,
		story: storyName,

		doc: generatedStatus.propsDocumentationLabel,

		sourceCode: generatedStatus.hasSourceTab
			? 'Présent'
			: 'Incomplet',

		requiredStories:
			generatedStatus.requiredStoriesStatus,

		usagePage: generatedStatus.hasUxUsagePage
			? 'Présente'
			: 'Absente',

		visualTheme:
			generatedStatus.themeStatus,

		themeMode:
				context.globals?.theme
				?? generatedStatus.themeModeStatus
				?? 'Non défini',

		playground:
			generatedStatus.hasInteractivePlayground
				? 'Présent'
				: 'Absent',

		criticality:
			generatedStatus.criticality || 'RAS',

		score: generatedStatus.score	}
}

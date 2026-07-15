type StorybookArgType = {
	description?: string
	table?: {
		category?: string
		type?: {
			summary?: string
		}
	}
	type?: {
		name?: string
		summary?: string
	}
}

type StorybookParameters = {
	docs?: {
		source?: {
			originalSource?: string
			code?: string
		}
	}
}

type StorybookGlobals = {
	theme?: string
}

type StorybookContext = {
	id?: string
	name?: string
	title?: string
	argTypes?: Record<string, StorybookArgType>
	args?: Record<string, unknown>
	parameters?: StorybookParameters
	globals?: StorybookGlobals
}

type SidebarStory = {
	text: string
	id: string
}

const ALLOWED_BOOLEAN_PROPS = new Set([
	'disabled',
	'readonly',
	'required',
	'loading',
	'multiple',
	'clearable',
	'hideDetails',
	'striped',
	'dense',
	'outlined',
	'rounded',
	'flat',
	'elevation',
])

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

function getSidebarStories(): SidebarStory[] {
	if (typeof window === 'undefined') {
		return []
	}

	try {
		const parentDocument = window.parent.document

		const elements = parentDocument.querySelectorAll<HTMLElement>(
			'.sidebar-item',
		)

		return Array.from(elements).map(element => ({
			text: element.textContent?.trim().toLowerCase() || '',
			id: element.getAttribute('data-item-id')?.toLowerCase() || '',
		}))
	}
	catch (error) {
		console.warn(
			'[ComponentStatus] Impossible de lire la sidebar Storybook.',
			error,
		)

		return []
	}
}

export function useComponentStatus(
	context: StorybookContext,
): StatutResult {
	const argTypes = context.argTypes ?? {}

	const props = Object.entries(argTypes).filter(
		([name, config]) =>
			config.table?.category === 'props'
			&& name !== 'default',
	)

	const slots = Object.entries(argTypes).filter(
		([, config]) =>
			config.table?.category === 'slots',
	)

	const documentedProps = props.filter(
		([, config]) => Boolean(config.description),
	)

	const documentedSlots = slots.filter(
		([, config]) => Boolean(config.description),
	)

	const missingDescriptions: string[] = []
	const badEventNames: string[] = []
	const missingRequiredStories: string[] = []

	props.forEach(([name, config]) => {
		const typeName = String(
			config.type?.name
			|| config.type?.summary
			|| config.table?.type?.summary
			|| '',
		).toLowerCase()

		if (!config.description) {
			missingDescriptions.push(name)
		}

		if (
			typeName.includes('boolean')
			&& !ALLOWED_BOOLEAN_PROPS.has(name)
			&& !/^(is|has|can|should)[A-Z]/.test(name)
		) {
			badBooleanNames.push(name)
		}

		if (
			(typeName.includes('function') || typeName.includes('=>'))
			&& !/^on[A-Z]/.test(name)
		) {
			badEventNames.push(name)
		}
	})

	const originalSource
		= context.parameters?.docs?.source?.originalSource ?? ''

	const sourceCode
		= context.parameters?.docs?.source?.code ?? ''

	const sourceCodeCombined = `${originalSource}\n${sourceCode}`

	const hasTemplate
		= /name:\s*['"`]Template['"`]/.test(sourceCodeCombined)
			|| sourceCodeCombined.includes('<template')

	const hasScript
		= /name:\s*['"`]Script['"`]/.test(sourceCodeCombined)
			|| sourceCodeCombined.includes('<script')

	const sourceCodeStatus
		= hasTemplate && hasScript
			? 'Présent'
			: 'Incomplet'

	const storyName = context.name ?? ''

	const componentIdParts = String(context.id ?? '').split('--')

	const componentId = componentIdParts[0]?.toLowerCase() ?? ''
	const componentTitle = context.title ?? ''

	const isFormComponent = componentTitle
		.toLowerCase()
		.includes('formulaires')

	const sidebarStories = getSidebarStories()

	if (isFormComponent) {
		const requiredStoryNames = [
			'disabled',
			'required',
			'form-validation',
		]

		requiredStoryNames.forEach((requiredStory) => {
			const storyWithSpaces = requiredStory.replaceAll('-', ' ')
			const storyWithoutDashes = requiredStory.replaceAll('-', '')

			const exists = sidebarStories.some(item =>
				item.id.startsWith(componentId)
				&& (
					item.id.includes(requiredStory)
					|| item.text.includes(storyWithSpaces)
					|| item.text.includes(storyWithoutDashes)
				),
			)

			if (!exists) {
				missingRequiredStories.push(requiredStory)
			}
		})
	}

	const requiredStoriesStatus = isFormComponent
		? missingRequiredStories.length > 0
			? `Partiel — manquantes : ${missingRequiredStories.join(', ')}`
			: 'Complètes'
		: ''

	const propsAndSlotsTotal = props.length + slots.length

	const documentedTotal
		= documentedProps.length + documentedSlots.length

	const docStatus
		= `${documentedTotal}/${propsAndSlotsTotal} documentés`

	const titleParts = componentTitle.split('/')

	const componentName = titleParts[titleParts.length - 1] ?? ''

	const hasUsagesStory = sidebarStories.some(item =>
		item.text === 'usages'
		&& item.id.startsWith(componentId),
	)

	const usagePageStatus = hasUsagesStory
		? 'Présente'
		: 'Absente'

	const isHeaderOrFooter = [
		'HeaderBar',
		'FooterBar',
	].includes(componentName)

	const storyLabel
		= `${context.id ?? ''} ${context.name ?? ''}`.toLowerCase()

	const hasDarkThemeStory
		= storyLabel.includes('dark')
			|| storyLabel.includes('custom-theme')

	const badBooleanNames: string[] = []

	const visualThemeStatus = isHeaderOrFooter
		? hasDarkThemeStory
			? 'dark'
			: 'light'
		: ''

	const themeModeStatus
		= context.globals?.theme ?? 'Non défini'

	const hasInteractivePlayground
		= props.length > 0
			|| Object.keys(argTypes).length > 0

	const playgroundStatus = hasInteractivePlayground
		? 'Présent'
		: 'Absent'

	const criticality = [
		missingDescriptions.length > 0
			? `Description manquante : ${missingDescriptions.join(', ')}`
			: '',

		badEventNames.length > 0
			? `Event mal nommé : ${badEventNames.join(', ')}`
			: '',

		badBooleanNames.length > 0
			? `Bool mal nommé : ${badBooleanNames.join(', ')}`
			: '',

		missingRequiredStories.length > 0
			? `Story requise manquante : ${missingRequiredStories.join(', ')}`
			: '',
	]
		.filter(Boolean)
		.join(' | ') || 'RAS'

	const issueCount
		= missingDescriptions.length
			+ badBooleanNames.length
			+ badEventNames.length
			+ missingRequiredStories.length

	const score = propsAndSlotsTotal > 0
		? Math.max(
				0,
				Math.round(
					(documentedTotal / propsAndSlotsTotal) * 100
					- issueCount * 3,
				),
			)
		: 100

	return {
		component: componentName,
		componentCategory: componentTitle,
		story: storyName,
		doc: docStatus,
		sourceCode: sourceCodeStatus,
		requiredStories: requiredStoriesStatus,
		usagePage: usagePageStatus,
		visualTheme: visualThemeStatus,
		themeMode: themeModeStatus,
		playground: playgroundStatus,
		criticality,
		score,
	}
}

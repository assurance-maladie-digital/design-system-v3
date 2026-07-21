import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { globSync } from 'glob'

const root = process.cwd()

const outputPath = path.resolve(
	root,
	'src/components/ComponentStatusTable/code-quality-status.json',
)

const componentInfoPath = path.resolve(
	root,
	'src/stories/Demarrer/component-info.json',
)

const componentInfo = existsSync(componentInfoPath)
	? JSON.parse(readFileSync(componentInfoPath, 'utf8'))
	: { results: [] }

const requiredFormStories = ['disabled', 'required', 'form-validation']

const ap2026Components = [
	'composants-layout-pagecontainer',
	'composants-navigation-sypagination',
	'composants-navigation-sytabs',
	'composants-navigation-skiplink',
	'composants-formulaires-sytextfield',
	'composants-formulaires-sytextarea',
	'composants-formulaires-sycheckbox',
	'composants-formulaires-sycheckboxgroup',
	'composants-formulaires-syradiogroup',
	'composants-formulaires-nirfield',
	'composants-formulaires-phonefield',
	'composants-formulaires-selects-syselect',
	'composants-formulaires-selects-syautocomplete',
	'composants-formulaires-selects-selectbtnfield',
	'composants-données-accordion',
	'composants-données-chiplist',
	'composants-feedback-dialogbox',
	'composants-feedback-notificationbar',
	'composants-filtres-filterssidebar',
	'composants-boutons-copybtn',
	'composants-boutons-downloadbtn',
	'composants-boutons-backtotopbtn',
	'composants-boutons-syiconbutton',
	'composants-structure-footerbar',
	'composants-structure-headerbar',
	'composants-structure-headerloading',
	'composants-tableaux-tabletoolbar',
	'composants-tableaux-sytable',
	'composants-tableaux-syservertable',
	'composants-tableaux-paginatedtable',
]

function slugify(value = '') {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}

function getFunctionalInfo(componentName, storybookTitle) {
	const info = componentInfo.results.find(item =>
		item.componentName === componentName
		|| item.storybookTitle === storybookTitle,
	)

	return {
		functionalVersion: info?.functionalVersion || null,
		functionalDate: info?.functionalDate || null,
	}
}

function getCategory(storybookTitle = '') {
	const parts = storybookTitle.split('/')

	if (parts[0] !== 'Composants') {
		return 'Autres'
	}

	return parts[1] || 'Autres'
}

function extractArgTypesBlock(content) {
	const match = content.match(/argTypes\s*:\s*{([\s\S]*?)},?\s*(args|parameters|render|tags|}\s*satisfies|}\s*as|}\s*;)/)
	return match?.[1] || ''
}

function extractPropsFromArgTypes(content) {
	const block = extractArgTypesBlock(content)
	if (!block) return []

	const props = new Set()
	const propRegex = /^\s{2,}([a-zA-Z_$][\w$]*)\s*:\s*{/gm

	let match

	while ((match = propRegex.exec(block)) !== null) {
		const prop = match[1]

		if (!['control', 'description', 'table', 'type', 'defaultValue'].includes(prop)) {
			props.add(prop)
		}
	}

	return Array.from(props)
}

function getPropsAndSlotsDocumentationDetails(content) {
	const props = extractPropsFromArgTypes(content)

	const slots = Array.from(
		content.matchAll(/table\s*:\s*{[\s\S]*?category\s*:\s*['"`]slots['"`][\s\S]*?}/gi),
	).map((_, index) => `slot-${index}`)

	const documentedProps = props.filter((prop) => {
		const propRegex = new RegExp(`${prop}\\s*:\\s*{[\\s\\S]*?description\\s*:`, 'm')
		return propRegex.test(content)
	})

	const total = props.length + slots.length
	const documented = documentedProps.length + slots.length

	return {
		total,
		documented,
		label: `${documented}/${total} documentés`,
		isComplete: total > 0 && documented === total,
	}
}

function hasSourceCode(content) {
	const hasTemplate = /name\s*:\s*['"`]Template['"`]/i.test(content)
		|| /<template[\s>]/i.test(content)

	const hasScript = /name\s*:\s*['"`]Script['"`]/i.test(content)
		|| /<script[\s>]/i.test(content)
		|| /import\s+.*from\s+['"`]/i.test(content)

	return hasTemplate && hasScript
}

function hasPlayground(content, docsContent = '') {
	const combined = `${content}\n${docsContent}`

	return /export\s+const\s+Playground\b/i.test(combined)
		|| /playground/i.test(combined)
		|| /<Canvas\s+of=/i.test(combined)
		|| /<Controls\s+of=/i.test(combined)
}

function getRequiredStoriesStatus(content, title) {
	if (!title) {
		return 'Non concerné'
	}

	const isFormComponent = title.toLowerCase().includes('formulaires')

	if (!isFormComponent) {
		return 'Non concerné'
	}

	const storyNames = Array.from(content.matchAll(/export\s+const\s+([a-zA-Z_$][\w$]*)/g))
		.map(match => match[1].toLowerCase())

	const missing = requiredFormStories.filter((requiredStory) => {
		const normalizedRequired = requiredStory.replace('-', '').toLowerCase()

		return !storyNames.some(storyName =>
			storyName.includes(requiredStory)
			|| storyName.includes(normalizedRequired),
		)
	})

	return missing.length
		? `Partiel — manquantes : ${missing.join(', ')}`
		: 'Complètes'
}

function getVisualThemeStatus(componentName, content) {
	if (!['HeaderBar', 'FooterBar'].includes(componentName)) {
		return 'Non concerné'
	}

	const hasDarkStory = /dark/i.test(content)
		|| /customTheme/i.test(content)
		|| /custom-theme/i.test(content)

	return hasDarkStory ? 'dark' : 'light'
}

function getThemeModeStatus(content) {
	if (/ap2026/i.test(content)) return 'AmeliPro 2026'
	if (/amelipro|ap/i.test(content)) return 'AmeliPro'
	if (/pa/i.test(content)) return 'PA'
	return 'CNAM'
}

function getCriticality({
	hasPropsDocumentation,
	hasSourceTab,
	requiredStoriesStatus,
	hasUxUsagePage,
	hasInteractivePlayground,
}) {
	const issues = []

	if (!hasPropsDocumentation) {
		issues.push('Props / slots non documentés')
	}

	if (!hasSourceTab) {
		issues.push('Onglet source code incomplet')
	}

	if (requiredStoriesStatus.startsWith('Partiel')) {
		issues.push(
			requiredStoriesStatus.replace(
				'Partiel — manquantes :',
				'Story requise manquante :',
			),
		)
	}

	if (!hasUxUsagePage) {
		issues.push('Page usages UX absente')
	}

	if (!hasInteractivePlayground) {
		issues.push('Playground interactif absent')
	}

	return issues.join(' | ')
}

const allStoryFiles = globSync(
	'src/components/**/*.stories.@(js|ts|tsx)',
	{
		cwd: root,
		absolute: true,
	},
).filter((file) => {
	const normalized = file.replace(/\\/g, '/').toLowerCase()

	return !normalized.includes('/rules/')
		&& !normalized.includes('/accessibilite/')
		&& !normalized.includes('/accessibilité/')
		&& !normalized.includes('/usages.')
		&& !normalized.includes('/usage.')
})

function getStoryName(filePath) {
	return path.basename(filePath)
		.replace(/\.stories\.(js|ts|tsx)$/, '')
}

function getStorybookTitle(content, fallback = '') {
	const match = content.match(
		/title\s*:\s*['"`]([^'"`]+)['"`]/,
	)

	return match?.[1] || fallback
}
function main() {
	const results = componentInfo.results.map((component) => {
		const componentName
		= component.componentName.split('/').pop()
			|| component.componentName

		let storyFile = allStoryFiles.find(file =>
			getStoryName(file).toLowerCase()
			=== componentName.toLowerCase(),
		)

		if (!storyFile && component.storybookTitle) {
			storyFile = allStoryFiles.find((file) => {
				const fileContent = readFileSync(file, 'utf8')
				const fileTitle = getStorybookTitle(fileContent)

				return fileTitle === component.storybookTitle
			})
		}

		const content = storyFile
			? readFileSync(storyFile, 'utf8')
			: ''

		const storybookTitle
		= component.storybookTitle
			|| getStorybookTitle(content, componentName)
			|| componentName

		// if (!storyFile) {
		// 	console.log(
		// 		`Storie introuvable : ${component.componentName}`,
		// 	)
		// }

		const effectiveComponentDir = storyFile
			? path.dirname(storyFile)
			: path.join(root, 'src/components', component.componentName)

		const mdxPath = storyFile
			? storyFile.replace(/\.stories\.(js|ts|tsx)$/, '.mdx')
			: ''
		const docsContent = mdxPath && existsSync(mdxPath)
			? readFileSync(mdxPath, 'utf8')
			: ''

		const files = globSync('**/*', {
			cwd: effectiveComponentDir,
			nodir: true,
		})

		const propsDetails = getPropsAndSlotsDocumentationDetails(content)
		const propsDocumentation = propsDetails.isComplete
		const sourceTab = hasSourceCode(content)
		const requiredStoriesStatus = getRequiredStoriesStatus(content, storybookTitle)
		const uxUsagePage = files.some(file => file.toLowerCase().endsWith('usages.mdx'))
		const interactivePlayground = hasPlayground(content, docsContent)
		const themeStatus = getVisualThemeStatus(componentName, content)
		const themeModeStatus = getThemeModeStatus(content)
		const storyPath = slugify(storybookTitle)
		const functionalInfo = getFunctionalInfo(componentName, storybookTitle)
		const hasUnitTest = files.some(file =>
			file.toLowerCase().endsWith(`${componentName.toLowerCase()}.spec.ts`)
			&& !file.toLowerCase().endsWith(`${componentName.toLowerCase()}.a11y.spec.ts`),
		)

		const hasA11yTest = files.some(file =>
			file.toLowerCase().endsWith(`${componentName.toLowerCase()}.a11y.spec.ts`),
		)

		const hasCypressTest = files.some(file =>
			file.toLowerCase().endsWith(`${componentName.toLowerCase()}.visual.cy.ts`),
		)

		const hasAp2026Theme = ap2026Components.some(id =>
			storyPath === id
			|| storyPath.startsWith(`${id}-`),
		)

		const criticality = getCriticality({
			hasPropsDocumentation: propsDocumentation,
			hasSourceTab: sourceTab,
			requiredStoriesStatus,
			hasUxUsagePage: uxUsagePage,
			hasInteractivePlayground: interactivePlayground,
		})

		const checks = [
			propsDocumentation,
			sourceTab,
			!requiredStoriesStatus.startsWith('Partiel'),
			uxUsagePage,
			interactivePlayground,
		]

		const successfulChecks = checks.filter(Boolean).length
		const score = Math.round(
			(successfulChecks / checks.length) * 100,
		)

		const defaultFigmaUrl
  = 'https://www.figma.com/design/m2tWjSODYdgi5POFx0cmJr/Synapse?m=auto&node-id=1109-4028&t=xjggswqIQwBbmkTk-1'

		return {
			componentName,
			hasPropsDocumentation: propsDocumentation,
			propsDocumentationLabel: propsDetails.label,
			hasSourceTab: sourceTab,
			requiredStoriesStatus,
			hasUxUsagePage: uxUsagePage,
			themeStatus,
			hasAp2026Theme,
			themeModeStatus,
			hasInteractivePlayground: interactivePlayground,
			criticality,
			isFullyCompliant: !criticality,
			storybookTitle,
			hasUnitTest,
			functionalVersion: functionalInfo.functionalVersion,
			functionalDate: functionalInfo.functionalDate,
			hasA11yTest,
			figmaUrl: defaultFigmaUrl,
			score,
			hasCypressTest,
			storybookId: `${storyPath}--docs`,
			category: getCategory(storybookTitle),
		}
	})

	mkdirSync(path.dirname(outputPath), { recursive: true })
	writeFileSync(
		outputPath,
		JSON.stringify({
			date: new Date().toISOString(),
			results,
		}, null, 2),
		'utf8',
	)

	console.log(`✅ Rapport qualité code généré : ${outputPath}`)
	console.log(`📊 ${results.length} composant(s) analysé(s)`)
}

main()

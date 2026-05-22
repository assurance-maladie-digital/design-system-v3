import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { globSync } from 'glob'
import path from 'node:path'

const root = process.cwd()

const storyFiles = globSync('src/components/**/*.stories.@(js|ts|tsx)', {
	cwd: root,
	absolute: true,
}).filter((file) => {
	const normalized = file.replace(/\\/g, '/')

	return !normalized.includes('/validation/')
		&& !normalized.includes('/rules/')
		&& !normalized.includes('/Usages.')
		&& !normalized.includes('/usage.')
		&& !normalized.includes('/accessibilite/')
		&& !normalized.includes('/accessibilité/')
})

const outputPath = path.resolve(
	root,
	'src/stories/Accessibilite/DesignSystem/code-quality-status.json',
)
const requiredFormStories = ['disabled', 'required', 'form-validation']

function slugify(value) {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}

function getComponentName(filePath) {
	return path.basename(filePath)
		.replace('.stories.tsx', '')
		.replace('.stories.ts', '')
		.replace('.stories.js', '')
}

function getStorybookTitle(content, componentName) {
	const match = content.match(/title\s*:\s*['"`]([^'"`]+)['"`]/)
	return match?.[1] || componentName
}

function hasUsagesStory(content) {
	return /export\s+const\s+Usages\b/.test(content)
}

function hasPlayground(content, docsContent = '') {
	const combined = `${content}\n${docsContent}`

	return /export\s+const\s+Playground\b/i.test(combined)
		|| /playground/i.test(combined)
		|| /<Canvas\s+of=/i.test(combined)
		|| /<Controls\s+of=/i.test(combined)
}

function hasSourceCode(content) {
	const hasTemplate
		= /name\s*:\s*['"`]Template['"`]/i.test(content)
			|| /<template[\s>]/i.test(content)

	const hasScript
		= /name\s*:\s*['"`]Script['"`]/i.test(content)
			|| /<script[\s>]/i.test(content)
			|| /import\s+.*from\s+['"`]/i.test(content)

	return hasTemplate && hasScript
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

function hasPropsDocumentation(content) {
	const props = extractPropsFromArgTypes(content)

	if (!props.length) return false

	return props.every((prop) => {
		const propRegex = new RegExp(`${prop}\\s*:\\s*{[\\s\\S]*?description\\s*:`, 'm')
		return propRegex.test(content)
	})
}

function getRequiredStoriesStatus(content, title) {
	const isFormComponent = title.toLowerCase().includes('formulaires')

	if (!isFormComponent) return 'Non concerné'

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

	const hasDarkStory
		= /dark/i.test(content)
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
		issues.push(requiredStoriesStatus.replace('Partiel — manquantes :', 'Story requise manquante :'))
	}

	if (!hasUxUsagePage) {
		issues.push('Page usages UX absente')
	}

	if (!hasInteractivePlayground) {
		issues.push('Playground interactif absent')
	}

	return issues.join(' | ')
}

function getCategory(storybookTitle) {
	const parts = storybookTitle.split('/')

	if (parts[0] !== 'Composants') {
		return 'Autres'
	}

	return parts[1] || 'Autres'
}

function main() {
	const results = storyFiles
		.map((filePath) => {
			const content = readFileSync(filePath, 'utf8')
			const mdxPath = filePath.replace(/\.stories\.(js|ts|tsx)$/, '.mdx')

			const docsContent = existsSync(mdxPath)
				? readFileSync(mdxPath, 'utf8')
				: ''
			const componentName = getComponentName(filePath)
			const storybookTitle = getStorybookTitle(content, componentName)
			if (!storybookTitle.startsWith('Composants/')) {
				return null
			}

			const excludedNames = [
				'FilterRules',
				'ComplexDatePicker',
				'Usages',
			]

			if (excludedNames.includes(componentName)) {
				return null
			}

			const propsDocumentation = hasPropsDocumentation(content)
			const sourceTab = hasSourceCode(content)
			const requiredStoriesStatus = getRequiredStoriesStatus(content, storybookTitle)
			const uxUsagePage = hasUsagesStory(content)
			const interactivePlayground = hasPlayground(content, docsContent)
			const themeStatus = getVisualThemeStatus(componentName, content)
			const themeModeStatus = getThemeModeStatus(content)

			const criticality = getCriticality({
				hasPropsDocumentation: propsDocumentation,
				hasSourceTab: sourceTab,
				requiredStoriesStatus,
				hasUxUsagePage: uxUsagePage,
				hasInteractivePlayground: interactivePlayground,
			})

			const isFullyCompliant = !criticality

			return {
				componentName,
				hasPropsDocumentation: propsDocumentation,
				hasSourceTab: sourceTab,
				requiredStoriesStatus,
				hasUxUsagePage: uxUsagePage,
				themeStatus,
				themeModeStatus,
				hasInteractivePlayground: interactivePlayground,
				criticality,
				isFullyCompliant,
				storybookTitle,
				storybookId: `${slugify(storybookTitle)}--docs`,
				category: getCategory(storybookTitle),
			}
		}).filter(Boolean)

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

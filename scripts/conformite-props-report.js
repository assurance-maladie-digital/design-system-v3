import { readFileSync, writeFileSync } from 'fs'
import { globSync } from 'glob'
import path from 'path'

const root = process.cwd()

const storiesFiles = globSync('src/components/**/*.stories.@(js|ts|tsx)', {
	cwd: root,
	absolute: true,
})

const rules = {
	booleanPrefixes: ['is', 'has', 'can', 'should'],
	eventPrefix: 'on',
	forbiddenPublicProps: ['className', 'style', 'children'],
}

function extractArgTypes(content) {
	const match = content.match(/argTypes\s*:\s*{([\s\S]*?)}/)
	if (!match) return {}

	try {
		// ⚠️ simplification volontaire (on parse grossièrement)
		const objString = `{${match[1]}}`
		return eval(`(${objString})`)
	}
	catch {
		return {}
	}
}

function slugify(value) {
	return value
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '')
}

function analyzeComponent(filePath) {
	const content = readFileSync(filePath, 'utf8')

	const componentName = path.basename(filePath).replace('.stories.ts', '')

    const titleMatch = content.match(/title\s*:\s*['"`]([^'"`]+)['"`]/)
    const title = titleMatch?.[1] || componentName
    const storyPrefix = slugify(title)

	const argTypes = extractArgTypes(content)

	const props = Object.keys(argTypes)
	const propsCount = props.length

	let documented = 0
	const issues = []

	props.forEach((prop) => {
		const config = argTypes[prop] || {}

		if (rules.forbiddenPublicProps.includes(prop)) {
			issues.push(`${prop}: prop technique exposée`)
		}
		// doc
		if (config.description) {
			documented++
		}
		else {
			issues.push(`${prop}: description manquante`)
		}

		// boolean naming
		if (config.type?.name === 'boolean') {
			if (!/^(is|has|can|should)[A-Z]/.test(prop)) {
				issues.push(`${prop}: bool mal nommé`)
			}
		}

		// event naming
		if (config.type?.name === 'function') {
			if (!/^on[A-Z]/.test(prop)) {
				issues.push(`${prop}: event mal nommé`)
			}
		}

		// control inutile
		if (config.control && !config.description) {
			issues.push(`${prop}: control sans doc`)
		}
	})

	// stories count (approx)
	const storiesCount = (content.match(/export const/g) || []).length

	// score simple
	const score = propsCount
		? Math.max(0, Math.round((documented / propsCount) * 100 - issues.length * 3))
		: 100

	const priority
		= score < 50
			? 'Haute'
			: score < 80
				? 'Moyenne'
				: 'Basse'

	return {
		component: componentName,
		stories: storiesCount,
		props: propsCount,
		doc: `${documented}/${propsCount} props documentées`,
		issues,
		score,
		priority,
        title,
        storyPrefix,
	}
}

function main() {
	console.log('🔍 Analyse conformité design system...')

	const results = storiesFiles.map(file => analyzeComponent(file))

	const outputPath = path.resolve(root, 'conformite-report.json')

	writeFileSync(outputPath, JSON.stringify(results, null, 2))

	console.log(`✅ Rapport généré: ${outputPath}`)
}

main()

import { execFile } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const outputPath = resolve(rootDir, 'a11y-history-report.md')
const outputJsonPath = resolve(rootDir, 'a11y-history-data.json')
const componentsDir = resolve(rootDir, 'src/components')

const a11yKeywords = [
	'a11y',
	'accessibilité',
	'accessibility',
	'wcag',
	'aria',
	'role',
	'tabindex',
	'focus',
	'contraste',
	'clavier',
	"lecteur d'écran",
	'screen reader',
	'aria-label',
	'aria-describedby',
	'aria-live',
	'aria-hidden',
	'aria-expanded',
	'aria-invalid',
	'aria-required',
	'keyboard navigation',
	'focus trap',
	'focus visible',
	'outline',
	'color contrast',
]

const a11yPatterns = [
	/aria-[a-z]+/i,
	/\brole\s*=/i,
	/\btabindex\s*=/i,
]

const a11yPrLabels = [
	'a11y',
	'accessibility',
	'accessibilité',
	'wcag',
	'aria',
	'contrast',
	'keyboard',
	'focus',
]

// Commits / PR exclus de l'analyse : faux positifs (changements de doc ou de style
// sans impact réel sur l'accessibilité des composants, ex. retrait d'emojis dans la doc).
const excludedPrNumbers = new Set([
	'2323', // Remove emoji icons from accessibility documentation and templates (doc/style)
	'1951', // Update Vuetify 3.12.2 (bump de dépendance, pas de correction a11y ciblée)
])

// Overrides manuels de version a11y : pour les composants dont la correction d'accessibilité
// est réelle mais INDÉTECTABLE par l'analyse git (commits a11y squashés à la fusion, PR au titre
// sans mot-clé a11y…). Renseigner { version, date (JJ/MM/AAAA) } ; l'override prime sur l'analyse.
const versionOverrides = {
	SyAutocomplete: { version: '1.0.27', date: '13/05/2026' }, // a11y faite dans la PR #2176 (squash)
	SyCheckBoxGroup: { version: '1.0.21', date: '23/02/2026' }, // a11y faite dans la PR #1783 (squash)
	SyIconButton: { version: '1.0.23', date: '23/03/2026' }, // a11y faite dans la PR #1969 (squash)
	MonthPicker: { version: '1.0.23', date: '25/03/2026' }, // a11y faite dans la PR #1863 (squash)
	DeclarationAccessibilityPage: { version: '1.0.21', date: '25/02/2026' }, // a11y faite dans la PR #812 (squash)
	DataListItem: { version: '1.0.23', date: '30/03/2026' }, // sous-composant : hérite de l'a11y de DataList (#858 audit RGAA)
}

const keywordRegex = new RegExp(a11yKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'i')

function execFileAsync(cmd, args, options) {
	return new Promise((resolvePromise, rejectPromise) => {
		execFile(cmd, args, options, (error, stdout, stderr) => {
			if (error) {
				return rejectPromise(Object.assign(error, { stdout, stderr }))
			}
			resolvePromise({ stdout, stderr })
		})
	})
}

function findVueFiles(dir, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = resolve(dir, entry.name)
		if (entry.isDirectory()) {
			findVueFiles(fullPath, files)
		} else if (entry.isFile() && entry.name.endsWith('.vue')) {
			files.push(fullPath)
		}
	}
	return files
}

function discoverComponents() {
	const vueFiles = findVueFiles(componentsDir)
	return vueFiles.map(filePath => {
		const componentDir = dirname(filePath)
		const componentName = basename(filePath, '.vue')
		const allFiles = listFilesRecursive(componentDir)
		return {
			name: componentName,
			dir: componentDir,
			files: allFiles,
		}
	})
}

function listFilesRecursive(dir, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = resolve(dir, entry.name)
		if (entry.isDirectory()) {
			listFilesRecursive(fullPath, files)
		} else if (entry.isFile()) {
			files.push(fullPath)
		}
	}
	return files
}

function findMigrationFiles(componentName) {
	const migrationDirs = [resolve(rootDir, 'doc'), resolve(rootDir, '.junie')]
	const files = []
	for (const dir of migrationDirs) {
		try {
			for (const entry of readdirSync(dir, { withFileTypes: true })) {
				if (entry.name.toLowerCase().includes(componentName.toLowerCase()) && entry.name.endsWith('.md')) {
					files.push(resolve(dir, entry.name))
				}
			}
		} catch {
			// ignore missing dirs
		}
	}
	return files
}

async function getGitLog(filePaths) {
	if (!filePaths.length) return []
	const args = ['log', '--pretty=format:%H|%ad|%s', '--date=iso', '--', ...filePaths.map(p => relative(rootDir, p))]
	try {
		const { stdout } = await execFileAsync('git', args, { cwd: rootDir })
		return stdout.split('\n').filter(Boolean).map(line => {
			const [hash, date, ...messageParts] = line.split('|')
			return { hash, date, message: messageParts.join('|') }
		})
	} catch {
		return []
	}
}

async function getDiffForCommit(hash, filePaths) {
	const paths = filePaths.map(p => relative(rootDir, p))
	try {
		const { stdout } = await execFileAsync('git', ['show', hash, '--format=', '-p', '--', ...paths], { cwd: rootDir })
		return stdout
	} catch {
		return ''
	}
}

function extractPRNumber(message) {
	const match = message.match(/(?:merge pull request #|#)(\d+)/i)
	return match ? match[1] : null
}

const prLabelCache = new Map()
const packageVersionCache = new Map()
let releaseTagsPromise = null

async function getReleaseTags() {
	if (releaseTagsPromise) return releaseTagsPromise
	releaseTagsPromise = (async () => {
		const { stdout } = await execFileAsync('git', ['tag', '-l', '--sort=creatordate'], { cwd: rootDir })
		const tags = stdout.split('\n').filter(Boolean)
		const semverTags = tags.filter(tag => /^v?\d+\.\d+\.\d+/.test(tag))
		const tagInfos = []
		for (const tag of semverTags) {
			try {
				const { stdout } = await execFileAsync('git', ['log', '-1', '--format=%ad|%H', '--date=iso', `${tag}^{}`], { cwd: rootDir })
				const [date, hash] = stdout.trim().split('|')
				if (date && hash) tagInfos.push({ tag, date, hash })
			} catch {
				// ignore unreadable tags
			}
		}
		return tagInfos.sort((a, b) => new Date(a.date) - new Date(b.date))
	})()
	return releaseTagsPromise
}

function getNextReleaseTag(commitDate, tagInfos) {
	const commitTime = new Date(commitDate).getTime()
	for (const tag of tagInfos) {
		if (new Date(tag.date).getTime() > commitTime) {
			return tag.tag
		}
	}
	return null
}

async function getPackageVersionAtCommit(hash) {
	if (packageVersionCache.has(hash)) return packageVersionCache.get(hash)
	try {
		const { stdout } = await execFileAsync('git', ['show', `${hash}:package.json`], { cwd: rootDir })
		const parsed = JSON.parse(stdout)
		const version = parsed.version ? parsed.version.replace(/^v/i, '') : null
		packageVersionCache.set(hash, version)
		return version
	} catch {
		packageVersionCache.set(hash, null)
		return null
	}
}

async function getPRLabels(prNumber) {
	if (!prNumber) return []
	if (prLabelCache.has(prNumber)) return prLabelCache.get(prNumber)
	try {
		const { stdout } = await execFileAsync('gh', ['pr', 'view', prNumber, '--json', 'labels'], { cwd: rootDir })
		const parsed = JSON.parse(stdout)
		const labels = (parsed.labels || []).map(l => l.name)
		prLabelCache.set(prNumber, labels)
		return labels
	} catch {
		prLabelCache.set(prNumber, [])
		return []
	}
}

function hasA11yLabel(labels) {
	return labels.some(label => a11yPrLabels.some(keyword => label.toLowerCase().includes(keyword.toLowerCase())))
}

function hasA11yPatterns(diff) {
	return a11yPatterns.some(pattern => pattern.test(diff))
}

function hasA11yKeywords(message) {
	return keywordRegex.test(message)
}

function isAccessibilityMdx(filePath) {
	const normalized = filePath.replace(/\\/g, '/').toLowerCase()
	return normalized.includes('/accessibilite/') && normalized.endsWith('.mdx')
}

function isA11yTest(filePath) {
	const normalized = filePath.replace(/\\/g, '/').toLowerCase()
	return normalized.includes('.a11y.') && (normalized.endsWith('.spec.ts') || normalized.endsWith('.test.ts'))
}

function isMigrationFile(filePath) {
	const normalized = filePath.replace(/\\/g, '/').toLowerCase()
	return normalized.includes('/doc/') || normalized.includes('/.junie/')
}

async function analyzeComponent(component) {
	const migrationFiles = findMigrationFiles(component.name)
	const allTrackedFiles = [...component.files, ...migrationFiles]
	const commits = await getGitLog(allTrackedFiles)
	const results = []

	for (const commit of commits) {
		const diff = await getDiffForCommit(commit.hash, allTrackedFiles)
		const keywords = hasA11yKeywords(commit.message)
		const patterns = hasA11yPatterns(diff)
		const prNumber = extractPRNumber(commit.message)
		// Ignore les PR exclus (faux positifs doc/style)
		if (prNumber && excludedPrNumbers.has(String(prNumber))) {
			continue
		}
		const labels = await getPRLabels(prNumber)
		const a11yLabel = hasA11yLabel(labels)

		const touchedMdx = component.files.some(isAccessibilityMdx)
		const touchedA11yTest = component.files.some(isA11yTest)
		const touchedMigration = migrationFiles.length > 0
		const touchedComponent = component.files.some(f => f.endsWith('.vue'))

		let confidence = null

		if (keywords && (touchedMdx || touchedA11yTest || a11yLabel)) {
			confidence = 'forte'
		} else if (keywords && (touchedComponent || touchedMigration)) {
			confidence = 'moyenne'
		} else if (patterns) {
			confidence = 'faible'
		}

		if (confidence) {
			const releaseTags = await getReleaseTags()
			let version = getNextReleaseTag(commit.date, releaseTags)
			if (!version) {
				version = await getPackageVersionAtCommit(commit.hash)
			}
			results.push({
				...commit,
				confidence,
				keywords,
				patterns,
				a11yLabel,
				labels: labels.length ? labels : undefined,
				version,
			})
		}
	}

	return results
}

function buildJsonData(components) {
	const data = {}
	for (const component of components) {
		if (!component.commits.length) continue
		// Ne retient que la dernière correction "fiable" (confiance forte ou moyenne).
		// On ignore les commits "faible" (pattern aria-* seul : bumps de dépendance,
		// refontes de tokens, snapshots…) qui ne sont pas de vraies corrections a11y.
		const reliable = component.commits.find(
			c => c.confidence === 'forte' || c.confidence === 'moyenne',
		)
		if (!reliable) continue
		data[component.name] = {
			version: reliable.version ? reliable.version.replace(/^v/i, '') : null,
			date: new Date(reliable.date).toLocaleDateString('fr-FR'),
			dateIso: reliable.date,
		}
	}

	// Overrides manuels : priment sur l'analyse, mais uniquement pour les composants du périmètre
	// analysé (sinon, en mode ciblé, le merge avec l'existant s'en charge).
	for (const [name, ov] of Object.entries(versionOverrides)) {
		if (components.some(c => c.name === name)) {
			data[name] = { version: ov.version, date: ov.date, dateIso: ov.dateIso || ov.date, override: true }
		}
	}
	return data
}

function buildMarkdown(components) {
	const lines = [
		'# Rapport d’historique d’accessibilité par composant',
		'',
		`- Généré le: ${new Date().toISOString()}`,
		'',
	]

	for (const component of components) {
		lines.push(`## ${component.name}`)
		lines.push('')

		if (!component.commits.length) {
			lines.push('Aucune amélioration d’accessibilité détectée.')
			lines.push('')
			continue
		}

		for (const commit of component.commits) {
			const badges = []
			if (commit.keywords) badges.push('mot-clé a11y')
			if (commit.patterns) badges.push('pattern ARIA')
			if (commit.a11yLabel) badges.push('label PR a11y')
			const formattedDate = new Date(commit.date).toLocaleDateString('fr-FR')
			const versionInfo = commit.version ? `Release: \`${commit.version}\` · ` : ''
			lines.push(`- **${formattedDate}** — ${commit.message}  `)
			lines.push(`  ${versionInfo}Hash: \`${commit.hash}\` | ${badges.length ? badges.join(' · ') : 'signal détecté'}`)
			if (commit.labels) {
				lines.push(`  Labels PR: ${commit.labels.map(l => `\`${l}\``).join(', ')}`)
			}
			lines.push('')
		}
	}

	return lines.join('\n')
}

async function main() {
	const targetNames = process.argv.slice(2).filter(Boolean).map(n => n.toLowerCase())

	console.info(' Découverte des composants...')
	const allComponents = discoverComponents()
	const components = targetNames.length
		? allComponents.filter(c => targetNames.includes(c.name.toLowerCase()))
		: allComponents

	if (targetNames.length && !components.length) {
		console.error(`Aucun composant trouvé parmi: ${targetNames.join(', ')}`)
		process.exit(1)
	}

	const notFound = targetNames.filter(n => !components.some(c => c.name.toLowerCase() === n))
	if (notFound.length) {
		console.warn(`⚠️  Composants introuvables: ${notFound.join(', ')}`)
	}

	console.info(`📦 ${components.length} composant(s) à analyser`)

	const results = []
	for (const component of components) {
		console.info(`⏳ Analyse de ${component.name}...`)
		const commits = await analyzeComponent(component)
		results.push({ name: component.name, commits })
	}

	const markdown = buildMarkdown(results)
	writeFileSync(outputPath, markdown, 'utf8')
	console.info(`\n✅ Rapport généré: ${outputPath}`)

	const newJsonData = buildJsonData(results)
	let finalJsonData = newJsonData
	if (targetNames.length && existsSync(outputJsonPath)) {
		const existing = JSON.parse(readFileSync(outputJsonPath, 'utf8'))
		finalJsonData = { ...existing, ...newJsonData }
	}
	writeFileSync(outputJsonPath, JSON.stringify(finalJsonData, null, 2), 'utf8')
	console.info(`✅ Données JSON générées: ${outputJsonPath}`)

	const total = results.reduce((sum, c) => sum + c.commits.length, 0)
	console.info(`📊 ${total} commit(s) d’accessibilité détecté(s)`)
}

main().catch(err => {
	console.error('Erreur lors de la génération du rapport:', err)
	process.exit(1)
})

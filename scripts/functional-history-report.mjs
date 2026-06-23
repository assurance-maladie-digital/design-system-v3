/**
 * functional-history-report.mjs
 *
 * Analyse l'historique git par composant pour détecter la dernière
 * modification fonctionnelle (feat, fix, refactor, perf, etc.)
 * et génère functional-history-data.json.
 *
 * Usage :
 *   node scripts/functional-history-report.mjs
 *   node scripts/functional-history-report.mjs Accordion DatePicker
 */

import { execFile } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const outputJsonPath = resolve(rootDir, 'functional-history-data.json')
const componentsDir = resolve(rootDir, 'src/components')

// Mots-clés qui signalent un commit purement a11y (à exclure du badge fonctionnel)
const a11yOnlyRegex = /a11y|accessibilit|wcag|aria[-\s]|contraste|audit.access|rgaa/i

// Mots-clés qui signalent un commit de release/ci/doc (à exclure)
const releaseOrDocRegex = /^(chore|docs?|ci|build|release|bump|renovate|update dependency|update .* monorepo)(\([^)]+\))?[!:\s]/i

// Commits qui ne touchent que de la doc/config (message contient ces mots)
const docOnlyMessageRegex = /version badge|add.*badge|badge.*version|update.*changelog|run lint|improve.*doc|improve.*token/i

function execFileAsync(cmd, args, options) {
	return new Promise((res, rej) => {
		execFile(cmd, args, options, (error, stdout, stderr) => {
			if (error) return rej(Object.assign(error, { stdout, stderr }))
			res({ stdout, stderr })
		})
	})
}

function findVueFiles(dir, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = resolve(dir, entry.name)
		if (entry.isDirectory()) findVueFiles(fullPath, files)
		else if (entry.isFile() && entry.name.endsWith('.vue')) files.push(fullPath)
	}
	return files
}

function listFilesRecursive(dir, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = resolve(dir, entry.name)
		if (entry.isDirectory()) listFilesRecursive(fullPath, files)
		else if (entry.isFile()) files.push(fullPath)
	}
	return files
}

function discoverComponents() {
	const vueFiles = findVueFiles(componentsDir)
	return vueFiles.map(filePath => ({
		name: basename(filePath, '.vue'),
		dir: dirname(filePath),
		files: listFilesRecursive(dirname(filePath)),
	}))
}

// Fichiers sources pertinents (pas de doc, pas de config)
const sourceExtensions = ['.vue', '.ts', '.js', '.scss', '.css']

async function getChangedFiles(hash) {
	try {
		const { stdout } = await execFileAsync(
			'git', ['diff-tree', '--no-commit-id', '-r', '--name-only', hash],
			{ cwd: rootDir },
		)
		return stdout.split('\n').filter(Boolean)
	} catch {
		return []
	}
}

async function getLastFunctionalCommit(filePaths) {
	if (!filePaths.length) return null

	// On ne passe en argument que les fichiers sources réels (pas de stories, tests, .mdx)
	const sourceFiles = filePaths.filter(p => {
		if (!sourceExtensions.some(ext => p.endsWith(ext))) return false
		if (p.includes('.stories.')) return false
		if (p.includes('.spec.') || p.includes('.cy.') || p.includes('__tests__')) return false
		return true
	})
	if (!sourceFiles.length) return null

	const args = [
		'log',
		'--diff-filter=ACM',
		'--pretty=format:%H|%ad|%s',
		'--date=iso',
		'--',
		...sourceFiles.map(p => relative(rootDir, p)),
	]
	try {
		const { stdout } = await execFileAsync('git', args, { cwd: rootDir })
		const commits = stdout.split('\n').filter(Boolean).map(line => {
			const [hash, date, ...msgParts] = line.split('|')
			return { hash, date, message: msgParts.join('|') }
		})

		for (const commit of commits) {
			const msg = commit.message.trim()
			// Exclure les commits purement a11y, release, ci, doc
			if (a11yOnlyRegex.test(msg)) continue
			if (releaseOrDocRegex.test(msg)) continue
			if (docOnlyMessageRegex.test(msg)) continue
			// Vérifier que le commit touche bien un .vue/.ts dans le dossier du composant
			const changed = await getChangedFiles(commit.hash)
			const toSlash = p => p.split('\\').join('/')
			const componentDirRelative = toSlash(relative(rootDir, dirname(sourceFiles[0])))
			const touchesComponentSource = changed.some(f => {
				const normalized = toSlash(f)
				// Doit être un fichier source (pas .mdx/.md/.stories/.spec)
				if (!/\.(vue|ts|js|scss|css)$/.test(normalized)) return false
				if (normalized.includes('.stories.') || normalized.includes('.spec.') || normalized.includes('.cy.')) return false
				return normalized.startsWith(componentDirRelative + '/')
			})
			if (touchesComponentSource) return commit
		}
		return null
	} catch {
		return null
	}
}

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

async function main() {
	const targetNames = process.argv.slice(2).filter(Boolean).map(n => n.toLowerCase())

	console.info('🔍 Découverte des composants...')
	const allComponents = discoverComponents()
	const components = targetNames.length
		? allComponents.filter(c => targetNames.includes(c.name.toLowerCase()))
		: allComponents

	if (targetNames.length && !components.length) {
		console.error(`Aucun composant trouvé parmi: ${targetNames.join(', ')}`)
		process.exit(1)
	}

	const notFound = targetNames.filter(n => !components.some(c => c.name.toLowerCase() === n))
	if (notFound.length) console.warn(`⚠️  Composants introuvables: ${notFound.join(', ')}`)

	console.info(`📦 ${components.length} composant(s) à analyser`)

	const newData = {}
	let found = 0

	for (const component of components) {
		console.info(`⏳ Analyse de ${component.name}...`)
		const commit = await getLastFunctionalCommit(component.files)
		if (commit) {
			const releaseTags = await getReleaseTags()
			let version = getNextReleaseTag(commit.date, releaseTags)
			if (!version) {
				version = await getPackageVersionAtCommit(commit.hash)
			} else {
				version = version.replace(/^v/i, '')
			}
			newData[component.name] = {
				version: version ?? null,
				date: new Date(commit.date).toLocaleDateString('fr-FR'),
				dateIso: commit.date,
				message: commit.message,
			}
			found++
		}
	}

	let finalData = newData
	if (targetNames.length && existsSync(outputJsonPath)) {
		const existing = JSON.parse(readFileSync(outputJsonPath, 'utf8'))
		finalData = { ...existing, ...newData }
	}

	writeFileSync(outputJsonPath, JSON.stringify(finalData, null, 2), 'utf8')
	console.info(`\n✅ Données JSON générées: ${outputJsonPath}`)
	console.info(`📊 ${found} composant(s) avec commit fonctionnel détecté`)
}

main().catch(err => {
	console.error('Erreur lors de la génération du rapport:', err)
	process.exit(1)
})

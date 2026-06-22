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

// Préfixes de commits conventionnels fonctionnels
const functionalPrefixes = [
	'feat',
	'fix',
	'refactor',
	'perf',
	'revert',
]

// Mots-clés à exclure pour ne pas confondre avec des commits purement a11y/doc/chore
const excludeOnlyKeywords = [
	'chore',
	'docs',
	'test',
	'ci',
	'style',
	'build',
]

const functionalPrefixRegex = new RegExp(
	`^(${functionalPrefixes.join('|')})(\\([^)]+\\))?[!:]`,
	'i',
)

const excludeOnlyRegex = new RegExp(
	`^(${excludeOnlyKeywords.join('|')})(\\([^)]+\\))?[!:]`,
	'i',
)

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

async function getLastFunctionalCommit(filePaths) {
	if (!filePaths.length) return null
	const args = [
		'log',
		'--pretty=format:%H|%ad|%s',
		'--date=iso',
		'--',
		...filePaths.map(p => relative(rootDir, p)),
	]
	try {
		const { stdout } = await execFileAsync('git', args, { cwd: rootDir })
		const commits = stdout.split('\n').filter(Boolean).map(line => {
			const [hash, date, ...msgParts] = line.split('|')
			return { hash, date, message: msgParts.join('|') }
		})

		for (const commit of commits) {
			const msg = commit.message.trim()
			// Exclure les commits purement docs/chore/test/ci/style
			if (excludeOnlyRegex.test(msg) && !functionalPrefixRegex.test(msg)) continue
			// Garder feat/fix/refactor/perf/revert ou tout commit sans préfixe exclu
			if (functionalPrefixRegex.test(msg) || !excludeOnlyRegex.test(msg)) {
				return commit
			}
		}
		return null
	} catch {
		return null
	}
}

const versionCache = new Map()

async function getVersionAtCommit(hash) {
	if (versionCache.has(hash)) return versionCache.get(hash)
	try {
		const { stdout } = await execFileAsync('git', ['show', `${hash}:package.json`], { cwd: rootDir })
		const version = JSON.parse(stdout).version ?? null
		versionCache.set(hash, version)
		return version
	} catch {
		versionCache.set(hash, null)
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
			const version = await getVersionAtCommit(commit.hash)
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

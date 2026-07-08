/**
 * docs-check-update.mjs
 *
 * Prend une liste de composants, vérifie si des commits fonctionnels
 * ou a11y sont apparus DEPUIS la dernière mise à jour enregistrée dans
 * les JSON, et met à jour uniquement ce qui a changé.
 *
 * Usage :
 *   pnpm docs:check Accordion DatePicker SyCheckbox
 */

import { execFile } from 'node:child_process'
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const dataDir = resolve(rootDir, 'scripts/data')
const a11yJsonPath = resolve(dataDir, 'a11y-history-data.json')
const funcJsonPath = resolve(dataDir, 'functional-history-data.json')
const componentsDir = resolve(rootDir, 'src/components')

const targetNames = process.argv.slice(2).filter(Boolean)

if (!targetNames.length) {
	console.error('Usage : pnpm docs:check Composant1 Composant2 ...')
	console.error('Pour mettre a jour tous les composants, utilisez : pnpm docs:update')
	process.exit(1)
}

// --- helpers git ---

function execFileAsync(cmd, args, options) {
	return new Promise((res, rej) => {
		execFile(cmd, args, options, (error, stdout) => {
			if (error) return rej(error)
			res(stdout)
		})
	})
}

// --- découverte composants ---

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
	return findVueFiles(componentsDir).map(filePath => ({
		name: basename(filePath, '.vue'),
		dir: dirname(filePath),
		files: listFilesRecursive(dirname(filePath)),
	}))
}

// --- vérification des commits depuis une date ---

async function hasNewCommitsSince(filePaths, sinceIso, typeFilter) {
	if (!filePaths.length) return false

	const args = [
		'log',
		`--after=${sinceIso}`,
		'--pretty=format:%s',
		'--',
		...filePaths.map(p => relative(rootDir, p)),
	]

	try {
		const stdout = await execFileAsync('git', args, { cwd: rootDir })
		const commits = stdout.split('\n').filter(Boolean)
		if (!commits.length) return false

		if (typeFilter === 'func') {
			const funcRx = /^(feat|fix|refactor|perf|revert)(\([^)]+\))?[!:]/i
			const excludeRx = /^(chore|docs|test|ci|style|build)(\([^)]+\))?[!:]/i
			return commits.some(msg => funcRx.test(msg) || !excludeRx.test(msg))
		}

		if (typeFilter === 'a11y') {
			const a11yKw = /a11y|accessibilit|wcag|aria|focus|tabindex|contraste|clavier|keyboard|screen.?reader|lecteur.?d.?\u00e9cran/i
			return commits.some(msg => a11yKw.test(msg))
		}

		return true
	} catch {
		return false
	}
}

// --- chargement JSON existants ---

const a11yData = existsSync(a11yJsonPath)
	? JSON.parse(readFileSync(a11yJsonPath, 'utf8'))
	: {}

const funcData = existsSync(funcJsonPath)
	? JSON.parse(readFileSync(funcJsonPath, 'utf8'))
	: {}

// --- script orchestrateur ---

function run(script, args = []) {
	return new Promise((res, rej) => {
		execFile(
			process.execPath,
			[resolve(rootDir, 'scripts', script), ...args],
			{ cwd: rootDir },
			(err, stdout, stderr) => {
				if (stdout) process.stdout.write(stdout)
				if (stderr) process.stderr.write(stderr)
				if (err) rej(err)
				else res()
			},
		)
	})
}

// --- main ---

const startTime = Date.now()

console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.info('  docs:check — Verification + mise a jour')
console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.info(`\nComposants verifies : ${targetNames.join(', ')}\n`)

const allComponents = discoverComponents()
const components = allComponents.filter(c =>
	targetNames.some(n => n.toLowerCase() === c.name.toLowerCase()),
)

const notFound = targetNames.filter(n =>
	!allComponents.some(c => c.name.toLowerCase() === n.toLowerCase()),
)
if (notFound.length) {
	console.warn(`Composants introuvables : ${notFound.join(', ')}`)
}

const needFuncUpdate = []
const needA11yUpdate = []

console.info('--- Verification des changements depuis la derniere MAJ ---\n')

for (const component of components) {
	const funcEntry = funcData[component.name]
	const a11yEntry = a11yData[component.name]

	const funcSince = funcEntry?.dateIso ?? '2000-01-01'
	const a11ySince = a11yEntry?.dateIso ?? '2000-01-01'

	const [hasFunc, hasA11y] = await Promise.all([
		hasNewCommitsSince(component.files, funcSince, 'func'),
		hasNewCommitsSince(component.files, a11ySince, 'a11y'),
	])

	const funcStatus = hasFunc ? 'NOUVEAU commit fonctionnel detecte' : 'aucun changement fonctionnel'
	const a11yStatus = hasA11y ? 'NOUVEAU commit a11y detecte' : 'aucun changement a11y'

	console.info(`  ${component.name}`)
	console.info(`    Fonctionnel : ${funcStatus}`)
	console.info(`    A11y        : ${a11yStatus}`)

	if (hasFunc) needFuncUpdate.push(component.name)
	if (hasA11y) needA11yUpdate.push(component.name)
}

console.info('')

if (!needFuncUpdate.length && !needA11yUpdate.length) {
	console.info('Tous les badges sont deja a jour. Aucune mise a jour necessaire.')
	const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
	console.info(`\nTermine en ${elapsed}s`)
	console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
	process.exit(0)
}

if (needFuncUpdate.length) {
	console.info(`--- Mise a jour fonctionnelle : ${needFuncUpdate.join(', ')} ---`)
	try {
		await run('functional-history-report.mjs', needFuncUpdate)
		await run('inject-functional-version.mjs', needFuncUpdate)
	} catch (err) {
		console.error(`Echec mise a jour fonctionnelle : ${err.message}`)
		process.exit(1)
	}
}

if (needA11yUpdate.length) {
	console.info(`\n--- Mise a jour a11y : ${needA11yUpdate.join(', ')} ---`)
	try {
		await run('a11y-history-report.mjs', needA11yUpdate)
		await run('inject-a11y-version.mjs', needA11yUpdate)
	} catch (err) {
		console.error(`Echec mise a jour a11y : ${err.message}`)
		process.exit(1)
	}
}

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
console.info(`\nTermine en ${elapsed}s`)
console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

/**
 * inject-functional-version.mjs
 *
 * Lit functional-history-data.json et injecte (ou met à jour) le badge
 * "Dernière mise à jour fonctionnelle : Vx.x.x - JJ/MM/AAAA"
 * dans chaque NomComposant.mdx, AU-DESSUS du badge a11y.
 *
 * Usage :
 *   node scripts/inject-functional-version.mjs
 *   node scripts/inject-functional-version.mjs --dry-run
 *   node scripts/inject-functional-version.mjs Accordion DatePicker
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const jsonPath = resolve(rootDir, 'scripts/data/functional-history-data.json')
const componentsDir = resolve(rootDir, 'src/components')
const dryRun = process.argv.includes('--dry-run')

const targetComponents = process.argv.slice(2)
	.filter(a => !a.startsWith('--'))
	.map(a => a.toLowerCase())

const FUNC_BADGE_START = '{/* func-version-start */}'
const FUNC_BADGE_END = '{/* func-version-end */}'
const A11Y_BADGE_START = '{/* a11y-version-start */}'

if (!existsSync(jsonPath)) {
	console.error(`❌ Fichier introuvable: ${jsonPath}`)
	console.error('   Lancez d\'abord: pnpm func:history')
	process.exit(1)
}

const historyData = JSON.parse(readFileSync(jsonPath, 'utf8'))

function findMainMdxFiles(dir, results = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = join(dir, entry.name)
		if (entry.isDirectory()) {
			const name = entry.name.toLowerCase()
			if (name === 'accessibilite' || name === 'accessibility') continue
			findMainMdxFiles(fullPath, results)
		} else if (entry.isFile() && entry.name.endsWith('.mdx')) {
			const nameWithoutExt = basename(entry.name, '.mdx')
			if (
				nameWithoutExt === 'Usages' ||
				nameWithoutExt === 'Introduction' ||
				nameWithoutExt === 'SelectOverview' ||
				nameWithoutExt === 'DatePickerOverview' ||
				nameWithoutExt === 'Accessibility'
			) continue
			results.push({ path: fullPath, componentName: nameWithoutExt })
		}
	}
	return results
}

function buildBadge(version, date) {
	const versionText = version ? `V${version} - ` : ''
	return `${FUNC_BADGE_START}\n<p className="func-version-badge">Dernière mise à jour fonctionnelle : ${versionText}${date}</p>\n${FUNC_BADGE_END}`
}

function injectOrUpdateBadge(content, badge) {
	// Mise à jour si badge fonctionnel déjà présent
	if (content.includes(FUNC_BADGE_START)) {
		return content.replace(
			new RegExp(`\\{/\\* func-version-start \\*/\\}[\\s\\S]*?\\{/\\* func-version-end \\*/\\}`),
			badge,
		)
	}

	// Insérer AVANT le badge a11y s'il existe
	const a11yIdx = content.indexOf(A11Y_BADGE_START)
	if (a11yIdx !== -1) {
		return content.slice(0, a11yIdx) + badge + '\n' + content.slice(a11yIdx)
	}

	// Fallback : après </div> du header (uniquement si le header existe réellement, sinon
	// indexOf('</div>', -1) trouverait un </div> quelconque, ex. dans un bloc de code d'exemple).
	const headerDivStart = content.indexOf('<div className="header">')
	if (headerDivStart !== -1) {
		const headerDivClose = content.indexOf('</div>', headerDivStart)
		if (headerDivClose !== -1) {
			const insertAt = headerDivClose + '</div>'.length
			return content.slice(0, insertAt) + '\n\n' + badge + '\n' + content.slice(insertAt)
		}
	}

	// Fallback : après </h1>
	const h1Close = content.indexOf('</h1>')
	if (h1Close !== -1) {
		const insertAt = h1Close + '</h1>'.length
		return content.slice(0, insertAt) + '\n\n' + badge + '\n' + content.slice(insertAt)
	}

	// Fallback : après titre markdown # Titre
	const mdH1Match = content.match(/^#\s+.+$/m)
	if (mdH1Match && mdH1Match.index !== undefined) {
		const insertAt = mdH1Match.index + mdH1Match[0].length
		return content.slice(0, insertAt) + '\n\n' + badge + '\n' + content.slice(insertAt)
	}

	return null
}

function resolveComponentHistory(componentName, filePath) {
	if (historyData[componentName]) return historyData[componentName]
	const lower = componentName.toLowerCase()
	for (const [key, value] of Object.entries(historyData)) {
		if (key.toLowerCase() === lower) return value
	}
	let dir = dirname(filePath)
	while (dir !== componentsDir && dir.startsWith(componentsDir)) {
		const dirName = basename(dir)
		if (historyData[dirName]) return historyData[dirName]
		const dirLower = dirName.toLowerCase()
		for (const [key, value] of Object.entries(historyData)) {
			if (key.toLowerCase() === dirLower) return value
		}
		dir = dirname(dir)
	}
	return null
}

const mdxFiles = findMainMdxFiles(componentsDir)
let updated = 0
let skipped = 0
let noData = 0

for (const { path: filePath, componentName } of mdxFiles) {
	if (targetComponents.length > 0 && !targetComponents.includes(componentName.toLowerCase())) continue

	const info = resolveComponentHistory(componentName, filePath)
	if (!info) {
		noData++
		continue
	}

	const original = readFileSync(filePath, 'utf8')
	const badge = buildBadge(info.version, info.date)
	const modified = injectOrUpdateBadge(original, badge)

	if (modified === null) {
		console.warn(`⚠️  Pas de point d'insertion trouvé: ${filePath}`)
		skipped++
		continue
	}

	if (modified === original) {
		skipped++
		continue
	}

	if (dryRun) {
		console.info(`[dry-run] Mise à jour: ${filePath}`)
	} else {
		writeFileSync(filePath, modified, 'utf8')
		console.info(`✅ Mis à jour: ${componentName} → v${info.version ?? '?'} · ${info.date}`)
	}
	updated++
}

console.info(`\n📊 ${updated} fichier(s) mis à jour, ${skipped} ignoré(s), ${noData} sans données`)
if (dryRun) console.info('ℹ️  Mode dry-run : aucun fichier modifié')

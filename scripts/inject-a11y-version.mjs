/**
 * inject-a11y-version.mjs
 *
 * Lit a11y-history-data.json et injecte (ou met à jour) la ligne
 * "Dernière mise à jour accessibilité : X.X.X · JJ/MM/AAAA"
 * dans chaque NomComposant.mdx principal (sous le <h1>).
 *
 * Usage :
 *   node scripts/inject-a11y-version.mjs
 *   node scripts/inject-a11y-version.mjs --dry-run
 *   node scripts/inject-a11y-version.mjs Accordion DatePicker SyCheckbox
 *   node scripts/inject-a11y-version.mjs --dry-run Accordion DatePicker
 */

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const jsonPath = resolve(rootDir, 'scripts/data/a11y-history-data.json')
const componentsDir = resolve(rootDir, 'src/components')
const dryRun = process.argv.includes('--dry-run')

// Liste de composants ciblés (args positionnels hors flags)
const targetComponents = process.argv.slice(2)
	.filter(a => !a.startsWith('--'))
	.map(a => a.toLowerCase())

const A11Y_BADGE_START = '{/* a11y-version-start */}'
const A11Y_BADGE_END = '{/* a11y-version-end */}'

if (!existsSync(jsonPath)) {
	console.error(`❌ Fichier introuvable: ${jsonPath}`)
	console.error('   Lancez d\'abord: pnpm a11y:history')
	process.exit(1)
}

const historyData = JSON.parse(readFileSync(jsonPath, 'utf8'))

function findMainMdxFiles(dir, results = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const fullPath = join(dir, entry.name)
		if (entry.isDirectory()) {
			const normalizedName = entry.name.toLowerCase()
			if (normalizedName === 'accessibilite' || normalizedName === 'accessibility') continue
			findMainMdxFiles(fullPath, results)
		} else if (entry.isFile() && entry.name.endsWith('.mdx')) {
			const nameWithoutExt = basename(entry.name, '.mdx')
			const parentDir = basename(dirname(fullPath))
			if (
				nameWithoutExt === 'Usages' ||
				nameWithoutExt === 'Introduction' ||
				nameWithoutExt === 'SelectOverview' ||
				nameWithoutExt === 'DatePickerOverview' ||
				nameWithoutExt === 'Accessibility'
			) continue
			results.push({ path: fullPath, componentName: nameWithoutExt, parentDir })
		}
	}
	return results
}

function buildBadge(version, date) {
	const versionText = version ? `V${version} - ` : ''
	return `${A11Y_BADGE_START}\n<p className="a11y-version-badge">Dernière mise à jour accessibilité : ${versionText}${date}</p>\n${A11Y_BADGE_END}`
}

const LEGACY_START = '<!-- a11y-version-start -->'
const LEGACY_END = '<!-- a11y-version-end -->'

function injectOrUpdateBadge(content, badge) {
	if (content.includes(LEGACY_START)) {
		return content.replace(
			new RegExp(`${LEGACY_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?${LEGACY_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`),
			badge,
		)
	}

	if (content.includes(A11Y_BADGE_START)) {
		return content.replace(
			new RegExp(`\\{/\\* a11y-version-start \\*/\\}[\\s\\S]*?\\{/\\* a11y-version-end \\*/\\}`),
			badge,
		)
	}

	// Injecter après la fermeture du </div> du header (pattern <div className="header">...</div>)
	// Important : ne prendre cette branche que si le header existe réellement, sinon
	// indexOf('</div>', -1) trouverait un </div> quelconque (ex. dans un bloc de code d'exemple).
	const headerDivStart = content.indexOf('<div className="header">')
	if (headerDivStart !== -1) {
		const headerDivClose = content.indexOf('</div>', headerDivStart)
		if (headerDivClose !== -1) {
			const insertAt = headerDivClose + '</div>'.length
			return content.slice(0, insertAt) + '\n\n' + badge + '\n' + content.slice(insertAt)
		}
	}

	// Fallback : après le premier <h1>
	const h1Close = content.indexOf('</h1>')
	if (h1Close !== -1) {
		const insertAt = h1Close + '</h1>'.length
		return content.slice(0, insertAt) + '\n\n' + badge + '\n' + content.slice(insertAt)
	}

	// Fallback : après le premier titre markdown (# Titre\n)
	const mdH1Match = content.match(/^#\s+.+$/m)
	if (mdH1Match && mdH1Match.index !== undefined) {
		const insertAt = mdH1Match.index + mdH1Match[0].length
		return content.slice(0, insertAt) + '\n\n' + badge + '\n' + content.slice(insertAt)
	}

	return null
}

function resolveComponentHistory(componentName, filePath) {
	// Cherche d'abord par nom exact de fichier .mdx
	if (historyData[componentName]) return historyData[componentName]
	const lower = componentName.toLowerCase()
	for (const [key, value] of Object.entries(historyData)) {
		if (key.toLowerCase() === lower) return value
	}
	// Remonte l'arborescence pour trouver un composant parent connu
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

console.info(`\n📊 ${updated} fichier(s) mis à jour, ${skipped} ignoré(s), ${noData} sans données a11y`)
if (dryRun) console.info('ℹ️  Mode dry-run : aucun fichier modifié')

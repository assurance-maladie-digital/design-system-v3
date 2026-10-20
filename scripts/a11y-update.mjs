/**
 * a11y-update.mjs
 *
 * Orchestrateur : analyse git (fonctionnel + a11y) pour une liste de composants,
 * met à jour les JSON (merge), puis injecte les deux badges dans les .mdx.
 *
 * Usage :
 *   pnpm docs:update Accordion DatePicker SyCheckbox
 *   pnpm docs:update                   (tous les composants — long)
 */

import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const components = process.argv.slice(2).filter(Boolean)

// Sortie de l'étape relayée en direct : avec `execFile`, elle n'apparaissait qu'à la fin
// de l'étape et l'analyse a11y (plusieurs minutes) donnait l'impression d'être bloquée.
function run(script, args = []) {
	return new Promise((res, rej) => {
		const child = spawn(
			process.execPath,
			[resolve(rootDir, 'scripts', script), ...args],
			{ cwd: rootDir, stdio: 'inherit' },
		)
		child.on('error', rej)
		child.on('close', (code) => {
			if (code === 0) res()
			else rej(new Error(`${script} s'est terminé avec le code ${code}`))
		})
	})
}

const startTime = Date.now()

console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.info('  docs:update — Badges version docs')
console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

if (components.length) {
	console.info(`\n� Composants ciblés : ${components.join(', ')}`)
	console.info('   (mode rapide — merge dans les JSON existants)\n')
} else {
	console.info('\n� Mode complet — tous les composants')
	console.info('   ⚠️  Cette opération peut prendre plusieurs minutes.\n')
}

async function step(label, script) {
	console.info(`\n--- ${label} ---`)
	try {
		await run(script, components)
	} catch (err) {
		console.error(`\nEchec : ${label}`)
		console.error(`  Detail : ${err.message}`)
		process.exit(1)
	}
}

await step('Etape 1/6 : Analyse git fonctionnelle', 'functional-history-report.mjs')
await step('Etape 2/6 : Injection badges fonctionnels', 'inject-functional-version.mjs')
await step('Etape 3/6 : Analyse git accessibilite', 'a11y-history-report.mjs')
await step('Etape 4/6 : Injection badges a11y', 'inject-a11y-version.mjs')
await step('Etape 5/6 : Regeneration du tableau d\'avancement (a11y-status.json)', 'generate-a11y-report.mjs')
await step('Etape 6/6 : Generation des infos composants (component-info.json)', 'generate-component-info.mjs')

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
console.info(`\nTermine en ${elapsed}s`)
console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

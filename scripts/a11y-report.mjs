import { execFile } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)))
const dataDir = resolve(rootDir, 'scripts/data')
const rawReportPath = resolve(dataDir, 'a11y-raw.json')
const summaryJsonPath = resolve(dataDir, 'a11y-report.json')
const summaryMdPath = resolve(dataDir, 'a11y-report.md')

const ansiRegex = new RegExp('\u001B\[[0-9;]*m', 'g')

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

function deriveComponentName(filePath) {
	const normalized = filePath.replace(/\\/g, '/').replace(/^file:\/*/, '')
	const match = normalized.match(/src\/components\/(.+?)\/tests\//)
	if (match?.[1]) {
		return match[1].split('/').pop()
	}
	return normalized
}

function cleanMessage(msg) {
	return msg.replace(ansiRegex, '').trim()
}

function aggregateFailures(testResults) {
	const components = new Map()

	for (const suite of testResults || []) {
		const failedAssertions = (suite.assertionResults || []).filter(a => a.status === 'failed')
		if (!failedAssertions.length) continue

		const component = deriveComponentName(suite.name || suite.file || suite.id || '')
		const entry = components.get(component) || { component, file: suite.name, failures: [] }

		for (const assertion of failedAssertions) {
			const titleParts = [...(assertion.ancestorTitles || []), assertion.title].filter(Boolean)
			const message = cleanMessage((assertion.failureMessages || []).join('\n'))
			entry.failures.push({
				test: titleParts.join(' > '),
				message,
			})
		}

		components.set(component, entry)
	}

	return Array.from(components.values())
}

function buildMarkdown({ generatedAt, command, failures, components }) {
	const list = failures ?? components ?? []
	if (!list.length) {
		return `# Rapport a11y\n\n- Généré le: ${generatedAt}\n- Commande: ${command}\n\nAucune violation d’accessibilité détectée.`
	}

	const lines = [
		'# Rapport a11y',
		'',
		`- Généré le: ${generatedAt}`,
		`- Commande: ${command}`,
		`- Composants affectés: ${list.length}`,
		'',
	]

	for (const item of list) {
		lines.push(`## ${item.component}`)
		lines.push(item.file ? `Fichier: \
${item.file}` : 'Fichier: (inconnu)')
		lines.push('')
		for (const failure of item.failures) {
			lines.push(`- Test: ${failure.test}`)
			if (failure.message) {
				lines.push('  - Détails:')
				lines.push('')
				lines.push('```')
				lines.push(failure.message)
				lines.push('```')
			}
		}
		lines.push('')
	}

	return lines.join('\n')
}

async function main() {
	const command = 'pnpm vitest run a11y.spec.ts --reporter=json --outputFile a11y-raw.json'
	const start = Date.now()
	console.info('▶️  Lancement des tests a11y...')
	console.info(`Commande: ${command}`)
	let vitestError

	try {
		await execFileAsync('pnpm', ['vitest', 'run', 'a11y.spec.ts', '--reporter=json', '--outputFile', rawReportPath], {
			cwd: rootDir,
			env: { ...process.env, FORCE_COLOR: '0' },
		})
		console.info('✅ Exécution Vitest terminée (rapport brut écrit).')
	} catch (error) {
		vitestError = error
		if (!error?.stdout && !error?.stderr) {
			console.error('Vitest a échoué avant de produire un rapport.', error)
			process.exit(1)
		}
		console.warn('⚠️  Vitest a retourné un code d\'erreur, le rapport sera quand même traité.')
	}

	let rawContent
	try {
		rawContent = readFileSync(rawReportPath, 'utf8')
	} catch (readError) {
		console.error('Impossible de lire le rapport JSON généré par Vitest:', readError)
		process.exit(1)
	}
	console.info('📥 Rapport brut chargé.')

	let parsed
	try {
		parsed = JSON.parse(rawContent)
	} catch (parseError) {
		console.error('Le rapport JSON est invalide:', parseError)
		process.exit(1)
	}
	console.info('🧮 Agrégation des violations en cours...')

	const testResults = parsed.testResults || parsed.results || []
	const failures = aggregateFailures(testResults)

	const summary = {
		generatedAt: new Date().toISOString(),
		command,
		totalFailedTests: failures.reduce((sum, f) => sum + f.failures.length, 0),
		components: failures,
		vitestExitCode: vitestError?.code ?? 0,
	}

	writeFileSync(summaryJsonPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8')
	writeFileSync(summaryMdPath, `${buildMarkdown(summary)}\n`, 'utf8')

	const durationMs = Date.now() - start
	console.info(`📊 Résumé: ${failures.length} composant(s) concerné(s), ${summary.totalFailedTests} test(s) en échec.`)
	console.info(`Rapport généré:\n- ${summaryJsonPath}\n- ${summaryMdPath}`)
	console.info(`⏱️  Durée totale: ${(durationMs / 1000).toFixed(1)}s`)

	// Si Vitest a échoué, refléter le code de sortie sans masquer le rapport
	if (vitestError) {
		process.exit(vitestError.code || 1)
	}
}

main().catch((err) => {
	console.error('Erreur inattendue lors de la génération du rapport a11y:', err)
	process.exit(1)
})

#!/usr/bin/env node

/**
 * Script de détection des fuites de mémoire dans les tests unitaires
 *
 * Ce script exécute les tests un par un et surveille la consommation de mémoire
 * avant et après chaque test pour détecter les fuites potentielles.
 */

import { execSync } from 'child_process'
import { writeFileSync } from 'fs'

// Configuration
const MEMORY_THRESHOLD_MB = 10 // Seuil de fuite de mémoire en MB
const TEST_PATTERN = process.argv[2] || '**/*.spec.ts' // Motif pour sélectionner les tests

console.log(`\x1b[34m Détection des fuites de mémoire pour les tests: ${TEST_PATTERN}\x1b[0m`)
console.log(`\x1b[34m Seuil d'alerte: ${MEMORY_THRESHOLD_MB} MB\x1b[0m\n`)

// Récupération de la liste des fichiers de test
console.log('Recherche des fichiers de test...')
const testFiles = execSync(`npx vitest ls ${TEST_PATTERN} --reporter json`)
	.toString()
	.trim()

let files = []
try {
	const testData = JSON.parse(testFiles)
	files = testData.testFiles.map(file => file.filepath)
}
catch (e) {
	console.error('\x1b[31mErreur lors de la récupération des fichiers de test:', e, '\x1b[0m')
	process.exit(1)
}

console.log(`\x1b[32m✓ ${files.length} fichiers de test trouvés.\x1b[0m\n`)

// Résultats
const leakingTests = []
const errorTests = []

// Exécution des tests un par un
for (const file of files) {
	console.log(`\x1b[36mTest: ${file}\x1b[0m`)

	try {
		// Force le garbage collector avant le test si possible
		global.gc && global.gc()

		// Mesure de la mémoire avant le test
		const beforeMemory = process.memoryUsage().heapUsed / 1024 / 1024

		// Exécution du test
		execSync(`npx vitest run ${file} --isolate`, { stdio: 'inherit' })

		// Force le garbage collector après le test si possible
		global.gc && global.gc()

		// Mesure de la mémoire après le test
		const afterMemory = process.memoryUsage().heapUsed / 1024 / 1024

		// Calcul de la différence
		const diff = afterMemory - beforeMemory

		if (diff > MEMORY_THRESHOLD_MB) {
			console.log(`\x1b[31m⚠️ Fuite de mémoire détectée: ${diff.toFixed(2)} MB\x1b[0m`)
			leakingTests.push({ file, memoryLeakMB: diff.toFixed(2) })
		}
		else {
			console.log(`\x1b[32m✓ Pas de fuite détectée (${diff.toFixed(2)} MB)\x1b[0m`)
		}
	}
	catch (e) {
		console.error(`\x1b[31mErreur lors de l'exécution du test ${file}:\x1b[0m`, e.toString())
		errorTests.push({ file, error: e.toString() })
	}

	console.log('') // Ligne vide pour séparer les résultats
}

// Rapport final
console.log('\x1b[34m📊 RÉSUMÉ DES RÉSULTATS\x1b[0m')
console.log(`\x1b[34m📊 ${files.length} tests analysés\x1b[0m`)

if (leakingTests.length === 0) {
	console.log('\x1b[32m✓ Aucune fuite de mémoire détectée!\x1b[0m')
}
else {
	console.log(`\x1b[31m⚠️ ${leakingTests.length} tests avec des fuites de mémoire potentielles:\x1b[0m`)
	leakingTests.forEach((test) => {
		console.log(`\x1b[31m   - ${test.file}: ${test.memoryLeakMB} MB\x1b[0m`)
	})
}

if (errorTests.length > 0) {
	console.log(`\x1b[33m⚠️ ${errorTests.length} tests avec des erreurs:\x1b[0m`)
	errorTests.forEach((test) => {
		console.log(`\x1b[33m   - ${test.file}\x1b[0m`)
	})
}

// Génération du rapport JSON
const report = {
	timestamp: new Date().toISOString(),
	summary: {
		totalTests: files.length,
		leakingTests: leakingTests.length,
		errorTests: errorTests.length,
	},
	leakingTests,
	errorTests,
	threshold: MEMORY_THRESHOLD_MB,
}

writeFileSync('memory-leak-report.json', JSON.stringify(report, null, 2))
console.log('\n\x1b[34m Rapport enregistré dans memory-leak-report.json\x1b[0m')

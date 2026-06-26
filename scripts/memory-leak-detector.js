/**
 * Détecteur de fuites mémoire pour tests Vitest
 * Exécutable avec Node.js
 */

import { spawn } from 'child_process';
import { writeFileSync, existsSync, readdirSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Configuration
const MEMORY_THRESHOLD_MB = 10;
const ITERATIONS_PER_TEST = 2;
const REPORT_FILE = join(projectRoot, 'memory-leak-report.json');

console.log(' Détection des fuites mémoire dans les tests');
console.log(`Seuil: ${MEMORY_THRESHOLD_MB} MB`);
console.log(`Itérations par test: ${ITERATIONS_PER_TEST}`);

// Trouver tous les fichiers de test
async function findTestFiles() {
  const testFiles = [];
  
  // Fonction récursive pour parcourir les répertoires
  function scanDirectory(directory) {
    try {
      const entries = readdirSync(directory, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(directory, entry.name);
        
        if (entry.isDirectory()) {
          // Ignorer node_modules et .git
          if (entry.name !== 'node_modules' && entry.name !== '.git') {
            scanDirectory(fullPath);
          }
        } else if (entry.isFile() && 
                  (entry.name.endsWith('.spec.ts') || entry.name.endsWith('.spec.js'))) {
          testFiles.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Erreur lors du scan du répertoire ${directory}:`, error);
    }
  }
  
  // Commencer le scan dans src et tests
  scanDirectory(join(projectRoot, 'src'));
  scanDirectory(join(projectRoot, 'tests'));
  
  return testFiles;
}

// Exécuter un test avec Vitest et mesurer la mémoire
async function runTestWithMemoryCheck(testFile) {
  const relativePath = relative(projectRoot, testFile);
  console.log(`\nTest: ${relativePath}`);
  
  const results = [];
  let errorDetected = false;
  
  for (let i = 0; i < ITERATIONS_PER_TEST; i++) {
    console.log(`  Itération ${i + 1}/${ITERATIONS_PER_TEST}`);
    
    // Forcer le garbage collector si disponible
    if (global.gc) {
      global.gc();
    }
    
    // Mesure de mémoire avant
    const memBefore = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`  Mémoire avant: ${memBefore.toFixed(2)} MB`);
    
    // Exécuter le test
    try {
      await new Promise((resolve, reject) => {
        const testProcess = spawn('npx', ['vitest', 'run', testFile, '--isolate'], {
          stdio: ['ignore', 'ignore', 'ignore']
        });
        
        testProcess.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            errorDetected = true;
            reject(new Error(`Test failed with code ${code}`));
          }
        });
      });
    } catch (error) {
      console.log(`  ❌ Erreur: ${error.message}`);
    }
    
    // Forcer le garbage collector si disponible
    if (global.gc) {
      global.gc();
    }
    
    // Mesure de mémoire après
    const memAfter = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`  Mémoire après: ${memAfter.toFixed(2)} MB`);
    
    const diff = memAfter - memBefore;
    console.log(`  Différence: ${diff.toFixed(2)} MB`);
    
    results.push({
      iteration: i + 1,
      memoryBefore: memBefore,
      memoryAfter: memAfter,
      difference: diff
    });
  }
  
  // Calculer les statistiques
  const memoryDiffs = results.map(r => r.difference);
  const maxDiff = Math.max(...memoryDiffs);
  const avgDiff = memoryDiffs.reduce((sum, diff) => sum + diff, 0) / memoryDiffs.length;
  
  const result = {
    file: relativePath,
    maxMemoryIncrease: maxDiff,
    avgMemoryIncrease: avgDiff,
    iterations: results,
    hasError: errorDetected,
    hasLeak: maxDiff > MEMORY_THRESHOLD_MB
  };
  
  if (result.hasLeak) {
    console.log(`⚠️ FUITE DÉTECTÉE: ${relativePath} - Max: ${maxDiff.toFixed(2)} MB, Moy: ${avgDiff.toFixed(2)} MB`);
  } else if (result.hasError) {
    console.log(`⚠️ ERREUR DANS LE TEST: ${relativePath}`);
  } else {
    console.log(`✅ OK: ${relativePath} - Max: ${maxDiff.toFixed(2)} MB, Moy: ${avgDiff.toFixed(2)} MB`);
  }
  
  return result;
}

// Fonction principale
async function main() {
  try {
    const startTime = Date.now();
    const testFiles = await findTestFiles();
    console.log(`\n📋 ${testFiles.length} fichiers de test trouvés.`);
    
    const results = [];
    
    for (const testFile of testFiles) {
      const result = await runTestWithMemoryCheck(testFile);
      results.push(result);
    }
    
    // Statistiques finales
    const leakingTests = results.filter(r => r.hasLeak);
    const errorTests = results.filter(r => r.hasError && !r.hasLeak);
    const okTests = results.filter(r => !r.hasLeak && !r.hasError);
    
    console.log('\n📊 RÉSUMÉ DES RÉSULTATS');
    console.log(`📊 ${results.length} tests analysés`);
    console.log(`⚠️ ${leakingTests.length} tests avec des fuites mémoire`);
    console.log(`⚠️ ${errorTests.length} tests avec des erreurs`);
    console.log(`✅ ${okTests.length} tests sans problème`);
    
    if (leakingTests.length > 0) {
      console.log('\n LISTE DES TESTS AVEC FUITES MÉMOIRE:');
      leakingTests.forEach(test => {
        console.log(`   - ${test.file}: ${test.maxMemoryIncrease.toFixed(2)} MB`);
      });
    }
    
    // Générer le rapport
    const report = {
      timestamp: new Date().toISOString(),
      threshold: MEMORY_THRESHOLD_MB,
      summary: {
        totalTests: results.length,
        leakingTests: leakingTests.length,
        errorTests: errorTests.length,
        okTests: okTests.length
      },
      duration: (Date.now() - startTime) / 1000,
      results: results.sort((a, b) => b.maxMemoryIncrease - a.maxMemoryIncrease)
    };
    
    writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
    console.log(`\n Rapport complet enregistré dans ${REPORT_FILE}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des tests:', error);
    process.exit(1);
  }
}

// Exécuter
main();

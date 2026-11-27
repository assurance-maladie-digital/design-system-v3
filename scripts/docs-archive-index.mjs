/**
 * docs-archive-index.mjs
 *
 * Ajoute une version à `versions.json` (copie de travail de la branche docs-archive-index),
 * une fois son archive en ligne. Utilisé par le workflow .github/workflows/docs-archive.yml.
 *
 * Usage : node scripts/docs-archive-index.mjs <chemin de versions.json> <version X.Y.Z>
 */

import path from 'path'
import process from 'process'
import { writeVersions } from './lib/docArchive.mjs'

const [filePath, version] = process.argv.slice(2)

if (!filePath || !version) {
	process.stderr.write('Usage : node scripts/docs-archive-index.mjs <chemin de versions.json> <version X.Y.Z>\n')
	process.exit(1)
}

const versions = writeVersions(path.resolve(filePath), version)
process.stdout.write(`[docs-archive] versions.json : ${versions.join(', ')}\n`)

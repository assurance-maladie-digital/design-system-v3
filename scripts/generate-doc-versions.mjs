/**
 * generate-doc-versions.mjs
 *
 * Génère .storybook/public/doc-versions.json, lu par le menu « Version » de Storybook :
 * pour chaque PR de release fusionnée, la version et l'URL de sa preview Netlify, si elle est encore en ligne.
 *
 * Ne fait jamais échouer le build : en cas d'erreur (réseau, limite de l'API GitHub),
 * le fichier n'est pas écrit et le menu utilise sa liste de secours.
 * Un jeton GITHUB_TOKEN (lecture seule) évite la limite de l'API sans authentification.
 *
 * Usage : node scripts/generate-doc-versions.mjs
 */

import fs from 'fs'
import path from 'path'
import process from 'process'
import { fileURLToPath } from 'url'
import { generateDocVersions } from './lib/docVersions.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.resolve(__dirname, '../.storybook/public/doc-versions.json')

try {
	const versions = await generateDocVersions({ token: process.env.GITHUB_TOKEN })
	fs.writeFileSync(outputPath, `${JSON.stringify(versions, null, '\t')}\n`)
	process.stdout.write(`[doc-versions] ${versions.length} versions archivées écrites dans ${path.relative(process.cwd(), outputPath)}\n`)
}
catch (error) {
	process.stderr.write(`[doc-versions] liste non générée, le menu utilisera sa liste de secours : ${error instanceof Error ? error.message : error}\n`)
}

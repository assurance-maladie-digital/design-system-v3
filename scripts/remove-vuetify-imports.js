/**
 * Supprime :
 *   import { vuetify } from '@tests/unit/setup'
 * et
 *   global: { plugins: [vuetify], },
 *
 * Usage :
 *   node scripts\remove-vuetify-imports.js         # dry-run (rapporte les fichiers qui seraient modifiés)
 *   node scripts\remove-vuetify-imports.js --apply # applique les modifications (crée .bak pour chaque fichier modifié)
 */

/* Conversion ESM — nécessite "type": "module" dans package.json ou renommage en .mjs */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const dryRun = !process.argv.includes('--apply')

function walk(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true })
	let files = []
	for (const e of entries) {
		const full = path.join(dir, e.name)
		if (e.isDirectory()) {
			files = files.concat(walk(full))
		}
		else if (e.isFile() && full.endsWith('.spec.ts')) {
			files.push(full)
		}
	}
	return files
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8')
    const original = content

    // remove the import line
    const importRegex = /^\s*import\s*\{\s*vuetify\s*\}\s*from\s*['"]@tests\/unit\/setup['"].*\r?\n?/m
    content = content.replace(importRegex, '')

    // Iterate over all "global: { ... }" occurrences and remove plugins: [vuetify]
    let out = content
    let searchFrom = 0
    const pluginsInnerRegex = /plugins\s*:\s*\[\s*vuetify\s*\]\s*,?/gs

    while (true) {
        // find next "global" followed by a ":" and opening "{"
        const globalIndex = out.indexOf('global', searchFrom)
        if (globalIndex === -1) break

        const afterGlobal = out.slice(globalIndex)
        const matchHeader = afterGlobal.match(/^\s*global\s*:\s*\{/s)
        if (!matchHeader) {
            // not a "global: {" occurrence, continue search past this 'global'
            searchFrom = globalIndex + 6
            continue
        }

        // find the position of the opening brace
        const braceStart = globalIndex + afterGlobal.indexOf('{')
        // find matching closing brace (account for nested braces)
        let i = braceStart
        let depth = 0
        const len = out.length
        for (; i < len; i++) {
            const ch = out[i]
            if (ch === '{') depth++
            else if (ch === '}') {
                depth--
                if (depth === 0) break
            }
        }
        if (i >= len) break // malformed, bail out

        const braceEnd = i
        const innerStart = braceStart + 1
        const innerEnd = braceEnd
        const inner = out.slice(innerStart, innerEnd)

        // remove plugins property occurrences inside inner
        let newInner = inner.replace(pluginsInnerRegex, '')
        // also remove possible leftover leading/trailing commas/new blank lines
        newInner = newInner.replace(/^\s*,\s*/s, '') // leading comma
        newInner = newInner.replace(/\s*,\s*$/s, '') // trailing comma

        if (newInner.trim() === '') {
            // remove entire "global: { ... }" and optional following comma
            // compute removal end index (include following comma if any)
            let removeStart = globalIndex
            let removeEnd = braceEnd + 1
            // skip whitespace/newlines after braceEnd to see if there's a comma
            let j = removeEnd
            while (j < out.length && /\s/.test(out[j])) j++
            if (out[j] === ',') {
                removeEnd = j + 1
            }
            out = out.slice(0, removeStart) + out.slice(removeEnd)
            // continue search at same index (content shifted)
            searchFrom = globalIndex
        } else {
            // replace inner content while preserving surrounding braces
            out = out.slice(0, innerStart) + newInner + out.slice(innerEnd)
            // continue search after the replaced block
            searchFrom = innerStart + newInner.length
        }
    }

    content = out

    // final cleanup: fix double-commas / trailing commas
    content = content
        .replace(/,\s*,/g, ',') // double commas -> single
        .replace(/,\s*([\]\}\)])/g, '$1') // trailing comma before ] } ) -> remove
        .replace(/(\{|\[)\s*,\s*/g, '$1 ') // opening brace/bracket followed by comma -> remove comma

    if (content !== original) {
        console.log((dryRun ? '[DRY] ' : '[MOD] ') + filePath)
        const removedImport = original.match(importRegex)
        if (removedImport) console.log('  - import vuetify supprimé')
        // report number of plugins removals roughly
        const removedGlobal = original.match(pluginsInnerRegex)
        if (removedGlobal) console.log(`  - plugins: [vuetify] supprimé(s) : ${removedGlobal.length}`)

        if (!dryRun) {
            fs.writeFileSync(filePath + '.bak', original, 'utf8')
            fs.writeFileSync(filePath, content, 'utf8')
        }
        return true
    }
    return false
}

const allFiles = walk(root)
let changed = 0
for (const f of allFiles) {
	try {
		if (processFile(f)) changed++
	}
	catch (err) {
		console.error('Erreur sur', f, err)
	}
}

console.log(`\nFichiers parcourus: ${allFiles.length}`)
console.log(`${dryRun ? 'Fichiers à modifier (dry-run):' : 'Fichiers modifiés:'} ${changed}`)

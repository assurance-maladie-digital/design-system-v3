import { existsSync, statSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import packageJson from '../../package.json'

// Les extraits affichés dans la doc (stories et pages MDX) sont copiés tels quels
// par les projets consommateurs : chaque import d'un sous-chemin de
// `@cnamts/synapse` doit donc fonctionner une fois le paquet installé.
//
// L'export `"./*": "./src/*"` reprend le sous-chemin tel quel. TypeScript ne
// complète pas l'extension d'un chemin issu de `exports` : un import doit
// désigner un fichier exact (`.../numero_3608.svg`), sinon il échoue au
// typecheck même si Vite le résout. Les types et constantes s'importent depuis
// `@cnamts/synapse`. Seul Sass (`@use`, `@import`) complète les partiels.
const sources = import.meta.glob<string>([
	'/src/**/*.stories.ts',
	'/src/**/*.mdx',
], { query: '?raw', import: 'default', eager: true })

const explicitExports = new Set(
	Object.keys(packageJson.exports)
		.filter(key => key !== '.' && !key.includes('*'))
		.map(key => key.slice(2)),
)

const SUBPATH_IMPORT = /(@use|@import|from|import)\s+['"]@cnamts\/synapse\/([^'"]+)['"]/g

function isFile(path: string): boolean {
	return existsSync(path) && statSync(path).isFile()
}

function isResolved(keyword: string, subpath: string): boolean {
	if (explicitExports.has(subpath)) {
		return true
	}
	const target = resolve('src', subpath)
	if (keyword === '@use' || keyword === '@import') {
		return [target, `${target}.scss`, join(dirname(target), `_${basename(target)}.scss`)].some(isFile)
	}
	return isFile(target)
}

const imports = Object.entries(sources).flatMap(([file, content]) =>
	[...content.matchAll(SUBPATH_IMPORT)].map(match => ({ file, keyword: match[1]!, subpath: match[2]! })),
)

describe('Chemins d’import des extraits de la documentation', () => {
	it('trouve des imports de sous-chemins à vérifier', () => {
		expect(imports.length).toBeGreaterThan(0)
	})

	it('chaque import de sous-chemin de @cnamts/synapse désigne un fichier publié', () => {
		const unresolved = imports
			.filter(({ keyword, subpath }) => !isResolved(keyword, subpath))
			.map(({ file, subpath }) => `${file} : @cnamts/synapse/${subpath}`)

		expect(unresolved).toEqual([])
	})
})

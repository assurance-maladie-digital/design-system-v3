import { existsSync } from 'node:fs'
import { basename, dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import packageJson from '../../package.json'

// Les extraits affichés dans la doc (stories et pages MDX) sont copiés tels quels
// par les projets consommateurs : chaque import d'un sous-chemin de
// `@cnamts/synapse` doit donc correspondre à un fichier publié.
// L'export `"./*": "./src/*"` ajoute déjà `src/` : `@cnamts/synapse/src/...`
// pointerait vers `src/src/...`.
const sources = import.meta.glob<string>([
	'/src/**/*.stories.ts',
	'/src/**/*.mdx',
], { query: '?raw', import: 'default', eager: true })

const explicitExports = new Set(
	Object.keys(packageJson.exports)
		.filter(key => key !== '.' && !key.includes('*'))
		.map(key => key.slice(2)),
)

const SUBPATH_IMPORT = /['"]@cnamts\/synapse\/([^'"]+)['"]/g

function candidates(subpath: string): string[] {
	const base = resolve('src', subpath)
	return [
		base,
		`${base}.ts`,
		`${base}.d.ts`,
		`${base}.vue`,
		`${base}.scss`,
		join(dirname(base), `_${basename(base)}.scss`),
		join(base, 'index.ts'),
	]
}

function isPublished(subpath: string): boolean {
	return explicitExports.has(subpath) || candidates(subpath).some(path => existsSync(path))
}

const imports = Object.entries(sources).flatMap(([file, content]) =>
	[...content.matchAll(SUBPATH_IMPORT)].map(match => ({ file, subpath: match[1]! })),
)

describe('Chemins d’import des extraits de la documentation', () => {
	it('trouve des imports de sous-chemins à vérifier', () => {
		expect(imports.length).toBeGreaterThan(0)
	})

	it('chaque import de sous-chemin de @cnamts/synapse correspond à un fichier publié', () => {
		const unresolved = imports
			.filter(({ subpath }) => !isPublished(subpath))
			.map(({ file, subpath }) => `${file} : @cnamts/synapse/${subpath}`)

		expect(unresolved).toEqual([])
	})
})

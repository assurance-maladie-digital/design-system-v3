import { describe, expect, it } from 'vitest'
import { docVersions, getArchivedVersions } from '../versions'

const versions = [
	{ version: '1.2.2', url: 'https://deploy-preview-3--synapse-dev.netlify.app' },
	{ version: '1.2.1', url: 'https://deploy-preview-2--synapse-dev.netlify.app' },
	{ version: '1.2.0', url: 'https://deploy-preview-1--synapse-dev.netlify.app' },
]

describe('getArchivedVersions', () => {
	it('retire la version en cours, servie par la doc courante', () => {
		expect(getArchivedVersions('1.2.2', versions).map(({ version }) => version)).toEqual(['1.2.1', '1.2.0'])
	})

	it('propose toutes les archives après une release pas encore ajoutée à la liste', () => {
		expect(getArchivedVersions('1.2.3', versions)).toEqual(versions)
	})
})

describe('docVersions', () => {
	it('pointe chaque version vers une preview Netlify en https', () => {
		for (const { url } of docVersions) {
			expect(url).toMatch(/^https:\/\/deploy-preview-\d+--synapse-dev\.netlify\.app$/)
		}
	})

	it('liste chaque version une seule fois, la plus récente en premier', () => {
		const list = docVersions.map(({ version }) => version)
		const sorted = [...list].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

		expect(new Set(list).size).toBe(list.length)
		expect(list).toEqual(sorted)
	})
})

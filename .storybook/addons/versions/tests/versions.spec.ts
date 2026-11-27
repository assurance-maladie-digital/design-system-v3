import { describe, expect, it, vi } from 'vitest'
import { DOC_VERSIONS_FILE, fallbackDocVersions, getArchivedVersions, loadDocVersions, parseDocVersions } from '../versions'

const versions = [
	{ version: '1.2.2', url: 'https://deploy-preview-3--synapse-dev.netlify.app' },
	{ version: '1.2.1', url: 'https://deploy-preview-2--synapse-dev.netlify.app' },
	{ version: '1.2.0', url: 'https://deploy-preview-1--synapse-dev.netlify.app' },
]

const fetchReturning = (response: Response | Error) =>
	vi.fn(async () => {
		if (response instanceof Error) {
			throw response
		}
		return response
	}) as unknown as typeof fetch

describe('getArchivedVersions', () => {
	it('retire la version en cours, servie par la doc courante', () => {
		expect(getArchivedVersions('1.2.2', versions).map(({ version }) => version)).toEqual(['1.2.1', '1.2.0'])
	})

	it('propose toutes les archives quand la version en cours n\'est pas encore archivée', () => {
		expect(getArchivedVersions('1.2.3', versions)).toEqual(versions)
	})
})

describe('parseDocVersions', () => {
	it('accepte la liste générée', () => {
		expect(parseDocVersions(versions)).toEqual(versions)
	})

	it('refuse une liste vide, mal formée ou pointant hors des previews du projet', () => {
		expect(parseDocVersions([])).toBeNull()
		expect(parseDocVersions({ versions })).toBeNull()
		expect(parseDocVersions([{ version: '1.2.2' }])).toBeNull()
		expect(parseDocVersions([{ version: 'latest', url: versions[0].url }])).toBeNull()
		expect(parseDocVersions([{ version: '1.2.2', url: 'https://exemple.fr' }])).toBeNull()
		expect(parseDocVersions([{ version: '1.2.2', url: 'javascript:alert(1)' }])).toBeNull()
	})
})

describe('loadDocVersions', () => {
	it('lit le fichier généré', async () => {
		const fetchImpl = fetchReturning(new Response(JSON.stringify(versions)))

		await expect(loadDocVersions(fetchImpl)).resolves.toEqual(versions)
		expect(fetchImpl).toHaveBeenCalledWith(DOC_VERSIONS_FILE)
	})

	it('utilise la liste de secours si le fichier est absent', async () => {
		await expect(loadDocVersions(fetchReturning(new Response('Not found', { status: 404 })))).resolves.toEqual(fallbackDocVersions)
	})

	it('utilise la liste de secours si le fichier est invalide', async () => {
		await expect(loadDocVersions(fetchReturning(new Response('<html>')))).resolves.toEqual(fallbackDocVersions)
		await expect(loadDocVersions(fetchReturning(new Response('[]')))).resolves.toEqual(fallbackDocVersions)
	})

	it('utilise la liste de secours si la requête échoue', async () => {
		await expect(loadDocVersions(fetchReturning(new TypeError('Failed to fetch')))).resolves.toEqual(fallbackDocVersions)
	})
})

describe('fallbackDocVersions', () => {
	it('est valide, sans doublon, la version la plus récente en premier', () => {
		const list = fallbackDocVersions.map(({ version }) => version)
		const sorted = [...list].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))

		expect(parseDocVersions(fallbackDocVersions)).toEqual(fallbackDocVersions)
		expect(new Set(list).size).toBe(list.length)
		expect(list).toEqual(sorted)
	})
})

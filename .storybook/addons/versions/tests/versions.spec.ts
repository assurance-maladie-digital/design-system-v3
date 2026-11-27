import { describe, expect, it, vi } from 'vitest'
import { ARCHIVE_INDEX_URL, archiveUrl, getOtherVersions, isArchivedDoc, loadArchivedVersions, parseArchivedVersions } from '../versions'

const fetchReturning = (response: Response | Error) =>
	vi.fn(async () => {
		if (response instanceof Error) {
			throw response
		}
		return response
	}) as unknown as typeof fetch

describe('archiveUrl', () => {
	it('pointe vers la branche Netlify de la version, comme dans le workflow', () => {
		expect(archiveUrl('1.2.0')).toBe('https://archive-v1-2-0--cnam-design-system.netlify.app/')
		expect(archiveUrl('1.10.12')).toBe('https://archive-v1-10-12--cnam-design-system.netlify.app/')
	})
})

describe('parseArchivedVersions', () => {
	it('accepte une liste de versions et la trie, la plus récente en premier', () => {
		expect(parseArchivedVersions(['1.1.6', '1.2.10', '1.2.2'])).toEqual(['1.2.10', '1.2.2', '1.1.6'])
		expect(parseArchivedVersions([])).toEqual([])
	})

	it('refuse un contenu mal formé', () => {
		expect(parseArchivedVersions({ versions: ['1.2.2'] })).toBeNull()
		expect(parseArchivedVersions(['v1.2.2'])).toBeNull()
		expect(parseArchivedVersions(['1.2.2', 'javascript:alert(1)'])).toBeNull()
		expect(parseArchivedVersions([122])).toBeNull()
	})
})

describe('loadArchivedVersions', () => {
	it('lit versions.json sur la branche d\'index', async () => {
		const fetchImpl = fetchReturning(new Response(JSON.stringify(['1.2.1', '1.2.2'])))

		await expect(loadArchivedVersions(fetchImpl)).resolves.toEqual(['1.2.2', '1.2.1'])
		expect(fetchImpl).toHaveBeenCalledWith(ARCHIVE_INDEX_URL)
	})

	it('renvoie null si les archives ne sont pas encore publiées', async () => {
		await expect(loadArchivedVersions(fetchReturning(new Response('Not found', { status: 404 })))).resolves.toBeNull()
	})

	it('renvoie null si le fichier est invalide', async () => {
		await expect(loadArchivedVersions(fetchReturning(new Response('<html>')))).resolves.toBeNull()
	})

	it('renvoie null si la requête échoue', async () => {
		await expect(loadArchivedVersions(fetchReturning(new TypeError('Failed to fetch')))).resolves.toBeNull()
	})
})

describe('getOtherVersions', () => {
	it('retire la version consultée', () => {
		expect(getOtherVersions('1.2.1', ['1.2.2', '1.2.1', '1.2.0'])).toEqual(['1.2.2', '1.2.0'])
	})
})

describe('isArchivedDoc', () => {
	const archived = ['1.2.2', '1.2.1', '1.2.0']

	it('reconnaît la doc maintenue, même avant l\'archivage de sa version', () => {
		expect(isArchivedDoc('1.2.2', archived)).toBe(false)
		expect(isArchivedDoc('1.2.3', archived)).toBe(false)
		expect(isArchivedDoc('1.2.2', [])).toBe(false)
	})

	it('reconnaît une archive plus ancienne que la dernière version archivée', () => {
		expect(isArchivedDoc('1.2.1', archived)).toBe(true)
		expect(isArchivedDoc('1.2.0', ['1.2.10'])).toBe(true)
	})
})

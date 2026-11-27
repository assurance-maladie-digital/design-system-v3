import { describe, expect, it, vi } from 'vitest'
import { generateDocVersions, parseReleaseVersion, previewUrl, toDocVersions } from '../docVersions.mjs'

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })

describe('parseReleaseVersion', () => {
	it('lit la version des titres de PR de release', () => {
		expect(parseReleaseVersion('Release 1.2.2')).toBe('1.2.2')
		expect(parseReleaseVersion('release 1.1.3')).toBe('1.1.3')
		expect(parseReleaseVersion(' Release 1.0.27')).toBe('1.0.27')
		expect(parseReleaseVersion('release v1.0.0')).toBe('1.0.0')
	})

	it('ignore les autres PR qui parlent de release', () => {
		expect(parseReleaseVersion('Doc: improve release page')).toBeNull()
		expect(parseReleaseVersion('fix release 1.1.0')).toBeNull()
		expect(parseReleaseVersion('Release: add info tokens')).toBeNull()
		expect(parseReleaseVersion('release 114')).toBeNull()
		expect(parseReleaseVersion('Release 0.0.16-alpha')).toBeNull()
		expect(parseReleaseVersion('Synapse : release 1.0.6')).toBeNull()
		expect(parseReleaseVersion(undefined)).toBeNull()
	})
})

describe('toDocVersions', () => {
	it('garde une entrée par version, la plus récente en premier', () => {
		expect(toDocVersions([
			{ number: 2590, title: 'Release 1.1.6' },
			{ number: 2721, title: 'Doc: improve release page' },
			{ number: 2801, title: 'release 1.2.2' },
			{ number: 2217, title: 'Release 1.0.27' },
			{ number: 2716, title: 'Release 1.2.1' },
		])).toEqual([
			{ version: '1.2.2', url: previewUrl(2801) },
			{ version: '1.2.1', url: previewUrl(2716) },
			{ version: '1.1.6', url: previewUrl(2590) },
			{ version: '1.0.27', url: previewUrl(2217) },
		])
	})

	it('retient la PR la plus récente quand une version a deux PR de release', () => {
		expect(toDocVersions([
			{ number: 10, title: 'Release 1.0.0' },
			{ number: 12, title: 'release v1.0.0' },
		])).toEqual([{ version: '1.0.0', url: previewUrl(12) }])
	})
})

describe('generateDocVersions', () => {
	it('ne garde que les previews encore en ligne', async () => {
		const fetchImpl = vi.fn(async (url: string) => {
			if (url.startsWith('https://api.github.com/')) {
				return jsonResponse({ items: [
					{ number: 2801, title: 'release 1.2.2' },
					{ number: 2312, title: 'release 1.1.1' },
				] })
			}
			return new Response(null, { status: url === previewUrl(2312) ? 404 : 200 })
		})

		await expect(generateDocVersions({ fetchImpl })).resolves.toEqual([
			{ version: '1.2.2', url: previewUrl(2801) },
		])
	})

	it('écarte une preview qui ne répond pas', async () => {
		const fetchImpl = vi.fn(async (url: string) => {
			if (url.startsWith('https://api.github.com/')) {
				return jsonResponse({ items: [{ number: 2801, title: 'release 1.2.2' }] })
			}
			throw new TypeError('fetch failed')
		})

		await expect(generateDocVersions({ fetchImpl })).resolves.toEqual([])
	})

	it('transmet le jeton GitHub quand il est fourni', async () => {
		const fetchImpl = vi.fn(async () => jsonResponse({ items: [] }))

		await generateDocVersions({ fetchImpl, token: 'jeton' })

		expect(fetchImpl).toHaveBeenCalledWith(
			expect.stringContaining('https://api.github.com/search/issues'),
			expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer jeton' }) }),
		)
	})

	it('réessaie sans jeton et prévient quand le jeton est expiré', async () => {
		const onWarning = vi.fn()
		const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
			if (url.startsWith('https://api.github.com/')) {
				const headers = init?.headers as Record<string, string>
				return headers.Authorization
					? jsonResponse({ message: 'Bad credentials' }, 401)
					: jsonResponse({ items: [{ number: 2801, title: 'release 1.2.2' }] })
			}
			return new Response(null, { status: 200 })
		})

		await expect(generateDocVersions({ fetchImpl, token: 'expire', onWarning })).resolves.toEqual([
			{ version: '1.2.2', url: previewUrl(2801) },
		])
		expect(onWarning).toHaveBeenCalledOnce()
		expect(onWarning).toHaveBeenCalledWith(expect.stringContaining('GITHUB_TOKEN expiré ou invalide'))
	})

	it('ne réessaie pas sans jeton pour une autre erreur que 401', async () => {
		const onWarning = vi.fn()
		const fetchImpl = vi.fn(async () => jsonResponse({ message: 'API rate limit exceeded' }, 403))

		await expect(generateDocVersions({ fetchImpl, token: 'jeton', onWarning })).rejects.toThrow('HTTP 403')
		expect(fetchImpl).toHaveBeenCalledOnce()
		expect(onWarning).not.toHaveBeenCalled()
	})

	it('lève une erreur si la recherche sans jeton échoue aussi', async () => {
		const fetchImpl = vi.fn(async (_url: string, init?: RequestInit) => {
			const headers = init?.headers as Record<string, string>
			return headers.Authorization
				? jsonResponse({ message: 'Bad credentials' }, 401)
				: jsonResponse({ message: 'API rate limit exceeded' }, 403)
		})

		await expect(generateDocVersions({ fetchImpl, token: 'expire' })).rejects.toThrow('HTTP 403')
		expect(fetchImpl).toHaveBeenCalledTimes(2)
	})

	it('lève une erreur si la recherche GitHub échoue (limite de l\'API)', async () => {
		const fetchImpl = vi.fn(async () => jsonResponse({ message: 'API rate limit exceeded' }, 403))

		await expect(generateDocVersions({ fetchImpl })).rejects.toThrow('HTTP 403')
	})
})

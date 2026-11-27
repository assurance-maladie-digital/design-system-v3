/**
 * Documentation archivée de chaque version : la preview Netlify de sa PR de release.
 *
 * Les PR de release sont retrouvées par leur titre (« Release 1.2.2 », « release v1.0.0 ») :
 * le lien entre un tag et sa PR n'est pas fiable dans l'API GitHub.
 */

const REPO = 'assurance-maladie-digital/design-system-v3'
const SEARCH_QUERY = `repo:${REPO} is:pr is:merged in:title release`
const MAX_PAGES = 3
const TIMEOUT_MS = 10_000

// Version d'un titre de PR de release, ou `null` pour les autres PR (« Doc: improve release page », « Release 0.0.16-alpha »…)
export const parseReleaseVersion = (title) => {
	const match = /^\s*release\s+v?(\d+\.\d+\.\d+)\s*$/i.exec(title ?? '')
	return match ? match[1] : null
}

export const previewUrl = number => `https://deploy-preview-${number}--synapse-dev.netlify.app`

export const compareVersionsDesc = (a, b) => b.localeCompare(a, undefined, { numeric: true })

// Une entrée par version (la PR la plus récente si une version a été publiée deux fois), la plus récente en premier
export const toDocVersions = (pullRequests) => {
	const byVersion = new Map()

	for (const { number, title } of pullRequests) {
		const version = parseReleaseVersion(title)
		if (version && number > (byVersion.get(version) ?? 0)) {
			byVersion.set(version, number)
		}
	}

	return [...byVersion.entries()]
		.sort(([a], [b]) => compareVersionsDesc(a, b))
		.map(([version, number]) => ({ version, url: previewUrl(number) }))
}

const fetchReleasePullRequests = async (fetchImpl, token) => {
	const headers = {
		'Accept': 'application/vnd.github+json',
		'User-Agent': 'synapse-doc-versions',
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	}
	const pullRequests = []

	for (let page = 1; page <= MAX_PAGES; page++) {
		const params = new URLSearchParams({ q: SEARCH_QUERY, per_page: '100', page: String(page) })
		const response = await fetchImpl(`https://api.github.com/search/issues?${params}`, {
			headers,
			signal: AbortSignal.timeout(TIMEOUT_MS),
		})

		if (!response.ok) {
			throw new Error(`recherche GitHub en échec (HTTP ${response.status})`)
		}

		const { items } = await response.json()
		pullRequests.push(...items)

		if (items.length < 100) {
			break
		}
	}

	return pullRequests
}

const isOnline = async (fetchImpl, url) => {
	try {
		const response = await fetchImpl(url, { method: 'HEAD', signal: AbortSignal.timeout(TIMEOUT_MS) })
		return response.ok
	}
	catch {
		return false
	}
}

// Versions dont la preview est encore en ligne. Lève une erreur si GitHub ne répond pas.
export const generateDocVersions = async ({ fetchImpl = fetch, token } = {}) => {
	const candidates = toDocVersions(await fetchReleasePullRequests(fetchImpl, token))
	const online = await Promise.all(candidates.map(({ url }) => isOnline(fetchImpl, url)))

	return candidates.filter((_, index) => online[index])
}

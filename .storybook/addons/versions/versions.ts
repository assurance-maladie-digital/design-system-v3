// Archives publiées par .github/workflows/docs-archive.yml : une branche Netlify `archive-vX-Y-Z` par version.
// L'index ne liste que les versions dont l'archive est en ligne.
export const ARCHIVE_INDEX_URL = 'https://raw.githubusercontent.com/assurance-maladie-digital/design-system-v3/docs-archive-index/versions.json'
const NETLIFY_SITE = 'cnam-design-system'
// Documentation de la version maintenue
export const MAINTAINED_DOC_URL = `https://${NETLIFY_SITE}.netlify.app/`

const VERSION = /^\d+\.\d+\.\d+$/

export const compareVersions = (a: string, b: string): number => a.localeCompare(b, undefined, { numeric: true })

// Même nom de branche que dans le workflow : 1.2.2 -> archive-v1-2-2
export const archiveUrl = (version: string): string =>
	`https://archive-v${version.replaceAll('.', '-')}--${NETLIFY_SITE}.netlify.app/`

// Contenu de versions.json, ou `null` s'il n'a pas la forme attendue (liste de versions X.Y.Z)
export const parseArchivedVersions = (data: unknown): string[] | null =>
	Array.isArray(data) && data.every(version => typeof version === 'string' && VERSION.test(version))
		? [...data].sort((a, b) => compareVersions(b, a))
		: null

// `null` si la liste est indisponible (archives pas encore publiées, réseau, fichier invalide)
export const loadArchivedVersions = async (fetchImpl: typeof fetch = fetch): Promise<string[] | null> => {
	try {
		const response = await fetchImpl(ARCHIVE_INDEX_URL)
		return response.ok ? parseArchivedVersions(await response.json()) : null
	}
	catch {
		return null
	}
}

// La version consultée n'est pas proposée dans la liste
export const getOtherVersions = (currentVersion: string, versions: string[]): string[] =>
	versions.filter(version => version !== currentVersion)

// La doc consultée est une archive si une version plus récente a été archivée.
// La doc maintenue est toujours au moins aussi récente que la dernière archive.
export const isArchivedDoc = (currentVersion: string, versions: string[]): boolean =>
	versions.some(version => compareVersions(version, currentVersion) > 0)

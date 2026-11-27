export type DocVersion = {
	version: string
	url: string
}

// Fichier généré au build par scripts/generate-doc-versions.mjs (absent en `pnpm storybook`)
export const DOC_VERSIONS_FILE = './doc-versions.json'

// Liste de secours, utilisée si le fichier généré est absent ou invalide.
// Pas besoin de la tenir à jour à chaque release : la liste générée la remplace.
export const fallbackDocVersions: DocVersion[] = [
	{ version: '1.2.2', url: 'https://deploy-preview-2801--synapse-dev.netlify.app' },
	{ version: '1.2.1', url: 'https://deploy-preview-2716--synapse-dev.netlify.app' },
	{ version: '1.2.0', url: 'https://deploy-preview-2663--synapse-dev.netlify.app' },
	{ version: '1.1.6', url: 'https://deploy-preview-2590--synapse-dev.netlify.app' },
	{ version: '1.1.5', url: 'https://deploy-preview-2539--synapse-dev.netlify.app' },
]

const PREVIEW_URL = /^https:\/\/deploy-preview-\d+--synapse-dev\.netlify\.app$/
const VERSION = /^\d+\.\d+\.\d+$/

const isDocVersion = (value: unknown): value is DocVersion => {
	if (typeof value !== 'object' || value === null) {
		return false
	}
	const { version, url } = value as Record<string, unknown>
	return typeof version === 'string' && VERSION.test(version) && typeof url === 'string' && PREVIEW_URL.test(url)
}

// Contenu du fichier généré, ou `null` s'il n'a pas la forme attendue (seules des previews Netlify du projet sont acceptées)
export const parseDocVersions = (data: unknown): DocVersion[] | null =>
	Array.isArray(data) && data.length > 0 && data.every(isDocVersion) ? data : null

export const loadDocVersions = async (fetchImpl: typeof fetch = fetch): Promise<DocVersion[]> => {
	try {
		const response = await fetchImpl(DOC_VERSIONS_FILE)
		return (response.ok && parseDocVersions(await response.json())) || fallbackDocVersions
	}
	catch {
		return fallbackDocVersions
	}
}

// La version en cours est servie par la doc courante : son archive n'est pas proposée
export const getArchivedVersions = (currentVersion: string, versions: DocVersion[]): DocVersion[] =>
	versions.filter(({ version }) => version !== currentVersion)

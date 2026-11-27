export type DocVersion = {
	version: string
	url: string
}

// Documentation archivée de chaque version : preview Netlify de sa PR de release.
// À compléter à chaque release avec le lien du commentaire du bot Netlify, version la plus récente en premier.
export const docVersions: DocVersion[] = [
	{ version: '1.2.2', url: 'https://deploy-preview-2801--synapse-dev.netlify.app' },
	{ version: '1.2.1', url: 'https://deploy-preview-2716--synapse-dev.netlify.app' },
	{ version: '1.2.0', url: 'https://deploy-preview-2663--synapse-dev.netlify.app' },
	{ version: '1.1.6', url: 'https://deploy-preview-2590--synapse-dev.netlify.app' },
	{ version: '1.1.5', url: 'https://deploy-preview-2539--synapse-dev.netlify.app' },
]

// La version en cours est servie par la doc courante : son archive n'est pas proposée
export const getArchivedVersions = (currentVersion: string, versions: DocVersion[] = docVersions): DocVersion[] =>
	versions.filter(({ version }) => version !== currentVersion)

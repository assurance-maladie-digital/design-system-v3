/**
 * Index des archives de la documentation.
 *
 * Chaque version est archivée sur une branche `archive-vX-Y-Z`, déployée par Netlify (branch deploy) :
 * le dernier déploiement d'une branche n'est jamais supprimé automatiquement par Netlify.
 * `versions.json`, sur la branche `docs-archive-index`, liste les versions dont l'archive est en ligne.
 */

import fs from 'fs'

const VERSION = /^\d+\.\d+\.\d+$/

export const compareVersionsDesc = (a, b) => b.localeCompare(a, undefined, { numeric: true })

// Contenu de versions.json (absent ou invalide : liste vide)
export const readVersions = (filePath) => {
	if (!fs.existsSync(filePath)) {
		return []
	}
	try {
		const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
		return Array.isArray(data) ? data.filter(version => typeof version === 'string' && VERSION.test(version)) : []
	}
	catch {
		return []
	}
}

// Ajoute une version, sans doublon, la plus récente en premier
export const addVersion = (versions, version) => {
	if (!VERSION.test(version)) {
		throw new Error(`Version invalide : '${version}' (attendu : X.Y.Z)`)
	}
	return [...new Set([...versions, version])].sort(compareVersionsDesc)
}

export const writeVersions = (filePath, version) => {
	const versions = addVersion(readVersions(filePath), version)
	fs.writeFileSync(filePath, `${JSON.stringify(versions, null, '\t')}\n`)
	return versions
}

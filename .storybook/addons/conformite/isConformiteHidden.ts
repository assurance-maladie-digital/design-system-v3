/**
 * Masque le panneau « Conformité » dans les dossiers de validation.
 *
 * `title` est optionnel car `api.getCurrentStoryData()` renvoie `undefined`
 * tant que l'index n'est pas résolu, alors que son typage le déclare
 * non-nullable.
 */
export function isConformiteHidden(title?: string): boolean {
	if (!title) return false

	return title
		.split('/')
		.some(segment => segment.toLowerCase() === 'validation')
}

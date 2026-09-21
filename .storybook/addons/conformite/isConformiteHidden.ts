/**
 * Détermine si le panneau « Conformité » doit être masqué pour une story.
 *
 * Il l'est dans les dossiers de validation, dont le titre porte un segment
 * `Validation` (ex. `Composants/Formulaires/NirField/Validation`).
 *
 * Le titre est optionnel à dessein : `api.getCurrentStoryData()` renvoie
 * `undefined` tant que l'index n'est pas résolu, alors que son typage le
 * déclare non-nullable. Titre inconnu = rien à masquer.
 *
 * @param title - Titre de la story courante, `undefined` si non encore connu.
 */
export function isConformiteHidden(title?: string): boolean {
	if (!title) return false

	return title
		.split('/')
		.some(segment => segment.toLowerCase() === 'validation')
}

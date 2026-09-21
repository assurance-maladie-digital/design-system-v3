/**
 * Détermine si le panneau « Conformité » doit être masqué pour une story.
 *
 * Il l'est dans les dossiers de validation, dont le titre porte un segment
 * `Validation` (ex. `Composants/Formulaires/NirField/Validation`).
 *
 * Le titre est optionnel à dessein : tant que l'index des stories n'est pas
 * résolu, `api.getCurrentStoryData()` renvoie `undefined` — son typage le
 * déclare pourtant non-nullable, ce qui faisait lever l'ancien appel direct à
 * `.title` et laissait le panneau visible. Dans le doute on masque : un onglet
 * absent une fraction de seconde vaut mieux qu'un onglet affiché à tort.
 *
 * @param title - Titre de la story courante, `undefined` si non encore connu.
 */
export function isConformiteHidden(title?: string): boolean {
	if (!title) return true

	return title
		.split('/')
		.some(segment => segment.trim().toLowerCase() === 'validation')
}

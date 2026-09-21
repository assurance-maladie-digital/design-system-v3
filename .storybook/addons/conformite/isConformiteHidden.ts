/**
 * Détermine si le panneau « Conformité » doit être masqué pour une story.
 *
 * Il l'est dans les dossiers de validation, dont le titre porte un segment
 * `Validation` (ex. `Composants/Formulaires/NirField/Validation`).
 *
 * Le titre est optionnel à dessein : tant que l'index des stories n'est pas
 * résolu, `api.getCurrentStoryData()` renvoie `undefined` — son typage le
 * déclare pourtant non-nullable, ce qui faisait lever l'ancien appel direct à
 * `.title`. Titre inconnu = on n'a rien à masquer : le panneau reste visible,
 * et la règle s'applique dès que la story est résolue. Masquer par défaut
 * ferait disparaître l'onglet en dev, où l'addon doit précisément s'afficher.
 *
 * @param title - Titre de la story courante, `undefined` si non encore connu.
 */
export function isConformiteHidden(title?: string): boolean {
	if (!title) return false

	return title
		.split('/')
		.some(segment => segment.trim().toLowerCase() === 'validation')
}

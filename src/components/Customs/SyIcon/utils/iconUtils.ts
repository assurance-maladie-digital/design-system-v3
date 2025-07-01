/**
 * Utilitaires pour la gestion des icônes SVG et leur accessibilité
 */

/**
 * Crée un élément SVG accessible selon les normes RGAA
 * @param icon - L'icône à afficher (chaîne SVG ou objet)
 * @param decorative - Indique si l'icône est décorative
 * @param label - Label d'accessibilité pour les icônes non décoratives
 * @returns Objet contenant les attributs d'accessibilité à appliquer
 */
export function createAccessibleIconAttributes(decorative: boolean, label?: string) {
	// Pour les icônes décoratives
	if (decorative) {
		return {
			'role': 'presentation',
			'aria-hidden': 'true',
		}
	}

	// Pour les icônes fonctionnelles
	return {
		'role': 'img',
		'aria-hidden': undefined,
		'aria-label': label || undefined,
	}
}

/**
 * Crée une directive personnalisée pour corriger les attributs SVG
 * Cette fonction sera utilisée dans le hook mounted du composant
 */
export function fixSvgAttributes(element: HTMLElement | null, decorative: boolean) {
	if (!element) return

	// Attendre le prochain tick pour s'assurer que le DOM est mis à jour
	setTimeout(() => {
		// Trouver le SVG à l'intérieur de l'élément
		const svg = element.getElementsByTagName('svg')[0]

		if (svg) {
			// Supprimer les attributs contradictoires
			if (decorative) {
				svg.removeAttribute('role')
			}
			else {
				// Pour les icônes non décoratives, s'assurer que le SVG n'est pas caché
				svg.removeAttribute('aria-hidden')
			}
		}
	}, 0)
}

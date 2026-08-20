/**
 * Affiche un avertissement destiné aux développeurs uniquement en mode développement.
 * Ne produit aucun effet en production (build optimisé).
 *
 * @example
 * devWarn('[SyIcon] L\'icône n\'est pas décorative mais aucun label n\'a été fourni.')
 */
export function devWarn(message: string): void {
	if (import.meta.env.DEV) {
		// eslint-disable-next-line no-console
		console.warn(message)
	}
}

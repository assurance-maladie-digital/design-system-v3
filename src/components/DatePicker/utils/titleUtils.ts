/**
 * Résout l'attribut `title` du champ et du conteneur du calendrier.
 *
 * `title: false` (défaut) désactive l'infobulle native : `undefined` est
 * renvoyé pour qu'aucun attribut `title` ne soit rendu. Sinon la prop
 * l'emporte, puis les replis fournis (placeholder, libellé…), dans l'ordre.
 */
export function resolveTitle(
	title: string | false | undefined,
	...fallbacks: Array<string | undefined>
): string | undefined {
	if (title === false) {
		return undefined
	}
	return title || fallbacks.find(Boolean)
}

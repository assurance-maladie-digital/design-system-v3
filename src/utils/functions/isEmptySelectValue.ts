/**
 * Indique si la valeur d'un champ de sélection signifie « aucune sélection ».
 *
 * `null`, `undefined` et `''` sont vides ; `0` et `false` sont des choix valides (#2683).
 */
export function isEmptySelectValue(value: unknown): value is null | undefined | '' {
	return value === null || value === undefined || value === ''
}

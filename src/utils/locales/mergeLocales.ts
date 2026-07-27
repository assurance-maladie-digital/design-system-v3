import deepmerge from 'deepmerge'

/**
 * Variant récursive de `Partial` : chaque niveau de l'objet peut être partiellement renseigné.
 * Sert à typer la prop `locales` des composants afin d'autoriser la surcharge partielle
 * (ex. ne redéfinir que quelques clés tout en conservant les valeurs par défaut).
 */
export type DeepPartial<T> = T extends (...args: never[]) => unknown
	? T
	: T extends object
		? { [P in keyof T]?: DeepPartial<T[P]> }
		: T

/**
 * Fusionne profondément un objet de locales partiellement renseigné avec les valeurs par défaut.
 *
 * Les clés fournies dans `overrides` écrasent celles par défaut (y compris les fonctions),
 * les objets imbriqués sont fusionnés récursivement, et les tableaux sont **remplacés**
 * (et non concaténés) afin qu'une surcharge de liste soit prévisible.
 *
 * @example
 * mergeLocales(defaultLocales, { thanks: 'Merci' })
 */
export function mergeLocales<T extends Record<string, unknown>>(
	defaults: T,
	overrides?: DeepPartial<T> | null,
): T {
	return deepmerge(defaults, overrides ?? {}, { arrayMerge: (_dest, source) => source }) as T
}

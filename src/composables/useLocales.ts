import { computed, toRaw, type ComputedRef } from 'vue'
import deepmerge from 'deepmerge'
import type { DeepPartial } from '@/utils/locales/mergeLocales'

/**
 * Version réactive de `mergeLocales` : renvoie un `ComputedRef` contenant les locales par
 * défaut fusionnées avec la prop `locales` du composant. Permet la surcharge partielle et
 * réagit aux changements de la prop.
 *
 * @example
 * const locales = useLocales(defaultLocales, () => props.locales)
 */
export function useLocales<T extends Record<string, unknown>>(
	defaults: Required<T>,
	overrides: () => DeepPartial<T> | undefined | null,
): ComputedRef<Required<T>> {
	return computed(() => deepmerge<Required<T>>(defaults, toRaw(overrides() ?? {})))
}

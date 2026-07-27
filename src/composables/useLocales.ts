import { computed, toRaw, type ComputedRef } from 'vue'
import { mergeLocales, type DeepPartial } from '@/utils/locales/mergeLocales'

/**
 * Version réactive de `mergeLocales` : renvoie un `ComputedRef` contenant les locales par
 * défaut fusionnées avec la prop `locales` du composant. Permet la surcharge partielle et
 * réagit aux changements de la prop.
 *
 * Délègue à `mergeLocales` pour garantir un comportement identique au chemin non-réactif
 * (notamment le remplacement des tableaux plutôt que leur concaténation).
 *
 * @example
 * const locales = useLocales(defaultLocales, () => props.locales)
 */
export function useLocales<T extends Record<string, unknown>>(
	defaults: T,
	overrides: () => NoInfer<DeepPartial<T>> | undefined | null,
): ComputedRef<T> {
	return computed(() => mergeLocales(defaults, toRaw(overrides() ?? {}) as DeepPartial<T>))
}

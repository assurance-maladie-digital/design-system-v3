import { type ComputedRef, computed } from 'vue'
import { useFieldsThemeConfig } from '@/composables/useFieldsThemeConfig'

type FieldDensity = 'default' | 'comfortable' | 'compact'

/**
 * Apparence des champs date internes, après application du réglage `fields.density` de la configuration de thème.
 */
export interface DatePickerFieldAppearance {
	/** `density` des champs : prop explicite, sinon réglage du projet, sinon valeur par défaut. */
	density: FieldDensity | undefined
}

/**
 * Résout l'apparence des champs du DatePicker à partir de `density` et de la configuration de thème.
 * Sans configuration `fields`, le résultat reproduit le rendu actuel.
 */
export function useDatePickerFieldAppearance(
	props: { density?: FieldDensity },
): ComputedRef<DatePickerFieldAppearance> {
	const { resolveDensity } = useFieldsThemeConfig()
	const density = resolveDensity('density', () => props.density)

	return computed(() => ({ density: density.value }))
}

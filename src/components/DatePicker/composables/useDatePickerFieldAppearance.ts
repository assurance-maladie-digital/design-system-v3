import { type ComputedRef, computed } from 'vue'
import { useFieldsThemeConfig } from '@/composables/useFieldsThemeConfig'
import type { VariantStyle } from '@/types/vuetifyTypes'

type FieldDensity = 'default' | 'comfortable' | 'compact'

/**
 * Apparence des champs date internes, après application des réglages `fields` de la configuration de thème.
 */
export interface DatePickerFieldAppearance {
	/**
	 * `isOutlined` à transmettre à un champ date imbriqué (`DateTextInput`, `ComplexDatePicker`) :
	 * `undefined` si le consommateur ne l'a pas passée, pour que le champ imbriqué applique lui-même la configuration.
	 */
	isOutlined: boolean | undefined
	/** `variant` du `SyTextField` rendu : `isOutlined` explicite, sinon réglage du projet, sinon `isOutlined` par défaut. */
	variant: VariantStyle
	/** `density` des champs : prop explicite, sinon réglage du projet, sinon valeur par défaut. */
	density: FieldDensity | undefined
}

/**
 * Résout l'apparence des champs du DatePicker à partir de `isOutlined`, `density` et de la configuration de thème.
 * Sans configuration `fields`, le résultat reproduit le rendu actuel (`isOutlined` → `outlined` / `underlined`).
 */
export function useDatePickerFieldAppearance(
	props: { isOutlined?: boolean, density?: FieldDensity },
): ComputedRef<DatePickerFieldAppearance> {
	const { themeFields, isPropExplicit, resolveDensity } = useFieldsThemeConfig()
	const density = resolveDensity('density', () => props.density)

	return computed(() => {
		const isOutlinedExplicit = isPropExplicit('isOutlined')
		const outlinedVariant: VariantStyle = props.isOutlined ? 'outlined' : 'underlined'

		return {
			isOutlined: isOutlinedExplicit ? props.isOutlined : undefined,
			variant: !isOutlinedExplicit && themeFields.value.variant ? themeFields.value.variant : outlinedVariant,
			density: density.value,
		}
	})
}

import { onMounted, onBeforeUnmount, getCurrentInstance, reactive, type Ref, toValue, watch, inject, provide, type InjectionKey } from 'vue'
import { useValidatableComponent } from './useFormValidation'

// Injection key set by every field that registers with a form. A field rendered
// inside another field (e.g. the internal <SyTextField> of SyAutocomplete /
// NirField / PhoneField) detects this token and skips its own registration, so a
// composite field is registered a single time with the form instead of once per
// internal building block. A leaf field (used directly in a form) sees no
// ancestor token and registers normally.
const FieldNestingKey: InjectionKey<boolean> = Symbol('FieldNesting')

/**
 * Hook pour rendre un composant validable automatiquement dans un SyForm
 * Ce composable permet à un composant de s'auto-enregistrer auprès d'un formulaire parent
 * sans avoir à modifier manuellement le code de chaque composant.
 *
 * Note : ce hook s'enregistre autant de fois qu'il est appelé — il ne déduplique pas.
 * Un composant ne doit donc avoir qu'un seul chemin d'enregistrement (soit l'auto-register
 * via useValidation, soit un appel explicite), sinon il s'enregistrera plusieurs fois.
 *
 * @param validateMethod Fonction de validation à appeler lors de la soumission du formulaire
 * @example
 * // Dans un composant
 * const validateOnSubmit = () => {
 *   // Logique de validation
 *   return isValid
 * }
 *
 * const clearValidation = () => {
 *   // Logique de nettoyage de la validation
 * }
 *
 * const reset = () => {
 *   // Logique de réinitialisation
 * }
 *
 * // Enregistrer le composant auprès du formulaire parent
 * useValidatable(validateOnSubmit, clearValidation, reset, hasError)
 */
export function useValidatable(
	validateMethod: () => Promise<boolean> | boolean,
	clearValidation?: () => void,
	reset?: () => void,
	valide?: Ref<boolean | null>,
	active: Ref<boolean | null> | boolean = true,
) {
	const { register, unregister } = useValidatableComponent()
	const instance = getCurrentInstance()

	// If this field is nested inside another field, it is an internal building
	// block: skip registration and let the owning (outermost) field be the one
	// the form knows about. We still provide the token so that deeply nested
	// internals (a field inside a field inside a field) are suppressed at every
	// level, not just the first.
	const hasFieldAncestor = inject(FieldNestingKey, false)
	provide(FieldNestingKey, true)
	if (hasFieldAncestor) {
		return
	}

	// Keep a stable object reference for register/unregister symmetry
	const componentRef = reactive({
		validateOnSubmit: validateMethod,
		clearValidation,
		reset,
		valide,
		$props: {
			label: typeof instance?.props?.label === 'string' ? instance.props.label : undefined,
		},
	})

	onMounted(() => {
		if (instance && toValue(active)) {
			register(componentRef)
		}
	})

	onBeforeUnmount(() => {
		if (instance) {
			unregister(componentRef)
		}
	})

	watch(() => toValue(active), (newActive) => {
		if (instance) {
			if (newActive) {
				register(componentRef)
			}
			else {
				unregister(componentRef)
			}
		}
	})

	// Aucune valeur de retour nécessaire car ce hook gère uniquement l'enregistrement/désenregistrement
}

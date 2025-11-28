import { onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { useValidatableComponent } from './useFormValidation'

/**
 * Hook pour rendre un composant validable automatiquement dans un SyForm
 * Ce composable permet à un composant de s'auto-enregistrer auprès d'un formulaire parent
 * sans avoir à modifier manuellement le code de chaque composant.
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
 * useValidatable(validateOnSubmit, clearValidation, reset)
 */
export function useValidatable(
	validateMethod: () => Promise<boolean> | boolean,
	clearValidation?: () => void,
	reset?: () => void,
) {
	const { register, unregister } = useValidatableComponent()
	const instance = getCurrentInstance()

	// Keep a stable object reference for register/unregister symmetry
	const componentRef = { validateOnSubmit: validateMethod, clearValidation, reset }

	onMounted(() => {
		if (instance) {
			register(componentRef)
		}
	})

	onBeforeUnmount(() => {
		if (instance) {
			unregister(componentRef)
		}
	})

	// Aucune valeur de retour nécessaire car ce hook gère uniquement l'enregistrement/désenregistrement
}

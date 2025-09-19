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
 * // Enregistrer le composant auprès du formulaire parent
 * useValidatable(validateOnSubmit)
 */
export function useValidatable(validateMethod: () => Promise<boolean> | boolean) {
	const { register, unregister } = useValidatableComponent()
	const instance = getCurrentInstance()

	onMounted(() => {
		if (instance) {
			register({
				validateOnSubmit: validateMethod,
			})
		}
	})

	onBeforeUnmount(() => {
		if (instance) {
			unregister({
				validateOnSubmit: validateMethod,
			})
		}
	})

	// Aucune valeur de retour nécessaire car ce hook gère uniquement l'enregistrement/désenregistrement
}

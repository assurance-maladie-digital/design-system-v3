import { devWarn } from '@/utils/devWarn'
import { computed, inject, provide, ref, type InjectionKey, type Ref } from 'vue'

/**
 * Interface représentant un composant validable qui peut s'enregistrer auprès d'un formulaire parent.
 */
export type ValidatableComponent = {
	valide?: boolean | null
	isPristine?: boolean
	validateOnSubmit: () => Promise<boolean> | boolean
	clearValidation?: () => void
	reset?: () => void
	$props?: {
		label?: string
	}
}

// Clé d'injection pour le registre des composants validables
export const ValidatableComponentsKey: InjectionKey<{
	register: (component: ValidatableComponent) => void
	unregister: (component: ValidatableComponent) => void
	clearAll: () => void
	resetAll: () => void
	components: Ref<ValidatableComponent[]>
}> = Symbol('ValidatableComponents')

/**
 * Hook pour le formulaire parent qui fournit un registre pour les composants validables
 * @returns Fonctions pour gérer la validation des composants enfants
 */
export function useFormValidation() {
	// Liste des composants validables enregistrés
	const validatableComponents = ref<ValidatableComponent[]>([])

	/**
	 * Enregistre un champ auprès du formulaire
	 */
	const register = (component: ValidatableComponent) => {
		if (!validatableComponents.value.includes(component)) {
			validatableComponents.value.push(component)
		}
	}

	/**
	 * Retire un champ du registre du formulaire
	 */
	const unregister = (component: ValidatableComponent) => {
		// Retrait par référence uniquement : un repli sur `validateOnSubmit` pourrait retirer un
		// autre champ partageant la même fonction de validation.
		const index = validatableComponents.value.indexOf(component)
		if (index !== -1) {
			validatableComponents.value.splice(index, 1)
		}
	}

	/**
	 * Réinitialise les états de validation de tous les champs
	 */
	const clearAll = () => {
		if (validatableComponents.value.length === 0) return
		validatableComponents.value.forEach((component: ValidatableComponent) => {
			if (component.clearValidation) {
				try {
					component.clearValidation()
				}
				catch (error) {
					devWarn('Error clearing validation for field: ' + (component?.$props?.label ?? 'unknown'), error)
				}
			}
		})
	}

	/**
	 * Réinitialise la valeur de tous les champs
	 */
	const resetAll = () => {
		validatableComponents.value.forEach((component) => {
			if (component.reset) {
				try {
					component.reset()
				}
				catch (error) {
					devWarn('Error resetting field: ' + (component?.$props?.label ?? 'unknown'), error)
				}
			}
		})
	}

	/**
	 * Déclenche la validation de tous les composants enfants enregistrés
	 * @returns Promise<boolean> - true si tous les composants sont valides
	 */
	const validateAll = async (): Promise<boolean> => {
		if (validatableComponents.value.length === 0) {
			return true
		}

		// Valider tous les composants et collecter les résultats
		const results = await Promise.all(
			validatableComponents.value.map(component =>
				Promise.resolve(component.validateOnSubmit()),
			),
		)

		// Retourner true uniquement si tous les composants sont valides
		return results.every(result => result === true)
	}

	/**
	 * Statut de validation des composants custom enregistrés (comportement aligné sur Vuetify) :
	 * - true : aucun composant custom ne remonte explicitement `valide === false`
	 * - false : au moins un composant custom est invalide
	 * - null : aucun composant custom enregistré ou au moins un champ non validé
	 */
	const customComponentsValide = computed<boolean | null>(() => {
		if (validatableComponents.value.length === 0) {
			return null
		}
		const hasError = validatableComponents.value.some(component => component.valide === false)
		if (hasError) {
			return false
		}
		if (validatableComponents.value.some(component => component.valide === null)) {
			return null
		}
		return true
	})

	/**
	 * Indique si au moins un composant custom invalide a affiché son erreur
	 * (champ touché par l'utilisateur ou validation explicite au submit).
	 * Est une source de réactivité pour le formulaire : sans lui, le passage
	 * de pristine à affiché pendant un validate() ne redéclencherait pas
	 * le recalcul du v-model.
	 */
	const hasDisplayedError = computed<boolean>(() => validatableComponents.value.some(component =>
		component.valide === false && component.isPristine === false,
	))

	/**
	 * Calcule la valeur globale du formulaire en combinant les validations custom et Vuetify.
	 * - Priorité aux erreurs affichées : si Vuetify ou custom est invalide → false
	 * - Erreur custom pristine : null, car le formulaire est invalide sans
	 *   avoir encore affiché l'erreur à l'utilisateur
	 * - Sans composant custom : défère à vFormStatus (Vuetify natif)
	 * - Avec composant custom : utilise customComponentsValide (true tant qu'aucune erreur
	 *   n'est remontée, à la manière de Vuetify)
	 * @param vFormStatus - Statut de validation du VForm Vuetify
	 * @param hasVuetifyFields - Indique si le VForm contient des champs enregistrés
	 * @returns Statut global du formulaire (boolean | null)
	 */
	const getFormValue = (
		vFormStatus: boolean | null | undefined,
		hasVuetifyFields = false,
	): boolean | null => {
		if (customComponentsValide.value === false) {
			return hasDisplayedError.value ? false : null
		}
		if (vFormStatus === false) {
			return false
		}
		if (customComponentsValide.value === null && validatableComponents.value.length > 0) {
			return null
		}
		if (hasVuetifyFields && vFormStatus == null) {
			return null
		}
		if (validatableComponents.value.length === 0) {
			return vFormStatus === true ? true : null
		}
		return true
	}

	// Méthode pour les tests : retourne une copie des composants enregistrés
	const _getValidatableComponents = (): readonly ValidatableComponent[] => [...validatableComponents.value]

	provide(ValidatableComponentsKey, {
		register,
		unregister,
		clearAll,
		resetAll,
		components: validatableComponents,
	})

	return {
		validateAll,
		clearAll,
		resetAll,
		customComponentsValide,
		hasDisplayedError,
		getFormValue,
		_getValidatableComponents,
	}
}

/**
 * Hook pour les composants enfants qui doivent s'enregistrer auprès du formulaire parent
 * @returns Fonction pour s'enregistrer et se désinscrire du formulaire parent
 */
export function useValidatableComponent() {
	const formRegistry = inject(ValidatableComponentsKey, null)
	if (!formRegistry) {
		return {
			register: () => {},
			unregister: () => {},
			clearAll: () => {},
			resetAll: () => {},
		}
	}
	return {
		register: formRegistry.register,
		unregister: formRegistry.unregister,
		clearAll: formRegistry.clearAll,
		resetAll: formRegistry.resetAll,
	}
}

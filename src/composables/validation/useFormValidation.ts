import { computed, provide, inject, ref, type InjectionKey, type Ref } from 'vue'

/**
 * Interface représentant un composant validable qui peut s'enregistrer auprès d'un formulaire parent.
 */
export type ValidatableComponent = {
	valide?: boolean | null
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
		// Prefer direct reference removal
		let index = validatableComponents.value.indexOf(component)
		// Fallback: locate by matching validateOnSubmit reference
		if (index === -1) {
			index = validatableComponents.value.findIndex(c => c.validateOnSubmit === component.validateOnSubmit)
		}
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
					console.warn('Error clearing validation for field: ' + (component?.$props?.label ?? 'unknown'), error)
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
					console.warn('Error resetting field: ' + (component?.$props?.label ?? 'unknown'), error)
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
	 * Le statut global de validation du formulaire, basé sur les composants enfants
	 * - true : tous les composants sont valides
	 * - false : au moins un composant est invalide
	 * - null : aucun composant n'est enregistré ou certains composants n'ont pas encore été validés
	 */
	const valide = computed<boolean | null>(() => {
		// Aucun composant custom enregistré → l'agrégat n'a aucune information :
		// on renvoie `null` (« inconnu ») plutôt que `true` par vacuité.
		if (validatableComponents.value.length === 0) {
			return null
		}
		const hasError = validatableComponents.value.some(component => component.valide === false)
		if (hasError) {
			return false
		}
		const hasNull = validatableComponents.value.some(component => component.valide === null || component.valide === undefined)
		if (hasNull) {
			return null
		}
		return true
	})

	// Fournir le registre aux composants enfants
	provide(ValidatableComponentsKey, {
		register,
		unregister,
		clearAll,
		resetAll,
		components: validatableComponents,
	})

	return {
		validateAll,
		validatableComponents,
		clearAll,
		resetAll,
		valide,
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

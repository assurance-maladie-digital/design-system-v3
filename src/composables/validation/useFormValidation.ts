import { provide, inject, ref, type InjectionKey, type Ref } from 'vue'

// Type pour les composants pouvant être validés
export interface ValidatableComponent {
	validateOnSubmit: () => Promise<boolean> | boolean
	clearValidation?: () => void
	reset?: () => void
}

// Clé d'injection pour le registre des composants validables
const ValidatableComponentsKey: InjectionKey<{
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

	// Fonction pour enregistrer un composant validable
	const register = (component: ValidatableComponent) => {
		if (!validatableComponents.value.includes(component)) {
			validatableComponents.value.push(component)
		}
	}

	// Fonction pour supprimer un composant validable du registre
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

	// Fonction pour nettoyer les validations de tous les composants enregistrés
	const clearAll = () => {
		if (validatableComponents.value.length === 0) return
		validatableComponents.value.forEach((component) => {
			try {
				component.clearValidation?.()
			}
			catch {
				// no-op: un composant peut ne pas implémenter clearValidation
			}
		})
	}

	const resetAll = () => {
		if (validatableComponents.value.length === 0) return
		validatableComponents.value.forEach((component) => {
			try {
				component.reset?.()
			}
			catch {
				// no-op: un composant peut ne pas implémenter reset
			}
		})
	}

	// Fournir le registre aux composants enfants
	provide(ValidatableComponentsKey, {
		register,
		unregister,
		clearAll,
		resetAll,
		components: validatableComponents,
	})

	/**
     * Valide tous les composants enfants enregistrés
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

	return {
		validateAll,
		validatableComponents,
		clearAll,
		resetAll,
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

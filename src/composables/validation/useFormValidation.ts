import { provide, inject, ref, type InjectionKey, type Ref } from 'vue'

// Type pour les composants pouvant être validés
export interface ValidatableComponent {
	validateOnSubmit: () => Promise<boolean> | boolean
}

// Clé d'injection pour le registre des composants validables
const ValidatableComponentsKey: InjectionKey<{
	register: (component: ValidatableComponent) => void
	unregister: (component: ValidatableComponent) => void
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
		const index = validatableComponents.value.indexOf(component)
		if (index !== -1) {
			validatableComponents.value.splice(index, 1)
		}
	}

	// Fournir le registre aux composants enfants
	provide(ValidatableComponentsKey, {
		register,
		unregister,
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
	}
}

/**
 * Hook pour les composants enfants qui doivent s'enregistrer auprès du formulaire parent
 * @returns Fonction pour s'enregistrer et se désinscrire du formulaire parent
 */
export function useValidatableComponent() {
	// Récupérer le registre du formulaire parent
	const formRegistry = inject(ValidatableComponentsKey, null)

	// Si le composant n'est pas dans un formulaire avec useFormValidation, ne rien faire
	if (!formRegistry) {
		return {
			register: () => {},
			unregister: () => {},
		}
	}

	return {
		register: formRegistry.register,
		unregister: formRegistry.unregister,
	}
}

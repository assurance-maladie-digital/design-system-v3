import { nextTick, onMounted, watch, type Ref } from 'vue'

type UseSyAutocompleteAriaOptions = {
	textInput: Ref<{ $el?: HTMLElement } | null>
	isOpen: Ref<boolean>
	uniqueMenuId: Ref<string>
	activeDescendantId: Ref<string>
	isRequired: Ref<boolean>
	hasError: Ref<boolean>
	selectedItem: Ref<unknown>
}

type AriaManager = {
	cleanInputAttributes(inputElement: HTMLElement): void
	updateInputState(inputElement: HTMLElement, isOpenValue: boolean, menuId: string, activeDescendant: string): void
	updateValidationAttributes(inputElement: HTMLElement, isRequiredValue: boolean, hasErrorValue: boolean): void
	cleanParentAttributes(parentElement: HTMLElement): void
	cleanAlertAttributes(parentElement: HTMLElement): void
}

export function useSyAutocompleteAria(options: UseSyAutocompleteAriaOptions) {
	const ariaManager: AriaManager = {
		cleanInputAttributes(inputElement: HTMLElement): void {
			// On "nettoie" les attributs ARIA/role posés par Vuetify pour appliquer
			// un pattern combobox/listbox cohérent (RGAA / WAI-ARIA) sans conflits.
			if (!inputElement) return
			inputElement.removeAttribute('role')
			inputElement.removeAttribute('aria-expanded')
			inputElement.removeAttribute('aria-controls')
			inputElement.removeAttribute('aria-haspopup')
			inputElement.removeAttribute('aria-activedescendant')
			inputElement.removeAttribute('aria-required')
			inputElement.removeAttribute('aria-invalid')
			inputElement.removeAttribute('aria-hidden')
		},
		updateInputState(inputElement: HTMLElement, isOpenValue: boolean, menuId: string, activeDescendant: string): void {
			if (!inputElement) return
			// Pattern combobox:
			// - le focus DOM reste sur l'input
			// - l'option "active" est indiquée via aria-activedescendant
			inputElement.setAttribute('role', 'combobox')
			inputElement.setAttribute('aria-expanded', isOpenValue ? 'true' : 'false')
			inputElement.setAttribute('aria-haspopup', 'listbox')
			if (isOpenValue) {
				inputElement.setAttribute('aria-controls', menuId)
			}
			else {
				inputElement.removeAttribute('aria-controls')
			}
			if (isOpenValue && activeDescendant) {
				inputElement.setAttribute('aria-activedescendant', activeDescendant)
			}
			else {
				inputElement.removeAttribute('aria-activedescendant')
			}
		},
		updateValidationAttributes(inputElement: HTMLElement, isRequiredValue: boolean, hasErrorValue: boolean): void {
			if (!inputElement) return
			// Synchronisation des états de validation (required / invalid) sur l'input.
			if (isRequiredValue) {
				inputElement.setAttribute('aria-required', 'true')
			}
			else {
				inputElement.removeAttribute('aria-required')
			}
			if (hasErrorValue) {
				inputElement.setAttribute('aria-invalid', 'true')
			}
			else {
				inputElement.removeAttribute('aria-invalid')
			}
		},
		cleanParentAttributes(parentElement: HTMLElement): void {
			if (!parentElement) return

			const isVuetifyWrapper = parentElement.tagName === 'DIV'
				|| parentElement.classList.contains('v-input')
				|| parentElement.classList.contains('v-field')
			// Évite les attributs ARIA posés sur le wrapper Vuetify qui peuvent produire
			// des valeurs invalides ou redondantes.
			if (isVuetifyWrapper) {
				parentElement.removeAttribute('role')
				parentElement.removeAttribute('aria-expanded')
				parentElement.removeAttribute('aria-controls')
				parentElement.removeAttribute('aria-haspopup')
				parentElement.removeAttribute('aria-activedescendant')
				parentElement.removeAttribute('aria-required')
				parentElement.removeAttribute('aria-invalid')
				parentElement.removeAttribute('aria-hidden')
			}
		},
		cleanAlertAttributes(parentElement: HTMLElement): void {
			if (!parentElement) return
			// Vuetify peut poser role="alert"/aria-live sur les messages.
			// On les retire pour éviter un comportement trop "verbeux" pour les lecteurs d'écran.
			const messagesElements = parentElement.querySelectorAll('[role="alert"]')
			messagesElements.forEach((element: Element) => {
				element.removeAttribute('role')
				element.removeAttribute('aria-live')
			})
		},
	}

	const setupAriaAttributes = () => {
		// Fonction "snapshot" qui applique tous les attributs ARIA en fonction de l'état courant.
		if (!options.textInput.value || !options.textInput.value.$el) return
		const inputElement = options.textInput.value.$el.querySelector('input') as HTMLElement
		const parentElement = options.textInput.value.$el as HTMLElement
		if (inputElement) {
			ariaManager.cleanInputAttributes(inputElement)
			ariaManager.updateInputState(inputElement, options.isOpen.value, options.uniqueMenuId.value, options.activeDescendantId.value)
			ariaManager.updateValidationAttributes(inputElement, Boolean(options.isRequired.value), Boolean(options.hasError.value))
		}
		if (parentElement) {
			ariaManager.cleanParentAttributes(parentElement)
			ariaManager.cleanAlertAttributes(parentElement)
		}
	}

	onMounted(() => {
		nextTick(() => {
			// Plusieurs ticks: Vuetify peut re-rendre/patcher l'input après montage.
			setupAriaAttributes()
			setTimeout(setupAriaAttributes, 100)
			setTimeout(setupAriaAttributes, 300)
		})
	})

	watch(options.isOpen, (newValue) => {
		nextTick(() => {
			if (!options.textInput.value || !options.textInput.value.$el) return
			const inputElement = options.textInput.value.$el.querySelector('input') as HTMLElement
			if (inputElement) {
				ariaManager.updateInputState(inputElement, newValue, options.uniqueMenuId.value, options.activeDescendantId.value)
			}
		})
	})

	watch(options.activeDescendantId, (newValue) => {
		nextTick(() => {
			if (!options.textInput.value || !options.textInput.value.$el || !options.isOpen.value) return
			const inputElement = options.textInput.value.$el.querySelector('input') as HTMLElement
			if (!inputElement) return
			if (newValue) {
				inputElement.setAttribute('aria-activedescendant', newValue)
			}
			else {
				inputElement.removeAttribute('aria-activedescendant')
			}
		})
	})

	watch(options.hasError, (newValue) => {
		nextTick(() => {
			if (!options.textInput.value || !options.textInput.value.$el) return
			const inputElement = options.textInput.value.$el.querySelector('input') as HTMLElement
			if (inputElement) {
				ariaManager.updateValidationAttributes(
					inputElement,
					Boolean(options.isRequired.value),
					Boolean(newValue),
				)
			}
		})
	})

	watch(options.selectedItem, () => {
		nextTick(() => {
			setupAriaAttributes()
		})
	}, { deep: true })

	return {
		setupAriaAttributes,
	}
}

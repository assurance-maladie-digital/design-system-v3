import { nextTick, onMounted, watch, type Ref } from 'vue'

type UseSyComboboxAriaAdapter = {
	getRootEl: () => HTMLElement | null
	getInputEl: (rootEl: HTMLElement) => HTMLElement | null
	isOpen: Ref<boolean>
	uniqueMenuId: Ref<string>
	activeDescendantId: Ref<string>
	isRequired: Ref<boolean | undefined>
	hasError: Ref<boolean>
	selectedItem: Ref<unknown>
	ariaAutocomplete?: 'none' | 'list' | 'both'
}

type AriaManager = {
	cleanInputAttributes(inputElement: HTMLElement): void
	updateInputState(inputElement: HTMLElement, isOpenValue: boolean, menuId: string, activeDescendant: string): void
	updateValidationAttributes(inputElement: HTMLElement, isRequiredValue: boolean, hasErrorValue: boolean): void
	cleanParentAttributes(parentElement: HTMLElement): void
	cleanAlertAttributes(parentElement: HTMLElement): void
}

export function useSyComboboxAria(adapter: UseSyComboboxAriaAdapter) {
	const ensureTabbableElementsAccessible = (root: HTMLElement) => {
		const tabbableSelector = [
			'[tabindex]:not([tabindex="-1"])',
			'button:not([disabled])',
			'input:not([disabled])',
			'select:not([disabled])',
			'textarea:not([disabled])',
			'[role="combobox"]',
			'[role="button"]',
		].join(',')

		const tabbables = Array.from(root.querySelectorAll(tabbableSelector)) as HTMLElement[]
		for (const el of tabbables) {
			let current: HTMLElement | null = el
			while (current && root.contains(current)) {
				if (current.getAttribute('aria-hidden') === 'true') {
					current.removeAttribute('aria-hidden')
				}
				current = current.parentElement
			}
		}
	}

	const ariaManager: AriaManager = {
		cleanInputAttributes(inputElement: HTMLElement): void {
			// On "nettoie" les attributs ARIA/role posés par Vuetify pour appliquer
			// un pattern combobox/listbox cohérent (RGAA / WAI-ARIA) sans conflits.
			if (!inputElement) return

			inputElement.removeAttribute('role')
			inputElement.removeAttribute('aria-autocomplete')
			inputElement.removeAttribute('aria-expanded')
			inputElement.removeAttribute('aria-controls')
			inputElement.removeAttribute('aria-haspopup')
			inputElement.removeAttribute('aria-activedescendant')
			inputElement.removeAttribute('aria-required')
			inputElement.removeAttribute('aria-invalid')
			inputElement.removeAttribute('aria-hidden')

			inputElement.removeAttribute('aria-describedby')
			inputElement.removeAttribute('size')
			inputElement.removeAttribute('tabindex')
		},
		updateInputState(inputElement: HTMLElement, isOpenValue: boolean, menuId: string, activeDescendant: string): void {
			if (!inputElement) return
			// Pattern combobox:
			// - le focus DOM reste sur l'input
			// - l'option "active" est indiquée via aria-activedescendant
			inputElement.setAttribute('role', 'combobox')
			if (adapter.ariaAutocomplete) {
				inputElement.setAttribute('aria-autocomplete', adapter.ariaAutocomplete)
			}
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
		const rootElement = adapter.getRootEl()
		if (!rootElement) return

		const inputElement = adapter.getInputEl(rootElement)
		ensureTabbableElementsAccessible(rootElement)

		if (inputElement) {
			ariaManager.cleanInputAttributes(inputElement)
			ariaManager.updateInputState(inputElement, adapter.isOpen.value, adapter.uniqueMenuId.value, adapter.activeDescendantId.value)
			ariaManager.updateValidationAttributes(inputElement, Boolean(adapter.isRequired.value), Boolean(adapter.hasError.value))
		}

		ariaManager.cleanParentAttributes(rootElement)
		ariaManager.cleanAlertAttributes(rootElement)
	}

	onMounted(() => {
		nextTick(() => {
			// Plusieurs ticks: Vuetify peut re-rendre/patcher l'input après montage.
			setupAriaAttributes()
			setTimeout(setupAriaAttributes, 100)
			setTimeout(setupAriaAttributes, 300)
		})
	})

	watch(adapter.isOpen, (newValue) => {
		nextTick(() => {
			const rootElement = adapter.getRootEl()
			if (!rootElement) return
			const inputElement = adapter.getInputEl(rootElement)
			if (inputElement) {
				ariaManager.updateInputState(inputElement, newValue, adapter.uniqueMenuId.value, adapter.activeDescendantId.value)
			}
		})
	})

	watch(adapter.activeDescendantId, (newValue) => {
		nextTick(() => {
			const rootElement = adapter.getRootEl()
			if (!rootElement || !adapter.isOpen.value) return
			const inputElement = adapter.getInputEl(rootElement)
			if (!inputElement) return
			if (newValue) {
				inputElement.setAttribute('aria-activedescendant', newValue)
			}
			else {
				inputElement.removeAttribute('aria-activedescendant')
			}
		})
	})

	watch(adapter.hasError, (newValue) => {
		nextTick(() => {
			const rootElement = adapter.getRootEl()
			if (!rootElement) return
			const inputElement = adapter.getInputEl(rootElement)
			if (inputElement) {
				ariaManager.updateValidationAttributes(
					inputElement,
					Boolean(adapter.isRequired.value),
					Boolean(newValue),
				)
			}
		})
	})

	watch(adapter.selectedItem, () => {
		nextTick(() => {
			setupAriaAttributes()
		})
	}, { deep: true })

	return {
		setupAriaAttributes,
	}
}

import { nextTick, onMounted, watch, type Ref } from 'vue'

export interface UseSySelectAriaOptions {
	textInput: Ref<{ $el: HTMLElement } | null>
	isOpen: Ref<boolean>
	uniqueMenuId: Ref<string>
	activeDescendantId: Ref<string>
	isRequired: Ref<boolean | undefined>
	hasError: Ref<boolean>
	selectedItem: Ref<unknown>
}

export function useSySelectAria(options: UseSySelectAriaOptions) {
	const ariaManager = {
		cleanInputAttributes(inputElement: HTMLElement): void {
			if (!inputElement) return

			inputElement.removeAttribute('aria-describedby')
			inputElement.removeAttribute('size')
			inputElement.removeAttribute('tabindex')
			inputElement.removeAttribute('aria-hidden')
		},

		updateInputState(inputElement: HTMLElement, isOpenValue: boolean, menuId: string, activeDescendant?: string): void {
			if (!inputElement) return

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

			parentElement.removeAttribute('role')
			parentElement.removeAttribute('aria-expanded')
			parentElement.removeAttribute('aria-controls')
			parentElement.removeAttribute('aria-haspopup')
			parentElement.removeAttribute('aria-activedescendant')
			parentElement.removeAttribute('aria-required')
			parentElement.removeAttribute('aria-invalid')
			parentElement.removeAttribute('aria-hidden')
		},

		cleanAlertAttributes(parentElement: HTMLElement): void {
			if (!parentElement) return

			const messagesElements = parentElement.querySelectorAll('[role="alert"]')
			messagesElements.forEach((element: Element) => {
				element.removeAttribute('role')
				element.removeAttribute('aria-live')
			})
		},
	}

	const setupAriaAttributes = () => {
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
			if (inputElement) {
				if (newValue) {
					inputElement.setAttribute('aria-activedescendant', newValue)
				}
				else {
					inputElement.removeAttribute('aria-activedescendant')
				}
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
			if (!options.textInput.value || !options.textInput.value.$el) return

			setupAriaAttributes()
		})
	}, { deep: true })

	return {
		setupAriaAttributes,
	}
}

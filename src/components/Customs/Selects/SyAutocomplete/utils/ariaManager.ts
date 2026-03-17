/**
 * Shared ARIA helper used by SySelect and future picker components (autocomplete…)
 */
import { nextTick, type Ref } from 'vue'

export const ariaManager = {
	// Pour cleaner les attrs ARIA de l'input avant de les maj
	cleanInputAttributes(inputElement: HTMLElement): void {
		if (!inputElement) return

		inputElement.removeAttribute('aria-describedby')
		inputElement.removeAttribute('size')
		inputElement.removeAttribute('tabindex')
		inputElement.removeAttribute('aria-hidden')
		inputElement.removeAttribute('aria-autocomplete')
		inputElement.removeAttribute('aria-owns')
		inputElement.removeAttribute('aria-busy')
	},

	// Pour maj l'état ARIA de l'input combobox en fonction de l'ouverture du menu
	updateInputState(
		inputElement: HTMLElement,
		isOpenValue: boolean,
		menuId: string,
		activeDescendant?: string,
		options?: {
			ariaAutocomplete?: 'list' | 'both' | 'inline' | 'none'
			ownsId?: string
			isBusy?: boolean
			popupRendered?: boolean
		},
	): void {
		if (!inputElement) return

		inputElement.setAttribute('role', 'combobox')
		if (options?.ariaAutocomplete) {
			inputElement.setAttribute('aria-autocomplete', options.ariaAutocomplete)
		}

		if (options?.popupRendered) {
			inputElement.setAttribute('aria-controls', menuId)
		}
		else {
			inputElement.removeAttribute('aria-controls')
		}
		inputElement.setAttribute('aria-expanded', isOpenValue ? 'true' : 'false')

		const hasPopup = options?.popupRendered !== false
		if (hasPopup) {
			if (options?.ownsId) {
				inputElement.setAttribute('aria-owns', options.ownsId)
			}
			else {
				inputElement.removeAttribute('aria-owns')
			}
			if (options?.isBusy) {
				inputElement.setAttribute('aria-busy', 'true')
			}
			else {
				inputElement.removeAttribute('aria-busy')
			}
		}

		if (isOpenValue && activeDescendant) {
			inputElement.setAttribute('aria-activedescendant', activeDescendant)
		}
		else {
			inputElement.removeAttribute('aria-activedescendant')
		}
	},

	// Pour indiquer les états de validation (requis, erreur) via ARIA
	updateValidationAttributes(
		inputElement: HTMLElement,
		isRequiredValue: boolean,
		hasErrorValue: boolean,
	): void {
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

	// Pour cleaner les attrs ARIA du parent avant de les reconfigurer ds le composant
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

	setupAriaAttributesForAutocomplete(
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
		textFieldRef: Ref<any>,
		isOpen: Ref<boolean>,
		menuId: string,
		activeDescendant: Ref<string>,
		loading: boolean,
		inputLabel?: string,
	): void {
		nextTick(() => {
			const tf = textFieldRef.value
			if (!tf?.$el) return

			const parentEl = tf.$el as HTMLElement
			const inputEl = parentEl.querySelector('input') as HTMLElement | null
			const popupRendered = Boolean(document.getElementById(menuId))

			if (inputEl) {
				ariaManager.cleanInputAttributes(inputEl)
				ariaManager.updateInputState(
					inputEl,
					isOpen.value,
					menuId,
					activeDescendant.value,
					{
						ariaAutocomplete: 'list',
						isBusy: loading,
						popupRendered,
					},
				)
				const labelledById = inputEl.getAttribute('aria-labelledby')
				const labelElement = labelledById ? document.getElementById(labelledById) : null
				const labelElementHasText = Boolean(labelElement?.textContent?.trim())
				if (labelElementHasText) {
					// aria-labelledby references a visible label — aria-label is redundant and causes validator errors
					inputEl.removeAttribute('aria-label')
				}
				else {
					// No visible label element (e.g. chips mode with label="") — use aria-label as fallback
					const labelToApply = inputLabel || inputEl.getAttribute('aria-label') || inputEl.getAttribute('placeholder') || ''
					if (labelToApply) {
						inputEl.setAttribute('aria-label', labelToApply)
					}
				}
				inputEl.setAttribute('aria-haspopup', 'listbox')
				if (!popupRendered) {
					inputEl.removeAttribute('aria-controls')
					if (isOpen.value) {
						nextTick(() => {
							const popupNowRendered = Boolean(document.getElementById(menuId))
							if (popupNowRendered) {
								inputEl.setAttribute('aria-controls', menuId)
							}
						})
					}
				}
				ariaManager.updateValidationAttributes(inputEl, false, false)
				nextTick(() => {
					const popupStillThere = Boolean(document.getElementById(menuId))
					if (popupStillThere) {
						inputEl.setAttribute('aria-controls', menuId)
					}
					else {
						inputEl.removeAttribute('aria-controls')
					}
				})
			}

			ariaManager.cleanParentAttributes(parentEl)
			ariaManager.cleanAlertAttributes(parentEl)
		})
	},
}

import type { Directive } from 'vue'

export const vToolbar: Directive = {
	tools: [],
	onMounted(() => {
		tools = Array.from(toolbar.value?.querySelectorAll<HTMLElement>('button:not([disabled]), a:not([disabled]), input:not([disabled])') || [])
		tools?.forEach((el) => {
			el.setAttribute('tabindex', '-1')
		})
	}),

	mounted(el: HTMLElement) {
		el.addEventListener('keydown', (event: KeyboardEvent) => {
			// Vérifier si la touche pressée est "Tab"
			if (event.key === 'Tab') {
				// Empêcher le comportement par défaut pour éviter le focus sur les éléments non interactifs
				event.preventDefault()
			}
		})
	},
	selectNextElement(e: Event & { target: HTMLElement }) {
		const currentIndex = tools.findIndex(tool => tool === e.target)
	
		const nextIndex = currentIndex < tools.length - 1 ? currentIndex + 1 : 0
	
		const nextElem = tools.at(nextIndex)
	
		e.target.setAttribute('tabindex', '-1')
		nextElem?.setAttribute('tabindex', '0')
		nextElem?.focus()
	},
	
	selectPrevElement(e: Event & { target: HTMLElement }) {
		let currentIndex = tools.findIndex(tool => tool === e.target)
	
		const prevIndex = currentIndex > 0 ? currentIndex - 1 : tools.length - 1
	
		const nextElem = tools.at(prevIndex)
	
		e.target.setAttribute('tabindex', '-1')
		nextElem?.setAttribute('tabindex', '0')
		nextElem?.focus()
	},
	
	selectFirstElement() {
		const firstElement = tools.at(0)
		if (!firstElement) {
			return
		}
		document.activeElement?.setAttribute('tabindex', '-1')
		firstElement.setAttribute('tabindex', '0')
		firstElement.focus()
	},
	
	selectLastElement() {
		const lastElement = tools.at(-1)
		if (!lastElement) {
			return
		}
		document.activeElement?.setAttribute('tabindex', '-1')
		lastElement.setAttribute('tabindex', '0')
		lastElement.focus()
	},
	
	lastElementFocused: HTMLElement | undefined = undefined,
	
	setupFocus() {
		// Remove the ability to tab into the toolbar to be able to shift focus to previous focusable element
		toolbar.value?.setAttribute('tabindex', '-1')
	
		if (lastElementFocused) {
			// If there is a last focused element, restore focus to it
			lastElementFocused.setAttribute('tabindex', '0')
			lastElementFocused.focus()
		}
		else {
			selectFirstElement()
		}
	},
	
	saveFocus(e: FocusEvent) {
		// Save the last focused element to restore focus later
		if (e.target !== e.currentTarget) {
			lastElementFocused = e.target as HTMLElement
		}
	},
	
	blurToolbar(e: FocusEvent) {
		// When an item of the toolbar is blured it should not be focusable anymore
		(e.target as HTMLElement)?.setAttribute('tabindex', '-1')
	
		// When the toolbar loses focus, we need to set its focusable
		if (toolbar.value?.contains(e.relatedTarget as HTMLElement)) {
			return
		}
		toolbar.value?.setAttribute('tabindex', '0')
	},
}



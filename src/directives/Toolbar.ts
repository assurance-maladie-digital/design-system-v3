import type { Directive } from 'vue'

type Instance = {
	tools: HTMLElement[]
	lastElementFocused?: HTMLElement
}

const toolbarInstances = new WeakMap<HTMLElement, Instance>()

/**
 * This directive implements the "roving tabindex" pattern for accessible toolbars.
 *
 * example usage:
 * <div v-toolbar role="toolbar">
 *   <button>Tool 1</button>
 *   <button>Tool 2</button>
 *   <a href="#">Tool 3</a>
 * </div>
 *
 * The directive allows keyboard navigation through the toolbar's tools using arrow keys,
 * home, and end keys, while managing focus and tabindex attributes for accessibility.
 */
export const vToolbar: Directive = {
	mounted(el: HTMLElement) {
		el.setAttribute('role', 'toolbar') // Required on firefox to capture arrow keys!
		el.setAttribute('tabindex', '0')

		const tools = Array.from(el.querySelectorAll<HTMLElement>('button:not([disabled]), a:not([disabled]), input:not([disabled])') || [])

		toolbarInstances.set(el, {
			tools: tools,
			lastElementFocused: undefined,
		})

		tools.forEach((el) => {
			el.setAttribute('tabindex', '-1')
		})

		el.addEventListener('keydown', (event: KeyboardEvent) => {
			const instance = toolbarInstances.get(el)

			if (!instance) {
				return
			}

			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowDown':
					selectNextElement(event as KeyboardEvent & { target: HTMLElement }, instance.tools)
					break
				case 'ArrowLeft':
				case 'ArrowUp':
					selectPrevElement(event as KeyboardEvent & { target: HTMLElement }, instance.tools)
					break
				case 'Home':
					selectFirstElement(instance.tools)
					break
				case 'End':
					selectLastElement(instance.tools)
					break
			}
		})

		el.addEventListener('focus', () => {
			const instance = toolbarInstances.get(el)

			if (!instance) {
				return
			}

			setupFocus(el, instance)
		})

		el.addEventListener('focusin', (e: FocusEvent) => {
			const instance = toolbarInstances.get(el)
			if (!instance) {
				return
			}

			saveFocus(e, instance)
		})

		el.addEventListener('focusout', (e: FocusEvent) => {
			const instance = toolbarInstances.get(el)
			if (!instance) {
				return
			}

			blurToolbar(e, el)
		})
	},

	unmounted(el: HTMLElement) {
		toolbarInstances.delete(el)
	},
}

function selectNextElement(e: Event & { target: HTMLElement }, tools: HTMLElement[]) {
	const currentIndex = tools.findIndex(tool => tool === e.target)

	const nextIndex = currentIndex < tools.length - 1 ? currentIndex + 1 : 0

	const nextElem = tools.at(nextIndex)

	e.target.setAttribute('tabindex', '-1')
	nextElem?.setAttribute('tabindex', '0')
	nextElem?.focus()
}

function selectPrevElement(e: Event & { target: HTMLElement }, tools: HTMLElement[]) {
	const currentIndex = tools.findIndex(tool => tool === e.target)

	const prevIndex = currentIndex > 0 ? currentIndex - 1 : tools.length - 1

	const nextElem = tools.at(prevIndex)

	e.target.setAttribute('tabindex', '-1')
	nextElem?.setAttribute('tabindex', '0')
	nextElem?.focus()
}

function selectFirstElement(tools: HTMLElement[]) {
	const firstElement = tools.at(0)
	if (!firstElement) {
		return
	}
	document.activeElement?.setAttribute('tabindex', '-1')
	firstElement.setAttribute('tabindex', '0')
	firstElement.focus()
}

function selectLastElement(tools: HTMLElement[]) {
	const lastElement = tools.at(-1)
	if (!lastElement) {
		return
	}
	document.activeElement?.setAttribute('tabindex', '-1')
	lastElement.setAttribute('tabindex', '0')
	lastElement.focus()
}

function setupFocus(toolbar: HTMLElement, instance: Instance) {
	// Remove the ability to tab into the toolbar to be able to shift focus to previous focusable element
	toolbar?.setAttribute('tabindex', '-1')

	if (instance.lastElementFocused) {
		// If there is a last focused element, restore focus to it
		instance.lastElementFocused.setAttribute('tabindex', '0')
		instance.lastElementFocused.focus()
	}
	else {
		selectFirstElement(instance.tools)
	}
}

function saveFocus(e: FocusEvent, instance: Instance) {
	// Save the last focused element to restore focus later
	if (e.target !== e.currentTarget) {
		instance.lastElementFocused = e.target as HTMLElement
	}
}

function blurToolbar(e: FocusEvent, toolbar: HTMLElement) {
	// When an item of the toolbar is blured it should not be focusable anymore
	(e.target as HTMLElement)?.setAttribute('tabindex', '-1')

	// When the toolbar loses focus, we need to set its focusable
	if (toolbar?.contains(e.relatedTarget as HTMLElement)) {
		return
	}
	toolbar?.setAttribute('tabindex', '0')
}

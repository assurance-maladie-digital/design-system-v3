import { ref, type Ref, type TemplateRef } from 'vue'
import type { VDialog } from 'vuetify/components'

export function useDraggable(
	draggable: Readonly<Ref<boolean>>,
	dialogContent: TemplateRef<VDialog | null | undefined>,
) {
	const isGrabbing = ref(false)
	function startDragging(e: MouseEvent) {
		if (!draggable.value) return

		isGrabbing.value = true

		const dialogElement = dialogContent?.value?.$el.querySelector('.sy-dialog-box-title') as HTMLElement
		const overlayElement = dialogContent?.value?.$el.closest('.v-overlay__content') as HTMLElement
		if (!dialogElement || !overlayElement) throw new Error('Dialog element not found')

		const computedStyle = getComputedStyle(overlayElement)
		const marginLeft = parseFloat(computedStyle.marginLeft) || 0
		const marginTop = parseFloat(computedStyle.marginTop) || 0

		const rect = overlayElement.getBoundingClientRect()
		const offsetX = e.clientX - rect.left + marginLeft
		const offsetY = e.clientY - rect.top + marginTop

		function onMouseMove(e: MouseEvent) {
			const windowWidth = window.innerWidth
			const windowHeight = window.innerHeight

			const overlayWidth = overlayElement.offsetWidth
			const overlayHeight = overlayElement.offsetHeight

			let left = e.clientX - offsetX
			let top = e.clientY - offsetY

			// Prevent the dialog from going outside the window horizontally
			left = Math.max(-marginLeft, Math.min(left, windowWidth - overlayWidth - marginLeft))

			// Prevent the dialog from going outside the window vertically
			top = Math.max(-marginTop, Math.min(top, windowHeight - overlayHeight - marginTop))

			overlayElement.style.position = 'absolute'
			overlayElement.style.left = `${left}px`
			overlayElement.style.top = `${top}px`
		}

		function onMouseUp() {
			isGrabbing.value = false
			window.removeEventListener('mousemove', onMouseMove)
			window.removeEventListener('mouseup', onMouseUp)
		}

		window.addEventListener('mousemove', onMouseMove)
		window.addEventListener('mouseup', onMouseUp)
	}

	/* Keyboard accessibility functions */

	function moveToLeft() {
		const overlayElement = dialogContent?.value?.$el.closest('.v-overlay__content') as HTMLElement
		if (!overlayElement) throw new Error('Dialog element not found')

		const computedStyle = getComputedStyle(overlayElement)
		const marginLeft = parseFloat(computedStyle.marginLeft) || 0
		const positionToLeft = window.innerWidth - overlayElement.offsetWidth - marginLeft * 2

		if (overlayElement.style.left === `${positionToLeft}px`) {
			overlayElement.style.position = 'static'
			overlayElement.style.left = ``
			return
		}

		overlayElement.style.position = 'absolute'
		overlayElement.style.left = `0px`
		overlayElement.style.top = ''
	}

	function moveToRight() {
		const overlayElement = dialogContent?.value?.$el.closest('.v-overlay__content') as HTMLElement
		if (!overlayElement) throw new Error('Dialog element not found')

		const computedStyle = getComputedStyle(overlayElement)
		const marginLeft = parseFloat(computedStyle.marginLeft) || 0
		const positionToLeft = window.innerWidth - overlayElement.offsetWidth - marginLeft * 2

		if (overlayElement.style.left === `0px`) {
			overlayElement.style.position = 'static'
			overlayElement.style.left = ``
			return
		}

		overlayElement.style.position = 'absolute'
		overlayElement.style.left = `${positionToLeft}px`
		overlayElement.style.top = ''
	}

	return { isGrabbing, startDragging, moveToLeft, moveToRight }
}

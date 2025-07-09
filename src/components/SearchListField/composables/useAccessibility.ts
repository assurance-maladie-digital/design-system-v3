import { nextTick, onMounted, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * Composable to handle accessibility improvements
 * @param containerRef - Ref to the container element that contains the elements to enhance
 * @param dependencies - Optional reactive dependencies to watch for changes
 */
export function useAccessibility(containerRef: Ref<HTMLElement | null>, dependencies?: Ref<unknown>[]) {
	// Function to remove aria-describedby from all checkboxes
	const removeAriaDescribedby = () => {
		nextTick(() => {
			// Use document.querySelectorAll to get all checkboxes
			// This is more reliable than using the ref which might not contain all checkboxes yet
			const inputs = document.querySelectorAll('input[type="checkbox"]')
			inputs.forEach((input) => {
				input.removeAttribute('aria-describedby')
			})
		})
	}

	// Set up watchers for dependencies if provided
	if (dependencies && dependencies.length > 0) {
		dependencies.forEach((dependency) => {
			watch(dependency, () => {
				removeAriaDescribedby()
			})
		})
	}

	// Call the function when the component is mounted
	onMounted(() => {
		removeAriaDescribedby()

		// Set up a MutationObserver to watch for changes to the DOM
		const observer = new MutationObserver(() => {
			removeAriaDescribedby()
		})

		// Start observing the document with the configured parameters
		observer.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: true,
			attributeFilter: ['aria-describedby']
		})
	})

	return {
		removeAriaDescribedby
	}
}

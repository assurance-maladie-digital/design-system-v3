import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { locales } from './locales'

export function useTableRowCheckboxAccessibility({
	uniqueTableId,
}: {
	uniqueTableId: string
}) {
	const timeouts = ref<ReturnType<typeof setTimeout>[]>([])

	const accessibilityRowCheckboxes = () => {
		nextTick(() => {
			const timeoutId = setTimeout(() => {
				if (typeof document === 'undefined') return

				const tableElement = document.getElementById(uniqueTableId)
				if (!tableElement) return

				const rowCheckboxes = tableElement.querySelectorAll(
					'td .v-selection-control input[type="checkbox"], td .v-selection-control input[type="radio"]',
				)
				rowCheckboxes.forEach((checkbox, index) => {
					const rowLabel = `${locales.selectRow} ${index + 1}`
					checkbox.setAttribute('aria-label', rowLabel)
					checkbox.setAttribute('title', rowLabel)
				})
			}, 100)

			timeouts.value.push(timeoutId)
		})
	}

	onMounted(() => {
		accessibilityRowCheckboxes()
	})

	onUnmounted(() => {
		timeouts.value.forEach(clearTimeout)
		timeouts.value = []
	})

	return { accessibilityRowCheckboxes }
}

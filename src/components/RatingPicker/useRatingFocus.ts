import { nextTick, ref, watch, type Ref } from 'vue'

type SelectValueFn = (value: number) => void

interface UseRatingFocusOptions {
	length: Ref<number>
	modelValue: Ref<number>
	selectValue: SelectValueFn
	wrap?: boolean
}

export function useRatingFocus({
	length,
	modelValue,
	selectValue,
	wrap = true,
}: UseRatingFocusOptions) {
	const ratingElement = ref<HTMLElement[]>([])

	function setFocus(index: number) {
		ratingElement.value.forEach((el, i) => {
			if (!el) return
			el.setAttribute('tabindex', i === index ? '0' : '-1')
		})

		ratingElement.value[index]?.focus()
	}

	function getCurrentIndex() {
		if (modelValue.value >= 1 && modelValue.value <= length.value) {
			return modelValue.value - 1
		}
		return 0
	}

	function initFocus() {
		setFocus(getCurrentIndex())
	}

	function selectAndFocus(index: number) {
		const value = index + 1
		selectValue(value)
		nextTick(() => setFocus(index))
	}

	function focusNextElement(index: number) {
		let nextIndex = index + 1

		if (wrap) {
			if (nextIndex >= length.value) {
				nextIndex = 0
			}
		}
		else {
			nextIndex = Math.min(nextIndex, length.value - 1)
		}

		setFocus(nextIndex)
	}

	function focusPrevElement(index: number) {
		let prevIndex = index - 1

		if (wrap) {
			if (prevIndex < 0) {
				prevIndex = length.value - 1
			}
		}
		else {
			prevIndex = Math.max(prevIndex, 0)
		}

		setFocus(prevIndex)
	}

	function focus() {
		nextTick(() => {
			setFocus(getCurrentIndex())
		})
	}

	watch(modelValue, () => {
		nextTick(() => {
			setFocus(getCurrentIndex())
		})
	})

	return {
		ratingElement,
		setFocus,
		initFocus,
		selectAndFocus,
		focusNextElement,
		focusPrevElement,
		focus,
	}
}

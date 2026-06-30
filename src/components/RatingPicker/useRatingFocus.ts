import { nextTick, ref, watch, type Ref } from 'vue'

type SelectValueFn = (value: number) => void

interface UseRatingFocusOptions {
	length: Ref<number>
	modelValue: Ref<number>
	selectValue: SelectValueFn
	ratingElements: Ref<HTMLElement[]>
	wrap?: boolean
}

export function useRatingFocus({
	length,
	modelValue,
	selectValue,
	ratingElements,
	wrap = true,
}: UseRatingFocusOptions) {
	const activeElementIndex = ref(getCurrentIndex())
	function setFocus(index: number) {
		activeElementIndex.value = index
		ratingElements.value[index]?.focus()
	}

	function getCurrentIndex() {
		if (modelValue.value >= 1 && modelValue.value <= length.value) {
			return modelValue.value - 1
		}
		return 0
	}

	function selectAndFocus(index: number) {
		const value = index + 1
		selectValue(value)
		nextTick(() => setFocus(index))
	}

	function focusNextElement(index: number) {
		let nextIndex = index + 1

		if (wrap && nextIndex >= length.value) {
			nextIndex = 0
		}
		else {
			nextIndex = Math.min(nextIndex, length.value - 1)
		}

		setFocus(nextIndex)
	}

	function focusPrevElement(index: number) {
		let prevIndex = index - 1

		if (wrap && prevIndex < 0) {
			prevIndex = length.value - 1
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
		activeElementIndex,
		setFocus,
		selectAndFocus,
		focusNextElement,
		focusPrevElement,
		focus,
	}
}

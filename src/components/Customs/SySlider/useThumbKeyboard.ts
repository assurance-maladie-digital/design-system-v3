import { onMounted, toValue, type MaybeRef, type Ref } from 'vue'

/**
 * Custom hook to handle keyboard events for a slider thumb.
 *
 * @param thumb The thumb element of the slider.
 * @param value The current value of the slider.
 * @param minSelectableValue The minimum currently selectable value for the slider.
 * @param maxSelectableValue The maximum currently selectable value for the slider.
 * @param step The step displacement for the slider.
 * @param setValue The function to set the value of the slider.
 */
export default function useThumbKeyboard(
	thumb: MaybeRef<HTMLElement>,
	value: Ref<number>,
	minSelectableValue: MaybeRef<number>,
	maxSelectableValue: MaybeRef<number>,
	step: MaybeRef<number>,
	setValue: (value: number) => void,
) {
	onMounted(() => {
		toValue(thumb).addEventListener('keydown', handleKeyDown)
	})

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
			event.preventDefault()
			const newValue = toValue(value) - toValue(step)
			if (newValue >= toValue(minSelectableValue)) {
				setValue(newValue)
			}
		}
		else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
			event.preventDefault()
			const newValue = toValue(value) + toValue(step)
			if (newValue <= toValue(maxSelectableValue)) {
				setValue(newValue)
			}
		}
		else if (event.key === 'Home') {
			event.preventDefault()
			setValue(toValue(minSelectableValue))
		}
		else if (event.key === 'End') {
			event.preventDefault()
			setValue(toValue(maxSelectableValue))
		}
		else if (event.key === 'PageDown') {
			event.preventDefault()
			const newValue = toValue(value) - toValue(step) * 10
			if (newValue >= toValue(minSelectableValue)) {
				setValue(newValue)
			}
			else {
				setValue(toValue(minSelectableValue))
			}
		}
		else if (event.key === 'PageUp') {
			event.preventDefault()
			const newValue = toValue(value) + toValue(step) * 10
			if (newValue <= toValue(maxSelectableValue)) {
				setValue(newValue)
			}
			else {
				setValue(toValue(maxSelectableValue))
			}
		}
	}
}

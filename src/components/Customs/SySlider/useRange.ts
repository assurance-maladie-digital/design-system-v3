import { computed, readonly, ref, toValue, watchEffect, type MaybeRef } from 'vue'

/**
 * Custom hook to manage a range value within specified bounds.
 *
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @param step - The step value for incrementing or decrementing the range.
 * @param defaultValue - The initial value of the range (default is 0).
 * @returns An object containing methods to increase, decrease, set the range value, and a computed style object.
 *
 * @throws {Error} If the minimum value is greater than the maximum value.
 */
export default function useRange(
	min: MaybeRef<number>,
	max: MaybeRef<number>,
	step: MaybeRef<number>,
	defaultValue: number = 0,
) {
	const range = ref(
		defaultValue <= toValue(max)
		&& defaultValue >= toValue(min)
			? defaultValue
			: toValue(min),
	)

	watchEffect(() => {
		if (range.value > toValue(max)) {
			range.value = toValue(max)
		}
		if (range.value < toValue(min)) {
			range.value = toValue(min)
		}
		if (toValue(min) > toValue(max)) {
			throw new Error('The minimum value must be less than or equal to the maximum value.')
		}
	})

	const increase = () => {
		range.value = Math.min(range.value + toValue(step), toValue(max))
	}

	const decrease = () => {
		range.value = Math.max(range.value - toValue(step), toValue(min))
	}

	const setRange = (value: number) => {
		if (value <= toValue(max) && value >= toValue(min)) {
			range.value = value
		}
	}

	const style = computed(() => {
		const rangeWidth = toValue(max) - toValue(min)
		const percent = rangeWidth == 0 ? 100 : (range.value - toValue(min)) / rangeWidth * 100 // something when wrong here
		return {
			left: `${percent}%`,
		}
	})

	// if min et max are ref, we need to watch them
	watchEffect(() => {
		if (range.value > toValue(max)) {
			range.value = toValue(max)
		}
		if (range.value < toValue(min)) {
			range.value = toValue(min)
		}
	})

	return { increase, decrease, setRange, style, range: readonly(range) }
}

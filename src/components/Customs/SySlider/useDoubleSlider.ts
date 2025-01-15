import { ref, watch, toValue, type MaybeRef } from 'vue'

/**
 * Handle the incoming values for a range slider.
 *
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @param step The step value for the slider.
 * @param value {[number, number]} The current value of the slider.
 * @returns An reactive object containing the selected min and max values, the range min and max values, and the step value.
 */
export default function useDoubleSlider(
	min: MaybeRef<number | string>,
	max: MaybeRef<number | string>,
	step: MaybeRef<number>,
	value: MaybeRef<Array<number | string>>,
) {
	if (toValue(min) > toValue(max)) {
		[min, max] = [max, min]
	}

	/* const range = reactive({
		selectedMin: Number(toValue(min)),
		selectedMax: Number(toValue(max)),
		rangeMin: Number(toValue(min)),
		rangeMax: Number(toValue(max)),
		step: Number(toValue(step)),
	}) */

	const range = {
		selectedMin: ref(Number(toValue(min))),
		selectedMax: ref(Number(toValue(max))),
		rangeMin: ref(Number(toValue(min))),
		rangeMax: ref(Number(toValue(max))),
		step: ref(Number(toValue(step))),
	}

	// if min change, the other values must be coherent
	watch(() => toValue(min), (newVal) => {
		newVal = Number(newVal)

		if (isNaN(newVal) || !isFinite(newVal)) {
			return
		}
		if (newVal > range.rangeMax.value) {
			return
		}
		if (range.selectedMin.value < newVal) {
			range.selectedMin.value = newVal
		}
		if (range.selectedMax.value < newVal) {
			range.selectedMax.value = newVal
		}

		range.rangeMin.value = newVal
	})

	// if max change, the other values must be coherent
	watch(() => toValue(max), (newVal) => {
		newVal = Number(newVal)

		if (isNaN(newVal) || !isFinite(newVal)) {
			return
		}
		if (newVal < range.rangeMin.value) {
			return
		}
		if (range.selectedMin.value > newVal) {
			range.selectedMin.value = newVal
		}
		if (range.selectedMax.value > newVal) {
			range.selectedMax.value = newVal
		}

		range.rangeMax.value = newVal
	})

	watch(() => toValue(step), (newVal) => {
		if (!isStepValid(newVal, range.rangeMin.value, range.rangeMax.value)) {
			return
		}
		range.step.value = Math.abs(newVal)
	})

	// the selected values must be in the bounds and coherent
	watch(() => toValue(value), (newVal) => {
		const newValCasted = newVal.map(Number)

		if (!isValidNumber(newValCasted[0]) || !isValidNumber(newValCasted[1])) {
			return
		}
		if (newValCasted[0] > newValCasted[1]) {
			return
		}
		if (newValCasted[0] < range.rangeMin.value) {
			range.selectedMin.value = range.rangeMin.value
		}
		if (newValCasted[1] > range.rangeMax.value) {
			range.selectedMax.value = range.rangeMax.value
		}

		range.selectedMin.value = newValCasted[0]
		range.selectedMax.value = newValCasted[1]
	}, { immediate: true })

	return range
}

function isValidNumber(value: number) {
	return !isNaN(value) && isFinite(value)
}

function isStepValid(step: number, rangeStart: number, rangeEnd: number) {
	return !isNaN(step) && isFinite(step) && step != 0 && step <= rangeEnd - rangeStart
}

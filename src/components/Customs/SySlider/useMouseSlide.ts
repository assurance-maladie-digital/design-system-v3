import { ref, toValue, type MaybeRef } from 'vue'

/**
 * Custom hook to handle mouse dragging functionality for a slider component.
 *
 * @param track - The track element of the slider.
 * @param range - The current range value of the slider.
 * @param rangeStart - The starting value of the slider range.
 * @param rangeEnd - The ending value of the slider range.
 * @param step - The step value for the slider.
 * @param minSelectedValue - The minimum currently selectable value for the slider.
 * @param maxSelectedValue - The maximum currently selectable value for the slider.
 * @param callback - The callback function to be called with the new value when the slider is dragged.
 *
 * @returns An object containing the `startDrag` function to initiate the dragging.
 */
export default function useMouseSlide(
	track: MaybeRef<HTMLElement>,
	range: Readonly<MaybeRef<number>>,
	rangeStart: MaybeRef<number>,
	rangeEnd: MaybeRef<number>,
	step: MaybeRef<number>,
	minSelectedValue: MaybeRef<number>,
	maxSelectedValue: MaybeRef<number>,
	callback: (value: number) => void,
) {
	const inProgress = ref(false)
	let effectedChange = 0
	let startX: null | number = null

	function startDrag() {
		inProgress.value = true
		document.addEventListener('mousemove', drag)
		document.addEventListener('mouseup', stopDrag)
	}

	function stopDrag() {
		document.removeEventListener('mousemove', drag)
		document.removeEventListener('mouseup', stopDrag)
		effectedChange = 0
		startX = null

		setTimeout(() => {
			inProgress.value = false
		}, 100)
	}

	function drag(event: MouseEvent) {
		event.stopPropagation()
		if (startX === null) {
			startX = event.clientX
			return
		}
		const trackRect = toValue(track).getBoundingClientRect()
		const trackWidth = trackRect.width
		const dx = event.clientX - startX

		const percentChange = dx * 100 / trackWidth
		const percentStep = toValue(step) * 100 / (toValue(rangeEnd) - toValue(rangeStart))
		const stepsChange = Math.round(percentChange / percentStep)

		const theoricTotalChange = stepsChange * toValue(step)
		const theoricCurrentChange = theoricTotalChange - effectedChange
		const theoricNewValue = toValue(range) + theoricCurrentChange

		const clampedNewValue = clamp(
			toValue(minSelectedValue),
			theoricNewValue,
			toValue(maxSelectedValue),
		)

		const currentChange = clampedNewValue - toValue(range)

		if (currentChange === 0) {
			return
		}

		effectedChange += currentChange
		callback(clampedNewValue)
	}

	return {
		startDrag,
		inProgress,
	}
}

function clamp(min: number, value: number, max: number) {
	return Math.max(min, Math.min(value, max))
}

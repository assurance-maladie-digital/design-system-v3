import { onMounted, ref, toValue, type MaybeRef } from 'vue'

/**
 * Custom hook to handle mouse dragging functionality for a slider component.
 *
 * @param track - The track element of the slider.
 * @param currentValue - The current range value of the slider.
 * @param rangeStart - The minimal value of the slider range.
 * @param rangeEnd - The maximal value of the slider range.
 * @param step - The step value for the slider.
 * @param minSelectableValue - The minimum currently selectable value for the slider.
 * @param maxSelectableValue - The maximum currently selectable value for the slider.
 * @param callback - The callback function to be called with the new value when the slider is dragged.
 *
 * @returns An object containing the `startDrag` function to initiate the dragging.
 */
export default function useMouseSlide(
	thumb: MaybeRef<HTMLElement>,
	track: MaybeRef<HTMLElement>,
	currentValue: Readonly<MaybeRef<number>>,
	rangeStart: MaybeRef<number>,
	rangeEnd: MaybeRef<number>,
	step: MaybeRef<number>,
	minSelectableValue: MaybeRef<number>,
	maxSelectableValue: MaybeRef<number>,
	callback: (value: number) => void,
) {
	const inProgress = ref(false)
	let effectedChange = 0
	let startX: null | number = null

	onMounted(() => {
		toValue(thumb).addEventListener('mousedown', startDrag)
		toValue(thumb).addEventListener('touchstart', startDrag)
	})

	function startDrag() {
		inProgress.value = true
		document.addEventListener('mousemove', drag)
		document.addEventListener('mouseup', stopDrag)

		document.addEventListener('touchmove', drag)
		document.addEventListener('touchend', stopDrag)
		document.addEventListener('touchcancel', stopDrag)
	}

	let rafId: number | null = null
	let lastPointerX: number | null = null

	function stopDrag() {
		document.removeEventListener('mousemove', drag)
		document.removeEventListener('mouseup', stopDrag)

		document.removeEventListener('touchmove', drag)
		document.removeEventListener('touchend', stopDrag)
		document.removeEventListener('touchcancel', stopDrag)

		// Cancel any scheduled frame on stop
		if (rafId !== null) {
			cancelAnimationFrame(rafId)
			rafId = null
		}
		effectedChange = 0
		startX = null
		lastPointerX = null

		// avoid click on track after dragging
		setTimeout(() => {
			inProgress.value = false
		}, 100)
	}

	function drag(event: MouseEvent | TouchEvent) {
		event.stopPropagation()
		lastPointerX = ('touches' in event) ? event.touches[0].clientX : event.clientX
		if (startX === null) {
			startX = lastPointerX
		}
		// Schedule a frame if we don't have one already
		if (rafId === null) {
			rafId = requestAnimationFrame(processDrag)
		}
	}

	function processDrag() {
		rafId = null
		if (lastPointerX === null || startX === null) return

		const curStep = toValue(step)
		const curValue = Math.round(toValue(currentValue) / curStep) * curStep

		const trackRect = toValue(track).getBoundingClientRect()
		const trackWidth = trackRect.width
		const dx = lastPointerX - startX

		const percentChange = dx * 100 / trackWidth
		const percentStep = curStep * 100 / (toValue(rangeEnd) - toValue(rangeStart))
		const stepsChange = Math.round(percentChange / percentStep)

		const theoreticalTotalChange = stepsChange * curStep
		const theoreticalCurrentChange = theoreticalTotalChange - effectedChange
		const theoreticalNewValue = curValue + theoreticalCurrentChange

		const clampedNewValue = clamp(
			toValue(minSelectableValue),
			theoreticalNewValue,
			toValue(maxSelectableValue),
		)

		const currentChange = clampedNewValue - curValue
		if (currentChange === 0) return

		effectedChange += currentChange
		callback(clampedNewValue)
	}

	return {
		inProgress,
	}
}

function clamp(min: number, value: number, max: number) {
	return Math.max(min, Math.min(value, max))
}

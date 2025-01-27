import { onMounted, toValue, type MaybeRef } from 'vue'
import type { Range } from './types'

/**
 * Custom hook to handle the click event on the track of a
 * min - max slider component.
 *
 * @param track The track element of the slider.
 * @param range An object containing the the following informations about the range: rangeMin, rangeMax, selectedMin, selectedMax, step.
 * @param setMin A function to set the minimum value.
 * @param setMax A function to set the maximum value.
 * @param disable Temporary disable the click on the track
 */
export default function useTrack(
	track: MaybeRef<HTMLElement>,
	range: Range,
	setMin: (value: number) => void,
	setMax: (value: number) => void,
	disable: MaybeRef<boolean> = false,
) {
	function setPosition(event: MouseEvent) {
		if (toValue(disable)) return

		const rect = toValue(track).getBoundingClientRect()
		const rangeStartValue = toValue(range.rangeMin)
		const rangeEndValue = toValue(range.rangeMax)

		const clickX = event.clientX - rect.left
		const clickXPercentage = (clickX / rect.width) * 100
		const setThumb = getThumbMoveFunc(
			clickXPercentage,
			rangeStartValue,
			rangeEndValue,
			toValue(range.selectedMin),
			toValue(range.selectedMax),
			setMin,
			setMax,
		)
		const newPosition = getClosetStep(
			clickXPercentage,
			rangeStartValue,
			rangeEndValue,
			toValue(range.step),
		)

		setThumb(newPosition)
	}

	onMounted(() => {
		toValue(track).addEventListener('click', setPosition)
	})
}

/**
 * Get the closest step position to the click position.
 *
 * @param percentPosition The new position in percentage.
 * @param rangeStart The start of the range.
 * @param rangeEnd The end of the range.
 * @param step The gap between each step.
 * @returns The closest step position.
 */
function getClosetStep(
	percentPosition: number,
	rangeStart: number,
	rangeEnd: number,
	step: number,
) {
	const rangeWidth = rangeEnd - rangeStart
	const percentStep = (step * 100) / rangeWidth
	const stepsChange = Math.round(percentPosition / percentStep)

	return stepsChange * step + rangeStart
}

/**
 * Get the closest thumb to the click position.
 *
 * @param percentPosition The new position in percentage.
 * @param rangeStart The start of the range.
 * @param rangeEnd The end of the range.
 * @param minSelectedValue The current minimum selected value.
 * @param maxSelectedValue The current maximum selected value.
 * @param setMin A function to set the minimum value.
 * @param setMax A function to set the maximum value.
 * @returns The function to set the thumb value.
 */
function getThumbMoveFunc(
	percentPosition: number,
	rangeStart: number,
	rangeEnd: number,
	minSelectedValue: number,
	maxSelectedValue: number,
	setMin: (value: number) => void,
	setMax: (value: number) => void,
) {
	const rangeWidth = rangeEnd - rangeStart

	const minPercent = Math.abs(
		((minSelectedValue - rangeStart) / rangeWidth) * 100,
	)
	const maxPercent = Math.abs(
		((maxSelectedValue - rangeStart) / rangeWidth) * 100,
	)
	const minDistance = Math.abs(minPercent - percentPosition)
	const maxDistance = Math.abs(maxPercent - percentPosition)

	if (
		minDistance < maxDistance
		|| (minDistance === maxDistance && percentPosition < minPercent)
	) {
		return setMin
	}

	return setMax
}

import {
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	toValue,
	watch,
	type Ref,
} from 'vue'
import type Tooltip from './Tooltip/Tooltip.vue'
import type { Range } from './types'

/**
 * Handles nudging the tooltips when they overlap.
 *
 * @param minThumb The min thumb tooltip.
 * @param maxThumb The max thumb tooltip.
 * @param placeholderMinThumb A fake min thumb tooltip with no animations that is used to calculate the nudge.
 * @param placeholderMaxThumb A fake max thumb tooltip with no animations that is used to calculate the nudge.
 * @param range The range informations.
 */
export default function useTooltipsNudge(
	minThumb: Ref<typeof Tooltip | null>,
	maxThumb: Ref<typeof Tooltip | null>,
	placeholderMinThumb: Ref<typeof Tooltip | null>,
	placeholderMaxThumb: Ref<typeof Tooltip | null>,
	range: Range,
) {
	const nudgeMinThumb = ref(0)
	const nudgeMaxThumb = ref(0)

	async function calculateNudges() {
		await nextTick()

		const rectMin: DOMRect = placeholderMinThumb.value!.element.getBoundingClientRect()
		const rectMax: DOMRect = placeholderMaxThumb.value!.element.getBoundingClientRect()

		const tooltipsOverlaps = rectMin.right - rectMax.left

		if (tooltipsOverlaps >= 0) {
			const tooltipArrowWidth = 12

			const minOverflow = rectMin.width / 2 - tooltipArrowWidth
			const maxOverflow = rectMax.width / 2 - tooltipArrowWidth

			const overflowDiff = Math.abs(minOverflow - maxOverflow)

			let nudgeMin = 0, nudgeMax = 0

			if (minOverflow > maxOverflow) {
				nudgeMin = Math.min(tooltipsOverlaps, overflowDiff)
			}
			else {
				nudgeMax = Math.min(tooltipsOverlaps, overflowDiff)
			}

			if (tooltipsOverlaps > overflowDiff) {
				const residualDifference = tooltipsOverlaps - overflowDiff
				const gap = Math.ceil(residualDifference / 2)
				nudgeMin += gap
				nudgeMax += gap
			}

			nudgeMinThumb.value = nudgeMin + 1
			nudgeMaxThumb.value = nudgeMax + 1
		}
		else {
			nudgeMinThumb.value = 0
			nudgeMaxThumb.value = 0
		}
	}

	onMounted(() => {
		minThumb.value!.element.style.transition = 'transform 0.1s'
		maxThumb.value!.element.style.transition = 'transform 0.1s'
		watch(
			() => [toValue(range.selectedMin), toValue(range.selectedMax)],
			calculateNudges,
			{ immediate: true },
		)
		window.addEventListener('resize', calculateNudges)
	})

	onUnmounted(() => {
		window.removeEventListener('resize', calculateNudges)
	})

	return {
		nudgeMinThumb,
		nudgeMaxThumb,
	}
}

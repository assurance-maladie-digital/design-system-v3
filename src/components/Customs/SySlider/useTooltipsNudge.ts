import {
	nextTick,
	onMounted,
	onUnmounted,
	ref,
	toValue,
	watch,
	type Ref,
} from 'vue'
import type Tooltip from './tooltip/Tooltip.vue'
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

		const rectMin = placeholderMinThumb.value!.$el.getBoundingClientRect()
		const rectMax = placeholderMaxThumb.value!.$el.getBoundingClientRect()

		const difference = rectMin.right - rectMax.left

		if (difference >= 0) {
			const nudge = Math.ceil(difference / 2) + 1

			nudgeMinThumb.value = nudge
			nudgeMaxThumb.value = nudge
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

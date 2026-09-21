import { computed, ref, watch } from 'vue'
import type { Ref } from 'vue'

/**
 * Slide transition between the displayed months: derives the slide direction
 * from the month changes, whatever their origin, and hides the leaving grid
 * from assistive technologies and interactions during the slide.
 */
export default function useMonthTransition(displayedMonth: Ref<Date | undefined>) {
	/** Direction of the slide, derived from the month changes */
	const slideDirection = ref<'next' | 'prev'>('next')

	/**
	 * Index of the displayed month, as a primitive: watching it instead of the
	 * date object makes the comparison reliable even when the parent mutates
	 * the date in place (the reactive proxy is then the same before and after).
	 */
	const monthIndex = computed(() => {
		const month = displayedMonth.value
		return month ? month.getFullYear() * 12 + month.getMonth() : undefined
	})

	watch(monthIndex, (newIndex, oldIndex) => {
		if (newIndex === undefined || oldIndex === undefined) return
		slideDirection.value = newIndex > oldIndex ? 'next' : 'prev'
	})

	/**
	 * Make the leaving grid inert during the slide: it stays visible but is
	 * removed from the accessibility tree and can not be interacted with.
	 */
	function onLeave(el: Element) {
		el.setAttribute('inert', '')
	}

	/** Props to bind to the Transition component */
	const transitionProps = computed(() => ({
		name: `slide-${slideDirection.value}`,
		onLeave,
	}))

	return {
		transitionProps,
	}
}

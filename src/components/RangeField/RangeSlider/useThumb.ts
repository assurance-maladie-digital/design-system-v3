import { computed, toValue, type MaybeRef } from 'vue'

export default function useThumb(
	selected: MaybeRef<number>,
	rangeMin: MaybeRef<number>,
	rangeMax: MaybeRef<number>,
) {
	const thumbStyle = computed(() => {
		const currentValue = toValue(selected)
		const rangeWidth = toValue(rangeMax) - toValue(rangeMin)
		const percent = rangeWidth == 0 ? 100 : (currentValue - toValue(rangeMin)) / rangeWidth * 100
		return {
			left: `${percent}%`,
		}
	})

	return { thumbStyle }
}

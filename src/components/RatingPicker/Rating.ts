import { ref, computed } from 'vue'

export interface RatingInterface {
	emitInputEvent(event: string | number): void
}

export enum RatingEnum {
	EMOTION = 'emotion',
	NUMBER = 'number',
	STARS = 'stars',
}

export const RATING_ENUM_VALUES = Object.values(RatingEnum)

export enum AlertTypeEnum {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error',
}

export const ALERT_TYPE_ENUM_VALUES = Object.values(AlertTypeEnum)

export function useRating(props: {
	label: string | null
	readonly: boolean
	modelValue: number
}, emit: (event: 'update:modelValue', value: number) => void) {
	const internalValue = ref<number>(props.modelValue)

	const hasAnswered = computed(() => internalValue.value !== -1)

	function emitInputEvent(value: string | number): void {
		if (!props.readonly) {
			internalValue.value = typeof value === 'number' ? value : parseInt(value, 10)
			emit('update:modelValue', internalValue.value) // Emit the updated value
		}
	}

	return {
		internalValue,
		hasAnswered,
		emitInputEvent,
	}
}

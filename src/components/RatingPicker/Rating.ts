import { defineComponent, computed, type PropType } from 'vue'

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

export const Rating = defineComponent({
	props: {
		label: {
			type: String as PropType<string | null>,
			default: null,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Number,
			default: -1,
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const hasAnswered = computed(() => props.modelValue !== -1)

		function emitInputEvent(value: string | number): void {
			if (!props.readonly) {
				emit('update:modelValue', value)
			}
		}

		return {
			hasAnswered,
			emitInputEvent,
		}
	},
})

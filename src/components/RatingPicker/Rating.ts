import { defineComponent } from 'vue'
import type { PropType } from 'vue'

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
	methods: {
		emitInputEvent(value: string | number): void {
			this.$emit('update:modelValue', value)
		},
	},
})

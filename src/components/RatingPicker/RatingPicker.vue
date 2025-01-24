<script setup lang="ts">
	import { type PropType, defineProps, defineEmits, computed, ref } from 'vue'

	import EmotionPicker from './EmotionPicker/EmotionPicker.vue'
	import NumberPicker from './NumberPicker/NumberPicker.vue'
	import StarsPicker from './StarsPicker/StarsPicker.vue'
	import SyAlert from '@/components/SyAlert/SyAlert.vue'

	import { RATING_ENUM_VALUES, RatingEnum, AlertTypeEnum } from './Rating'
	import { propValidator } from '@/utils/propValidator'
	import { locales } from './locales'

	const props = defineProps({
		type: {
			type: String,
			required: true,
			validator: (value: string) => propValidator('type', RATING_ENUM_VALUES, value),
		},
		label: {
			type: String as PropType<string | null>,
			default: null,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		itemLabels: {
			type: Array as PropType<string[]>,
			default: null,
		},
		twoEmotions: {
			type: Boolean,
			default: false,
		},
		hideAlert: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Number,
			default: -1,
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const alertTypeEnumRef = ref(AlertTypeEnum)
	const internalValue = ref(-1)
	const displayAdditionalContent = ref(false)

	const ratingComponent = computed(() => {
		if (props.type === RatingEnum.EMOTION) {
			return EmotionPicker as string
		}
		else if (props.type === RatingEnum.NUMBER) {
			return NumberPicker as string
		}
		else {
			return StarsPicker as string
		}
	})

	const length = computed(() => {
		if (props.type === RatingEnum.EMOTION) {
			return props.twoEmotions ? 2 : 3
		}
		return undefined
	})

	const hasAnswered = computed(() => props.modelValue !== -1)

	function showAdditionalContent(value: number): void {
		const starsUnsatisfied = props.type === RatingEnum.STARS && value <= 3
		const numberUnsatisfied = props.type === RatingEnum.NUMBER && value <= 7
		const isEmotion = props.type === RatingEnum.EMOTION
		const isEmotionLow = props.twoEmotions ? value < 2 : value < 3
		const emotionUnsatisfied = isEmotion && isEmotionLow
		if (starsUnsatisfied || numberUnsatisfied || emotionUnsatisfied) {
			displayAdditionalContent.value = true
		}
	}

	function setValue(value: number): void {
		internalValue.value = value
		showAdditionalContent(value)
		emit('update:modelValue', value)
	}
</script>

<template>
	<div class="vd-rating-picker">
		{{ 'hasAnswered : ' + hasAnswered }}
		<component
			:is="ratingComponent"
			:model-value="internalValue"
			:label="props.label"
			:length="length"
			:readonly="props.readonly || hasAnswered"
			:item-labels="props.itemLabels || undefined"
			@update:model-value="setValue"
		>
			<template #label>
				<slot name="label">
					{{ props.label }}
				</slot>
			</template>
		</component>

		<template v-if="hasAnswered">
			<SyAlert
				v-if="!props.hideAlert"
				:class="{ 'mb-4': displayAdditionalContent }"
				outlined
				:type="alertTypeEnumRef.SUCCESS"
				class="mt-4"
			>
				{{ locales.thanks }}
			</SyAlert>

			<slot v-if="displayAdditionalContent" />
		</template>
	</div>
</template>

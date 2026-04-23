<script setup lang="ts">
	import { type PropType, computed, ref, watch, nextTick } from 'vue'

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
		center: {
			type: Boolean,
			default: false,
		},
		freeTextLabel: {
			type: String,
			default: 'Pouvez-vous nous en dire plus ?',
		},
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', value: number): void
	}>()

	const internalValue = ref(-1)
	const displayAdditionalContent = ref(false)
	const ratingPickerRef = ref<{ focus?: () => void } | null>(null)

	const ratingComponent = computed(() => {
		if (props.type === RatingEnum.EMOTION) {
			return EmotionPicker as unknown as string
		}
		else if (props.type === RatingEnum.NUMBER) {
			return NumberPicker as unknown as string
		}
		else {
			return StarsPicker as unknown as string
		}
	})

	const length = computed(() => {
		if (props.type === RatingEnum.EMOTION) {
			return props.twoEmotions ? 2 : 3
		}
		return undefined
	})

	const hasAnswered = computed(() => internalValue.value !== -1)
	function showAdditionalContent(value: number): void {
		const max = props.type === RatingEnum.EMOTION
			? (props.twoEmotions ? 2 : 3)
			: props.type === RatingEnum.STARS
				? 5
				: 10

		if (value < 1 || value > max) {
			displayAdditionalContent.value = false
			return
		}

		const starsUnsatisfied = props.type === RatingEnum.STARS && value <= 2
		const numberUnsatisfied = props.type === RatingEnum.NUMBER && value <= 7
		const emotionUnsatisfied = props.type === RatingEnum.EMOTION
			&& (
				(props.twoEmotions && value < 2)
				|| (!props.twoEmotions && value < 3)
			)

		displayAdditionalContent.value
			= starsUnsatisfied || numberUnsatisfied || emotionUnsatisfied
	}

	function setValue(value: number): void {
		internalValue.value = value
		showAdditionalContent(value)
		emit('update:modelValue', value)
	}

	watch(() => props.modelValue, (newVal) => {
		internalValue.value = newVal
		showAdditionalContent(newVal)
	}, { immediate: true })

	// focus auto
	watch(
		() => props.type,
		async () => {
			await nextTick()
			ratingPickerRef.value?.focus?.()
		},
		{ immediate: true },
	)
</script>

<template>
	<div
		class="sy-rating-picker"
		:class="{
			'sy-rating-picker--center': props.center,
		}"
	>
		<component
			:is="ratingComponent"
			ref="ratingPickerRef"
			:model-value="internalValue"
			:label="props.label"
			:length="length || undefined"
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
				:type="AlertTypeEnum.SUCCESS"
				role="status"
				aria-live="polite"
				class="mt-4"
			>
				{{ locales.thanks }}
			</SyAlert>

			<div
				v-if="displayAdditionalContent"
				role="region"
				aria-live="polite"
				class="mt-4"
			>
				<slot />
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.sy-rating-picker--center :deep(fieldset) {
	display: flex;
	justify-content: center;
}

.sy-rating-picker--center :deep(legend) {
	width: 100%;
	text-align: center;
}

.sy-rating-picker__free-text {
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
}

.sy-rating-picker__free-text-label {
	font-weight: 600;
}

.sy-rating-picker__free-text-textarea {
	min-height: 120px;
	padding: 0.75rem;
	border: 1px solid #ccc;
	border-radius: 0.375rem;
	resize: vertical;
	font: inherit;
}
</style>

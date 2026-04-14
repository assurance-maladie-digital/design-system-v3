<script setup lang="ts">
	import { type PropType, computed, ref, watch } from 'vue'

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
		enableFreeText: {
			type: Boolean,
			default: true,
		},
		freeTextLabel: {
			type: String,
			default: 'Pouvez-vous nous en dire plus ?',
		},
		freeTextValue: {
			type: String,
			default: '',
		},
	})

	const emit = defineEmits<{
		(e: 'update:modelValue', value: number): void
		(e: 'update:freeTextValue', value: string): void
	}>()

	const alertTypeEnumRef = ref(AlertTypeEnum)
	const internalValue = ref(-1)
	const internalFreeTextValue = ref('')

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

	const hasAnswered = computed(() => props.modelValue !== -1)

	function shouldDisplayAdditionalContent(value: number): boolean {
		if (value === -1) {
			return false
		}

		if (props.type === RatingEnum.EMOTION) {
			// 3 émotions : gauche + milieu => 1 ou 2
			// 2 émotions : uniquement la gauche => 1
			return props.twoEmotions ? value === 1 : value <= 2
		}

		if (props.type === RatingEnum.STARS) {
			// Seulement 1 ou 2 étoiles
			return value <= 2
		}

		if (props.type === RatingEnum.NUMBER) {
			// comportement existant conservé
			return value <= 7
		}

		return false
	}

	const displayAdditionalContent = computed(() => {
		if (!props.enableFreeText) {
			return false
		}

		return shouldDisplayAdditionalContent(internalValue.value)
	})

	function setValue(value: number): void {
		internalValue.value = value

		// si la note ne nécessite plus de commentaire, on vide le texte
		if (!shouldDisplayAdditionalContent(value) && internalFreeTextValue.value) {
			internalFreeTextValue.value = ''
			emit('update:freeTextValue', '')
		}

		emit('update:modelValue', value)
	}

	function setFreeTextValue(event: Event): void {
		const target = event.target as HTMLTextAreaElement
		internalFreeTextValue.value = target.value
		emit('update:freeTextValue', target.value)
	}

	watch(
		() => props.modelValue,
		(newVal) => {
			internalValue.value = newVal
		},
		{ immediate: true },
	)

	watch(
		() => props.freeTextValue,
		(newVal) => {
			internalFreeTextValue.value = newVal
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
				role="status"
				class="mt-4"
			>
				{{ locales.thanks }}
			</SyAlert>

			<div
				v-if="displayAdditionalContent"
				class="sy-rating-picker__free-text mt-4"
			>
				<div>
					<label
						class="sy-rating-picker__free-text-label"
						for="sy-rating-picker-free-text"
					>
						{{ props.freeTextLabel }}
						<textarea
							id="sy-rating-picker-free-text"
							class="sy-rating-picker__free-text-textarea"
							:value="internalFreeTextValue"
							:readonly="props.readonly"
							@input="setFreeTextValue"
						/>
					</label>
				</div>
			</div>

			<slot v-if="displayAdditionalContent" />
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

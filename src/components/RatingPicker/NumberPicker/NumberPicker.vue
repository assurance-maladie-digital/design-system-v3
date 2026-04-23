<script lang="ts" setup>
	import { computed, onMounted, toRef } from 'vue'
	import { locales } from './locales'
	import type { PropType } from 'vue'
	import type { ItemType } from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import { useRatingFocus } from '../useRatingFocus'
	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import { useDisplay } from 'vuetify'
	import { RatingEnum, useRating } from '../Rating'

	interface SelectItem extends ItemType {
		text: string
		value: number
	}

	const props = defineProps({
		label: {
			type: String as PropType<string | undefined>,
			default: RatingEnum.NUMBER,
		},
		length: {
			type: Number,
			default: 10,
		},
		itemLabels: {
			type: Array as PropType<string[]>,
			default: () => [],
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Number,
			default: -1,
		},
	})

	const { smAndDown } = useDisplay()
	const isMobile = computed(() => smAndDown.value)

	const emit = defineEmits(['update:modelValue'])
	const { hasAnswered, emitInputEvent } = useRating(props, emit)

	const selectItems = computed<SelectItem[]>(() => {
		const length = props.length ?? 10

		return [...Array(length)].map((_, index) => ({
			text: `${index + 1}`,
			value: index + 1,
		}))
	})

	onMounted(() => {
		if (!isMobile.value) {
			initFocus()
		}
	})

	const shouldDisplayLabels = computed(() => props.itemLabels.length === 2)

	const {
		ratingElement,
		initFocus,
		selectAndFocus,
		focusNextElement,
		focusPrevElement,
		focus,
	} = useRatingFocus({
		length: toRef(props, 'length'),
		modelValue: toRef(props, 'modelValue'),
		selectValue: emitInputEvent,
		wrap: true,
	})

	defineExpose({
		focus,
	})

	if (!isMobile.value) {
		initFocus()
	}
</script>

<template>
	<fieldset class="sy-number-picker">
		<legend :class="isMobile ? 'd-sr-only' : 'text-h6 mb-6'">
			<slot name="label">
				{{ props.label }}
			</slot>
		</legend>
		<SySelect
			v-if="isMobile"
			:model-value="props.modelValue === -1 ? undefined : props.modelValue"
			:label="props.label"
			:disabled="props.readonly || hasAnswered"
			:items="selectItems"
			@update:model-value="(value) => emit('update:modelValue', value)"
		/>
		<template v-else>
			<div
				v-if="!hasAnswered"
				class="d-inline-block"
			>
				<div
					role="radiogroup"
					class="d-flex ga-2 flex-wrap max-width-none"
				>
					<div
						v-for="index in props.length"
						:key="index"
						ref="ratingElement"
						v-ripple="!(props.readonly || hasAnswered)"
						role="radio"
						:tabindex="-1"
						:aria-checked="props.modelValue === index ? 'true' : 'false'"
						class="sy-number-picker__item text-body-2 pa-0"
						:aria-disabled="(props.readonly || hasAnswered) ? 'true' : undefined"
						@click="selectAndFocus(index - 1)"
						@keydown.enter.prevent="selectAndFocus(index - 1)"
						@keydown.space.prevent="selectAndFocus(index - 1)"
						@keydown.right.prevent="focusNextElement(index - 1)"
						@keydown.left.prevent="focusPrevElement(index - 1)"
						@keydown.up.prevent="focusPrevElement(index - 1)"
						@keydown.down.prevent="focusNextElement(index - 1)"
					>
						{{ index }}
						<span class="d-sr-only">
							{{ locales.ariaLabel(index, props.length) }}
						</span>
					</div>
				</div>
				<div
					v-if="shouldDisplayLabels"
					class="d-flex justify-space-between mt-1"
				>
					<span
						:aria-label="`${locales.ariaLabel(1, props.length)} ${
							props.itemLabels[0]
						}.`"
						class="text-caption"
						v-text="props.itemLabels[0]"
					/>
					<span
						:aria-label="`${locales.ariaLabel(props.length, props.length)} ${
							props.itemLabels[1]
						}.`"
						class="text-caption mr-2"
						v-text="props.itemLabels[1]"
					/>
				</div>
			</div>
			<div
				v-else
				class="mb-0 d-flex align-center"
			>
				<span class="d-sr-only">
					{{ locales.ariaLabel(props.modelValue, props.length) }}
				</span>
				<div
					class="sy-btn-answer text-body-2 mr-1 pa-0"
				>
					{{ props.modelValue }}
				</div>
				<span aria-hidden="true">
					/ {{ props.length }}
				</span>
			</div>
		</template>
	</fieldset>
</template>

<style lang="scss" scoped>
.sy-number-picker {
	border: 0;
}

.sy-btn-answer {
	color: rgb(var(--v-theme-primary));
	border: 1px solid rgb(var(--v-theme-primary));
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	font-weight: 700;
	border-radius: 3px;
}

.sy-number-picker__item {
	color: rgb(var(--v-theme-primary));
	border: 1px solid rgb(var(--v-theme-primary));
	display: flex;
	align-items: center;
	justify-content: center;
	width: 36px;
	height: 36px;
	font-weight: 700;
	border-radius: 3px;
	cursor: pointer;
	user-select: none;
}

.sy-number-picker__item[aria-disabled='true'] {
	pointer-events: none;
	opacity: 0.26;

	&:hover {
		background-color: transparent;
	}
}

.sy-number-picker__item:hover,
.sy-number-picker__item:focus-visible {
	background-color: rgba(var(--v-theme-primary), 0.1);
}

.sy-number-picker__item:focus-visible {
	outline: 1px solid currentcolor;
}
</style>

<script lang="ts" setup>
	import { ref, type PropType, toRef, computed } from 'vue'
	import { RatingEnum, useRating } from '../Rating'
	import { mdiStarOutline, mdiStar } from '@mdi/js'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { locales as defaultLocales } from '../locales'
	import { useRatingFocus } from '../useRatingFocus'

	const props = defineProps({
		label: {
			type: String as PropType<string | null>,
			default: RatingEnum.STARS,
		},
		length: {
			type: Number,
			default: 5,
		},
		readonly: {
			type: Boolean,
			default: false,
		},
		modelValue: {
			type: Number,
			default: -1,
		},
		lockAfterSelection: {
			type: Boolean,
			default: true,
		},
		locales: {
			type: Object as PropType<typeof defaultLocales>,
			default: () => defaultLocales,
		},
	})

	const emit = defineEmits(['update:modelValue'])
	const { internalValue, hasAnswered, emitInputEvent } = useRating(props, emit)

	const starOutlineIcon = mdiStarOutline
	const starIcon = mdiStar
	const hoverIndex = ref<number | null>(-1)

	const ratingElements = ref<HTMLElement[]>([])

	function isActive(index: number): boolean {
		return internalValue.value === index
	}

	function isFilled(index: number): boolean {
		const isHovered = hoverIndex.value !== null && hoverIndex.value >= index && !props.readonly
		const isActive = internalValue.value >= index
		return (isHovered && !hasAnswered.value) || isActive
	}

	const {
		selectAndFocus,
		focusNextElement,
		focusPrevElement,
		focus,
		activeElementIndex,
	} = useRatingFocus({
		length: toRef(props, 'length'),
		modelValue: internalValue,
		selectValue: emitInputEvent,
		ratingElements: ratingElements,
		wrap: true,
	})

	defineExpose({
		focus,
	})

	const readonly = computed(() => {
		return props.readonly || (props.lockAfterSelection && hasAnswered.value)
	})
</script>

<template>
	<fieldset class="sy-stars-picker">
		<legend class="text-h6 mb-6">
			<slot name="label">
				{{ props.label }}
			</slot>
		</legend>

		<p
			v-if="props.lockAfterSelection"
			class="d-sr-only"
		>
			{{ internalValue === -1 ? props.locales.toValidate : props.locales.validated }}
		</p>

		<div
			role="radiogroup"
			class="d-flex max-width-none mx-n1 mx-sm-n2"
		>
			<div
				v-for="index in props.length"
				:key="index"
				ref="ratingElements"
				class="sy-stars-picker__item d-flex align-center justify-center"
				role="radio"
				:tabindex="activeElementIndex + 1 === index ? '0' : '-1'"
				:aria-disabled="readonly ? 'true' : undefined"
				:aria-checked="isActive(index) ? 'true' : 'false'"
				@mouseover="hoverIndex = index"
				@focus="hoverIndex = index"
				@mouseleave="hoverIndex = -1"
				@blur="hoverIndex = -1"
				@click="selectAndFocus(index - 1)"
				@keydown.enter.prevent="selectAndFocus(index - 1)"
				@keydown.space.prevent="selectAndFocus(index - 1)"
				@keydown.right.prevent="focusNextElement(index - 1)"
				@keydown.left.prevent="focusPrevElement(index - 1)"
				@keydown.up.prevent="focusPrevElement(index - 1)"
				@keydown.down.prevent="focusNextElement(index - 1)"
			>
				<span class="d-sr-only">{{ locales.etoiles(index) }}</span>
				<SyIcon
					:icon="isFilled(index) ? starIcon : starOutlineIcon"
					:class="
						isFilled(index)
							? 'text-primary'
							: 'text-blue-lighten'
					"
					size="36px"
					class="py-0 px-2"
					decorative
				/>
			</div>
		</div>
	</fieldset>
</template>

<style lang="scss" scoped>
.sy-stars-picker {
	border: 0;
}

.sy-stars-picker__item:not([disabled]) {
	cursor: pointer;
}

.sy-stars-picker__item .v-icon {
	width: 52px !important;
	height: 36px !important;

	&--disabled.text-primary {
		color: rgb(var(--v-theme-primary)) !important;
	}

	&.text-blue-lighten {
		color: rgb(var(--v-theme-blue-lighten60)) !important;
	}

	&--disabled.text-blue-lighten {
		color: rgb(var(--v-theme-blue-lighten60)) !important;
	}
}
</style>

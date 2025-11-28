<script lang="ts" setup>
	import { ref, type PropType, onMounted } from 'vue'
	import { RatingEnum, useRating } from '../Rating'
	import { mdiStarOutline, mdiStar } from '@mdi/js'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import { locales } from '../locales'

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
	})

	const emit = defineEmits(['update:modelValue'])
	const { hasAnswered, emitInputEvent } = useRating(props, emit)

	const starOutlineIcon = mdiStarOutline
	const starIcon = mdiStar
	const hoverIndex = ref<number | null>(-1)

	function isActive(index: number): boolean {
		return props.modelValue === index
	}

	function isFilled(index: number): boolean {
		const isHovered = hoverIndex.value !== null && hoverIndex.value >= index && !props.readonly
		const isActive = props.modelValue >= index
		return (isHovered && !hasAnswered.value) || isActive
	}

	const ratingElement = ref<HTMLDivElement[]>([])
	function focusNextElement(index: number) {
		const currentIndex = ratingElement.value?.findIndex(el => el === ratingElement.value[index]) ?? -1
		const nextIndex = currentIndex < (props.length - 1) ? currentIndex + 1 : props.length - 1
		const nextElem = ratingElement.value?.[nextIndex]
		nextElem?.focus()
	}

	function focusPrevElement(index: number) {
		const currentIndex = ratingElement.value?.findIndex(el => el === ratingElement.value[index]) ?? -1
		const prevIndex = currentIndex > 0 ? currentIndex - 1 : 0
		const prevElem = ratingElement.value?.[prevIndex]
		prevElem?.focus()
	}

	function setFocus(index: number) {
		ratingElement.value.forEach((el, i) => {
			if (i === index) {
				el?.setAttribute('tabindex', '0')
			}
			else {
				el?.setAttribute('tabindex', '-1')
			}
		})
	}

	onMounted(() => {
		ratingElement.value[0]?.setAttribute('tabindex', '0')
		for (let i = 1; i < ratingElement.value.length; i++) {
			ratingElement.value[i]?.setAttribute('tabindex', '-1')
		}
	})
</script>

<template>
	<fieldset class="sy-stars-picker">
		<legend class="text-h6 mb-6">
			<slot name="label">
				{{ props.label }}
			</slot>
		</legend>

		<div
			role="radiogroup"
			class="d-flex max-width-none mx-n1 mx-sm-n2"
		>
			<div
				v-for="index in props.length"
				:key="index"
				ref="ratingElement"
				class="sy-stars-picker__item d-flex align-center justify-center"
				role="radio"
				:aria-disabled="(props.readonly || hasAnswered) ? 'true' : undefined"
				:aria-checked="isActive(index) ? 'true' : undefined"
				@mouseover="hoverIndex = index"
				@focus="hoverIndex = index"
				@mouseleave="hoverIndex = -1"
				@blur="hoverIndex = -1"
				@click="emitInputEvent(index); setFocus(index - 1)"
				@keyup.enter="emitInputEvent(index); setFocus(index - 1)"
				@keyup.space="emitInputEvent(index); setFocus(index - 1)"
				@keyup.right="focusNextElement(index - 1)"
				@keyup.left="focusPrevElement(index - 1)"
				@keyup.up="focusPrevElement(index - 1)"
				@keyup.down="focusNextElement(index - 1)"
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
@use '@/assets/tokens';

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
		color: tokens.$primary-base !important;
	}

	&.text-blue-lighten {
		color: tokens.$blue-lighten-60 !important;
	}

	&--disabled.text-blue-lighten {
		color: tokens.$blue-lighten-60 !important;
	}
}
</style>

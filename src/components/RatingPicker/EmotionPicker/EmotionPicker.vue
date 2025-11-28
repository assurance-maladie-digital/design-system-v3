<script lang="ts" setup>
	import { type PropType, computed, onMounted, ref } from 'vue'
	import { RatingEnum, useRating } from '../Rating'
	import { locales } from './locales'
	import { propValidator } from '@/utils/propValidator'
	import {
		mdiEmoticonHappyOutline,
		mdiEmoticonSadOutline,
		mdiEmoticonNeutralOutline,
	} from '@mdi/js'

	import { useDisplay } from 'vuetify'
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'

	const { smAndDown } = useDisplay()
	const isMobile = computed(() => smAndDown.value)

	const props = defineProps({
		label: {
			type: String as PropType<string | null>,
			default: RatingEnum.EMOTION,
		},
		length: {
			type: Number,
			default: 3,
			validator: (value: number) => propValidator('length', ['2', '3'], value.toString()),
		},
		itemLabels: {
			type: Array as PropType<string[]>,
			default: () => locales.defaultEmotionLabels,
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

	const sadIcon = mdiEmoticonSadOutline
	const neutralIcon = mdiEmoticonNeutralOutline
	const happyIcon = mdiEmoticonHappyOutline

	const btnSize = computed(() => {
		return isMobile.value ? '70px' : '88px'
	})

	const emit = defineEmits(['update:modelValue'])
	const { internalValue, hasAnswered, emitInputEvent } = useRating(props, emit)

	const isActive = (index: number) => {
		return index === internalValue.value
	}

	const getIcon = (index: number) => {
		if (index === 0) {
			return sadIcon
		}
		if (index === 1 && props.length === 3) {
			return neutralIcon
		}
		return happyIcon
	}

	const getColor = (index: number) => {
		const colors = ['sad', 'neutral', 'happy']
		if (props.length === 2) {
			const filteredColors = colors.filter(item => item !== 'neutral')
			return filteredColors[index]
		}
		return colors[index]
	}

	const getEmotionLabel = (value: number) => {
		if (props.length === 2) {
			const filteredLabels = props.itemLabels.filter((_, index) => index !== 1)
			return filteredLabels[value]
		}
		return props.itemLabels[value]
	}

	const ratingElement = ref<HTMLDivElement[]>([])
	function focusNextElement(index: number) {
		const currentIndex = ratingElement.value?.findIndex(el => el === ratingElement.value[index]) ?? -1
		const nextIndex = currentIndex < (props.length - 1) ? currentIndex + 1 : 0
		const nextElem = ratingElement.value?.[nextIndex]

		ratingElement.value[index]?.setAttribute('tabindex', '-1')
		nextElem?.setAttribute('tabindex', '0')
		nextElem?.focus()
	}

	function focusPrevElement(index: number) {
		const currentIndex = ratingElement.value?.findIndex(el => el === ratingElement.value[index]) ?? -1
		const prevIndex = currentIndex > 0 ? currentIndex - 1 : (props.length - 1)
		const prevElem = ratingElement.value?.[prevIndex]

		ratingElement.value[index]?.setAttribute('tabindex', '-1')
		prevElem?.setAttribute('tabindex', '0')
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
	<fieldset
		class="sy-emotion-picker"
		:aria-label="internalValue === -1 ? locales.toValidate : locales.validated"
	>
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
				v-ripple="!(props.readonly || hasAnswered)"
				role="radio"
				:aria-disabled="(props.readonly || hasAnswered) ? 'true' : undefined"
				:aria-checked="isActive(index) ? 'true' : undefined"
				:class="[getColor(index - 1), { 'sy-emotion-picker__item--active': isActive(index) }]"
				:style="{
					'min-height': btnSize,
					'min-width': btnSize
				}"
				class="sy-emotion-picker__item rounded-lg px-1 px-sm-4 mx-1 mx-sm-2"
				@click="emitInputEvent(index); setFocus(index - 1)"
				@keyup.enter="emitInputEvent(index); setFocus(index - 1)"
				@keyup.space="emitInputEvent(index); setFocus(index - 1)"
				@keyup.right="focusNextElement(index - 1)"
				@keyup.left="focusPrevElement(index - 1)"
				@keyup.up="focusPrevElement(index - 1)"
				@keyup.down="focusNextElement(index - 1)"
			>
				<SyIcon
					:icon="getIcon(index - 1)"
					size="40"
					color="currentColor"
					class="pa-0"
					decorative
				/>

				<span
					v-if="getEmotionLabel(index - 1)"
					class="sy-emotion-picker__item-title mt-1"
				>
					{{ getEmotionLabel(index - 1) }}
				</span>
			</div>
		</div>
	</fieldset>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.sy-emotion-picker {
	display: flex;
	border: 0;
}

.sy-emotion-picker__item:not([disabled]) {
	cursor: pointer;
}

.sy-emotion-picker__item {
	transition: 0.2s;
	border: 1px solid transparent;
	opacity: 1;
	background: transparent;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;

	&.sad {
		color: tokens.$orange-darken-20 !important;
	}

	&.neutral {
		color: tokens.$yellow-darken-60 !important;
	}

	&.happy {
		color: tokens.$turquoise-darken-60 !important;
	}

	&--active.sy-emotion-picker__item--disabled .v-icon {
		color: currentcolor !important;
	}

	&:focus-visible {
		outline: 2px solid currentcolor;
	}

	&--active {
		border-color: currentcolor !important;
	}

	&--active,
	&:focus,
	&:hover {
		&.sad {
			background: tokens.$orange-lighten-90;
		}

		&.neutral {
			background: tokens.$yellow-lighten-90;
		}

		&.happy {
			background: tokens.$turquoise-lighten-90;
		}
	}

	&:hover[disabled='true']:not([aria-checked='true']),
	&:focus[disabled='true']:not([aria-checked='true']) {
		background-color: transparent;
	}
}

.sy-emotion-picker__item-title {
	font-weight: 700;
	font-size: 1rem;
	line-height: 150%;
}

.sy-emotion-picker__item--active .sy-emotion-picker__item-title {
	color: currentcolor;
}

</style>

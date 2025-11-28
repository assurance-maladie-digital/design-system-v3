<script lang="ts" setup>
	import { computed, onMounted, ref } from 'vue'
	import { RatingEnum, useRating } from '../Rating'
	import { locales } from './locales'
	import type { PropType } from 'vue'
	import type { ItemType } from '@/components/Customs/Selects/SySelect/SySelect.vue'

	import SySelect from '@/components/Customs/Selects/SySelect/SySelect.vue'

	import { useDisplay } from 'vuetify'

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
		return [...Array(props.length)].map((_, index) => ({
			text: `${index + 1}`,
			value: index + 1,
		}))
	})

	const shouldDisplayLabels = computed(() => props.itemLabels.length === 2)

	const ratingElement = ref<HTMLDivElement[]>([])
	function focusNextElement(index: number) {
		const currentIndex = ratingElement.value?.findIndex(el => el === ratingElement.value[index]) ?? -1
		const nextIndex = currentIndex < (props.length - 1) ? currentIndex + 1 : 0
		const nextElem = ratingElement.value?.[nextIndex]
		nextElem?.focus()
	}

	function focusPrevElement(index: number) {
		const currentIndex = ratingElement.value?.findIndex(el => el === ratingElement.value[index]) ?? -1
		const prevIndex = currentIndex > 0 ? currentIndex - 1 : (props.length - 1)
		const prevElem = ratingElement.value?.[prevIndex]
		prevElem?.focus()
	}

	function setFocus(index: number) {
		ratingElement.value.forEach((el, i) => {
			if (i === index) {
				el.setAttribute('tabindex', '0')
				el.focus()
			}
			else {
				el.setAttribute('tabindex', '-1')
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
	<fieldset class="sy-number-picker">
		<legend class="d-sr-only">
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
			<legend class="text-h6 mb-6">
				<slot name="label">
					{{ props.label }}
				</slot>
			</legend>
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
						:aria-checked="props.modelValue === index ? 'true' : undefined"
						:aria-label="locales.ariaLabel(index, props.length)"
						class="sy-number-picker__item text-body-2 pa-0"
						:aria-disabled="(props.readonly || hasAnswered) ? 'true' : undefined"
						@click="emitInputEvent(index); setFocus(index - 1)"
						@keyup.enter="emitInputEvent(index); setFocus(index - 1)"
						@keyup.space="emitInputEvent(index); setFocus(index - 1)"
						@keyup.right="focusNextElement(index - 1)"
						@keyup.left="focusPrevElement(index - 1)"
						@keyup.up="focusPrevElement(index - 1)"
						@keyup.down="focusNextElement(index - 1)"
					>
						{{ index }}
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
				:aria-label="locales.ariaLabel(props.modelValue, props.length)"
				class="mb-0 d-flex align-center"
			>
				<div
					class="sy-btn-answer text-body-2 mr-1 pa-0"
				>
					{{ props.modelValue }}
				</div>
				<span>
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

.sy-number-picker__item[disabled] {
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

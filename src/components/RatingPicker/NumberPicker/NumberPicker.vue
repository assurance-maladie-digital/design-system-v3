<script lang="ts" setup>
	import { computed, ref, toRef, useId } from 'vue'
	import { locales as defaultLocales } from '../locales'
	import type { PropType } from 'vue'
	import type { ItemType } from '@/components/Customs/Selects/SySelect/SySelect.vue'
	import { useRatingFocus } from '../useRatingFocus'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'
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
		lockAfterSelection: {
			type: Boolean,
			default: true,
		},
		locales: {
			type: Object as PropType<DeepPartial<typeof defaultLocales>>,
			default: () => ({}),
		},
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const { smAndDown } = useDisplay()
	const isMobile = computed(() => smAndDown.value)
	const ratingElements = ref<HTMLElement[]>([])

	const id = useId()
	const numberPickerdescriptionId = `number-picker-description-${id}`

	const emit = defineEmits(['update:modelValue'])
	const { internalValue, hasAnswered, emitInputEvent } = useRating(props, emit)

	const selectItems = computed<SelectItem[]>(() => {
		const length = props.length ?? 10

		return [...Array(length)].map((_, index) => ({
			text: `${index + 1}`,
			value: index + 1,
		}))
	})

	const shouldDisplayLabels = computed(() => props.itemLabels.length === 2)

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

	const readonly = computed(() => {
		return props.readonly || (props.lockAfterSelection && hasAnswered.value)
	})

	const shouldDisplayLockingState = computed(() => {
		return props.lockAfterSelection && !props.readonly
	})

	defineExpose({
		focus,
	})
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
			:model-value="internalValue === -1 ? undefined : internalValue"
			:label="props.label"
			:disabled="readonly"
			:items="selectItems"
			@update:model-value="(value) => emit('update:modelValue', value)"
		/>
		<template v-else>
			<div
				v-if="!hasAnswered || !props.lockAfterSelection"
				class="d-inline-block"
			>
				<div
					role="radiogroup"
					:aria-describedby="shouldDisplayLockingState ? numberPickerdescriptionId : undefined"
					class="d-flex ga-2 flex-wrap max-width-none mb-6"
				>
					<div
						v-for="index in props.length"
						:key="index"
						ref="ratingElements"
						v-ripple="!readonly"
						role="radio"
						:tabindex="activeElementIndex + 1 === index ? '0' : '-1'"
						:aria-checked="internalValue === index ? 'true' : 'false'"
						class="sy-number-picker__item text-body-2 pa-0"
						:aria-disabled="readonly ? 'true' : undefined"
						:aria-label="locales.ratingAriaLabel(index, props.length)"
						@click="selectAndFocus(index - 1)"
						@keydown.enter.prevent="selectAndFocus(index - 1)"
						@keydown.space.prevent="selectAndFocus(index - 1)"
						@keydown.right.prevent="focusNextElement(index - 1)"
						@keydown.left.prevent="focusPrevElement(index - 1)"
						@keydown.up.prevent="focusPrevElement(index - 1)"
						@keydown.down.prevent="focusNextElement(index - 1)"
					>
						{{ index }}
					</div>
				</div>
				<div
					v-if="shouldDisplayLabels"
					class="d-flex justify-space-between mt-1"
				>
					<span
						:aria-label="`${locales.ratingAriaLabel(1, props.length)} ${
							props.itemLabels[0]
						}.`"
						class="text-caption"
						v-text="props.itemLabels[0]"
					/>
					<span
						:aria-label="`${locales.ratingAriaLabel(props.length, props.length)} ${
							props.itemLabels[1]
						}.`"
						class="text-caption mr-2"
						v-text="props.itemLabels[1]"
					/>
				</div>
			</div>
			<div v-else>
				<span class="d-sr-only">
					{{ locales.ratingAriaLabel(internalValue, props.length) }}
				</span>
				<div
					aria-hidden="true"
					class="mb-0 d-flex align-center mb-6"
				>
					<div
						class="sy-btn-answer text-body-2 mr-1 pa-0"
					>
						{{ internalValue }}
					</div>
					<span>
						/ {{ props.length }}
					</span>
				</div>
			</div>
		</template>
		<p
			v-if="shouldDisplayLockingState"
			:id="numberPickerdescriptionId"
			class="locking-state text-caption"
			:class="{'d-sr-only': internalValue !== -1}"
		>
			{{ internalValue === -1 ? locales.toValidate : locales.validated }}
		</p>
	</fieldset>
</template>

<style lang="scss" scoped>
.sy-number-picker {
	display: flex;
	flex-direction: column;
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

.sy-number-picker__item:hover {
	background-color: rgba(var(--v-theme-primary), 0.1);
}

.sy-number-picker__item[aria-checked='true'] {
	background-color: rgb(var(--v-theme-primary));
	color: rgb(var(--v-theme-on-primary));
}

.sy-number-picker__item:focus-visible {
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 2px;
}

.locking-state {
	font-style: italic;
	color: rgb(var(--v-theme-grey-base));
}

</style>

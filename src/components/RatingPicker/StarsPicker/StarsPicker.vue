<script lang="ts" setup>
	import { ref, defineProps, defineEmits, type PropType } from 'vue'
	import { RatingEnum, useRating } from '../Rating'
	import { mdiStarOutline, mdiStar } from '@mdi/js'

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
	const { hasAnswered } = useRating(props, emit)

	const starOutlineIcon = mdiStarOutline
	const starIcon = mdiStar
	const hoverIndex = ref(-1)

	function isActive(index: number): boolean {
		return props.modelValue - 1 === index
	}

	function isFilled(index: number): boolean {
		const isHovered = hoverIndex.value >= index
		const isActive = props.modelValue - 1 >= index
		return isHovered || isActive
	}
</script>

<template>
	<fieldset class="vd-stars-picker">
		<legend class="text-h6 mb-6">
			<slot name="label">
				{{ props.label }}
			</slot>
		</legend>

		<VRating
			:model-value="modelValue"
			:length="props.length"
			:readonly="props.readonly || hasAnswered"
			class="d-flex flex-wrap max-width-none mx-n3"
			@update:model-value="(value) => emit('update:modelValue', value)"
		>
			<template #item="{ index }">
				<button
					:disabled="props.readonly"
					:aria-pressed="isActive(index)"
					@mouseover="hoverIndex.value = index"
					@focus="hoverIndex.value = index"
					@mouseleave="hoverIndex.value = -1"
					@blur="hoverIndex.value = -1"
				>
					<VIcon
						:class="
							isFilled(index)
								? 'text-blue'
								: 'text-blue-lighten-60'
						"
						size="36px"
						class="py-0 px-2"
					>
						{{ isFilled(index) ? starIcon : starOutlineIcon }}
					</VIcon>
				</button>
			</template>
		</VRating>
	</fieldset>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

.vd-stars-picker {
	border: 0;
}

.v-rating .v-icon {
	width: 52px !important;
	height: 36px !important;

	&--disabled.blue--text {
		color: tokens.$blue-base !important;
	}

	&--disabled.blue-lighten-60--text {
		color: tokens.$blue-lighten-60 !important;
	}
}
</style>

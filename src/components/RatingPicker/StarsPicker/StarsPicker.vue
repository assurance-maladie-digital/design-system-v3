<script lang="ts" setup>
	import { ref, computed, defineProps, defineEmits } from 'vue'
	import { Rating } from '../Rating'
	import { mdiStarOutline, mdiStar } from '@mdi/js'

	const props = defineProps({
		length: {
			type: Number,
			default: 5,
		},
	})

	const emit = defineEmits(['update:modelValue'])

	const starOutlineIcon = mdiStarOutline
	const starIcon = mdiStar
	const hoverIndex = ref(-1)

	const hasAnswered = computed(() => {
		return modelValue.value !== -1
	})

	const modelValue = ref(-1)

	function isActive(index: number): boolean {
		return modelValue.value - 1 === index
	}

	function isFilled(index: number): boolean {
		const isHovered = hoverIndex.value >= index
		const isActive = modelValue.value - 1 >= index
		return isHovered || isActive
	}
</script>

<template>
	<fieldset class="vd-stars-picker">
		<legend class="text-h6 mb-6">
			<slot name="label">
				{{ Rating.label }}
			</slot>
		</legend>

		<VRating
			:model-value="modelValue"
			:length="props.length"
			:readonly="Rating.readonly || hasAnswered"
			class="d-flex flex-wrap max-width-none mx-n3"
			@update:model-value="(value) => emit('update:modelValue', value)"
		>
			<template #item="{ index }">
				<!-- Using click event on VIcon will convert it into a button -->
				<button
					:disabled="Rating.readonly"
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

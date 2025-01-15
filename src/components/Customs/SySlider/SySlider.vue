// @see
https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/examples/slider-multithumb/
// @see
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role

<script setup lang="ts">
	import { computed, ref, toRef, watch, type Ref } from 'vue'
	import useRange from './useRange'
	import useMouseSlide from './useMouseSlide'
	import { vAnimateClick } from './vAnimateClick'
	import useTrack from './useTrack'

	const props = withDefaults(
		defineProps<{
			modelValue: Array<number>
			min?: number
			max?: number
			step?: number
			minLabel?: string
			maxLabel?: string
		}>(),
		{
			modelValue: () => [],
			min: 0,
			max: 100,
			step: 1,
			minLabel: 'Minimum',
			maxLabel: 'Maximum',
		},
	)

	const step = toRef(props, 'step')
	const max = toRef(props, 'max')
	const min = toRef(props, 'min')

	const emits = defineEmits<{
		(e: 'update:modelValue', value: number[]): void
	}>()

	const {
		increase: increaseMin,
		decrease: decreaseMin,
		setRange: setRangeMin,
		style: thumbMinStyle,
		range: rangeMin,
	} = useRange(min, max, step, min.value)

	const {
		increase: increaseMax,
		decrease: decreaseMax,
		setRange: setRangeMax,
		style: thumbMaxStyle,
		range: rangeMax,
	} = useRange(min, max, step, max.value)

	const track = ref<HTMLElement | null>(null)

	const { startDrag: startMinDrag, inProgress: minThumbDrag } = useMouseSlide(
		track as Ref<HTMLElement>,
		rangeMin,
		min,
		max,
		step,
		min,
		rangeMax,
		setRangeMin,
	)

	const { startDrag: startMaxDrag, inProgress: maxThumbDrag } = useMouseSlide(
		track as Ref<HTMLElement>,
		rangeMax,
		min,
		max,
		step,
		rangeMin,
		max,
		setRangeMax,
	)

	const dragInProgress = computed(() => minThumbDrag.value || maxThumbDrag.value)

	const filledTrackStyle = computed(() => {
		const rangeWidth = props.max - props.min
		const left = (rangeMin.value - props.min) * 100 / rangeWidth
		const width = (rangeMax.value - props.min) * 100 / rangeWidth - left

		return {
			left: `${left}%`,
			width: `${width}%`,
		}
	})

	useTrack(
		track as Ref<HTMLElement>,
		min,
		max,
		step,
		rangeMin,
		rangeMax,
		setRangeMin,
		setRangeMax,
		dragInProgress,
	)

	watch(
		() => props.modelValue[0] + props.modelValue[1],
		(value) => {
			console.log('update modelValue', value)

			if (value.length === 2) {
				setRangeMin(value[0])
				setRangeMax(value[1])
			}
		},
		{ immediate: true },
	)

	watch([rangeMin, rangeMax], () => {
		if (
			rangeMin.value !== props.modelValue[0]
			|| rangeMax.value !== props.modelValue[1]
		) {
			emits('update:modelValue', [rangeMin.value, rangeMax.value])
		}
	})
</script>

<template>
	<div class="wrapper">
		<div
			ref="track"
			class="track"
		>
			<button
				v-animate-click
				class="thumb-min"
				:style="thumbMinStyle"
				role="slider"
				:aria-valuenow="rangeMin"
				tabindex="0"
				:aria-valuemax="rangeMax"
				:aria-valuemin="min"
				aria-orientation="horizontal"
				:aria-label="minLabel"
				:title="minLabel"
				@keyup.right="increaseMin"
				@keyup.up="increaseMin"
				@keyup.left="decreaseMin"
				@keyup.down="decreaseMin"
				@mousedown.stop="startMinDrag"
			>
				<span class="inner-thumb" />
			</button>
			<button
				v-animate-click
				role="slider"
				class="thumb-max"
				:style="thumbMaxStyle"
				:aria-valuenow="rangeMax"
				tabindex="0"
				:aria-valuemax="max"
				:aria-valuemin="rangeMin"
				aria-orientation="horizontal"
				:aria-label="maxLabel"
				:title="maxLabel"
				@keyup.right="increaseMax"
				@keyup.up="increaseMax"
				@keyup.left="decreaseMax"
				@keyup.down="decreaseMax"
				@mousedown.stop="startMaxDrag"
			>
				<span class="inner-thumb" />
			</button>
			<div
				class="filled-track"
				:style="filledTrackStyle"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use "@/assets/tokens";

.wrapper {
  --sy-track-height: 4px;
  --sy-thumb-size: 20px;

  position: relative;
  margin-inline: var(--sy-thumb-size);
  width: calc(100% - var(--sy-thumb-size) * 2);
}

.track {
  height: 32px;
  // margin-left: calc(var(--sy-thumb-size) * -1);
  // margin-right: calc(var(--sy-thumb-size) * -1);
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    width: 100%;
    height: var(--sy-track-height);
    background-color: tokens.$blue-lighten-80;
  }
}

.thumb-min,
.thumb-max {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 0;
  z-index: 2;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: left 0.1s;

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--sy-thumb-size);
    height: var(--sy-thumb-size);
    background-color: tokens.$blue-lighten-40;
    border-radius: 50%;
    transform-origin: bottom right;
    transition: transform 0.1s;
    opacity: 0.4;
  }

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--sy-thumb-size);
    height: var(--sy-thumb-size);
    background-color: tokens.$primary-base;
    opacity: 0.4;
    border-radius: 50%;
    transform-origin: bottom right;
    transition: transform 0.1s ease-in, opacity 0.1s ease-in;
  }

  &:focus,
  &:hover {
    &::before {
      transform: scale(2);
    }
  }
}

.inner-thumb {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
  width: var(--sy-thumb-size);
  height: var(--sy-thumb-size);
  background-color: tokens.$primary-base;
  border-radius: 50%;
}

.thumb-min {
  //transform: translate(var(--sy-track-height), -20px);
  transform: translate(-30px, -50%);
}

.thumb-max {
  //transform: translate(calc(var(--sy-track-height) * -2), -20px);
  transform: translate(-10px, -50%);
}

.filled-track {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  width: 100%;
  height: var(--sy-track-height);
  background-color: tokens.$blue-lighten-40;
  transition: all 0.1s;
}

.animate-click::after {
  transform: scale(2);
  opacity: 0.4;
  transition: transform 0.25s ease-out, opacity 0.25s ease-out;
}
</style>

// @see
https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/examples/slider-multithumb/
// @see
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role

<script setup lang="ts">
	import { computed, ref, toRef, watch, type Ref } from 'vue'
	import useDoubleSlider from './useDoubleSlider'
	import useMouseSlide from './useMouseSlide'
	import useThumb from './useThumb'
	import useTrack from './useTrack'
	import { vAnimateClick } from './vAnimateClick'

	const props = withDefaults(
		defineProps<{
			modelValue: Array<number | string>
			min?: number | string
			max?: number | string
			step?: number | string
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

	const range = useDoubleSlider(
		toRef(props, 'min'),
		toRef(props, 'max'),
		toRef(props, 'step'),
		toRef(props, 'modelValue'),
	)

	const emits = defineEmits<{
		(e: 'update:modelValue', value: number[]): void
	}>()

	const {
		thumbStyle: thumbMinStyle,
	} = useThumb(
		range.selectedMin,
		range.rangeMin,
		range.rangeMax,
	)

	const {
		thumbStyle: thumbMaxStyle,
	} = useThumb(
		range.selectedMax,
		range.rangeMin,
		range.rangeMax,
	)

	const filledTrackStyle = computed(() => {
		const rangeMin = range.rangeMin.value
		const rangeMax = range.rangeMax.value
		const selectedMin = range.selectedMin.value
		const selectedMax = range.selectedMax.value

		const rangeWidth = rangeMax - rangeMin
		const left = (selectedMin - rangeMin) * 100 / rangeWidth
		const width = (selectedMax - rangeMin) * 100 / rangeWidth - left

		return {
			left: `${left}%`,
			width: `${width}%`,
		}
	})

	const track = ref<HTMLElement | null>(null)

	const { startDrag: startMinDrag, inProgress: minThumbDrag } = useMouseSlide(
		track as Ref<HTMLElement>,
		range.selectedMin,
		range.rangeMin,
		range.rangeMax,
		range.step,
		range.rangeMin,
		range.selectedMax,
		(value: number) => range.selectedMin.value = value,
	)

	const { startDrag: startMaxDrag, inProgress: maxThumbDrag } = useMouseSlide(
		track as Ref<HTMLElement>,
		range.selectedMax,
		range.rangeMin,
		range.rangeMax,
		range.step,
		range.selectedMin,
		range.rangeMax,
		(value: number) => range.selectedMax.value = value,
	)

	const dragInProgress = computed(() => minThumbDrag.value || maxThumbDrag.value)

	useTrack(
		track as Ref<HTMLElement>,
		range,
		(value: number) => range.selectedMin.value = value,
		(value: number) => range.selectedMax.value = value,
		dragInProgress,
	)

	watch(() => [range.selectedMin.value, range.selectedMax.value], (value) => {
		if (
			value[0] !== Number(props.modelValue[0])
			|| value[1] !== Number(props.modelValue[1])
		) {
			emits('update:modelValue', value)
		}
	})
</script>

<template>
	<div class="wrapper">
		{{ range }}
		<br><br>
		<div
			ref="track"
			class="track"
		>
			<button
				v-animate-click
				class="thumb-min"
				:style="thumbMinStyle"
				role="slider"
				:aria-valuenow="range.rangeMin.value"
				tabindex="0"
				:aria-valuemax="range.rangeMax.value"
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
				:aria-valuenow="range.rangeMax.value"
				tabindex="0"
				:aria-valuemax="max"
				:aria-valuemin="range.rangeMin.value"
				aria-orientation="horizontal"
				:aria-label="maxLabel"
				:title="maxLabel"

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

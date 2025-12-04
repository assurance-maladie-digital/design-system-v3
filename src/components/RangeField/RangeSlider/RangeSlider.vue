// @see
// https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/examples/slider-multithumb/
// https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/slider_role

<script setup lang="ts">
	import { cnamColorsTokens } from '@/designTokens'
	import { computed, ref, toRef, watch, type Ref } from 'vue'
	import Tooltip from './Tooltip/Tooltip.vue'
	import type { PropsStyle } from './types'
	import useMouseSlide from './useMouseSlide'
	import useDoubleSlider from './useRangeSlider'
	import useThumb from './useThumb'
	import useThumbKeyboard from './useThumbKeyboard'
	import useTooltipsNudge from './useTooltipsNudge'
	import useTrack from './useTrack'
	import { vAnimateClick } from './vAnimateClick'

	const props = withDefaults(
		defineProps<
			PropsStyle &
			{
				modelValue?: Array<number | string>
				min?: number | string
				max?: number | string
				step?: number | string
				minLabel?: string
				maxLabel?: string
			}>(),
		{
			'modelValue': () => [],
			'min': 0,
			'max': 100,
			'step': 1,
			'minLabel': 'Minimum',
			'maxLabel': 'Maximum',
			'thumb-color': cnamColorsTokens.blue.base,
			'track-color': cnamColorsTokens.blue.lighten60,
			'track-fill-color': cnamColorsTokens.blue.lighten20,
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
	const thumbMin = ref<HTMLElement | null>(null)
	const thumbMax = ref<HTMLElement | null>(null)

	const { inProgress: minThumbDrag } = useMouseSlide(
		thumbMin as Ref<HTMLElement>,
		track as Ref<HTMLElement>,
		range.selectedMin,
		range.rangeMin,
		range.rangeMax,
		range.step,
		range.rangeMin,
		range.selectedMax,
		(value: number) => range.selectedMin.value = value,
	)

	const { inProgress: maxThumbDrag } = useMouseSlide(
		thumbMax as Ref<HTMLElement>,
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

	useThumbKeyboard(
		thumbMin as Ref<HTMLElement>,
		range.selectedMin,
		range.rangeMin,
		range.selectedMax,
		range.step,
		(value: number) => range.selectedMin.value = value,
	)

	useThumbKeyboard(
		thumbMax as Ref<HTMLElement>,
		range.selectedMax,
		range.selectedMin,
		range.rangeMax,
		range.step,
		(value: number) => range.selectedMax.value = value,
	)

	const hiddenTooltipMin = ref<typeof Tooltip | null>(null)
	const hiddenTooltipMax = ref<typeof Tooltip | null>(null)
	const tooltipMin = ref<typeof Tooltip | null>(null)
	const tooltipMax = ref<typeof Tooltip | null>(null)

	const {
		nudgeMinThumb,
		nudgeMaxThumb,
	} = useTooltipsNudge(
		tooltipMin,
		tooltipMax,
		hiddenTooltipMin,
		hiddenTooltipMax,
		range,
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
		<div
			ref="track"
			class="track"
		>
			<div
				ref="thumbMin"
				v-animate-click
				class="thumb-min"
				:style="thumbMinStyle"
				role="slider"
				:aria-valuenow="range.selectedMin.value"
				tabindex="0"
				:aria-valuemin="range.rangeMin.value"
				:aria-valuemax="range.selectedMax.value"
				aria-orientation="horizontal"
				:aria-label="minLabel"
				:title="minLabel"
			>
				<div
					class="thumb-outline"
					aria-hidden="true"
				/>
				<Tooltip
					ref="tooltipMin"
					:nudge-right="nudgeMinThumb"
				>
					{{ range.selectedMin.value }}
				</Tooltip>
				<span class="inner-thumb" />
			</div>
			<div
				ref="thumbMax"
				v-animate-click
				role="slider"
				class="thumb-max"
				:style="thumbMaxStyle"
				:aria-valuenow="range.selectedMax.value"
				tabindex="0"
				:aria-valuemin="range.selectedMin.value"
				:aria-valuemax="range.rangeMax.value"
				aria-orientation="horizontal"
				:aria-label="maxLabel"
				:title="maxLabel"
			>
				<div
					class="thumb-outline"
					aria-hidden="true"
				/>
				<Tooltip
					ref="tooltipMax"
					:nudge-left="nudgeMaxThumb"
				>
					{{ range.selectedMax.value }}
				</Tooltip>
				<span class="inner-thumb" />
			</div>
			<div
				class="fake-thumb thumb-min"
				aria-hidden="true"
				:style="thumbMinStyle"
			>
				<Tooltip
					ref="hiddenTooltipMin"
				>
					{{ range.selectedMin.value }}
				</Tooltip>
			</div>
			<div
				class="fake-thumb thumb-max"
				aria-hidden="true"
				:style="thumbMaxStyle"
			>
				<Tooltip
					ref="hiddenTooltipMax"
				>
					{{ range.selectedMax.value }}
				</Tooltip>
			</div>
			<div
				class="filled-track"
				:style="filledTrackStyle"
			/>
		</div>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

$virtual-thumb-size: 40px;

.wrapper {
	--sy-track-height: 4px;
	--sy-thumb-size: 20px;
	--sy-thumb-color: v-bind(props.thumbColor);
	--sy-track-color: v-bind(props.trackColor);
	--sy-track-fill-color: v-bind(props.trackFillColor);

	position: relative;
	margin-inline: var(--sy-thumb-size);
	width: calc(100% - var(--sy-thumb-size) * 2);
}

.track {
	height: 32px;
	cursor: pointer;

	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translate(0, -50%);
		width: 100%;
		height: var(--sy-track-height);
		background-color: var(--sy-track-color);
	}
}

.thumb-min,
.thumb-max {
	cursor: pointer;
	position: absolute;
	top: 50%;
	left: 0;
	z-index: 2;
	width: $virtual-thumb-size;
	height: $virtual-thumb-size;
	transition: left 0.1s;
	will-change: left;
	font-weight: bold;

	&::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: var(--sy-thumb-size);
		height: var(--sy-thumb-size);
		background-color: var(--sy-thumb-color);
		border-radius: 50%;
		transform-origin: bottom right;
		transition: transform 0.1s;
		opacity: 0.4;
	}

	&::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: var(--sy-thumb-size);
		height: var(--sy-thumb-size);
		background-color: var(--sy-thumb-color);
		opacity: 0.4;
		border-radius: 50%;
		transform-origin: bottom right;
		transition: transform 0.1s ease-in, opacity 0.1s ease-in;
	}

	&:focus,
	&:hover {
		outline: none;

		&::before {
			transform: scale(2);
		}
	}

	&:focus .thumb-outline {
		$offset: 8px;

		position: absolute;
		top: calc(100% + $offset);
		left: 50%;
		transform: translate(-50%, -100%);
		width: calc(var(--sy-thumb-size) * 2 + $offset);
		height: calc(var(--sy-thumb-size) * 4 + $offset);
		border: 2px solid rgba(var(--v-theme-primary));
		border-radius: 4px;
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
	background-color: var(--sy-thumb-color);
	border-radius: 50%;
	box-shadow: 0 1px 5px 0 #0000001f, 0 2px 2px 0 #00000024, 0 3px 1px -2px #0003;
}

.thumb-min {
	transform:
		translate(
			calc(
				($virtual-thumb-size / 2 + var(--sy-thumb-size) / 2) * -1
			),
			-50%
		);
}

.thumb-max {
	transform:
		translate(
			calc((var(--sy-thumb-size) - $virtual-thumb-size) / 2),
			-50%
		);
}

.filled-track {
	position: absolute;
	top: 50%;
	left: 0;
	transform: translate(0, -50%);
	width: 100%;
	height: var(--sy-track-height);
	background-color: var(--sy-track-fill-color);
	transition: all 0.1s;
}

.animate-click::after {
	transform: scale(2);
	opacity: 0.4;
	transition: transform 0.25s ease-out, opacity 0.25s ease-out;
}

.fake-thumb {
	visibility: hidden;
	transition: none !important;
	cursor: default;
	z-index: -1;
	user-select: none;
}
</style>

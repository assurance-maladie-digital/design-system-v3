<script setup lang="ts">
	import { computed, ref } from 'vue'

	const props = withDefaults(defineProps<{
		nudgeLeft?: number
		nudgeRight?: number
	}>(), {
		nudgeLeft: 0,
		nudgeRight: 0,
	})

	const tooltipStyle = computed(() => {
		const correction = props.nudgeLeft ? props.nudgeLeft : props.nudgeRight * -1
		return {
			transform: `translateX(calc(-50% + ${Math.ceil(correction)}px))`,
		}
	})

	const tooltip = ref<HTMLElement | null>(null)

	defineExpose({
		element: tooltip,
	})
</script>

<template>
	<div class="tooltip-wrapper">
		<div
			ref="tooltip"
			class="tooltip"
			:style="tooltipStyle"
		>
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>

.tooltip-wrapper {
	position: absolute;
	top: 0;
	left: 20px;
	&::before {
		content: "";
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translate(-50%, 0);
		border: 6px solid transparent;
		border-top-color: rgba(0, 0, 0, 0.7);
	}
}

.tooltip{
	position: absolute;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.7);
	color: #fff;
	padding: 4px 8px;
	border-radius: 4px;
	will-change: transform;

}
</style>

<script setup lang="ts">
	import { type PropType } from 'vue'
	import type { RouteLocationRaw } from 'vue-router'

	const props = defineProps({
		href: {
			type: String,
			default: undefined,
		},
		imgAlt: {
			type: String,
			default: '',
		},
		imgSrc: {
			type: String,
			default: undefined,
		},
		isActive: {
			type: Boolean,
			default: undefined,
		},
		to: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})

	const emit = defineEmits(['click-event'])
	const emitClickEvent = () => emit('click-event', props.uniqueId)
</script>

<template>
	<div
		:id="uniqueId"
		v-bind="$attrs"
		:aria-hidden="isActive ? undefined : 'true'"
		aria-roledescription="slide"
		class="carousel-item"
		:class="isActive ? undefined : 'hide'"
		role="group"
	>
		<slot>
			<div class="carousel-image">
				<VBtn
					:id="`${uniqueId}-btn`"
					class="carousel-img-btn"
					:disabled="isActive ? undefined : true"
					:elevation="0"
					:href="href"
					:ripple="false"
					:tabindex="isActive ? 0 : -1"
					:title="imgAlt"
					:to="to"
					@click="emitClickEvent"
				>
					<img
						:alt="imgAlt"
						class="w-100"
						:src="imgSrc"
					>
				</VBtn>
			</div>
		</slot>
	</div>
</template>

<style lang="scss" scoped>
	.v-btn {
		& :deep(.v-btn__overlay),
		& :deep(.v-btn__underlay) {
			display: none !important;
		}
	}
	.carousel-item {
		visibility: visible;
		top: 0;
		left: 0;
		padding: 1px;
	}

	.carousel-img-btn {
		width: 100%;
		height: auto !important;
		padding: 0 !important;
		border: 0;
		background-color: transparent !important;
	}
</style>

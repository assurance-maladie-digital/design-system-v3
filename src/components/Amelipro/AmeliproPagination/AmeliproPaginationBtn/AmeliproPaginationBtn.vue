<script setup lang="ts">
	import AmeliproBtn from '../../AmeliproBtn/AmeliproBtn.vue'
	import { type PropType } from 'vue'
	import type { RouteLocationRaw } from 'vue-router'

	defineProps({
		href: {
			type: String,
			default: undefined,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: undefined,
		},
		to: {
			type: [Array, Object, String] as PropType<RouteLocationRaw>,
			default: undefined,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const emit = defineEmits(['click'])
	const emitClickEvent = () => emit('click')
</script>

<template>
	<AmeliproBtn
		:aria-current="isActive ? 'page' : undefined"
		classes="amelipro-pagination__btn"
		:color="isActive ? 'ap-blue-darken-1' : 'ap-white'"
		hover-color="ap-blue-darken-1"
		:href="href"
		:text-color="isActive ? 'ap-white' : 'ap-blue-darken-1'"
		text-hover-color="ap-white"
		:title="isActive ? 'page active' : title"
		:to="to"
		:unique-id="uniqueId"
		@click="emitClickEvent()"
	>
		<template
			v-if="$slots.default"
			#default
		>
			<slot />
		</template>

		<template
			v-if="$slots.icon"
			#icon
		>
			<slot name="icon" />
		</template>
	</AmeliproBtn>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/tokens';

.v-btn {
	padding: 0 !important;
	border-radius: 0 !important;
	min-height: 2.5rem !important;
	min-width: 2.5rem !important;
	font-size: tokens.$font-size-sm !important;
	font-weight: tokens.$ap-font-weight-semi-bold !important;
	text-align: center !important;

	& :deep(.v-btn__content) {
		padding-left: 0 !important;
		padding-right: 0 !important;
	}

	& :deep(.v-badge) span {
		margin-left: 0 !important;
	}
}
</style>

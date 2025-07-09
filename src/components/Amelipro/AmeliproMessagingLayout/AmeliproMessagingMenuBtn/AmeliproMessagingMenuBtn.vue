<script setup lang="ts">
	import { type PropType, ref } from 'vue'
	import AmeliproBtn from '../../AmeliproBtn/AmeliproBtn.vue'
	import AmeliproIcon from '../../AmeliproIcon/AmeliproIcon.vue'
	import type { RouteLocationRaw } from 'vue-router'

	defineProps({
		active: {
			type: Boolean,
			default: false,
		},
		href: {
			type: String,
			default: undefined,
		},
		icon: {
			type: String,
			default: undefined,
		},
		label: {
			type: String,
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
		unreadNumber: {
			type: Number,
			default: undefined,
		},
	})

	const hover = ref(false)
	const focus = ref(false)
</script>

<template>
	<AmeliproBtn
		:active="active"
		class="w-100 mb-1 text-none text-h6 font-weight-bold messaging-menu__btn"
		:color="active ? 'ap-blue-darken-2' : 'ap-blue-darken-1'"
		hover-color="ap-blue-darken-2"
		:href="href"
		style="min-height: 50px;"
		text-color="ap-white"
		:to="to"
		:unique-id="uniqueId"
		@focus="focus = true"
		@blur="focus = false"
		@mouseenter="hover = true"
		@mouseleave="hover = false"
	>
		<span class="d-flex align-center w-100">
			<AmeliproIcon
				class="mr-2"
				:icon="icon"
				icon-color="ap-white"
				size="24px"
				:unique-id="`${uniqueId}-icon`"
			/>

			{{ label }}
		</span>

		<span v-if="unreadNumber !== undefined">
			{{ unreadNumber }}

			<span class="d-sr-only">
				Non lu(s)
			</span>
		</span>
	</AmeliproBtn>
</template>

<style lang="scss" scoped>
a:hover {
	text-decoration: none !important;
}

.messaging-menu__btn {
	min-height: 50px;
	border-radius: 0 !important;

	& :deep(.v-btn__content) {
		justify-content: space-between;

		& .amelipro-custom-btn {
			width: 100%;
			justify-content: space-between;
		}
	}
}
</style>

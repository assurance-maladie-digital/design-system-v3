<script setup lang="ts">
	import type { IndexedObject } from '../types'
	import { computed } from 'vue'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		badgeColor: {
			type: String,
			default: 'ap-blue-darken-1',
		},
		badgeContent: {
			type: String,
			default: undefined,
		},
		badgeTextColor: {
			type: String,
			default: 'ap-white',
		},
		isSpan: {
			type: Boolean,
			default: false,
		},
		roundedRight: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const style = computed <IndexedObject>(() => ({ backgroundColor: convertToHex(props.badgeColor) }))
	const styleText = computed <IndexedObject>(() => ({ color: convertToHex(props.badgeTextColor) }))
</script>

<template>
	<Component
		:is="isSpan ? 'span' : 'p'"
		:id="uniqueId"
		class="amelipro-badge"
		:class="roundedRight ? 'round-custom' : 'round-classic'"
		:style="style"
	>
		<span
			class="amelipro-badge__content"
			:style="styleText"
		>
			{{ badgeContent }}
		</span>
	</Component>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.amelipro-badge {
	display: inline-block;
	margin-left: 0.5rem;
	padding: 0.5rem 1rem !important;

	&.round-custom {
		border-radius: 0.5rem 1rem 1rem 0.5rem;
	}

	&.round-classic {
		border-radius: 1rem;
	}
}

.amelipro-badge__content {
	display: inline-block;
	font-size: apTokens.$font-size-sm !important;
	font-weight: apTokens.$ap-font-weight-bold !important;
}
</style>

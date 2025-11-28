<script setup lang="ts">
	import type { IndexedObject } from '../../types'
	import { computed } from 'vue'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		controls: {
			type: String,
			required: true,
		},
		selected: {
			type: Boolean,
			default: false,
		},
		tabindex: {
			type: Number,
			required: true,
		},
		uniqueId: {
			type: String,
			required: true,
		},
	})
	const emit = defineEmits(['click'])
	const emitClickEvent = () => emit('click')
	const textColor = computed<string>(() => (props.selected ? 'ap-white' : 'ap-grey-darken-1'))
	const btnColor = computed<string>(() => (props.selected ? 'ap-blue-darken-2' : 'ap-grey-lighten-3'))
	const style = computed<IndexedObject>(() => ({ color: convertToHex(textColor.value) }))
</script>

<template>
	<VBtn
		:id="uniqueId"
		:aria-controls="controls"
		:aria-selected="selected"
		class="structure-btn"
		:color="btnColor"
		elevation="0"
		:ripple="false"
		role="tab"
		:style="style"
		:tabindex="tabindex"
		@click="emitClickEvent"
	>
		<slot />
	</VBtn>
</template>

<style lang="scss" scoped>
@use '@/assets/amelipro/apTokens';

.v-btn {
	letter-spacing: unset;

	& :deep(.v-btn__content) {
		white-space: normal !important;
	}

	& :deep(.v-btn__overlay),
	& :deep(.v-btn__underlay) {
		display: none !important;
	}

	&.v-btn--active::before,
	&:focus::before,
	&:hover::before {
		content: unset !important;
		opacity: 0 !important;
	}

	&:focus {
		outline: 1px dotted apTokens.$ap-grey-darken1;
	}

	@media #{apTokens.$media-only-xs} {
		margin-bottom: 8px;
		width: 100% !important;
	}
}
</style>

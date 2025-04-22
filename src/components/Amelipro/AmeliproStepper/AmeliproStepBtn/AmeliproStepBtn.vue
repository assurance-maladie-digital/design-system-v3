<script setup lang="ts">
	import { computed, ref } from 'vue'
	import type { IndexedObject } from '../../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		disabled: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const emit = defineEmits(['click'])
	const emitClickEvent = () => emit('click')
	const focused = ref(false)

	const styles = computed<IndexedObject>(() => {
		const btnStyles: IndexedObject = {
			backgroundColor: convertToHex('ap-blue-lighten-3'),
			border: `1px solid ${convertToHex('ap-grey-lighten-2')}`,
			color: convertToHex('ap-blue-darken-1'),
			position: 'relative',
			zIndex: '1',
		}

		if (props.disabled && !props.isActive) {
			btnStyles.backgroundColor = convertToHex('ap-grey-lighten-2')
			btnStyles.color = convertToHex('ap-grey-darken-1')
			btnStyles.cursor = 'default'
		}

		if (props.isActive && !props.disabled) {
			btnStyles.backgroundColor = convertToHex('ap-blue-darken-1')
			btnStyles.border = `1px solid ${convertToHex('ap-blue-darken-1')}`
			btnStyles.color = convertToHex('ap-white')
		}

		return btnStyles
	})
</script>

<template>
	<button
		:id="uniqueId"
		:aria-current="isActive ? 'step' : undefined"
		class="text-subtitle-1 pa-4 text-uppercase amelipro-step-btn"
		:disabled="disabled"
		role="tab"
		:style="styles"
		type="button"
		@blur="focused = false"
		@click="emitClickEvent"
		@focus="focused = true"
	>
		<span
			:id="uniqueId ? `${uniqueId}-content` : undefined"
			class="d-flex align-center amelipro-step-btn__content"
		>
			<slot />
		</span>
	</button>
</template>

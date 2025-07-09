<script setup lang="ts">
	import { type PropType, computed } from 'vue'
	import { AmeliproStatusTypes } from './AmeliproStatusTypes'
	import type { IndexedObject } from '../types'
	import { convertToHex } from '@/utils/functions/convertToHex'

	const props = defineProps({
		isSpan: {
			type: Boolean,
			default: false,
		},
		label: {
			type: String,
			default: undefined,
		},
		paddingX: {
			type: String,
			default: '12px',
		},
		paddingY: {
			type: String,
			default: '4px',
		},
		type: {
			default: 'draft',
			type: String as PropType<keyof typeof AmeliproStatusTypes>,
			validator(value: string): boolean {
				return ['action', 'archive', 'canceled', 'closed', 'draft', 'failure', 'progress', 'success'].includes(value.toLowerCase())
			},
		},
		uniqueId: {
			type: String,
			default: undefined,
		},
	})

	const statusClasses = computed(() => AmeliproStatusTypes[props.type].bgColor)

	const borderColorValue = computed(() => (AmeliproStatusTypes[props.type].borderColor || 'transparent'))

	const statusStyles = computed<IndexedObject>(() => ({
		border: `2px solid ${convertToHex(borderColorValue.value)}`,
		borderRadius: '16px',
		paddingBottom: `${props.paddingY}`,
		paddingLeft: `${props.paddingX}`,
		paddingRight: `${props.paddingX}`,
		paddingTop: `${props.paddingY}`,
	}))

	const textValue = computed(() => (props.label || AmeliproStatusTypes[props.type].defaultLabel))
</script>

<template>
	<Component
		:is="isSpan ? 'span' : 'p'"
		:id="uniqueId"
		class="d-inline-flex mb-0 font-weight-bold amelipro-status"
		:class="statusClasses"
		:style="statusStyles"
	>
		{{ textValue }}
	</Component>
</template>

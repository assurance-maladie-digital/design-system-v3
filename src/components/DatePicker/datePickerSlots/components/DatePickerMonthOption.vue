<script setup lang="ts">
	import { computed } from 'vue'
	import { VBtn } from 'vuetify/components'

	interface DatePickerMonthOptionProps {
		slotProps: {
			month: {
				text: string
				label?: string
				value: number
				isDisabled?: boolean
			}
			i: number
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: Record<string, any>
		}
	}

	const props = defineProps<DatePickerMonthOptionProps>()
	const isActive = computed(() => props.slotProps.props.active)
</script>

<template>
	<div
		role="gridcell"
		data-sy-date-picker-option="month"
		:aria-selected="isActive"
		:aria-label="slotProps.month.label"
		:aria-pressed="isActive"
	>
		<VBtn
			v-bind="slotProps.props"
			tabindex="-1"
		/>
	</div>
</template>

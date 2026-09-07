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
			props: Record<string, unknown>
		}
	}

	const props = defineProps<DatePickerMonthOptionProps>()
	const isActive = computed(() => Boolean(props.slotProps.props.active))
</script>

<template>
	<div
		role="gridcell"
		data-sy-date-picker-option="month"
		:aria-selected="isActive"
		:aria-label="slotProps.month.label"
	>
		<VBtn
			v-bind="slotProps.props"
			tabindex="-1"
		/>
	</div>
</template>

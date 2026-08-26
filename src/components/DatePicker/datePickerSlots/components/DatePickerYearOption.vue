<script setup lang="ts">
	import { computed } from 'vue'
	import { VBtn } from 'vuetify/components'

	interface DatePickerYearOptionProps {
		slotProps: {
			year: {
				text: string
				value: number
				isDisabled?: boolean
			}
			i: number
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			props: Record<string, any>
		}
	}

	const props = defineProps<DatePickerYearOptionProps>()
	const isActive = computed(() => props.slotProps.props.active)
</script>

<template>
	<div
		role="gridcell"
		data-sy-date-picker-option="year"
		:aria-selected="isActive"
		:aria-label="slotProps.year.text"
		:aria-pressed="isActive"
	>
		<VBtn
			v-bind="slotProps.props"
			tabindex="-1"
		/>
	</div>
</template>

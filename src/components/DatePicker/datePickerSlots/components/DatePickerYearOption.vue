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
			props: Record<string, unknown>
		}
	}

	const props = defineProps<DatePickerYearOptionProps>()
	const isActive = computed(() => Boolean(props.slotProps.props.active))
</script>

<template>
	<div
		role="gridcell"
		data-sy-date-picker-option="year"
		:aria-selected="isActive"
		:aria-label="slotProps.year.text"
	>
		<VBtn
			v-bind="slotProps.props"
			tabindex="-1"
		/>
	</div>
</template>

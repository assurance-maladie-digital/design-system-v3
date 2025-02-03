<script lang="ts" setup>
	import { ref, watch, nextTick } from 'vue'
	import DatePicker from '@/components/DatePicker/DatePicker.vue'
	import type { RuleOptions } from '@/composables'

	type DateInput = string | null
	type PeriodValue = { from: DateInput, to: DateInput }

	const props = withDefaults(defineProps<{
		modelValue?: PeriodValue
		placeholderFrom?: string
		placeholderTo?: string
		format?: string
		dateFormatReturn?: string
		showWeekNumber?: boolean
		required?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		isDisabled?: boolean
		noIcon?: boolean
		noCalendar?: boolean
		isOutlined?: boolean
		customRules?: { type: string, options: RuleOptions }[]
		customWarningRules?: { type: string, options: RuleOptions }[]
	}>(), {
		modelValue: () => ({ from: null, to: null }),
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		format: 'DD/MM/YYYY',
		dateFormatReturn: '',
		showWeekNumber: false,
		required: false,
		displayIcon: true,
		displayAppendIcon: false,
		isDisabled: false,
		noIcon: false,
		noCalendar: false,
		isOutlined: true,
		customRules: () => [],
		customWarningRules: () => [],
	})

	const emit = defineEmits(['update:modelValue'])

	const fromDate = ref<string | null>(props.modelValue.from)
	const toDate = ref<string | null>(props.modelValue.to)

	watch(() => props.modelValue, (newValue) => {
		fromDate.value = newValue.from
		toDate.value = newValue.to
	}, { deep: true, immediate: true })

	watch([fromDate, toDate], async ([newFrom, newTo]) => {
		if (newFrom && newTo && new Date(newFrom) > new Date(newTo)) {
			// Swap values with nextTick to ensure Vue updates the DOM first
			const tempFrom = fromDate.value
			fromDate.value = toDate.value
			toDate.value = tempFrom

			await nextTick()

			emit('update:modelValue', { from: fromDate.value, to: toDate.value })
		}
		else {
			emit('update:modelValue', { from: newFrom, to: newTo })
		}
	}, { deep: true, immediate: true })
</script>

<template>
	<div class="period-field">
		<DatePicker
			v-model="fromDate"
			:format="props.format"
			:date-format-return="props.dateFormatReturn"
			:show-week-number="props.showWeekNumber"
			:placeholder="placeholderFrom"
			:required="props.required"
			:display-icon="props.displayIcon"
			:display-append-icon="props.displayAppendIcon"
			:is-disabled="props.isDisabled"
			:no-icon="props.noIcon"
			:no-calendar="props.noCalendar"
			:is-outlined="props.isOutlined"
		/>
		<DatePicker
			v-model="toDate"
			:format="props.format"
			:date-format-return="props.dateFormatReturn"
			:show-week-number="props.showWeekNumber"
			:placeholder="placeholderTo"
			:required="props.required"
			:display-icon="props.displayIcon"
			:display-append-icon="props.displayAppendIcon"
			:is-disabled="props.isDisabled"
			:no-icon="props.noIcon"
			:no-calendar="props.noCalendar"
			:is-outlined="props.isOutlined"
		/>
	</div>
</template>

<style scoped>
.period-field {
	display: flex;
	gap: 10px;
}
</style>

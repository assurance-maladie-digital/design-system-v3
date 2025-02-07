<script lang="ts" setup>
	import { ref, watch } from 'vue'
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
		customWarningRules: () => [
		],
	})

	const emit = defineEmits(['update:modelValue'])

	const fromDate = ref<string | null>(props.modelValue.from)
	const toDate = ref<string | null>(props.modelValue.to)
	const errorMessageFrom = ref<string[]>([])
	const errorMessageTo = ref<string[]>([])

	watch(fromDate, (newFrom) => {
		if (newFrom && toDate.value && newFrom > toDate.value) {
			errorMessageFrom.value.push('La date de début ne peut pas être supérieure à la date de fin')
		}
		else {
			errorMessageFrom.value = []
		}
		emit('update:modelValue', { from: newFrom, to: toDate.value })
	})

	watch(toDate, (newTo) => {
		if (newTo && fromDate.value && fromDate.value > newTo) {
			errorMessageTo.value.push('La date de fin ne peut pas être inférieure à la date de début')
		}
		else {
			errorMessageTo.value = []
		}
		emit('update:modelValue', { from: fromDate.value, to: newTo })
	})

	// Watch pour synchroniser les props en cas de changement externe
	watch(() => props.modelValue, (newValue) => {
		fromDate.value = newValue.from
		toDate.value = newValue.to
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
			:custom-rules="props.customRules"
			:custom-warning-rules="props.customWarningRules"
			:custom-error-messages="errorMessageFrom"
			:class="errorMessageFrom ? 'error' : ''"
			class="mr-2"
		/>
		<p
			v-if="errorMessageFrom.length"
			class="text-error"
		>
			{{ errorMessageFrom }}
		</p>
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
			:custom-rules="props.customRules"
			:custom-warning-rules="props.customWarningRules"
			:custom-error-messages="errorMessageTo"
			:class="errorMessageTo ? 'error' : ''"
		/>
		<p
			v-if="errorMessageTo.length"
			class="text-error"
		>
			{{ errorMessageTo }}
		</p>
	</div>
</template>

<style scoped>
.period-field {
	display: flex;
	gap: 10px;
}
</style>

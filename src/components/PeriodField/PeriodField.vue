<script lang="ts" setup>
	import { ref, watch, computed } from 'vue'
	import DatePicker from '@/components/DatePicker/DatePicker.vue'
	import type { RuleOptions } from '@/composables'

	type DateInput = string | null
	type PeriodValue = { from: DateInput, to: DateInput }

	type Rule = (value: string) => { error?: string, success?: string }

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
	const errorMessage = ref<string[]>([])

	const fromDateRules = [
		{
			type: 'custom',
			options: {
				validate: (value: never) => {
					if (value && toDate.value && value < toDate.value) {
						return { error: 'La date de début ne peut pas être supérieure à la date de fin.' }
					}
					return {}
				},
				message: 'La date de début ne peut pas être supérieur à la date de fin.',
				fieldIdentifier: 'fromDate',
			},
		},
		...(props.required
			? [{
				type: 'required',
				options: { message: 'La date de début est requise.', fieldIdentifier: 'fromDate' },
			}]
			: []),
	]

	const fieldIdentifierFromDate = fromDateRules[0]?.options?.fieldIdentifier

	const hasFromDateErrors = computed(() => errorMessage.value.some(error => error.includes(fieldIdentifierFromDate)))

	function validateFieldSet(value: string, fromDateRules: Rule[]) {
		fromDateRules.forEach((rule) => {
			const { error } = rule.options.validate(value)
			if (error) errorMessage.value.push(error)
		})
	}
	function validateFields(onBlur = false) {
		errorMessage.value = []

		const shouldValidateFromDate = onBlur || fromDate.value < toDate.value

		if (shouldValidateFromDate) {
			validateFieldSet(fromDate.value, fromDateRules)
		}
	}

	watch(fromDate, (newFrom) => {
		validateFields()
		emit('update:modelValue', { from: newFrom, to: toDate.value })
	})

	/* watch(toDate, (newTo) => {
		if (fromDate.value > newTo) {
			errorMessage.value = 'La date de fin ne peut pas être inférieure à la date de début'
		}
		else if (fromDate.value === newTo) {
			errorMessage.value = 'La date de fin ne peut pas être égale à la date de début'
		}
		else {
			errorMessage.value = null
		}
		emit('update:modelValue', { from: fromDate.value, to: newTo })
	}) */

	// Watch pour synchroniser les props en cas de changement externe
	watch(() => props.modelValue, (newValue) => {
		fromDate.value = newValue.from
		toDate.value = newValue.to
	}, { deep: true, immediate: true })
</script>

<template>
	<div class="period-field">
		{{ fromDate }}
		<DatePicker
			ref="fromDate"
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
			:error-message="hasFromDateErrors"
			class="mr-2"
		/>
		<DatePicker
			ref="toDate"
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
			:error-message="hasFromDateErrors"
		/>
	</div>
</template>

<style scoped>
.period-field {
	display: flex;
	gap: 10px;
}
</style>

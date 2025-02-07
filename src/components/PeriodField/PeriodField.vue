<script lang="ts" setup>
	import { ref, watch, computed } from 'vue'
	import DatePicker from '@/components/DatePicker/DatePicker.vue'
	import { type RuleOptions, useFieldValidation } from '@/composables'

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
		showSuccessMessages?: boolean
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
		showSuccessMessages: false,
		customRules: () => [],
		customWarningRules: () => [],
	})

	const emit = defineEmits(['update:modelValue'])

	const fromDate = ref<string | null>(props.modelValue?.from ?? null)
	const toDate = ref<string | null>(props.modelValue?.to ?? null)
	const errors = ref<string[]>([])
	const successes = ref<string[]>([])
	const tempFromDate = ref<Date | undefined>()
	const tempToDate = ref<Date | undefined>()

	const { generateRules } = useFieldValidation()

	// Règles de validation pour la date de début
	const fromDateRules = [
		{
			type: 'custom',
			options: {
				validate: (value: string | null) => {
					if (value === null) return true
					if (tempToDate.value === undefined) return true
					return value <= tempToDate.value
				},
				message: 'La date de début ne peut pas être supérieure à la date de fin.',
				successMessage: 'La date de début est valide.',
				fieldIdentifier: 'fromDate',
			},
		},
		...(props.required
			? [{
				type: 'required',
				options: {
					message: 'La date de début est requise.',
					successMessage: 'La date de début est renseignée.',
					fieldIdentifier: 'fromDate',
				},
			}]
			: []),
		...props.customRules,
	]

	// Règles de validation pour la date de fin
	const toDateRules = [
		{
			type: 'custom',
			options: {
				validate: (value: string | null) => {
					if (value === null) return true
					if (tempFromDate.value === undefined || value === null) return true
					return value >= tempFromDate.value
				},
				message: 'La date de fin ne peut pas être inférieure à la date de début.',
				successMessage: 'La date de fin est valide.',
				fieldIdentifier: 'toDate',
			},
		},
		...(props.required
			? [{
				type: 'required',
				options: {
					message: 'La date de fin est requise.',
					successMessage: 'La date de fin est renseignée.',
					fieldIdentifier: 'toDate',
				},
			}]
			: []),
		...props.customRules,
	]

	const hasFromDateErrors = computed(() =>
		errors.value.some(error => error.includes('fromDate')),
	)

	const hasToDateErrors = computed(() =>
		errors.value.some(error => error.includes('toDate')),
	)

	const hasFromDateSuccesses = computed(() =>
		successes.value.some(success => success.includes('fromDate')),
	)

	const hasToDateSuccesses = computed(() =>
		successes.value.some(success => success.includes('toDate')),
	)

	function stringToDate(dateString: string | null): Date | undefined {
		if (!dateString || typeof dateString !== 'string') return undefined
		const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10))
		return new Date(year, month - 1, day)
	}

	watch([() => fromDate.value, () => toDate.value], ([newFromDate, newToDate], [oldFromDate, oldToDate]) => {
		if (newFromDate !== oldFromDate) {
			tempFromDate.value = stringToDate(oldFromDate)
		}
		if (newToDate !== oldToDate) {
			tempToDate.value = stringToDate(oldToDate)
		}
		emit('update:modelValue', { from: newFromDate, to: newToDate })
	})

	watch(() => props.modelValue, (newValue) => {
		fromDate.value = newValue.from
		toDate.value = newValue.to
	}, { deep: true, immediate: true })

	function validateFieldSet(value: string | null, fieldRules: {
		type: string
		options: RuleOptions
	}[], fieldIdentifier: string) {
		const rules = generateRules(fieldRules)
		const results = rules.map(rule => rule(value || ''))

		const fieldErrors = results
			.filter(result => result.error)
			.map(result => result.error!)

		const fieldSuccesses = results
			.filter(result => result.success)
			.map(result => result.success!)

		errors.value = errors.value.filter(error => !error.includes(fieldIdentifier))
		errors.value.push(...fieldErrors)

		if (props.showSuccessMessages) {
			successes.value = successes.value.filter(success => !success.includes(fieldIdentifier))
			successes.value.push(...fieldSuccesses)
		}
	}

	function validateFields() {
		errors.value = []
		successes.value = []

		// Ne valider la date de début que si elle est renseignée et requise, ou si les deux dates sont renseignées
		if ((fromDate.value && props.required) || (fromDate.value && toDate.value)) {
			validateFieldSet(fromDate.value, fromDateRules, 'fromDate')
		}

		// Ne valider la date de fin que si elle est renseignée et requise, ou si les deux dates sont renseignées
		if ((toDate.value && props.required) || (fromDate.value && toDate.value)) {
			validateFieldSet(toDate.value, toDateRules, 'toDate')
		}
	}

	const validateOnSubmit = () => {
		validateFields()
		return errors.value.length === 0
	}

	defineExpose({
		validateOnSubmit,
		errors,
		successes,
	})
</script>

<template>
	<div class="period-field">
		<DatePicker
			ref="fromDate"
			v-model="fromDate"
			:custom-rules="fromDateRules"
			:custom-warning-rules="props.customWarningRules"
			:date-format-return="props.dateFormatReturn"
			:display-append-icon="props.displayAppendIcon"
			:display-icon="props.displayIcon"
			:error-message="hasFromDateErrors"
			:format="props.format"
			:is-disabled="props.isDisabled"
			:is-outlined="props.isOutlined"
			:no-calendar="props.noCalendar"
			:no-icon="props.noIcon"
			:placeholder="placeholderFrom"
			:required="props.required"
			:show-week-number="props.showWeekNumber"
			:success-message="hasFromDateSuccesses"
			class="mr-2"
		/>
		<DatePicker
			ref="toDate"
			v-model="toDate"
			:custom-rules="toDateRules"
			:custom-warning-rules="props.customWarningRules"
			:date-format-return="props.dateFormatReturn"
			:display-append-icon="props.displayAppendIcon"
			:display-icon="props.displayIcon"
			:error-message="hasToDateErrors"
			:format="props.format"
			:is-disabled="props.isDisabled"
			:is-outlined="props.isOutlined"
			:no-calendar="props.noCalendar"
			:no-icon="props.noIcon"
			:placeholder="placeholderTo"
			:required="props.required"
			:show-week-number="props.showWeekNumber"
			:success-message="hasToDateSuccesses"
		/>
	</div>
</template>

<style scoped>
.period-field {
  display: flex;
  gap: 10px;
}
</style>

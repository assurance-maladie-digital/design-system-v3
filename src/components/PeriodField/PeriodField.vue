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

	const internalFromDate = ref<string | null>(null)
	const internalToDate = ref<string | null>(null)

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

	// eslint-disable-next-line @typescript-eslint/no-explicit-any -- This is a generic type
	function formatDateValue(value: any): string | null {
		if (!value) return null
		if (typeof value === 'string') return value
		if (value.selectedDates) {
			const date = new Date(value.selectedDates)
			const day = date.getDate().toString().padStart(2, '0')
			const month = (date.getMonth() + 1).toString().padStart(2, '0')
			const year = date.getFullYear()
			return `${day}/${month}/${year}`
		}
		return null
	}

	// Computed properties pour les dates formatées
	const formattedFromDate = computed(() => formatDateValue(internalFromDate.value))
	const formattedToDate = computed(() => formatDateValue(internalToDate.value))

	// Computed properties pour les dates temporaires
	const tempFromDate = computed(() => formattedFromDate.value ? stringToDate(formattedFromDate.value) : undefined)
	const tempToDate = computed(() => formattedToDate.value ? stringToDate(formattedToDate.value) : undefined)

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

	const errors = ref<string[]>([])
	const successes = ref<string[]>([])

	// Computed property pour vérifier si le formulaire est valide
	const isValid = computed(() => {
		// Si aucune date n'est renseignée et que ce n'est pas required, c'est valide
		if (!props.required && !formattedFromDate.value && !formattedToDate.value) {
			return true
		}

		// Si c'est required, les deux dates doivent être renseignées
		if (props.required && (!formattedFromDate.value || !formattedToDate.value)) {
			return false
		}

		// Si une seule date est renseignée et que ce n'est pas required
		if (!props.required && (formattedFromDate.value || formattedToDate.value)) {
			// Les deux dates doivent être renseignées ensemble
			if ((formattedFromDate.value && !formattedToDate.value) || (!formattedFromDate.value && formattedToDate.value)) {
				return false
			}
		}

		// Si les deux dates sont renseignées, vérifier qu'elles sont cohérentes
		if (formattedFromDate.value && formattedToDate.value) {
			const fromDate = stringToDate(formattedFromDate.value)
			const toDate = stringToDate(formattedToDate.value)
			if (!fromDate || !toDate || fromDate > toDate) {
				return false
			}
		}

		// Vérifier qu'il n'y a pas d'erreurs
		return errors.value.length === 0
	})

	// Watch pour les changements internes
	watch([internalFromDate, internalToDate], () => {
		validateFields()
		emit('update:modelValue', {
			from: formattedFromDate.value,
			to: formattedToDate.value,
		})
	})

	// Watch pour les changements externes
	watch(() => props.modelValue, (newValue) => {
		if (!newValue) return

		const newFromDate = formatDateValue(newValue.from)
		const newToDate = formatDateValue(newValue.to)

		if (internalFromDate.value !== newFromDate) {
			internalFromDate.value = newFromDate
		}
		if (internalToDate.value !== newToDate) {
			internalToDate.value = newToDate
		}
	}, { deep: true })

	// Initialisation
	internalFromDate.value = formatDateValue(props.modelValue?.from)
	internalToDate.value = formatDateValue(props.modelValue?.to)

	function validateFieldSet(value: string | null, fieldRules: {
		type: string
		options: RuleOptions
	}[], fieldIdentifier: string) {
		const rules = generateRules(fieldRules)
		const results = rules.map(rule => rule(value || ''))

		// Filtrer et ajouter les erreurs
		const fieldErrors = results
			.filter(result => !result.isValid && !result.isWarning && result.message)
			.map(result => result.message || '')

		// Filtrer et ajouter les succès
		const fieldSuccesses = results
			.filter(result => result.isValid && result.successMessage)
			.map(result => result.successMessage || '')

		// Réinitialiser les erreurs et succès pour ce champ spécifique
		errors.value = errors.value.filter(error => !error.includes(fieldIdentifier))
		successes.value = successes.value.filter(success => !success.includes(fieldIdentifier))

		// Ajouter les nouvelles erreurs et succès
		if (fieldErrors.length > 0) {
			errors.value.push(...fieldErrors)
		}

		if (props.showSuccessMessages && fieldSuccesses.length > 0) {
			successes.value.push(...fieldSuccesses)
		}

		// Retourner true si pas d'erreurs
		return fieldErrors.length === 0
	}

	function validateFields() {
		// Réinitialiser les tableaux d'erreurs et de succès
		errors.value = []
		successes.value = []

		let isValid = true

		// Ne valider la date de début que si elle est renseignée et requise, ou si les deux dates sont renseignées
		if ((formattedFromDate.value && props.required) || (formattedFromDate.value && formattedToDate.value)) {
			const fromResult = validateFieldSet(formattedFromDate.value, fromDateRules, 'fromDate')
			isValid = isValid && fromResult
		}

		// Ne valider la date de fin que si elle est renseignée et requise, ou si les deux dates sont renseignées
		if ((formattedToDate.value && props.required) || (formattedFromDate.value && formattedToDate.value)) {
			const toResult = validateFieldSet(formattedToDate.value, toDateRules, 'toDate')
			isValid = isValid && toResult
		}

		return isValid
	}

	const fromDateRef = ref()
	const toDateRef = ref()

	const validateOnSubmit = (): boolean => {
		// Valider les deux DatePicker
		const fromDateValid = fromDateRef.value?.validateOnSubmit() ?? true
		const toDateValid = toDateRef.value?.validateOnSubmit() ?? true

		// Valider le PeriodField lui-même
		const fieldsValid = validateFields()

		// Retourner true seulement si tout est valide
		const result = fromDateValid && toDateValid && fieldsValid && isValid.value

		return result
	}

	function stringToDate(dateString: string | null): Date | undefined {
		if (!dateString || typeof dateString !== 'string') return undefined
		const [day, month, year] = dateString.split('/').map(part => parseInt(part, 10))
		return new Date(year, month - 1, day)
	}

	defineExpose({
		validateOnSubmit,
		errors,
		successes,
		isValid,
	})
</script>

<template>
	<div class="period-field">
		<DatePicker
			ref="fromDateRef"
			v-model="internalFromDate"
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
			:placeholder="props.placeholderFrom"
			:required="props.required"
			:show-week-number="props.showWeekNumber"
			:success-message="hasFromDateSuccesses"
			class="mr-2"
		/>
		<DatePicker
			ref="toDateRef"
			v-model="internalToDate"
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
			:placeholder="props.placeholderTo"
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

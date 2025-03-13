<script lang="ts" setup>
	import { ref, watch, computed } from 'vue'
	import DatePicker from '@/components/DatePicker/DatePicker.vue'
	import { type RuleOptions, useFieldValidation } from '@/composables'

	const { parseDate } = useFieldValidation()

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

	// Règles de validation pour la date de début
	const fromDateRules = [
		{
			type: 'custom',
			options: {
				validate: (value: Date | null) => {
					if (value === null) return true
					if (tempToDate.value === undefined || tempToDate.value === null) return true
					return value <= tempToDate.value
				},
				message: 'La date de début ne peut pas être supérieure à la date de fin.',
				successMessage: 'La date de début est valide.',
				fieldIdentifier: 'fromDateRef',
			},
		},
		...(props.required
			? [{
				type: 'required',
				options: {
					validate: (value: Date | null) => {
						// Si les deux champs sont vides, on affiche l'erreur sur les deux
						if (!value && !tempToDate.value) {
							return false
						}
						// Si l'autre champ est rempli, on force la validation de celui-ci
						if (!value && tempToDate.value) {
							return false
						}
						return true
					},
					message: 'La date de début est requise.',
					successMessage: 'La date de début est renseignée.',
					fieldIdentifier: 'fromDateRef',
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
				validate: (value: Date | null) => {
					if (value === null) return true
					if (tempFromDate.value === undefined || tempFromDate.value === null) return true
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
					validate: (value: Date | null) => {
						// Si les deux champs sont vides, on affiche l'erreur sur les deux
						if (!value && !tempFromDate.value) {
							return false
						}
						// Si l'autre champ est rempli, on force la validation de celui-ci
						if (!value && tempFromDate.value) {
							return false
						}
						return true
					},
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
	const tempFromDate = computed(() => formattedFromDate.value ? parseDate(formattedFromDate.value, props.format) : undefined)
	const tempToDate = computed(() => formattedToDate.value ? parseDate(formattedToDate.value, props.format) : undefined)

	// Sets pour optimiser la recherche des erreurs et succès
	const fromDateErrorsSet = computed(() => new Set(errors.value.filter(error => error.includes('fromDate'))))
	const toDateErrorsSet = computed(() => new Set(errors.value.filter(error => error.includes('toDate'))))
	const fromDateSuccessesSet = computed(() => new Set(successes.value.filter(success => success.includes('fromDate'))))
	const toDateSuccessesSet = computed(() => new Set(successes.value.filter(success => success.includes('toDate'))))

	const hasFromDateErrors = computed(() => fromDateErrorsSet.value.size > 0)
	const hasToDateErrors = computed(() => toDateErrorsSet.value.size > 0)
	const hasFromDateSuccesses = computed(() => fromDateSuccessesSet.value.size > 0)
	const hasToDateSuccesses = computed(() => toDateSuccessesSet.value.size > 0)

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
			const fromDate = parseDate(formattedFromDate.value, props.format)
			const toDate = parseDate(formattedToDate.value, props.format)
			if (!fromDate || !toDate || fromDate > toDate) {
				return false
			}
		}

		// Vérifier qu'il n'y a pas d'erreurs
		return errors.value.length === 0
	})

	// Watch pour les changements de la date de début
	watch(formattedFromDate, () => {
		// Si la date de fin existe, on revalide
		if (formattedToDate.value && toDateRef.value) {
			toDateRef.value.validateOnSubmit()
		}
	})

	// Watch pour les changements de la date de fin
	watch(formattedToDate, () => {
		// Si la date de début existe, on revalide
		if (formattedFromDate.value && fromDateRef.value) {
			fromDateRef.value.validateOnSubmit()
		}
	})

	// Watch pour les changements internes
	watch([internalFromDate, internalToDate], () => {
		emit('update:modelValue', {
			from: formattedFromDate.value,
			to: formattedToDate.value,
		})
	})

	// Watch pour les changements externes avec immediate pour synchroniser l'état initial
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
	}, { deep: true, immediate: true })

	// Initialisation
	internalFromDate.value = formatDateValue(props.modelValue?.from)
	internalToDate.value = formatDateValue(props.modelValue?.to)

	const fromDateRef = ref()
	const toDateRef = ref()

	// Gestionnaires d'événements closed
	const handleFromDateClosed = () => {
		if (fromDateRef.value) {
			fromDateRef.value.validateOnSubmit()
		}
	}

	const handleToDateClosed = () => {
		if (toDateRef.value) {
			toDateRef.value.validateOnSubmit()
		}
	}

	const validateOnSubmit = (): boolean => {
		// Valider les deux DatePicker
		const fromDateValid = fromDateRef.value?.validateOnSubmit() ?? true
		const toDateValid = toDateRef.value?.validateOnSubmit() ?? true

		// Retourner true seulement si tout est valide
		const result = fromDateValid && toDateValid && isValid.value

		return result
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
		<div
			class="period-field__col"
		>
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
				@closed="handleFromDateClosed"
			/>
		</div>
		<div
			class="period-field__col"
		>
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
				@closed="handleToDateClosed"
			/>
		</div>
	</div>
</template>

<style scoped>
.period-field {
	display: flex;
	gap: 24px;
	flex-wrap: wrap;
}

.period-field__col {
	flex: 1;
	min-width: min(300px, 100%);
}
</style>

<script lang="ts" setup>
	/* eslint-disable @typescript-eslint/no-explicit-any -- Nécessaire pour gérer différents types d'entrée */
	import { ref, watch, computed, onMounted, nextTick } from 'vue'
	import DatePicker from '@/components/DatePicker/DatePicker/DatePicker.vue'
	import { useFieldValidation } from '@/composables'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'

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
		disabled?: boolean
		noIcon?: boolean
		noCalendar?: boolean
		isOutlined?: boolean
		showSuccessMessages?: boolean
		customRules?: ValidationRule[]
		customWarningRules?: ValidationRule[]
		disableErrorHandling?: boolean
		readonly?: boolean
		bgColor?: string
		density?: 'default' | 'comfortable' | 'compact'
		hideDetails?: boolean | 'auto'
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
		disabled: false,
		noIcon: false,
		noCalendar: false,
		isOutlined: true,
		showSuccessMessages: true,
		customRules: () => [],
		customWarningRules: () => [],
		disableErrorHandling: false,
		readonly: false,
		bgColor: 'white',
		density: 'default',
		hideDetails: false,
	})

	const emit = defineEmits(['update:modelValue'])

	// Références aux composants DatePicker
	const fromDateRef = ref()
	const toDateRef = ref()

	// Valeurs internes pour les dates
	const internalFromDate = ref<string | null>(null)
	const internalToDate = ref<string | null>(null)

	// Utiliser le composable de validation
	const fromDateValidation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: 'fromDate',
		disableErrorHandling: props.disableErrorHandling,
	})

	const toDateValidation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: 'toDate',
		disableErrorHandling: props.disableErrorHandling,
	})

	/**
	 * Formate une valeur de date en chaîne de caractères au format spécifié
	 * @param value - La valeur de date à formater
	 * @returns La date formatée ou null
	 */
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

	// Computed properties pour les dates parsées
	const parsedFromDate = computed(() => formattedFromDate.value ? parseDate(formattedFromDate.value, props.format) : null)
	const parsedToDate = computed(() => formattedToDate.value ? parseDate(formattedToDate.value, props.format) : null)

	// Règles de validation pour la date de début
	const fromDateRules = computed<ValidationRule[]>(() =>
		!props.disableErrorHandling
			? [
				{
					type: 'custom',
					options: {
						validate: (value: Date | null) => {
							if (value === null) return true
							if (parsedToDate.value === null) return true
							return value <= parsedToDate.value
						},
						message: 'La date de début ne peut pas être supérieure à la date de fin.',
						successMessage: 'La date de début est valide.',
						fieldIdentifier: 'fromDate',
					},
				},
				...(props.required && !props.disableErrorHandling
					? [{
						type: 'required',
						options: {
							validate: (value: Date | null) => {
								// Si les deux champs sont vides, on affiche l'erreur sur les deux
								if (!value && !parsedToDate.value) {
									return false
								}
								// Si l'autre champ est rempli, on force la validation de celui-ci
								if (!value && parsedToDate.value) {
									return false
								}
								return true
							},
							message: 'La date de début est requise.',
							successMessage: 'La date de début est renseignée.',
							fieldIdentifier: 'fromDate',
						},
					}]
					: []),
				...(!props.disableErrorHandling ? props.customRules : []),
			]
			: [],
	)

	// Variable réactive pour contrôler l'affichage des messages de succès
	const showSuccessMessagesActual = computed(() =>
		props.disableErrorHandling ? false : props.showSuccessMessages,
	)

	// Règles de validation pour la date de fin
	const toDateRules = computed<ValidationRule[]>(() =>
		!props.disableErrorHandling
			? [
				{
					type: 'custom',
					options: {
						validate: (value: Date | null) => {
							if (value === null) return true
							if (parsedFromDate.value === null) return true
							return value >= parsedFromDate.value
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
								if (!value && !parsedFromDate.value) {
									return false
								}
								// Si l'autre champ est rempli, on force la validation de celui-ci
								if (!value && parsedFromDate.value) {
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
			: [],
	)

	// Vérification de la validité du formulaire en utilisant les validations
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
		if (formattedFromDate.value && formattedToDate.value && parsedFromDate.value && parsedToDate.value) {
			if (parsedFromDate.value > parsedToDate.value) {
				return false
			}
		}

		// Vérifier que les deux validations ne signalent pas d'erreurs
		return !fromDateValidation.hasError.value && !toDateValidation.hasError.value
	})

	// Synchronisation lorsque l'une des dates change
	function validateBothDates() {
		if (fromDateRef.value) {
			fromDateRef.value.validateOnSubmit()
		}
		if (toDateRef.value) {
			toDateRef.value.validateOnSubmit()
		}
	}

	// Validation complète du PeriodField
	function validateFields() {
		fromDateValidation.validateField(parsedFromDate.value, fromDateRules.value, props.customWarningRules)
		toDateValidation.validateField(parsedToDate.value, toDateRules.value, props.customWarningRules)
	}

	// Gestionnaires d'événements closed
	function handleFromDateClosed() {
		validateBothDates()
	}

	function handleToDateClosed() {
		validateBothDates()
	}

	// Watch pour les changements des dates - validation croisée
	watch(formattedFromDate, () => {
		validateFields()
		if (formattedToDate.value && toDateRef.value) {
			toDateRef.value.validateOnSubmit()
		}
	})

	watch(formattedToDate, () => {
		validateFields()
		if (formattedFromDate.value && fromDateRef.value) {
			fromDateRef.value.validateOnSubmit()
		}
	})

	// Watch pour les changements internes - Mise à jour du modèle
	watch([internalFromDate, internalToDate], () => {
		emit('update:modelValue', {
			from: formattedFromDate.value,
			to: formattedToDate.value,
		})
	})

	// Watch pour les changements externes - Synchronisation
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
		// Valider les champs après la mise à jour des valeurs
		validateFields()
	}, { deep: true, immediate: true })

	// Fonction publique de validation
	const validateOnSubmit = (): boolean => {
		// Valider les deux DatePicker
		const fromDateValid = fromDateRef.value?.validateOnSubmit() ?? true
		const toDateValid = toDateRef.value?.validateOnSubmit() ?? true

		// Valider avec les règles personnalisées
		validateFields()

		// Retourner true seulement si tout est valide
		return fromDateValid && toDateValid && isValid.value
	}

	// Initialisation
	onMounted(() => {
		internalFromDate.value = formatDateValue(props.modelValue?.from)
		internalToDate.value = formatDateValue(props.modelValue?.to)
		// Validation initiale
		validateFields()
		
		// Fix ARIA attributes to prevent validation errors
		nextTick(() => {
			fixAriaAttributes()
		})
	})
	
	// Function to fix ARIA attributes that cause validation errors
	function fixAriaAttributes() {
		try {
			// Get the root element of the component
			const rootElement = document.querySelector('.period-field-container')
			if (!rootElement) return
			
			// Find all elements with invalid ARIA attributes
			const elementsWithAriaHaspopup = rootElement.querySelectorAll('[aria-haspopup="menu"]')
			elementsWithAriaHaspopup.forEach((element) => {
				element.removeAttribute('aria-haspopup')
				element.removeAttribute('aria-expanded')
				element.removeAttribute('aria-controls')
			})
			
			// Find input elements with invalid ARIA attributes
			const inputElements = rootElement.querySelectorAll('input[aria-haspopup="menu"]')
			inputElements.forEach((input) => {
				input.removeAttribute('aria-haspopup')
				input.removeAttribute('aria-expanded')
				input.removeAttribute('aria-controls')
			})
		}
		catch (error) {
			console.error('Error fixing ARIA attributes:', error)
		}
	}

	defineExpose({
		validateOnSubmit,
		errors: {
			fromDate: fromDateValidation.errors,
			toDate: toDateValidation.errors,
		},
		successes: {
			fromDate: fromDateValidation.successes,
			toDate: toDateValidation.successes,
		},
		warnings: {
			fromDate: fromDateValidation.warnings,
			toDate: toDateValidation.warnings,
		},
		isValid,
	})
</script>

<template>
	<div class="period-field">
		<div class="period-field__col">
			<DatePicker
				ref="fromDateRef"
				v-model="internalFromDate"
				:custom-rules="fromDateRules"
				:custom-warning-rules="props.customWarningRules"
				:date-format-return="props.dateFormatReturn"
				:display-append-icon="props.displayAppendIcon"
				:display-icon="props.displayIcon"
				:error-message="fromDateValidation.hasError"
				:format="props.format"
				:disabled="props.disabled"
				:is-outlined="props.isOutlined"
				:no-calendar="props.noCalendar"
				:no-icon="props.noIcon"
				:placeholder="props.placeholderFrom"
				:label="props.placeholderFrom"
				:required="props.disableErrorHandling ? false : props.required"
				:show-week-number="props.showWeekNumber"
				:show-success-messages="showSuccessMessagesActual"
				:success-message="fromDateValidation.hasSuccess"
				:readonly="props.readonly"
				:bg-color="props.bgColor"
				:density="props.density"
				:hide-details="props.hideDetails"
				@closed="handleFromDateClosed"
			/>
		</div>
		<div class="period-field__col">
			<DatePicker
				ref="toDateRef"
				v-model="internalToDate"
				:custom-rules="toDateRules"
				:custom-warning-rules="props.customWarningRules"
				:date-format-return="props.dateFormatReturn"
				:display-append-icon="props.displayAppendIcon"
				:display-icon="props.displayIcon"
				:error-message="toDateValidation.hasError"
				:format="props.format"
				:disabled="props.disabled"
				:is-outlined="props.isOutlined"
				:no-calendar="props.noCalendar"
				:no-icon="props.noIcon"
				:placeholder="props.placeholderTo"
				:label="props.placeholderTo"
				:required="props.disableErrorHandling ? false : props.required"
				:show-week-number="props.showWeekNumber"
				:show-success-messages="showSuccessMessagesActual"
				:success-message="toDateValidation.hasSuccess"
				:readonly="props.readonly"
				:bg-color="props.bgColor"
				:density="props.density"
				:hide-details="props.hideDetails"
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

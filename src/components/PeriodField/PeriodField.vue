<script lang="ts" setup>
	/* eslint-disable @typescript-eslint/no-explicit-any -- Nécessaire pour gérer différents types d'entrée */
	import { ref, watch, computed, onMounted, readonly as readonlyState } from 'vue'
	import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
	import { useFieldValidation } from '@/composables'
	import { useValidation, type ValidationRule } from '@/composables/validation/useValidation'
	import { locales as defaultLocales } from './locales'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	const { parseDate } = useFieldValidation()

	type DateInput = string | null
	type PeriodValue = { from: DateInput, to: DateInput }

	const props = withDefaults(defineProps<{
		bgColor?: string
		customRules?: ValidationRule[]
		customWarningRules?: ValidationRule[]
		dateFormatReturn?: string
		density?: 'default' | 'comfortable' | 'compact'
		disableErrorHandling?: boolean
		disabled?: boolean
		displayAppendIcon?: boolean
		displayIcon?: boolean
		format?: string
		headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
		hideDetails?: boolean | 'auto'
		isOutlined?: boolean
		modelValue?: PeriodValue
		noCalendar?: boolean
		noIcon?: boolean
		placeholderFrom?: string
		placeholderTo?: string
		readonly?: boolean
		required?: boolean
		showSuccessMessages?: boolean
		showWeekNumber?: boolean
		locales?: DeepPartial<typeof defaultLocales>
	}>(), {
		bgColor: 'white',
		customRules: () => [],
		customWarningRules: () => [],
		dateFormatReturn: '',
		density: 'default',
		disableErrorHandling: false,
		disabled: false,
		displayAppendIcon: false,
		displayIcon: true,
		format: 'DD/MM/YYYY',
		headingLevel: 2,
		hideDetails: false,
		isOutlined: true,
		modelValue: () => ({ from: null, to: null }),
		noCalendar: false,
		noIcon: false,
		placeholderFrom: 'Début',
		placeholderTo: 'Fin',
		readonly: false,
		required: false,
		showSuccessMessages: false,
		showWeekNumber: false,
		locales: () => ({}),
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const emit = defineEmits(['update:modelValue'])

	// Références aux composants CalendarMode
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
						message: locales.value.fromAfterTo,
						successMessage: locales.value.fromValid,
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
							message: locales.value.fromRequired,
							successMessage: locales.value.fromFilled,
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
						message: locales.value.toBeforeFrom,
						successMessage: locales.value.toValid,
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
							message: locales.value.toRequired,
							successMessage: locales.value.toFilled,
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
	async function validateBothDates() {
		if (fromDateRef.value) {
			fromDateRef.value.validateOnSubmit()
		}
		if (toDateRef.value) {
			await toDateRef.value.validateOnSubmit()
		}
	}

	// Validation complète du PeriodField
	async function validateFields() {
		await fromDateValidation.validateField(parsedFromDate.value, fromDateRules.value, props.customWarningRules)
		await toDateValidation.validateField(parsedToDate.value, toDateRules.value, props.customWarningRules)
	}

	// Gestionnaires d'événements closed
	async function handleFromDateClosed() {
		await validateBothDates()
	}

	async function handleToDateClosed() {
		await validateBothDates()
	}

	// Watch pour les changements des dates - validation croisée
	watch(formattedFromDate, async () => {
		await validateFields()
		if (formattedToDate.value && toDateRef.value) {
			await toDateRef.value.validateOnSubmit()
		}
	})

	watch(formattedToDate, async () => {
		await validateFields()
		if (formattedFromDate.value && fromDateRef.value) {
			await fromDateRef.value.validateOnSubmit()
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
	watch(() => props.modelValue, async (newValue) => {
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
		await validateFields()
	}, { deep: true, immediate: true })

	// Fonction publique de validation
	const validateOnSubmit = async (): Promise<boolean> => {
		// Valider les deux CalendarMode
		const fromDateValid = await fromDateRef.value?.validateOnSubmit() ?? true
		const toDateValid = await toDateRef.value?.validateOnSubmit() ?? true

		// Valider avec les règles personnalisées
		await validateFields()

		// Retourner true seulement si tout est valide
		return fromDateValid && toDateValid && isValid.value
	}

	// Initialisation
	onMounted(async () => {
		internalFromDate.value = formatDateValue(props.modelValue?.from)
		internalToDate.value = formatDateValue(props.modelValue?.to)
		// Validation initiale
		await validateFields()
	})

	defineExpose({
		validateOnSubmit,
		clearValidation: () => {
			fromDateValidation.clearValidation()
			toDateValidation.clearValidation()
		},
		errors: {
			fromDate: readonlyState(fromDateValidation.errors),
			toDate: readonlyState(toDateValidation.errors),
		},
		successes: {
			fromDate: readonlyState(fromDateValidation.successes),
			toDate: readonlyState(toDateValidation.successes),
		},
		warnings: {
			fromDate: readonlyState(fromDateValidation.warnings),
			toDate: readonlyState(toDateValidation.warnings),
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
				:heading-level="props.headingLevel"
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
				:heading-level="props.headingLevel"
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

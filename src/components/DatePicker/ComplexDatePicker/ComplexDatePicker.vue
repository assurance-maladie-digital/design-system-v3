<script lang="ts" setup>
	import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, type ComponentPublicInstance, type Ref } from 'vue'
	import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
	import DateTextInput from '../DateTextInput/DateTextInput.vue'
	import { VDatePicker } from 'vuetify/components'
	import { useInputHandler } from '../composables/useInputHandler'
	import { useValidation } from '@/composables/validation/useValidation'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import { useDateInitialization, type DateInput, type DateValue } from '@/composables/date/useDateInitializationDayjs'
	import type { DateObjectValue } from '../types'
	import { useDatePickerAccessibility } from '@/composables/date/useDatePickerAccessibility'
	import { DATE_PICKER_MESSAGES } from '../constants/messages'
	import { useMonthButtonCustomization } from '../composables'
	import { mdiCalendar } from '@mdi/js'
	import { useHolidayDay } from '@/composables/date/useHolidayDay'
	import {
		useTodayButton,
		useDatePickerViewMode,
		useDateSelection,
		useDateRangeValidation,
		useDateFormatValidation,
		useIconState,
		useDateValidation,
		useManualDateValidation,
		useInputBlurHandler,
		useDatePickerVisibility,
		useDisplayedDateString,
		useAsteriskDisplay,
	} from '../composables'

	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'

	// Initialiser les plugins dayjs
	dayjs.extend(customParseFormat)

	const { parseDate, formatDate } = useDateFormat()
	const { initializeSelectedDates } = useDateInitialization()
	const { updateAccessibility } = useDatePickerAccessibility()

	// Variables pour suivre le mois et l'année actuellement affichés dans le CalendarMode
	const currentMonth = ref<string | null>(null)
	const currentYear = ref<string | null>(null)
	const currentMonthName = ref<string | null>(null)
	const currentYearName = ref<string | null>(null)

	const onUpdateMonth = (month: string) => {
		// Éviter les mises à jour inutiles si le mois n'a pas changé
		if (currentMonth.value === month) return

		currentMonth.value = month
		currentMonthName.value = dayjs().month(parseInt(month, 10)).format('MMMM')
		handleMonthUpdate()
		nextTick(() => {
			if (isDatePickerVisible.value) {
				customizeMonthButton()
				markHolidayDays()
			}
		})
	}

	const onUpdateYear = (year: string) => {
		const oldYear = currentYear.value
		currentYear.value = year
		currentYearName.value = year

		// Gérer le changement d'année entre décembre et janvier
		if (parseInt(year) > parseInt(oldYear || '0') && parseInt(currentMonth.value || '0') === 11) {
			currentMonth.value = '0'
			currentMonthName.value = dayjs().month(0).format('MMMM')
		}
		else if (parseInt(year) < parseInt(oldYear || '0') && parseInt(currentMonth.value || '0') === 0) {
			currentMonth.value = '11'
			currentMonthName.value = dayjs().month(11).format('MMMM')
		}

		handleYearUpdate()
		handleMonthUpdate()
		nextTick(() => {
			if (isDatePickerVisible.value) {
				customizeMonthButton()
				markHolidayDays()
			}
		})
	}

	// Fonction pour gérer les dates sélectionnées depuis le DateTextInput
	const handleDateSelected = (value: DateValue) => {
		// Mettre à jour le modèle avec la nouvelle valeur
		updateModel(value)

		// Mettre à jour les dates sélectionnées
		if (value === null) {
			selectedDates.value = null
		}
		else if (Array.isArray(value)) {
			// Pour les plages de dates
			const dateObjects = value.map((dateStr) => {
				return parseDate(dateStr, props.dateFormatReturn || props.format)
			}).filter(Boolean) as Date[]
			selectedDates.value = dateObjects
		}
		else {
			// Pour une date unique
			const dateObject = parseDate(value, props.dateFormatReturn || props.format)
			selectedDates.value = dateObject
		}

		// Émettre l'événement date-selected
		emit('date-selected', value)
	}

	const props = withDefaults(defineProps<{
		modelValue?: DateInput
		label?: string
		placeholder?: string
		format?: string
		dateFormatReturn?: string
		isBirthDate?: boolean
		birthDate?: boolean // Alias pour isBirthDate pour compatibilité avec l'attribut kebab-case birth-date
		showWeekNumber?: boolean
		required?: boolean
		displayRange?: boolean
		displayIcon?: boolean
		displayAppendIcon?: boolean
		displayPrependIcon?: boolean
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
		customRules?: { type: string, options: any }[]
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- mock Axios headers
		customWarningRules?: { type: string, options: any }[]
		disabled?: boolean
		noIcon?: boolean
		noCalendar?: boolean
		isOutlined?: boolean
		readonly?: boolean
		width?: string
		disableErrorHandling?: boolean
		showSuccessMessages?: boolean
		bgColor?: string
		textFieldActivator?: boolean
		displayTodayButton?: boolean
		displayWeekendDays?: boolean
		displayHolidayDays?: boolean
		displayAsterisk?: boolean
		period?: {
			min?: string
			max?: string
		}
		autoClamp?: boolean
		isValidateOnBlur?: boolean
	}>(), {
		modelValue: undefined,
		placeholder: DATE_PICKER_MESSAGES.PLACEHOLDER_DEFAULT,
		format: DATE_PICKER_MESSAGES.FORMAT_DEFAULT,
		dateFormatReturn: '',
		isBirthDate: false,
		birthDate: false,
		showWeekNumber: false,
		required: false,
		displayRange: false,
		displayIcon: true,
		displayAppendIcon: false,
		displayPrependIcon: true,
		customRules: () => [],
		customWarningRules: () => [],
		disabled: false,
		noIcon: false,
		noCalendar: false,
		isOutlined: true,
		readonly: false,
		width: '100%',
		disableErrorHandling: false,
		showSuccessMessages: true,
		bgColor: 'white',
		textFieldActivator: false,
		displayTodayButton: true,
		displayWeekendDays: true,
		displayHolidayDays: true,
		displayAsterisk: false,
		period: () => ({
			min: '',
			max: '',
		}),
		autoClamp: false,
		label: DATE_PICKER_MESSAGES.PLACEHOLDER_DEFAULT,
		isValidateOnBlur: true,
	})

	// Computed properties pour period
	const minDate = computed(() =>
		props.period?.min || dayjs().subtract(10, 'year').format(props.format),
	)
	const maxDate = computed(() =>
		props.period?.max || dayjs().add(10, 'year').format(props.format),
	)

	const emit = defineEmits<{
		(e: 'update:modelValue', value: DateValue): void
		(e: 'closed'): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'input', value: string): void
		(e: 'date-selected', value: DateValue): void
	}>()

	// Utilisation du composable pour la saisie manuelle des plages de dates
	const selectedDates = ref<Date | (Date | null)[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null, props.format, props.dateFormatReturn),
	)

	// Utilisation du composable pour la validation des plages de dates
	const { currentRangeIsValid, getRangeValidationError } = useDateRangeValidation(selectedDates as Ref<DateObjectValue>, props.displayRange)

	const isDatePickerVisible = ref(false)
	const validation = useValidation({
		showSuccessMessages: props.showSuccessMessages,
		fieldIdentifier: 'Date',
		customRules: props.customRules,
		warningRules: props.customWarningRules,
		disableErrorHandling: props.disableErrorHandling,
	})
	const { errors, warnings, successes, validateField, clearValidation } = validation

	const errorMessages = computed(() => errors.value)
	const warningMessages = computed(() => warnings.value)
	const successMessages = computed(() => successes.value)
	const displayFormattedDate = ref('')

	const textInputValue = ref<string>('')

	// Variables pour la gestion de la saisie manuelle
	const isManualInputActive = ref(false)
	const isFormatting = ref(false)

	// Variable pour éviter les mises à jour récursives
	const isUpdatingFromInternal = ref(false)
	// Variable pour suivre si l'utilisateur a interagi avec le champ
	const hasInteracted = ref(false)

	const { validateDateFormat, isDateComplete } = useDateFormatValidation({
		format: props.format,
		dateFormatReturn: props.dateFormatReturn,
		required: props.required,
		hasInteracted,
		disableErrorHandling: props.disableErrorHandling,
	})

	// pour valider les dates
	// On récupère validateDates depuis le composable mais on va redéfinir validateOnSubmit
	const { validateDates } = useDateValidation({
		noCalendar: props.noCalendar,
		required: props.required,
		displayRange: props.displayRange,
		disableErrorHandling: props.disableErrorHandling,
		customRules: props.customRules,
		customWarningRules: props.customWarningRules,
		selectedDates,
		isUpdatingFromInternal,
		currentRangeIsValid,
		getRangeValidationError,
		clearValidation,
		validateField,
		errors,
		warnings,
		successes,
	})

	// Fonction centralisée pour mettre à jour le modèle
	const updateModel = (value: DateValue) => {
		// Éviter les mises à jour inutiles
		if (JSON.stringify(value) === JSON.stringify(props.modelValue)) return

		try {
			isUpdatingFromInternal.value = true
			emit('update:modelValue', value)
		}
		finally {
			// S'assurer que le flag est toujours réinitialisé
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}

	// Watcher pour mettre à jour le modèle lorsque les dates sélectionnées changent
	watch(selectedDates, (newValue) => {
		// Valider les dates
		validateDates()

		// Mettre à jour le modèle si nécessaire
		if (newValue !== null) {
			updateModel(formattedDate.value)

			// Mettre à jour textInputValue pour le DateTextInput
			try {
				isUpdatingFromInternal.value = true
				if (Array.isArray(newValue)) {
					// Pour les plages de dates, utiliser la première date
					if (newValue.length > 0) {
						textInputValue.value = formatDate(newValue[0], props.format)
					}
				}
				else {
					// Pour une date unique
					textInputValue.value = formatDate(newValue, props.format)
				}
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else {
			updateModel(null)
			// Réinitialiser textInputValue
			textInputValue.value = ''
		}
	})

	const getMessageClasses = () => ({
		'dp-width': true,
		'v-messages__message--success': successMessages.value.length > 0,
		'v-messages__message--error': errorMessages.value.length > 0,
		'v-messages__message--warning': warningMessages.value.length > 0 && errorMessages.value.length < 1,
	})

	// Déclaration des variables qui seront initialisées par le composable useDateSelection
	const rangeBoundaryDates = ref<[Date | null, Date | null] | null>(null)
	// Initialisation des variables après la déclaration de selectedDates
	const dateSelectionResult = useDateSelection(
		parseDate,
		selectedDates,
		props.format,
		props.displayRange,
	)

	watch(() => dateSelectionResult.rangeBoundaryDates.value, (newValue) => {
		rangeBoundaryDates.value = newValue
	}, { immediate: true })

	// Assignation des fonctions et variables retournées par le composable
	// Utiliser une fonction pour wrapper updateSelectedDates afin de maintenir la compatibilité avec le template
	const updateSelectedDates = (date: Date | null) => {
		// Avant de mettre à jour la date, vérifier qu'elle est valide selon nos règles personnalisées
		if (date !== null) {
			// Appliquer les règles personnalisées directement à la date sélectionnée
			const validationResult = validateField(date, props.customRules, props.customWarningRules)

			// Si la date est invalide selon nos règles, ne pas mettre à jour et afficher l'erreur
			if (validationResult.hasError) {
				// Mettre à jour les messages d'erreur
				errors.value = validationResult.state.errors
				return // Ne pas continuer la mise à jour
			}
		}

		// Si la date est valide ou null, on poursuit normalement
		dateSelectionResult.updateSelectedDates(date)

		// Forcer une validation immédiate après la mise à jour des dates
		// pour s'assurer que les messages s'affichent
		setTimeout(() => {
			validateDates(true)
		}, 0)
	}
	// generateDateRange est maintenant utilisé via le composable useInputHandler
	// Synchroniser notre référence locale avec celle du composable
	watch(() => dateSelectionResult.rangeBoundaryDates.value, (newValue) => {
		rangeBoundaryDates.value = newValue
	}, { immediate: true })

	// Date(s) formatée(s) en chaîne de caractères pour la valeur de retour
	const formattedDate = computed<DateValue>(() => {
		if (!selectedDates.value) return ''

		const returnFormat = props.dateFormatReturn || props.format

		// Pour les plages de dates, utiliser rangeBoundaryDates s'il est disponible
		if (props.displayRange && rangeBoundaryDates.value) {
			return [
				formatDate(rangeBoundaryDates.value[0], returnFormat),
				formatDate(rangeBoundaryDates.value[1], returnFormat),
			] as [string, string]
		}
		else if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return [
					formatDate(selectedDates.value[0], returnFormat),
					formatDate(selectedDates.value[selectedDates.value.length - 1], returnFormat),
				] as [string, string]
			}
			return ''
		}

		return formatDate(selectedDates.value, returnFormat)
	})

	watch(formattedDate, (newValue) => {
		if (!newValue || newValue === '') {
			textInputValue.value = ''
		}
		else if (typeof newValue === 'string') {
			// Si on a un format de retour différent, on doit convertir la date
			if (props.dateFormatReturn) {
				const date = parseDate(newValue, props.dateFormatReturn)
				if (date) {
					textInputValue.value = formatDate(date, props.format)
				}
			}
			else {
				textInputValue.value = newValue
			}
		}
	}, { immediate: true })

	watch(textInputValue, (newValue) => {
		// Éviter les mises à jour récursives
		if (isUpdatingFromInternal.value) return

		// Parse la date avec le format d'affichage
		const date = parseDate(newValue, props.format)
		if (date) {
			// Si on a un format de retour, formater la date dans ce format
			const formattedValue = props.dateFormatReturn
				? formatDate(date, props.dateFormatReturn)
				: formatDate(date, props.format)
			updateModel(formattedValue)

			// Mettre à jour selectedDates sans déclencher de watchers supplémentaires
			try {
				isUpdatingFromInternal.value = true
				selectedDates.value = date
				// Mettre à jour l'affichage formaté
				displayFormattedDate.value = formatDate(date, props.format)
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else if (newValue) {
			// Même si la date n'est pas valide, conserver la valeur saisie
			// pour éviter que la date ne disparaisse
			updateModel(newValue)
			// Mettre à jour l'affichage formaté pour qu'il corresponde à ce qui est saisi
			try {
				isUpdatingFromInternal.value = true
				displayFormattedDate.value = newValue
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
		else {
			updateModel(null)
			// Réinitialiser l'affichage formaté
			try {
				isUpdatingFromInternal.value = true
				displayFormattedDate.value = ''
				selectedDates.value = null
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
	})

	// Date(s) formatée(s) en chaîne de caractères pour l'affichage
	const displayFormattedDateComputed = computed(() => {
		if (!selectedDates.value) return null

		if (Array.isArray(selectedDates.value)) {
			if (selectedDates.value.length >= 2) {
				return `${formatDate(selectedDates.value[0], props.format)} - ${formatDate(
					selectedDates.value[selectedDates.value.length - 1],
					props.format,
				)}`
			}
			return formatDate(selectedDates.value[0], props.format)
		}

		return formatDate(selectedDates.value, props.format)
	})

	watch(displayFormattedDateComputed, (newValue) => {
		if (!props.noCalendar && newValue) {
			displayFormattedDate.value = newValue
		}
	})

	/**
	 * Met à jour l'affichage formaté de la date lorsqu'une date est sélectionnée dans le calendrier
	 */
	const updateDisplayFormattedDate = () => {
		// Utiliser setTimeout pour s'assurer que toutes les mises à jour sont terminées
		setTimeout(() => {
			// Mettre à jour l'affichage formaté pour qu'il corresponde à la date sélectionnée
			let formattedValue = ''

			// Gérer la fermeture du CalendarMode en fonction du mode et de l'état de sélection
			if (props.displayRange) {
				// Priorité à rangeBoundaryDates pour les plages
				if (rangeBoundaryDates.value && rangeBoundaryDates.value[0] && rangeBoundaryDates.value[1]) {
					// Les deux dates de la plage sont disponibles dans rangeBoundaryDates
					const startDate = formatDate(rangeBoundaryDates.value[0], props.format)
					const endDate = formatDate(rangeBoundaryDates.value[1], props.format)

					// Formater l'affichage de la plage
					formattedValue = `${startDate} - ${endDate}`
					displayFormattedDate.value = formattedValue
					textInputValue.value = formattedValue

					// Mettre à jour le modèle avec les dates formatées
					const formattedDates = [
						formatDate(rangeBoundaryDates.value[0], props.dateFormatReturn || props.format),
						formatDate(rangeBoundaryDates.value[1], props.dateFormatReturn || props.format),
					] as [string, string]

					updateModel(formattedDates)
					emit('date-selected', formattedDates)

					// Les deux dates de la plage sont sélectionnées, fermer le CalendarMode
					isDatePickerVisible.value = false
					emit('closed')
				}
				// Fallback sur selectedDates si rangeBoundaryDates n'est pas complet
				else if (Array.isArray(selectedDates.value) && selectedDates.value.length >= 2) {
					// Émettre l'événement date-selected avec les dates formatées
					const formattedDates = [
						formatDate(selectedDates.value[0], props.format),
						formatDate(selectedDates.value[selectedDates.value.length - 1], props.format),
					] as [string, string]

					formattedValue = `${formattedDates[0]} - ${formattedDates[1]}`
					displayFormattedDate.value = formattedValue
					textInputValue.value = formattedValue

					// Mettre à jour le modèle avec les dates formatées
					updateModel(formattedDates)
					emit('date-selected', formattedDates)

					// Les deux dates de la plage sont sélectionnées, fermer le CalendarMode
					isDatePickerVisible.value = false
					emit('closed')
				}
				else {
					// Utiliser la valeur calculée par le computed si disponible
					formattedValue = displayFormattedDateComputed.value || ''
					displayFormattedDate.value = formattedValue
					textInputValue.value = formattedValue
				}
			}
			else {
				// En mode date unique
				formattedValue = displayFormattedDateComputed.value || ''
				displayFormattedDate.value = formattedValue
				textInputValue.value = formattedValue

				// En mode date unique, fermer le CalendarMode après sélection
				isDatePickerVisible.value = false
				emit('closed')
				emit('date-selected', formattedDate.value)
			}

			// Valider les dates après mise à jour
			validateDates()
		}, 0) // setTimeout avec délai de 0ms pour s'exécuter après le cycle de rendu actuel
	}

	// Les variables useDateSelection sont maintenant déclarées et initialisées plus haut dans le code

	// Fonction pour émettre l'événement blur (utilisée pour les tests)
	const emitBlurEvent = () => {
		emit('blur')
	}

	// Utilisation du composable pour les jours fériés
	const { getJoursFeries } = useHolidayDay()

	// Fonction pour marquer les jours fériés dans le calendrier
	const markHolidayDays = () => {
		// Si l'affichage des jours fériés est désactivé, ne rien faire
		if (!props.displayHolidayDays) return

		// Attendre que le DOM soit mis à jour
		nextTick(() => {
			// Récupérer l'année et le mois courants
			const year = parseInt(currentYear.value || new Date().getFullYear().toString(), 10)
			// Utiliser currentMonth.value !== null pour vérifier si la valeur est définie, même si c'est 0
			const month = parseInt(currentMonth.value !== null ? currentMonth.value : new Date().getMonth().toString(), 10)

			// Récupérer les jours fériés pour cette année
			const joursFeries = getJoursFeries(year)
			// Convertir les jours fériés en objets Date
			const holidayDates = Array.from(joursFeries).map((dateStr) => {
				const [day, monthStr, yearStr] = dateStr.split('/')
				return new Date(parseInt(yearStr), parseInt(monthStr) - 1, parseInt(day))
			})

			// Filtrer les jours fériés pour le mois courant
			const monthHolidays = holidayDates.filter((holiday) => {
				return holiday.getMonth() === month && holiday.getFullYear() === year
			})

			// Pour chaque jour férié, trouver l'élément DOM correspondant et ajouter la classe
			monthHolidays.forEach((holiday) => {
				const day = holiday.getDate()
				const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
				const dayElements = document.querySelectorAll(`[data-v-date="${dateStr}"]`)
				dayElements.forEach((element) => {
					element.classList.add('holiday-day')
				})
			})
		})
	}

	onMounted(() => {
		document.addEventListener('click', handleClickOutside)

		// Initialiser l'affichage formaté
		if (displayFormattedDateComputed.value) {
			displayFormattedDate.value = displayFormattedDateComputed.value
		}

		// Valider les dates au montage
		validateDates()

		// Configurer l'observateur pour le bouton du mois
		setupMonthButtonObserver()
	})

	onBeforeUnmount(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	const dateTextInputRef = ref<null | ComponentPublicInstance<typeof DateTextInput>>()
	const dateCalendarTextInputRef = ref<null | ComponentPublicInstance<typeof SyTextField>>()

	// Initialiser le composable useInputHandler pour gérer la saisie des dates
	const inputHandler = useInputHandler({
		format: props.format,
		displayRange: props.displayRange,
		dateFormatReturn: props.dateFormatReturn,
		disableErrorHandling: props.disableErrorHandling,
		parseDate,
		formatDate,
		generateDateRange: dateSelectionResult.generateDateRange,
		isDateComplete: isDateComplete.value,
		displayFormattedDate,
		selectedDates,
		isFormatting,
		isManualInputActive,
		isUpdatingFromInternal,
		clearValidation,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- validation rules
		validateField: (value, rules, warningRules) => validateField(value, rules as any[], warningRules as any[]),
		updateModel: value => updateModel(value as DateValue),
		emitInput: value => emit('input', value),
		inputRef: dateCalendarTextInputRef as Ref<ComponentPublicInstance | null>,
	})

	/**
	 * Gère l'entrée utilisateur dans le champ de saisie de date
	 * Adapté pour fonctionner avec DateTextInput qui émet une valeur string au lieu d'un Event
	 */
	const handleInput = (eventOrValue: Event | string) => {
		// Si c'est un événement standard, utiliser directement
		if (eventOrValue instanceof Event) {
			inputHandler.handleInput(eventOrValue)
			return
		}

		// Si c'est une valeur string (venant du DateTextInput)
		const inputElement = dateCalendarTextInputRef.value?.$el?.querySelector?.('input')
		if (!inputElement) return

		// Mettre à jour la valeur du modèle directement
		textInputValue.value = eventOrValue

		// Traitement spécifique pour les plages de dates
		if (props.displayRange && typeof eventOrValue === 'string') {
			// Vérifier si la plage est complète (contient un séparateur et deux dates)
			if (eventOrValue.includes(' - ')) {
				const parts = eventOrValue.split(' - ')
				const startDateStr = parts[0]?.trim() || ''
				const endDateStr = parts[1]?.trim() || ''

				// Si les deux dates sont présentes et valides, mettre à jour le modèle
				if (startDateStr && endDateStr && !endDateStr.includes('_')) {
					// Convertir les dates en objets Date
					const startDate = parseDate(startDateStr, props.format)
					const endDate = parseDate(endDateStr, props.format)

					if (startDate && endDate) {
						// Mettre à jour les dates sélectionnées
						selectedDates.value = [startDate, endDate]
						// Valider la plage de dates
						validateDates()
					}
				}
			}
		}
		else {
			// Pour une date unique
			validateDates()
		}
	}
	const datePickerRef = ref<null | ComponentPublicInstance<typeof VDatePicker>>()

	// Utilisation du composable pour personnaliser les boutons du mois et de l'année
	const { customizeMonthButton, setupMonthButtonObserver } = useMonthButtonCustomization(
		() => isDatePickerVisible.value,
		currentMonthName,
		currentYearName,
	)

	// Utilisation du composable pour gérer le mode d'affichage du CalendarMode
	const { currentViewMode, handleViewModeUpdate, handleYearUpdate, handleMonthUpdate, resetViewMode } = useDatePickerViewMode(
		// Fonction qui retourne la valeur actuelle de isBirthDate (combinaison de isBirthDate et birthDate)
		() => props.isBirthDate || props.birthDate,
	)

	// La fonction isDateComplete est maintenant importée du composable useDateFormatValidation

	// Fonction pour valider la saisie manuelle, similaire à validateRules dans DateTextInput
	const { validateManualInput } = useManualDateValidation({
		format: props.format,
		required: props.required,
		disableErrorHandling: props.disableErrorHandling,
		customRules: props.customRules,
		customWarningRules: props.customWarningRules,
		hasInteracted,
		errors,
		clearValidation,
		validateDateFormat,
		isDateComplete: isDateComplete.value,
		parseDate,
		validateField,
	})

	const { handleInputBlur } = useInputBlurHandler({
		format: props.format,
		dateFormatReturn: props.dateFormatReturn,
		required: props.required,
		displayFormattedDate,
		hasInteracted,
		isManualInputActive,
		isUpdatingFromInternal,
		selectedDates,
		errors,
		validateDateFormat,
		parseDate,
		formatDate,
		updateModel,
		validateManualInput,
		emitBlur: emitBlurEvent,
	})

	watch(isDatePickerVisible, async (isVisible) => {
		if (!isVisible && props.isBirthDate) {
			// Réinitialiser le mode d'affichage au type birthdate
			resetViewMode()
		}

		if (isVisible) {
			// Personnaliser le bouton du mois
			customizeMonthButton()

			// Marquer les jours fériés lorsque le calendrier devient visible
			if (props.displayHolidayDays) {
				markHolidayDays()
			}

			// set the focus on the date picker
			await nextTick()
			const firstButton = datePickerRef.value?.$el?.querySelector?.('button')
			if (firstButton) {
				firstButton.focus({ preventScroll: true })
			}
		}
		else {
			// set the focus on the text input
			// wait for VMenu to finish DOM updates & transition
			setTimeout(() => {
				requestAnimationFrame(() => {
					const inputElement = dateCalendarTextInputRef.value?.$el?.querySelector?.('input')
					if (inputElement) {
						inputElement.focus({ preventScroll: true })
						isDatePickerVisible.value = false
					}
				})
			}, 0)
		}
	})

	// Utilisation du composable useIconState pour déterminer l'icône à afficher
	const { getIcon } = useIconState({
		noCalendar: props.noCalendar,
		disableErrorHandling: props.disableErrorHandling,
		errorMessages,
		warningMessages,
		successMessages,
	})

	const syncFromModelValue = (newValue: DateInput | undefined) => {
		if (!newValue || newValue === '') {
			selectedDates.value = null
			textInputValue.value = ''
			displayFormattedDate.value = ''
			validateDates()
			return
		}

		selectedDates.value = initializeSelectedDates(newValue, props.format, props.dateFormatReturn)

		if (selectedDates.value) {
			const firstDate = Array.isArray(selectedDates.value)
				? selectedDates.value[0]
				: selectedDates.value

			textInputValue.value = formatDate(firstDate, props.format)
			displayFormattedDate.value = displayFormattedDateComputed.value || ''
		}

		validateDates()
	}

	watch(() => props.modelValue, (newValue) => {
		if (isUpdatingFromInternal.value) {
			if (props.displayRange) {
				if (Array.isArray(newValue) && newValue.length >= 2) {
					isDatePickerVisible.value = false
					emit('closed')
				}
			}
			else {
				isDatePickerVisible.value = false
				emit('closed')
			}
			return
		}

		try {
			isUpdatingFromInternal.value = true
			syncFromModelValue(newValue)
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}, { immediate: true })

	const {
		toggleDatePicker,
		openDatePicker,
		openDatePickerOnClick,
		openDatePickerOnFocus,
		openDatePickerOnIconClick,
		handleClickOutside,
		handleKeyboardNavigation,
	} = useDatePickerVisibility({
		disabled: props.disabled,
		readonly: props.readonly,
		textFieldActivator: props.textFieldActivator,
		isDatePickerVisible,
		isManualInputActive,
		hasInteracted,
		updateAccessibility,
		validateDates,
		emitClosed: () => emit('closed'),
		emitFocus: () => emit('focus'),
	})

	// Fonctions pour la gestion de la saisie manuelle
	const formatDateInput = (input: string, cursorPosition?: number): { formatted: string, cursorPos: number } => {
		// Conserver uniquement les chiffres de l'entrée
		const cleanedInput = input.replace(/[^\d]/g, '')

		// Déterminer le séparateur utilisé dans le format
		const separator = props.format.match(/[^DMY]/)?.[0] || '/'

		// Calculer la position du curseur dans l'entrée nettoyée (sans séparateurs)
		// Pour cela, on compte combien de chiffres il y a avant la position du curseur
		const inputBeforeCursor = input.substring(0, cursorPosition || 0)
		const digitsBeforeCursor = inputBeforeCursor.replace(/[^\d]/g, '').length

		// Construire la chaîne formatée
		let result = ''
		let digitIndex = 0

		// Parcourir le format pour placer les chiffres et séparateurs
		for (let i = 0; i < props.format.length && digitIndex < cleanedInput.length; i++) {
			const formatChar = props.format[i].toUpperCase()

			if (['D', 'M', 'Y'].includes(formatChar)) {
				// Ajouter un chiffre
				result += cleanedInput[digitIndex]
				digitIndex++
			}
			else {
				// Ajouter un séparateur
				result += separator
			}
		}

		// Calculer la nouvelle position du curseur
		// Nombre de chiffres avant le curseur + nombre de séparateurs avant ces chiffres
		let newCursorPos = digitsBeforeCursor

		// Ajouter les séparateurs qui apparaissent avant la position du curseur
		for (let i = 0, digitCount = 0; i < props.format.length && digitCount < digitsBeforeCursor; i++) {
			if (!['D', 'M', 'Y'].includes(props.format[i].toUpperCase())) {
				newCursorPos++
			}
			else {
				digitCount++
			}
		}

		return {
			formatted: result,
			cursorPos: Math.min(newCursorPos, result.length),
		}
	}

	const handleKeydown = (event: KeyboardEvent & { target: HTMLInputElement }) => {
		// Déléguer la gestion de l'ouverture du calendrier au composable
		if (!props.noCalendar && handleKeyboardNavigation(event)) {
			return
		}

		// Gérer la suppression des séparateurs
		if (event.key === 'Backspace') {
			const input = event.target
			if (!input.selectionStart || input.selectionStart !== input.selectionEnd) {
				return
			}

			const cursorPos = input.selectionStart
			const charBeforeCursor = input.value[cursorPos - 1]

			if (!/\d/.test(charBeforeCursor)) {
				// Si le caractère avant le curseur n'est pas un chiffre, on le supprime aussi
				// et on supprime le chiffre avant le séparateur
				event.preventDefault() // Empêcher le comportement par défaut

				const newValue = input.value.substring(0, cursorPos - 2)
					+ input.value.substring(cursorPos)

				// Mettre à jour la valeur
				displayFormattedDate.value = newValue

				// Positionner le curseur après un court délai
				setTimeout(() => {
					const newCursorPos = cursorPos - 2
					input.setSelectionRange(newCursorPos, newCursorPos)
				}, 0)
			}
		}

		// Gérer les touches de direction pour éviter de se retrouver entre un séparateur et un chiffre
		if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			const input = event.target
			const cursorPos = input.selectionStart || 0

			// Déterminer le séparateur utilisé dans le format
			const separator = props.format.match(/[^DMY]/)?.[0] || '/'

			if (event.key === 'ArrowLeft' && cursorPos > 0) {
				const charBeforeCursor = input.value[cursorPos - 1]

				if (charBeforeCursor === separator) {
					// Si on se déplace à gauche et qu'on rencontre un séparateur, sauter par-dessus
					event.preventDefault()
					input.setSelectionRange(cursorPos - 2, cursorPos - 2)
				}
			}
			else if (event.key === 'ArrowRight' && cursorPos < input.value.length) {
				const charAtCursor = input.value[cursorPos]

				if (charAtCursor === separator) {
					// Si on se déplace à droite et qu'on rencontre un séparateur, sauter par-dessus
					event.preventDefault()
					input.setSelectionRange(cursorPos + 2, cursorPos + 2)
				}
			}
		}
	}

	// Variable pour l'accessibilité
	const accessibilityDescription = ref(DATE_PICKER_MESSAGES.ARIA_DATE_INPUT)

	// Fonction pour créer une description accessible de la date pour les lecteurs d'écran
	const getDateDescription = (dateStr: string, format: string): string => {
		// Si la chaîne est vide, retourner un message simple
		if (!dateStr || !dateStr.trim()) {
			return 'Aucune date saisie'
		}

		// Déterminer le séparateur utilisé dans le format
		const separator = format.match(/[^DMY]/)?.[0] || '/'

		// Extraire les parties de la date
		const dateParts = dateStr.split(separator)
		const formatParts = format.split(separator)

		// Créer une description en fonction du format
		let description = 'Date en cours de saisie: '

		for (let i = 0; i < formatParts.length; i++) {
			if (i >= dateParts.length) break

			const part = dateParts[i].trim()
			const formatPart = formatParts[i].charAt(0).toUpperCase()

			// Ignorer les parties vides ou contenant uniquement des placeholders
			if (!part || part.replace(/_/g, '').length === 0) {
				continue
			}

			switch (formatPart) {
			case 'D':
				description += `jour ${part}, `
				break
			case 'M':
				description += `mois ${part}, `
				break
			case 'Y':
				description += `année ${part}, `
				break
			}
		}

		// Supprimer la virgule finale si elle existe
		return description.endsWith(', ')
			? description.slice(0, -2)
			: description
	}

	// Mettre à jour la description accessible lorsque la valeur affichée change
	watch(displayFormattedDate, (newValue) => {
		if (newValue && typeof newValue === 'string') {
			// Créer une version accessible pour les lecteurs d'écran (sans les caractères de placeholder)
			const accessibleValue = newValue.replace(/_/g, ' ')

			// Créer un message descriptif pour le lecteur d'écran
			accessibilityDescription.value = getDateDescription(accessibleValue, props.format)
		}
		else {
			accessibilityDescription.value = 'Aucune date saisie'
		}
	})

	const { todayInString, selectToday, headerDate } = useTodayButton(props)
	const { labelWithAsterisk } = useAsteriskDisplay(props)

	// Utilisation du composable pour l'affichage formaté des dates
	const { displayedDateString } = useDisplayedDateString({
		selectedDates,
		rangeBoundaryDates,
		todayInString,
	})

	// Wrapper pour la fonction selectToday du composable
	const handleSelectToday = () => {
		selectToday(selectedDates)

		// Mettre à jour le mois et l'année courants après avoir sélectionné aujourd'hui
		const today = new Date()
		const todayMonth = today.getMonth().toString()
		const todayYear = today.getFullYear().toString()

		// Mettre à jour les variables pour que le mois et l'année affichés soient corrects à la réouverture
		currentMonth.value = todayMonth
		currentYear.value = todayYear
		currentMonthName.value = dayjs().month(parseInt(todayMonth, 10)).format('MMMM')
		currentYearName.value = todayYear
	}

	// Redéfinition de validateOnSubmit pour propager aux composants enfants
	const validateOnSubmit = (): boolean => {
		if (props.noCalendar) {
			// En mode noCalendar, déléguer au DateTextInput
			return dateTextInputRef.value?.validateOnSubmit() || false
		}
		else {
			// En mode combiné, déléguer au DateTextInput du calendrier
			const textInputValid = dateCalendarTextInputRef.value?.validateOnSubmit() || false

			// Également vérifier avec useDateValidation
			validateDates(true)

			return textInputValid && errors.value.length === 0
		}
	}

	defineExpose({
		validateOnSubmit,
		isDatePickerVisible,
		selectedDates,
		errorMessages,
		handleClickOutside,
		initializeSelectedDates,
		handleSelectToday,
		updateAccessibility,
		openDatePicker,
		updateDisplayFormattedDate,
		currentMonth, // Exposer le mois actuellement affiché
		currentMonthName, // Exposer le nom du mois actuellement affiché
		toggleDatePicker,
		validateField,
		clearValidation,
		validateDates,
		formatDateInput,
		emitBlur: emitBlurEvent,
		validateDateFormat,
		displayFormattedDate,
	})
</script>

<template>
	<div
		class="date-picker-container"
	>
		<!-- Variable pour stocker la description accessible -->
		<span
			v-if="false"
			ref="accessibilityDescriptionRef"
		>
			{{ accessibilityDescription }}
		</span>
		<template v-if="props.noCalendar">
			<DateTextInput
				ref="dateTextInputRef"
				v-model="textInputValue"
				:class="[getMessageClasses(), 'label-hidden-on-focus']"
				:date-format-return="props.dateFormatReturn"
				:format="props.format"
				:label="labelWithAsterisk || ''"
				:placeholder="props.placeholder"
				:required="props.required"
				:custom-rules="props.customRules"
				:custom-warning-rules="props.customWarningRules"
				:disabled="props.disabled"
				:readonly="props.readonly"
				:is-outlined="props.isOutlined"
				:display-icon="props.displayIcon"
				:display-append-icon="props.displayAppendIcon"
				:display-prepend-icon="props.displayPrependIcon"
				:no-icon="props.noIcon"
				:disable-error-handling="props.disableErrorHandling"
				:show-success-messages="props.showSuccessMessages"
				:bg-color="props.bgColor"
				:auto-clamp="props.autoClamp"
				:display-asterisk="props.displayAsterisk"
				:is-validate-on-blur="props.isValidateOnBlur"
				title="Date text input"
				@focus="emit('focus')"
				@blur="emit('blur')"
			/>
		</template>
		<template v-else>
			<VMenu
				v-if="!props.noCalendar"
				v-model="isDatePickerVisible"
				activator="parent"
				:min-width="0"
				location="bottom"
				:close-on-content-click="false"
				:open-on-click="false"
				scroll-strategy="none"
				transition="fade-transition"
				:offset="[0, 10]"
			>
				<template #activator="{ props: menuProps }">
					<DateTextInput
						v-bind="menuProps"
						ref="dateCalendarTextInputRef"
						v-model="textInputValue"
						:label="labelWithAsterisk || ''"
						:placeholder="props.placeholder"
						:format="props.format"
						:date-format-return="props.dateFormatReturn"
						:required="props.required"
						:disabled="props.disabled"
						:readonly="props.readonly"
						:is-outlined="props.isOutlined"
						:display-icon="props.displayIcon"
						:display-append-icon="props.displayAppendIcon"
						:display-prepend-icon="props.displayPrependIcon"
						:no-icon="props.noIcon"
						:custom-rules="props.customRules"
						:custom-warning-rules="props.customWarningRules"
						:display-asterisk="props.displayAsterisk"
						:disable-error-handling="props.disableErrorHandling"
						:show-success-messages="props.showSuccessMessages"
						:bg-color="props.bgColor"
						:display-range="props.displayRange"
						:display-persistent-placeholder="true"
						:is-validate-on-blur="props.isValidateOnBlur"
						:class="[getMessageClasses(), 'label-hidden-on-focus']"
						:append-inner-icon="getIcon"
						:auto-clamp="props.autoClamp"
						@click="openDatePickerOnClick"
						@focus="openDatePickerOnFocus"
						@blur="handleInputBlur"
						@input="handleInput"
						@keydown="handleKeydown"
						@date-selected="handleDateSelected"
						@prepend-icon-click="openDatePickerOnIconClick"
						@append-icon-click="openDatePickerOnIconClick"
					/>
				</template>
				<VDatePicker
					v-if="isDatePickerVisible && !props.noCalendar"
					ref="datePickerRef"
					v-model="selectedDates"
					color="primary"
					:class="props.displayWeekendDays ? 'weekend' : ''"
					:first-day-of-week="1"
					:multiple="props.displayRange ? 'range' : false"
					:show-adjacent-months="true"
					:show-week="props.showWeekNumber"
					:view-mode="currentViewMode"
					:max="maxDate"
					:min="minDate"
					:custom-rules="props.customRules"
					:custom-warning-rules="props.customWarningRules"
					:display-holiday-days="props.displayHolidayDays"
					:display-asterisk="props.displayAsterisk"
					:is-validate-on-blur="props.isValidateOnBlur"
					@update:model-value="updateDisplayFormattedDate"
					@update:view-mode="handleViewModeUpdate"
					@update:month="onUpdateMonth"
					@update:year="onUpdateYear"
					@click:date="updateSelectedDates"
					@focus="props.displayHolidayDays ? markHolidayDays : undefined"
					@update:month-year="props.displayHolidayDays ? markHolidayDays : undefined"
				>
					<template #title>
						Sélectionnez une date
					</template>
					<template #header>
						<h3 class="mx-auto my-auto ml-5 mb-4">
							{{ selectedDates ? displayedDateString : headerDate }}
						</h3>
					</template>
					<template
						v-if="props.displayTodayButton"
						#actions
					>
						<div class="d-flex justify-center align-center w-100">
							<v-btn
								v-if="props.displayTodayButton"
								size="x-small"
								color="primary"
								:title="DATE_PICKER_MESSAGES.BUTTON_TODAY"
								class="my-2 pa-2 mt-2"
								:ripple="false"
								@click="handleSelectToday"
							>
								<VIcon
									class="mr-1"
								>
									{{ mdiCalendar }}
								</VIcon>
								{{ DATE_PICKER_MESSAGES.BUTTON_TODAY }}
							</v-btn>
						</div>
					</template>
				</VDatePicker>
			</VMenu>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@use '@/assets/tokens';

/* Disable ripple effect on month and year buttons */
:deep(.v-date-picker-controls__month-btn),
:deep(.v-date-picker-controls__mode-btn) {
	.v-ripple__container,
	.v-ripple__animation {
		display: none !important;
		opacity: 0 !important;
		background-color: transparent !important;
		pointer-events: none !important;
	}
}

/* Style pour les jours fériés */
:deep(.holiday-day) {
	background-color: rgb(255 193 7 / 10%);
	border: 2px dotted tokens.$neutral-black;
	border-radius: 50%;
}

:deep(.v-date-picker-controls .v-btn:last-child) {
	margin-inline-start: 0;
}

.label-hidden-on-focus:focus + label {
	display: none;
}

.dp-width {
	width: v-bind('props.width');
}

.v-messages__message--success {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-success !important;

		--v-medium-emphasis-opacity: 1;
	}

	.v-field--active & {
		color: tokens.$colors-border-success !important;
	}
}

.v-messages__message--error {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: tokens.$colors-text-error !important;
	}

	.v-field--active & {
		color: tokens.$colors-border-error !important;
	}
}

.v-messages__message--warning {
	:deep(.v-input__control) {
		color: tokens.$colors-text-warning !important;

		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-messages__message) {
		color: tokens.$colors-text-warning !important;
	}

	.v-field--active & {
		color: tokens.$colors-text-warning !important;
	}
}

:deep(.v-btn__content) {
	font-size: tokens.$font-size-body-text + 3;
	font-weight: bold;
}

:deep(.v-messages) {
	opacity: 1;
}

:deep(.v-field--dirty) {
	opacity: 1 !important;

	--v-medium-emphasis-opacity: 1;
}

:deep(.v-field--focused) {
	opacity: 1 !important;

	--v-medium-emphasis-opacity: 1;
}

.date-picker-container {
	width: 100%;
	position: relative;

	:deep(.v-date-picker) {
		max-width: 445px;
		position: absolute;
		top: 56px;
		left: 0;
		z-index: 2;
		box-shadow:
			0 5px 5px -3px rgb(0 0 0 / 20%),
			0 8px 10px 1px rgb(0 0 0 / 14%),
			0 3px 14px 2px rgb(0 0 0 / 12%) !important;
	}
}

:deep(.v-date-picker-month__day--selected, .v-date-picker-month__day--adjacent) {
	opacity: 1;
}

:deep(.weekend .v-date-picker-month__day--week-end .v-btn) {
	background-color: #afb1b1;
}

/* div avant la class .v-date-picker-month__day--week-end */
:deep(.weekend .v-date-picker-month__day:has(+ .v-date-picker-month__day--week-end) .v-btn) {
	background-color: #afb1b1;
}

:deep(.v-date-picker-controls__mode-btn) {
	transform: none !important;
}

:deep(.v-btn--variant-text .v-btn__overlay) {
	padding: 13px;
}
</style>

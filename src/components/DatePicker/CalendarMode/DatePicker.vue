<script lang="ts" setup>
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import { useDateInitialization, type DateInput, type DateModelValue } from '@/composables/date/useDateInitializationDayjs'
	import { useDatePickerAccessibility } from '@/composables/date/useDatePickerAccessibility'
	import { mdiCalendarMonthOutline } from '@mdi/js'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import { computed, nextTick, onBeforeUnmount, onMounted, readonly as readonlyState, ref, useId, watch, type ComponentPublicInstance, type Ref } from 'vue'
	import { VDatePicker } from 'vuetify/components'
	import SyTextField from '../../Customs/SyTextField/SyTextField.vue'
	import ComplexDatePicker from '../ComplexDatePicker/ComplexDatePicker.vue'
	import { buildTodaySelectionState, useCalendarKeyboardNavigation, useDatePickerCalendar, useDatePickerDerivedValues, useDatePickerFocusTrap, useDatePickerState, useDatePickerSyncGuard, useDatePickerValidation, useDatePickerViewMode, useDateSelection, useDisplayedDateString, useHolidayHighlighting, useMonthButtonCustomization, useSelectedDayAria, useTodayButton } from '../composables'
	import DateTextInput from '../DateTextInput/DateTextInput.vue'
	import { locales } from '../locales'
	import type { CalendarModeProps, DateObjectValue } from '../types'
	import { DatePickerCommonDefaults } from '../types'
	import { formatDateRangeDisplay, getDisplayedMonthYearState, resolveDatePickerStateFromModelValue } from '../utils/dateFormattingUtils'
	import { isModelValueEqual } from '../utils/validationUtils'
	import { buildCalendarModeComplexDatePickerProps } from './props/buildCalendarModeComplexDatePickerProps'
	import { buildCalendarModeDateTextInputProps } from './props/buildCalendarModeDateTextInputProps'
	import { buildCalendarModeActivatorTextFieldProps } from './props/buildCalendarModeActivatorTextFieldProps'

	// Initialiser les plugins dayjs
	dayjs.extend(customParseFormat)

	const { parseDate, formatDate } = useDateFormat()
	const { initializeSelectedDates } = useDateInitialization()
	const { updateAccessibility, cleanupGridSemantics } = useDatePickerAccessibility()

	// Variables pour suivre le mois et l'année actuellement affichés dans le CalendarMode
	const currentMonth = ref<string | null>(null)
	const currentYear = ref<string | null>(null)
	const currentMonthName = ref<string | null>(null)
	const currentYearName = ref<string | null>(null)

	const props = withDefaults(defineProps<CalendarModeProps>(), {
		...DatePickerCommonDefaults,
		useCombinedMode: false,
	})

	// Guard centralisé pour disabled/readonly
	const isInteractionDisabled = computed(() => props.disabled || props.readonly)

	// Helpers pour le focus sur l'input calendrier
	const getCalendarInputElement = () =>
		dateCalendarTextInputRef.value?.$el?.querySelector?.('input') as HTMLInputElement | null

	const focusCalendarInput = () => {
		getCalendarInputElement()?.focus({ preventScroll: true })
	}

	// Utilisation des composables pour les fonctionnalités du CalendarMode
	const displayWeekendDays = computed(() => props.displayWeekendDays ?? true)
	const { todayInString, headerDate } = useTodayButton(props)
	const todayButtonLabel = computed(() => {
		return locales.selectTodayCapitalized(todayInString.value?.trim())
	})

	// Inlined from useAsteriskDisplay
	const isShouldDisplayAsterisk = computed(() => props.displayAsterisk && props.required)
	const labelWithAsterisk = computed(() => {
		const label = props.label
		return isShouldDisplayAsterisk.value && label
			? `${label} *`
			: label
	})

	// Props du champ texte utilisé dans le flux noCalendar
	const noCalendarTextInputProps = computed(() => buildCalendarModeDateTextInputProps(
		props,
		labelWithAsterisk,
		errorMessages,
		warningMessages,
		successMessages,
	))

	// Props du ComplexDatePicker utilisé dans le flux combinedMode
	const combinedModeDatePickerProps = computed(() => buildCalendarModeComplexDatePickerProps(props))

	// Props du champ activateur utilisé quand le calendrier s'ouvre dans le menu
	const menuActivatorTextFieldProps = computed(() => buildCalendarModeActivatorTextFieldProps(
		props,
		labelWithAsterisk,
		errorMessages,
		warningMessages,
		successMessages,
		hasError,
		hasWarning,
		isOnSuccess,
	))

	const selectedDates = ref<Date | (Date | null)[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null, props.format, props.dateFormatReturn),
	)

	// Utiliser useDatePickerDerivedValues pour centraliser les computed partagés
	const { minDate, maxDate } = useDatePickerDerivedValues(props)

	const onblur = ref(false)

	const dateTextInputRef = ref<null | ComponentPublicInstance<typeof DateTextInput>>()
	const dateCalendarTextInputRef = ref<null | ComponentPublicInstance<typeof SyTextField>>()
	const datePickerRef = ref<ComponentPublicInstance | null>(null)
	const complexDatePickerRef = ref<null | ComponentPublicInstance<typeof ComplexDatePicker>>()
	const datePickerContentId = `date-picker-${useId()}`

	const datePickerDialogRef = ref<HTMLElement | null>(null)
	const datePickerDialogId = `${datePickerContentId}-dialog`
	const datePickerTitleId = `${datePickerContentId}-title`
	const datePickerHeadingId = `${datePickerContentId}-heading`

	const isDatePickerVisible = ref(false)
	const { handleMenuKeydown } = useDatePickerFocusTrap({
		isDatePickerVisible,
		datePickerRef,
		onClose: () => closeDatePicker(),
		restoreFocus: () => queueMicrotask(() => focusCalendarInput()),
		getInitialFocusDate: () => {
			const value = keyboardNavigatedDate.value
				?? (Array.isArray(selectedDates.value) ? selectedDates.value[0] ?? null : selectedDates.value)
			const selected = value
			return selected ?? new Date()
		},
	})

	const addDatePickerKeydownListener = async () => {
		await nextTick()

		const dialogEl = datePickerDialogRef.value
		if (!dialogEl) return

		dialogEl.removeEventListener('keydown', handleMenuKeydown, true)
		dialogEl.addEventListener('keydown', handleMenuKeydown, true)
	}

	const removeDatePickerKeydownListener = () => {
		datePickerDialogRef.value?.removeEventListener(
			'keydown',
			handleMenuKeydown,
			true,
		)
	}

	watch(
		() => isDatePickerVisible.value,
		async (visible) => {
			if (visible && !props.noCalendar) {
				await addDatePickerKeydownListener()
				return
			}

			removeDatePickerKeydownListener()
		},
		{ flush: 'post' },
	)

	onBeforeUnmount(() => {
		removeDatePickerKeydownListener()
	})

	// Utiliser le calendarKeyboardNavigation normalement
	const { focusInitialDay } = useCalendarKeyboardNavigation({
		isDatePickerVisible,
		datePickerRef,
		getInitialFocusDate: () => {
			const selected = keyboardNavigatedDate.value
				?? (Array.isArray(selectedDates.value) ? selectedDates.value[0] ?? null : selectedDates.value)
			const target = selected ?? new Date()

			// Si la date cible est dans le mois affiché, l'utiliser
			if (currentMonth.value !== null && currentYear.value !== null) {
				const sameMonth = target.getMonth() === Number(currentMonth.value)
				const sameYear = target.getFullYear() === Number(currentYear.value)
				if (sameMonth && sameYear) {
					return target
				}
			}

			// Fallback: 1er du mois actuellement affiché
			if (currentMonth.value !== null && currentYear.value !== null) {
				return new Date(Number(currentYear.value), Number(currentMonth.value), 1)
			}

			return target
		},
		getCurrentDate: () => {
			const value = keyboardNavigatedDate.value
				?? (Array.isArray(selectedDates.value) ? selectedDates.value[0] ?? null : selectedDates.value)
			if (value) {
				const date = value
				// Vérifier si la date sélectionnée est dans le mois actuellement affiché
				if (date && currentMonth.value !== null && currentYear.value !== null) {
					const sameMonth = date.getMonth() === Number(currentMonth.value)
					const sameYear = date.getFullYear() === Number(currentYear.value)
					if (sameMonth && sameYear) {
						return date
					}
				}
			}

			// Fallback: retourner le 1er du mois actuellement affiché
			if (currentMonth.value !== null && currentYear.value !== null) {
				return new Date(Number(currentYear.value), Number(currentMonth.value), 1)
			}

			return null
		},
		setCurrentDate: (date: Date) => {
			keyboardNavigatedDate.value = date
			syncDisplayedMonthYearFromDate(date)

			// S'assurer que le VDatePicker affiche le bon mois après navigation clavier
			nextTick(() => {
				syncDisplayedMonthYearFromDate(date)
			})
		},
		onSelectDate: (date: Date) => {
			keyboardNavigatedDate.value = null
			updateSelectedDates(date)

			const isCompletedRangeSelection = !props.displayRange
				|| Boolean(rangeBoundaryDates.value?.[0] && rangeBoundaryDates.value?.[1])

			if (isCompletedRangeSelection) {
				nextTick(() => closeDatePicker())
			}
		},
	})

	// Fonction pour sélectionner la date du jour
	const handleSelectToday = () => {
		const todaySelection = buildTodaySelectionState({
			displayRange: props.displayRange,
			format: props.format,
			dateFormatReturn: props.dateFormatReturn,
			formatDate,
		})

		selectedDates.value = todaySelection.selectedDates
		updateModel(todaySelection.modelValue)
		displayFormattedDate.value = todaySelection.displayValue

		currentMonth.value = todaySelection.month
		currentYear.value = todaySelection.year
		currentMonthName.value = todaySelection.monthName
		currentYearName.value = todaySelection.yearName
	}

	const emit = defineEmits<{
		(e: 'update:modelValue', value: DateModelValue): void
		(e: 'closed'): void
		(e: 'focus'): void
		(e: 'blur'): void
		(e: 'input', value: DateModelValue): void
		(e: 'date-selected', value: DateModelValue): void
	}>()

	// Variable pour éviter les mises à jour récursives
	const { isUpdatingFromInternal, withInternalUpdate } = useDatePickerSyncGuard()
	const fieldKey = ref(0)
	const keyboardNavigatedDate = ref<Date | null>(null)
	const preventCloseOnKeyboardNavigation = ref(false)
	const isInitialValidation = ref(true)

	const {
		clearValidation,
		validateDates,
		validateCalendarModeDates,
		errors,
		warnings,
		successes,
		hasError,
		hasWarning,
		hasSuccess,
		errorMessages,
		warningMessages,
		successMessages,
	} = useDatePickerValidation({
		showSuccessMessages: computed(() => props.showSuccessMessages),
		disableErrorHandling: computed(() => props.disableErrorHandling),
		noCalendar: computed(() => props.noCalendar),
		required: computed(() => props.required),
		displayRange: computed(() => props.displayRange),
		customRules: computed(() => props.customRules),
		customSuccessRules: computed(() => props.customSuccessRules ?? []),
		customWarningRules: computed(() => props.customWarningRules),
		useVuetifyValidation: computed(() => props.useVuetifyValidation ?? false),
		rules: computed(() => props.rules),
		errorMessages: computed(() => props.errorMessages ?? null),
		hasErrorProp: computed(() => props.hasError),
		hasSuccessProp: computed(() => props.hasSuccess),
		hasWarningProp: computed(() => props.hasWarning),
		warningMessages: computed(() => props.warningMessages ?? null),
		successMessages: computed(() => props.successMessages ?? null),
		maxErrors: computed(() => props.maxErrors),
		selectedDates: selectedDates as Ref<DateObjectValue>,
		isUpdatingFromInternal,
		readonly: computed(() => props.readonly),
		skipValidationWhenReadonly: true,
		useCalendarModeRequiredFlow: true,
		isInitialValidation,
		isValidateOnBlur: computed(() => props.isValidateOnBlur),
		onblur,
		revalidateOnCustomRulesChange: false,
		formRegistration: {
			validateOnSubmit,
			clearValidation: clearValidationForForm,
			reset: resetField,
		},
	})
	const isOnSuccess = hasSuccess
	const isHandlingProgrammaticClose = ref(false)

	const finalizeDatePickerClose = async () => {
		emit('closed')
		await validateCalendarModeDates()
	}

	const closeDatePicker = async () => {
		if (!isDatePickerVisible.value) return

		isHandlingProgrammaticClose.value = true
		isDatePickerVisible.value = false

		try {
			await finalizeDatePickerClose()
		}
		finally {
			queueMicrotask(() => {
				isHandlingProgrammaticClose.value = false
			})
		}
	}

	// Fonction centralisée pour mettre à jour le modèle
	const updateModel = async (value: DateModelValue) => {
		// Éviter les mises à jour inutiles
		if (isModelValueEqual(value, props.modelValue)) return

		try {
			isUpdatingFromInternal.value = true
			emit('update:modelValue', value)
			if (!preventCloseOnKeyboardNavigation.value) {
				await closeDatePicker()
			}
			else {
				await validateCalendarModeDates()
			}
		}
		finally {
			// Reset via setTimeout(0) (macrotask) pour garantir que tous les
			// watchers Vue (microtask) voient le flag avant son reset
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}

	// Watcher pour mettre à jour le modèle lorsque les dates sélectionnées changent
	watch(selectedDates, async (newValue) => {
		if (isUpdatingFromInternal.value) return
		if (!newValue) {
			keyboardNavigatedDate.value = null
			syncDisplayedMonthYearFromDate(new Date())
		}

		keyboardNavigatedDate.value = Array.isArray(newValue)
			? newValue[0] ?? null
			: newValue

		// Vider la grille ARIA injectée avant que Vuetify ne re-render le calendrier
		if (isDatePickerVisible.value) {
			reapplyAccessibility()
		}

		// Marquer les jours fériés après la mise à jour des dates
		markHolidayDays()
		if (isDatePickerVisible.value) {
			updateSelectedDayAria()
		}

		// Mettre à jour le modèle si nécessaire
		if (newValue !== null) {
			// En mode range, ne mettez à jour le modèle et ne fermez que si la plage est complète.
			const isRangeComplete = props.displayRange && Array.isArray(newValue) && newValue.length >= 2
			if (!props.displayRange || isRangeComplete) {
				await updateModel(formattedDate.value)
			}

			syncInputFromSelectionValue(newValue)
		}
		else {
			await updateModel(null)
			// Réinitialiser textInputValue
			textInputValue.value = ''
			displayFormattedDate.value = ''
		}

		// Réinitialiser le flag de protection une fois le modèle mis à jour
		preventCloseOnKeyboardNavigation.value = false
	})

	const messageClasses = computed(() => ({
		'dp-width': true,
		'v-messages__message--success': hasSuccess.value && !hasError.value && !hasWarning.value,
		'v-messages__message--error': hasError.value,
		'v-messages__message--warning': hasWarning.value && !hasError.value,
	}))

	// Utilisation du composable pour gérer la sélection de dates
	const { updateSelectedDates, rangeBoundaryDates, generateDateRange, resetRange } = useDateSelection(
		parseDate,
		selectedDates,
		computed(() => props.format),
		computed(() => props.displayRange),
	)

	// Utilisation du composable pour l'affichage formaté des dates
	const { displayedDateString } = useDisplayedDateString({
		selectedDates,
		rangeBoundaryDates,
		todayInString,
	})

	const {
		textInputValue,
		displayFormattedDate,
		formattedDate,
		displayFormattedFromSelectedDates,
		syncFromModelValue,
		syncTextInputFromSelection,
	} = useDatePickerState({
		selectedDates,
		rangeBoundaryDates,
		format: computed(() => props.format),
		dateFormatReturn: props.dateFormatReturn,
		displayRange: computed(() => props.displayRange),
		parseDate,
		formatDate,
		validateDates,
		clearValidation,
		generateDateRange,
	})

	const syncDisplayFormattedFromSelection = () => {
		displayFormattedDate.value = displayFormattedFromSelectedDates.value || ''
	}

	const syncInputFromSelectionValue = (value: DateObjectValue) => {
		withInternalUpdate(() => {
			if (Array.isArray(value) && props.displayRange && value.length >= 2 && props.noCalendar) {
				const start = value[0]
				const end = value[value.length - 1]
				if (start && end) {
					textInputValue.value = formatDateRangeDisplay(start, end, props.format, formatDate)
				}
			}
			else {
				syncTextInputFromSelection()
			}

			syncDisplayFormattedFromSelection()
		})
	}

	const syncManualInputState = (displayValue: string, selectedDate?: Date | null) => {
		withInternalUpdate(() => {
			displayFormattedDate.value = displayValue
			if (selectedDate !== undefined) {
				selectedDates.value = selectedDate
			}
		})
	}

	// Gestionnaire pour les mises à jour du DateTextInput en mode no-calendar
	const handleDateTextInputUpdate = async (value: DateModelValue) => {
		if (isUpdatingFromInternal.value && !props.noCalendar) return

		try {
			isUpdatingFromInternal.value = true

			await updateModel(value)
			const nextState = resolveDatePickerStateFromModelValue({
				modelValue: value,
				displayRange: props.displayRange,
				displayFormat: props.format,
				returnFormat: props.dateFormatReturn || props.format,
				parseDate,
				formatDate,
				generateDateRange,
			})

			selectedDates.value = nextState.selectedDates
			displayFormattedDate.value = nextState.displayValue
		}
		finally {
			setTimeout(() => {
				isUpdatingFromInternal.value = false
			}, 0)
		}
	}

	// Gestionnaire pour les événements date-selected du DateTextInput
	const handleDateTextInputSelection = async (value: DateModelValue) => {
		if (isUpdatingFromInternal.value) return

		// Mettre à jour le modèle avec la valeur sélectionnée
		await updateModel(value)
	}

	watch(textInputValue, async (newValue) => {
		// Éviter les mises à jour récursives
		if (isUpdatingFromInternal.value || props.noCalendar) return

		// Parse la date avec le format d'affichage
		const date = parseDate(newValue, props.format)
		if (date) {
			// Si on a un format de retour, formater la date dans ce format
			const formattedValue = props.dateFormatReturn
				? formatDate(date, props.dateFormatReturn)
				: formatDate(date, props.format)
			await updateModel(formattedValue)

			syncManualInputState(formatDate(date, props.format), date)
		}
		else if (newValue) {
			// Même si la date n'est pas valide, conserver la valeur saisie
			// pour éviter que la date ne disparaisse
			await updateModel(newValue)
			syncManualInputState(newValue)
		}
		else {
			await updateModel(null)
			syncManualInputState('', null)
		}
	})

	// Watcher indépendant pour gérer le clearing (extrait du watcher imbriqué)
	watch(displayFormattedDate, (newValue) => {
		if (!newValue) {
			if (selectedDates.value !== null) selectedDates.value = null
			resetRange()
		}
	})

	watch(displayFormattedDate, (newValue, oldValue) => {
		if (
			isInteractionDisabled.value
			&& !props.noCalendar
			&& !props.useCombinedMode
			&& !newValue
			&& !!oldValue
			&& props.modelValue
		) {
			syncFromModelValue(props.modelValue)
		}
	})

	// Le composable useDateSelection est déjà initialisé plus haut dans le code

	// Gestionnaire de clic en dehors
	const handleClickOutside = (event: MouseEvent) => {
		if (!isDatePickerVisible.value) return

		const target = event.target as HTMLElement
		const container = target.closest('.date-picker-container')

		// Si on clique dans le conteneur du CalendarMode, on ne fait rien
		if (container) return
		void closeDatePicker()
	}

	// todayInString est maintenant fourni par le composable useTodayButton

	// Utilisation du composable pour personnaliser les boutons du mois et de l'année
	const { customizeMonthButton, setupMonthButtonObserver } = useMonthButtonCustomization(
		() => isDatePickerVisible.value,
		currentMonthName,
		currentYearName,
		() => datePickerDialogRef.value,
	)

	const syncDisplayedMonthYearFromDate = (date: Date) => {
		const displayedState = getDisplayedMonthYearState(date)
		const hasMonthChanged = currentMonth.value !== displayedState.month
		const hasYearChanged = currentYear.value !== displayedState.year

		if (hasMonthChanged) {
			currentMonth.value = displayedState.month
			currentMonthName.value = displayedState.monthName
			handleMonthUpdate()
		}

		if (hasYearChanged) {
			currentYear.value = displayedState.year
			currentYearName.value = displayedState.yearName
		}

		if (hasMonthChanged || hasYearChanged) {
			reapplyAccessibility()
			nextTick(() => {
				if (isDatePickerVisible.value) {
					customizeMonthButton()
					markHolidayDays()
					updateSelectedDayAria()
				}
			})
		}
	}

	onMounted(() => {
		// Configurer l'observateur pour le bouton du mois
		setupMonthButtonObserver()

		syncDisplayFormattedFromSelection()

		// Validation au montage pour afficher les erreurs sur les dates pré-remplies invalides
		// Aligné sur le comportement de ComplexDatePicker
		validateDates()

		// Après la validation initiale, désactiver le flag
		nextTick(() => {
			isInitialValidation.value = false
		})
	})

	async function validateOnSubmit() {
		// Si le mode noCalendar est activé, on délègue la validation au DateTextInput
		if (props.noCalendar) {
			return await dateTextInputRef.value?.validateOnSubmit()
		}
		// Si le mode combiné est activé, on délègue la validation au ComplexDatePicker
		else if (props.useCombinedMode) {
			return await complexDatePickerRef.value?.validateOnSubmit()
		}
		// Forcer la validation pour ignorer les conditions de validation interactive
		// S'assurer que isInitialValidation est false pour que la validation required fonctionne
		isInitialValidation.value = false
		await validateCalendarModeDates(true)
		// Retourner directement un booléen pour maintenir la compatibilité avec les tests existants
		return errorMessages.value.length === 0
	}

	function clearValidationForForm() {
		clearValidation()
	}

	function resetField() {
		clearValidation()
		isDatePickerVisible.value = false
		keyboardNavigatedDate.value = null

		withInternalUpdate(() => {
			selectedDates.value = null
			textInputValue.value = ''
			displayFormattedDate.value = ''
			emit('update:modelValue', null)
		})

		fieldKey.value++
	}

	const openDatePicker = async () => {
		if (isInteractionDisabled.value) return
		if (!isDatePickerVisible.value) {
			await toggleDatePicker()
		}
	}

	// Marquage des jours fériés partagé via le composable dédié
	const { markHolidayDays } = useHolidayHighlighting({
		currentMonth,
		currentYear,
		isDisplayHolidayDays: () => props.displayHolidayDays,
		rootElement: computed(
			() => datePickerRef.value?.$el as HTMLElement | null,
		),
	})

	const { updateSelectedDayAria } = useSelectedDayAria({
		rootElement: computed(
			() => datePickerRef.value?.$el as HTMLElement | null,
		),
	})

	// Utilisation du composable pour gérer le mode d'affichage du CalendarMode
	const { currentViewMode, handleViewModeUpdate, handleYearUpdate, handleMonthUpdate, resetViewMode } = useDatePickerViewMode(
		() => props.isBirthDate || props.birthDate,
		// Fonction qui retourne l'état de la date sélectionnée
		() => selectedDates.value,
	)

	const {
		reapplyAccessibility,
		handleViewModeUpdateWrapper,
		onUpdateMonth,
		onUpdateYear,
	} = useDatePickerCalendar({
		getRootEl: () => datePickerDialogRef.value,
		isDatePickerVisible,
		currentViewMode,
		handleViewModeUpdate,
		handleMonthUpdate,
		handleYearUpdate,
		currentMonth,
		currentMonthName,
		currentYear,
		currentYearName,
		updateAccessibility,
		cleanupGridSemantics,
		focusInitialDay,
		refreshCalendarUi: (options) => {
			if (!isDatePickerVisible.value) return
			customizeMonthButton()
			markHolidayDays()
			updateSelectedDayAria()
			if (options.focusDay) {
				nextTick(focusInitialDay)
			}
		},
	})

	const handleInputBlur = async () => {
		emit('blur')
		onblur.value = true
		// Ne pas valider si le DatePicker est ouvert : le blur est causé par
		// l'ouverture du calendrier (VMenu prend le focus), pas par l'utilisateur
		// qui quitterait le champ.
		if (isDatePickerVisible.value) return
		// Ne pas valider si isValidateOnBlur est false
		if (props.isValidateOnBlur) {
			await validateCalendarModeDates(true)
		}
		else {
			// Quand isValidateOnBlur est false, on s'assure qu'il n'y a pas d'erreurs
			clearValidation()
		}
	}

	watch(isDatePickerVisible, async (isVisible) => {
		if (isVisible) {
			// Réinitialiser le view mode à l'ouverture pour éviter les problèmes de navigation
			resetViewMode()
			// Marquer les jours fériés lorsque le calendrier devient visible
			markHolidayDays()
			customizeMonthButton()
			updateSelectedDayAria()
		}
		if (!isVisible && props.isBirthDate) {
			// Réinitialiser le mode d'affichage au type birthdate
			resetViewMode()
		}

		if (!isVisible) {
			if (!isHandlingProgrammaticClose.value) {
				await finalizeDatePickerClose()
			}

			// set the focus on the text input
			// wait for VMenu to finish DOM updates & transition
			setTimeout(() => {
				requestAnimationFrame(() => {
					focusCalendarInput()
				})
			}, 0)
		}
	})

	watch(() => props.modelValue, (newValue) => {
		if (isUpdatingFromInternal.value) return

		syncFromModelValue(newValue)
	}, { immediate: true })

	const toggleDatePicker = async () => {
		if (isInteractionDisabled.value) return

		if (!isDatePickerVisible.value) {
			isDatePickerVisible.value = true
			nextTick(() => {
				updateAccessibility(datePickerDialogRef.value ?? undefined, currentViewMode.value)
			})
		}
		else {
			await closeDatePicker()
		}
	}

	const openDatePickerOnClick = () => {
		if (isInteractionDisabled.value) return
		openDatePicker()
		customizeMonthButton()
	}

	// Ne plus ouvrir automatiquement le calendrier au focus, juste émettre l'événement
	const openDatePickerOnFocus = () => {
		// openDatePicker() - désactivé pour améliorer l'accessibilité
		emit('focus')
	}

	const openDatePickerOnIconClick = async () => {
		if (isInteractionDisabled.value) return
		await toggleDatePicker()
	}

	// Gestionnaire d'événement clavier pour l'input
	const handleInputKeydown = async (event: KeyboardEvent) => {
		// Ne rien faire si le composant est en readonly
		if (props.readonly) return // Gardé tel quel car readonly-only, pas disabled

		// Ouvrir le calendrier uniquement lorsque la touche Entrée est pressée
		if (event.key === 'Enter') {
			await openDatePicker()
			event.preventDefault() // Empêcher la soumission du formulaire
		}
		// Fermer le calendrier lorsque la touche Escape est pressée
		else if ((event.key === 'Escape' || event.key === 'Esc') && isDatePickerVisible.value) {
			await closeDatePicker()
			event.preventDefault()
		}
	}

	defineExpose({
		validateOnSubmit,
		isDatePickerVisible,
		selectedDates,
		errorMessages,
		errors: readonlyState(errors),
		warnings: readonlyState(warnings),
		successes: readonlyState(successes),
		handleClickOutside,
		initializeSelectedDates,
		updateAccessibility,
		openDatePicker,
		updateSelectedDates,
		handleSelectToday,
	})
</script>

<template>
	<div class="date-picker-container">
		<template v-if="props.noCalendar">
			<DateTextInput
				ref="dateTextInputRef"
				v-model="textInputValue"
				:class="[messageClasses, 'label-hidden-on-focus']"
				v-bind="noCalendarTextInputProps"
				@update:model-value="handleDateTextInputUpdate"
				@date-selected="handleDateTextInputSelection"
				@blur="handleInputBlur"
				@focus="emit('focus')"
			/>
		</template>
		<template v-else-if="props.useCombinedMode">
			<ComplexDatePicker
				ref="complexDatePickerRef"
				v-bind="combinedModeDatePickerProps"
				@update:model-value="emit('update:modelValue', $event)"
				@focus="emit('focus')"
				@blur="emit('blur')"
				@date-selected="emit('date-selected', $event)"
			/>
		</template>
		<template v-else>
			<VMenu
				v-if="!props.noCalendar"
				v-model="isDatePickerVisible"
				:min-width="0"
				location="bottom"
				:close-on-content-click="false"
				:open-on-click="false"
				scroll-strategy="reposition"
				transition="fade-transition"
				attach="body"
				:offset="[-20, 5]"
				content-class="date-picker-overlay-content"
				role="presentation"
				:title="props.placeholder || locales.label"
			>
				<template #activator="{ props: menuProps }">
					<div
						v-bind="{ ...menuProps, 'aria-expanded': undefined, 'aria-haspopup': undefined, 'aria-owns': undefined, 'aria-controls': isDatePickerVisible ? datePickerDialogId : undefined }"
					>
						<SyTextField
							:id="`${datePickerContentId}-input`"
							:key="fieldKey"
							ref="dateCalendarTextInputRef"
							v-model="displayFormattedDate"
							:class="[messageClasses, 'label-hidden-on-focus']"
							v-bind="menuActivatorTextFieldProps"
							@click="openDatePickerOnClick"
							@focus="openDatePickerOnFocus"
							@blur="handleInputBlur"
							@keydown="handleInputKeydown"
							@update:model-value="updateSelectedDates"
							@prepend-icon-click="openDatePickerOnIconClick"
							@append-icon-click="openDatePickerOnIconClick"
						/>
					</div>
				</template>
				<div
					v-if="isDatePickerVisible && !props.noCalendar"
					:id="datePickerDialogId"
					ref="datePickerDialogRef"
					role="dialog"
					aria-modal="true"
					:aria-labelledby="datePickerTitleId"
					tabindex="-1"
				>
					<VDatePicker
						:id="datePickerContentId"
						ref="datePickerRef"
						v-model="selectedDates"
						color="primary"
						control-variant="modal"
						:first-day-of-week="1"
						:multiple="props.displayRange ? 'range' : false"
						:show-adjacent-months="true"
						:show-week="props.showWeekNumber"
						:view-mode="currentViewMode"
						:month="currentMonth !== null ? Number(currentMonth) : undefined"
						:year="currentYear !== null ? Number(currentYear) : undefined"
						:class="displayWeekendDays ? 'weekend' : ''"
						:max="maxDate"
						:min="minDate"
						:display-holiday-days="props.displayHolidayDays"
						@update:view-mode="handleViewModeUpdateWrapper"
						@update:month="onUpdateMonth"
						@update:year="onUpdateYear"
						@click:date="updateSelectedDates"
						@update:model-value="syncDisplayFormattedFromSelection"
						@focus="markHolidayDays"
						@update:month-year="markHolidayDays"
					>
						<template #title>
							<span :id="datePickerTitleId">
								{{ locales.calendarTitle }}
							</span>
						</template>
						<template #header>
							<SyHeading
								:id="datePickerHeadingId"
								class="mx-auto my-auto ml-5 mb-4"
								:level="headingLevel"
							>
								{{ selectedDates ? displayedDateString : headerDate }}
							</SyHeading>
						</template>
						<template
							v-if="props.displayTodayButton"
							#actions
						>
							<div class="d-flex justify-center align-center w-100">
								<VBtn
									type="button"
									size="x-small"
									color="primary"
									:title="todayButtonLabel"
									:aria-label="todayButtonLabel"
									class="date-picker__today-button my-2 pa-2 mt-2"
									:ripple="false"
									@click="handleSelectToday"
									@keydown.enter.prevent.stop="handleSelectToday"
									@keydown.space.prevent.stop="handleSelectToday"
								>
									<SyIcon
										size="16px"
										decorative
										:icon="mdiCalendarMonthOutline"
									/>
									{{ locales.buttonToday }}
								</VBtn>
							</div>
						</template>
					</VDatePicker>
				</div>
			</VMenu>
		</template>
	</div>
</template>

<style lang="scss" scoped>
@use '../styles/datePickerShared';

/* En mode calendar, le champ est readonly : pas de cursor pointer sur l'input et les icônes */
:deep(.v-field__input),
:deep(.sy-text-field__icon-button) {
	cursor: default;
}

.dp-width {
	width: v-bind(width);
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>

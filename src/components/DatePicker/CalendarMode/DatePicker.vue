<script lang="ts" setup>
	import SyIcon from '@/components/Customs/SyIcon/SyIcon.vue'
	import SyHeading from '@/components/SyHeading/SyHeading.vue'
	import { useDateFormat } from '@/composables/date/useDateFormatDayjs'
	import { useDateInitialization, type DateInput, type DateModelValue } from '@/composables/date/useDateInitializationDayjs'
	import { useDatePickerAccessibility } from '@/composables/date/useDatePickerAccessibility'
	import { useValidatable } from '@/composables/validation/useValidatable'
	import { mdiCalendarMonthOutline } from '@mdi/js'
	import dayjs from 'dayjs'
	import customParseFormat from 'dayjs/plugin/customParseFormat'
	import { computed, nextTick, onBeforeUnmount, onMounted, readonly as readonlyState, ref, useId, watch, type ComponentPublicInstance, type Ref } from 'vue'
	import { VDatePicker } from 'vuetify/components'
	import SyTextField from '../../Customs/SyTextField/SyTextField.vue'
	import ComplexDatePicker from '../ComplexDatePicker/ComplexDatePicker.vue'
	import { buildTodaySelectionState, useCalendarKeyboardNavigation, useDatePickerDerivedValues, useDatePickerFocusTrap, useDatePickerState, useDatePickerValidation, useDatePickerViewMode, useDateSelection, useDisplayedDateString, useHolidayHighlighting, useMonthButtonCustomization, useSelectedDayAria, useTodayButton } from '../composables'
	import DateTextInput from '../DateTextInput/DateTextInput.vue'
	import { locales } from '../locales'
	import type { ViewMode } from '../composables/useDatePickerViewMode'
	import type { CalendarModeProps, DateObjectValue } from '../types'
	import { DatePickerCommonDefaults } from '../types'
	import { formatDateRangeDisplay, getDisplayedMonthYearState } from '../utils/dateFormattingUtils'
	import { useComplexDatePickerProps } from './props/complexDatePickerProps'
	import { useDateTextInputProps } from './props/dateTextInputProps'
	import { useSyTextFieldProps } from './props/syTextFieldProps'

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

	// Props regroupées pour DateTextInput
	const dateTextInputProps = computed(() => useDateTextInputProps(props, labelWithAsterisk, errorMessages))

	// Props regroupées pour ComplexDatePicker
	const complexDatePickerProps = computed(() => useComplexDatePickerProps(props))

	// Props regroupées pour SyTextField (mode VMenu)
	const syTextFieldProps = computed(() => useSyTextFieldProps(props, labelWithAsterisk, errorMessages, warningMessages, successMessages, isOnSuccess))

	const selectedDates = ref<Date | (Date | null)[] | null>(
		initializeSelectedDates(props.modelValue as DateInput | null, props.format, props.dateFormatReturn),
	)

	// Utiliser useDatePickerDerivedValues pour centraliser les computed partagés
	const { minDate, maxDate } = useDatePickerDerivedValues(props)

	// Utilisation du composable pour l'affichage formaté des dates
	const { displayedDateString } = useDisplayedDateString({
		selectedDates,
		todayInString,
	})

	const onblur = ref(false)

	const dateTextInputRef = ref<null | ComponentPublicInstance<typeof DateTextInput>>()
	const dateCalendarTextInputRef = ref<null | ComponentPublicInstance<typeof SyTextField>>()
	const datePickerRef = ref<ComponentPublicInstance | null>(null)
	const complexDatePickerRef = ref<null | ComponentPublicInstance<typeof ComplexDatePicker>>()
	const datePickerContentId = `date-picker-${useId()}`

	/**
	 * Nettoie la sémantique grid ARIA injectée avant que Vuetify ne re-render le mois,
	 * puis la réapplique dans le prochain tick. Cela évite les erreurs de patch Vue
	 * dues au reparentage de nœuds du virtual DOM.
	 */
	const reapplyAccessibility = () => {
		const rootEl = datePickerDialogRef.value
		if (!rootEl) return

		const activeElement = document.activeElement instanceof HTMLElement
			? document.activeElement
			: null
		const activeDay = activeElement?.closest<HTMLElement>('.v-date-picker-month__day[data-v-date]')
		const activeMonthButton = activeElement?.closest<HTMLButtonElement>('.v-date-picker-months .v-btn')
		const activeYearButton = activeElement?.closest<HTMLButtonElement>('.v-date-picker-years .v-btn')
		const shouldRestoreButtonFocus = activeElement?.tagName === 'BUTTON'
		const dayDate = activeDay?.getAttribute('data-v-date')
		const monthLabel = activeMonthButton?.getAttribute('aria-label') ?? activeMonthButton?.textContent?.trim() ?? ''
		const yearLabel = activeYearButton?.getAttribute('aria-label') ?? activeYearButton?.textContent?.trim() ?? ''
		cleanupGridSemantics(rootEl)
		nextTick(() => {
			updateAccessibility(rootEl, currentViewMode.value)
			nextTick(() => {
				if (!activeElement || (!rootEl.contains(activeElement) && !dayDate && !monthLabel && !yearLabel)) return

				if (dayDate) {
					const dayCell = rootEl.querySelector<HTMLElement>(`.v-date-picker-month__day[data-v-date="${dayDate}"]`)
					const focusTarget = shouldRestoreButtonFocus
						? dayCell?.querySelector<HTMLElement>('button')
						: dayCell
					focusTarget?.focus({ preventScroll: true })
					return
				}

				if (monthLabel) {
					const monthButtons = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-months .v-btn'))
					const target = monthButtons.find(button =>
						(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === monthLabel,
					)
					target?.focus({ preventScroll: true })
					return
				}

				if (yearLabel) {
					const yearButtons = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('.v-date-picker-years .v-btn'))
					const target = yearButtons.find(button =>
						(button.getAttribute('aria-label') ?? button.textContent?.trim() ?? '') === yearLabel,
					)
					target?.focus({ preventScroll: true })
				}
			})
		})
	}

	const datePickerDialogRef = ref<HTMLElement | null>(null)
	const datePickerDialogId = `${datePickerContentId}-dialog`
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
			updateSelectedDates([date])
			nextTick(() => closeDatePicker())
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
	const isUpdatingFromInternal = ref(false)
	const keyboardNavigatedDate = ref<Date | null>(null)
	const preventCloseOnKeyboardNavigation = ref(false)
	const isInitialValidation = ref(true)
	const currentRangeIsValid = ref(true)
	const getRangeValidationError = ref('')

	const {
		validation,
		errors,
		warnings,
		clearValidation,
		validateDates,
		validateCalendarModeDates,
	} = useDatePickerValidation({
		showSuccessMessages: computed(() => props.showSuccessMessages),
		disableErrorHandling: computed(() => props.disableErrorHandling),
		noCalendar: computed(() => props.noCalendar),
		required: computed(() => props.required),
		displayRange: computed(() => props.displayRange),
		customRules: computed(() => props.customRules),
		customWarningRules: computed(() => props.customWarningRules),
		selectedDates: selectedDates as Ref<DateObjectValue>,
		isUpdatingFromInternal,
		currentRangeIsValid,
		getRangeValidationError,
		readonly: computed(() => props.readonly),
		skipValidationWhenReadonly: true,
		useCalendarModeRequiredFlow: true,
		isInitialValidation,
		isValidateOnBlur: computed(() => props.isValidateOnBlur),
		onblur,
		revalidateOnCustomRulesChange: false,
	})

	const errorMessages = errors
	const warningMessages = warnings
	const successMessages = validation.displaySuccesses
	const isOnSuccess = validation.hasSuccess
	const isHandlingProgrammaticClose = ref(false)

	const finalizeDatePickerClose = async () => {
		emit('closed')
		await validateDates()
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
		if (JSON.stringify(value) === JSON.stringify(props.modelValue)) return

		try {
			isUpdatingFromInternal.value = true
			emit('update:modelValue', value)
			if (!preventCloseOnKeyboardNavigation.value) {
				await closeDatePicker()
			}
			else {
				await validateDates()
			}
		}
		finally {
			// S'assurer que le flag est toujours réinitialisé
			queueMicrotask(() => {
				isUpdatingFromInternal.value = false
			})
		}
	}

	// Watcher pour mettre à jour le modèle lorsque les dates sélectionnées changent
	watch(selectedDates, async (newValue) => {
		keyboardNavigatedDate.value = Array.isArray(newValue)
			? newValue[0] ?? null
			: newValue

		// Vider la grille ARIA injectée avant que Vuetify ne re-render le calendrier
		if (isDatePickerVisible.value) {
			reapplyAccessibility()
		}

		// Ne valider automatiquement que si isValidateOnBlur est true ET pas en validation initiale
		if (props.isValidateOnBlur && !isInitialValidation.value) {
			// Valider les dates avec le flux spécifique CalendarMode
			await validateCalendarModeDates()
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

			// Mettre à jour textInputValue pour le DateTextInput
			try {
				isUpdatingFromInternal.value = true
				if (Array.isArray(newValue) && props.displayRange && newValue.length >= 2 && props.noCalendar) {
					// Cas spécifique noCalendar + displayRange : conserver la chaîne de plage complète
					const start = newValue[0]
					const end = newValue[newValue.length - 1]
					if (start && end) {
						textInputValue.value = formatDateRangeDisplay(start, end, props.format, formatDate)
					}
				}
				else {
					// Cas générique : déléguer au composable pour synchroniser l'input
					syncTextInputFromSelection()
				}
			}
			finally {
				queueMicrotask(() => {
					isUpdatingFromInternal.value = false
				})
			}
		}
		else {
			updateModel(null)
			// Réinitialiser textInputValue
			textInputValue.value = ''
		}

		// Réinitialiser le flag de protection une fois le modèle mis à jour
		preventCloseOnKeyboardNavigation.value = false
	})

	const messageClasses = computed(() => ({
		'dp-width': true,
		'v-messages__message--success': successMessages.value.length > 0,
		'v-messages__message--error': errorMessages.value.length > 0,
		'v-messages__message--warning': warningMessages.value.length > 0 && errorMessages.value.length < 1,
	}))

	// Utilisation du composable pour gérer la sélection de dates
	const { updateSelectedDates, rangeBoundaryDates, generateDateRange, resetRange } = useDateSelection(
		parseDate,
		selectedDates,
		computed(() => props.format),
		computed(() => props.displayRange),
	)

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
		initializeSelectedDates,
		validateDates,
		updateModel,
		generateDateRange,
	})

	// Gestionnaire pour les mises à jour du DateTextInput en mode no-calendar
	const handleDateTextInputUpdate = async (value: DateModelValue) => {
		if (isUpdatingFromInternal.value && !props.noCalendar) return

		try {
			isUpdatingFromInternal.value = true

			// Mettre à jour le modèle avec la valeur reçue du DateTextInput
			await updateModel(value)

			// Mettre à jour selectedDates en fonction de la valeur reçue
			if (!value) {
				selectedDates.value = null
				displayFormattedDate.value = ''
			}
			else if (Array.isArray(value) && props.displayRange) {
				// Pour les plages de dates
				const [startDateStr, endDateStr] = value
				const startDate = parseDate(startDateStr, props.dateFormatReturn || props.format)
				const endDate = parseDate(endDateStr, props.dateFormatReturn || props.format)

				if (startDate && endDate) {
					selectedDates.value = generateDateRange(startDate, endDate)
					displayFormattedDate.value = formatDateRangeDisplay(startDate, endDate, props.format, formatDate)
				}
			}
			else if (typeof value === 'string') {
				// Pour une date unique
				const date = parseDate(value, props.dateFormatReturn || props.format)
				if (date) {
					selectedDates.value = date
					displayFormattedDate.value = formatDate(date, props.format)
				}
			}
		}
		finally {
			queueMicrotask(() => {
				isUpdatingFromInternal.value = false
			})
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

			// Mettre à jour selectedDates sans déclencher de watchers supplémentaires
			try {
				isUpdatingFromInternal.value = true
				selectedDates.value = date
				// Mettre à jour l'affichage formaté
				displayFormattedDate.value = formatDate(date, props.format)
			}
			finally {
				queueMicrotask(() => {
					isUpdatingFromInternal.value = false
				})
			}
		}
		else if (newValue) {
			// Même si la date n'est pas valide, conserver la valeur saisie
			// pour éviter que la date ne disparaisse
			await updateModel(newValue)
			// Mettre à jour l'affichage formaté pour qu'il corresponde à ce qui est saisi
			try {
				isUpdatingFromInternal.value = true
				displayFormattedDate.value = newValue
			}
			finally {
				queueMicrotask(() => {
					isUpdatingFromInternal.value = false
				})
			}
		}
		else {
			await updateModel(null)
			// Réinitialiser l'affichage formaté
			try {
				isUpdatingFromInternal.value = true
				displayFormattedDate.value = ''
				selectedDates.value = null
			}
			finally {
				queueMicrotask(() => {
					isUpdatingFromInternal.value = false
				})
			}
		}
	})

	// Date(s) formatée(s) en chaîne de caractères pour l'affichage (centralisée dans useDatePickerState)
	const displayFormattedDateComputed = displayFormattedFromSelectedDates

	watch(displayFormattedDateComputed, (newValue) => {
		if (!props.noCalendar && newValue) {
			displayFormattedDate.value = newValue
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

	// Fonction pour mettre à jour displayFormattedDate quand le VDatePicker change
	const updateDisplayFormattedDate = () => {
		if (displayFormattedDateComputed.value) {
			displayFormattedDate.value = displayFormattedDateComputed.value
		}
	}

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

		// Initialiser l'affichage formaté
		if (displayFormattedDateComputed.value) {
			displayFormattedDate.value = displayFormattedDateComputed.value
		}

		// Validation au montage pour afficher les erreurs sur les dates pré-remplies invalides
		// Aligné sur le comportement de ComplexDatePicker
		validateDates()

		// Après la validation initiale, désactiver le flag
		nextTick(() => {
			isInitialValidation.value = false
		})
	})

	const validateOnSubmit = async () => {
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
		return errors.value.length === 0
	}

	// Intégration avec le système de validation du formulaire
	useValidatable(validateOnSubmit, clearValidation)

	const openDatePicker = async () => {
		if (isInteractionDisabled.value) return
		if (!isDatePickerVisible.value) {
			await toggleDatePicker()
		}
	}

	// Fonction pour mettre à jour le mois quand on navigue via les flèches
	const onUpdateMonth = (month: string) => {
		if (currentMonth.value === month) return
		currentMonth.value = month
		currentMonthName.value = dayjs().month(parseInt(month, 10)).format('MMMM')
		handleMonthUpdate()
		nextTick(() => {
			if (isDatePickerVisible.value) {
				customizeMonthButton()
				markHolidayDays()
				updateSelectedDayAria()
				nextTick(focusInitialDay)
			}
		})
	}

	// Fonction pour mettre à jour l'année quand on navigue via les flèches
	const onUpdateYear = (year: string) => {
		currentYear.value = year
		currentYearName.value = year

		handleYearUpdate()
		nextTick(() => {
			if (isDatePickerVisible.value) {
				customizeMonthButton()
				markHolidayDays()
				updateSelectedDayAria()
				nextTick(focusInitialDay)
			}
		})
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

	const waitForTransitionEnd = (container: HTMLElement, callback: () => void) => {
		if (container.classList.contains('v-enter-active') || container.classList.contains('fade-transition-enter-active')) {
			let fired = false
			const handler = () => {
				if (fired) return
				fired = true
				clearTimeout(fallbackId)
				callback()
			}
			const fallbackId = setTimeout(handler, 400)
			container.addEventListener('transitionend', handler, { once: true })
		}
		else {
			callback()
		}
	}

	const handleViewModeUpdateWrapper = (mode: ViewMode) => {
		handleViewModeUpdate(mode)
		if (isDatePickerVisible.value) {
			reapplyAccessibility()
		}
		if (mode === 'month') {
			nextTick(() => {
				if (isDatePickerVisible.value) {
					const root = datePickerDialogRef.value
					if (!root) return
					const monthContainer = root.querySelector<HTMLElement>('.v-date-picker-month')
					if (!monthContainer) {
						focusInitialDay()
						return
					}

					waitForTransitionEnd(monthContainer, () => focusInitialDay())
				}
			})
		}
		if (mode === 'months') {
			nextTick(() => {
				const root = datePickerDialogRef.value
				if (!root) return
				const monthsContainer = root.querySelector<HTMLElement>('.v-date-picker-months')
				if (!monthsContainer) return

				const focusActiveMonth = () => {
					const active = root.querySelector<HTMLElement>('.v-date-picker-months .v-btn--active')
					if (active) {
						active.focus({ preventScroll: true })
						return
					}
					const monthIndex = currentMonth.value !== null ? Number(currentMonth.value) : new Date().getMonth()
					const monthBtns = root.querySelectorAll<HTMLElement>('.v-date-picker-months .v-btn')
					monthBtns[monthIndex]?.focus({ preventScroll: true })
				}

				waitForTransitionEnd(monthsContainer, focusActiveMonth)
			})
		}

		if (mode === 'year') {
			nextTick(() => {
				const root = datePickerDialogRef.value
				if (!root) return
				const yearsContainer = root.querySelector<HTMLElement>('.v-date-picker-years')
				if (!yearsContainer) return

				const focusActiveYear = () => {
					const active = root.querySelector<HTMLElement>('.v-date-picker-years .v-btn--active')
					if (active) {
						active.focus({ preventScroll: true })
						return
					}
					const currentYearBtn = root.querySelector<HTMLElement>('.v-date-picker-years .v-date-picker-years__year--current .v-btn')
					if (currentYearBtn) {
						currentYearBtn.focus({ preventScroll: true })
						return
					}
					const firstBtn = root.querySelector<HTMLElement>('.v-date-picker-years .v-btn')
					firstBtn?.focus({ preventScroll: true })
				}

				waitForTransitionEnd(yearsContainer, focusActiveYear)
			})
		}
	}

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
					isDatePickerVisible.value = false
				})
			}, 0)
		}
	})

	watch(() => props.modelValue, (newValue) => {
		if (isUpdatingFromInternal.value) {
			if (props.displayRange) {
				if (Array.isArray(newValue) && newValue.length >= 2) {
					// Synchroniser les dates de plage avec le modèle
					syncFromModelValue(newValue)
				}
			}
			return
		}

		// Synchroniser les dates sélectionnées avec le modèle
		syncFromModelValue(newValue)

		// Mettre à jour textInputValue pour le DateTextInput en mode no-calendar
		if (props.noCalendar) {
			try {
				isUpdatingFromInternal.value = true

				if (!newValue) {
					textInputValue.value = ''
				}
				else if (Array.isArray(newValue) && props.displayRange) {
				// Pour les plages de dates, on ne modifie pas directement textInputValue
				// car le DateTextInput gère son propre formatage
				}
				else if (typeof newValue === 'string') {
					// Pour une date unique
					const date = parseDate(newValue, props.dateFormatReturn || props.format)
					if (date) {
						textInputValue.value = formatDate(date, props.format)
					}
					else {
						textInputValue.value = newValue
					}
				}
			}
			finally {
				setTimeout(() => {
					isUpdatingFromInternal.value = false
				}, 0)
			}
		}
	}, { immediate: true })

	// Reset month/year names when clearing the date
	watch(selectedDates, (newValue) => {
		if (!newValue) {
			keyboardNavigatedDate.value = null
			const today = new Date()
			syncDisplayedMonthYearFromDate(today)
		}
	})

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
		successes: readonlyState(successMessages),
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
				v-bind="dateTextInputProps"
				@update:model-value="handleDateTextInputUpdate"
				@date-selected="handleDateTextInputSelection"
				@blur="handleInputBlur"
				@focus="emit('focus')"
			/>
		</template>
		<template v-else-if="props.useCombinedMode">
			<ComplexDatePicker
				ref="complexDatePickerRef"
				v-bind="complexDatePickerProps"
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
							ref="dateCalendarTextInputRef"
							v-model="displayFormattedDate"
							:class="[messageClasses, 'label-hidden-on-focus']"
							v-bind="syTextFieldProps"
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
					:aria-labelledby="datePickerHeadingId"
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
						@update:model-value="updateDisplayFormattedDate"
						@focus="markHolidayDays"
						@update:month-year="markHolidayDays"
					>
						<template #title>
							{{ locales.calendarTitle }}
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
								<v-btn
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
								</v-btn>
							</div>
						</template>
					</VDatePicker>
				</div>
			</VMenu>
		</template>
	</div>
</template>

<style lang="scss" scoped>
$ap-grey-mid: #d6d6d6;

.v-sheet {
	border-radius: var(--radius-md) !important;
}

/* En mode calendar, le champ est readonly : pas de cursor pointer sur l'input et les icônes */
:deep(.v-field__input),
:deep(.sy-text-field__icon-button) {
	cursor: default;
}

.date-picker-title {
	display: block;
	text-transform: lowercase;
	font-size: 0.875rem;

	&::first-letter {
		text-transform: uppercase;
	}
}

/* Style pour les jours fériés */
:deep(.holiday-day) {
	background-color: rgb(255 193 7 / 10%);
	border: 2px dotted rgb(var(--v-theme-grey-darken60));
	border-radius: 50%;
}

:deep(.v-date-picker-month__day[role='gridcell']:focus-visible) {
	border-radius: 50%;
	outline: 2px solid rgb(var(--v-theme-primary));
	outline-offset: 1px;
}

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

:deep(.v-date-picker-controls .v-btn:last-child) {
	margin-inline-start: 0;
}

.label-hidden-on-focus:focus + label {
	display: none;
}

.dp-width {
	width: v-bind(width);
}

.v-messages__message--success {
	:deep(.v-input__control),
	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;

		--v-medium-emphasis-opacity: 1;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-onSuccessVariant)) !important;
	}
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

.v-messages__message--error {
	:deep(.v-input__control) {
		color: rgb(var(--v-theme-error)) !important;

		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-error)) !important;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-error)) !important;
	}
}

.v-messages__message--warning {
	:deep(.v-input__control) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;

		--v-medium-emphasis-opacity: 1;
	}

	:deep(.v-messages__message) {
		color: rgb(var(--v-theme-onWarningVariant)) !important;
	}

	.v-field--active & {
		color: rgb(var(--v-theme-onWarningVariant)) !important;
	}
}

:deep(.v-btn__content) {
	font-size: var(--v-fontSize-corpsDeTexte) + 3;
	font-weight: bold;
}

:deep(.v-messages) {
	opacity: 1;
}

:deep(.v-field--dirty) {
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

:deep(.v-date-picker-month__day .v-btn:hover) {
	background-color: rgb(var(--v-theme-background)) 0.12;
	color: rgb(var(--v-theme-onBackground));
}

:deep(.v-date-picker-month__day--adjacent) {
	opacity: 1;

	.v-btn__content {
		color: rgb(var(--v-theme-onSurfaceVariant));
		opacity: 1;
	}
}

:deep(.v-date-picker-month__day--adjacent:has(.v-btn:focus-visible)) {
	opacity: 1;
}

:deep(.v-date-picker-month__day--adjacent .v-btn:focus-visible) {
	opacity: 1;
	background-color: transparent !important;

	.v-btn__content {
		color: rgb(var(--v-theme-onSurfaceVariant));
		opacity: 1;
	}
}

:deep(.v-date-picker-month__day--selected .v-btn:hover) {
	background-color: rgb(var(--v-theme-primaryVariant)) !important;
	opacity: 0.9;
}

:deep(.v-date-picker-month__day--selected .v-btn) {
	background-color: rgb(var(--v-theme-primaryVariant)) !important;
	color: rgb(var(--v-theme-onPrimaryVariant)) !important;
}

:deep(.v-date-picker-month__day--selected .v-btn .v-btn__content) {
	color: rgb(var(--v-theme-onPrimaryVariant)) !important;
}

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

:deep(.weekend .v-date-picker-month__day--week-end .v-btn) {
	background-color: rgb(var(--v-theme-surface));
	box-shadow: inset 0 0 0 1px rgb(var(--v-theme-onSurfaceVariant));
	color: rgb(var(--v-theme-onSurface));
}

/* div avant la class .v-date-picker-month__day--week-end */
:deep(.weekend .v-date-picker-month__day:has(+ .v-date-picker-month__day--week-end) .v-btn) {
	background-color: rgb(var(--v-theme-surface));
	box-shadow: inset 0 0 0 1px rgb(var(--v-theme-onSurfaceVariant));
	color: rgb(var(--v-theme-onSurface));
}

:deep(.v-date-picker-controls__mode-btn) {
	transform: none !important;
}

:deep(.v-btn--variant-text .v-btn__overlay) {
	padding: 13px;
}

:deep(.custom-year-btn) {
	width: auto;
	height: 28px;
}

:deep(.custom-year-btn::after) {
	background-color: $ap-grey-mid;
	padding: 10px 40px;
	text-decoration: none;
	display: inline-block;
	margin-left: -22px !important;
	cursor: pointer;
	border-radius: 9999px;
}

:deep(.custom-month-btn::after) {
	background-color: $ap-grey-mid;
	text-decoration: none;
	display: inline-block;
	cursor: pointer;
	border-radius: 9999px;
}

:deep(.v-picker__body .v-btn:focus-visible) {
	// Ring du global `_btns.scss` (2px primary). Offset réduit à 1px pour la grille dense
	outline-offset: 1px;
}

:deep(.v-date-picker-months) {
	flex: 1;
}

:deep(.v-date-picker-months .v-btn__content) {
	font-size: 1rem;
}

.date-picker__today-button {
	height: auto;

	:deep(.v-btn__content) {
		font-size: 1rem;
		gap: 8px;
	}
}

:deep(.v-picker__body .v-btn--active .v-btn__overlay) {
	opacity: 0;
}

.date-picker-overlay-content .v-date-picker {
	box-shadow:
		0 5px 5px -3px rgb(0 0 0 / 20%),
		0 8px 10px 1px rgb(0 0 0 / 14%),
		0 3px 14px 2px rgb(0 0 0 / 12%) !important;
}
</style>

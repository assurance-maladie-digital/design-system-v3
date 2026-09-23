/**
 * Index des composables DatePicker — Hub d'export centralisé.
 *
 * ## Architecture des composables
 *
 * Les composables du DatePicker sont organisés par responsabilité :
 *
 * ### Saisie texte & édition
 * - `useDateInputEditing` : Formatage masqué en temps réel (insertion automatique des séparateurs)
 * - `useDateRangeInput` : Saisie de plages de dates (parsing, formatage, validation range)
 * - `useDateAutoClamp` : Auto-correction des dates invalides (ex: 32/01 → 01/02)
 * - `useDateTextInputController` : Contrôleur haut niveau (validateOnSubmit, clamp, reset)
 *
 * ### Coordination réactive
 * - `useDatePickerSyncGuard` : Flags anti-boucle (isUpdatingFromInternal, ignoreNextInputBlur, etc.)
 *   et état d'interaction (hasInteracted, isManualInputActive). Le reset unifié via
 *   `queueMicrotask` garantit que tous les watchers Vue voient les flags avant leur reset.
 *
 * ### Logique calendrier partagée
 * - `useDatePickerCalendar` : Centralise la logique VDatePicker partagée entre
 *   ComplexDatePicker et CalendarMode/DatePicker (accessibilité, view mode, month/year nav)
 *
 * ### Sélection & validation
 * - `useDateSelection` : Gestion de la sélection (simple vs range), génération de plages
 * - `useDatePickerValidation` : Orchestrateur de validation (route vers validateDates / validateTextInput)
 * - `validateDateFormat` / `isDateComplete` : Utilitaires de validation de format (fonctions pures)
 * - `useDateRangeValidation` : Validation spécifique aux plages (start < end)
 *
 * ### UI & interaction
 * - `useDatePickerViewMode` : Gestion du mode d'affichage (year → months → month), birthDate
 * - `useDatePickerVisibility` : Ouverture/fermeture du calendrier, focus, click outside
 * - `useDisplayedDateString` : Formatage de la chaîne affichée dans le champ texte
 * - `useDatePickerInputBlurHandler` : Validation au blur du champ texte (sync modèle + validation)
 * - `useTodayButton` / `buildTodaySelectionState` : Bouton « Aujourd'hui »
 * - `useDatePickerState` : État interne (selectedDates, textInputValue, displayFormattedDate)
 * - `useSelectedDayAria` : Mise à jour de `aria-selected` sur le jour sélectionné
 * - `useDatePickerFocusTrap` : Focus trap dans le dialog (Tab/Shift+Tab/Escape)
 * - `useCalendarKeyboardNavigation` : Navigation par flèches dans la grille (APG)
 *
 * ### Valeurs dérivées
 * - `useDatePickerDerivedValues` : Computed partagés (returnFormat, minDate, maxDate)
 */

// Export all composables from CalendarMode/composables

// Date input and editing
export { useDateInputEditing } from './useDateInputEditing'
export { useDateRangeInput } from './useDateRangeInput'
export { useDateAutoClamp } from './useDateAutoClamp'
export { useDateTextInputController } from './useDateTextInputController'

// Sync guard (anti-loop flags + interaction state)
export { useDatePickerSyncGuard } from './useDatePickerSyncGuard'

// Shared calendar logic (accessibility, view mode, month/year navigation)
export { useDatePickerCalendar } from './useDatePickerCalendar'

// Date selection and validation
export { useDateSelection } from './useDateSelection'
export { createInactiveDatePickerValidationController, useDatePickerValidation } from './useDatePickerValidation'
export { validateDateFormat, isDateComplete } from './useDateFormatUtils'
export { useDateRangeValidation } from './useDateRangeValidation'

// CalendarMode UI and interaction
export { useDatePickerViewMode } from './useDatePickerViewMode'
export { useDatePickerVisibility } from './useDatePickerVisibility'
export { useDisplayedDateString } from './useDisplayedDateString'
export { useDatePickerInputBlurHandler } from './useDatePickerInputBlurHandler'
export { useTodayButton, buildTodaySelectionState } from './useTodayButton'
export { useDatePickerState } from './useDatePickerState'
export { useSelectedDayAria } from './useSelectedDayAria'
export { useDatePickerFocusTrap } from './useDatePickerFocusTrap'
export * from './useCalendarKeyboardNavigation'

// Derived values (shared computed)
export { useDatePickerDerivedValues } from './useDatePickerDerivedValues'

// Shared IDs
export { useDatePickerIds } from './useDatePickerIds'

// Shared focus target logic
export { useDatePickerFocusTarget } from './useDatePickerFocusTarget'

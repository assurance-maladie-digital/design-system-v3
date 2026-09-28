import { ref, type Ref } from 'vue'

/**
 * Centralise les flags de coordination anti-boucle et d'interaction
 * utilisés par les composants DatePicker (ComplexDatePicker, CalendarMode/DatePicker,
 * DateTextInput).
 *
 * ## Flags anti-boucle
 *
 * - `isUpdatingFromInternal` : Marque une mise à jour comme provenant de l'intérieur
 *   du composant (via `withInternalUpdate`). Les watchers qui synchronisent le modèle
 *   vérifient ce flag pour éviter de re-traiter une valeur qu'ils viennent d'émettre.
 *   Le reset via `queueMicrotask` garantit que les watchers Vue (flush en microtask)
 *   voient le flag `true` avant son reset.
 *
 * - `ignoreNextInputBlur` : flag one-shot consommé par `consumeIgnoreNextInputBlur`
 *   pour ignorer le blur provoqué par une ouverture programmatique.
 *
 * - `ignoreNextCalendarModelSync` : garde une synchronisation initiale de VDatePicker
 *   de manière à ne pas la confondre avec une sélection utilisateur. Le composant appelant
 *   définit son cycle de vie : consommation ponctuelle ou remise à `false` à la sélection/
 *   fermeture.
 *
 * ## État d'interaction
 *
 * - `hasInteracted` : Indique que l'utilisateur a interagi avec le champ (focus + saisie).
 *   Utilisé par la validation pour distinguer un champ vierge d'un champ abandonné.
 * - `isManualInputActive` : Indique que l'utilisateur est en train de saisir manuellement
 *   (par opposition à une sélection via calendrier). Désactivé au blur.
 */
export interface DatePickerSyncGuard {
	// Anti-loop flag — prevents watchers from re-processing internal updates
	isUpdatingFromInternal: Ref<boolean>
	withInternalUpdate: (fn: () => void) => void

	// Sync guards — the input blur is one-shot; callers define the calendar sync lifecycle.
	ignoreNextInputBlur: Ref<boolean>
	ignoreNextCalendarModelSync: Ref<boolean>
	consumeIgnoreNextInputBlur: () => boolean
	consumeIgnoreNextCalendarModelSync: () => boolean

	// Interaction state — tracks user engagement for validation gating
	hasInteracted: Ref<boolean>
	isManualInputActive: Ref<boolean>
	markInteracted: () => void
	markManualInputStart: () => void
	markManualInputEnd: () => void
	resetInteractionState: () => void
}

export const useDatePickerSyncGuard = (): DatePickerSyncGuard => {
	const isUpdatingFromInternal = ref(false)
	const ignoreNextInputBlur = ref(false)
	const ignoreNextCalendarModelSync = ref(false)
	const hasInteracted = ref(false)
	const isManualInputActive = ref(false)

	/**
	 * Exécute `fn` avec `isUpdatingFromInternal` à `true`,
	 * puis le reset via `queueMicrotask`. Les watchers Vue (flush: 'pre')
	 * sont également schedulés en microtask ; comme ils sont queue avant
	 * notre reset (fn() les déclenche, puis finally queue le reset),
	 * ils voient le flag `true` et sont bloqués, puis le reset s'exécute.
	 */
	const withInternalUpdate = (fn: () => void): void => {
		try {
			isUpdatingFromInternal.value = true
			fn()
		}
		finally {
			queueMicrotask(() => {
				isUpdatingFromInternal.value = false
			})
		}
	}

	/**
	 * Consomme le flag "ignorer le prochain blur".
	 * Retourne `true` si le blur devait être ignoré, et reset le flag.
	 */
	const consumeIgnoreNextInputBlur = (): boolean => {
		if (ignoreNextInputBlur.value) {
			ignoreNextInputBlur.value = false
			return true
		}
		return false
	}

	/**
	 * Consomme une garde de synchronisation du modèle calendrier.
	 * Les appelants qui couvrent une phase complète peuvent la remettre à `false` eux-mêmes.
	 */
	const consumeIgnoreNextCalendarModelSync = (): boolean => {
		if (ignoreNextCalendarModelSync.value) {
			ignoreNextCalendarModelSync.value = false
			return true
		}
		return false
	}

	const markInteracted = (): void => {
		hasInteracted.value = true
	}

	const markManualInputStart = (): void => {
		isManualInputActive.value = true
		hasInteracted.value = true
	}

	const markManualInputEnd = (): void => {
		isManualInputActive.value = false
	}

	const resetInteractionState = (): void => {
		hasInteracted.value = false
		isManualInputActive.value = false
	}

	return {
		isUpdatingFromInternal,
		withInternalUpdate,
		ignoreNextInputBlur,
		ignoreNextCalendarModelSync,
		consumeIgnoreNextInputBlur,
		consumeIgnoreNextCalendarModelSync,
		hasInteracted,
		isManualInputActive,
		markInteracted,
		markManualInputStart,
		markManualInputEnd,
		resetInteractionState,
	}
}

import { type Ref, nextTick, watch } from 'vue'
import { locales } from '../locales'
import type { ViewMode } from './useDatePickerViewMode'

/**
 * Options du composable `useYearListRegionAria`.
 */
export interface UseYearListRegionAriaOptions {
	/** Accès unifié à l'élément racine du calendrier (VDatePicker.$el ou dialog) */
	getRootEl: () => HTMLElement | null | undefined

	/** Visibilité du calendrier */
	isDatePickerVisible: Ref<boolean>

	/** Mode d'affichage courant (`year`, `months`, `month`) */
	currentViewMode: Ref<ViewMode>
}

/**
 * useYearListRegionAria — Nomme la région scrollable de la vue années.
 *
 * ## Rôle
 *
 * Vuetify rend `.v-date-picker-years__content` focusable (`tabindex="0"`) pour
 * permettre le scroll au clavier, mais sans nom ni rôle : un élément qui reçoit
 * le focus sans intitulé est annoncé « blanc » par les lecteurs d'écran.
 * Ce composable pose `role="region"` + `aria-label` sur cet élément quand la
 * vue années est affichée.
 *
 * ## Réapplication
 *
 * `applyYearListRegionAria` est **idempotent** : il doit être rejoué après les
 * transitions de `v-window-item` (le DOM de la vue peut être recréé, perdant
 * les attributs). Voir `handleViewModeUpdateWrapper` dans
 * `useDatePickerCalendar` qui l'appelle après la transition.
 */
export const useYearListRegionAria = (options: UseYearListRegionAriaOptions) => {
	const { getRootEl, isDatePickerVisible, currentViewMode } = options

	const applyYearListRegionAria = (): void => {
		const rootEl = getRootEl()
		const content = rootEl?.querySelector<HTMLElement>('.v-date-picker-years__content')
		if (!content) return

		if (content.getAttribute('role') !== 'region') {
			content.setAttribute('role', 'region')
		}
		content.setAttribute('aria-label', locales.yearListRegionLabel)
	}

	// Couvre l'ouverture du calendrier directement en vue années (isBirthDate) :
	// dans ce cas aucun `update:view-mode` n'est émis, le watch prend le relais.
	watch([isDatePickerVisible, currentViewMode], () => {
		if (!isDatePickerVisible.value || currentViewMode.value !== 'year') return
		nextTick(applyYearListRegionAria)
	}, { immediate: true })

	return { applyYearListRegionAria }
}

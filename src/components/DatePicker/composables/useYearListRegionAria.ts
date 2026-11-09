import { type Ref, nextTick, onBeforeUnmount, watch } from 'vue'
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
 * useYearListRegionAria — Structure ARIA du conteneur scrollable de la vue années.
 *
 * ## Rôle
 *
 * Vuetify rend `.v-date-picker-years__content` focusable (`tabindex="0"`), ce qui
 * ajoute un arrêt de tabulation avant l'année active. Ce composable pose
 * `role="rowgroup"` et `tabindex="-1"` (maintenu par un observateur, car Vuetify
 * réécrit `tabindex="0"` au focusout) quand la vue années est affichée.
 * Pas d'`aria-label` : le conteneur n'est plus focusable et la grille porte déjà
 * son nom (« Sélectionner une année »).
 *
 * `rowgroup` (et non `region`) car `__content` est l'enfant direct de
 * `.v-date-picker-years[role="grid"]` (cf. `applyOptionGridStructure` dans
 * `useDatePickerAccessibility`) : un grid n'admet que `row`/`rowgroup` comme
 * enfants possédés — tout autre rôle casse `aria-required-children`/`aria-required-parent`.
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

	let tabindexObserver: MutationObserver | undefined

	const stopTabindexGuard = (): void => {
		tabindexObserver?.disconnect()
		tabindexObserver = undefined
	}

	// Vuetify réécrit tabindex=0 sur le conteneur au focusout : on le maintient à -1.
	const guardContainerTabindex = (content: HTMLElement): void => {
		stopTabindexGuard()
		if (typeof MutationObserver === 'undefined') return
		tabindexObserver = new MutationObserver(() => {
			if (content.getAttribute('tabindex') !== '-1') {
				content.setAttribute('tabindex', '-1')
			}
		})
		tabindexObserver.observe(content, { attributes: true, attributeFilter: ['tabindex'] })
	}

	onBeforeUnmount(stopTabindexGuard)

	const applyYearListRegionAria = (): void => {
		const rootEl = getRootEl()
		const content = rootEl?.querySelector<HTMLElement>('.v-date-picker-years__content')
		if (!content) return

		if (content.getAttribute('role') !== 'rowgroup') {
			content.setAttribute('role', 'rowgroup')
		}
		// Un seul arrêt de tabulation (roving tabindex sur les années) : le conteneur n'en est pas un.
		content.setAttribute('tabindex', '-1')
		guardContainerTabindex(content)
	}

	// Couvre l'ouverture du calendrier directement en vue années (isBirthDate) :
	// dans ce cas aucun `update:view-mode` n'est émis, le watch prend le relais.
	watch([isDatePickerVisible, currentViewMode], () => {
		if (!isDatePickerVisible.value || currentViewMode.value !== 'year') return
		nextTick(applyYearListRegionAria)
	}, { immediate: true })

	return { applyYearListRegionAria }
}

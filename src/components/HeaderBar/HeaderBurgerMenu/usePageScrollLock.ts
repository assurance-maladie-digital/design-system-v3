import { type MaybeRefOrGetter, onScopeDispose, toValue, watch } from 'vue'

interface PreviousOverflow {
	html: string
	body: string
}

/**
 * Bloque le défilement de la page tant que `locked` vaut `true`.
 *
 * Les valeurs inline de `overflow` sur `html` et `body` sont mémorisées au verrouillage,
 * puis restaurées au déverrouillage et à la destruction du scope (démontage du composant).
 * Rien n'est modifié tant que le verrouillage n'a pas eu lieu : un `overflow` défini par
 * la page (inline ou feuille de style) est préservé.
 */
export function usePageScrollLock(locked: MaybeRefOrGetter<boolean>): void {
	let previousOverflow: PreviousOverflow | null = null

	const lock = (): void => {
		if (typeof document === 'undefined' || previousOverflow) return
		previousOverflow = {
			html: document.documentElement.style.overflow,
			body: document.body.style.overflow,
		}
		document.documentElement.style.overflow = 'hidden'
		document.body.style.overflow = 'hidden'
	}

	const unlock = (): void => {
		if (typeof document === 'undefined' || !previousOverflow) return
		document.documentElement.style.overflow = previousOverflow.html
		document.body.style.overflow = previousOverflow.body
		previousOverflow = null
	}

	watch(() => toValue(locked), isLocked => (isLocked ? lock() : unlock()), { immediate: true })
	onScopeDispose(unlock)
}

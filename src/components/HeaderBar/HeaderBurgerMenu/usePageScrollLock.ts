import { type MaybeRefOrGetter, onScopeDispose, toValue, watch } from 'vue'

// Le raccourci et ses propriétés détaillées : un `overflow-y` inline seul se lit `''` via
// le raccourci, et serait perdu si seul `overflow` était mémorisé. Ordre de restauration :
// le raccourci d'abord, pour qu'il ne réécrive pas les propriétés détaillées.
const OVERFLOW_PROPERTIES = ['overflow', 'overflow-x', 'overflow-y'] as const

type OverflowProperty = typeof OVERFLOW_PROPERTIES[number]

interface InlineDeclaration {
	property: OverflowProperty
	value: string
	priority: string
}

function readInlineOverflow(style: CSSStyleDeclaration): InlineDeclaration[] {
	return OVERFLOW_PROPERTIES.map(property => ({
		property,
		value: style.getPropertyValue(property),
		priority: style.getPropertyPriority(property),
	}))
}

function clearInlineOverflow(style: CSSStyleDeclaration): void {
	OVERFLOW_PROPERTIES.forEach(property => style.removeProperty(property))
}

/**
 * Bloque le défilement de la page tant que `locked` vaut `true`.
 *
 * Les déclarations inline `overflow`, `overflow-x` et `overflow-y` de `html` et `body`,
 * priorité `!important` comprise, sont mémorisées au verrouillage, puis restaurées au
 * déverrouillage et à la destruction du scope (démontage du composant).
 * Rien n'est modifié tant que le verrouillage n'a pas eu lieu : un `overflow` défini par
 * la page (inline ou feuille de style) est préservé.
 */
export function usePageScrollLock(locked: MaybeRefOrGetter<boolean>): void {
	let saved: Map<CSSStyleDeclaration, InlineDeclaration[]> | null = null

	const lock = (): void => {
		if (typeof document === 'undefined' || saved) return
		const styles = [document.documentElement.style, document.body.style]
		saved = new Map(styles.map(style => [style, readInlineOverflow(style)]))
		for (const style of styles) {
			clearInlineOverflow(style)
			style.setProperty('overflow', 'hidden')
		}
	}

	const unlock = (): void => {
		if (typeof document === 'undefined' || !saved) return
		for (const [style, declarations] of saved) {
			clearInlineOverflow(style)
			for (const { property, value, priority } of declarations) {
				if (value) style.setProperty(property, value, priority)
			}
		}
		saved = null
	}

	watch(() => toValue(locked), isLocked => (isLocked ? lock() : unlock()), { immediate: true })
	onScopeDispose(unlock)
}

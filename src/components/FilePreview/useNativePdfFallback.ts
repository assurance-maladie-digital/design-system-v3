import { type ComputedRef, type MaybeRefOrGetter, type Ref, computed, nextTick, onUnmounted, ref, toValue, watch } from 'vue'

export interface UseNativePdfFallback {
	/** Le rendu pdf.js doit remplacer l'`<object>` natif. */
	prefersPdfJs: ComputedRef<boolean>
	/** La sonde a rendu son verdict : le contenu de repli peut cesser d'être masqué. */
	probeDone: Ref<boolean>
	/** Élément de repli de l'`<object>`, mesuré par la sonde (à lier via `ref`). */
	fallbackRef: Ref<HTMLElement | undefined>
}

/**
 * Sans lecteur PDF intégré, un `<object type="application/pdf">` n'affiche rien — pas
 * même son contenu de repli, ou n'affiche que celui-ci. Deux signaux déclaratifs :
 *
 * - `navigator.pdfViewerEnabled === false` : le navigateur déclare lui-même l'absence
 *   de lecteur intégré ;
 * - à défaut, l'UA : Chrome sur Android déclare `pdfViewerEnabled` à `true` alors qu'il
 *   n'affiche aucun PDF embarqué (#2508). On y repère les navigateurs Chromium sur
 *   Android, les seuls concernés ; même réduite, leur UA conserve `Android` et `Chrome/`.
 *
 * Firefox Android et Safari iOS affichent bien les PDF embarqués : ils ne portent pas
 * le jeton `Chrome/` et conservent donc le rendu natif, comme les navigateurs desktop.
 */
function hasNativePdfViewer(): boolean {
	if (typeof navigator === 'undefined') return true
	if (navigator.pdfViewerEnabled === false) return false
	const ua = navigator.userAgent ?? ''
	return !(ua.includes('Android') && ua.includes('Chrome/'))
}

// Laisse au lecteur natif le temps de remplacer le contenu de repli. La source étant
// une URL objet (aucun aller-retour réseau), ce délai reste imperceptible.
const PROBE_DELAY = 400

/**
 * Décide quel moteur de rendu PDF utiliser : le lecteur natif du navigateur
 * (`<object>`) ou pdf.js.
 *
 * Aucune déclaration du navigateur n'étant fiable (Chrome sur Android annonce un
 * lecteur PDF qu'il n'a pas), la décision *a priori* est doublée d'une **sonde du
 * rendu réel** : un `<object>` qui n'affiche pas le PDF rend son contenu de repli,
 * lequel occupe alors une boîte dans la page. Une hauteur non nulle après chargement
 * signe l'échec du rendu natif, quel que soit le navigateur.
 *
 * @param file - Document affiché : la sonde est relancée à chaque changement.
 * @param isNativeWanted - `true` quand le rendu natif est celui qu'on chercherait à
 * utiliser (fichier PDF, et pdf.js non demandé explicitement par le consommateur).
 */
export function useNativePdfFallback(
	file: MaybeRefOrGetter<File | Blob | undefined>,
	isNativeWanted: MaybeRefOrGetter<boolean>,
): UseNativePdfFallback {
	const isNativeUnsupported = !hasNativePdfViewer()
	const nativeRenderingFailed = ref(false)
	const fallbackRef = ref<HTMLElement>()
	// Tant que la sonde n'a pas tranché, le contenu de repli est masqué : sans cela son
	// message d'échec s'affiche le temps de la mesure, avant d'être remplacé par le PDF.
	const probeDone = ref(false)

	const prefersPdfJs = computed(() => isNativeUnsupported || nativeRenderingFailed.value)
	// L'<object> natif est réellement à l'écran : il y a donc quelque chose à sonder.
	const isNativeRendered = computed(() => toValue(isNativeWanted) && !prefersPdfJs.value)

	let probeTimeout: ReturnType<typeof setTimeout> | undefined
	// La programmation de la sonde traverse un `await` : le composant peut être démonté
	// entre-temps, auquel cas il n'y a plus rien à mesurer.
	let isMounted = true

	const cancelProbe = (): void => {
		if (probeTimeout === undefined) return
		clearTimeout(probeTimeout)
		probeTimeout = undefined
	}

	const probe = (): void => {
		probeTimeout = undefined
		const fallback = fallbackRef.value
		if (!fallback || nativeRenderingFailed.value) return
		if (fallback.getBoundingClientRect().height > 0) {
			nativeRenderingFailed.value = true
		}
		// Le rendu natif a fonctionné : le repli n'a aucune boîte, on peut le démasquer
		// sans rien afficher, et il redevient visible si le PDF disparaît par la suite.
		probeDone.value = true
	}

	// Un échec de rendu peut tenir au document (PDF que le lecteur natif refuse) ou à une
	// mesure faussée autant qu'au navigateur : chaque nouveau fichier repart donc d'une
	// décision neuve, plutôt que d'hériter d'un verdict qui ne le concerne pas. Les
	// navigateurs sans lecteur natif, eux, sont déjà écartés par `isNativeUnsupported` :
	// ils ne repassent pas par la sonde.
	watch(() => toValue(file), () => {
		nativeRenderingFailed.value = false
	})

	// Sonde le rendu natif à chaque fois que l'<object> est (ré)affiché.
	watch([() => toValue(file), isNativeRendered], async ([, isRendered]) => {
		cancelProbe()
		if (!isRendered) return
		probeDone.value = false
		await nextTick()
		if (!isMounted) return
		probeTimeout = setTimeout(probe, PROBE_DELAY)
	}, { immediate: true })

	onUnmounted(() => {
		isMounted = false
		cancelProbe()
	})

	return { prefersPdfJs, probeDone, fallbackRef }
}

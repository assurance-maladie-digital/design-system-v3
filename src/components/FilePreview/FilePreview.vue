<script setup lang="ts">
	import deepmerge from 'deepmerge'
	import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'
	import { usePdfConsultation } from './usePdfConsultation'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	const props = withDefaults(defineProps<{
		file?: File | Blob
		options?: {
			pdf?: Record<string, string>
			image?: Record<string, string>
		}
		locales?: DeepPartial<typeof defaultLocales>
		/** Active le suivi de consultation du PDF (rendu via pdf.js, chargé à la demande). */
		trackConsultation?: boolean
		/**
		 * Aperçu en lecture seule : rendu via pdf.js sans barre d'outils native
		 * (téléchargement, impression et annotation indisponibles).
		 */
		readonly?: boolean
		/** URL du worker pdf.js (optionnel, sinon worker bundlé). */
		pdfWorkerSrc?: string
	}>(), {
		file: undefined,
		options: undefined,
		locales: () => ({}),
		trackConsultation: false,
		readonly: false,
		pdfWorkerSrc: undefined,
	})

	const locales = useLocales(defaultLocales, () => props.locales)

	const emit = defineEmits<{
		/**
		 * Émis quand le PDF est entièrement chargé et rendu via pdf.js. Reçoit le nombre
		 * de pages. C'est un signal de **rendu** : il se déclenche pour tout rendu pdf.js
		 * (`readonly` ou `track-consultation`), indépendamment du suivi de consultation.
		 * Non émis en mode natif par défaut (`<object>`) ni pour les images.
		 */
		loaded: [pageCount: number]
	}>()

	/**
	 * État de consultation complète du document (`v-model:complete`).
	 * Passe à `true` quand l'utilisateur atteint la fin, et revient à `false`
	 * lors du chargement d'un nouveau document. L'événement `update:complete`
	 * correspondant est émis à chaque changement de cet état.
	 */
	const complete = defineModel<boolean>('complete', { default: false })

	const fileURL = ref('')
	const isPdf = computed(() => props.file?.type === 'application/pdf')
	const isImage = computed(() => props.file ? /^image\//.test(props.file.type) : false)
	const filePreviewOptions = computed(() => deepmerge(config, props.options || {}))

	const {
		isLoading,
		hasError,
		isComplete,
		render,
		checkScrollComplete,
	} = usePdfConsultation()

	/** `navigator.userAgentData` n'est pas typé par lib.dom (User-Agent Client Hints). */
	type NavigatorWithUAData = Navigator & { userAgentData?: { mobile?: boolean } }

	/**
	 * Sans lecteur PDF intégré, un `<object type="application/pdf">` n'affiche rien — pas
	 * même son contenu de repli, ou n'affiche que celui-ci. Trois signaux successifs,
	 * car aucun ne suffit seul :
	 *
	 * - `navigator.pdfViewerEnabled === false` : le navigateur déclare lui-même l'absence
	 *   de lecteur intégré ;
	 * - `userAgentData.mobile === true` : Chrome sur Android déclare `pdfViewerEnabled`
	 *   à `true` alors qu'il n'affiche aucun PDF embarqué (#2508). Sa déclaration étant
	 *   fausse, on ne fait pas confiance au rendu natif sur un navigateur mobile ;
	 * - à défaut, l'UA : `userAgentData` n'est exposé qu'en contexte sécurisé, donc absent
	 *   dès qu'une page est servie en `http://` (Storybook local ouvert depuis un mobile,
	 *   intranet…). On y repère les navigateurs Chromium sur Android, les seuls concernés.
	 *
	 * Firefox Android et Safari iOS affichent bien les PDF embarqués : ils ne portent pas
	 * le jeton `Chrome/` et conservent donc le rendu natif, comme les navigateurs desktop.
	 */
	const hasNativePdfViewer = ((): boolean => {
		if (typeof navigator === 'undefined') return true
		const nav = navigator as NavigatorWithUAData
		if (nav.pdfViewerEnabled === false) return false
		if (nav.userAgentData?.mobile === true) return false
		const ua = nav.userAgent ?? ''
		return !(ua.includes('Android') && ua.includes('Chrome/'))
	})()

	/**
	 * Filet de sécurité : aucune déclaration du navigateur n'est fiable (Chrome sur
	 * Android annonce un lecteur PDF qu'il n'a pas), on observe donc le résultat réel.
	 *
	 * Un `<object>` qui n'affiche pas le PDF rend son contenu de repli : ce paragraphe
	 * occupe alors une boîte dans la page. Quand le lecteur natif prend la main, le
	 * contenu de repli n'est pas rendu et n'a aucune boîte. Une hauteur non nulle après
	 * chargement signe donc l'échec du rendu natif, quel que soit le navigateur.
	 */
	const nativePdfFailed = ref(false)
	const objectFallbackRef = ref<HTMLElement>()
	// Tant que la sonde n'a pas tranché, le contenu de repli est masqué : sans cela son
	// message d'échec s'affiche le temps de la mesure, avant d'être remplacé par le PDF.
	const nativePdfProbeDone = ref(false)
	let nativePdfProbe: ReturnType<typeof setTimeout> | undefined

	// Laisse au lecteur natif le temps de remplacer le contenu de repli. La source étant
	// une URL objet (aucun aller-retour réseau), ce délai reste imperceptible.
	const NATIVE_PDF_PROBE_DELAY = 400

	const cancelNativePdfProbe = (): void => {
		if (nativePdfProbe === undefined) return
		clearTimeout(nativePdfProbe)
		nativePdfProbe = undefined
	}

	const probeNativePdfRendering = (): void => {
		nativePdfProbe = undefined
		const fallback = objectFallbackRef.value
		if (!fallback || nativePdfFailed.value) return
		if (fallback.getBoundingClientRect().height > 0) {
			nativePdfFailed.value = true
		}
		// Le rendu natif a fonctionné : le repli n'a aucune boîte, on peut le démasquer
		// sans rien afficher, et il redevient visible si le PDF disparaît par la suite.
		nativePdfProbeDone.value = true
	}

	// Suivi de consultation (scroll → fin de lecture), uniquement pour les PDF
	const isTracking = computed(() => props.trackConsultation && isPdf.value)
	// Rendu embarqué pdf.js : requis par le suivi de consultation, par la lecture seule,
	// et utilisé en repli quand le navigateur ne sait pas afficher un PDF nativement.
	const isEmbedded = computed(() => isPdf.value
		&& (props.trackConsultation || props.readonly || !hasNativePdfViewer || nativePdfFailed.value))

	// Sonde le rendu natif à chaque fois que l'<object> est (ré)affiché.
	watch([() => props.file, isEmbedded], async () => {
		cancelNativePdfProbe()
		if (!isPdf.value || isEmbedded.value) return
		nativePdfProbeDone.value = false
		await nextTick()
		nativePdfProbe = setTimeout(probeNativePdfRendering, NATIVE_PDF_PROBE_DELAY)
	}, { immediate: true })

	onUnmounted(cancelNativePdfProbe)

	// Le rendu pdf.js a échoué : on propose un téléchargement pour ne pas laisser
	// l'utilisateur sans accès au document. Jamais en lecture seule, où le téléchargement
	// est justement l'action que l'on retire.
	const canDownloadOnError = computed(() => isEmbedded.value && hasError.value && !props.readonly)

	// `fileURL` (URL objet) n'est consommée que par <img> (images), <object> (PDF en mode
	// natif) et le lien de secours ci-dessus. En rendu embarqué pdf.js (readonly /
	// track-consultation), c'est le viewer qui affiche le PDF via arrayBuffer() → créer
	// une URL objet serait inutile.
	const needsObjectUrl = computed(() => isImage.value
		|| (isPdf.value && !isEmbedded.value)
		|| canDownloadOnError.value)

	// `File` porte un nom, pas `Blob` : on retombe sur un nom générique.
	const downloadName = computed(() => (props.file instanceof File ? props.file.name : 'document.pdf'))

	const getFileURL = () => {
		// Révoque et réinitialise l'URL précédente : sans cela, chaque changement de
		// fichier (ou de mode) fuit l'ancienne URL, jamais révoquée. No-op si vide.
		revokeFileURL()
		fileURL.value = ''
		if (!props.file || !needsObjectUrl.value) return
		fileURL.value = URL.createObjectURL(props.file)
	}

	const revokeFileURL = () => {
		if (!fileURL.value) return
		URL.revokeObjectURL(fileURL.value)
	}

	// Recrée l'URL au changement de fichier ET quand le besoin bascule (ex. `readonly`
	// activé/désactivé) : le viewer pdf.js et l'<object> natif n'utilisent pas la même source.
	watch([() => props.file, needsObjectUrl], getFileURL, { immediate: true })

	onUnmounted(revokeFileURL)

	// --- Suivi de consultation (pdf.js) --------------------------------------
	const viewerRef = ref<HTMLElement>()
	const pagesHostRef = ref<HTMLElement>()

	const viewerStyle = computed(() => ({
		height: filePreviewOptions.value.pdf?.height ?? '556px',
	}))

	async function loadPdf(): Promise<void> {
		await nextTick()
		if (!isEmbedded.value || !props.file || !pagesHostRef.value) {
			return
		}
		const data = await props.file.arrayBuffer()
		const pageCount = await render(data, pagesHostRef.value, {
			workerSrc: props.pdfWorkerSrc,
		})
		if (pageCount !== null) {
			emit('loaded', pageCount)
			// Document plus court que le conteneur : consultation déjà complète
			if (isTracking.value) {
				await nextTick()
				if (viewerRef.value) {
					checkScrollComplete(viewerRef.value)
				}
			}
		}
	}

	function onViewerScroll(): void {
		if (isTracking.value && viewerRef.value) {
			checkScrollComplete(viewerRef.value)
		}
	}

	// En lecture seule : bloque le menu contextuel (clic droit → « Enregistrer… »).
	// Attaché par programmation pour éviter un handler clic sur élément non interactif.
	const preventContextMenu = (event: Event): void => event.preventDefault()

	watch([viewerRef, () => props.readonly], ([el], [prevEl]) => {
		prevEl?.removeEventListener('contextmenu', preventContextMenu)
		el?.removeEventListener('contextmenu', preventContextMenu)
		if (el && props.readonly) {
			el.addEventListener('contextmenu', preventContextMenu)
		}
	})

	// Nettoyage au démontage : retire le listener si le composant est détruit en lecture seule.
	onUnmounted(() => {
		viewerRef.value?.removeEventListener('contextmenu', preventContextMenu)
	})

	// Synchronise l'état de consultation (true à la fin, false au rechargement)
	watch(isComplete, (value) => {
		complete.value = value
	})

	watch([() => props.file, isEmbedded], loadPdf, { immediate: true })
</script>

<template>
	<div
		v-if="file"
		class="sy-file-preview"
	>
		<div
			v-if="isEmbedded"
			ref="viewerRef"
			class="sy-file-preview__pdf-viewer"
			:style="viewerStyle"
			role="document"
			:aria-label="locales.previewNotAvailable"
			tabindex="0"
			@scroll="onViewerScroll"
		>
			<div
				ref="pagesHostRef"
				class="sy-file-preview__pages"
				aria-hidden="true"
			/>
			<p
				v-if="isLoading"
				class="sy-file-preview__status pa-4 text-center mb-0"
			>
				{{ locales.loadingDocument }}
			</p>
			<div
				v-else-if="hasError"
				class="sy-file-preview__status pa-4 text-center"
			>
				<p class="mb-0">
					{{ locales.documentError }}
				</p>

				<a
					v-if="canDownloadOnError && fileURL"
					class="sy-file-preview__download d-inline-block mt-2"
					:href="fileURL"
					:download="downloadName"
				>
					{{ locales.downloadDocument }}
				</a>
			</div>
		</div>

		<object
			v-else-if="isPdf"
			:data="fileURL"
			v-bind="filePreviewOptions.pdf"
			type="application/pdf"
			@load="revokeFileURL"
		>
			<p
				ref="objectFallbackRef"
				class="mb-0"
				:class="{ 'sy-file-preview__object-fallback--probing': !nativePdfProbeDone }"
			>{{ locales.previewNotAvailable }}</p>
		</object>

		<img
			v-else-if="isImage"
			:src="fileURL"
			:alt="filePreviewOptions.image.alt || ''"
			v-bind="filePreviewOptions.image"
			@load="revokeFileURL"
		>

		<slot v-else>
			<p class="mb-0">
				{{ locales.previewTypeNotAvailable }}
			</p>
		</slot>
	</div>
</template>

<style lang="scss" scoped>
.sy-file-preview__pdf-viewer {
	overflow: hidden auto;
	background-color: #f4f4f4;

	&:focus-visible {
		outline: 2px solid rgb(var(--v-theme-primary));
		outline-offset: -2px;
	}
}

.sy-file-preview__pages {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
	padding: 8px;
}

.sy-file-preview__page {
	display: block;
	max-width: 100%;
	box-shadow: 0 1px 4px rgb(0 0 0 / 15%);
}

.sy-file-preview__status {
	color: rgb(var(--v-theme-primary));
}

// `visibility` et non `display` : le contenu de repli doit conserver sa boîte pour
// rester mesurable par la sonde de rendu natif.
.sy-file-preview__object-fallback--probing {
	visibility: hidden;
}

.sy-file-preview__download {
	color: rgb(var(--v-theme-primary));
}
</style>

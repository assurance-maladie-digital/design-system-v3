<script setup lang="ts">
	import deepmerge from 'deepmerge'
	import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
	import { config } from './config'
	import { locales as defaultLocales } from './locales'
	import { useNativePdfFallback, type PdfProbeDelays } from './useNativePdfFallback'
	import { usePdfConsultation } from './usePdfConsultation'
	import { useLocales } from '@/composables/useLocales'
	import type { DeepPartial } from '@/utils/locales/mergeLocales'

	const props = withDefaults(defineProps<{
		file?: File | Blob
		options?: {
			pdf?: Record<string, string>
			image?: Record<string, string>
			/** Délais de la sonde de rendu natif (appareils lents à afficher les PDF). */
			pdfProbe?: PdfProbeDelays
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

	// Suivi de consultation (scroll → fin de lecture), uniquement pour les PDF
	const isTracking = computed(() => props.trackConsultation && isPdf.value)

	// Quel moteur de rendu PDF utiliser ? Le composable isole cette règle : signaux du
	// navigateur, puis sonde du rendu réel de l'<object>.
	const {
		prefersPdfJs,
		probeDone: nativePdfProbeDone,
		fallbackRef: objectFallbackRef,
	} = useNativePdfFallback(
		() => props.file,
		() => isPdf.value && !props.trackConsultation && !props.readonly,
		() => filePreviewOptions.value.pdfProbe,
	)

	// Rendu embarqué pdf.js : requis par le suivi de consultation, par la lecture seule,
	// et utilisé en repli quand le navigateur ne sait pas afficher un PDF nativement.
	const isEmbedded = computed(() => isPdf.value
		&& (props.trackConsultation || props.readonly || prefersPdfJs.value))

	// Le rendu pdf.js a échoué : on propose un téléchargement pour ne pas laisser
	// l'utilisateur sans accès au document. Jamais en lecture seule, où le téléchargement
	// est justement l'action que l'on retire.
	const canDownloadOnError = computed(() => isEmbedded.value && hasError.value && !props.readonly)

	// Le rendu pdf.js se fait en <canvas>, non restitué aux lecteurs d'écran : le slot
	// `alternative` permet au consommateur d'exposer un équivalent accessible du document.
	// Repli subi : le consommateur n'a demandé ni `readonly` ni `track-consultation`, mais
	// le navigateur impose pdf.js. Il perd alors la barre d'outils native (téléchargement,
	// impression) et le texte restitué aux lecteurs d'écran ; le lien de téléchargement
	// rétablit au moins l'accès au document source.
	const isNativePdfFallback = computed(() => isEmbedded.value
		&& !props.trackConsultation
		&& !props.readonly)

	// `fileURL` (URL objet) n'est consommée que par <img> (images), <object> (PDF en mode
	// natif) et le lien de secours ci-dessus. En rendu embarqué pdf.js (readonly /
	// track-consultation), c'est le viewer qui affiche le PDF via arrayBuffer() → créer
	// une URL objet serait inutile.
	const needsObjectUrl = computed(() => isImage.value
		|| (isPdf.value && !isEmbedded.value)
		|| canDownloadOnError.value
		|| isNativePdfFallback.value)

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

	// L'URL objet reste valide tant que le fichier est affiché : la révoquer au chargement
	// casserait tout ce qui la re-sollicite ensuite — actions du lecteur natif
	// (téléchargement, impression, rechargement) et lien de secours après un repli.
	// Elle est libérée au changement de fichier et au démontage.
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
		const pageCount = await render(props.file, pagesHostRef.value, {
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
			:aria-label="locales.documentLabel"
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
		>

		<slot v-else>
			<p class="mb-0">
				{{ locales.previewTypeNotAvailable }}
			</p>
		</slot>

		<template v-if="isEmbedded">
			<div
				v-if="$slots.alternative"
				class="sy-file-preview__alternative"
			>
				<slot name="alternative" />
			</div>

			<a
				v-if="isNativePdfFallback && !hasError && fileURL"
				class="sy-file-preview__download d-inline-block mt-2"
				:href="fileURL"
				:download="downloadName"
			>
				{{ locales.downloadDocument }}
			</a>
		</template>
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

.sy-file-preview__alternative {
	margin-top: 8px;
}

.sy-file-preview__download {
	color: rgb(var(--v-theme-primary));
}
</style>

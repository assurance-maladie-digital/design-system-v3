import { describe, it, expect, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useNativePdfFallback } from '../useNativePdfFallback'

/** Monte le composable dans un composant jetable : il utilise `onUnmounted`. */
function withSetup<T>(setup: () => T): { result: T, wrapper: ReturnType<typeof mount> } {
	let result!: T
	const wrapper = mount(defineComponent({
		setup() {
			result = setup()
			return () => h('div')
		},
	}))
	return { result, wrapper }
}

const DESKTOP_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36'
const ANDROID_CHROME_UA = 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
const ANDROID_FIREFOX_UA = 'Mozilla/5.0 (Android 14; Mobile; rv:140.0) Gecko/140.0 Firefox/140.0'
const IOS_SAFARI_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'

const originalUserAgent = navigator.userAgent

function setUserAgent(value: string): void {
	Object.defineProperty(navigator, 'userAgent', { value, configurable: true })
}

/** Simule `navigator.userAgentData` (User-Agent Client Hints), absent de jsdom. */
function setUserAgentData(value: { mobile: boolean } | undefined): void {
	if (value === undefined) {
		Reflect.deleteProperty(navigator, 'userAgentData')
		return
	}
	Object.defineProperty(navigator, 'userAgentData', { value, configurable: true })
}

function setNativePdfViewer(value: boolean | undefined): void {
	if (value === undefined) {
		Reflect.deleteProperty(navigator, 'pdfViewerEnabled')
		return
	}
	Object.defineProperty(navigator, 'pdfViewerEnabled', { value, configurable: true })
}

/** Élément de repli mesurable : une hauteur non nulle signe l'échec du rendu natif. */
function fallbackElement(height: number): HTMLElement {
	const element = document.createElement('p')
	element.getBoundingClientRect = () => ({ height } as DOMRect)
	return element
}

/** Laisse le temps à la sonde (400 ms côté composable) de se déclencher. */
function waitForProbe(): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, 450))
}

const pdfFile = (): File => new File(['%PDF-1.4'], 'contrat.pdf', { type: 'application/pdf' })

afterEach(() => {
	setNativePdfViewer(undefined)
	setUserAgentData(undefined)
	setUserAgent(originalUserAgent)
})

describe('useNativePdfFallback', () => {
	it('préfère le rendu natif quand le navigateur déclare un lecteur PDF', () => {
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), true))

		expect(result.prefersPdfJs.value).toBe(false)

		wrapper.unmount()
	})

	it('préfère pdf.js quand le navigateur déclare ne pas savoir afficher les PDF', () => {
		setNativePdfViewer(false)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), true))

		expect(result.prefersPdfJs.value).toBe(true)

		wrapper.unmount()
	})

	it('préfère pdf.js sur Chrome Android, dont la déclaration est fausse', () => {
		setNativePdfViewer(true)
		setUserAgent(ANDROID_CHROME_UA)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), true))

		expect(result.prefersPdfJs.value).toBe(true)

		wrapper.unmount()
	})

	it('conserve le rendu natif sur Firefox Android, qui affiche bien les PDF', () => {
		setNativePdfViewer(true)
		setUserAgent(ANDROID_FIREFOX_UA)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), true))

		expect(result.prefersPdfJs.value).toBe(false)

		wrapper.unmount()
	})

	it.each([
		['Firefox Android', ANDROID_FIREFOX_UA],
		['Safari iOS', IOS_SAFARI_UA],
	])('ignore les Client Hints : %s reste en rendu natif malgré `mobile: true`', (_name, userAgent) => {
		// La détection ne s'appuie volontairement pas sur `userAgentData.mobile` : ce
		// signal disqualifierait tout mobile, alors que seuls les Chromium sur Android
		// n'affichent pas les PDF embarqués (#2508).
		setNativePdfViewer(true)
		setUserAgentData({ mobile: true })
		setUserAgent(userAgent)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), true))

		expect(result.prefersPdfJs.value).toBe(false)

		wrapper.unmount()
	})

	it('bascule sur pdf.js quand la sonde mesure le contenu de repli', async () => {
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), true))
		result.fallbackRef.value = fallbackElement(18)

		expect(result.probeDone.value).toBe(false)

		await waitForProbe()

		expect(result.prefersPdfJs.value).toBe(true)
		expect(result.probeDone.value).toBe(true)

		wrapper.unmount()
	})

	it('conserve le rendu natif quand le contenu de repli n\'occupe aucune boîte', async () => {
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), true))
		result.fallbackRef.value = fallbackElement(0)

		await waitForProbe()

		expect(result.prefersPdfJs.value).toBe(false)
		expect(result.probeDone.value).toBe(true)

		wrapper.unmount()
	})

	it('ne sonde pas quand le rendu natif n\'est pas celui recherché (pdf.js demandé)', async () => {
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), false))
		result.fallbackRef.value = fallbackElement(18)

		await waitForProbe()

		expect(result.prefersPdfJs.value).toBe(false)
		expect(result.probeDone.value).toBe(false)

		wrapper.unmount()
	})

	it('resonde au changement de fichier : l\'échec n\'est pas hérité par le suivant', async () => {
		// Un échec peut tenir au document (PDF refusé par le lecteur natif) autant qu'au
		// navigateur : le verdict ne doit pas être acquis pour les fichiers suivants.
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const file = ref<File | undefined>(pdfFile())
		const { result, wrapper } = withSetup(() => useNativePdfFallback(file, true))
		result.fallbackRef.value = fallbackElement(18)

		await waitForProbe()

		expect(result.prefersPdfJs.value).toBe(true)

		file.value = new File(['%PDF-1.4'], 'avenant.pdf', { type: 'application/pdf' })
		await nextTick()

		// Décision neuve : le rendu natif est retenté pour ce document.
		expect(result.prefersPdfJs.value).toBe(false)
		expect(result.probeDone.value).toBe(false)

		result.fallbackRef.value = fallbackElement(0)
		await waitForProbe()

		expect(result.prefersPdfJs.value).toBe(false)
		expect(result.probeDone.value).toBe(true)

		wrapper.unmount()
	})

	it('rebascule sur pdf.js si le fichier suivant échoue lui aussi', async () => {
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const file = ref<File | undefined>(pdfFile())
		const { result, wrapper } = withSetup(() => useNativePdfFallback(file, true))
		result.fallbackRef.value = fallbackElement(18)

		await waitForProbe()

		file.value = new File(['%PDF-1.4'], 'avenant.pdf', { type: 'application/pdf' })
		await nextTick()
		result.fallbackRef.value = fallbackElement(18)
		await waitForProbe()

		expect(result.prefersPdfJs.value).toBe(true)

		wrapper.unmount()
	})

	it('ne resonde pas sur un navigateur sans lecteur natif : pas de retour à l\'<object>', async () => {
		setNativePdfViewer(false)

		const file = ref<File | undefined>(pdfFile())
		const { result, wrapper } = withSetup(() => useNativePdfFallback(file, true))

		expect(result.prefersPdfJs.value).toBe(true)

		file.value = new File(['%PDF-1.4'], 'avenant.pdf', { type: 'application/pdf' })
		await nextTick()

		expect(result.prefersPdfJs.value).toBe(true)

		wrapper.unmount()
	})

	it('n\'exécute pas la sonde après le démontage', async () => {
		setNativePdfViewer(true)
		setUserAgent(DESKTOP_UA)

		const { result, wrapper } = withSetup(() => useNativePdfFallback(ref(pdfFile()), true))
		result.fallbackRef.value = fallbackElement(18)

		wrapper.unmount()
		await waitForProbe()

		expect(result.prefersPdfJs.value).toBe(false)
		expect(result.probeDone.value).toBe(false)
	})
})

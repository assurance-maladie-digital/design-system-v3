// @vitest-environment jsdom

import { beforeAll, afterAll, describe, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { axe } from 'vitest-axe'
import { assertNoA11yViolations } from '@tests/unit/accessibility/axeUtils'
import FilePreview from '../FilePreview.vue'

let originalCreateObjectURL: typeof URL.createObjectURL
let originalRevokeObjectURL: typeof URL.revokeObjectURL

beforeAll(() => {
	originalCreateObjectURL = URL.createObjectURL
	originalRevokeObjectURL = URL.revokeObjectURL
	// Éviter les erreurs jsdom liées à createObjectURL/revokeObjectURL
	URL.createObjectURL = vi.fn(() => 'blob:mock')
	URL.revokeObjectURL = vi.fn()
})

afterAll(() => {
	URL.createObjectURL = originalCreateObjectURL
	URL.revokeObjectURL = originalRevokeObjectURL
})

// Scénario d’accessibilité : aperçu d’une image avec texte alternatif.

describe('FilePreview – accessibility (axe)', () => {
	it('has no obvious axe violations for image preview with alt text', async () => {
		const file = new File([''], 'photo.png', { type: 'image/png' })

		const wrapper = mount(FilePreview, {
			props: {
				file,
				options: {
					image: {
						alt: 'Aperçu du fichier image téléversé',
					},
				},
			},
		})

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FilePreview – image preview', {
			ignoreRules: ['region'],
		})
	})

	// Repli pdf.js : le document est rendu en <canvas>, non restitué aux lecteurs
	// d'écran. L'alternative textuelle et le lien de téléchargement qui l'accompagnent
	// doivent l'être, eux.
	it('has no obvious axe violations for the pdf.js fallback with its alternative', async () => {
		const file = new File(['%PDF-1.4'], 'contrat.pdf', { type: 'application/pdf' })
		// jsdom n'implémente pas `File.arrayBuffer()`, que le rendu pdf.js appelle.
		file.arrayBuffer = () => Promise.resolve(new ArrayBuffer(8))
		Object.defineProperty(navigator, 'pdfViewerEnabled', { value: false, configurable: true })

		const wrapper = mount(FilePreview, {
			props: { file, pdfWorkerSrc: 'worker' },
			slots: { alternative: '<p>Équivalent texte du contrat.</p>' },
		})
		await flushPromises()

		const results = await axe(wrapper.element as HTMLElement)
		assertNoA11yViolations(results, 'FilePreview – pdf.js fallback', {
			ignoreRules: ['region'],
		})

		Reflect.deleteProperty(navigator, 'pdfViewerEnabled')
	})
})

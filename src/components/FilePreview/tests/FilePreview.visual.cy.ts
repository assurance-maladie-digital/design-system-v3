import FilePreview from '../FilePreview.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

// PDF factice : pdfjs ne rend pas les pages (état loading/error déterministe), mais le
// conteneur focusable `role="document"` et son ring DS s'affichent — c'est ce qu'on teste.
const pdfFile = new File([new Uint8Array([0x25, 0x50, 0x44, 0x46])], 'apercu.pdf', {
	type: 'application/pdf',
})

describe('FilePreview - Focus visual regression tests', () => {
	// Visualiseur embarqué (`role="document"`, mode readonly) : ring DS scopé propre au
	// composant (2px primary, offset -2px inset — adapté au conteneur scrollable).
	it('shows the DS ring on the focused embedded pdf viewer', () => {
		cy.mountWithVuetify(FilePreview, {
			props: {
				file: pdfFile,
				readonly: true,
				options: { pdf: { height: '200px' } },
			},
		})

		cy.get('.sy-file-preview__pdf-viewer').should('be.visible')
		focusVisible('.sy-file-preview__pdf-viewer')
		cy.wait(150)
		cy.matchImageSnapshot('file-preview-viewer-focus', cy.get('.sy-file-preview__pdf-viewer'))
	})
})

import FileList from '../FileList.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

// Rapport de contraste WCAG d'une couleur `rgb(r, g, b)` sur fond blanc.
const contrastOnWhite = (color: string): number => {
	const [r = 0, g = 0, b = 0] = (color.match(/\d+/g) ?? []).slice(0, 3).map((value) => {
		const channel = Number(value) / 255
		return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
	})
	const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
	return 1.05 / (luminance + 0.05)
}

const defaultUploadList = [
	{ id: '1', title: 'Carte vitale', state: 'initial', showUploadBtn: true },
	{ id: '2', title: 'Justificatif de domicile', state: 'success', fileName: 'justificatif.pdf' },
	{ id: '3', title: 'Ordonnance', state: 'error' },
]

describe('FileList - Visual regression tests', () => {
	// Viewport réduit : la liste de fichiers prend toute la largeur (aucun breakpoint).
	beforeEach(() => {
		cy.viewport(450, 300)
	})

	it('displays the file list with mixed states', () => {
		cy.mountWithVuetify(FileList, {
			props: { uploadList: defaultUploadList },
		})

		cy.get('.upload-list').should('be.visible')
		cy.matchImageSnapshot('file-list-default', cy.get('.upload-list'))
	})

	it('displays the file list with delete buttons', () => {
		cy.mountWithVuetify(FileList, {
			props: {
				uploadList: [
					{ id: '1', title: 'Document', state: 'success', fileName: 'doc.pdf', showDeleteBtn: true },
				],
			},
		})

		cy.get('.upload-list').should('be.visible')
		cy.matchImageSnapshot('file-list-with-delete', cy.get('.upload-list'))
	})

	// Régression : le message utilisait on-surface-variant (#EEEEEE), illisible sur fond clair.
	it('displays the optional document message with a readable contrast', () => {
		cy.mountWithVuetify(FileList, {
			props: {
				uploadList: [
					{ id: '1', title: 'Carte vitale', state: 'initial', optional: true, showUploadBtn: true },
				],
			},
		})

		cy.get('.file-item__message')
			.should('have.text', 'Document facultatif')
			.then(($el) => {
				expect(contrastOnWhite(getComputedStyle($el[0]).color)).to.be.at.least(4.5)
			})
		cy.matchImageSnapshot('file-list-optional', cy.get('.upload-list'))
	})

	// Les actions de ligne sont des `.v-btn` : ring primary via l'override global `_btns.scss`
	// (pas de style scopé dans FileList/UploadItem).
	it('shows the global ring on a focused item action button', () => {
		cy.mountWithVuetify(FileList, {
			props: {
				uploadList: [
					{ id: '1', title: 'Carte vitale', state: 'initial', showUploadBtn: true },
				],
			},
		})

		focusVisible('.file-item .v-btn')
		cy.matchImageSnapshot('file-list-action-focus', cy.get('.upload-list'))
	})
})

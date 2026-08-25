import type { AxiosResponse } from 'axios'
import DownloadBtn from '../DownloadBtn.vue'
import { h } from 'vue'
import { VSheet } from 'vuetify/components'

function fakeFilePromise(): Promise<AxiosResponse<Blob>> {
	return Promise.resolve({
		data: new Blob(['content'], { type: 'application/pdf' }),
		headers: { 'content-disposition': 'attachment; filename="test.pdf"' },
		status: 200,
		statusText: 'OK',
		config: {} as AxiosResponse['config'],
	})
}

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('DownloadBtn - Visual regression tests', () => {
	it('displays the download button in idle state', () => {
		cy.mountWithVuetify(DownloadBtn, {
			props: {
				filePromise: fakeFilePromise,
			},
		})

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('download-btn-idle', cy.get('.v-btn'))
	})

	it('displays the download button in dark mode', () => {
		cy.mountWithVuetify(
			h(VSheet, { color: 'primary', class: 'pa-4', style: 'display: inline-block;' }, () => [
				h(DownloadBtn, { filePromise: fakeFilePromise, dark: true }, () => 'Télécharger'),
			]),
		)

		cy.get('.sy-download-btn').should('be.visible')
		cy.matchImageSnapshot('download-btn-dark', cy.get('.v-sheet'))
	})
})

describe('DownloadBtn - Hover visual regression tests', () => {
	it('shows the hover state in light mode', () => {
		cy.mountWithVuetify(DownloadBtn, {
			props: {
				filePromise: fakeFilePromise,
			},
		})

		cy.get('.sy-download-btn')
			.should('be.visible')
			.trigger('mouseover')

		cy.wait(100)
		cy.matchImageSnapshot('download-btn-hover-light', cy.get('.v-application'))
	})

	it('shows the hover state in dark mode', () => {
		cy.mountWithVuetify(
			h(VSheet, { color: 'primary', class: 'pa-4', style: 'display: inline-block;' }, () => [
				h(DownloadBtn, {
					filePromise: fakeFilePromise,
					dark: true,
				}),
			]),
		)

		cy.get('.sy-download-btn')
			.should('be.visible')
			.trigger('mouseover')

		cy.wait(100)
		cy.matchImageSnapshot('download-btn-hover-dark', cy.get('.v-application'))
	})
})

describe('DownloadBtn - Focus visual regression tests', () => {
	// Mode clair (outlined primary) : ring primary, offset 3px. Capture `.v-application`
	// pour ne pas rogner le ring outset.
	it('shows the primary ring on the button (light)', () => {
		cy.mountWithVuetify(DownloadBtn, {
			props: { filePromise: fakeFilePromise },
		})

		focusVisible('.sy-download-btn')
		cy.wait(100)
		cy.matchImageSnapshot('download-btn-focus-light', cy.get('.v-application'))
	})

	// Mode `dark` (prop) sur fond primary : ring onPrimary (blanc).
	it('shows the onPrimary ring on the button (dark)', () => {
		cy.mountWithVuetify(
			h(VSheet, { color: 'primary', class: 'pa-4', style: 'display: inline-block;' }, () => [
				h(DownloadBtn, { filePromise: fakeFilePromise, dark: true }, () => 'Télécharger'),
			]),
		)

		focusVisible('.sy-download-btn')
		cy.wait(100)
		cy.matchImageSnapshot('download-btn-focus-dark', cy.get('.v-application'))
	})
})

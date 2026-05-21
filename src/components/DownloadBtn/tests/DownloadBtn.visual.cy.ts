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

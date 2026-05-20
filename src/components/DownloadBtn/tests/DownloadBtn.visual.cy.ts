import type { AxiosResponse } from 'axios'
import DownloadBtn from '../DownloadBtn.vue'
import { h } from 'vue'

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
			h('div', { style: 'background-color: #121212; padding: 16px; display: inline-block;' }, [
				h(DownloadBtn, { filePromise: fakeFilePromise, dark: true }),
			]),
		)

		cy.get('.v-btn').should('be.visible')
		cy.matchImageSnapshot('download-btn-dark', cy.get('.sy-download-btn').parent())
	})
})

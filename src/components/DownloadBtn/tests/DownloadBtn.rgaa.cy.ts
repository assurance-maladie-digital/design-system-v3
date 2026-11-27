import DownloadBtn from '../DownloadBtn.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

describe('DownloadBtn – RGAA browser checks – CNAM theme', () => {
	const filePromise = () => Promise.resolve({ data: new Blob(['file']), headers: {} })

	it('3.2 – keeps sufficient contrast for the default action', () => {
		cy.mountWithVuetify(DownloadBtn, { props: { filePromise } })
		cy.get('.sy-download-btn').should(($button) => {
			expect(getTextContrast($button[0]!)).to.be.at.least(4.5)
		})
	})

	it('3.3 and 10.7 – exposes a visible focus indicator', () => {
		cy.mountWithVuetify(DownloadBtn, { props: { filePromise } })
		cy.get('.sy-download-btn').focus().should(($button) => {
			const style = window.getComputedStyle($button[0])
			expect(style.outlineStyle).to.not.equal('none')
			expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
		})
	})
})

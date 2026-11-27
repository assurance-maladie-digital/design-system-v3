import BackBtn from '../BackBtn.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

const longLabel = 'Retour vers la page précédente et les informations principales du dossier'

describe('BackBtn – RGAA browser checks – CNAM theme', () => {
	it('3.2 – keeps sufficient text contrast in light, dark and primary contexts', () => {
		cy.mountWithVuetify(BackBtn)
		cy.get('.sy-back-btn').should(($button) => {
			expect(getTextContrast($button[0]!)).to.be.at.least(4.5)
		})

		cy.mountWithVuetify(BackBtn, { props: { dark: true } })
		cy.get('.v-application').invoke('css', 'background-color', '#121212')
		cy.get('.sy-back-btn').should(($button) => {
			expect(getTextContrast($button[0]!)).to.be.at.least(4.5)
		})

		cy.mountWithVuetify(BackBtn, { props: { dark: true } })
		cy.get('.v-application').invoke('css', 'background-color', '#0c419a')
		cy.get('.sy-back-btn').should(($button) => {
			expect(getTextContrast($button[0]!)).to.be.at.least(4.5)
		})
	})

	it('3.3 and 10.7 – exposes a visible focus indicator in light and dark contexts', () => {
		cy.mountWithVuetify(BackBtn)
		cy.get('.sy-back-btn').focus()
		cy.get('.sy-back-btn').should(($button) => {
			const style = window.getComputedStyle($button[0])
			expect(style.outlineStyle).to.not.equal('none')
			expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
		})

		cy.mountWithVuetify(BackBtn, { props: { dark: true } })
		cy.get('.v-application').invoke('css', 'background-color', '#0c419a')
		cy.get('.sy-back-btn').focus()
		cy.get('.sy-back-btn').should(($button) => {
			const style = window.getComputedStyle($button[0])
			expect(style.outlineStyle).to.not.equal('none')
			expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
		})
	})

	it('10.11 – does not create horizontal overflow with a long label at 320px', () => {
		cy.rgaaSetAuditViewport(320, 800)
		cy.mountWithVuetify(BackBtn, { props: { locales: { label: longLabel } } })

		cy.get('.sy-back-btn').should('be.visible').and('contain.text', longLabel)
		cy.rgaaAssertNoHorizontalOverflow('html')
	})

	it('10.12 – keeps the label available with increased text spacing', () => {
		cy.mountWithVuetify(BackBtn, { props: { locales: { label: longLabel } } })

		cy.document().then((document) => {
			const style = document.createElement('style')
			style.textContent = `
				body { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
				p { margin-bottom: 2em !important; }
			`
			document.head.appendChild(style)
		})

		cy.get('.sy-back-btn').should('be.visible').and('contain.text', longLabel)
	})
})

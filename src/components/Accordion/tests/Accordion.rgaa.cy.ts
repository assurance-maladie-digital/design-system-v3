import Accordion from '../Accordion.vue'
import { getTextContrast } from '../../../../cypress/support/contrast'

const items = [
	{ id: 'first', title: 'Première section', content: 'Un contenu suffisamment long pour vérifier le comportement du composant sur une petite largeur.' },
	{ id: 'second', title: 'Deuxième section', content: 'Deuxième contenu.' },
]

describe('Accordion – RGAA browser checks', () => {
	it('3.2 – keeps the CNAM text contrast above 4.5:1 in closed and open states', () => {
		cy.mountWithVuetify(Accordion, {
			props: {
				items,
				modelValue: ['first'],
			},
		})

		cy.get('.sy-accordion-title, .sy-accordion-content-text').each(($element) => {
			expect(getTextContrast($element[0]!)).to.be.at.least(4.5)
		})
	})

	it('10.7 – exposes a visible focus indicator', () => {
		cy.mountWithVuetify(Accordion, { props: { items } })

		cy.get('.sy-accordion-button').first().focus()
		cy.get('.sy-accordion-button').first().should(($button) => {
			const style = window.getComputedStyle($button[0])

			expect(style.outlineStyle).to.not.equal('none')
			expect(Number.parseFloat(style.outlineWidth)).to.be.greaterThan(0)
		})
	})

	it('10.11 – does not create horizontal overflow at 320px', () => {
		cy.viewport(320, 800)
		cy.mountWithVuetify(Accordion, { props: { items } })

		cy.get('.sy-accordion').should('be.visible')
		cy.document().then((document) => {
			expect(document.documentElement.scrollWidth).to.be.at.most(document.documentElement.clientWidth)
		})
	})

	it('10.12 – keeps the content available with increased text spacing', () => {
		cy.mountWithVuetify(Accordion, {
			props: {
				items,
				modelValue: ['first'],
			},
		})

		cy.document().then((document) => {
			const style = document.createElement('style')
			style.textContent = `
				body { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
				p { margin-bottom: 2em !important; }
			`
			document.head.appendChild(style)
		})

		cy.get('.sy-accordion-content--open').should('be.visible').and('contain.text', items[0]!.content)
	})
})

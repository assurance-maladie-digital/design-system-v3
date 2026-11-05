import SyPagination from '../SyPagination.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyPagination - Visual regression tests', () => {
	it('displays pagination on first page', () => {
		cy.mountWithVuetify(SyPagination, {
			props: {
				modelValue: 1,
				pages: 10,
			},
		})

		cy.get('.sy-pagination').should('be.visible')
		cy.matchImageSnapshot('sy-pagination-first-page', cy.get('.sy-pagination'))
	})

	it('displays pagination on middle page', () => {
		cy.mountWithVuetify(SyPagination, {
			props: {
				modelValue: 5,
				pages: 10,
			},
		})

		cy.get('.sy-pagination').should('be.visible')
		cy.matchImageSnapshot('sy-pagination-middle-page', cy.get('.sy-pagination'))
	})

	it('styles non-interactive ellipses in button mode', () => {
		cy.mountWithVuetify(SyPagination, {
			props: { modelValue: 5, pages: 10, buttonMode: true },
		})

		cy.get('span.ellipsis').should('be.visible').and('have.css', 'display', 'inline-block')
		cy.get('span.ellipsis').first().then(($ellipsis) => {
			const element = $ellipsis[0]
			const style = getComputedStyle(element)
			const rem = Number.parseFloat(getComputedStyle(element.ownerDocument.documentElement).fontSize)
			expect(Number.parseFloat(style.paddingLeft)).to.be.closeTo(0.6 * rem, 0.01)
			expect(Number.parseFloat(style.paddingTop)).to.be.closeTo(0.6 * rem, 0.01)
			const probe = element.ownerDocument.createElement('span')
			probe.style.color = style.getPropertyValue('--pagination-ellipsis')
			element.append(probe)
			expect(style.color).to.equal(getComputedStyle(probe).color)
			probe.remove()
		})
	})

	it('displays pagination with label', () => {
		cy.mountWithVuetify(SyPagination, {
			props: {
				modelValue: 1,
				pages: 5,
				label: 'Navigation des pages',
			},
		})

		cy.get('.sy-pagination').should('be.visible')
		cy.matchImageSnapshot('sy-pagination-with-label', cy.get('.sy-pagination'))
	})
})

describe('SyPagination - Focus visual regression tests', () => {
	// Ring 2px primary (offset 3px) sur le lien focalisé. Page 1 (non active ici) :
	// cellule bordée blanche + ring primary.
	it('shows the focus ring on a page link', () => {
		cy.mountWithVuetify(SyPagination, {
			props: {
				modelValue: 5,
				pages: 10,
			},
		})

		focusVisible('.list-first')
		cy.wait(100)
		cy.matchImageSnapshot('sy-pagination-focus', cy.get('.sy-pagination'))
	})
})

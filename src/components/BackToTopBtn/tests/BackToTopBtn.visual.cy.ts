import BackToTopBtn from '../BackToTopBtn.vue'

function triggerScroll(scrollY = 200) {
	cy.window().then((win) => {
		Object.defineProperty(win, 'scrollY', { value: scrollY, writable: true })
		win.dispatchEvent(new Event('scroll'))
	})
}

describe('BackToTopBtn - Visual regression tests', () => {
	it('displays the button after scroll', () => {
		cy.mountWithVuetify(BackToTopBtn, {
			props: { threshold: 0 },
		})

		triggerScroll()
		cy.get('.vd-back-to-top-btn').should('be.visible')
		cy.matchImageSnapshot('back-to-top-btn-default', cy.get('.v-application'))
	})

	it('displays the button with custom nudge', () => {
		cy.mountWithVuetify(BackToTopBtn, {
			props: {
				threshold: 0,
				nudgeRight: '32px',
				nudgeBottom: '32px',
			},
		})

		triggerScroll()
		cy.get('.vd-back-to-top-btn').should('be.visible')
		cy.matchImageSnapshot('back-to-top-btn-custom-nudge', cy.get('.v-application'))
	})
})

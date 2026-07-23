import LogoBrandSection from '../LogoBrandSection.vue'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('LogoBrandSection - Visual regression tests', () => {
	it('displays the brand section by default', () => {
		cy.mountWithVuetify(LogoBrandSection)

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('logo-brand-section-default', cy.get('.v-application'))
	})

	it('displays the brand section with service title', () => {
		cy.mountWithVuetify(LogoBrandSection, {
			props: {
				serviceTitle: 'Ameli',
				serviceSubTitle: 'Assurance Maladie',
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('logo-brand-section-with-title', cy.get('.v-application'))
	})

	it('displays the brand section in mobile version', () => {
		cy.mountWithVuetify(LogoBrandSection, {
			props: {
				serviceTitle: 'Ameli',
				mobileVersion: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('logo-brand-section-mobile', cy.get('.v-application'))
	})

	it('displays the brand section with reduced logo', () => {
		cy.mountWithVuetify(LogoBrandSection, {
			props: { reduceLogo: true },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('logo-brand-section-reduced', cy.get('.v-application'))
	})

	// Le logo est enveloppé dans un lien d'accueil `<a>` (homeLink par défaut `{ href: '/' }`) →
	// ring DS via l'override global `_links.scss` (2px primary, offset 2px). Aucun style scoped.
	it('shows the global DS ring on the focused home link', () => {
		cy.mountWithVuetify(LogoBrandSection, {
			props: {
				serviceTitle: 'Ameli',
				serviceSubTitle: 'Assurance Maladie',
			},
		})

		focusVisible('.vd-home-link')
		cy.wait(150)
		cy.matchImageSnapshot('logo-brand-section-home-link-focus', cy.get('.v-application'))
	})
})

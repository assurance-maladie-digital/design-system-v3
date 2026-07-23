import FranceConnectBtn from '../FranceConnectBtn.vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('FranceConnectBtn - Visual regression tests', () => {
	it('displays the FranceConnect button by default', () => {
		cy.mountWithVuetify(FranceConnectBtn, {
			props: { href: 'https://franceconnect.gouv.fr' },
		})

		cy.get('.sy-france-connect-btn').should('be.visible')
		cy.matchImageSnapshot('france-connect-btn-default', cy.get('.sy-france-connect-btn'))
	})

	it('displays the FranceConnect+ button', () => {
		cy.mountWithVuetify(FranceConnectBtn, {
			props: {
				href: 'https://franceconnect.gouv.fr',
				isConnectPlus: true,
			},
		})

		cy.get('.sy-france-connect-btn').should('be.visible')
		cy.matchImageSnapshot('france-connect-btn-plus', cy.get('.sy-france-connect-btn'))
	})

	it('displays the FranceConnect button in dark mode', () => {
		cy.mountWithVuetify(FranceConnectBtn, {
			props: {
				href: 'https://franceconnect.gouv.fr',
				dark: true,
			},
		})
		cy.get('.v-application').invoke('css', 'background-color', '#121212')

		cy.get('.sy-france-connect-btn').should('be.visible')
		cy.matchImageSnapshot('france-connect-btn-dark', cy.get('.sy-france-connect-btn'))
		cy.get('.v-application').invoke('css', 'background-color', '')
	})
})

describe('FranceConnectBtn - Focus visual regression tests', () => {
	// Ring de focus DSFR : outline 2px #0a76f6, offset 2px (bleu focus de l'État, PAS le
	// primary du DS). Capture `.v-application` pour ne pas rogner le ring outset.
	it('shows the DSFR focus ring on the button (light)', () => {
		cy.mountWithVuetify(FranceConnectBtn, {
			props: { href: 'https://franceconnect.gouv.fr' },
		})

		focusVisible('.sy-france-connect-link')
		cy.wait(100)
		cy.matchImageSnapshot('france-connect-btn-focus-light', cy.get('.v-application'))
	})

	it('shows the DSFR focus ring on the button (dark)', () => {
		cy.mountWithVuetify(FranceConnectBtn, {
			props: { href: 'https://franceconnect.gouv.fr', dark: true },
		})
		cy.get('.v-application').invoke('css', 'background-color', '#121212')

		focusVisible('.sy-france-connect-link')
		cy.wait(100)
		cy.matchImageSnapshot('france-connect-btn-focus-dark', cy.get('.v-application'))
		cy.get('.v-application').invoke('css', 'background-color', '')
	})
})

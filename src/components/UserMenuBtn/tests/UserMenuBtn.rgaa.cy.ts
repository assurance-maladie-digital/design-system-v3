import UserMenuBtn from '../UserMenuBtn.vue'
describe('UserMenuBtn – RGAA browser checks – CNAM theme', () => {
	it('8.2 – exposes the user identity in the menu trigger', () => {
		cy.mountWithVuetify(UserMenuBtn, { props: { fullName: 'Jeanne Dupont', additionalInformation: 'Agent' } })
		cy.get('.user-menu-btn').should('be.visible')
		cy.contains('Jeanne Dupont').should('exist')
	})
})

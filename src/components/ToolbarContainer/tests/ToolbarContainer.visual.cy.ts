import ToolbarContainer from '../ToolbarContainer.vue'

describe('ToolbarContainer - Visual regression tests', () => {
	it('displays the toolbar container with buttons', () => {
		cy.mountWithVuetify(ToolbarContainer, {
			slots: {
				default: `
					<button>Action 1</button>
					<button>Action 2</button>
					<button>Action 3</button>
				`,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('toolbar-container-default', cy.get('.v-application'))
	})

	it('displays the toolbar container with links', () => {
		cy.mountWithVuetify(ToolbarContainer, {
			slots: {
				default: `
					<a href="#">Lien 1</a>
					<a href="#">Lien 2</a>
				`,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('toolbar-container-links', cy.get('.v-application'))
	})
})

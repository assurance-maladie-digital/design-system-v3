import DialogBox from '../DialogBox.vue'

describe('DialogBox - Tests de non-régression visuelle', () => {
	it('affiche la boîte de dialogue ouverte', () => {
		cy.mountWithVuetify(DialogBox, {
			props: {
				'modelValue': true,
				'title': 'Confirmer la suppression',
				'onUpdate:modelValue': () => {},
			},
			slots: {
				default: '<p>Êtes-vous sûr de vouloir supprimer cet élément ?</p>',
			},
		})

		cy.get('.v-dialog').should('be.visible')
		// Attendre l'animation d'ouverture
		cy.wait(500)
		cy.matchImageSnapshot('dialog-box-default')
	})

	it('affiche la boîte de dialogue sans actions', () => {
		cy.mountWithVuetify(DialogBox, {
			props: {
				'modelValue': true,
				'title': 'Information',
				'hideActions': true,
				'onUpdate:modelValue': () => {},
			},
			slots: {
				default: '<p>Ceci est un message informatif.</p>',
			},
		})

		cy.get('.v-dialog').should('be.visible')
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(500)
		cy.matchImageSnapshot('dialog-box-no-actions')
	})

	it('affiche la boîte de dialogue avec textes personnalisés', () => {
		cy.mountWithVuetify(DialogBox, {
			props: {
				'modelValue': true,
				'title': 'Valider le formulaire',
				'cancelBtnText': 'Annuler',
				'confirmBtnText': 'Valider',
				'onUpdate:modelValue': () => {},
			},
			slots: {
				default: '<p>Souhaitez-vous valider ce formulaire ?</p>',
			},
		})

		cy.get('.v-dialog').should('be.visible')
		// eslint-disable-next-line cypress/no-unnecessary-waiting
		cy.wait(500)
		cy.matchImageSnapshot('dialog-box-custom-texts')
	})
})

import { h } from 'vue'
import DialogBox from '../DialogBox.vue'

const dialogTransitionOptions = {
	global: {
		stubs: {
			'transition': false,
			'transition-group': false,
		},
	},
} as const

function waitForDialogTransitionEnd() {
	cy.get('.v-overlay__content')
		.should('be.visible')
		.and('not.have.class', 'dialog-transition-enter-active')
}

describe('DialogBox - Visual regression tests', () => {
	it('displays the opened dialog box', () => {
		cy.mountWithVuetify(DialogBox, {
			...dialogTransitionOptions,
			props: {
				'modelValue': true,
				'title': 'Confirmer la suppression',
				'onUpdate:modelValue': () => {},
			},
			slots: {
				default: () => h('p', 'Êtes-vous sûr de vouloir supprimer cet élément ?'),
			},
		})

		cy.get('.v-dialog').should('be.visible')
		waitForDialogTransitionEnd()
		cy.matchImageSnapshot('dialog-box-default')
	})

	it('displays the dialog box without actions', () => {
		cy.mountWithVuetify(DialogBox, {
			...dialogTransitionOptions,
			props: {
				'modelValue': true,
				'title': 'Information',
				'hideActions': true,
				'onUpdate:modelValue': () => {},
			},
			slots: {
				default: () => h('p', 'Ceci est un message informatif.'),
			},
		})

		cy.get('.v-dialog').should('be.visible')
		waitForDialogTransitionEnd()
		cy.matchImageSnapshot('dialog-box-no-actions')
	})

	it('displays the dialog box with custom texts', () => {
		cy.mountWithVuetify(DialogBox, {
			...dialogTransitionOptions,
			props: {
				'modelValue': true,
				'title': 'Valider le formulaire',
				'cancelBtnText': 'Annuler',
				'confirmBtnText': 'Valider',
				'onUpdate:modelValue': () => {},
			},
			slots: {
				default: () => h('p', 'Souhaitez-vous valider ce formulaire ?'),
			},
		})

		cy.get('.v-dialog').should('be.visible')
		waitForDialogTransitionEnd()
		cy.matchImageSnapshot('dialog-box-custom-texts')
	})

	it('displays the scrollable dialog box', () => {
		cy.mountWithVuetify(DialogBox, {
			...dialogTransitionOptions,
			props: {
				'modelValue': true,
				'title': 'Dialog scrollable',
				'scrollable': true,
				'onUpdate:modelValue': () => {},
			},
			slots: {
				default: () => h(
					'div',
					Array.from({ length: 20 }, (_, index) =>
						h('p', { class: 'mb-4' }, `Ligne de contenu numéro ${index + 1}`),
					),
				),
			},
		})

		cy.get('.v-dialog').should('be.visible')
		waitForDialogTransitionEnd()
		cy.matchImageSnapshot('dialog-box-scrollable')
	})
})

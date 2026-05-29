import DiacriticPicker from '../DiacriticPicker.vue'

describe('DiacriticPicker - Visual regression tests', () => {
	it('displays the diacritic picker button', () => {
		cy.mountWithVuetify(DiacriticPicker, {
			props: { modelValue: '' },
		})

		cy.get('.sy-diacritic-wrapper').should('be.visible')
		cy.matchImageSnapshot('diacritic-picker-default', cy.get('.sy-diacritic-wrapper'))
	})

	it('displays the diacritic picker with custom button title', () => {
		cy.mountWithVuetify(DiacriticPicker, {
			props: {
				modelValue: '',
				btnTitle: 'àÀ',
			},
		})

		cy.get('.sy-diacritic-wrapper').should('be.visible')
		cy.matchImageSnapshot('diacritic-picker-custom-title', cy.get('.sy-diacritic-wrapper'))
	})
})

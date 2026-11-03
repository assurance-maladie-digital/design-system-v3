import EmotionPicker from '../EmotionPicker.vue'

describe('EmotionPicker - selection appearance', () => {
	for (const index of [0, 1, 2]) {
		it(`shows a visible border and background on selected emotion ${index + 1} after blur`, () => {
			cy.mountWithVuetify(EmotionPicker)

			cy.get('[role="radio"]').eq(index).click().blur()

			cy.get('[role="radio"][aria-checked="true"]')
				.should('not.have.css', 'border-color', 'rgba(0, 0, 0, 0)')
				.and('have.css', 'outline-style', 'none')
				.and('not.have.css', 'background-color', 'rgba(0, 0, 0, 0)')
		})
	}
})

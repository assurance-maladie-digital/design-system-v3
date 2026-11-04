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

describe('EmotionPicker - keyboard focus appearance', () => {
	for (const index of [0, 1, 2]) {
		it(`shows the emotion background and a currentcolor outline on focused emotion ${index + 1}`, () => {
			cy.mountWithVuetify(EmotionPicker)

			// Déclenche `:focus-visible` (focus clavier) sans cocher l'émotion.
			cy.get('[role="radio"]').eq(index).then(($el) => {
				($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
			})

			cy.get('[role="radio"]').eq(index)
				.should('have.attr', 'aria-checked', 'false')
				.and('not.have.css', 'background-color', 'rgba(0, 0, 0, 0)')
				.and('have.css', 'outline-style', 'solid')
				.then(($el) => {
					const style = getComputedStyle($el[0]!)
					expect(style.outlineColor).to.equal(style.color)
				})
		})
	}
})

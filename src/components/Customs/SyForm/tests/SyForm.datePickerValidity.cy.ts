import DatePickerSyFormValidity from '@/components/DatePicker/docExamples/DatePickerSyFormValidity.vue'

/**
 * Régression : en mode combiné, la validité du SyForm bouclait avec le rendu du parent
 * (règles recréées à chaque rendu : `:custom-rules="[]"`) et figeait la page dès la
 * correction d'une date. Les frappes réelles sont nécessaires : `setValue` (happy-dom)
 * ne passe pas par le masque de saisie et ne reproduit pas le scénario.
 */
const validity = () => cy.contains('[role="status"]', 'Validité du SyForm').find('code').last()
const submitButton = () => cy.contains('button', 'Soumettre')

const enterDate = (digits: string) => {
	cy.get('input').first().focus().type('{selectall}{backspace}').type(digits, { delay: 30 })
	cy.get('input').first().blur()
}

describe('SyForm avec un DatePicker requis (frappes réelles)', () => {
	const modes = ['combined', 'text'] as const

	modes.forEach((mode) => {
		it(`suit la validité de la date saisie (mode ${mode})`, () => {
			cy.mountWithVuetify(DatePickerSyFormValidity, { props: { mode } })

			validity().should('have.text', 'null')
			submitButton().should('be.disabled')

			enterDate('32112026')
			validity().should('have.text', 'false')
			submitButton().should('be.disabled')

			enterDate('30112026')
			validity().should('have.text', 'true')
			submitButton().should('not.be.disabled')

			enterDate('121120')
			validity().should('have.text', 'false')
			submitButton().should('be.disabled')

			enterDate('30112026')
			validity().should('have.text', 'true')
			submitButton().should('not.be.disabled')
		})
	})
})

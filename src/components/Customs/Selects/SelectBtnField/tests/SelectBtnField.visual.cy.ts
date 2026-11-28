import { defineComponent, h } from 'vue'
import SelectBtnField from '../SelectBtnField.vue'

const defaultItems = [
	{ text: 'Oui', value: 'oui' },
	{ text: 'Non', value: 'non' },
]

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SelectBtnField - Visual regression tests', () => {
	// Viewport réduit : le champ prend toute la largeur (aucun breakpoint).
	beforeEach(() => {
		cy.viewport(400, 300)
	})

	it('displays the button select field by default', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
			},
		})

		cy.get('.select-btn-field').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-default', cy.get('.select-btn-field'), { padding: 10 })
	})

	it('displays the button select field with a selected value', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
				modelValue: 'oui',
			},
		})

		cy.get('.select-btn-field').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-selected', cy.get('.select-btn-field'), { padding: 10 })
	})

	it('displays the button select field in inline mode', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
				inline: true,
			},
		})

		cy.get('.select-btn-field').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-inline', cy.get('.select-btn-field'), { padding: 10 })
	})

	it('displays the button select field in readonly mode', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
				modelValue: 'non',
				readonly: true,
			},
		})

		cy.get('.select-btn-field').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-readonly', cy.get('.select-btn-field'), { padding: 10 })
	})
})

describe('SelectBtnField - Focus visual regression tests', () => {
	// Viewport réduit : cf. le describe ci-dessus (captures élément + padding).
	beforeEach(() => {
		cy.viewport(400, 300)
	})

	it('shows the enclosing ring on the group container (inline)', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: { items: defaultItems, label: 'Votre réponse', inline: true },
		})

		// 1er focus : le conteneur listbox porte le ring englobant
		focusVisible('[role="listbox"]')
		cy.matchImageSnapshot('select-btn-field-focus-container-inline', cy.get('[role="listbox"]'), { padding: 12 })
	})

	it('shows the ring on a focused option (inline)', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: { items: defaultItems, label: 'Votre réponse', inline: true },
		})

		focusVisible('li[role="option"]')
		cy.matchImageSnapshot('select-btn-field-focus-option-inline', cy.get('li[role="option"]').first(), { padding: 12 })
	})

	it('shows the enclosing ring on the group container (column)', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: { items: defaultItems, label: 'Votre réponse' },
		})

		focusVisible('[role="listbox"]')
		cy.matchImageSnapshot('select-btn-field-focus-container-column', cy.get('[role="listbox"]'), { padding: 12 })
	})

	it('does not clip the focus ring inside an overflow:hidden container', () => {
		// Un ancêtre overflow:hidden peut rogner l'outline (offset 3px). Ce cas le vérifie.
		// Render function (pas de template string) : le compilateur runtime n'est pas
		// dispo dans le build Cypress component.
		const OverflowWrapper = defineComponent({
			setup() {
				return () => h(
					'div',
					{ style: 'overflow: hidden; width: 360px; padding: 16px; border: 1px solid #ccc' },
					[h(SelectBtnField, { items: defaultItems, label: 'Votre réponse', inline: true })],
				)
			},
		})

		cy.mountWithVuetify(OverflowWrapper)

		focusVisible('[role="listbox"]')
		cy.matchImageSnapshot('select-btn-field-focus-overflow-hidden', cy.get('[role="listbox"]'), { padding: 12 })
	})
})

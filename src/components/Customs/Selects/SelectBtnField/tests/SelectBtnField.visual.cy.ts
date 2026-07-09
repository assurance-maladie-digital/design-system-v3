import { defineComponent } from 'vue'
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
	it('displays the button select field by default', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: {
				items: defaultItems,
				label: 'Votre réponse',
			},
		})

		cy.get('.select-btn-field').should('be.visible')
		cy.matchImageSnapshot('select-btn-field-default', cy.get('.select-btn-field'))
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
		cy.matchImageSnapshot('select-btn-field-selected', cy.get('.select-btn-field'))
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
		cy.matchImageSnapshot('select-btn-field-inline', cy.get('.select-btn-field'))
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
		cy.matchImageSnapshot('select-btn-field-readonly', cy.get('.select-btn-field'))
	})
})

describe('SelectBtnField - Focus visual regression tests', () => {
	it('shows the enclosing ring on the group container (inline)', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: { items: defaultItems, label: 'Votre réponse', inline: true },
		})

		// 1er focus : le conteneur listbox porte le ring englobant
		focusVisible('[role="listbox"]')
		cy.wait(100)
		cy.matchImageSnapshot('select-btn-field-focus-container-inline', cy.get('.v-application'))
	})

	it('shows the ring on a focused option (inline)', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: { items: defaultItems, label: 'Votre réponse', inline: true },
		})

		focusVisible('li[role="option"]')
		cy.wait(100)
		cy.matchImageSnapshot('select-btn-field-focus-option-inline', cy.get('.v-application'))
	})

	it('shows the enclosing ring on the group container (column)', () => {
		cy.mountWithVuetify(SelectBtnField, {
			props: { items: defaultItems, label: 'Votre réponse' },
		})

		focusVisible('[role="listbox"]')
		cy.wait(100)
		cy.matchImageSnapshot('select-btn-field-focus-container-column', cy.get('.v-application'))
	})

	it('does not clip the focus ring inside an overflow:hidden container', () => {
		// Un ancêtre overflow:hidden peut rogner l'outline (offset 3px). Ce cas le vérifie.
		const OverflowWrapper = defineComponent({
			components: { SelectBtnField },
			data() {
				return { items: defaultItems }
			},
			template: `
				<div style="overflow: hidden; width: 360px; padding: 16px; border: 1px solid #ccc">
					<SelectBtnField :items="items" label="Votre réponse" inline />
				</div>
			`,
		})

		cy.mountWithVuetify(OverflowWrapper)

		focusVisible('[role="listbox"]')
		cy.wait(100)
		cy.matchImageSnapshot('select-btn-field-focus-overflow-hidden', cy.get('.v-application'))
	})
})

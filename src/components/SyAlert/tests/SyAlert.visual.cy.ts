import SyAlert from '../SyAlert.vue'
import { defineComponent, h } from 'vue'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyAlert - Visual regression tests', () => {
	const types = ['info', 'success', 'warning', 'error'] as const
	const variants = ['tonal', 'outlined'] as const

	types.forEach((type) => {
		it(`displays the "${type}" type correctly`, () => {
			cy.mountWithVuetify(SyAlert, {
				props: { type },
				slots: {
					default: `Ceci est une alerte de type ${type}`,
				},
			})

			cy.get('.v-alert').should('be.visible')
			cy.matchImageSnapshot(`sy-alert-${type}`, cy.get('.v-alert'))
		})
	})

	variants.forEach((variant) => {
		it(`displays the "${variant}" variant correctly`, () => {
			cy.mountWithVuetify(SyAlert, {
				props: { type: 'info', variant },
				slots: {
					default: `Alerte en variante ${variant}`,
				},
			})

			cy.get('.v-alert').should('be.visible')
			cy.matchImageSnapshot(`sy-alert-variant-${variant}`, cy.get('.v-alert'))
		})
	})

	it('displays the close button when closable', () => {
		cy.mountWithVuetify(SyAlert, {
			props: { type: 'info', closable: true },
			slots: {
				default: 'Alerte avec bouton de fermeture',
			},
		})

		cy.get('.v-alert').should('be.visible')
		cy.matchImageSnapshot('sy-alert-closable', cy.get('.v-alert'))
	})

	it('displays all densities for comparison', () => {
		const DensityComparison = defineComponent({
			render: () => h('div', { class: 'sy-alert-density-comparison' }, [
				h(SyAlert, { density: 'default', type: 'info' }, () => 'Densité par défaut'),
				h(SyAlert, { density: 'comfortable', type: 'info' }, () => 'Densité confortable'),
				h(SyAlert, { density: 'compact', type: 'info' }, () => 'Densité compacte'),
			]),
		})

		cy.mountWithVuetify(DensityComparison)

		cy.get('.sy-alert-density-comparison').should('be.visible')
		cy.matchImageSnapshot('sy-alert-densities', cy.get('.sy-alert-density-comparison'))
	})
})

describe('SyAlert - Focus visual regression tests', () => {
	// Bouton fermer : ring 2px primary (offset 3px). Capture `.v-application` pour ne pas
	// rogner le ring outset.
	it('shows the ring on the close button', () => {
		cy.mountWithVuetify(SyAlert, {
			props: { type: 'info', closable: true },
			slots: {
				default: 'Ceci est une alerte fermable',
			},
		})

		focusVisible('.alert-close-btn')
		cy.wait(100)
		cy.matchImageSnapshot('sy-alert-focus', cy.get('.v-application'))
	})
})

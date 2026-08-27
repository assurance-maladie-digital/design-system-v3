import ToolbarContainer from '../ToolbarContainer.vue'
import { defineComponent, h } from 'vue'
import { VBtn } from 'vuetify/components'

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('ToolbarContainer - Visual regression tests', () => {
	it('displays the toolbar container with buttons', () => {
		cy.mountWithVuetify(ToolbarContainer, {
			slots: {
				default: () => [
					h(VBtn, {}, () => 'Action 1'),
					h(VBtn, {}, () => 'Action 2'),
					h(VBtn, {}, () => 'Action 3'),
				],
			},
		})

		cy.get('.sy-toolbar').should('be.visible')
		cy.matchImageSnapshot('toolbar-container-default', cy.get('.sy-toolbar'))
	})

	it('displays the toolbar container with links', () => {
		cy.mountWithVuetify(ToolbarContainer, {
			slots: {
				default: () => [
					h('a', { href: '#' }, 'Lien 1'),
					h('a', { href: '#' }, 'Lien 2'),
				],
			},
		})

		cy.get('.sy-toolbar').should('be.visible')
		cy.matchImageSnapshot('toolbar-container-links', cy.get('.sy-toolbar'))
	})
})

describe('ToolbarContainer - Focus visual regression tests', () => {
	// Le ring provient de l'override global `_btns.scss` : chaque outil focalisé
	// porte outline 2px primary, offset 3px. On capture `.v-application` pour ne pas
	// rogner le ring outset (offset positif).
	it('shows the standard ring on the focused tool (light background)', () => {
		cy.mountWithVuetify(ToolbarContainer, {
			props: { ariaLabel: 'Outils de mise en forme' },
			slots: {
				default: () => [
					h(VBtn, {}, () => 'Gras'),
					h(VBtn, {}, () => 'Italique'),
					h(VBtn, {}, () => 'Souligné'),
				],
			},
		})

		// Outil du milieu : montre que le ring suit l'outil actif du roving tabindex.
		focusVisible('.sy-toolbar button.v-btn:nth-of-type(2)')
		cy.wait(100)
		cy.matchImageSnapshot('toolbar-container-focus-light', cy.get('.v-application'))
	})

	// Sur fond sombre (thème dark), le ring passe en on-primary (blanc) — cf. le compound
	// `.v-theme--dark button:focus-visible` de l'override global.
	it('shows the onPrimary ring on the focused tool (dark background)', () => {
		const DarkToolbar = defineComponent({
			setup() {
				return () => h(
					'div',
					{ class: 'v-theme--dark', style: 'background: rgb(var(--v-theme-primary)); padding: 16px' },
					[
						h(ToolbarContainer, { 'class': 'd-flex ga-4', 'aria-label': 'Outils de mise en forme' }, {
							default: () => [
								h(VBtn, { variant: 'text' }, () => 'Gras'),
								h(VBtn, { variant: 'text' }, () => 'Italique'),
								h(VBtn, { variant: 'text' }, () => 'Souligné'),
							],
						}),
					],
				)
			},
		})

		cy.mountWithVuetify(DarkToolbar)

		focusVisible('.sy-toolbar button.v-btn:nth-of-type(2)')
		cy.wait(100)
		cy.matchImageSnapshot('toolbar-container-focus-dark', cy.get('.v-application'))
	})
})

import { mdiCogOutline, mdiSquareEditOutline } from '@mdi/js'
import { defineComponent, h } from 'vue'
import SyNavList from '../SyNavList.vue'
import type { SyNavListItem } from '../types'

const edit = { id: 'edit', icon: mdiSquareEditOutline, label: 'Modifier' }
const settings = { id: 'settings', icon: mdiCogOutline, label: 'Paramètres' }

const items: SyNavListItem[] = [
	{
		id: 'droit-de-base',
		label: 'Droit de base',
		href: '#droit-de-base',
		actions: [edit],
		children: [
			{
				id: 'demande-affiliation',
				label: 'Demande d’affiliation',
				href: '#demande-affiliation',
				children: [{ id: 'pieces', label: 'Pièces justificatives', href: '#pieces' }],
			},
		],
	},
	{ id: 'cmu-c-as', label: 'CMU-C/AS', href: '#cmu-c-as' },
	{ id: 'ame', label: 'AME', href: '#ame', actions: [settings, edit] },
	{ id: 'long', label: 'Allocation de solidarité aux personnes âgées et complémentaire santé solidaire', href: '#long' },
]

// Conteneur de test : style du conteneur et props de SyNavList passés au montage
const InContainer = defineComponent({
	props: {
		containerStyle: { type: String, required: true },
		navProps: { type: Object, required: true },
	},
	setup: props => () => h('div', { style: props.containerStyle }, [h(SyNavList, { items, label: 'Dossiers client', ...props.navProps })]),
})

const openBothLevels = () => {
	cy.get('button[aria-label="Droit de base : afficher le sous-menu"]').click()
	cy.get('button[aria-label="Demande d’affiliation : afficher le sous-menu"]').click()
}

// Déclenche :focus-visible via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

describe('SyNavList - Visual regression tests', () => {
	beforeEach(() => {
		cy.viewport(1200, 600)
	})

	it('displays the closed list, actions hidden at rest', () => {
		cy.mountWithVuetify(SyNavList, { props: { items, label: 'Dossiers client' } })

		cy.get('.sy-nav-list-panel__actions').first().should('have.css', 'opacity', '0')
		cy.matchImageSnapshot('sy-nav-list-closed', cy.get('.v-application'))
	})

	it('keeps 28 px buttons with 16 px icons, as in the PA mockup', () => {
		cy.mountWithVuetify(SyNavList, { props: { items, label: 'Dossiers client' } })

		cy.get('.sy-nav-list-panel__actions .v-btn, .sy-nav-list-panel__toggle').filter(':visible').each(($btn) => {
			const { width, height } = $btn[0]!.getBoundingClientRect()
			expect([width, height]).to.deep.equal([28, 28])
		})
		cy.get('.sy-nav-list-panel__actions .v-icon').first().invoke('outerWidth').should('equal', 16)
	})

	it('wraps long labels instead of truncating them (RGAA 10.4)', () => {
		cy.mountWithVuetify(SyNavList, { props: { items, label: 'Dossiers client', width: 300 } })

		cy.contains('.v-list-item-title', 'Allocation de solidarité').should('have.css', 'white-space', 'normal')
		cy.contains('.sy-nav-list-panel__row', 'Allocation de solidarité').invoke('outerHeight').should('be.greaterThan', 48)
	})

	it('shows the actions of a row on keyboard focus', () => {
		cy.mountWithVuetify(SyNavList, { props: { items, label: 'Dossiers client' } })

		focusVisible('a[href="#ame"]')
		cy.contains('.sy-nav-list-panel__row', 'AME').find('.sy-nav-list-panel__actions').should('have.css', 'opacity', '1')
		// Contour sur toute la ligne, à l'intérieur, comme les items de SyBtnMenu
		cy.get('a[href="#ame"]').then(($link) => {
			const after = window.getComputedStyle($link[0]!, '::after')
			expect([after.outlineStyle, after.outlineWidth, after.outlineOffset]).to.deep.equal(['solid', '2px', '-3px'])
			expect(window.getComputedStyle($link[0]!).outlineStyle).to.equal('none')
		})
		cy.matchImageSnapshot('sy-nav-list-focus', cy.get('.v-application'))
	})

	it('opens sub-levels on the right, outside the list, without being clipped', () => {
		cy.mountWithVuetify(SyNavList, { props: { items, label: 'Dossiers client' } })

		openBothLevels()
		cy.get('.sy-nav-list > .sy-nav-list-panel').then(($root) => {
			const rootRight = $root[0]!.getBoundingClientRect().right
			cy.contains('a', 'Demande d’affiliation').then(($link) => {
				expect($link[0]!.getBoundingClientRect().left).to.be.at.least(rootRight)
				// L'élément visible au centre du lien est le lien lui-même : rien ne le recouvre ni ne le coupe.
				const { left, top, width, height } = $link[0]!.getBoundingClientRect()
				expect(document.elementFromPoint(left + width / 2, top + height / 2)).to.equal($link[0])
			})
		})
		cy.contains('a', 'Pièces justificatives').should('be.visible')
		cy.matchImageSnapshot('sy-nav-list-open-wide', cy.get('.v-application'))
	})

	it('opens sub-levels below the row on a narrow screen, without horizontal scroll (RGAA 10.11)', () => {
		cy.viewport(320, 600)
		cy.mountWithVuetify(SyNavList, { props: { items, label: 'Dossiers client' } })

		openBothLevels()
		cy.contains('a', 'Pièces justificatives').should('be.visible')
		cy.document().then((doc) => {
			expect(doc.documentElement.scrollWidth).to.be.at.most(320)
		})
		cy.matchImageSnapshot('sy-nav-list-open-narrow', cy.get('.v-application'))
	})

	it('follows its content by default, and grows with a longer entry', () => {
		const shortItems: SyNavListItem[] = [{ id: 'ame', label: 'AME', href: '#ame' }, { id: 'cmu', label: 'CMU-C/AS', href: '#cmu' }]
		cy.mountWithVuetify(InContainer, { props: { containerStyle: 'width: 600px', navProps: { items: shortItems } } })

		cy.get('.sy-nav-list > .sy-nav-list-panel').invoke('outerWidth').then((shortWidth) => {
			expect(shortWidth).to.be.lessThan(300)
			cy.mountWithVuetify(InContainer, {
				props: { containerStyle: 'width: 600px', navProps: { items: [...shortItems, { id: 'long', label: 'Demande d’affiliation et pièces', href: '#long' }] } },
			})
			cy.get('.sy-nav-list > .sy-nav-list-panel').invoke('outerWidth').should('be.greaterThan', shortWidth!)
		})
	})

	it('keeps a fixed width in a shrink-to-fit container', () => {
		// Conteneur à la largeur de son contenu, comme une colonne flex sans largeur
		cy.mountWithVuetify(InContainer, { props: { containerStyle: 'display: inline-block', navProps: { width: 300 } } })

		cy.get('.sy-nav-list > .sy-nav-list-panel').invoke('outerWidth').should('equal', 300)
	})

	it('applies the width prop to the first level only, sub-levels following their content', () => {
		cy.mountWithVuetify(SyNavList, { props: { items, label: 'Dossiers client', width: 360 } })

		openBothLevels()
		cy.get('.sy-nav-list > .sy-nav-list-panel').invoke('outerWidth').should('equal', 360)
		cy.get('.sy-nav-list-panel__flyout > .sy-nav-list-panel').filter(':visible').should('have.length', 2).each(($panel) => {
			const width = $panel[0]!.getBoundingClientRect().width
			expect(width).to.be.lessThan(300)
			expect(width).to.be.greaterThan(100)
		})
	})

	it('caps a sub-level at 300 px, wrapping a longer label', () => {
		const longChild: SyNavListItem[] = [{
			id: 'parent',
			label: 'Parent',
			href: '#parent',
			children: [{ id: 'long', label: 'Allocation de solidarité aux personnes âgées et complémentaire santé solidaire', href: '#long' }],
		}]
		cy.mountWithVuetify(SyNavList, { props: { items: longChild, label: 'Dossiers client' } })

		cy.get('button[aria-label="Parent : afficher le sous-menu"]').click()
		cy.get('.sy-nav-list-panel__flyout > .sy-nav-list-panel').invoke('outerWidth').should('equal', 300)
		cy.contains('.sy-nav-list-panel__row', 'Allocation de solidarité').invoke('outerHeight').should('be.greaterThan', 48)
	})

	it('fills its container with width auto, sub-levels following their content', () => {
		cy.mountWithVuetify(InContainer, { props: { containerStyle: 'width: 400px', navProps: { width: 'auto' } } })

		openBothLevels()
		cy.get('.sy-nav-list > .sy-nav-list-panel').invoke('outerWidth').should('equal', 400)
		cy.get('.sy-nav-list-panel__flyout > .sy-nav-list-panel').filter(':visible').should('have.length', 2).each(($panel) => {
			expect($panel[0]!.getBoundingClientRect().width).to.be.at.most(300)
		})
	})

	it('keeps 8 px between the label, the actions and the chevron, even on the widest row', () => {
		const rowItems: SyNavListItem[] = [
			{ id: 'droit', label: 'Droit de base', href: '#droit', actions: [edit], children: [{ id: 'enfant', label: 'Enfant', href: '#enfant' }] },
			{ id: 'ame', label: 'AME', href: '#ame' },
		]
		cy.mountWithVuetify(SyNavList, { props: { items: rowItems, label: 'Dossiers client' } })

		cy.contains('.sy-nav-list-panel__row', 'Droit de base').then(($row) => {
			const range = document.createRange()
			range.selectNodeContents($row.find('.sy-nav-list-panel__link')[0]!)
			const textRight = range.getBoundingClientRect().right
			const action = $row.find('.sy-nav-list-panel__actions')[0]!.getBoundingClientRect()
			const toggle = $row.find('.sy-nav-list-panel__toggle')[0]!.getBoundingClientRect()
			expect(action.left - textRight).to.be.at.least(8)
			expect(Math.round(toggle.left - action.right)).to.equal(8)
		})
	})
})

import DataListGroup from '../DataListGroup.vue'
import { mdiAccount, mdiCalendar, mdiEmail, mdiPhone } from '@mdi/js'

// Déclenche `:focus-visible` via l'option native focus({ focusVisible: true }).
const focusVisible = (selector: string) =>
	cy.get(selector).then(($el) => {
		($el[0] as HTMLElement).focus({ focusVisible: true } as FocusOptions)
	})

const defaultItems = [
	{
		title: 'Identité',
		items: [
			{ key: 'Nom', value: 'Dupont', icon: 'person' },
			{ key: 'Prénom', value: 'Jean', icon: 'person' },
			{ key: 'Date de naissance', value: '01/01/1980', icon: 'calendar' },
		],
	},
	{
		title: 'Contact',
		items: [
			{ key: 'Email', value: 'jean.dupont@example.com', icon: 'email' },
			{ key: 'Téléphone', value: '0102030405', icon: 'phone' },
		],
	},
]

const iconsMap = {
	person: mdiAccount,
	calendar: mdiCalendar,
	email: mdiEmail,
	phone: mdiPhone,
}

describe('DataListGroup - Visual regression tests', () => {
	it('displays the data list group by default', () => {
		cy.mountWithVuetify(DataListGroup, {
			props: { items: defaultItems, icons: iconsMap },
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-group-default', cy.get('.v-application'))
	})

	it('displays the data list group in loading state', () => {
		cy.mountWithVuetify(DataListGroup, {
			props: {
				items: defaultItems,
				icons: iconsMap,
				loading: true,
			},
		})

		cy.get('.v-application').should('be.visible')
		cy.matchImageSnapshot('data-list-group-loading', cy.get('.v-application'))
	})

	// Le bouton d'action d'un item (ici sur la 1re liste) porte le ring DS via l'override global
	// `_btns.scss`. DataListGroup et DataList ne définissent aucun style de focus propre.
	it('shows the global DS ring on a focused item action button', () => {
		cy.mountWithVuetify(DataListGroup, {
			props: {
				items: [
					{
						title: 'Contact',
						items: [
							{ key: 'Email', value: 'jean.dupont@example.com', action: 'Modifier' },
						],
					},
				],
			},
		})

		focusVisible('.sy-data-list-item-action-btn')
		cy.wait(150)
		cy.matchImageSnapshot('data-list-group-action-focus', cy.get('.v-application'))
	})
})

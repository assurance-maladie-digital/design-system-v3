import DataList from '../DataList.vue'
import { mdiAccount, mdiEmail, mdiBriefcase } from '@mdi/js'

const defaultItems = [
	{ key: 'Nom', value: 'Dupont' },
	{ key: 'Prénom', value: 'Jean' },
	{ key: 'Date de naissance', value: '01/01/1980' },
]

const itemsWithIcons = [
	{ key: 'Nom', value: 'Dupont', icon: 'person' },
	{ key: 'Email', value: 'jean.dupont@example.com', icon: 'email' },
	{ key: 'Profession', value: 'Développeur', icon: 'job' },
]

const iconsMap = {
	person: mdiAccount,
	email: mdiEmail,
	job: mdiBriefcase,
}

describe('DataList - Visual regression tests', () => {
	it('displays the data list by default', () => {
		cy.mountWithVuetify(DataList, {
			props: { items: defaultItems },
		})

		cy.get('.sy-data-list').should('be.visible')
		cy.get('.sy-data-list-item').should('have.length', 3)
		cy.matchImageSnapshot('data-list-default', cy.get('.sy-data-list'))
	})

	it('displays the data list with a title', () => {
		cy.mountWithVuetify(DataList, {
			props: {
				items: defaultItems,
				listTitle: 'Informations personnelles',
			},
		})

		cy.get('.sy-data-list').should('be.visible')
		cy.get('.sy-data-list-item').should('have.length', 3)
		cy.matchImageSnapshot('data-list-with-title', cy.get('.sy-data-list'))
	})

	it('displays the data list in loading state', () => {
		cy.mountWithVuetify(DataList, {
			props: {
				items: defaultItems,
				loading: true,
			},
		})

		cy.get('.sy-data-list-loading').should('be.visible')
		cy.get('.v-skeleton-loader').should('be.visible')
		cy.matchImageSnapshot('data-list-loading', cy.get('.sy-data-list-loading'))
	})

	it('displays the data list in row layout', () => {
		cy.mountWithVuetify(DataList, {
			props: {
				items: defaultItems,
				row: true,
			},
		})

		cy.get('.sy-data-list').should('be.visible')
		cy.get('.sy-data-list-item').should('have.length', 3)
		cy.matchImageSnapshot('data-list-row', cy.get('.sy-data-list'))
	})

	it('displays the data list with icons', () => {
		cy.mountWithVuetify(DataList, {
			props: {
				items: itemsWithIcons,
				icons: iconsMap,
			},
		})

		cy.get('.sy-data-list').should('be.visible')
		cy.get('.sy-data-list-item').should('have.length', 3)
		cy.get('.sy-data-list-item .v-icon').should('have.length', 3)
		cy.matchImageSnapshot('data-list-with-icons', cy.get('.sy-data-list'))
	})
})

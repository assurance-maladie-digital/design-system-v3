import SyServerTable from '../SyServerTable.vue'
describe('SyServerTable – RGAA browser checks – CNAM theme', () => {
	it('9.1 and 11.1 – renders the server table structure', () => {
		cy.mountWithVuetify(SyServerTable, { props: { caption: 'Résultats', headers: [{ title: 'Nom', key: 'name' }], items: [{ name: 'Ada' }], serverItemsLength: 1, hideDefaultFooter: true } })
		cy.get('caption').should('contain.text', 'Résultats')
		cy.get('th[scope="col"]').should('exist')
	})
})

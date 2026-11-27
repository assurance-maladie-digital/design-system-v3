import SyTable from '../SyTable.vue'
describe('SyTable – RGAA browser checks – CNAM theme', () => {
	it('9.1 and 11.1 – renders a caption and scoped data headers', () => {
		cy.mountWithVuetify(SyTable, { props: { caption: 'Liste des agents', headers: [{ title: 'Nom', key: 'name' }], items: [{ name: 'Ada' }], hideDefaultFooter: true } })
		cy.get('caption').should('contain.text', 'Liste des agents')
		cy.get('th[scope="col"]').should('exist')
		cy.get('tbody').should('contain.text', 'Ada')
	})
})

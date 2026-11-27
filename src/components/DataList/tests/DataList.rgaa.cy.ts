import DataList from '../DataList.vue'

describe('DataList – RGAA browser checks – CNAM theme', () => {
	it('10.12 – keeps long values available with increased text spacing', () => {
		cy.mountWithVuetify(DataList, {
			props: {
				listTitle: 'Informations',
				items: [{ key: 'Description', value: 'Une description suffisamment longue pour vérifier la disponibilité du contenu.' }],
			},
		})
		cy.document().then((document) => {
			const style = document.createElement('style')
			style.textContent = 'body { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }'
			document.head.appendChild(style)
		})
		cy.get('.sy-data-list').should('be.visible').and('contain.text', 'Description')
	})
})

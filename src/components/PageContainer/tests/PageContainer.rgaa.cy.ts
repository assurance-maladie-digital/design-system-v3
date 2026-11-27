import { h } from 'vue'
import PageContainer from '../PageContainer.vue'

describe('PageContainer – RGAA browser checks – CNAM theme', () => {
	it('10.11 – keeps page content available in the viewport', () => {
		cy.mountWithVuetify(PageContainer, { slots: { default: () => h('main', { id: 'main' }, 'Contenu principal') } })
		cy.get('main#main').should('be.visible').and('contain', 'Contenu principal')
	})
})

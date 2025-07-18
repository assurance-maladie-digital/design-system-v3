import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproMultipleFoldingCard from '../AmeliproMultipleFoldingCard.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproMultipleFoldingCard', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproMultipleFoldingCard, {
			global: {
				plugins: [vuetify],
			},
			props: {
				tabs: [
					{
						id: 'amelipro-multiple-folding-card-item-1',
						title: 'Exemple 1',
						valid: true,
					},
					{
						error: true,
						id: 'amelipro-multiple-folding-card-item-2',
						title: 'Exemple 2',
					},
					{
						id: 'amelipro-multiple-folding-card-item-3',
						title: 'Exemple 3',
					},
					{
						id: 'amelipro-multiple-folding-card-item-4',
						title: 'Exemple 4',
					},
				],
				title: 'titre de la carte',
				uniqueId: 'my-mutliple-folding-card-id',
			},
			slots: {
				'amelipro-multiple-folding-card-item-1': '<p>Contenu appliqué au premier dépliant seulement</p>',
				'item': '<p>Contenu appliqué à tous les dépliants de la carte</p>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'import AmeliproResultList from '../AmeliproResultList.vue'

describe('AmeliproResultList', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproResultList, {
			props: {
				items: [
					{ id: 0 },
					{ id: 1 },
					{ id: 2 },
					{ id: 3 },
					{ id: 4 },
					{ id: 5 },
					{ id: 6 },
					{ id: 7 },
					{ id: 8 },
					{ id: 9 },
					{ id: 10 },
					{ id: 11 },
				],
				title: 'Exemple de liste de résultats',
				uniqueId: 'amelipro-result-unique-id',
			},
			slots: {
				result: '<p>Exemple de résultat</p>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'import CookiesTable from '../CookiesTable.vue'

describe('CookiesTable', () => {
	it('renders correctly', () => {
		const wrapper = shallowMount(CookiesTable, {
			propsData: {
				items: [
					{
						name: 'session',
						description: 'Sauvegarde la session pour rester connecté.',
						conservation: '20 heures',
					},
					{
						name: 'cookie_policy',
						description: 'Sauvegarde les préférences de cookies.',
						conservation: '1 an',
					},
				],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

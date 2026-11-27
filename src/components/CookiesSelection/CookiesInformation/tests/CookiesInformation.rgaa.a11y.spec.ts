// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import CookiesInformation from '../CookiesInformation.vue'

describe('CookiesInformation – RGAA contract', () => {
	it('7.1, 8.2 and 11.1 – exposes disclosure and native cookie choice controls', () => {
		const wrapper = mount(CookiesInformation, {
			props: {
				type: 'functional',
				tableItems: [{ name: 'session', description: 'Session', conservation: '20 heures' }],
			},
		})

		expect(wrapper.get('summary').text()).toContain('Afficher les cookies')
		expect(wrapper.findAll('input[type="radio"]')).toHaveLength(2)
		expect(wrapper.get('details').element).toBeTruthy()
	})
})

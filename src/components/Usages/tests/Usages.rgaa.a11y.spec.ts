// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Usages from '../Usages.vue'

describe('Usages – RGAA contract', () => {
	it('8.2 and 9.1 – exposes two labelled lists for recommendations', () => {
		const wrapper = mount(Usages, {
			props: { items1: ['Utiliser un bouton'], items2: ['Ne pas supprimer le libellé'] },
		})

		expect(wrapper.findAll('ul')).toHaveLength(2)
		expect(wrapper.findAll('li')).toHaveLength(2)
		expect(wrapper.text()).toContain('À faire')
		expect(wrapper.text()).toContain('À ne pas faire')
	})
})

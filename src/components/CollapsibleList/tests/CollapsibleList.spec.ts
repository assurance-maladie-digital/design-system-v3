import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'

import CollapsibleList from '../CollapsibleList.vue'
describe('CollapsibleList', () => {
	it('renders correctly', async () => {
		const wrapper = mount(CollapsibleList, {
			propsData: {
				listTitle: 'Santé',
				items: [
					{
						text: 'Mon espace santé',
						href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
					},
					{
						text: 'Accomplir les bons gestes',
						href: 'https://www.ameli.fr/assure/sante/bons-gestes',
					},
				],
			},
		})

		expect(wrapper.find('h4').text()).toBe('Santé')
		expect(wrapper.findAll('a')).toHaveLength(2)
		expect(wrapper.findAll('a').at(0)?.text()).toBe('Mon espace santé')
		expect(wrapper.findAll('a').at(1)?.text()).toBe('Accomplir les bons gestes')
	})

	it('renders correctly with in mobile mode', () => {
		const wrapper = mount(CollapsibleList, {
			propsData: {
				listTitle: 'Santé',
				items: [
					{
						text: 'Mon espace santé',
						href: 'https://www.ameli.fr/assure/sante/mon-espace-sante',
					},
					{
						text: 'Accomplir les bons gestes',
						href: 'https://www.ameli.fr/assure/sante/bons-gestes',
					},
				],
			},
		})

		wrapper.vm.$vuetify.display.name = 'xs'
		wrapper.vm.$vuetify.display.smAndDown = true

		expect(wrapper.find('.vd-collapse-list-mobile')).toBeTruthy()
	})
})

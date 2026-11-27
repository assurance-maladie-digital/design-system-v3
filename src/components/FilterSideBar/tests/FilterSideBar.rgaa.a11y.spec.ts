// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { VApp } from 'vuetify/components'
import FilterSideBar from '../FilterSideBar.vue'

export const filterSideBarRgaaCriteria = ['1.2', '3.3', '7.1', '7.3', '7.5', '8.2', '9.2', '9.3', '10.1', '10.7', '10.11'] as const

describe('FilterSideBar – executable RGAA contracts', () => {
	it('7.1 and 9.2 – exposes a named filter button', () => {
		const wrapper = mount({ components: { VApp, FilterSideBar }, template: '<VApp><FilterSideBar /></VApp>' })
		expect(wrapper.get('.sy-filters-side-bar__open-btn').text()).toContain('Filtres')
		expect(wrapper.get('.sy-filters-side-bar__open-btn').element.tagName).toBe('BUTTON')
	})
})

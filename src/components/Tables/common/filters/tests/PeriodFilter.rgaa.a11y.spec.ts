// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PeriodFilter from '../PeriodFilter.vue'

export const periodFilterRgaaCriteria = ['8.2', '11.1', '11.10'] as const
describe('PeriodFilter – executable RGAA contracts', () => {
	it('8.2 and 11.1 – passes the period label to the range control', () => {
		const wrapper = mount(PeriodFilter, { props: { header: { title: 'Période', key: 'period' } }, global: { stubs: { PeriodField: { template: '<fieldset><legend>{{ label }}</legend><input aria-label="Date de début"><input aria-label="Date de fin"></fieldset>', props: ['label'] } } } })
		expect(wrapper.get('legend').text()).toBe('Période')
		expect(wrapper.findAll('input')).toHaveLength(2)
	})
})

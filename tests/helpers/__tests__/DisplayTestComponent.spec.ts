/* eslint-disable @typescript-eslint/no-explicit-any */
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import { DisplayTestComponent } from '../utils'

function getValue(val: any) {
	return typeof val === 'object' && val !== null && 'value' in val ? val.value : val
}

describe('DisplayTestComponent', () => {
	it('permet de lire et modifier mdAndUp', async () => {
		const wrapper = mount(DisplayTestComponent)
		const initial = getValue(wrapper.vm.mdAndUp)

		wrapper.vm.setMdAndUp(!initial)
		expect(getValue(wrapper.vm.mdAndUp)).toBe(!initial)

		wrapper.vm.setMdAndUp(initial)
		expect(getValue(wrapper.vm.mdAndUp)).toBe(initial)
	})

	it('permet de lire et modifier smAndDown', async () => {
		const wrapper = mount(DisplayTestComponent)
		const initial = getValue(wrapper.vm.smAndDown)

		wrapper.vm.setSmAndDown(!initial)
		expect(getValue(wrapper.vm.smAndDown)).toBe(!initial)
	})

	it('permet de lire et modifier smAndUp', async () => {
		const wrapper = mount(DisplayTestComponent)
		const initial = getValue(wrapper.vm.smAndUp)

		wrapper.vm.setSmAndUp(!initial)
		expect(getValue(wrapper.vm.smAndUp)).toBe(!initial)
	})

	it('permet de lire et modifier width', async () => {
		const wrapper = mount(DisplayTestComponent)
		const initial = getValue(wrapper.vm.width)

		wrapper.vm.setWidth(1234)
		expect(getValue(wrapper.vm.width)).toBe(1234)

		wrapper.vm.setWidth(initial)
		expect(getValue(wrapper.vm.width)).toBe(initial)
	})

	it('resetDefaults remet les valeurs initiales', async () => {
		const wrapper = mount(DisplayTestComponent)
		const initialMdAndUp = getValue(wrapper.vm.mdAndUp)
		wrapper.vm.setMdAndUp(!initialMdAndUp)
		expect(getValue(wrapper.vm.mdAndUp)).toBe(!initialMdAndUp)
		wrapper.vm.resetDefaults()
		expect(getValue(wrapper.vm.mdAndUp)).toBe(initialMdAndUp)
	})
})

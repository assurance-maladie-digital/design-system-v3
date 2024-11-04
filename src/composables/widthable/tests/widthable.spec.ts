import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

import { Widthable } from '../'

function createTestComponent() {
	return defineComponent({
		mixins: [Widthable],
		template: '<div />',
	})
}

describe('Widthable', () => {
	it('computes the default styles', () => {
		const testComponent = createTestComponent()
		const wrapper = mount(testComponent)

		expect(wrapper.vm.widthStyles).toBe('width: 100%;')
	})

	it('computes the styles when min-width is defined', () => {
		const testComponent = createTestComponent()
		const wrapper = mount(testComponent, {
			propsData: {
				minWidth: '512px',
			},
		})

		expect(wrapper.vm.widthStyles).toBe('min-width: 512px; width: 100%;')
	})

	it('computes the styles when max-width is defined', () => {
		const testComponent = createTestComponent()
		const wrapper = mount(testComponent, {
			propsData: {
				maxWidth: '512px',
			},
		})

		expect(wrapper.vm.widthStyles).toBe('max-width: 512px; width: 100%;')
	})
})

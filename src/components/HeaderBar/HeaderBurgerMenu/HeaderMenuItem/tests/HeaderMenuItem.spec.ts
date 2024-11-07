import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderMenuItem from '../HeaderMenuItem.vue'

describe('HeaderMenuItem', () => {
	it('should render the component', async () => {
		const wrapper = mount(HeaderMenuItem, {
			slots: {
				default: '<a>Test</a>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('a').text()).toBe('Test')
	})
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'import ErrorPage from '../ErrorPage.vue'

describe('ErrorPage', () => {
	it('renders correctly', () => {
		const wrapper = mount(ErrorPage, {
			props: {
				pageTitle: 'Something went wrong',
				message: 'Error message',
			},
		})

		expect(wrapper.text()).toContain('Something went wrong')
		expect(wrapper.text()).toContain('Error message')
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with undefined route', () => {
		const wrapper = mount(ErrorPage, {
			props: {
				code: '501',
				pageTitle: 'Error',
				message: 'Error message',
				btnText: 'Go to...',
				btnHref: 'https://google.com',
			},
		})

		expect(wrapper.find('a').exists()).toBe(true)
		expect(wrapper.html()).toMatchSnapshot()
	})
})

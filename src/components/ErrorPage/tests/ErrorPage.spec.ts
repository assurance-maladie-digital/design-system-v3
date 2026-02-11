import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

import ErrorPage from '..'

describe('ErrorPage', () => {
	it('renders correctly', () => {
		const wrapper = shallowMount(ErrorPage)

		expect(wrapper.html()).toMatchSnapshot()
	})
})

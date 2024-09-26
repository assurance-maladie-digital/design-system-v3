import { mount } from '@vue/test-utils'

import SkipLink from '../'

import { describe, it, expect } from 'vitest'

describe('SkipLink', () => {
	it('renders correctly', async () => {
		const wrapper = mount(SkipLink)

		expect(wrapper.html()).toMatchSnapshot()
	})
})

// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyHeading from '../SyHeading.vue'

export const syHeadingRgaaCriteria = ['9.1'] as const

describe('SyHeading – executable RGAA contracts', () => {
	it('9.1 – renders the requested native heading level', () => {
		const wrapper = mount(SyHeading, { props: { level: 2 }, slots: { default: 'Titre de section' } })
		expect(wrapper.get('h2').text()).toBe('Titre de section')
	})
})

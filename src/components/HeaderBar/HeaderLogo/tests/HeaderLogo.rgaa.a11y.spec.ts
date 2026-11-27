// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import HeaderLogo from '../HeaderLogo.vue'

export const headerLogoRgaaCriteria = ['1.2', '9.1', '11.1', '12.6'] as const

describe('HeaderLogo – executable RGAA contracts', () => {
	it('1.2 and 11.1 – exposes an alternative text for the logo image', () => {
		const wrapper = mount(HeaderLogo, { props: { logoAlt: 'Assurance Maladie', serviceTitle: 'Mon service' } })
		expect(wrapper.get('img.logo-image').attributes('alt')).toBe('Assurance Maladie')
		expect(wrapper.text()).toContain('Mon service')
	})
})

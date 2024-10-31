import { mount } from '@vue/test-utils'
import Logo from '../Logo.vue'
import { describe, it, expect } from 'vitest'

import { cnamLightTheme } from '@/designTokens/tokens/cnam/cnamLightTheme'
import { locales } from '@/components/Logo/locales'
import { LogoSize } from '@/components/Logo/LogoSize'
import { logoDimensionsMapping } from '@/components/Logo/logoDimensionsMapping'

describe('Logo.vue', () => {
	it('renders correctly with default props', () => {
		const wrapper = mount(Logo)
		expect(wrapper.find('svg').exists()).toBe(true)
		expect(wrapper.find('svg').attributes('fill')).toBe(cnamLightTheme.primary)
		expect(wrapper.find('svg').attributes('aria-label')).toBe('Sécurité sociale, l’Assurance Maladie : Agir ensemble, protéger chacun')
	})

	it('renders correctly with dark prop', () => {
		const wrapper = mount(Logo, {
			props: { dark: true },
		})
		expect(wrapper.find('svg').attributes('fill')).toBe('#fff')
	})

	it('renders correctly with avatar prop', () => {
		const wrapper = mount(Logo, {
			props: { avatar: true },
		})
		expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true')
		expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 64 64')
	})

	it('renders correctly with hideSignature prop', () => {
		const wrapper = mount(Logo, {
			props: { hideSignature: true },
		})
		expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 206 64')
	})

	it('renders correctly with hideOrganism prop', () => {
		const wrapper = mount(Logo, {
			props: { hideOrganism: true },
		})
		expect(wrapper.find('svg').attributes('aria-label')).toBe('l’Assurance Maladie : Agir ensemble, protéger chacun')
	})

	it('renders correctly with risquePro prop', () => {
		const wrapper = mount(Logo, {
			props: { risquePro: true },
		})
		expect(wrapper.find('svg').attributes('aria-label')).toBe(`${locales.assuranceMaladie}: ${locales.risquePro}`)
		expect(wrapper.find('path').attributes('fill')).toBe(cnamLightTheme.risquePro)
	})

	it('renders correctly with custom ariaLabel', () => {
		const customLabel = 'Custom Aria Label'
		const wrapper = mount(Logo, {
			props: { ariaLabel: customLabel },
		})
		expect(wrapper.find('svg').attributes('aria-label')).toBe(customLabel)
	})

	it('renders correctly with size prop', () => {
		const wrapper = mount(Logo, {
			props: { size: LogoSize.SMALL },
		})
		expect(wrapper.find('svg').attributes('width')).toBe(logoDimensionsMapping[LogoSize.SMALL].width)
		expect(wrapper.find('svg').attributes('height')).toBe(logoDimensionsMapping[LogoSize.SMALL].height)
	})

	it('validates size prop correctly', () => {
		const validator = Logo.props.size.validator
		expect(validator(LogoSize.SMALL)).toBe(true)
	})
})

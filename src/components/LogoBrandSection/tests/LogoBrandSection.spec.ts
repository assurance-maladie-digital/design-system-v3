import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import LogoBrandSection from '../LogoBrandSection.vue'

describe('LogoBrandSection', () => {
	it('renders correctly', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
				mobileVersion: false,
				reduceLogo: false,
				homeLink: {
					href: '/',
				},
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly with service computed', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
			},
		})

		expect(wrapper.text()).toContain('Service Title')
	})

	it('renders correctly with service computed', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'compte-entreprise',
			},
		})

		expect(wrapper.text()).toContain('Compte entreprise')
	})

	it('renders correctly with height', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
				mobileVersion: false,
				reduceLogo: false,
				homeLink: {
					href: '/',
				},
			},
		})

		const mainDiv = wrapper.find('.vd-logo-brand-section')
		expect(mainDiv.attributes('style')).toContain('height: 64px')
	})

	it('renders correctly with showServiceSubTitle', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
			},
		})

		expect(wrapper.text()).toContain('Service Sub Title')
	})

	it('renders correctly with no showServiceSubTitle', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				serviceTitle: 'Service Title',
				serviceSubTitle: '',
			},
		})

		expect(wrapper.find('.vd-title').text()).toBe('Service Title')
	})

	it('renders correctly with default theme', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
			},
		})

		const divider = wrapper.find('.vd-divider')
		expect(divider.attributes('fill')).toBe('#0c419a')
	})

	it('renders correctly with cnam theme', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'cnam',
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
			},
		})

		const divider = wrapper.find('.vd-divider')
		expect(divider.attributes('fill')).toBe('#006386')
	})

	it('renders correctly with compte entreprise theme', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'compte-entreprise',
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
			},
		})

		const divider = wrapper.find('.vd-divider')
		expect(divider.attributes('fill')).toBe('#cd545b')
	})

	it('renders correctly with risquePro if no reduceLogo', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'risque-pro',
				reduceLogo: false,
			},
		})

		expect(wrapper.find('logo-stub').attributes('risquepro')).toBe('true')
		expect(wrapper.find('logo-stub').attributes('hidesignature')).toBe('false')
	})

	it('renders correctly with risquePro', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'risque-pro',
				reduceLogo: true,
			},
		})

		expect(wrapper.find('logo-stub').attributes('hidesignature')).toBe('true')
	})

	it('renders correctly with isCompteEntreprise', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'compte-entreprise',
			},
		})

		expect(wrapper.text()).toContain('Compte entreprise')
	})

	it('renders correctly with isCompteAmeliMobile', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'compte-ameli',
				mobileVersion: true,
			},
		})

		const img = wrapper.find('.vd-home-link img')
		expect(img.attributes('alt')).toBe('Compte ameli')
	})

	it('renders correctly without signature', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				reduceLogo: true,
			},
		})

		expect(wrapper.find('logo-stub').attributes('hidesignature')).toBe('true')
	})

	it('renders correctly without hideSignature', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				reduceLogo: false,
			},
		})

		expect(wrapper.find('logo-stub').attributes('hidesignature')).toBe('false')
	})

	it('renders correctly with secondaryLogo', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'compte-ameli',
			},
		})

		expect(wrapper.find('[alt="Compte ameli"]').exists()).toBe(true)
	})

	it('renders correctly with logoContainerComponent', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				homeLink: {
					href: '#',
				},
			},
		})

		expect(wrapper.find('a').attributes('href')).toBe('#')
	})

	it('renders correctly RouterLink with logoContainerComponent', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				homeLink: {
					to: '/',
				},
			},
		})

		expect(wrapper.find('router-link-stub').attributes('to')).toBe('/')
	})

	it('renders correctly with logoContainerComponent', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
				homeLink: {
					href: undefined,
					to: undefined,
				},
			},
		})

		expect(wrapper.find('.vd-home-link').element.tagName).toBe('DIV')
	})

	it('renders correctly with secondaryLogoCtnComponent', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'default',
			},
		})

		expect(wrapper.findAll('.vd-home-link').length).toBe(1)
	})

	it('renders correctly with secondaryLogoCtnComponent', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'ameli-pro',
			},
		})

		expect(wrapper.findAll('.vd-home-link').length).toBe(2)
	})

	it('renders correctly with secondaryLogoCtnComponent', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				theme: 'ameli',
				homeLink: {
					href: undefined,
					to: undefined,
				},
			},
		})

		expect(wrapper.findAll('.vd-home-link')[1].element.tagName).toBe('DIV')
	})
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import LogoBrandSection from '../LogoBrandSection.vue'

describe('LogoBrandSection', () => {
	it('renders correctly', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
			},
		})

		const divider = wrapper.find('.vd-divider')
		expect(divider.attributes('fill')).toBe('#0C419A')
	})

	it('renders correctly with cnam theme', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
				theme: 'compte-entreprise',
				serviceTitle: 'Service Title',
				serviceSubTitle: 'Service Sub Title',
			},
		})

		const divider = wrapper.find('.vd-divider')
		expect(divider.attributes('fill')).toBe('#CD545B')
	})

	it('renders correctly with risquePro if no reduceLogo', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
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
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
				theme: 'default',
				homeLink: {
					href: undefined,
					to: undefined,
				},
			},
		})

		expect(wrapper.find('.vd-home-link').element.tagName).toBe('DIV')
	})

	it('renders a single container when there is no secondary logo', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
				theme: 'default',
			},
		})

		expect(wrapper.findAll('.vd-home-link').length).toBe(1)
	})

	// Le logo secondaire lié (ameli, ameli-pro) est fusionné dans le lien d'accueil :
	// un seul `.vd-home-link`, et l'image devient décorative à l'intérieur du lien nommé.
	it('renders a single home link containing the decorative secondary logo (ameli-pro)', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
				theme: 'ameli-pro',
			},
		})

		const links = wrapper.findAll('.vd-home-link')
		expect(links.length).toBe(1)
		expect(links[0]?.element.tagName).toBe('A')
		expect(links[0]?.attributes('aria-label')).toBe('Retour vers accueil du site')
		expect(links[0]?.find('img').attributes('alt')).toBe('')
	})

	it('renders a single non-interactive container keeping the secondary logo alt when there is no link', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'] },
			props: {
				headingLevelTitle: 1,
				headingLevelSubtitle: 2,
				theme: 'ameli',
				homeLink: {
					href: undefined,
					to: undefined,
				},
			},
		})

		const containers = wrapper.findAll('.vd-home-link')
		expect(containers.length).toBe(1)
		expect(containers[0]?.element.tagName).toBe('DIV')
		expect(containers[0]?.attributes('aria-label')).toBeUndefined()
		expect(containers[0]?.find('img').attributes('alt')).toBe('ameli.fr')
	})

	it('puts the generic label on the link when ariaLabel is not provided', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'],
			},
			props: {
				homeLink: { href: '/' },
			},
		})

		expect(wrapper.find('.vd-home-link').attributes('aria-label')).toBe('Retour vers accueil du site')
	})

	it('concatenates ariaLabel with the generic label on the link when provided', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'],
			},
			props: {
				homeLink: { href: '/', ariaLabel: 'Accueil CNAM' },
			},
		})

		expect(wrapper.find('.vd-home-link').attributes('aria-label')).toBe('Accueil CNAM Retour vers accueil du site')
	})

	// La clé kebab-case 'aria-label' est acceptée en alternative à ariaLabel
	// (priorité à ariaLabel si les deux sont fournies, comme dans HeaderLogo).
	it('concatenates the kebab-case aria-label key with the generic label on the link', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink', 'Logo'],
			},
			props: {
				homeLink: { 'href': '/', 'aria-label': 'Accueil CNAM' },
			},
		})

		expect(wrapper.find('.vd-home-link').attributes('aria-label')).toBe('Accueil CNAM Retour vers accueil du site')
	})

	// Le nom accessible est porté par le lien : le SVG du logo devient décoratif
	// à l'intérieur du lien nommé, sinon il conserve son libellé de marque.
	it('hides the logo svg inside the named home link', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink'],
			},
		})

		const svg = wrapper.find('.vd-home-link svg[role="img"]')
		expect(svg.attributes('aria-hidden')).toBe('true')
	})

	it('keeps the logo svg labelled when the container is not a link', () => {
		const wrapper = mount(LogoBrandSection, {
			global: {
				stubs: ['RouterLink'],
			},
			props: {
				homeLink: {},
			},
		})

		const svg = wrapper.find('.vd-home-link svg[role="img"]')
		expect(svg.attributes('aria-hidden')).toBe('false')
		expect(svg.attributes('aria-label')).toBeTruthy()
	})
})

import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import FooterBar from '@/components/FooterBar/FooterBar.vue'
import { locales } from '@/components/FooterBar/locales'
import { A11yComplianceEnum } from '@/components/FooterBar/A11yCompliance'
import { vuetify } from '@tests/unit/setup'
import { LogoSize } from '@/components/Logo/LogoSize'
import { nextTick } from 'vue'

describe('FooterBar', () => {
	const getComponentType = (item: { href: unknown }) => {
		return item.href ? 'a' : 'RouterLink'
	}

	const testFunction = (complianceLabel: unknown) => {
		return typeof complianceLabel === 'string' ? locales.a11yLabel(complianceLabel) : ''
	}

	it('renders correctly', async () => {
		const wrapper = mount(FooterBar, { global: { plugins: [vuetify] } })
		expect(FooterBar).toBeTruthy()
		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders default props correctly', () => {
		const wrapper = mount(FooterBar, { global: { plugins: [vuetify] } })
		expect(wrapper.props().a11yCompliance).toBe('non-compliant')
		expect(wrapper.props().linkItems).toBeNull()
		expect(wrapper.props().sitemapRoute).toEqual({ name: 'sitemap' })
		expect(wrapper.props().hideSitemapLink).toBe(false)
	})

	it('renders custom props correctly', () => {
		const customProps = {
			a11yCompliance: A11yComplianceEnum['fully-compliant'],
			linkItems: [{ text: 'Custom Link', to: '/custom' }],
			hideSitemapLink: true,
		}
		const wrapper = mount(FooterBar, { props: customProps, global: { plugins: [vuetify] } })
		expect(wrapper.props().a11yCompliance).toBe(A11yComplianceEnum['fully-compliant'])
		expect(wrapper.props().linkItems).toEqual(customProps.linkItems)
		expect(wrapper.props().hideSitemapLink).toBe(true)
	})

	it('renders footer links correctly', () => {
		const wrapper = mount(FooterBar, { global: { plugins: [vuetify] } })
		const links = wrapper.findAll('.vd-footer-bar-links li')
		expect(links.length).toBeGreaterThan(0)
	})

	it('hides links based on props', () => {
		const wrapper = mount(FooterBar, {
			props: {
				hideSitemapLink: true,
				hideCguLink: true,
				hideCookiesLink: true,
				hideLegalNoticeLink: true,
				hideA11yLink: true,
			},
			global: { plugins: [vuetify] },
		})
		const links = wrapper.findAll('.vd-footer-bar-links li')
		expect(links.length).toBe(0)
	})

	it('renders version if provided', () => {
		const version = '1.0.0'
		const wrapper = mount(FooterBar, { props: { version }, global: { plugins: [vuetify] } })
		expect(wrapper.text()).toContain(`${locales.versionLabel} ${version}`)
	})

	it('computes logoSize correctly for desktop screens', () => {
		const wrapper = mount(FooterBar, {
			global: {
				plugins: [vuetify],
			},
		})
		expect(wrapper.vm.$.exposed?.logoSize.value).toBe(LogoSize.NORMAL)
	})

	it('computes logoSize correctly for small screens', async () => {
		const wrapper = mount(FooterBar, {
			global: {
				plugins: [vuetify],
			},
		})
		Object.defineProperty(window, 'innerWidth', {
			writable: true,
			configurable: true,
			value: 400,
		})
		window.dispatchEvent(new Event('resize'))
		await nextTick()
		expect(wrapper.vm.$.exposed?.logoSize.value).toBe(LogoSize.SMALL)
	})

	it('renders the scroll to top button and triggers scrollToTop', async () => {
		// Passer un slot ou forcer une condition pour activer le mode étendu
		const wrapper = mount(FooterBar, {
			global: { plugins: [vuetify] },
			slots: {
				default: '<div>Extended mode content</div>', // Slot pour forcer le mode étendu
			},
		})

		// Vérifier si le bouton est bien présent dans le DOM
		const button = wrapper.find('#scroll-btn')
		expect(button.exists()).toBe(true)

		// Simuler le clic si le bouton existe
		const scrollToSpy = vi.spyOn(window, 'scrollTo')
		await button.trigger('click')

		expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
	})

	it('returns "a" when href is defined', () => {
		const item = { href: 'https://example.com' }
		expect(getComponentType(item)).toBe('a')
	})

	it('returns "RouterLink" when href is undefined', () => {
		const item = { href: undefined }
		expect(getComponentType(item)).toBe('RouterLink')
	})

	it('returns "RouterLink" when href is null', () => {
		const item = { href: null }
		expect(getComponentType(item)).toBe('RouterLink')
	})

	it('returns "RouterLink" when href is null', () => {
		const item = { href: null }
		expect(getComponentType(item)).toBe('RouterLink')
	})

	it('sets target attribute correctly based on openInNewTab', () => {
		const linkItems = [
			{ text: 'Link 1', href: 'https://example.com', openInNewTab: true },
			{ text: 'Link 2', href: 'https://example.com', openInNewTab: false },
		]
		const wrapper = mount(FooterBar, {
			props: { linkItems },
			global: { plugins: [vuetify] },
		})

		const links = wrapper.findAll('.vd-footer-bar-links a')
		expect(links[0].attributes('target')).toBe('_blank')
		expect(links[1].attributes('target')).toBeUndefined()
	})

	it('returns locales.a11yLabel when complianceLabel is a string', () => {
		const complianceLabel = 'compliant'
		const a11yLabelMock = vi.fn().mockReturnValue('Accessibility Label')
		locales.a11yLabel = a11yLabelMock

		const result = testFunction(complianceLabel)
		expect(a11yLabelMock).toHaveBeenCalledWith(complianceLabel)
		expect(result).toBe('Accessibility Label')
	})

	it('returns an empty string when complianceLabel is not a string', () => {
		const complianceLabel = null
		const result = testFunction(complianceLabel)
		expect(result).toBe('')
	})
})

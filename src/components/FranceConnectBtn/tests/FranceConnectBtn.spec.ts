import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import FranceConnectBtn from '../FranceConnectBtn.vue'
import { VThemeProvider } from 'vuetify/components'

describe('FranceConnectBtn', () => {
	it('renders correctly', () => {
		const wrapper = mount(FranceConnectBtn, {
			propsData: {
				href: 'https://app.franceconnect.gouv.fr/',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
		expect(wrapper.find('.sy-france-connect-link').attributes('href')).toBe('https://app.franceconnect.gouv.fr/')
	})

	it('renders correctly with connect-plus', () => {
		const wrapper = mount(FranceConnectBtn, {
			propsData: {
				href: 'https://app.franceconnect.gouv.fr/',
				isConnectPlus: true,
			},
		})

		expect(wrapper.html()).toMatchSnapshot()

		const fillValue = wrapper.findAll('path').at(-1)?.attributes('fill')

		expect(fillValue).toBe('#f5f5fe')
	})

	it('renders correctly in black', () => {
		const wrapper = mount({
			components: { FranceConnectBtn, VThemeProvider },
			template: `
                <VThemeProvider
                    theme="dark"
                    with-background
                >
                    <FranceConnectBtn href="https://app.franceconnect.gouv.fr/" isConnectPlus />
                </VThemeProvider>`,
		})

		expect(wrapper.html()).toMatchSnapshot()

		const fillValue = wrapper.findAll('path').at(-1)?.attributes('fill')

		expect(fillValue).toBe('#000091')
	})
})

// Composant de marque (DSFR) : le ring de focus suit le bleu focus de l'État (#0a76f6),
// PAS l'override global (les liens sont des <a>, pas des .v-btn). jsdom ne calcule pas
// :focus-visible : on vérifie les prérequis structurels — <a> natif focusable + classe dark.
describe('FranceConnectBtn - focus', () => {
	it('renders a native <a> so the focus ring applies', () => {
		const wrapper = mount(FranceConnectBtn, { props: { href: 'https://franceconnect.gouv.fr' } })
		expect(wrapper.get('.sy-france-connect-link').element.tagName).toBe('A')
		wrapper.unmount()
	})

	it('carries the --dark class in dark mode', () => {
		const wrapper = mount(FranceConnectBtn, {
			props: { href: 'https://franceconnect.gouv.fr', dark: true },
		})
		expect(wrapper.get('.sy-france-connect-btn').classes()).toContain('sy-france-connect-btn--dark')
		wrapper.unmount()
	})

	it('is focusable', () => {
		const wrapper = mount(FranceConnectBtn, {
			props: { href: 'https://franceconnect.gouv.fr' },
			attachTo: document.body,
		})
		const link = wrapper.get('.sy-france-connect-link').element as HTMLAnchorElement
		link.focus()
		expect(document.activeElement).toBe(link)
		wrapper.unmount()
	})
})

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

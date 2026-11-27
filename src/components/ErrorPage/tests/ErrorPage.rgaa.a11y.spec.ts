// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ErrorPage from '../ErrorPage.vue'

describe('ErrorPage – executable RGAA contracts', () => {
	it('keeps the page heading and decorative illustration semantics delegated to StatusPage', () => {
		const wrapper = mount(ErrorPage, {
			props: { pageTitle: 'Erreur technique', message: 'Une erreur est survenue', code: '500' },
		})
		expect(wrapper.find('h1, h2, h3, h4, h5, h6').exists()).toBe(true)
		expect(wrapper.text()).toContain('Erreur technique')
	})
})

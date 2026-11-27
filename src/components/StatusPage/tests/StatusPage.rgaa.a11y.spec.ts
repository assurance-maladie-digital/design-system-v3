// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StatusPage from '../StatusPage.vue'

export const statusPageRgaaCriteria = ['9.1', '10.7', '11.9'] as const

describe('StatusPage – executable RGAA contracts', () => {
	it('9.1 and 11.9 – exposes a page title, message and named action', () => {
		const wrapper = mount(StatusPage, { props: { pageTitle: 'Erreur', message: 'Une erreur est survenue.', btnText: 'Retour', btnHref: '/' } })
		expect(wrapper.get('h1').text()).toBe('Erreur')
		expect(wrapper.get('a,button').text()).toContain('Retour')
	})
})

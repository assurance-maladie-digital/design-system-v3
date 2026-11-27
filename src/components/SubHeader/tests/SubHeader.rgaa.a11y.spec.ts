// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SubHeader from '../SubHeader.vue'

export const subHeaderRgaaCriteria = ['1.2', '3.2', '7.1', '9.2', '9.3', '10.11', '10.12'] as const

describe('SubHeader – executable RGAA contracts', () => {
	it('9.2 and 9.3 – exposes a named region and semantic title', () => {
		const wrapper = mount(SubHeader, { props: { titleText: 'Dossier', subTitleText: 'Informations' } })
		const region = wrapper.get('[role="region"]')
		expect(region.attributes('aria-label')).toBe('Dossier')
		expect(wrapper.find('h1, h2, h3, h4, h5, h6').text()).toContain('Dossier')
	})
})

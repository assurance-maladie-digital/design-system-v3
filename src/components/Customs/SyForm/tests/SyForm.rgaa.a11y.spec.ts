// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SyForm from '../SyForm.vue'

export const syFormRgaaCriteria = ['7.1', '8.2', '11.1', '11.10'] as const

describe('SyForm – executable RGAA contracts', () => {
	it('7.1, 8.2 and 11.1 – renders a native form with labelled controls and a submit button', () => {
		const wrapper = mount(SyForm, {
			slots: { default: '<label for="name">Nom</label><input id="name" name="name"><button type="submit">Envoyer</button>' },
		})

		expect(wrapper.get('form').exists()).toBe(true)
		expect(wrapper.get('label[for="name"]').exists()).toBe(true)
		expect(wrapper.get('button[type="submit"]').exists()).toBe(true)
	})
})

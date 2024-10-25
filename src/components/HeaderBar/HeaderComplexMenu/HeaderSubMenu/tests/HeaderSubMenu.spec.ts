import { vi, describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'

import HeaderSubMenu from '../HeaderSubMenu.vue'
import { vuetify } from '@tests/unit/setup'

const registerSubMenu = vi.fn()
describe('HeaderSubMenu', () => {
	afterEach(() => {
		vi.resetAllMocks()
	})

	it('should render the component', async () => {
		const wrapper = mount(HeaderSubMenu, {
			slots: {
				title: '<h2>Sub menu title</h2>',
				default: '<ul><li><a>Test 1</a></li></ul>',
			},
			global: {
				plugins: [vuetify],
				provide: {
					registerSubMenu: registerSubMenu,
				},
			},
		})

		const content = wrapper.find('.sub-menu-content-wrapper')

		expect(wrapper.find('h2').text()).toBe('Sub menu title')
		expect(wrapper.find('.sub-menu-content').element.children[0].textContent).toBe('Test 1')
		expect(registerSubMenu.mock.calls.length).toBe(1)
		const sharedStatus = registerSubMenu.mock.calls[0][0]
		const sharedClose = registerSubMenu.mock.calls[0][1]

		expect(sharedStatus.value).toBe(false)
		expect(content.attributes('style')).toContain('display: none;')

		const btn = wrapper.find('.sub-menu-btn')
		await btn.trigger('click')

		expect(sharedStatus.value).toBe(true)
		expect(content.attributes('style')).toBeUndefined()

		await sharedClose()
		expect(sharedStatus.value).toBe(false)
		expect(content.attributes('style')).toContain('display: none;')
	})

	it('throws an error if no register function is provided', async () => {
		const mountWithoutInject = () => mount(HeaderSubMenu, {
			slots: {
				title: '<h2>Sub menu title</h2>',
				default: '<ul><li><a>Test 1</a></li></ul>',
			},
			global: {
				plugins: [vuetify],
			},
		})

		expect(mountWithoutInject).toThrowError('The HeaderSubMenu component must be used inside a HeaderComplexMenu component')
	})
})

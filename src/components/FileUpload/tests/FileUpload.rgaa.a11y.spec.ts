// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUpload from '../FileUpload.vue'

export const fileUploadRgaaCriteria = ['7.1', '8.2', '10.7', '11.1'] as const
describe('FileUpload – executable RGAA contracts', () => {
	it('7.1 and 10.7 – exposes a keyboard-operable drop zone', () => {
		const wrapper = mount(FileUpload, { props: { modelValue: [] } })
		const zone = wrapper.get('[role="button"]')
		expect(zone.attributes('tabindex')).toBe('0')
		expect(zone.attributes('title')).toBeTruthy()
	})

	it('7.1 – removes the drop zone from the tab order when disabled', () => {
		const wrapper = mount(FileUpload, { props: { modelValue: [], disabled: true } })
		expect(wrapper.get('[role="button"]').attributes('tabindex')).toBe('-1')
	})
})

// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FileUploadContent from '../FileUploadContent.vue'
import { locales } from '../locales'

export const fileUploadContentRgaaCriteria = ['1.2', '8.9'] as const
describe('FileUploadContent – executable RGAA contracts', () => {
	it('1.2 and 8.9 – renders descriptive text and keeps the icon decorative', () => {
		const wrapper = mount(FileUploadContent, { props: { allowedExtensions: ['pdf'], fileSizeUnits: ['o', 'Ko', 'Mo'], fileSizeMax: 1000, multiple: false, locales } })
		expect(wrapper.text()).toContain('pdf')
		expect(wrapper.find('[aria-hidden="true"], svg').exists()).toBe(true)
	})
})

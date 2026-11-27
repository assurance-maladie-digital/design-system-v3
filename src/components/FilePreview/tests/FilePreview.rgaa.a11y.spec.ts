// @vitest-environment jsdom
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import FilePreview from '../FilePreview.vue'

export const filePreviewRgaaCriteria = ['1.1', '1.2', '7.1', '11.1'] as const
const originalCreate = URL.createObjectURL
const originalRevoke = URL.revokeObjectURL

beforeAll(() => {
	URL.createObjectURL = vi.fn(() => 'blob:preview')
	URL.revokeObjectURL = vi.fn()
})
afterAll(() => {
	URL.createObjectURL = originalCreate
	URL.revokeObjectURL = originalRevoke
})

describe('FilePreview – executable RGAA contracts', () => {
	it('1.1 and 1.2 – exposes the configured alternative text for an image', () => {
		const wrapper = mount(FilePreview, {
			props: { file: new File([''], 'photo.png', { type: 'image/png' }), options: { image: { alt: 'Photo du document' } } },
		})
		expect(wrapper.get('img').attributes('alt')).toBe('Photo du document')
	})
})

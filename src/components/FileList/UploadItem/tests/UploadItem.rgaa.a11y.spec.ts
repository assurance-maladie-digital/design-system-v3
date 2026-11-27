// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UploadItem from '../UploadItem.vue'

export const uploadItemRgaaCriteria = ['1.2', '7.1', '8.2', '10.7'] as const
describe('UploadItem – executable RGAA contracts', () => {
	it('7.1 and 8.2 – names file actions with the file title', () => {
		const wrapper = mount(UploadItem, { props: { itemId: 'id', title: 'Justificatif', fileName: 'piece.pdf', state: 'success', showPreviewBtn: true } })
		expect(wrapper.find('.file-item__action-preview').attributes('aria-label')).toContain('piece.pdf')
		expect(wrapper.find('.file-item__action-delete').attributes('aria-label')).toContain('piece.pdf')
	})

	it('1.2 – exposes a textual status for an error', () => {
		const wrapper = mount(UploadItem, { props: { itemId: 'id', title: 'Justificatif', state: 'error' } })
		expect(wrapper.text()).toContain('Erreur')
	})
})

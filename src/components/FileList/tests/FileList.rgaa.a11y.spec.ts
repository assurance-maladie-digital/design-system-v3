// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import FileList from '../FileList.vue'

export const fileListRgaaCriteria = ['7.1', '8.2', '11.1', '11.10'] as const

describe('FileList – executable RGAA contracts', () => {
	it('7.1 and 8.2 – renders uploaded files as a list', () => {
		const wrapper = mount(FileList, { props: { uploadList: [{ id: 'identity', title: 'Carte d’identité', state: 'success', fileName: 'identite.pdf' }] } })
		expect(wrapper.get('ul.upload-list').exists()).toBe(true)
		expect(wrapper.text()).toContain('Carte d’identité')
	})
})

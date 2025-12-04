import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import AmeliproFilePreview from '../AmeliproFilePreview.vue'

describe('AmeliproFilePreview', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproFilePreview, {
			props: {
				cardTitle: 'Modified card title',
				downloadBtnText: 'Modified download btn text',
				fileName: 'file name',
				fileSrc: 'file-src',
				foldable: true,
				pdfDisplayTitle: 'Modified pdf display title',
				isOpen: true,
				linkTitle: 'Modified link title',
				previewHeight: 400,
				uniqueId: 'pdf-preview-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

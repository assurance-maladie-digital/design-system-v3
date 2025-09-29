import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproFilePreview from '../AmeliproFilePreview.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproFilePreview', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproFilePreview, {
			global: {
				plugins: [vuetify],
			},
			props: {
				cardTitle: 'Modified card title',
				downloadBtnText: 'Modified download btn text',
				fileName: 'file name',
				fileSrc: 'file-src',
				foldable: true,
				iframeTitle: 'Modified iframe title',
				isOpen: true,
				linkTitle: 'Modified link title',
				previewHeight: 400,
				uniqueId: 'pdf-preview-unique-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

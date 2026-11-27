// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import UploadWorkflow from '../UploadWorkflow.vue'

describe('UploadWorkflow – RGAA contract', () => {
	it('8.2 and 11.1 – exposes a titled upload region when empty', () => {
		const wrapper = mount(UploadWorkflow, {
			props: { sectionTitle: 'Ajouter des justificatifs' },
		})

		expect(wrapper.find('h4').text()).toBe('Ajouter des justificatifs')
		expect(wrapper.find('.sy-upload-workflow').exists()).toBe(true)
	})
})

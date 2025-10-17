import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproDialog from '../AmeliproDialog.vue'
describe('AmeliproDialog', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproDialog, {
			global: {
				stubs: {
					VDialog: {
						template: '<div><slot></slot></div>',
					},
				}},
			props: {
				modelValue: true,
				labelledby: 'amelipro-dialog-id-title',
				uniqueId: 'amelipro-dialog-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

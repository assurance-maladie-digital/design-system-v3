import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCopyBtn from '../AmeliproCopyBtn.vue'
describe('AmeliproCopyBtn', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCopyBtn, {
			props: {
				textToCopy: 'texte à copier',
				uniqueId: 'my-btn-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

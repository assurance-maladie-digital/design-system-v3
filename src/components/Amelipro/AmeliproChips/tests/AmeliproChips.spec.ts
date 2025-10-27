import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproChips from '../AmeliproChips.vue'

describe('AmeliproChips', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproChips, {
			props: {
				text: 'texte de la chip',
				uniqueId: 'my-chip-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

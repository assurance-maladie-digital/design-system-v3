import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTooltips from '../AmeliproTooltips.vue'
describe('AmeliproTooltips', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTooltips, {
			props: {
				tooltipText: 'Contenu de ma tooltip',
				uniqueId: 'my-tooltip-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

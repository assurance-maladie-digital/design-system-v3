import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTooltips from '../AmeliproTooltips.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproTooltips', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTooltips, {
			global: {
				plugins: [vuetify],
			},
			props: {
				tooltipText: 'Contenu de ma tooltip',
				uniqueId: 'my-tooltip-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

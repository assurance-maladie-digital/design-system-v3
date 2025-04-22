import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproTabs from '../AmeliproTabs.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproTabs', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproTabs, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						label: 'Mon onglet 1',
						disabled: false,
					},
					{
						label: 'Mon onglet 2',
						disabled: false,
					},
					{
						label: 'Mon onglet 3',
						disabled: true,
					},
					{
						label: 'Mon onglet 4',
						disabled: false,
					},
				],
				uniqueId: 'my-tabs-group-id',
			},
			slots: {
				'tabs-tab-panel-0': '<p>Contenu onglet 1</p>',
				'tabs-tab-panel-1': '<p>Contenu onglet 2</p>',
				'tabs-tab-panel-2': '<p>Contenu onglet 3</p>',
				'tabs-tab-panel-3': '<p>Contenu onglet 4</p>',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

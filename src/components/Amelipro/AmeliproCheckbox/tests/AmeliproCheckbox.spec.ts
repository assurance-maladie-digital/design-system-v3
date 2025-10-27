import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCheckbox from '../AmeliproCheckbox.vue'

describe('AmeliproCheckbox', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCheckbox, {
			props: {
				checkbox: {
					label: 'Exemple de checkbox',
					value: 'Valeur de la checkbox',
				},
				uniqueId: 'my-checkbox-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

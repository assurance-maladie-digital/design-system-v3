import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCallback from '../AmeliproCallback.vue'
import { vuetify } from '@tests/unit/setup'

describe('AmeliproCallback', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCallback, {
			global: {
				plugins: [vuetify],
			},
			props: {
				contentText: 'Contenu texte de la callback.',
				contentTitle: 'titre de la callback.',
				uniqueId: 'my-callback-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

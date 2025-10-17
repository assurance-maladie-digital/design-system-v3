import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproCallback from '../AmeliproCallback.vue'

describe('AmeliproCallback', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproCallback, {
			props: {
				contentText: 'Contenu texte de la callback.',
				contentTitle: 'titre de la callback.',
				uniqueId: 'my-callback-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

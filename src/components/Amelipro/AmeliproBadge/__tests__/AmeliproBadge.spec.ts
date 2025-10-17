import { mount } from '@vue/test-utils'
import { expect, describe, it } from 'vitest'
import AmeliproBadge from '../AmeliproBadge.vue'

describe('AmeliproBadge', () => {
	it('render correctly', async () => {
		const wrapper = mount(AmeliproBadge, {
			props: {
				badgeContent: 'contenu du badge',
				uniqueId: 'my-badge-id',
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})
})

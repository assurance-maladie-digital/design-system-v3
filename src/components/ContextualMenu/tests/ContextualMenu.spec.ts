import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ContextualMenu from '../ContextualMenu.vue'
import { vuetify } from '@tests/unit/setup'

describe('ContextualMenu', () => {
	it('renders correctly with items', () => {
		const wrapper = mount(ContextualMenu, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						text: 'Titre 1',
						hash: '#example-1',
					},
					{
						text: 'Titre 2',
						hash: '#example-2',
					},
				],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('renders correctly without items', () => {
		const wrapper = mount(ContextualMenu, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('emit an update:modelValue event when an item is updated', async () => {
		const wrapper = mount(ContextualMenu, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						text: 'Titre 1',
						hash: '#example-1',
					},
					{
						text: 'Titre 2',
						hash: '#example-2',
					},
				],
			},
		})

		await wrapper.find('a').trigger('click')

		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#example-1'])
	})

	it('update the highlighted item when the modelValue is updated', async () => {
		const wrapper = mount(ContextualMenu, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						text: 'Titre 1',
						hash: '#example-1',
					},
					{
						text: 'Titre 2',
						hash: '#example-2',
					},
				],
				modelValue: '#example-2',
			},
		})

		expect(wrapper.find('[href="#example-2"]').classes()).toContain('active')
	})

	it('initialize with the content of location.href', async () => {
		window.location.hash = '#example-2'

		const wrapper = mount(ContextualMenu, {
			global: {
				plugins: [vuetify],
			},
			props: {
				items: [
					{
						text: 'Titre 1',
						hash: '#example-1',
					},
					{
						text: 'Titre 2',
						hash: '#example-2',
					},
				],
			},
		})

		await wrapper.vm.$nextTick()
		expect(wrapper.find('[href="#example-2"]').classes()).toContain('active')
		expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#example-2'])
	})
})

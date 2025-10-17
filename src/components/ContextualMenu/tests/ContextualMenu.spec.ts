import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import ContextualMenu from '../ContextualMenu.vue'

describe('ContextualMenu', () => {
	it('renders correctly with items', () => {
		const wrapper = mount(ContextualMenu, {
			props: {
				ariaLabel: 'menu contextuel',
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
			props: {
				ariaLabel: 'menu contextuel',
				items: [],
			},
		})

		expect(wrapper.html()).toMatchSnapshot()
	})

	it('emit an update:modelValue event when an item is updated', async () => {
		const wrapper = mount(ContextualMenu, {
			props: {
				ariaLabel: 'menu contextuel',
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
			props: {
				ariaLabel: 'menu contextuel',
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
			props: {
				ariaLabel: 'menu contextuel',
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

	describe('layout', () => {
		it('render correctly with a deepth', () => {
			const wrapper = mount(ContextualMenu, {
				props: {
					ariaLabel: 'menu contextuel',
					items: [
						{
							text: 'Titre 1',
							hash: '#example-1',
							level: 2,
						},
						{
							text: 'Titre 2',
							hash: '#example-2',
							level: 4,
						},
						{
							text: 'Titre 3',
							hash: '#example-3',
							level: 2,
						},
					],
				},
			})

			expect(wrapper.html()).toMatchSnapshot()
		})

		it('render correctly with a deepth', () => {
			const wrapper = mount(ContextualMenu, {
				props: {
					ariaLabel: 'menu contextuel',
					items: [
						{
							text: 'Titre 1',
							hash: '#example-1',
							level: 3,
						},
						{
							text: 'Titre 2',
							hash: '#example-2',
							level: 2,
						},
						{
							text: 'Titre 3',
							hash: '#example-3',
							level: 1,
						},
						{
							text: 'Titre 4',
							hash: '#example-4',
							level: 2,
						},
						{
							text: 'Titre 5',
							hash: '#example-5',
							level: 3,
						},
					],
				},
			})

			expect(wrapper.html()).toMatchSnapshot()
		})

		it('render correctly with a deepth', () => {
			const wrapper = mount(ContextualMenu, {
				props: {
					ariaLabel: 'menu contextuel',
					items: [
						{
							text: 'Titre 1',
							hash: '#example-1',
							level: 1,
						},
						{
							text: 'Titre 2',
							hash: '#example-2',
							level: 3,
						},
						{
							text: 'Titre 3',
							hash: '#example-3',
						},
						{
							text: 'Titre 4',
							hash: '#example-4',
							level: 3,
						},
						{
							text: 'Titre 5',
							hash: '#example-5',
							level: 1,
						},
					],
				},
			})

			expect(wrapper.html()).toMatchSnapshot()
		})

		it('render correctly with a deepth', () => {
			const wrapper = mount(ContextualMenu, {
				props: {
					ariaLabel: 'menu contextuel',
					items: [
						{
							text: 'Titre 1',
							hash: '#example-1',
						},
						{
							text: 'Titre 2',
							hash: '#example-2',
						},
						{
							text: 'Titre 3',
							hash: '#example-3',
							level: 3,
						},
						{
							text: 'Titre 4',
							hash: '#example-4',
							level: 3,
						},
						{
							text: 'Titre 5',
							hash: '#example-5',
							level: 1,
						},
					],
				},
			})

			expect(wrapper.html()).toMatchSnapshot()
		})
	})
})

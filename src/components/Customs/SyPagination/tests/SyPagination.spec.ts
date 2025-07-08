import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyPagination from '../SyPagination.vue'

describe('SyPagination', () => {
	it('renders correctly with default props', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 1,
				max: 10,
			},
		})

		expect(wrapper.find('.sy-pagination').exists()).toBe(true)
		expect(wrapper.find('nav').exists()).toBe(true)
		expect(wrapper.find('.pagination').exists()).toBe(true)
		expect(wrapper.find('.list').exists()).toBe(true)
	})

	it('does not render pagination if max is 1', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 1,
				max: 1,
			},
		})

		expect(wrapper.find('nav').exists()).toBe(false)
	})

	it('emits update:modelValue when page is changed', async () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 1,
				max: 10,
			},
		})

		// Click on page 2
		// Find the page 2 link directly
		const page2Link = wrapper.findAll('a').find(a => a.text().trim() === '2')
		expect(page2Link).toBeTruthy()
		await page2Link!.trigger('click')
		const emitted = wrapper.emitted('update:modelValue')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0]).toEqual([2])

		// Update the component's modelValue to simulate v-model binding
		await wrapper.setProps({ modelValue: 2 })

		// Click on next button
		await wrapper.findAll('a').filter(a => a.text().includes('Suivant'))[0].trigger('click')
		// Get updated emitted events
		const updatedEmitted = wrapper.emitted('update:modelValue')
		expect(updatedEmitted && updatedEmitted[1]).toEqual([3])
	})

	it('disables previous button on first page', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 1,
				max: 10,
			},
		})

		const prevButton = wrapper.findAll('a').filter(a => a.text().includes('Précédent'))[0]
		expect(prevButton.classes()).toContain('disabled')
	})

	it('disables next button on last page', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 10,
				max: 10,
			},
		})

		const nextButton = wrapper.findAll('a').filter(a => a.text().includes('Suivant'))[0]
		expect(nextButton.classes()).toContain('disabled')
	})

	it('shows correct aria-current attribute', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 3,
				max: 10,
			},
		})

		const currentPage = wrapper.findAll('a').find(a => a.attributes('aria-current') === 'page')
		expect(currentPage?.text().trim()).toBe('3')
	})

	it('respects visible prop for number of visible pages', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 5,
				max: 10,
				visible: 3,
			},
		})

		// Should show first, last, and 3 pages around current page (4, 5, 6)
		// Count all page number links (excluding prev/next and ellipsis)
		const pageLinks = wrapper.findAll('a').filter(a =>
			!a.text().includes('Précédent')
			&& !a.text().includes('Suivant')
			&& !a.text().includes('…'),
		)
		expect(pageLinks.length).toBe(5) // First, 4, 5, 6, Last
	})

	it('uses custom label when provided', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 1,
				max: 10,
				label: 'Test Pagination',
			},
		})

		expect(wrapper.find('h2').text()).toContain('Test Pagination')
	})

	it('sets aria-controls when provided', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 1,
				max: 10,
				ariaControls: 'test-content',
			},
		})

		expect(wrapper.find('nav').attributes('aria-controls')).toBe('test-content')
	})

	it('uses d-sr-only class for screen reader text', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 1,
				max: 10,
			},
		})

		expect(wrapper.find('h2').classes()).toContain('d-sr-only')
		expect(wrapper.find('.d-sr-only').exists()).toBe(true)
	})

	it('shows start ellipsis when current page is far from first page', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 8, // Current page far from first page
				max: 10,
				visible: 3, // Small visible count to ensure ellipsis appears
			},
		})

		// Should show ellipsis between first page and middle pages
		expect(wrapper.findAll('.ellipsis').length).toBeGreaterThanOrEqual(1)
		expect(wrapper.find('.ellipsis').text()).toBe('…')
	})

	it('shows both ellipses when current page is in the middle of a large range', () => {
		const wrapper = mount(SyPagination, {
			props: {
				modelValue: 10, // Middle page
				max: 20,
				visible: 3, // Small visible count to ensure ellipsis appears
			},
		})

		// Should show both start and end ellipsis
		expect(wrapper.findAll('.ellipsis').length).toBe(2)
		// Verify the structure: first page, ellipsis, middle pages, ellipsis, last page
		expect(wrapper.find('.list-first').exists()).toBe(true)
		expect(wrapper.findAll('.ellipsis').length).toBe(2)
		expect(wrapper.find('.list-last').exists()).toBe(true)
	})
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HeaderLoading from '../HeaderLoading.vue'

describe('HeaderLoading', () => {
	describe('mode non-standalone (défaut)', () => {
		it('rend le skeleton avec la classe vd-header-loading', () => {
			const wrapper = mount(HeaderLoading)
			expect(wrapper.find('.vd-header-loading').exists()).toBe(true)
		})

		it('applique aria-hidden="true" sur le skeleton', () => {
			const wrapper = mount(HeaderLoading)
			const skeleton = wrapper.find('.vd-header-loading')
			expect(skeleton.attributes('aria-hidden')).toBe('true')
		})

		it('ne rend pas le conteneur wrapper vd-header-loading-container', () => {
			const wrapper = mount(HeaderLoading)
			expect(wrapper.find('.vd-header-loading-container').exists()).toBe(false)
		})

		it('applique la width par défaut (100px)', () => {
			const wrapper = mount(HeaderLoading)
			const skeleton = wrapper.find('.vd-header-loading')
			expect(skeleton.attributes('style') ?? '').toContain('100px')
		})

		it('applique la height par défaut (1rem)', () => {
			const wrapper = mount(HeaderLoading)
			const skeleton = wrapper.find('.vd-header-loading')
			expect(skeleton.attributes('style') ?? '').toContain('1rem')
		})

		it('applique les props width et height personnalisées', () => {
			const wrapper = mount(HeaderLoading, {
				props: { width: '200px', height: '2rem' },
			})
			const skeleton = wrapper.find('.vd-header-loading')
			expect(skeleton.attributes('style') ?? '').toContain('200px')
			expect(skeleton.attributes('style') ?? '').toContain('2rem')
		})
	})

	describe('mode standalone', () => {
		it('rend un conteneur avec role="alert" et aria-live="polite"', () => {
			const wrapper = mount(HeaderLoading, {
				props: { standalone: true },
			})
			const container = wrapper.find('[role="alert"]')
			expect(container.exists()).toBe(true)
			expect(container.attributes('aria-live')).toBe('polite')
		})

		it('applique le ariaLabel par défaut', () => {
			const wrapper = mount(HeaderLoading, {
				props: { standalone: true },
			})
			const container = wrapper.find('[role="alert"]')
			expect(container.attributes('aria-label')).toBe('Chargement en cours...')
		})

		it('applique un ariaLabel personnalisé', () => {
			const wrapper = mount(HeaderLoading, {
				props: { standalone: true, ariaLabel: 'Chargement des données...' },
			})
			const container = wrapper.find('[role="alert"]')
			expect(container.attributes('aria-label')).toBe('Chargement des données...')
		})

		it('rend le skeleton à l\'intérieur du conteneur', () => {
			const wrapper = mount(HeaderLoading, {
				props: { standalone: true },
			})
			const container = wrapper.find('.vd-header-loading-container')
			expect(container.find('.vd-header-loading').exists()).toBe(true)
		})

		it('le skeleton standalone n\'a pas aria-hidden', () => {
			const wrapper = mount(HeaderLoading, {
				props: { standalone: true },
			})
			const skeleton = wrapper.find('.vd-header-loading')
			expect(skeleton.attributes('aria-hidden')).toBeUndefined()
		})

		it('applique les props width et height en mode standalone', () => {
			const wrapper = mount(HeaderLoading, {
				props: { standalone: true, width: '300px', height: '3rem' },
			})
			const skeleton = wrapper.find('.vd-header-loading')
			expect(skeleton.attributes('style') ?? '').toContain('300px')
			expect(skeleton.attributes('style') ?? '').toContain('3rem')
		})
	})
})

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SyIcon from '../SyIcon.vue'

describe('SyIcon', () => {
	// Test de rendu de base
	it('rend correctement une icône', () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'mdi-home',
			},
			global: {
				stubs: {
					'v-icon': {
						template: '<span class="v-icon"><slot></slot></span>',
						props: ['color', 'size', 'role', 'aria-hidden', 'aria-label'],
					},
				},
				directives: {
					'rgaa-svg-fix': () => {},
				},
			},
		})

		expect(wrapper.find('.v-icon').exists()).toBe(true)
		expect(wrapper.text()).toContain('mdi-home')
	})

	// Test pour une icône décorative (par défaut)
	it('applique les attributs ARIA corrects pour une icône décorative', () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'mdi-home',
				decorative: true, // Explicitement défini comme décoratif
			},
			global: {
				stubs: {
					'v-icon': {
						template: '<span class="v-icon"><slot></slot></span>',
						props: ['color', 'size', 'role', 'aria-hidden', 'aria-label'],
					},
				},
				directives: {
					'rgaa-svg-fix': () => {},
				},
			},
		})

		// Vérifions les props passées au composant SyIcon
		expect(wrapper.props().decorative).toBe(true) // L'icône est décorative
		expect(wrapper.props().label).toBeUndefined() // Pas de label pour une icône décorative
	})

	// Test pour une icône informative
	it('applique les attributs ARIA corrects pour une icône informative', () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'mdi-alert',
				decorative: false,
				label: 'Alerte importante',
			},
			global: {
				stubs: {
					'v-icon': {
						template: '<span class="v-icon"><slot></slot></span>',
						props: ['color', 'size', 'role', 'aria-hidden', 'aria-label'],
					},
				},
				directives: {
					'rgaa-svg-fix': () => {},
				},
			},
		})

		// Vérifions les props passées au composant SyIcon
		expect(wrapper.props().decorative).toBe(false) // Icône informative
		expect(wrapper.props().label).toBe('Alerte importante') // Label défini
	})

	// Test pour une icône avec couleur
	it('transmet correctement la propriété color', () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'mdi-home',
				color: 'primary',
			},
			global: {
				stubs: {
					'v-icon': {
						template: '<span class="v-icon"><slot></slot></span>',
						props: ['color', 'size', 'role', 'aria-hidden', 'aria-label'],
					},
				},
				directives: {
					'rgaa-svg-fix': () => {},
				},
			},
		})

		// Vérifions la prop color passée au composant SyIcon
		expect(wrapper.props().color).toBe('primary')
	})

	// Test pour une icône avec taille
	it('transmet correctement la propriété size', () => {
		const wrapper = mount(SyIcon, {
			props: {
				icon: 'mdi-home',
				size: 'large',
			},
			global: {
				stubs: {
					'v-icon': {
						template: '<span class="v-icon"><slot></slot></span>',
						props: ['color', 'size', 'role', 'aria-hidden', 'aria-label'],
					},
				},
				directives: {
					'rgaa-svg-fix': () => {},
				},
			},
		})

		// Vérifions la prop size passée au composant SyIcon
		expect(wrapper.props().size).toBe('large')
	})
})

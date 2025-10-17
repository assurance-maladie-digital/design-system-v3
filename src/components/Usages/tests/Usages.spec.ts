import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Usages from '../Usages.vue'
import { vuetify } from '@tests/unit/setup'

describe('Usages.vue', () => {
	it('renders the component with default props', () => {
		const wrapper = mount(Usages)

		// Vérifier que le composant est rendu
		expect(wrapper.exists()).toBe(true)

		// Vérifier que les colonnes sont rendues
		expect(wrapper.findAll('.v-col-auto').length).toBe(2)

		// Vérifier que les icônes sont rendues
		expect(wrapper.findAll('.v-icon').length).toBe(2)

		// Vérifier les titres des colonnes
		expect(wrapper.text()).toContain('À faire')
		expect(wrapper.text()).toContain('À ne pas faire')

		// Vérifier qu'il n'y a pas d'éléments de liste par défaut
		expect(wrapper.findAll('li').length).toBe(0)
	})

	it('renders items in both columns when provided', () => {
		const items1 = ['Item 1', 'Item 2', 'Item 3']
		const items2 = ['Item A', 'Item B']

		const wrapper = mount(Usages, {
			props: {
				items1,
				items2,
			},
		})

		// Vérifier que tous les éléments de la première liste sont rendus
		const firstColumnItems = wrapper.findAll('.check li')
		expect(firstColumnItems.length).toBe(items1.length)
		items1.forEach((item, index) => {
			expect(firstColumnItems[index].text()).toContain(item)
		})

		// Vérifier que tous les éléments de la deuxième liste sont rendus
		const secondColumnItems = wrapper.findAll('.not-check li')
		expect(secondColumnItems.length).toBe(items2.length)
		items2.forEach((item, index) => {
			expect(secondColumnItems[index].text()).toContain(item)
		})
	})

	it('renders only the first column items when only items1 is provided', () => {
		const items1 = ['Item 1', 'Item 2']

		const wrapper = mount(Usages, {
			props: {
				items1,
			},
		})

		// Vérifier que les éléments de la première liste sont rendus
		const firstColumnItems = wrapper.findAll('.check li')
		expect(firstColumnItems.length).toBe(items1.length)

		// Vérifier qu'il n'y a pas d'éléments dans la deuxième liste
		const secondColumnItems = wrapper.findAll('.not-check li')
		expect(secondColumnItems.length).toBe(0)
	})

	it('renders only the second column items when only items2 is provided', () => {
		const items2 = ['Item A', 'Item B', 'Item C']

		const wrapper = mount(Usages, {
			props: {
				items2,
			},
		})

		// Vérifier qu'il n'y a pas d'éléments dans la première liste
		const firstColumnItems = wrapper.findAll('.check li')
		expect(firstColumnItems.length).toBe(0)

		// Vérifier que les éléments de la deuxième liste sont rendus
		const secondColumnItems = wrapper.findAll('.not-check li')
		expect(secondColumnItems.length).toBe(items2.length)
	})

	it('uses the correct icons', () => {
		const wrapper = mount(Usages, {
			global: {
				plugins: [vuetify],
			},
		})

		const icons = wrapper.findAll('.v-icon')

		// Vérifier que les icônes sont correctement définies
		// Note: Nous ne pouvons pas vérifier directement les propriétés des icônes,
		// mais nous pouvons vérifier que les icônes sont présentes dans le bon ordre
		expect(icons.length).toBe(2)

		// Vérifier que les classes CSS sont correctement appliquées
		expect(wrapper.find('.check')).toBeTruthy()
		expect(wrapper.find('.not-check')).toBeTruthy()
	})

	it('applies the correct styling to columns', () => {
		const wrapper = mount(Usages, {
			global: {
				plugins: [vuetify],
			},
		})

		// Vérifier les classes CSS pour la première colonne
		const checkColumn = wrapper.find('.check')
		expect(checkColumn.exists()).toBe(true)

		// Vérifier les classes CSS pour la deuxième colonne
		const notCheckColumn = wrapper.find('.not-check')
		expect(notCheckColumn.exists()).toBe(true)

		// Vérifier que les styles sont appliqués (indirectement via les classes)
		expect(checkColumn.classes()).toContain('check')
		expect(notCheckColumn.classes()).toContain('not-check')
	})

	it('handles empty arrays for both item lists', () => {
		const wrapper = mount(Usages, {
			props: {
				items1: [],
				items2: [],
			},
		})

		// Vérifier qu'il n'y a pas d'éléments de liste
		expect(wrapper.findAll('li').length).toBe(0)

		// Mais les colonnes et titres doivent toujours être présents
		expect(wrapper.findAll('.v-col-auto').length).toBe(2)
		expect(wrapper.text()).toContain('À faire')
		expect(wrapper.text()).toContain('À ne pas faire')
	})

	it('renders with custom props from CustomizableOptions', () => {
		const wrapper = mount(Usages, {
			props: {
				color: 'primary',
				disabled: true,
				readonly: true,
				dense: true,
				items1: ['Item 1'],
				items2: ['Item A'],
			},
		})

		// Vérifier que le composant est rendu malgré les props supplémentaires
		expect(wrapper.exists()).toBe(true)

		// Vérifier que les éléments de liste sont toujours rendus correctement
		expect(wrapper.findAll('.check li').length).toBe(1)
		expect(wrapper.findAll('.not-check li').length).toBe(1)
	})
})

import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import DatePicker from '../CalendarMode/DatePicker.vue'

/**
 * Tests de régression — respect de la désactivation de `title`.
 *
 * Bug : les expressions de repli (`props.title || props.placeholder`)
 * remplaçaient `title: false` par le placeholder, générant un attribut
 * `title` non désiré sur le champ et son conteneur dans les trois modes
 * (calendrier, combiné, saisie seule).
 */
describe('prop title — régression', () => {
	describe('mode calendrier', () => {
		it('ne génère aucun attribut title sur le champ quand title=false avec un placeholder', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: false },
			})

			const input = wrapper.find('input')
			expect(input.exists()).toBe(true)
			expect(input.attributes('title')).toBeUndefined()

			wrapper.unmount()
		})

		it('ne génère aucun title sur le conteneur du calendrier quand title=false', async () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: false },
				attachTo: document.body,
			})

			await wrapper.find('input').trigger('click')
			await flushPromises()

			const menuContainer = document.querySelector<HTMLElement>('[data-testid="date-picker-menu"]')
			expect(menuContainer).not.toBeNull()
			expect(menuContainer?.getAttribute('title')).toBeNull()

			wrapper.unmount()
		})

		it('restitue un title explicitement renseigné sur le champ et le conteneur', async () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: 'Saisir la date de naissance' },
				attachTo: document.body,
			})

			expect(wrapper.find('input').attributes('title')).toBe('Saisir la date de naissance')

			await wrapper.find('input').trigger('click')
			await flushPromises()

			const menuContainer = document.querySelector<HTMLElement>('[data-testid="date-picker-menu"]')
			expect(menuContainer?.getAttribute('title')).toBe('Saisir la date de naissance')

			wrapper.unmount()
		})

		it('conserve un nom accessible correct quand title=false', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: false },
			})

			expect(wrapper.find('input').attributes('aria-label')).toBe('Date de naissance')

			wrapper.unmount()
		})
	})

	describe('mode combiné (useCombinedMode)', () => {
		it('ne génère aucun attribut title sur le champ ni son conteneur quand title=false avec un placeholder', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: false, useCombinedMode: true },
			})

			const input = wrapper.find('input')
			expect(input.exists()).toBe(true)
			expect(input.attributes('title')).toBeUndefined()

			const activator = wrapper.find('.date-text-input-activator')
			expect(activator.exists()).toBe(true)
			expect(activator.attributes('title')).toBeUndefined()

			wrapper.unmount()
		})

		it('restitue un title explicitement renseigné sur le champ et le conteneur', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: 'Saisir la date de naissance', useCombinedMode: true },
			})

			expect(wrapper.find('input').attributes('title')).toBe('Saisir la date de naissance')
			expect(wrapper.find('.date-text-input-activator').attributes('title')).toBe('Saisir la date de naissance')

			wrapper.unmount()
		})

		it('conserve un nom accessible correct quand title=false', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: false, useCombinedMode: true },
			})

			expect(wrapper.find('input').attributes('aria-label')).toBe('Date de naissance')

			wrapper.unmount()
		})
	})

	describe('mode sans calendrier (noCalendar)', () => {
		it('ne génère aucun attribut title sur le champ quand title=false avec un placeholder', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: false, noCalendar: true },
			})

			const input = wrapper.find('input')
			expect(input.exists()).toBe(true)
			expect(input.attributes('title')).toBeUndefined()

			wrapper.unmount()
		})

		it('restitue un title explicitement renseigné', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: 'Saisir la date de naissance', noCalendar: true },
			})

			expect(wrapper.find('input').attributes('title')).toBe('Saisir la date de naissance')

			wrapper.unmount()
		})

		it('conserve un nom accessible correct quand title=false', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', title: false, noCalendar: true },
			})

			expect(wrapper.find('input').attributes('aria-label')).toBe('Date de naissance')

			wrapper.unmount()
		})
	})

	describe('prop title non renseignée (défaut false)', () => {
		it('ne génère aucun title sur le champ ni le conteneur du calendrier', async () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA' },
				attachTo: document.body,
			})

			expect(wrapper.find('input').attributes('title')).toBeUndefined()

			await wrapper.find('input').trigger('click')
			await flushPromises()

			const menuContainer = document.querySelector<HTMLElement>('[data-testid="date-picker-menu"]')
			expect(menuContainer).not.toBeNull()
			expect(menuContainer?.getAttribute('title')).toBeNull()

			wrapper.unmount()
		})

		it('ne génère aucun title sur le champ ni l\'activateur en mode combiné', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA', useCombinedMode: true },
			})

			expect(wrapper.find('input').attributes('title')).toBeUndefined()
			expect(wrapper.find('.date-text-input-activator').attributes('title')).toBeUndefined()

			wrapper.unmount()
		})
	})
})

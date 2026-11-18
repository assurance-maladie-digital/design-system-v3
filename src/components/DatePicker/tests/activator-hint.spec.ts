import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DatePicker from '../CalendarMode/DatePicker.vue'
import { locales } from '../locales'

/**
 * L'utilisateur doit être averti qu'un élément (le calendrier) va s'afficher
 * à l'activation du champ. L'indice est porté par `aria-describedby` vers un
 * texte sr-only : « Activation ouvre un calendrier ».
 */
describe('annonce « Activation ouvre un calendrier »', () => {
	const describedbyText = (wrapper: ReturnType<typeof mount>) => {
		const input = wrapper.find('input')
		const ids = input.attributes('aria-describedby')?.split(' ').filter(Boolean) ?? []

		return ids
			.map(id => wrapper.find(`[id="${id}"]`).text())
			.join(' ')
	}

	describe('mode calendrier (activateur readonly)', () => {
		it('relie le champ à la description « Activation ouvre un calendrier »', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance' },
			})

			const input = wrapper.find('input')
			expect(input.attributes('aria-describedby')).toBeTruthy()
			expect(describedbyText(wrapper)).toContain(locales.activationOpensCalendar)

			wrapper.unmount()
		})

		it('n\'annonce pas l\'ouverture du calendrier quand le champ est désactivé', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', disabled: true },
			})

			expect(describedbyText(wrapper)).not.toContain(locales.activationOpensCalendar)

			wrapper.unmount()
		})

		it('n\'annonce pas l\'ouverture du calendrier quand le champ est en lecture seule', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', readonly: true },
			})

			expect(describedbyText(wrapper)).not.toContain(locales.activationOpensCalendar)

			wrapper.unmount()
		})
	})

	describe('mode combiné (useCombinedMode)', () => {
		it('enrichit la description de format avec l\'indice d\'ouverture du calendrier', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', useCombinedMode: true },
			})

			const description = describedbyText(wrapper)
			expect(description).toContain(locales.formatHint)
			expect(description).toContain(locales.activationOpensCalendar)

			wrapper.unmount()
		})

		it('n\'ajoute pas l\'indice quand le champ est en lecture seule', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', useCombinedMode: true, readonly: true },
			})

			expect(describedbyText(wrapper)).not.toContain(locales.activationOpensCalendar)

			wrapper.unmount()
		})

		it('n\'ajoute pas l\'indice quand le champ est désactivé', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', useCombinedMode: true, disabled: true },
			})

			expect(describedbyText(wrapper)).not.toContain(locales.activationOpensCalendar)

			wrapper.unmount()
		})
	})

	describe('mode saisie seule (noCalendar)', () => {
		it('n\'annonce pas d\'ouverture de calendrier', () => {
			const wrapper = mount(DatePicker, {
				props: { label: 'Date de naissance', noCalendar: true },
			})

			expect(describedbyText(wrapper)).not.toContain(locales.activationOpensCalendar)

			wrapper.unmount()
		})
	})
})

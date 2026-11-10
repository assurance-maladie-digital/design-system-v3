import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import DatePicker from '../CalendarMode/DatePicker.vue'
import ComplexDatePicker from '../ComplexDatePicker/ComplexDatePicker.vue'
import DateTextInput from '../DateTextInput/DateTextInput.vue'

/**
 * `helpText` est relayé au SyTextField : affiché comme message d'aide quand le champ
 * n'a pas de message, puis sous le champ dès qu'un message d'erreur est présent.
 */
const helpText = 'Jour en 2 chiffres / mois en 2 chiffres / année en 4 chiffres'

const modes = [
	{ name: 'DatePicker (calendrier)', component: DatePicker, props: {} },
	{ name: 'DatePicker (mode combiné)', component: DatePicker, props: { useCombinedMode: true } },
	{ name: 'DatePicker (saisie seule)', component: DatePicker, props: { noCalendar: true } },
	{ name: 'ComplexDatePicker', component: ComplexDatePicker, props: {} },
	{ name: 'DateTextInput', component: DateTextInput, props: {} },
] as const

describe.each(modes)('helpText – $name', ({ component, props }) => {
	it('affiche le texte d\'aide', async () => {
		const wrapper = mount(component, {
			props: { label: 'Date de naissance', helpText, ...props },
		})
		await flushPromises()

		expect(wrapper.find('.v-messages').text()).toContain(helpText)

		wrapper.unmount()
	})

	it('garde le texte d\'aide visible en cas d\'erreur', async () => {
		const wrapper = mount(component, {
			props: {
				label: 'Date de naissance',
				helpText,
				errorMessages: ['La date est invalide'],
				...props,
			},
		})
		await flushPromises()

		expect(wrapper.text()).toContain('La date est invalide')
		expect(wrapper.find('.help-text-below').text()).toBe(helpText)

		wrapper.unmount()
	})

	it('n\'affiche aucun texte d\'aide par défaut', () => {
		const wrapper = mount(component, {
			props: { label: 'Date de naissance', ...props },
		})

		expect(wrapper.find('.help-text-below').exists()).toBe(false)

		wrapper.unmount()
	})
})

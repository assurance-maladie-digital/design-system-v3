import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import DateTextInput from '../DateTextInput.vue'
import ComplexDatePicker from '../../ComplexDatePicker/ComplexDatePicker.vue'
import DatePicker from '../../CalendarMode/DatePicker.vue'

// Régression #2627 : avec `validateWithReturnFormat`, le `validate` des règles personnalisées
// reçoit la saisie au format `dateFormatReturn`, comme le v-model. Sans la prop, rien ne change.

const buildRules = (validate: (value: unknown) => boolean) => [{
	type: 'custom',
	options: { validate, message: 'Les dates en 2024 ne sont pas autorisées' },
}]

const typeAndBlur = async (wrapper: ReturnType<typeof mount>, value: string) => {
	const input = wrapper.find('input')
	await input.setValue(value)
	await input.trigger('blur')
	await flushPromises()
}

describe('validateWithReturnFormat (#2627)', () => {
	const components = [
		['DateTextInput', DateTextInput, {}],
		['ComplexDatePicker', ComplexDatePicker, {}],
		['DatePicker noCalendar', DatePicker, { noCalendar: true }],
		['DatePicker useCombinedMode', DatePicker, { useCombinedMode: true }],
	] as const

	describe.each(components)('%s', (_name, component, modeProps) => {
		it('transmet la saisie au format d\'affichage par défaut (comportement inchangé)', async () => {
			const validate = vi.fn(() => true)
			const wrapper = mount(component, {
				props: { label: 'Date', format: 'DD/MM/YYYY', dateFormatReturn: 'YYYY-MM-DD', customRules: buildRules(validate), ...modeProps },
			})

			await typeAndBlur(wrapper, '07/10/2026')

			expect(validate).toHaveBeenCalledWith('07/10/2026')
			expect(validate).not.toHaveBeenCalledWith('2026-10-07')
			wrapper.unmount()
		})

		it('transmet la saisie au format dateFormatReturn quand validateWithReturnFormat est activé', async () => {
			const validate = vi.fn(() => true)
			const wrapper = mount(component, {
				props: { label: 'Date', format: 'DD/MM/YYYY', dateFormatReturn: 'YYYY-MM-DD', validateWithReturnFormat: true, customRules: buildRules(validate), ...modeProps },
			})

			await typeAndBlur(wrapper, '07/10/2026')

			expect(validate).toHaveBeenCalledWith('2026-10-07')
			expect(validate).not.toHaveBeenCalledWith('07/10/2026')
			wrapper.unmount()
		})
	})

	it('reproduit le scénario de l\'issue : une règle basée sur new Date(value) refuse 2024', async () => {
		const wrapper = mount(DatePicker, {
			props: {
				label: 'Date',
				format: 'DD/MM/YYYY',
				dateFormatReturn: 'YYYY-MM-DD',
				useCombinedMode: true,
				validateWithReturnFormat: true,
				customRules: buildRules(value => !(value && new Date(value as string).getFullYear() === 2024)),
			},
		})

		await typeAndBlur(wrapper, '07/10/2024')
		expect(wrapper.text()).toContain('Les dates en 2024 ne sont pas autorisées')

		await typeAndBlur(wrapper, '07/10/2026')
		expect(wrapper.text()).not.toContain('Les dates en 2024 ne sont pas autorisées')
		wrapper.unmount()
	})

	it('sans dateFormatReturn, validateWithReturnFormat retombe sur le format d\'affichage', async () => {
		const validate = vi.fn(() => true)
		const wrapper = mount(DateTextInput, {
			props: { label: 'Date', format: 'DD/MM/YYYY', validateWithReturnFormat: true, customRules: buildRules(validate) },
		})

		await typeAndBlur(wrapper, '07/10/2026')

		expect(validate).toHaveBeenCalledWith('07/10/2026')
		wrapper.unmount()
	})

	it('transmet chaque borne d\'une plage au format dateFormatReturn', async () => {
		const validate = vi.fn(() => true)
		const wrapper = mount(DateTextInput, {
			props: { label: 'Date', format: 'DD/MM/YYYY', dateFormatReturn: 'YYYY-MM-DD', displayRange: true, validateWithReturnFormat: true, customRules: buildRules(validate) },
		})

		await typeAndBlur(wrapper, '07/10/2026 - 15/10/2026')

		expect(validate).toHaveBeenCalledWith('2026-10-07')
		expect(validate).toHaveBeenCalledWith('2026-10-15')
		wrapper.unmount()
	})
})

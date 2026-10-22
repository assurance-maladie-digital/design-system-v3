import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { CustomRulesReturnFormat } from '../../CalendarMode/validation/Validation.stories'
import type { DatePickerRule } from '../../types'
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

	describe('customWarningRules et customSuccessRules', () => {
		it.each([
			['customWarningRules'],
			['customSuccessRules'],
		])('%s reçoivent la saisie au format dateFormatReturn avec la prop, au format d\'affichage sans', async (ruleProp) => {
			for (const [validateWithReturnFormat, expected] of [[false, '07/10/2026'], [true, '2026-10-07']] as const) {
				const validate = vi.fn(() => true)
				const wrapper = mount(DatePicker, {
					props: {
						label: 'Date',
						format: 'DD/MM/YYYY',
						dateFormatReturn: 'YYYY-MM-DD',
						useCombinedMode: true,
						showSuccessMessages: true,
						validateWithReturnFormat,
						[ruleProp]: buildRules(validate),
					},
				})

				await typeAndBlur(wrapper, '07/10/2026')

				expect(validate).toHaveBeenCalledWith(expected)
				wrapper.unmount()
			}
		})

		it('affiche le message d\'avertissement d\'une règle écrite pour le format dateFormatReturn', async () => {
			const wrapper = mount(DatePicker, {
				props: {
					label: 'Date',
					format: 'DD/MM/YYYY',
					dateFormatReturn: 'YYYY-MM-DD',
					useCombinedMode: true,
					validateWithReturnFormat: true,
					customWarningRules: [{
						type: 'custom',
						options: {
							validate: (value: unknown) => !(typeof value === 'string' && value.startsWith('2024')),
							warningMessage: 'Attention : date en 2024',
						},
					}],
				},
			})

			await typeAndBlur(wrapper, '13/10/2024')

			expect(wrapper.text()).toContain('Attention : date en 2024')
			wrapper.unmount()
		})
	})

	describe('soumission via SyForm en mode combiné', () => {
		const mountInForm = (validate: (value: unknown) => boolean) => {
			const Host = defineComponent({
				components: { DatePicker, SyForm },
				setup() {
					const date = ref<string | null>(null)
					const submitPayload = ref<{ isValid: boolean } | null>(null)
					const customRules: DatePickerRule[] = [{ type: 'custom', options: { validate, message: 'Les dates en 2024 ne sont pas autorisées' } }]
					return {
						date,
						customRules,
						submitPayload,
						handleSubmit: (payload: { isValid: boolean }) => {
							submitPayload.value = payload
						},
					}
				},
				template: `
					<SyForm @submit="handleSubmit">
						<DatePicker
							v-model="date"
							label="Date"
							date-format-return="YYYY-MM-DD"
							validate-with-return-format
							required
							use-combined-mode
							:custom-rules="customRules"
						/>
						<span data-testid="payload">{{ submitPayload ? String(submitPayload.isValid) : '' }}</span>
					</SyForm>
				`,
			})
			return mount(Host)
		}

		// Règle de l'issue #2627 : new Date() accepte la chaîne ISO comme l'objet Date.
		const clientRule = (value: unknown) => !(value && new Date(value as string).getFullYear() === 2024)

		it.each([
			['13/10/2024', 'false', '2024-10-13'],
			['13/10/2026', 'true', '2026-10-13'],
		])('saisie %s : soumission isValid=%s, validate reçoit d\'abord la chaîne au format dateFormatReturn puis un Date', async (typed, expectedValidity, expectedString) => {
			const validate = vi.fn(clientRule)
			const host = mountInForm(validate)

			await typeAndBlur(host, typed)
			validate.mockClear()
			await host.getComponent(SyForm).trigger('submit')
			await flushPromises()

			expect(host.get('[data-testid="payload"]').text()).toBe(expectedValidity)
			const received = validate.mock.calls.map(([value]) => value)
			expect(received[0]).toBe(expectedString)
			expect(received.some(value => value instanceof Date)).toBe(expectedValidity === 'true')
			host.unmount()
		})
	})

	describe('story CustomRulesReturnFormat', () => {
		const storyRules = CustomRulesReturnFormat.args?.customRules as DatePickerRule[]

		const mountStoryField = (validate: ReturnType<typeof vi.fn>, modelValue?: string, extraProps: Record<string, unknown> = {}) => mount(DatePicker, {
			props: {
				...CustomRulesReturnFormat.args,
				...extraProps,
				modelValue,
				customRules: [{ ...storyRules[0]!, options: { ...storyRules[0]!.options, validate } }],
			},
			attachTo: document.body,
		})

		it.each([
			['07/10/2024', true],
			['07/10/2026', false],
		])('saisie clavier %s : erreur affichée = %s', async (typed, hasError) => {
			const validate = vi.fn(storyRules[0]!.options.validate!)
			const wrapper = mountStoryField(validate)

			await typeAndBlur(wrapper, typed)

			expect(wrapper.text().includes('Les dates en 2024 ne sont pas autorisées')).toBe(hasError)
			wrapper.unmount()
		})

		it.each([
			['2024-10-15', true],
			['2026-10-15', false],
		])('sélection calendrier %s (isValidateOnBlur: false) : la règle reçoit un Date, erreur affichée = %s', async (day, hasError) => {
			// Sans isValidateOnBlur, la sélection calendrier valide immédiatement les règles avec un objet Date
			// (ComplexDatePicker : validateCalendarSelection).
			const validate = vi.fn(storyRules[0]!.options.validate!)
			const wrapper = mountStoryField(validate, `${day.slice(0, 8)}01`, { isValidateOnBlur: false })

			await wrapper.find('button.sy-text-field__icon-button').trigger('click')
			await nextTick()
			await flushPromises()
			validate.mockClear()
			document.querySelector<HTMLButtonElement>(`[data-v-date="${day}"] .v-btn`)?.click()
			await flushPromises()

			const dateCall = validate.mock.calls.findIndex(([value]) => value instanceof Date)
			expect(dateCall).toBeGreaterThanOrEqual(0)
			expect(validate.mock.results[dateCall]?.value).toBe(!hasError)
			expect(wrapper.text().includes('Les dates en 2024 ne sont pas autorisées')).toBe(hasError)
			wrapper.unmount()
			document.body.innerHTML = ''
		})
	})
})

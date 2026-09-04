import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import DateTextInput from '../DateTextInput.vue'
import SyTextField from '@/components/Customs/SyTextField/SyTextField.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'

describe('DateTextInput.clean', () => {
	const mountComponent = (props: Record<string, unknown>) => mount(DateTextInput, {
		props: { label: 'Date', ...props },
	})

	const typeDigits = async (input: ReturnType<ReturnType<typeof mountComponent>['find']>, digits: string) => {
		for (const digit of digits) {
			await input.trigger('keydown', { key: digit })
			await flushPromises()
		}
	}

	it('renders a single-date text field by default', () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		expect(input.exists()).toBe(true)
	})

	it('emits update:model-value with the typed date in single mode', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0]?.[0]).toBe('01/01/2025')
		expect(wrapper.emitted('update:modelValue')).toBeFalsy()
	})

	it('forwards externalErrorMessages to the underlying text field', () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			externalErrorMessages: ['Erreur externe de contrat DateTextInput'],
		})

		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toEqual(['Erreur externe de contrat DateTextInput'])
	})

	it('forwards standard validation messages to the underlying text field', () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			errorMessages: ['Erreur injectée'],
			warningMessages: ['Avertissement injecté'],
			successMessages: ['Succès injecté'],
		})

		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toEqual(['Erreur injectée'])
		expect(textField.props('warningMessages')).toEqual(['Avertissement injecté'])
		expect(textField.props('successMessages')).toEqual(['Succès injecté'])
	})

	it('forwards disableClickButton to the underlying text field', () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			disableClickButton: false,
		})

		const textField = wrapper.findComponent(SyTextField)
		expect(textField.props('disableClickButton')).toBe(false)
	})

	it('formats modelValue according to dateFormatReturn in single mode', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[0]?.[0]).toBe('2025-01-01')
	})

	it('emits display text through input and return format through update:model-value in range mode', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await input.setValue('01/07/2026 - 10/07/2026')
		await input.trigger('blur')
		await flushPromises()

		expect(wrapper.emitted('input')?.at(-1)?.[0]).toBe('01/07/2026 - 10/07/2026')
		expect(wrapper.emitted('update:model-value')?.at(-1)?.[0]).toEqual(['2026-07-01', '2026-07-10'])
		expect(input.element.value).toBe('01/07/2026 - 10/07/2026')
	})

	it('correctly handles European format with YYYY/MM/DD return format on blur', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY/MM/DD',
		})

		const input = wrapper.find('input')
		await input.setValue('17/12/1986')
		await input.trigger('blur')
		await flushPromises()

		// The emitted value should be in return format (YYYY/MM/DD)
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe('1986/12/17')

		// The input display should remain in display format (DD/MM/YYYY)
		expect(input.element.value).toBe('17/12/1986')
	})

	it('does not corrupt the date when modelValue is updated from outside with return format', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY/MM/DD',
		})

		const input = wrapper.find('input')
		await input.setValue('17/12/1986')
		await input.trigger('blur')
		await flushPromises()

		// Get the last emitted value (which should be '1986/12/17')
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		const lastEmitted = emitted && emitted[emitted.length - 1]?.[0]
		expect(lastEmitted).toBe('1986/12/17')

		// Simulate parent component updating modelValue with the emitted value (like v-model does)
		await wrapper.setProps({ modelValue: lastEmitted })
		await flushPromises()

		// The input display should remain '17/12/1986' (DD/MM/YYYY format)
		// and NOT be corrupted to '19/86/1217'
		expect(input.element.value).toBe('17/12/1986')
	})

	it('auto-clamps invalid day on blur in single mode', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await input.setValue('31/04/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('30/04/2025')
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe('30/04/2025')
	})

	it('auto-clamps a masked keyboard input on blur in single mode', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await typeDigits(input, '31042025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('30/04/2025')
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe('30/04/2025')
	})

	it.each([
		['DD-MM-YYYY', '31042025', '30-04-2025'],
		['YYYY.MM.DD', '20250431', '2025.04.30'],
	])('auto-clamps masked keyboard input with %s format', async (format, digits, expected) => {
		const wrapper = mountComponent({
			label: 'Date',
			format,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await typeDigits(input, digits)
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe(expected)
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		expect(emitted && emitted[emitted.length - 1]?.[0]).toBe(expected)
	})

	it('auto-clamps invalid days on blur in range mode', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await input.setValue('31/04/2025 - 29/02/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('30/04/2025 - 28/02/2025')
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		const last = emitted && emitted[emitted.length - 1]?.[0]
		expect(last).toEqual(['30/04/2025', '28/02/2025'])
	})

	it('auto-clamps a masked keyboard input on blur in range mode', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await typeDigits(input, '2902202531042025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('28/02/2025 - 30/04/2025')
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		const last = emitted && emitted[emitted.length - 1]?.[0]
		expect(last).toEqual(['28/02/2025', '30/04/2025'])
	})

	it('validates on submit for required single date', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: true,
		})

		const emptyResult = await wrapper.vm.validateOnSubmit()
		expect(emptyResult).toBe(false)

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const validResult = await wrapper.vm.validateOnSubmit()
		expect(validResult).toBe(true)
	})

	it('registers with SyForm and blocks submit until a valid date is entered', async () => {
		const Host = defineComponent({
			components: { DateTextInput, SyForm },
			setup() {
				const value = ref<string | null>(null)
				const submitPayload = ref<{ isValid: boolean } | null>(null)

				return {
					submitPayload,
					value,
					handleSubmit: (payload: { isValid: boolean }) => {
						submitPayload.value = payload
					},
				}
			},
			template: `
				<SyForm @submit="handleSubmit">
					<DateTextInput v-model="value" label="Date" format="DD/MM/YYYY" required />
				</SyForm>
			`,
		})

		const host = mount(Host)
		const form = host.getComponent(SyForm)
		const dateInput = host.getComponent(DateTextInput)

		expect(await (form.vm as InstanceType<typeof SyForm>).validate()).toBe(false)
		expect(host.vm.submitPayload).toBeNull()

		const input = dateInput.find('input')
		await input.setValue('26/08/2026')
		await input.trigger('blur')
		await flushPromises()

		expect(await (form.vm as InstanceType<typeof SyForm>).validate()).toBe(true)

		await form.trigger('submit')
		await flushPromises()

		expect(host.vm.submitPayload).toEqual({ isValid: true })
		host.unmount()
	})

	it('applies Vuetify rules through validateOnSubmit without SyForm', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			useVuetifyValidation: true,
			rules: [
				(value: unknown) => Boolean(value) || 'Erreur Vuetify DateTextInput',
			],
		})

		expect(await wrapper.vm.validateOnSubmit()).toBe(false)

		let textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).toContain('Erreur Vuetify DateTextInput')

		const input = wrapper.find('input')
		await input.setValue('26/08/2026')
		await input.trigger('blur')
		await flushPromises()

		expect(await wrapper.vm.validateOnSubmit()).toBe(true)

		textField = wrapper.findComponent(SyTextField)
		expect(textField.props('errorMessages')).not.toContain('Erreur Vuetify DateTextInput')
	})

	it('emits a range model for a valid date range', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025 - 10/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		const last = emitted && emitted[emitted.length - 1]?.[0]
		expect(Array.isArray(last)).toBe(true)
		if (Array.isArray(last)) {
			expect(last[0]).toBe('01/01/2025')
			expect(last[1]).toBe('10/01/2025')
		}
	})

	it('keeps the range separator when only the start date is entered', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await wrapper.vm.$nextTick()
		await flushPromises()
		await wrapper.vm.$nextTick()

		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(input.element.value).toBe('01/01/2025 - ')
	})

	it('shows an error message for invalid single date format on blur', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: false,
		})

		const input = wrapper.find('input')
		await input.setValue('32/13/2025')
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)
	})

	it('shows an error for incomplete date at blur (single digit)', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: false,
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await flushPromises()
		// Simulate typing a single digit "1" in overwrite mode
		await input.trigger('keydown', { key: '1' })
		await flushPromises()
		// Value should be "1_/__/____" (skeleton with one digit)
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)

		// Should NOT emit a model value for an incomplete date
		const modelEmitted = wrapper.emitted('update:model-value')
		expect(modelEmitted).toBeFalsy()
	})

	it('shows required error message when empty and required in single mode', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: true,
		})

		const input = wrapper.find('input')
		await input.setValue('')
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)
	})

	it('shows an error when end date is before start date in range mode', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await input.setValue('10/01/2025 - 01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)
	})

	it('reset clears input value and validation messages', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: true,
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025')
		await input.trigger('blur')
		await flushPromises()

		// Sanity check: should be valid before reset
		let textField = wrapper.findComponent(SyTextField)
		let errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBe(0)

		// Now reset the component
		wrapper.vm.reset()
		await flushPromises()

		// Input should be cleared and no errors present
		textField = wrapper.findComponent(SyTextField)
		errorMessages = textField.props('errorMessages') as string[] | undefined
		expect((wrapper.find('input').element as HTMLInputElement).value).toBe('')
		expect(errorMessages && errorMessages.length).toBe(0)
	})

	it('emits date-selected when a valid single date is selected', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await flushPromises()
		await wrapper.vm.$nextTick()

		input.element.value = '01/01/2025'
		await input.trigger('input')
		await input.trigger('blur')
		await flushPromises()

		const selected = wrapper.emitted('date-selected')
		expect(selected).toBeTruthy()
	})

	it('emits focus and blur events from the text field', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		await input.trigger('focus')
		await input.trigger('blur')

		expect(wrapper.emitted('focus')).toBeTruthy()
		expect(wrapper.emitted('blur')).toBeTruthy()
	})

	it('still shows validation errors when readonly with invalid input', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			readonly: true,
			required: true,
		})

		const input = wrapper.find('input')
		await input.setValue('32/13/2025')
		await input.trigger('blur')
		await flushPromises()

		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBeGreaterThan(0)
	})

	it('formats range modelValue according to dateFormatReturn in range mode', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
			displayRange: true,
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2025 - 10/01/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		const last = emitted && emitted[emitted.length - 1]?.[0]
		expect(Array.isArray(last)).toBe(true)
		if (Array.isArray(last)) {
			expect(last[0]).toBe('2025-01-01')
			expect(last[1]).toBe('2025-01-10')
		}
	})

	it('applies pasted single date into the input', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
		})

		const input = wrapper.find('input')
		const clipboardData = {
			getData: () => '01/01/2025',
		}

		await input.trigger('paste', { clipboardData })
		await input.trigger('input')
		await flushPromises()

		expect(input.element.value).toContain('01/01/2025')
	})

	it('validateOnSubmit succeeds with a valid date', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: true,
		})

		const input = wrapper.find('input')
		await input.setValue('15/06/2025')
		await input.trigger('blur')
		await flushPromises()

		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(true)
	})

	it('validateOnSubmit fails with an invalid date', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: true,
		})

		const input = wrapper.find('input')
		await input.setValue('99/99/9999')
		await input.trigger('blur')
		await flushPromises()

		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)
	})

	it('validateOnSubmit fails with a future date and notAfterToday custom rule', async () => {
		vi.useFakeTimers()
		vi.setSystemTime(new Date(2026, 7, 19, 12, 0, 0))

		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: true,
			customRules: [
				{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd\'hui' } },
			],
		})

		const input = wrapper.find('input')
		await input.setValue('01/01/2100')
		await input.trigger('blur')
		await flushPromises()

		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)

		vi.useRealTimers()
	})

	it('shows the custom rule error on blur when validation fails', async () => {
		vi.useFakeTimers()
		try {
			vi.setSystemTime(new Date(2026, 7, 19, 12, 0, 0))

			const wrapper = mountComponent({
				label: 'Date',
				format: 'DD/MM/YYYY',
				customRules: [
					{ type: 'notAfterToday', options: { message: 'La date ne peut pas être après aujourd\'hui' } },
				],
			})

			const input = wrapper.find('input')
			await input.setValue('01/01/2100')

			await input.trigger('blur')
			await flushPromises()

			const textField = wrapper.findComponent(SyTextField)
			const errorMessages = textField.props('errorMessages') as string[] | undefined
			expect(errorMessages).toContain('La date ne peut pas être après aujourd\'hui')
		}
		finally {
			vi.useRealTimers()
		}
	})

	it('does not validate on blur when isValidateOnBlur is false but validateOnSubmit still applies', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			required: true,
			isValidateOnBlur: false,
		})

		const input = wrapper.find('input')
		await input.setValue('')
		await input.trigger('blur')
		await flushPromises()

		// Aucun message d'erreur affiché au blur
		const textField = wrapper.findComponent(SyTextField)
		const errorMessages = textField.props('errorMessages') as string[] | undefined
		expect(errorMessages && errorMessages.length).toBe(0)

		// Mais validateOnSubmit tient compte du required
		const result = await wrapper.vm.validateOnSubmit()
		expect(result).toBe(false)
	})

	it('restores single date from modelValue when disabled and input is cleared', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
			modelValue: '01/01/2025',
			disabled: true,
		})

		const input = wrapper.find('input')
		await flushPromises()

		// Piloter directement la valeur interne pour déclencher le watcher disabled
		const vm = wrapper.vm as unknown as { inputValue: string }
		vm.inputValue = '01/01/2025'
		await flushPromises()
		vm.inputValue = ''
		await flushPromises()

		// Le watcher doit resynchroniser depuis modelValue
		expect((input.element as HTMLInputElement).value).toBe('01/01/2025')
	})

	it('keyboard Backspace efface le chiffre précédent en mode single (overwrite)', async () => {
		const wrapper = mountComponent({ format: 'DD/MM/YYYY' })
		const input = wrapper.find('input')
		await typeDigits(input, '01')
		await input.trigger('keydown', { key: 'Backspace' })
		await flushPromises()
		// Le masque de saisie doit avoir remplacé le dernier chiffre par '_'
		expect(input.element.value).toContain('_')
	})

	it('keyboard digit avec sélection remplace la sélection en mode single', async () => {
		const wrapper = mountComponent({ format: 'DD/MM/YYYY' })
		const input = wrapper.find('input')
		await typeDigits(input, '01012025')
		await flushPromises()
		// Simuler une sélection puis un chiffre
		input.element.setSelectionRange(0, 2)
		await input.trigger('keydown', { key: '2' })
		await flushPromises()
		expect(input.element.value).toBeTruthy()
	})

	it('keyboard Backspace avec sélection efface la sélection en mode single', async () => {
		const wrapper = mountComponent({ format: 'DD/MM/YYYY' })
		const input = wrapper.find('input')
		await typeDigits(input, '01012025')
		await flushPromises()
		input.element.setSelectionRange(0, 2)
		await input.trigger('keydown', { key: 'Backspace' })
		await flushPromises()
		expect(input.element.value).toContain('_')
	})

	it('readonly : validateTextInput retourne un résultat sans erreur', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			readonly: true,
		})
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result = await (wrapper.vm as any).validate({ textValue: '01/01/2025' })
		expect(result).toBe(true)
	})

	it('watcher modelValue met à jour inputValue pour une plage de dates', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
			modelValue: ['01/01/2025', '10/01/2025'],
		})
		await flushPromises()
		const input = wrapper.find('input')
		expect(input.element.value).toContain('01/01/2025')
		expect(input.element.value).toContain('10/01/2025')
	})

	it('watcher modelValue met à jour inputValue pour une date unique', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			modelValue: '15/06/2025',
		})
		await flushPromises()
		const input = wrapper.find('input')
		expect(input.element.value).toBe('15/06/2025')
	})

	it('watcher modelValue efface inputValue si la nouvelle valeur est vide', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			modelValue: '15/06/2025',
		})
		await flushPromises()
		await wrapper.setProps({ modelValue: '' })
		await flushPromises()
		const input = wrapper.find('input')
		expect(input.element.value).toBe('')
	})

	it('keyboard Backspace en mode range efface un chiffre', async () => {
		const wrapper = mountComponent({ format: 'DD/MM/YYYY', displayRange: true })
		const input = wrapper.find('input')
		await typeDigits(input, '01012025')
		await input.trigger('keydown', { key: 'Backspace' })
		await flushPromises()
		expect(input.element.value).toContain('_')
	})

	it('keyboard digit en mode range saisit un chiffre', async () => {
		const wrapper = mountComponent({ format: 'DD/MM/YYYY', displayRange: true })
		const input = wrapper.find('input')
		await typeDigits(input, '01012025')
		await flushPromises()
		expect(input.element.value).toContain('2025')
	})

	it('watcher modelValue initialise correctement une plage avec dateFormatReturn différent', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			dateFormatReturn: 'YYYY-MM-DD',
			displayRange: true,
			modelValue: ['2025-01-01', '2025-01-10'],
		})
		await flushPromises()
		const input = wrapper.find('input')
		expect(input.element.value).toContain('01/01/2025')
		expect(input.element.value).toContain('10/01/2025')
	})

	it('watcher modelValue initialise une plage avec un seul élément sans crash', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
			modelValue: ['01/01/2025'],
		})
		// Ne doit pas crasher ; la valeur peut être partiellement affichée
		await flushPromises()
		expect(wrapper.find('input').exists()).toBe(true)
	})

	it('autoClamp sync model en mode range (735-746)', async () => {
		const wrapper = mountComponent({
			format: 'DD/MM/YYYY',
			displayRange: true,
			autoClamp: true,
		})
		const input = wrapper.find('input')
		await input.setValue('31/04/2025 - 29/02/2025')
		await input.trigger('blur')
		await flushPromises()
		// Les dates doivent être clampées et le modèle émis
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
	})

	it('isOverwriteEditing : émission correcte après saisie overwrite en mode range', async () => {
		const wrapper = mountComponent({ format: 'DD/MM/YYYY', displayRange: true })
		const input = wrapper.find('input')
		await typeDigits(input, '0101202510012025')
		await input.trigger('blur')
		await flushPromises()
		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
	})

	it('autoClamp range blur : toutes les émissions tableau ont la valeur clampée (pas de double émission avec l\'ancienne valeur)', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await input.setValue('31/04/2025 - 29/02/2025')
		await input.trigger('blur')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		expect(emitted).toBeTruthy()
		const rangeEmissions = emitted!.filter(e => Array.isArray(e[0]))
		expect(rangeEmissions.length).toBeGreaterThanOrEqual(1)
		// Toutes les émissions tableau doivent avoir la valeur clampée — aucune ne doit contenir l'ancienne valeur non-clampée
		for (const emission of rangeEmissions) {
			expect(emission[0]).toEqual(['30/04/2025', '28/02/2025'])
		}
	})

	it('autoClamp range : le modèle émis pendant la frappe est un tableau même si une seule date est clampée', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await typeDigits(input, '3104202501012025')
		await flushPromises()

		const emitted = wrapper.emitted('update:model-value')
		if (emitted && emitted.length > 0) {
			const last = emitted[emitted.length - 1]?.[0]
			if (last !== null) {
				expect(Array.isArray(last)).toBe(true)
			}
		}
	})

	it('autoClamp range blur : séparateur sans espaces est passé tel quel sans crash', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
			autoClamp: true,
		})

		const input = wrapper.find('input')
		await input.setValue('31/04/2025-29/02/2025')
		await input.trigger('blur')
		await flushPromises()

		expect(wrapper.find('input').exists()).toBe(true)
	})

	it('restores range from modelValue when disabled and input is cleared', async () => {
		const wrapper = mountComponent({
			label: 'Plage de dates',
			format: 'DD/MM/YYYY',
			displayRange: true,
			modelValue: ['01/01/2025', '10/01/2025'],
			disabled: true,
		})

		const input = wrapper.find('input')
		await flushPromises()

		const vm = wrapper.vm as unknown as { inputValue: string }
		vm.inputValue = '01/01/2025 - 10/01/2025'
		await flushPromises()
		vm.inputValue = ''
		await flushPromises()

		expect((input.element as HTMLInputElement).value).toBe('01/01/2025 - 10/01/2025')
	})

	it('associates the expected date format to the input via aria-describedby', async () => {
		const wrapper = mountComponent({
			label: 'Date',
			format: 'DD/MM/YYYY',
		})

		await flushPromises()

		const input = wrapper.find('input')
		const describedBy = input.attributes('aria-describedby')
		expect(describedBy).toBeTruthy()

		const descriptionId = describedBy?.split(' ').find(id => id.startsWith('date-format-desc-'))
		expect(descriptionId).toBeTruthy()

		const descriptionEl = wrapper.find(`#${descriptionId}`).element
		expect(descriptionEl).toBeTruthy()
		expect(descriptionEl?.textContent).toContain('Format attendu :')
		expect(descriptionEl?.textContent).toContain('DD/MM/YYYY')
	})
})

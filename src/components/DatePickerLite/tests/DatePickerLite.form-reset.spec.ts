import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import DatePickerLite from '../DatePickerLite.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { nextTick } from 'vue'

/**
 * Intégration DatePickerLite × SyForm.reset() : la couche validation vide la
 * valeur du champ en écrivant `undefined` dans le ref de validation (le texte
 * brut, cf. v-model:text-value) — le champ doit se vider, que le contenu soit
 * une date parsée ou un texte incomplet qui ne parse jamais.
 */
describe('DatePickerLite form reset (SyForm)', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	const mountInForm = async (template: string, setup?: () => Record<string, unknown>) => {
		const wrapper = mount({
			components: { DatePickerLite, SyForm },
			setup,
			template,
		})
		await nextTick()

		const datePicker = wrapper.findComponent(DatePickerLite)
		const syForm = wrapper.findComponent(SyForm)
		const reset = () => {
			(syForm.vm as unknown as { reset: () => void }).reset()
		}

		return { wrapper, datePicker, reset }
	}

	// SyForm.reset() also triggers Vuetify's native VForm.reset(), which
	// transiently resets the inner VTextField and leaks a `null` through
	// update:modelValue before our own `undefined` clears arrive (pre-existing
	// behavior). Assertions therefore check the first/last emissions, not the
	// exact full sequence.
	it('clears a typed valid date: text, modelValue and exactly one emit per change', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<DatePickerLite label="Début du projet" />
			</SyForm>
		`)

		const input = datePicker.find('input')
		await input.setValue('01/03/2027')

		expect(datePicker.emitted('update:modelValue')).toEqual([[new Date(2027, 2, 1)]])

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		const events = datePicker.emitted('update:modelValue')!
		expect(events.at(0)).toEqual([new Date(2027, 2, 1)])
		expect(events.at(-1)).toEqual([undefined])
	})

	it('clears a typed valid range', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<DatePickerLite
					label="Période"
					mode="range"
				/>
			</SyForm>
		`)

		const input = datePicker.find('input')
		await input.setValue('01/03/2027 - 10/03/2027')
		expect(datePicker.emitted('update:modelValue')?.at(-1)).toEqual([[new Date(2027, 2, 1), new Date(2027, 2, 10)]])

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		expect(datePicker.emitted('update:modelValue')?.at(-1)).toEqual([undefined])
	})

	it('clears incomplete text that never parsed to a Date (regression)', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<DatePickerLite label="Début du projet" />
			</SyForm>
		`)

		const input = datePicker.find('input')
		await input.setValue('25/12/20')

		expect(datePicker.emitted('update:modelValue')).toBeUndefined()

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		// No Date may ever be emitted for unparseable text
		const events = datePicker.emitted('update:modelValue')
		expect(events?.every(([value]) => !(value instanceof Date))).toBe(true)
	})

	it('clears incomplete range text that never parsed to a range', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<DatePickerLite
					label="Période"
					mode="range"
				/>
			</SyForm>
		`)

		const input = datePicker.find('input')
		await input.setValue('01/03/2027 - 10/03')
		expect(datePicker.emitted('update:modelValue')).toBeUndefined()

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		const events = datePicker.emitted('update:modelValue')
		expect(events?.every(([value]) => !Array.isArray(value))).toBe(true)
	})

	it('clears a date provided as initial modelValue prop', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<DatePickerLite label="Début du projet" :model-value="initialDate" />
			</SyForm>
		`, () => ({ initialDate: new Date(2025, 10, 11) }))

		const input = datePicker.find('input')
		expect(input.element.value).toBe('11/11/2025')

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		const events = datePicker.emitted('update:modelValue')!
		expect(events.at(-1)).toEqual([undefined])
	})

	it('clears the validation messages displayed before the reset', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<DatePickerLite
					label="Début du projet"
					:custom-rules="customRules"
				/>
			</SyForm>
		`, () => ({
			customRules: [{
				type: 'custom' as const,
				options: {
					validate: (value: string | undefined) => /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(value ?? ''),
					message: 'Invalid date format. Use DD/MM/YYYY.',
				},
			}],
		}))

		const input = datePicker.find('input')
		await input.trigger('focus')
		await input.setValue('25/12/20')
		await input.trigger('blur')

		expect(datePicker.find('.v-field--error').exists()).toBe(true)

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		expect(datePicker.find('.v-field--error').exists()).toBe(false)
	})
})

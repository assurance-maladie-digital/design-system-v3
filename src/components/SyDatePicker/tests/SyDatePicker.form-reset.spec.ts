import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import SyDatePicker from '../SyDatePicker.vue'
import SyForm from '@/components/Customs/SyForm/SyForm.vue'
import { nextTick } from 'vue'

/**
 * Intégration SyDatePicker × SyForm.reset() : la couche validation vide la
 * valeur du champ en écrivant `undefined` dans le ref de validation (le texte
 * brut, cf. v-model:text-value) — le champ doit se vider, que le contenu soit
 * une date parsée ou un texte incomplet qui ne parse jamais.
 */
describe('SyDatePicker form reset (SyForm)', () => {
	afterEach(() => {
		document.body.innerHTML = ''
	})

	const mountInForm = async (template: string, setup?: () => Record<string, unknown>) => {
		const wrapper = mount({
			components: { SyDatePicker, SyForm },
			setup,
			template,
		})
		await nextTick()

		const datePicker = wrapper.findComponent(SyDatePicker)
		const syForm = wrapper.findComponent(SyForm)
		const reset = () => {
			(syForm.vm as unknown as { reset: () => void }).reset()
		}

		return { wrapper, datePicker, reset }
	}

	// The validation layer clears the field by writing into the validation model, which
	// resets the component to `null` (the model's empty value, Vuetify convention).
	// The Vuetify validation stack is not instantiated in custom mode, so its VForm
	// registration cannot emit a duplicate clear: the exact emission sequence can be asserted.
	it('clears a typed valid date: text, modelValue and exactly one emit per change', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<SyDatePicker label="Début du projet" />
			</SyForm>
		`)

		const input = datePicker.find('input')
		await input.setValue('01/03/2027')

		expect(datePicker.emitted('update:modelValue')).toEqual([[new Date(2027, 2, 1)]])

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		expect(datePicker.emitted('update:modelValue')?.at(-1)).toEqual([null])
	})

	it('clears a typed valid range', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<SyDatePicker
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
		expect(datePicker.emitted('update:modelValue')?.at(-1)).toEqual([null])
	})

	it('clears incomplete text that never parsed to a Date (regression)', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<SyDatePicker label="Début du projet" />
			</SyForm>
		`)

		const input = datePicker.find('input')
		await input.setValue('25/12/20')

		expect(datePicker.emitted('update:modelValue')).toBeUndefined()

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		// Nothing ever parsed: no value may be emitted at all
		expect(datePicker.emitted('update:modelValue')).toEqual([[null]])
	})

	it('clears incomplete range text that never parsed to a range', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<SyDatePicker
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
		// Nothing ever parsed: no value may be emitted at all
		expect(datePicker.emitted('update:modelValue')).toEqual([[null]])
	})

	it('clears a date provided as initial modelValue prop', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<SyDatePicker label="Début du projet" :model-value="initialDate" />
			</SyForm>
		`, () => ({ initialDate: new Date(2025, 10, 11) }))

		const input = datePicker.find('input')
		expect(input.element.value).toBe('11/11/2025')

		reset()
		await nextTick()

		expect(input.element.value).toBe('')
		const events = datePicker.emitted('update:modelValue')!
		expect(events.at(-1)).toEqual([null])
	})

	it('validates a required field on SyForm submission', async () => {
		const { wrapper } = await mountInForm(`
			<SyForm>
				<SyDatePicker label="Début du projet" required />
			</SyForm>
		`)

		const syForm = wrapper.findComponent(SyForm)
		const isValid = await (syForm.vm as unknown as { validate: () => Promise<boolean> }).validate()
		await nextTick()

		expect(isValid).toBe(false)
		expect(wrapper.text()).toContain('Le champ Début du projet est requis.')

		wrapper.unmount()
	})

	it('clears the validation messages displayed before the reset', async () => {
		const { datePicker, reset } = await mountInForm(`
			<SyForm>
				<SyDatePicker
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

import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import DatePicker from '@/components/DatePicker/CalendarMode/DatePicker.vue'
import SyForm from '../SyForm.vue'

const forbidThe15th = [
	{
		type: 'custom',
		options: {
			validate: (value: unknown) => !(value instanceof Date && value.getDate() === 15),
			message: 'Le 15 du mois n\'est pas autorisé',
		},
	},
]

describe('SyForm avec un DatePicker requis', () => {
	// Le mode combiné est couvert par SyForm.datePickerValidity.cy.ts : `setValue` ne passe
	// pas par le masque de saisie du ComplexDatePicker et ne reproduit pas la saisie réelle.
	it.each(['noCalendar'] as const)(
		'actualise la validité à la sortie du champ en mode %s',
		async (mode) => {
			const valid = ref<boolean | null>(null)
			const date = ref<string | null>('')
			const wrapper = mount(defineComponent({
				setup: () => () => h(SyForm, {
					'modelValue': valid.value,
					'onUpdate:modelValue': (value: boolean | null) => { valid.value = value },
				}, () => [
					h(DatePicker, {
						'modelValue': date.value,
						'onUpdate:modelValue': (value: string | string[] | null) => {
							date.value = typeof value === 'string' ? value : null
						},
						'label': 'Date',
						'required': true,
						'format': 'DD/MM/YYYY',
						[mode]: true,
					}),
					h('button', { type: 'submit', disabled: valid.value !== true }, 'Soumettre'),
				]),
			}), { attachTo: document.body })

			const input = wrapper.get('input')
			const button = wrapper.get<HTMLButtonElement>('button[type="submit"]')
			const enterDate = async (value: string) => {
				await input.trigger('focus')
				await input.setValue(value)
				await input.trigger('blur')
				await flushPromises()
			}

			try {
				await flushPromises()
				expect(valid.value).toBeNull()
				expect(button.element.disabled).toBe(true)

				await enterDate('32/11/2026')
				expect(valid.value).toBe(false)
				expect(button.element.disabled).toBe(true)

				await enterDate('30/11/2026')
				expect(date.value).toBe('30/11/2026')
				expect(valid.value).toBe(true)
				expect(button.element.disabled).toBe(false)

				await enterDate('12/11/20')
				expect(valid.value).not.toBe(true)
				expect(button.element.disabled).toBe(true)
			}
			finally {
				wrapper.unmount()
			}
		},
	)

	it('actualise la validité à la sélection en mode calendrier (custom rule)', async () => {
		const valid = ref<boolean | null>(null)
		const date = ref<string | null>('')
		const wrapper = mount(defineComponent({
			setup: () => () => h(SyForm, {
				'modelValue': valid.value,
				'onUpdate:modelValue': (value: boolean | null) => { valid.value = value },
			}, () => [
				h(DatePicker, {
					'modelValue': date.value,
					'onUpdate:modelValue': (value: string | string[] | null) => {
						date.value = typeof value === 'string' ? value : null
					},
					'label': 'Date',
					'required': true,
					'format': 'DD/MM/YYYY',
					'customRules': forbidThe15th,
				}),
				h('button', { type: 'submit', disabled: valid.value !== true }, 'Soumettre'),
			]),
		}), { attachTo: document.body })

		const input = wrapper.get('input')
		const button = wrapper.get<HTMLButtonElement>('button[type="submit"]')
		const selectDay = async (day: string) => {
			await input.trigger('click')
			await nextTick()
			await flushPromises()
			const dayButton = [...document.body.querySelectorAll<HTMLElement>('.v-date-picker-month__day')]
				.find(el => !el.className.includes('--adjacent') && el.textContent?.trim() === day)
				?.querySelector('button')
			expect(dayButton, `jour ${day} introuvable dans le calendrier`).toBeTruthy()
			dayButton?.click()
			await flushPromises()
			await input.trigger('blur')
			await flushPromises()
		}

		try {
			await flushPromises()
			expect(valid.value).toBeNull()
			expect(button.element.disabled).toBe(true)

			await selectDay('15')
			expect(valid.value).toBe(false)
			expect(button.element.disabled).toBe(true)

			await selectDay('14')
			expect(valid.value).toBe(true)
			expect(button.element.disabled).toBe(false)
		}
		finally {
			wrapper.unmount()
		}
	})
})

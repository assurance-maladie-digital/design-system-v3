import { mount, flushPromises, type VueWrapper } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import ComplexDatePicker from '../ComplexDatePicker.vue'
import DateTextInput from '../../DateTextInput/DateTextInput.vue'
import type { DateModelValue } from '@/composables/date/useDateInitializationDayjs'

/**
 * Tests de régression : v-model après effacement partiel d'une date valide.
 *
 * Bug constaté : après avoir saisi une date (ou une plage) valide puis effacé
 * une partie du champ, aucune émission `update:modelValue` n'avait lieu — le
 * v-model conservait la date périmée alors que la saisie affichée était
 * incomplète. Le modèle doit repasser à `null` (cohérent avec le mode plage,
 * cf. `clearRangeSelection`) sans effacer le texte en cours de saisie.
 */
const mountWithModel = (
	component: typeof ComplexDatePicker | typeof DateTextInput,
	extraProps: Record<string, unknown> = {},
) => {
	const wrapper = mount(component, {
		props: {
			'modelValue': '',
			'label': 'Date',
			'format': 'DD/MM/YYYY',
			...extraProps,
			'onUpdate:modelValue': (value: DateModelValue) => wrapper.setProps({ modelValue: value }),
		},
		attachTo: document.body,
	})
	return wrapper as VueWrapper & { props: (key: 'modelValue') => DateModelValue }
}

describe('Régression : v-model après effacement partiel d\'une date valide', () => {
	it('émet null en mode combiné quand une date valide est partiellement effacée', async () => {
		const wrapper = mountWithModel(ComplexDatePicker)
		const input = wrapper.find('input')

		await input.setValue('22/12/2555')
		await flushPromises()
		expect(wrapper.props('modelValue')).toBe('22/12/2555')

		await input.setValue('22/12/255')
		await flushPromises()

		expect(wrapper.props('modelValue')).toBe(null)
		// Le texte en cours de saisie n'est pas effacé
		expect((input.element as HTMLInputElement).value).toBe('22/12/255_')

		wrapper.unmount()
	})

	it('émet la nouvelle date quand la saisie redevient complète', async () => {
		const wrapper = mountWithModel(ComplexDatePicker)
		const input = wrapper.find('input')

		await input.setValue('22/12/2555')
		await flushPromises()
		await input.setValue('22/12/255')
		await flushPromises()

		await input.setValue('23/12/2555')
		await flushPromises()

		expect(wrapper.props('modelValue')).toBe('23/12/2555')

		wrapper.unmount()
	})

	it('émet null en mode noCalendar quand une date valide est partiellement effacée', async () => {
		const wrapper = mountWithModel(DateTextInput)
		const input = wrapper.find('input')

		await input.setValue('22/12/2555')
		await flushPromises()
		expect(wrapper.props('modelValue')).toBe('22/12/2555')

		await input.setValue('22/12/255')
		await flushPromises()

		expect(wrapper.props('modelValue')).toBe(null)
		expect((input.element as HTMLInputElement).value).toBe('22/12/255_')

		wrapper.unmount()
	})

	it('n\'émet pas de null parasite pendant la frappe initiale d\'une date incomplète', async () => {
		const wrapper = mountWithModel(ComplexDatePicker)
		const input = wrapper.find('input')

		await input.setValue('22/12/2')
		await flushPromises()

		expect(wrapper.props('modelValue')).toBe('')
		expect(wrapper.emitted('update:modelValue') ?? []).toEqual([])

		wrapper.unmount()
	})

	it('n\'émet qu\'un seul update:modelValue null quand le consommateur ne réécrit pas la prop', async () => {
		// Consommateur « listener only » : la prop modelValue reste périmée après
		// l'émission, donc la déduplication sur props.modelValue seule ne suffit pas.
		const wrapper = mount(ComplexDatePicker, {
			props: {
				modelValue: '22/12/2555',
				label: 'Date',
				format: 'DD/MM/YYYY',
			},
			attachTo: document.body,
		})
		const input = wrapper.find('input')
		await flushPromises()

		await input.setValue('22/12/255')
		await flushPromises()

		expect(wrapper.emitted('update:modelValue')).toEqual([[null]])

		wrapper.unmount()
	})

	it('émet null au backspace clavier quand une date valide est partiellement effacée', async () => {
		const wrapper = mountWithModel(ComplexDatePicker, { modelValue: '22/12/2555' })
		const input = wrapper.find('input')
		await flushPromises()
		const el = input.element as HTMLInputElement

		el.focus()
		el.setSelectionRange(el.value.length, el.value.length)
		await input.trigger('keydown', { key: 'Backspace' })
		await flushPromises()

		expect(wrapper.props('modelValue')).toBe(null)
		expect(el.value).toBe('22/12/255_')

		wrapper.unmount()
	})
})

describe('Régression : v-model après effacement partiel d\'une plage valide', () => {
	it('émet null en mode combiné quand la date de fin est partiellement effacée', async () => {
		const wrapper = mountWithModel(ComplexDatePicker, { displayRange: true })
		const input = wrapper.find('input')

		await input.setValue('22/12/2555 - 10/01/2026')
		await flushPromises()
		expect(wrapper.props('modelValue')).toHaveLength(2)

		await input.setValue('22/12/2555 - 10/01/202_')
		await flushPromises()

		expect(wrapper.props('modelValue')).toBe(null)
		expect((input.element as HTMLInputElement).value).toBe('22/12/2555 - 10/01/202_')

		wrapper.unmount()
	})

	it('émet null en mode combiné quand la date de début est partiellement effacée', async () => {
		const wrapper = mountWithModel(ComplexDatePicker, { displayRange: true })
		const input = wrapper.find('input')

		await input.setValue('22/12/2555 - 10/01/2026')
		await flushPromises()
		expect(wrapper.props('modelValue')).toHaveLength(2)

		await input.setValue('22/12/255_ - 10/01/2026')
		await flushPromises()

		expect(wrapper.props('modelValue')).toBe(null)
		expect((input.element as HTMLInputElement).value).toBe('22/12/255_ - 10/01/2026')

		wrapper.unmount()
	})

	it('émet la nouvelle plage quand la saisie redevient complète', async () => {
		const wrapper = mountWithModel(ComplexDatePicker, { displayRange: true })
		const input = wrapper.find('input')

		await input.setValue('22/12/2555 - 10/01/2026')
		await flushPromises()
		await input.setValue('22/12/2555 - 10/01/202_')
		await flushPromises()

		await input.setValue('22/12/2555 - 10/01/2027')
		await flushPromises()

		expect(wrapper.props('modelValue')).toEqual(
			expect.arrayContaining(['22/12/2555', '10/01/2027']),
		)

		wrapper.unmount()
	})

	it('émet null en mode noCalendar quand la date de fin est partiellement effacée', async () => {
		const wrapper = mountWithModel(DateTextInput, {
			displayRange: true,
			modelValue: ['22/12/2555', '10/01/2026'],
		})
		const input = wrapper.find('input')
		await flushPromises()

		await input.setValue('22/12/2555 - 10/01/202_')
		await flushPromises()

		expect(wrapper.props('modelValue')).toBe(null)
		expect((input.element as HTMLInputElement).value).toBe('22/12/2555 - 10/01/202_')

		wrapper.unmount()
	})

	it('n\'émet pas de modèle scalaire quand la première borne est complétée à la frappe', async () => {
		const wrapper = mountWithModel(ComplexDatePicker, { displayRange: true })
		const input = wrapper.find('input')

		// La frappe de la première borne formate en « 22/12/2555 - » : plage incomplète
		await input.setValue('22/12/2555')
		await flushPromises()

		expect((input.element as HTMLInputElement).value).toBe('22/12/2555 - ')
		// Ni modèle scalaire transitoire, ni date-selected : la plage n'est pas complète
		expect(wrapper.emitted('update:modelValue') ?? []).toEqual([])
		expect(wrapper.emitted('date-selected') ?? []).toEqual([])
		expect(wrapper.props('modelValue')).toBe('')

		// La complétion de la plage émet le tableau attendu, sans scalaire intermédiaire
		await input.setValue('22/12/2555 - 10/01/2026')
		await flushPromises()

		expect(wrapper.props('modelValue')).toEqual(
			expect.arrayContaining(['22/12/2555', '10/01/2026']),
		)
		const modelEvents = (wrapper.emitted('update:modelValue') ?? []).map(event => event[0])
		expect(modelEvents).not.toContain('22/12/2555')

		wrapper.unmount()
	})

	it('émet null au backspace clavier sans ressusciter l\'ancienne plage', async () => {
		const wrapper = mountWithModel(ComplexDatePicker, {
			displayRange: true,
			modelValue: ['22/12/2025', '10/01/2026'],
		})
		const input = wrapper.find('input')
		await flushPromises()
		const el = input.element as HTMLInputElement

		el.focus()
		el.setSelectionRange(el.value.length, el.value.length)
		await input.trigger('keydown', { key: 'Backspace' })
		await flushPromises()

		expect(el.value).toBe('22/12/2025 - 10/01/202_')
		expect(wrapper.props('modelValue')).toBe(null)
		// Aucune réémission de la plage périmée ni de date-selected après le null
		expect(wrapper.emitted('update:modelValue')).toEqual([[null]])
		expect(wrapper.emitted('date-selected') ?? []).toEqual([])

		wrapper.unmount()
	})
})
